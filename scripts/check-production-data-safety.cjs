const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const roots = ['apps/api/src', 'apps/web/src/app', 'apps/web/src/lib'].map((p) => path.join(root, p));
const forbidden = [
  'https://fosholhaat-api.vercel.app',
  'structuredClone(seed',
  'TR-10492',
  'FH-8492',
  'God Himself',
  'seller-user',
  'buyer-user',
  'hub-user',
  'valid-session-token',
  'DH-METRO',
  'FosholLogistics',
  'Standard Agro Warehouse',
  'Potato Pool #',
  'Onion Bulk #',
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function isAllowed(file) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  return (
    /\.spec\./.test(rel) ||
    /\.test\./.test(rel) ||
    /(^|\/)_view\.tsx$/.test(rel) ||
    /(^|\/)(_?data|.*[.-]data)\.tsx?$/.test(rel)
  );
}

const findings = [];
for (const file of roots.flatMap((r) => walk(r))) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const text = fs.readFileSync(file, 'utf8');
  if (!isAllowed(file)) {
    for (const marker of forbidden) {
      if (text.includes(marker)) findings.push(`${rel}: forbidden marker "${marker}"`);
    }
  }
}

if (findings.length) {
  console.error(findings.join('\n'));
  process.exit(1);
}
console.log('Production data safety check passed.');
