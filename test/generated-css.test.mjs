import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(testDir, '..');

function readCssFile(relativePath) {
  return readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function escapeSelector(selector) {
  return selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertRuleContains(css, selector, declarationPattern) {
  const selectorPattern = new RegExp(`${escapeSelector(selector)}\\s*\\{([^}]*)\\}`, 'm');
  const match = css.match(selectorPattern);

  assert.ok(match, `Expected selector ${selector} to exist`);
  assert.match(match[1], declarationPattern, `Expected ${selector} to match ${declarationPattern}`);
}

test('grid.css keeps key column widths and responsive helpers', () => {
  const gridCss = readCssFile('css/grid.css');

  assertRuleContains(gridCss, '.grid.col1-of-2', /width:\s*49\.75%/);
  assertRuleContains(gridCss, '.grid.col3-of-3', /width:\s*100%/);
  assertRuleContains(gridCss, '.no-margin.col1-of-2', /width:\s*50%/);
  assert.match(gridCss, /@media only screen and \(max-width: 650px\)/);
  assertRuleContains(gridCss, '.mq-big.col1-of-4', /width:\s*100%/);
});

test('inputs.css keeps grouped selectors without malformed duplication', () => {
  const inputsCss = readCssFile('css/inputs.css');

  assert.match(inputsCss, /input\[type=email\][^{]*,\s*textarea\s*\{/);
  assert.match(inputsCss, /border-radius:\s*3px/);
  assert.match(inputsCss, /input\[type=email\]:hover[^{]*,\s*textarea\s*\{/);
  assert.doesNotMatch(inputsCss, /\]\s*\ninput\[type=/);
});
