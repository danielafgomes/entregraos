// Optional authoring helper. GitHub Pages serves the generated HTML directly.
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dictionary = JSON.parse(await readFile(path.join(root, 'content/en.json'), 'utf8'));
const portuguese = await readFile(path.join(root, 'index.html'), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const translation = key => {
  if (!(key in dictionary)) throw new Error(`Missing English translation: ${key}`);
  return escape(dictionary[key]);
};
let english = portuguese.replace('lang="pt-PT"', 'lang="en"');
english = english.replace(/(<[^>]+data-i18n="([^"]+)"[^>]*>)[^<]*/g, (_, tag, key) => tag + translation(key));
english = english.replace(/<[^>]+data-i18n-(alt|aria)="[^"]+"[^>]*>/g, tag => {
  const [, kind, key] = tag.match(/data-i18n-(alt|aria)="([^"]+)"/);
  const attribute = kind === 'alt' ? 'alt' : 'aria-label';
  return tag.replace(new RegExp(`${attribute}="[^"]*"`), `${attribute}="${translation(key)}"`);
});
english = english.replace(/<title>[^<]*<\/title>/, `<title>${translation('pageTitle')}</title>`);
for (const [attribute, key] of [['name="description"', 'pageDescription'], ['property="og:title"', 'pageTitle'], ['property="og:description"', 'pageDescription'], ['property="og:image:alt"', 'ogImageAlt']]) {
  english = english.replace(new RegExp(`(<meta ${attribute} content=")[^"]*`), `$1${translation(key)}`);
}
english = english.replace('property="og:locale" content="pt_PT"', 'property="og:locale" content="en_GB"')
  .replace('property="og:locale:alternate" content="en_GB"', 'property="og:locale:alternate" content="pt_PT"')
  .replace('rel="canonical" href="https://www.entregraos.pt/"', 'rel="canonical" href="https://www.entregraos.pt/en/"')
  .replace('property="og:url" content="https://www.entregraos.pt/"', 'property="og:url" content="https://www.entregraos.pt/en/"')
  .replace('data-menu-open="Abrir menu" data-menu-close="Fechar menu"', 'data-menu-open="Open menu" data-menu-close="Close menu"')
  .replace('href="./" lang="pt-PT" hreflang="pt-PT" aria-current="page"', 'href="../" lang="pt-PT" hreflang="pt-PT"')
  .replace('href="en/" lang="en" hreflang="en"', 'href="./" lang="en" hreflang="en" aria-current="page"')
  .replace(/(src|href)="(assets\/|logo-entregraos\.png|style\.css|script\.js)/g, '$1="../$2');
await mkdir(path.join(root, 'en'), { recursive: true });
await writeFile(path.join(root, 'en/index.html'), english);

// An explicit preview/ destination can never replace its production parent.
const previewDirectory = process.argv[2];
if (previewDirectory) {
  const previewRoot = path.resolve(previewDirectory);
  if (path.basename(previewRoot) !== 'preview') throw new Error('Destination must be a preview/ directory.');
  const privateHtml = html => html
    .replace(/\s*<link rel="(?:canonical|alternate)"[^>]*>/g, '')
    .replace(/\s*<meta property="og:url"[^>]*>/g, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace('<meta name="viewport"', '<meta name="robots" content="noindex,nofollow,noarchive">\n  <meta name="googlebot" content="noindex,nofollow">\n  <meta name="viewport"')
    .replace('https://www.entregraos.pt/assets/balcao.webp', 'https://www.entregraos.pt/preview/assets/balcao.webp');
  await mkdir(path.join(previewRoot, 'en'), { recursive: true });
  await writeFile(path.join(previewRoot, 'index.html'), privateHtml(portuguese));
  await writeFile(path.join(previewRoot, 'en/index.html'), privateHtml(english));
  for (const name of ['style.css', 'script.js', 'logo-entregraos.png', 'assets']) {
    await cp(path.join(root, name), path.join(previewRoot, name), { recursive: true });
  }
}
console.log('Static English page prepared' + (previewDirectory ? '; protected PT/EN preview synchronized.' : '.'));
