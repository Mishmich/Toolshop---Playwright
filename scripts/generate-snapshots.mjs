#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const imageName = 'pst-pw-test-snapshots';
const dockerCommand = process.platform === 'win32' ? 'docker.exe' : 'docker';

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, CI: '1' },
  });

  if (result.error) {
    console.error(`Failed to run ${command}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const dockerRoot = repoRoot.replace(/\\/g, '/');

console.log('Building Docker image for snapshot generation...');
run(dockerCommand, ['build', '-t', imageName, '.']);

console.log('Generating Playwright snapshots inside Docker...');
run(dockerCommand, [
  'run',
  '--rm',
  '-v',
  `${dockerRoot}:/app`,
  '-w',
  '/app',
  imageName,
  'npx',
  'playwright',
  'test',
  'tests/UI',
  '--update-snapshots',
]);

console.log('Snapshots were generated in the workspace and should now be usable on both Windows and Linux.');
