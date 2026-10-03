import { cp, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { aggregateStyles, stripEmittedCssImports } from './css-artifacts.mjs';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));

await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', 'tsconfig.json'], {
  cwd: root,
  stdio: 'inherit',
});
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await stripEmittedCssImports(join(root, 'dist'));

// The stylesheet may use these local font URLs; no remote font request is required.
const interRoot = dirname(require.resolve('@fontsource-variable/inter/package.json'));
await mkdir(join(root, 'dist/fonts'), { recursive: true });
await mkdir(join(root, 'dist/licenses'), { recursive: true });
await cp(join(interRoot, 'files/inter-latin-wght-normal.woff2'), join(root, 'dist/fonts/inter-latin-wght-normal.woff2'));
await cp(join(interRoot, 'LICENSE'), join(root, 'dist/licenses/inter-OFL.txt'));
await aggregateStyles(join(root, 'src'), join(root, 'dist'));
