// @vitest-environment node
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
// @ts-expect-error The package build helper is authored as a native Node ESM script.
import { aggregateStyles, stripCssImports } from '../scripts/css-artifacts.mjs';

const fixtures: string[] = [];
afterEach(async () => {
  await Promise.all(fixtures.splice(0).map(path => rm(path, { recursive: true, force: true })));
});

describe('server-safe package build artifacts', () => {
  it('imports emitted ESM in Node without asking Node to load CSS', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'cfui-ssr-'));
    fixtures.push(directory);
    await writeFile(join(directory, 'dep.mjs'), 'export const answer = 42;\n');
    const source = '"use client";\nimport "./missing-widget.css";\nimport { answer } from "./dep.mjs";\nexport { answer };\n';
    const stripped = stripCssImports(source);
    await writeFile(join(directory, 'component.mjs'), stripped);
    const url = pathToFileURL(join(directory, 'component.mjs')).href;
    const exported = execFileSync(process.execPath, ['--input-type=module', '-e', `const value = await import(${JSON.stringify(url)}); process.stdout.write(String(value.answer));`], { encoding: 'utf8' });
    expect(exported).toBe('42');
    expect(stripped.split('\n')).toHaveLength(source.split('\n').length);
    expect(stripped).toContain('"use client"');
  });

  it('aggregates family CSS, deduplicates token imports, and retains nested relative asset URLs', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'cfui-css-'));
    fixtures.push(directory);
    const source = join(directory, 'src');
    const output = join(directory, 'dist');
    await mkdir(join(source, 'components/ui'), { recursive: true });
    await mkdir(join(output, 'fonts'), { recursive: true });
    await writeFile(join(output, 'fonts/inter.woff2'), 'retained-font');
    await writeFile(join(source, 'tokens.css'), '.cfui-theme { --cfui-text: #111; }');
    await writeFile(join(source, 'styles.css'), '@import "./tokens.css";\n@import "./components/ui/widget.css";\n@font-face { src: url("./fonts/inter.woff2"); }');
    await writeFile(join(source, 'components/ui/icon.svg'), '<svg/>');
    await writeFile(join(source, 'components/ui/widget.css'), '@import "../../tokens.css";\n.cfui-widget { background: url("./icon.svg?v=1#shape"); }');
    await aggregateStyles(source, output);
    const css = await readFile(join(output, 'styles.css'), 'utf8');
    expect(css.match(/--cfui-text/g)).toHaveLength(1);
    expect(css).not.toContain('@import');
    expect(css).toContain('url("components/ui/icon.svg?v=1#shape")');
    expect(css).toContain('url("fonts/inter.woff2")');
    expect(await readFile(join(output, 'components/ui/icon.svg'), 'utf8')).toBe('<svg/>');
    expect(await readFile(join(output, 'fonts/inter.woff2'), 'utf8')).toBe('retained-font');
  });

  it('rejects bound CSS imports instead of silently breaking the JavaScript contract', () => {
    expect(() => stripCssImports('import classes from "./widget.css";\nexport { classes };')).toThrow('side-effect only');
  });
});
