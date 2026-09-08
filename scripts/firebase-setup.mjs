#!/usr/bin/env node
import { createRequire } from "node:module";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { randomUUID } from "node:crypto";
import {
  projectId,
  workspaceId,
  domainName,
  digest,
  migrationDocuments,
  planWrites,
  applyWrites,
  authPatch,
  publicEnvironment,
  canonical,
} from "./firebase-setup-core.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stateDir = join(root, ".firebase-setup");
const require = createRequire(import.meta.url);
const cliFile = require.resolve("firebase-tools/lib/bin/firebase.js");
const cliAuth = require("firebase-tools/lib/auth.js");
const cliVersion = require("firebase-tools/package.json").version;
let muted = false;
const output = new Writable({
  write(chunk, encoding, done) {
    if (!muted) process.stdout.write(chunk, encoding);
    done();
  },
});
const rl = createInterface({
  input: process.stdin,
  output,
  terminal: process.stdout.isTTY,
});
const ask = async (label, def = "") =>
  (await rl.question(`${label}${def ? ` [${def}]` : ""}: `)).trim() || def;
async function secret(label) {
  if (!process.stdin.isTTY)
    throw new Error("Inserisci la password da un terminale interattivo.");
  process.stdout.write(label + ": ");
  muted = true;
  try {
    return await rl.question("");
  } finally {
    muted = false;
    process.stdout.write("\n");
  }
}
async function confirm(label, expected) {
  console.log("\n" + label);
  if ((await ask(`Per procedere scrivi esattamente ${expected}`)) !== expected)
    throw new Error("Operazione annullata.");
}
async function savePrivate(path, data) {
  await fs.mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const tmp = path + ".tmp-" + randomUUID();
  await fs.writeFile(
    tmp,
    typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n",
    { mode: 0o600, flag: "wx" },
  );
  await fs.rename(tmp, path);
}
function command(args, account, project, interactive = false) {
  const flags = [
    ...args,
    ...(account ? ["--account", account] : []),
    ...(project ? ["--project", project] : []),
    ...(interactive ? [] : ["--json", "--non-interactive"]),
  ];
  rl.pause();
  let result;
  try {
    result = spawnSync(process.execPath, [cliFile, ...flags], {
      cwd: root,
      stdio: interactive ? "inherit" : ["ignore", "pipe", "pipe"],
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, FIREBASE_CLI_DISABLE_TELEMETRY: "1" },
    });
  } finally {
    rl.resume();
  }
  if (result.error)
    throw new Error(
      "Impossibile avviare Firebase Tools: " + result.error.message,
    );
  if (result.status !== 0)
    throw new Error(
      `Firebase Tools: ${args[0]} non riuscito (codice ${result.status}). Verifica account, autorizzazioni e progetto nella console Firebase.`,
    );
  if (interactive) return;
  try {
    const value = JSON.parse(result.stdout);
    if (value.status === "error") throw new Error();
    return value.result;
  } catch {
    throw new Error(
      `Risposta inattesa da Firebase Tools (${args[0]}). Versione rilevata: ${cliVersion}.`,
    );
  }
}
async function accountChoice(label) {
  for (;;) {
    const accounts = cliAuth.getAllAccounts();
    console.log("\n" + label);
    accounts.forEach((a, i) => console.log(`${i + 1}. ${a.user.email}`));
    console.log("0. Accedi con un altro account Google");
    const choice = await ask("Scelta", accounts.length ? "1" : "0");
    if (choice === "0") {
      command([accounts.length ? "login:add" : "login"], null, null, true);
      continue;
    }
    const account = accounts[Number(choice) - 1];
    if (account) return account.user.email;
  }
}
function apiFor(email) {
  return async function api(
    url,
    { method = "GET", body, missing = false } = {},
  ) {
    if (
      !/^https:\/\/(firestore|firebase|identitytoolkit|serviceusage|firebasehosting)\.googleapis\.com\//.test(
        url,
      )
    )
      throw new Error("Endpoint API non consentito.");
    const account = cliAuth
      .getAllAccounts()
      .find((a) => a.user.email === email);
    if (!account?.tokens?.refresh_token)
      throw new Error(
        "Sessione Google non disponibile. Esegui nuovamente il login da questa procedura.",
      );
    const tokens = await cliAuth.getAccessToken(account.tokens.refresh_token, [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/firebase",
    ]);
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });
    if (response.status === 404 && missing) return null;
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(
        `Richiesta ${new URL(url).hostname}: HTTP ${response.status} (${json.error?.status || "errore"}). Verifica autorizzazioni, API e configurazione nella console.`,
      );
      error.status = response.status;
      error.configurationMissing = /CONFIGURATION_NOT_FOUND/.test(
        json.error?.message || "",
      );
      throw error;
    }
    return json;
  };
}
const base = (project) =>
  `https://firestore.googleapis.com/v1/projects/${projectId(project)}/databases/(default)/documents`;
const resource = (project, path) =>
  `projects/${project}/databases/(default)/documents/${path}`;
const readDoc = (api, project, path) =>
  api(`${base(project)}/${path}`, { missing: true });
const writeNew = (api, project, d) =>
  api(`${base(project)}:commit`, {
    method: "POST",
    body: {
      writes: [
        {
          update: { name: resource(project, d.path), fields: d.fields },
          currentDocument: { exists: false },
        },
      ],
    },
  });
async function listDocuments(api, project, path) {
  const all = [];
  let token = "";
  do {
    const q = new URLSearchParams({ pageSize: "100", showMissing: "true" });
    if (token) q.set("pageToken", token);
    const result = await api(`${base(project)}/${path}?${q}`);
    all.push(...(result.documents || []));
    token = result.nextPageToken || "";
  } while (token);
  return all;
}
async function collectTree(api, project, path, out) {
  const d = await readDoc(api, project, path);
  if (d) out.set(path, { path, fields: d.fields || {} });
  let token = "";
  do {
    const result = await api(`${base(project)}/${path}:listCollectionIds`, {
      method: "POST",
      body: { pageSize: 100, ...(token ? { pageToken: token } : {}) },
    });
    for (const id of result.collectionIds || [])
      for (const child of await listDocuments(api, project, `${path}/${id}`)) {
        await collectTree(
          api,
          project,
          child.name.split("/documents/")[1],
          out,
        );
      }
    token = result.nextPageToken || "";
  } while (token);
}
async function snapshot(api, project, workspace) {
  projectId(project);
  workspaceId(workspace);
  const out = new Map();
  // Explicit app paths: never export credentials, roles or unrelated applications.
  for (const name of [
    "lifeskills",
    "custom_metaphor_images",
    "feedback_sessions",
  ]) {
    for (const d of await listDocuments(
      api,
      project,
      `artifacts/${workspace}/public/data/${name}`,
    ))
      await collectTree(api, project, d.name.split("/documents/")[1], out);
  }
  await collectTree(api, project, `workspaces/${workspace}`, out);
  for (const d of await listDocuments(api, project, "sessions")) {
    if (d.fields?.appId?.stringValue === workspace)
      await collectTree(api, project, d.name.split("/documents/")[1], out);
  }
  const result = {
    version: 1,
    sourceProject: project,
    workspace,
    createdAt: new Date().toISOString(),
    documents: [...out.values()],
  };
  const file = join(
    stateDir,
    "backups",
    `${project}-${workspace}-${Date.now()}.json`,
  );
  await savePrivate(file, result);
  await savePrivate(file + ".sha256", digest(result) + "\n");
  console.log(`Backup salvato e verificabile: ${file}\nDocumenti: ${out.size}`);
  return { data: result, file };
}
async function poll(api, url) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const result = await api(url);
    if (result.error)
      throw new Error(
        "Operazione cloud non riuscita: " +
          (result.error.status || result.error.code),
      );
    if (result.done) return result.response;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error(
    "Operazione cloud ancora in corso. Attendi qualche minuto e riprendi la procedura.",
  );
}
async function enableApi(api, project, service) {
  const url = `https://serviceusage.googleapis.com/v1/projects/${project}/services/${service}`;
  const current = await api(url);
  if (current.state === "ENABLED") return;
  const result = await api(url + ":enable", { method: "POST", body: {} });
  if (result.name)
    await poll(api, "https://serviceusage.googleapis.com/v1/" + result.name);
}
async function authConfig(api, project) {
  const url = `https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`;
  for (;;) {
    let config;
    try {
      config = await api(url, { missing: true });
    } catch (error) {
      if (!error.configurationMissing) throw error;
    }
    if (config) return config;
    console.log(
      `\nApri https://console.firebase.google.com/project/${project}/authentication e premi "Inizia" per inizializzare Firebase Authentication gratuito.`,
    );
    console.log(
      "Non attivare Identity Platform a pagamento: questa procedura non lo richiede.",
    );
    await confirm(
      "Dopo avere inizializzato Authentication, riprova.",
      "RIPROVA",
    );
  }
}
async function ensureTeacher(api, project, email) {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/projects/${project}`;
  const lookup = await api(endpoint + "/accounts:lookup", {
    method: "POST",
    body: { email: [email] },
  });
  let user = lookup.users?.[0];
  if (!user) {
    let password = await secret("Nuova password docente (minimo 12 caratteri)");
    const repeated = await secret("Ripeti password");
    if (password.length < 12 || password !== repeated)
      throw new Error(
        "Le password non coincidono o sono troppo corte. Nessuna password è stata salvata.",
      );
    const created = await api(endpoint + "/accounts", {
      method: "POST",
      body: { email, password },
    });
    password = "";
    user = { localId: created.localId };
  }
  if (user.disabled)
    throw new Error(
      "L’account docente esistente è disabilitato. Riabilitalo esplicitamente dalla console.",
    );
  if (!user.localId)
    throw new Error("UID docente non restituito dal servizio.");
  const path = `teachers/${user.localId}`;
  const previous = await readDoc(api, project, path);
  if (previous && previous.fields?.enabled?.booleanValue !== true)
    throw new Error(
      "Il docente esiste ma non è abilitato: controlla la scelta dell’account nella console.",
    );
  if (!previous)
    await writeNew(api, project, {
      path,
      fields: { enabled: { booleanValue: true } },
    });
  return user.localId;
}
async function prepare() {
  console.log("\nCONFIGURAZIONE GUIDATA — nessun deploy automatico.");
  const targetAccount = await accountChoice(
    "Account Google che amministrerà la destinazione",
  );
  const target = projectId(
    await ask("Project ID destinazione (non il nome visualizzato)"),
  );
  const create = (await ask("Creare un progetto nuovo? s/n", "n")) === "s";
  const workspace = workspaceId(
    await ask(
      "Namespace dell’archivio (quello attuale, se migri)",
      "lifeskills-default",
    ),
  );
  const region = await ask(
    "Regione per un eventuale nuovo database",
    "europe-west8",
  );
  if (!/^[a-z][a-z0-9-]+$/.test(region)) throw new Error("Regione non valida.");
  const domain = domainName(
    await ask("Dominio personalizzato, oppure Invio per usare web.app"),
  );
  const teacherEmail = await ask("Email dell’account docente da abilitare");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherEmail))
    throw new Error("Email docente non valida.");
  let source = null,
    requestedCopy = false;
  if (
    (await ask(
      "Copiare materiali e immagini da un progetto esistente? s/n",
      create ? "s" : "n",
    )) === "s"
  ) {
    requestedCopy = true;
    const sourceAccount = await accountChoice(
      "Account Google con accesso al progetto di origine",
    );
    const sourceProject = projectId(
      await ask("Project ID origine", create ? "" : target),
    );
    await confirm(
      "Chiudi le attività e sospendi le modifiche nell’app di origine durante backup e migrazione. La procedura non blocca gli altri browser.",
      "BACKUP",
    );
    source = await snapshot(apiFor(sourceAccount), sourceProject, workspace);
  } else if (!create) {
    await confirm(
      "Creo prima una copia di sicurezza dell’archivio esistente. Sospendi le modifiche degli altri docenti.",
      "BACKUP",
    );
    source = await snapshot(apiFor(targetAccount), target, workspace);
  }
  const documents = source ? migrationDocuments(source.data, target) : [];
  if (source && !documents.length) {
    if (requestedCopy)
      throw new Error(
        "Nessun materiale o immagine trovato: verifica il namespace prima di procedere.",
      );
    await confirm(
      "Il namespace indicato non contiene materiali. Prosegui soltanto se vuoi un archivio nuovo e vuoto.",
      `VUOTO ${target}`,
    );
  }
  console.log(
    `\nDestinazione: ${target}\nAccount Google: ${targetAccount}\nNamespace: ${workspace}\nDocente: ${teacherEmail}\nDominio: ${domain || target + ".web.app"}\nDocumenti da confrontare/copiare: ${documents.length}\nCreazione progetto: ${create ? "sì" : "no"}\nRegione (solo se database assente): ${region}\nNessuna attivazione di fatturazione. Nessuna cancellazione. Nessun deploy in questa fase.`,
  );
  await confirm(
    "Questo passaggio configura il progetto e copia soltanto i documenti mancanti.",
    `PREPARA ${target}`,
  );
  await fs.rm(join(stateDir, "ready.json"), { force: true });
  const api = apiFor(targetAccount);
  if (create) {
    const existing = await api(
      `https://firebase.googleapis.com/v1beta1/projects/${target}`,
      { missing: true },
    );
    if (!existing)
      command(
        ["projects:create", target, "--display-name", "Life Skills Suite"],
        targetAccount,
      );
    else
      console.log(
        "Progetto Firebase già esistente: ripresa della configurazione.",
      );
  } else
    await api(`https://firebase.googleapis.com/v1beta1/projects/${target}`);
  for (const service of [
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
  ])
    await enableApi(api, target, service);
  const database = await api(
    `https://firestore.googleapis.com/v1/projects/${target}/databases/(default)`,
    { missing: true },
  );
  if (!database)
    command(
      [
        "firestore:databases:create",
        "(default)",
        "--location",
        region,
        "--edition",
        "standard",
      ],
      targetAccount,
      target,
    );
  else
    console.log(
      `Database esistente in ${database.locationId}: la regione non viene modificata.`,
    );
  const apps = await api(
    `https://firebase.googleapis.com/v1beta1/projects/${target}/webApps`,
  );
  let app = (apps.apps || []).find(
    (a) => a.displayName === "Life Skills Suite",
  );
  if (!app) {
    if (apps.apps?.length === 1) app = apps.apps[0];
    else
      app = command(
        ["apps:create", "WEB", "Life Skills Suite"],
        targetAccount,
        target,
      );
  }
  const sdk = await api(
    `https://firebase.googleapis.com/v1beta1/projects/${target}/webApps/${encodeURIComponent(app.appId)}/config`,
  );
  const config = await authConfig(api, target);
  await savePrivate(
    join(stateDir, `auth-before-${target}-${Date.now()}.json`),
    config,
  );
  await api(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${target}/config?updateMask=signIn.email,signIn.anonymous,authorizedDomains`,
    {
      method: "PATCH",
      body: authPatch(config, [
        target + ".web.app",
        target + ".firebaseapp.com",
        domain,
      ]),
    },
  );
  // First compare every destination document; conflicts stop the entire copy.
  const destinationBackup = await snapshot(api, target, workspace);
  const plan = await planWrites(documents, (path) =>
    readDoc(api, target, path),
  );
  await savePrivate(join(stateDir, `migration-plan-${Date.now()}.json`), {
    sourceBackup: source?.file,
    destinationBackup: destinationBackup.file,
    create: plan.create.map((d) => d.path),
    identical: plan.identical,
    conflicts: plan.conflicts,
  });
  if (plan.conflicts.length)
    throw new Error(
      `${plan.conflicts.length} documenti già presenti sono diversi. Nessun materiale sovrascritto. Vedi il piano in .firebase-setup.`,
    );
  const copied = await applyWrites(
    plan,
    (d) => writeNew(api, target, d),
    (path) => readDoc(api, target, path),
  );
  const teacherUid = await ensureTeacher(api, target, teacherEmail);
  const envFile = join(root, "app", ".env.local");
  try {
    await savePrivate(
      join(stateDir, `env-before-${Date.now()}.txt`),
      await fs.readFile(envFile, "utf8"),
    );
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  await savePrivate(envFile, publicEnvironment(sdk, workspace));
  const ready = {
    version: 1,
    target,
    targetAccount,
    workspace,
    domain,
    teacherEmail,
    teacherUid,
    appId: app.appId,
    sourceBackup: source?.file || null,
    destinationBackup: destinationBackup.file,
    migrationVerified: true,
    preparedAt: new Date().toISOString(),
    documents: documents.map((d) => ({
      path: d.path,
      digest: digest(d.fields),
    })),
  };
  await savePrivate(join(stateDir, "ready.json"), ready);
  console.log(
    `\nPREPARAZIONE COMPLETATA: ${copied} documenti copiati, ${plan.identical.length} già identici.\nConfigurazione frontend: app/.env.local\nIl sito e le regole pubblicate non sono stati modificati. Per il rilascio usa la voce 3 del menu.`,
  );
}
async function exportOnly() {
  const account = await accountChoice("Account Google per il backup");
  const project = projectId(await ask("Project ID"));
  const workspace = workspaceId(await ask("Namespace", "lifeskills-default"));
  await confirm(
    "Sospendi le modifiche degli altri docenti per ottenere un backup coerente.",
    "BACKUP",
  );
  await snapshot(apiFor(account), project, workspace);
}
async function customDomain(api, project, domain) {
  if (!domain) return;
  const parent = `https://firebasehosting.googleapis.com/v1beta1/projects/${project}/sites/${project}/customDomains`;
  let data = await api(`${parent}/${domain}`, { missing: true });
  if (!data) {
    try {
      await api(`${parent}?customDomainId=${encodeURIComponent(domain)}`, {
        method: "POST",
        body: {},
      });
    } catch (error) {
      if (error.status !== 409) throw error;
    }
    data = await api(`${parent}/${domain}`, { missing: true });
  }
  await savePrivate(
    join(stateDir, "domain-status.json"),
    data || { pending: true },
  );
  console.log(
    `\nDominio ${domain}: controlla i record richiesti in https://console.firebase.google.com/project/${project}/hosting/sites`,
  );
  if (data?.requiredDnsUpdates)
    console.log(JSON.stringify(data.requiredDnsUpdates, null, 2));
  if (!data)
    console.log(
      "Creazione del dominio ancora in corso: ripeti la voce 4 tra qualche minuto.",
    );
  console.log(
    "I record DNS vanno applicati presso il provider del dominio. Non vengono modificati automaticamente. HTTPS può richiedere tempo dopo la verifica.",
  );
}
async function release() {
  const ready = JSON.parse(
    await fs.readFile(join(stateDir, "ready.json"), "utf8"),
  );
  projectId(ready.target);
  workspaceId(ready.workspace);
  domainName(ready.domain);
  if (ready.version !== 1 || !ready.migrationVerified)
    throw new Error("Configurazione non pronta. Esegui prima la preparazione.");
  const api = apiFor(ready.targetAccount);
  const sdk = await api(
    `https://firebase.googleapis.com/v1beta1/projects/${ready.target}/webApps/${encodeURIComponent(ready.appId)}/config`,
  );
  if (
    (await fs.readFile(join(root, "app", ".env.local"), "utf8")) !==
    publicEnvironment(sdk, ready.workspace)
  )
    throw new Error(
      "La configurazione locale è cambiata. Esegui nuovamente la preparazione.",
    );
  const teacher = await readDoc(
    api,
    ready.target,
    `teachers/${ready.teacherUid}`,
  );
  if (teacher?.fields?.enabled?.booleanValue !== true)
    throw new Error("Account docente non abilitato.");
  for (const d of ready.documents) {
    const current = await readDoc(api, ready.target, d.path);
    if (!current || digest(current.fields) !== d.digest)
      throw new Error(
        "Dati cambiati dopo la preparazione: ripeti il confronto prima del deploy.",
      );
  }
  console.log(
    "\nSe questo indirizzo era già usato, aggiorna nelle impostazioni dell’app la configurazione Firebase salvata nel browser: quella locale ha priorità sulla build. Non cancellare i dati del browser prima di esportare i materiali locali.",
  );
  console.log(
    "\nGenerazione della build e controllo dei materiali prima del rilascio…",
  );
  rl.pause();
  try {
    for (const args of [
      ["--test", "tests/reports.test.mjs", "tests/firebase-setup.test.mjs", "tests/emotionRecognition.test.mjs"],
      ["node_modules/vite/bin/vite.js", "build"],
    ]) {
      const result = spawnSync(process.execPath, args, {
        cwd: root,
        stdio: "inherit",
      });
      if (result.status !== 0)
        throw new Error("Test o build non riusciti: deploy bloccato.");
    }
  } finally {
    rl.resume();
  }
  const site = join(stateDir, "site");
  await fs.rm(site, { recursive: true, force: true });
  await fs.mkdir(site, { recursive: true });
  await fs.cp(join(root, "public"), site, { recursive: true });
  for (const name of [
    "index.html",
    "assets",
    "thermometer",
    "blobtrees",
    "fotolinguaggio",
    "life_skills.png",
    "ruota_.png",
  ]) {
    try {
      await fs.cp(join(root, name), join(site, name), { recursive: true });
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }
  await fs.copyFile(
    join(root, "firestore.rules"),
    join(stateDir, "firestore.rules"),
  );
  const configFile = join(stateDir, "deploy.json");
  await savePrivate(configFile, {
    firestore: { rules: "firestore.rules" },
    hosting: {
      site: ready.target,
      public: "site",
      ignore: ["**/.*", "**/node_modules/**"],
      headers: [
        {
          source: "/index.html",
          headers: [{ key: "Cache-Control", value: "no-cache" }],
        },
      ],
    },
  });
  await savePrivate(join(stateDir, "deployment-summary.json"), {
    project: ready.target,
    account: ready.targetAccount,
    workspace: ready.workspace,
    url: `https://${ready.target}.web.app`,
    domain: ready.domain,
    teacher: ready.teacherEmail,
    buildAt: new Date().toISOString(),
    rulesDigest: digest(
      await fs.readFile(join(root, "firestore.rules"), "utf8"),
    ),
  });
  await confirm(
    `BUILD PRONTA. Verranno pubblicati sito e Security Rules su ${ready.target}, account ${ready.targetAccount}. Le vecchie sessioni non saranno compatibili con le nuove regole. Sospendi l'uso del sito durante il passaggio.`,
    `PUBBLICA ${ready.target}`,
  );
  const sites = await api(
    `https://firebasehosting.googleapis.com/v1beta1/projects/${ready.target}/sites`,
  );
  if (!(sites.sites || []).some((s) => s.name.endsWith("/" + ready.target)))
    command(
      ["hosting:sites:create", ready.target],
      ready.targetAccount,
      ready.target,
    );
  command(
    ["deploy", "--only", "firestore:rules,hosting", "--config", configFile],
    ready.targetAccount,
    ready.target,
    true,
  );
  console.log(
    `\nSito pubblicato: https://${ready.target}.web.app\nProva un accesso docente e una sessione da un browser nuovo prima di distribuirlo alla classe.`,
  );
  await customDomain(api, ready.target, ready.domain);
}
async function main() {
  if (process.argv.includes("--help")) {
    console.log(
      "Configura-Firebase.command: 1 prepara/migra; 2 backup; 3 build e deploy esplicito; 4 stato dominio. Richiede Node 22 e Firebase Tools del progetto. Nessuna operazione cloud con --help.",
    );
    return;
  }
  if (Number(process.versions.node.split(".")[0]) < 22)
    throw new Error("Serve Node.js 22 o successivo.");
  if (
    !cliVersion.startsWith("15.") ||
    !cliAuth.getAllAccounts ||
    !cliAuth.getAccessToken
  )
    throw new Error(
      "Versione Firebase Tools non compatibile. Esegui npm ci usando il lockfile del progetto.",
    );
  console.log(
    `Life Skills Suite — configurazione Firebase (Tools ${cliVersion})\n1. Prepara progetto e migrazione\n2. Crea backup cloud\n3. Verifica build e pubblica progetto preparato\n4. Controlla dominio del progetto preparato`,
  );
  const choice = await ask("Scelta", "1");
  if (choice === "1") await prepare();
  else if (choice === "2") await exportOnly();
  else if (choice === "3") await release();
  else if (choice === "4") {
    const ready = JSON.parse(
      await fs.readFile(join(stateDir, "ready.json"), "utf8"),
    );
    await customDomain(
      apiFor(ready.targetAccount),
      projectId(ready.target),
      domainName(ready.domain),
    );
  } else throw new Error("Scelta non valida.");
}
try {
  await main();
} catch (error) {
  console.error(
    "\n" +
      error.message +
      "\nLa procedura è ripetibile: i documenti identici vengono saltati e quelli diversi non sono sovrascritti.",
  );
  process.exitCode = 1;
} finally {
  rl.close();
}
