import test from "node:test";
import assert from "node:assert/strict";
import {
  projectId,
  workspaceId,
  domainName,
  migrationDocuments,
  planWrites,
  applyWrites,
  authPatch,
  publicEnvironment,
  digest,
} from "../scripts/firebase-setup-core.mjs";
const str = (stringValue) => ({ stringValue });
const obj = (fields) => ({ mapValue: { fields } });
const snapshot = (documents) => ({
  version: 1,
  sourceProject: "source-project",
  workspace: "lifeskills-test",
  documents,
});
const old = "artifacts/lifeskills-test/public/data/";
const modern = "workspaces/lifeskills-test/materials/";

test("identifiers cannot inject paths, shell fragments or URLs", () => {
  assert.equal(projectId("my-school-123"), "my-school-123");
  for (const value of ["a", "../evil", "a;echo hacked", "UPPER-project"])
    assert.throws(() => projectId(value));
  assert.throws(() => workspaceId("../private"));
  assert.equal(domainName("APP.SCUOLA.IT"), "app.scuola.it");
  for (const value of ["https://a.it", "a.it/path", "a.it:443", "a.it\nxxx"])
    assert.throws(() => domainName(value));
});
test("legacy archive becomes sections, preserving image Base64 and excluding PIN", () => {
  const source = snapshot([
    {
      path: old + "lifeskills/main_db",
      fields: {
        teacher_pin_hash: str("secret"),
        emotions: { arrayValue: { values: [str("a")] } },
        visual_metaphors: obj({
          customImageId: str("pic"),
          src: str("custom:pic"),
        }),
      },
    },
    {
      path: old + "custom_metaphor_images/pic",
      fields: { dataUrl: str("data:image/png;base64,AAA") },
    },
    { path: "teachers/old-uid", fields: { enabled: { booleanValue: true } } },
    { path: "sessions/ABCDEF", fields: { active: { booleanValue: true } } },
  ]);
  const docs = migrationDocuments(source, "target-project");
  assert.equal(docs.length, 3);
  assert.ok(docs.some((d) => d.path === modern + "emotions"));
  assert.ok(!JSON.stringify(docs).includes("secret"));
  assert.ok(!docs.some((d) => d.path.startsWith("sessions/")));
  assert.equal(
    docs.find((d) => d.path.endsWith("/pic")).fields.dataUrl.stringValue,
    "data:image/png;base64,AAA",
  );
});
test("v2 tombstones win over legacy material and prevent deleted data resurrection", () => {
  const docs = migrationDocuments(
    snapshot([
      {
        path: old + "lifeskills/main_db",
        fields: { emotions: str("old"), other: str("legacy") },
      },
      {
        path: modern + "emotions",
        fields: { deleted: { booleanValue: true } },
      },
    ]),
    "target-project",
  );
  assert.equal(docs.length, 1);
  assert.equal(docs[0].fields.deleted.booleanValue, true);
});
test("missing cloud image blocks migration", () => {
  assert.throws(
    () =>
      migrationDocuments(
        snapshot([
          {
            path: old + "lifeskills/main_db",
            fields: {
              visual_metaphors: obj({ customImageId: str("missing") }),
            },
          },
        ]),
        "target-project",
      ),
    /immagini/,
  );
});
test("same project migration and reference remapping preserve values", () => {
  const source = snapshot([
    {
      path: modern + "x",
      fields: {
        value: {
          referenceValue:
            "projects/source-project/databases/(default)/documents/a/b",
        },
      },
    },
  ]);
  assert.match(
    migrationDocuments(source, "target-project")[0].fields.value.referenceValue,
    /projects\/target-project\//,
  );
  assert.match(
    migrationDocuments(source, "source-project")[0].fields.value.referenceValue,
    /projects\/source-project\//,
  );
});
test("preflight detects all conflicts before any writes", async () => {
  const docs = [
    { path: "a", fields: { x: str("new") } },
    { path: "b", fields: { x: str("same") } },
  ];
  const plan = await planWrites(docs, async (path) => ({
    fields: { x: str(path === "a" ? "old" : "same") },
  }));
  assert.deepEqual(plan.conflicts, ["a"]);
  assert.deepEqual(plan.identical, ["b"]);
  let writes = 0;
  await assert.rejects(() =>
    applyWrites(
      plan,
      async () => writes++,
      async () => null,
    ),
  );
  assert.equal(writes, 0);
});
test("copy verifies content, supports resume and lost success responses", async () => {
  const db = new Map();
  const doc = { path: "a", fields: { x: str("one") } };
  const read = async (path) => db.get(path) || null;
  const plan = await planWrites([doc], read);
  await applyWrites(
    plan,
    async (d) => {
      db.set(d.path, d);
      throw new Error("response lost");
    },
    read,
  );
  assert.deepEqual((await planWrites([doc], read)).identical, ["a"]);
  await assert.rejects(
    () =>
      applyWrites(
        { create: [doc], conflicts: [] },
        async () => {},
        async () => null,
      ),
    /Verifica/,
  );
});
test("auth patch preserves existing authorized domains and limits changes", () => {
  const patch = authPatch(
    {
      authorizedDomains: ["old.it", "localhost"],
      signIn: { phoneNumber: { enabled: true } },
    },
    ["new.it", "old.it"],
  );
  assert.deepEqual(patch.authorizedDomains, ["old.it", "localhost", "new.it"]);
  assert.equal(patch.signIn.anonymous.enabled, true);
  assert.equal(patch.signIn.email.passwordRequired, true);
  assert.ok(!("phoneNumber" in patch.signIn));
});
test("frontend config contains only public fields and rejects interpolation", () => {
  const sdk = {
    apiKey: "public-key",
    authDomain: "p.firebaseapp.com",
    projectId: "target-project",
    appId: "web:123",
    password: "DO-NOT-INCLUDE",
  };
  const env = publicEnvironment(sdk, "lifeskills-test");
  assert.ok(!env.includes("DO-NOT-INCLUDE"));
  assert.ok(env.includes('VITE_USE_EMULATORS="false"'));
  assert.throws(() =>
    publicEnvironment({ ...sdk, apiKey: "a\nPASSWORD=bad" }, "test"),
  );
  assert.throws(() =>
    publicEnvironment({ ...sdk, apiKey: "$(command)" }, "test"),
  );
});
test("digest is independent of JSON object key ordering", () => {
  assert.equal(
    digest({ b: 2, a: { z: 1, y: 3 } }),
    digest({ a: { y: 3, z: 1 }, b: 2 }),
  );
});
