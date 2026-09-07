import { createHash } from "node:crypto";

export function projectId(value) {
  if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(value))
    throw new Error(
      "Project ID non valido (6–30 lettere minuscole, cifre e trattini).",
    );
  return value;
}
export function workspaceId(value) {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(value))
    throw new Error(
      "Namespace non valido. Usa lettere, cifre, trattini e underscore.",
    );
  return value;
}
export function domainName(value) {
  const name = value.trim().toLowerCase();
  if (!name) return "";
  if (
    !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(
      name,
    )
  )
    throw new Error(
      "Inserisci soltanto il dominio, per esempio app.scuola.it, senza https:// o percorsi.",
    );
  return name;
}
export function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.keys(value)
        .sort()
        .map((k) => JSON.stringify(k) + ":" + canonical(value[k]))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}
export const digest = (value) =>
  createHash("sha256").update(canonical(value)).digest("hex");
export function decode(value) {
  if (!value) return undefined;
  if ("mapValue" in value)
    return Object.fromEntries(
      Object.entries(value.mapValue.fields || {}).map(([k, v]) => [
        k,
        decode(v),
      ]),
    );
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decode);
  if ("nullValue" in value) return null;
  for (const key of [
    "stringValue",
    "booleanValue",
    "timestampValue",
    "referenceValue",
    "bytesValue",
  ])
    if (key in value) return value[key];
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  return value;
}
export function remapReferences(value, source, target) {
  if (Array.isArray(value))
    return value.map((v) => remapReferences(v, source, target));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, v]) => [
      key,
      key === "referenceValue" &&
      typeof v === "string" &&
      v.startsWith(`projects/${source}/`)
        ? v.replace(`projects/${source}/`, `projects/${target}/`)
        : remapReferences(v, source, target),
    ]),
  );
}

/** Generates only teacher materials + permanent images. Sessions/users stay in backup. */
export function migrationDocuments(snapshot, targetProject) {
  projectId(snapshot.sourceProject);
  projectId(targetProject);
  workspaceId(snapshot.workspace);
  if (snapshot.version !== 1 || !Array.isArray(snapshot.documents))
    throw new Error("Formato backup non riconosciuto.");
  const ns = snapshot.workspace;
  const oldPrefix = `artifacts/${ns}/public/data/`;
  const materialsPrefix = `workspaces/${ns}/materials/`;
  const imagesPrefix = `${oldPrefix}custom_metaphor_images/`;
  const result = new Map();
  const main = snapshot.documents.find(
    (d) => d.path === `${oldPrefix}lifeskills/main_db`,
  );
  const modern = snapshot.documents.filter(
    (d) => d.path.startsWith(materialsPrefix) && d.path.split("/").length === 4,
  );
  // v2 is authoritative, including tombstones; never resurrect deleted legacy sections.
  if (modern.length) {
    for (const d of modern)
      result.set(d.path, { path: d.path, fields: d.fields });
  } else if (main) {
    for (const [key, value] of Object.entries(main.fields || {})) {
      if (key === "teacher_pin_hash") continue;
      if (!/^[a-zA-Z0-9_-]+$/.test(key))
        throw new Error(`Sezione non supportata: ${key}`);
      result.set(materialsPrefix + key, {
        path: materialsPrefix + key,
        fields: { value, deleted: { booleanValue: false } },
      });
    }
  }
  for (const d of snapshot.documents) {
    if (d.path.startsWith(imagesPrefix) && d.path.split("/").length === 6)
      result.set(d.path, { path: d.path, fields: d.fields });
  }
  const imageIds = new Set(
    [...result.keys()]
      .filter((p) => p.startsWith(imagesPrefix))
      .map((p) => p.slice(imagesPrefix.length)),
  );
  const referenced = new Set();
  function visit(value) {
    if (typeof value === "string" && value.startsWith("custom:"))
      referenced.add(value.slice(7));
    if (!value || typeof value !== "object") return;
    if (value.customImageId) referenced.add(value.customImageId);
    Object.values(value).forEach(visit);
  }
  for (const d of result.values())
    if (d.path.startsWith(materialsPrefix)) visit(decode(d.fields.value));
  const missing = [...referenced].filter((id) => !imageIds.has(id));
  if (missing.length)
    throw new Error(
      `${missing.length} immagini sono referenziate ma non presenti nel cloud. Sincronizzale dall'app originale o recuperale dal backup prima di migrare. ID: ${missing.slice(0, 5).join(", ")}`,
    );
  return [...result.values()].map((d) => ({
    ...d,
    fields: remapReferences(d.fields, snapshot.sourceProject, targetProject),
  }));
}

export async function planWrites(documents, read) {
  const create = [],
    identical = [],
    conflicts = [];
  for (const d of documents) {
    const existing = await read(d.path);
    if (!existing) create.push(d);
    else if (canonical(existing.fields || {}) === canonical(d.fields || {}))
      identical.push(d.path);
    else conflicts.push(d.path);
  }
  return { create, identical, conflicts };
}

/** Create-only writes + post-read verification make interrupted runs safely resumable. */
export async function applyWrites(plan, write, read) {
  if (plan.conflicts.length)
    throw new Error(
      "La destinazione contiene dati diversi. Nessun documento verrà sovrascritto.",
    );
  for (const d of plan.create) {
    try {
      await write(d);
    } catch (error) {
      // A prior attempt may have committed despite a network timeout.
      const current = await read(d.path);
      if (!current || canonical(current.fields || {}) !== canonical(d.fields))
        throw error;
    }
    const current = await read(d.path);
    if (!current || canonical(current.fields || {}) !== canonical(d.fields))
      throw new Error("Verifica fallita: " + d.path);
  }
  return plan.create.length;
}

export function authPatch(config, domains) {
  return {
    signIn: {
      email: { enabled: true, passwordRequired: true },
      anonymous: { enabled: true },
    },
    authorizedDomains: [
      ...new Set([
        ...(config.authorizedDomains || []),
        ...domains.filter(Boolean),
      ]),
    ],
  };
}

export function publicEnvironment(config, workspace) {
  workspaceId(workspace);
  const pairs = {
    VITE_FIREBASE_API_KEY: config.apiKey,
    VITE_FIREBASE_AUTH_DOMAIN: config.authDomain,
    VITE_FIREBASE_PROJECT_ID: config.projectId,
    VITE_FIREBASE_STORAGE_BUCKET: config.storageBucket || "",
    VITE_FIREBASE_MESSAGING_SENDER_ID: config.messagingSenderId || "",
    VITE_FIREBASE_APP_ID: config.appId,
    VITE_WORKSPACE_ID: workspace,
    VITE_USE_EMULATORS: "false",
  };
  for (const v of Object.values(pairs))
    if (typeof v !== "string" || /[\r\n"`$\\]/.test(v))
      throw new Error("Configurazione frontend non valida.");
  return (
    Object.entries(pairs)
      .map(([k, v]) => `${k}="${v}"`)
      .join("\n") + "\n"
  );
}
