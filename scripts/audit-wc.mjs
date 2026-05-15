/**
 * Web component audit script — compares Angular vs WC stories visually.
 * Run: node scripts/audit-wc.mjs
 * Output: audit-wc/ directory with paired screenshots.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE = 'http://localhost:6006/iframe.html?viewMode=story&id=';
const OUT = new URL('../audit-wc/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
mkdirSync(OUT, { recursive: true });

// [name, angularId, wcId]
const PAIRS = [
  ['heading',        'typography-heading--all-headings',                 'web-components-typography-heading--all-headings'],
  ['text',           'typography-text--all-variants',                    'web-components-typography-text--all-variants'],
  ['accessible-text','typography-accessibletext--all-roles',             'web-components-typography-accessibletext--all-roles'],
  ['article',        'typography-article--default',                      'web-components-typography-article--serif'],
  ['badge',          'components-badge--all-variants',                   'web-components-badge--all-variants'],
  ['alert',          'components-alert--all-variants',                   'web-components-alert--all-variants'],
  ['card',           'components-card--default',                         'web-components-card--all-variants'],
  ['stat',           'components-stat--all-colors',                      'web-components-stat--all-colors'],
  ['progress',       'components-progress--all-bar-states',              'web-components-progress--all-bar-states'],
  ['button',         'components-button--all-variants',                  'web-components-button--all-variants'],
  ['chip',           'components-chip--all-variants',                    'web-components-chip--all-variants'],
  ['breadcrumb',     'components-breadcrumb--default',                   'web-components-breadcrumb--default'],
  ['pagination',     'components-pagination--default',                   'web-components-pagination--default'],
  ['toolbar',        'components-toolbar--default',                      'web-components-toolbar--default'],
  ['navigation',     'components-navigation--default',                   'web-components-navigation--default'],
  ['input',          'components-form-input--all-states',                'web-components-form-input--all-states'],
  ['checkbox',       'components-form-checkbox--all-states',             'web-components-form-checkbox--group'],
  ['radio',          'components-form-radio--radio-group',               'web-components-form-radio--group'],
  ['switch',         'components-form-switch--all-states',               'web-components-form-switch--states'],
  ['select',         'components-form-select--all-states',               'web-components-form-select--all-states'],
  ['slider',         'components-form-slider--all-variants',             'web-components-form-slider--all-variants'],
  ['listbox',        'components-form-listbox--default',                 'web-components-form-listbox--default'],
  ['combobox',       'components-form-combobox--default',                'web-components-form-combobox--default'],
  ['chat-input',     'components-form-chatinput--default',               'web-components-form-chatinput--default'],
  ['tooltip',        'components-tooltip--all-positions',                'web-components-tooltip--all-positions'],
  ['modal',          'components-modal--default',                        'web-components-modal--default'],
  ['drawer',         'components-drawer--default',                       'web-components-drawer--default'],
  ['toast',          'components-toast--all-variants',                   'web-components-toast--all-variants'],
  ['accordion',      'components-accordion--multiple-items',             'web-components-accordion--multiple-items'],
  ['disclosure',     'components-disclosure--default',                   'web-components-disclosure--default'],
  ['tabs',           'components-tabs--default',                         'web-components-tabs--default'],
  ['menu',           'components-menu--default',                         'web-components-menu--default'],
  ['table',          'components-table--default',                        'web-components-table--default'],
  ['data-grid',      'components-data-grid--default',                    'web-components-datagrid--default'],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 700 });

const errors = {};

for (const [name, angId, wcId] of PAIRS) {
  console.log(`Checking: ${name}`);

  try {
    // Angular
    await page.goto(BASE + angId, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(OUT, `${name}-angular.png`), fullPage: false });

    // WC
    const wcErrors = [];
    const handler = m => { if (m.type() === 'error' && !m.text().includes('favicon')) wcErrors.push(m.text()); };
    page.on('console', handler);
    await page.goto(BASE + wcId, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(OUT, `${name}-wc.png`), fullPage: false });
    page.off('console', handler);

    if (wcErrors.length) errors[name] = wcErrors;
  } catch (e) {
    console.error(`  ERROR on ${name}: ${e.message.split('\n')[0]}`);
    errors[name] = [e.message.split('\n')[0]];
  }
}

await browser.close();

console.log('\n=== Console errors in WC stories ===');
if (Object.keys(errors).length === 0) {
  console.log('None.');
} else {
  for (const [name, errs] of Object.entries(errors)) {
    console.log(`\n${name}:`);
    errs.forEach(e => console.log('  ', e));
  }
}
console.log('\nScreenshots saved to audit-wc/');
