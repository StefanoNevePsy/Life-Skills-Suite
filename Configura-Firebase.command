#!/bin/bash
set -euo pipefail
cd -- "$(dirname -- "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
finish() { code=$?; if [ "$code" -ne 0 ]; then printf '\nProcedura interrotta. Leggi il messaggio qui sopra.\n'; fi; if [ -t 0 ]; then read -r -p 'Premi Invio per chiudere… ' _; fi; }
trap finish EXIT
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  printf 'Installa Node.js 22 LTS (include npm) da https://nodejs.org, poi riapri questo file.\n'
  exit 1
fi
node -e 'if(Number(process.versions.node.split(".")[0])<22){console.error("Serve Node.js 22 o successivo.");process.exit(1)}'
if [ ! -f node_modules/firebase-tools/lib/bin/firebase.js ]; then
  printf 'Installazione degli strumenti del progetto (npm ci)…\n'
  npm ci
fi
node scripts/firebase-setup.mjs "$@"
