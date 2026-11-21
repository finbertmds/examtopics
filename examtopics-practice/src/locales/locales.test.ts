import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { translations } from './index';

// QA-005: every language has the same keys, and every literal t('key') used in the app exists.
const srcDir = join(__dirname, '..');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

describe('translations', () => {
  it('en, ja and vi define the same keys', () => {
    const en = Object.keys(translations.en).sort();
    expect(Object.keys(translations.ja).sort()).toEqual(en);
    expect(Object.keys(translations.vi).sort()).toEqual(en);
  });

  it('every literal translation key used in src exists in en.json', () => {
    const missing: string[] = [];
    for (const file of sourceFiles(srcDir)) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/\bt\(\s*(['"`])([A-Za-z0-9_.]+)\1/g)) {
        if (!(match[2] in translations.en)) missing.push(`${relative(srcDir, file)}: ${match[2]}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('no translation value is empty', () => {
    for (const [language, values] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(values)) {
        expect(typeof value === 'string' && value.trim().length > 0, `${language}.${key}`).toBe(true);
      }
    }
  });
});
