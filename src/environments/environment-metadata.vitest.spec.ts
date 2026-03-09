import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJsonPath = join(process.cwd(), 'package.json');
const packageJson = JSON.parse(
  readFileSync(packageJsonPath, 'utf-8'),
) as { version: string };

const readEnvironmentFile = (fileName: string) =>
  readFileSync(join(process.cwd(), 'src', 'environments', fileName), 'utf-8');

const readEnvironmentValue = (
  source: string,
  propertyName: 'appVersion' | 'appStage',
): string => {
  const match = source.match(new RegExp(`${propertyName}: '([^']+)'`));

  if (!match) {
    throw new Error(`Missing ${propertyName} in environment source`);
  }

  return match[1];
};

const productionEnvironmentSource = readEnvironmentFile('environment.ts');
const developmentEnvironmentSource = readEnvironmentFile(
  'environment.development.ts',
);
const ciEnvironmentSource = readEnvironmentFile('environment.ci.ts');

describe('Environment metadata', () => {
  it('keeps the app version aligned with package.json in every environment', () => {
    expect(
      readEnvironmentValue(productionEnvironmentSource, 'appVersion'),
    ).toBe(packageJson.version);
    expect(
      readEnvironmentValue(developmentEnvironmentSource, 'appVersion'),
    ).toBe(packageJson.version);
    expect(readEnvironmentValue(ciEnvironmentSource, 'appVersion')).toBe(
      packageJson.version,
    );
  });

  it('uses explicit app stages for each runtime profile', () => {
    expect(readEnvironmentValue(productionEnvironmentSource, 'appStage')).toBe(
      'xVersionEstable',
    );
    expect(readEnvironmentValue(developmentEnvironmentSource, 'appStage')).toBe(
      'xDesarrollo',
    );
    expect(readEnvironmentValue(ciEnvironmentSource, 'appStage')).toBe(
      'xDesarrollo',
    );
  });
});
