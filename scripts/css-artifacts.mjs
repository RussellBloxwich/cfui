import { access, cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';

export function stripCssImports(source, filename = 'component.js') {
  const parsed = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  const removals = [];
  for (const statement of parsed.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    if (!statement.moduleSpecifier.text.endsWith('.css')) continue;
    if (statement.importClause) throw new Error(`CSS imports must be side-effect only: ${filename}`);
    removals.push([statement.getStart(parsed), statement.end]);
  }
  // Keep offsets and line numbers valid for TypeScript's emitted source/declaration maps.
  for (const [start, end] of removals.reverse()) {
    source = source.slice(0, start) + source.slice(start, end).replace(/[^\r\n]/g, ' ') + source.slice(end);
  }
  return source;
}

export async function walkFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files.sort();
}

export async function stripEmittedCssImports(outputRoot) {
  for (const path of await walkFiles(outputRoot)) {
    if (!path.endsWith('.js') && !path.endsWith('.d.ts')) continue;
    const source = await readFile(path, 'utf8');
    const stripped = stripCssImports(source, path);
    if (stripped !== source) await writeFile(path, stripped);
  }
}

const externalReference = value => /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value);
const exists = async path => access(path).then(() => true, () => false);

export async function aggregateStyles(sourceRoot, outputRoot) {
  const visited = new Set();

  async function rebaseUrls(css, sourcePath) {
    const matches = [...css.matchAll(/url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi)];
    for (const match of matches.reverse()) {
      const value = (match[2] ?? match[3]).trim();
      if (!value || externalReference(value)) continue;
      const suffixIndex = value.search(/[?#]/);
      const pathname = suffixIndex < 0 ? value : value.slice(0, suffixIndex);
      const suffix = suffixIndex < 0 ? '' : value.slice(suffixIndex);
      const assetSource = resolve(dirname(sourcePath), decodeURI(pathname));
      const assetRelative = relative(sourceRoot, assetSource);
      if (assetRelative.startsWith(`..${sep}`) || assetRelative === '..') {
        throw new Error(`CSS asset escapes the package source tree: ${value}`);
      }
      const assetDestination = join(outputRoot, assetRelative);
      if (await exists(assetSource)) {
        await mkdir(dirname(assetDestination), { recursive: true });
        await cp(assetSource, assetDestination);
      } else if (!await exists(assetDestination)) {
        throw new Error(`Missing CSS asset ${value} in ${relative(sourceRoot, sourcePath)}`);
      }
      const rewritten = `url(${JSON.stringify(assetRelative.split(sep).join('/') + suffix)})`;
      css = css.slice(0, match.index) + rewritten + css.slice(match.index + match[0].length);
    }
    return css;
  }

  async function inline(path) {
    path = resolve(path);
    if (visited.has(path)) return '';
    visited.add(path);
    const css = await readFile(path, 'utf8');
    const imports = [...css.matchAll(/@import\s+(?:url\(\s*)?(["'])([^"']+)\1\s*\)?\s*;/g)];
    const parts = [];
    let cursor = 0;
    // Rebase each file's own URLs before insertion so nested imports are not rebased twice.
    for (const match of imports) {
      parts.push(await rebaseUrls(css.slice(cursor, match.index), path));
      if (externalReference(match[2])) parts.push(match[0]);
      else {
        const imported = resolve(dirname(path), match[2]);
        const importedRelative = relative(sourceRoot, imported);
        if (importedRelative.startsWith(`..${sep}`) || importedRelative === '..') {
          throw new Error(`CSS import escapes the package source tree: ${match[2]}`);
        }
        parts.push(await inline(imported));
      }
      cursor = match.index + match[0].length;
    }
    parts.push(await rebaseUrls(css.slice(cursor), path));
    return parts.join('');
  }

  const styles = (await walkFiles(sourceRoot)).filter(path => extname(path) === '.css');
  const main = join(sourceRoot, 'styles.css');
  const chunks = [];
  // Tokens/root styles precede independent family styles deterministically.
  for (const path of [main, ...styles.filter(path => path !== main)]) {
    const css = await inline(path);
    if (css.trim()) chunks.push(`/* ${relative(sourceRoot, path).split(sep).join('/')} */\n${css}`);
  }
  await mkdir(outputRoot, { recursive: true });
  await writeFile(join(outputRoot, 'styles.css'), chunks.join('\n\n') + '\n');
}
