import * as fs from 'fs';
import * as path from 'path';
import { esAR } from '../src/app/shared/translate/i18n/es-AR';

const projectDir = './src';

function getAllFiles(dir: string): string[] {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let all: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      all = all.concat(getAllFiles(fullPath));
    } else {
      all.push(fullPath);
    }
  }

  return all;
}

function extractKeysFromContent(content: string): string[] {
  const foundKeys: string[] = [];
  let match;

  const tsRegex = /['"`](x[A-Z][^'"`]*)['"`]/g;
  while ((match = tsRegex.exec(content)) !== null) {
    foundKeys.push(match[1]);
  }

  const htmlRegex = /\{\{\s*['"`](x[A-Z][^'"`]*)['"`]\s*\|\s*translate\s*\}\}/g;
  while ((match = htmlRegex.exec(content)) !== null) {
    foundKeys.push(match[1]);
  }

  return foundKeys;
}

function checkMissingKeys() {
  const allFiles = getAllFiles(projectDir)
    .filter((f) => f.endsWith('.ts') || f.endsWith('.html'))
    .filter((f) => !f.includes('/shared/translate/'));

  const usedKeys: Record<string, boolean> = {};

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const keys = extractKeysFromContent(content);
    for (const key of keys) {
      usedKeys[key] = true;
    }
  }

  const definedKeys = Object.keys(esAR);
  const missingKeys = Object.keys(usedKeys).filter(
    (key) => !definedKeys.includes(key),
  );

  if (missingKeys.length === 0) {
    console.log('✅ No hay claves faltantes en es-AR');
  } else {
    console.log(
      `❌ ${missingKeys.length} claves usadas pero NO definidas en es-AR:`,
    );
    console.log(missingKeys.join('\n'));
  }
}

checkMissingKeys();

try {
  fs.unlinkSync(path.resolve('./src/app/shared/translate/i18n/es-AR.js'));
} catch {}

try {
  fs.unlinkSync(path.resolve('./scripts/check-missing-keys.js'));
} catch {}
