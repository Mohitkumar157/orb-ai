/**
 * OrbAI Build Script
 * - Merges style.css + mohit.css + insights.css → main.css (minified)
 * - Minifies script.js → script.min.js
 * - Updates all HTML files to use new files
 * - Fixes #contact selector in mobile nav CSS
 */

const fs = require('fs');
const path = require('path');

const BASE = __dirname;

// ─── HELPERS ───────────────────────────────────────────────────────────────

function minifyCSS(css) {
  return css
    // Remove /* ... */ comments (including multiline)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove line comments (// style — not standard CSS but some people use them)
    .replace(/(?<!['"a-zA-Z:])\/\/[^\n]*/g, '')
    // Collapse whitespace (spaces, tabs, newlines) → single space
    .replace(/\s+/g, ' ')
    // Remove space around { } : ; , > + ~ selectors
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*~\s*/g, '~')
    // Remove last ; before }
    .replace(/;}/g, '}')
    // Remove leading/trailing whitespace
    .trim();
}

function minifyJS(js) {
  return js
    // Remove single-line comments (but not URLs like https://)
    .replace(/(?<!['":/])\/\/(?!\/)[^\n]*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Collapse multiple blank lines → single newline
    .replace(/\n\s*\n\s*\n/g, '\n')
    // Remove leading/trailing whitespace per line
    .split('\n').map(l => l.trim()).filter(l => l.length > 0).join('\n')
    .trim();
}

// ─── STEP 1: Collect inline <style> blocks from all HTML pages ─────────────

const htmlFiles = ['index.html', 'features.html', 'service.html', 'solution.html', 'insights.html', 'contact.html'];

// Map of page → selector to scope its inline styles
// We'll use a body class approach: each page's inline styles scoped with a comment label only
// (keeping them global since the pages are separate HTML files)
const pageInlineStyles = {};

for (const file of htmlFiles) {
  const filePath = path.join(BASE, file);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Extract all <style>...</style> blocks
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  const blocks = [];
  while ((match = styleRegex.exec(html)) !== null) {
    blocks.push(match[1]);
  }
  pageInlineStyles[file] = blocks;
}

// ─── STEP 2: Read CSS source files ─────────────────────────────────────────

const styleCss   = fs.readFileSync(path.join(BASE, 'style.css'), 'utf8');
const mohitCss   = fs.readFileSync(path.join(BASE, 'mohit.css'), 'utf8');
const insightsCss = fs.readFileSync(path.join(BASE, 'insights.css'), 'utf8');

// Fix: mobile-nav "Start a project" link selector — was #contact, now contact.html
let mohitFixed = mohitCss
  .replace(/\.mobile-nav a\[href="#contact"\]/g, '.mobile-nav a[href="contact.html"], .mobile-nav a[href="#contact-form"]')
  .replace(/header a\[href="#contact"\]/g, 'header a[href="#contact"], header a[href="contact.html"]');

// ─── STEP 3: Build combined CSS ────────────────────────────────────────────

const sections = [
  `/* ============================================================
   OrbAI — main.css  (auto-generated, do not edit manually)
   Generated: ${new Date().toISOString()}
   ============================================================ */`,

  `/* ── Reset & Global ── */`,
  styleCss,

  `/* ── Components (mohit.css) ── */`,
  mohitFixed,

  `/* ── Insights Page ── */`,
  insightsCss,
];

// Append inline styles per page (scoped with comment, deduplicated)
const seenInlineBlocks = new Set();
for (const [file, blocks] of Object.entries(pageInlineStyles)) {
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed || seenInlineBlocks.has(trimmed)) continue;
    seenInlineBlocks.add(trimmed);
    const pageName = file.replace('.html', '');
    sections.push(`/* ── Inline: ${pageName} ── */`);
    sections.push(trimmed);
  }
}

const rawCombined = sections.join('\n\n');
const minified = minifyCSS(rawCombined);

// Add a tiny header comment to minified output
const finalCSS = `/* OrbAI main.css | Generated ${new Date().toISOString().slice(0,10)} */\n` + minified;

fs.writeFileSync(path.join(BASE, 'main.css'), finalCSS, 'utf8');
const cssKB = (Buffer.byteLength(finalCSS, 'utf8') / 1024).toFixed(1);
console.log(`✅ main.css written — ${cssKB} KB`);

// ─── STEP 4: Minify script.js → script.min.js ─────────────────────────────

const rawJS = fs.readFileSync(path.join(BASE, 'script.js'), 'utf8');
const minJS = minifyJS(rawJS);
const finalJS = `/* OrbAI script.min.js | ${new Date().toISOString().slice(0,10)} */\n` + minJS;
fs.writeFileSync(path.join(BASE, 'script.min.js'), finalJS, 'utf8');
const jsKB = (Buffer.byteLength(finalJS, 'utf8') / 1024).toFixed(1);
console.log(`✅ script.min.js written — ${jsKB} KB`);

// ─── STEP 5: Update HTML files ─────────────────────────────────────────────

for (const file of htmlFiles) {
  const filePath = path.join(BASE, file);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  // 1. Remove all <style>...</style> blocks (we moved them to main.css)
  //    EXCEPT: keep any <style> that has tailwind.config (that's JS-ish config, not CSS)
  html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (full, inner) => {
    // Keep tailwind config style blocks — they don't contain actual CSS rules
    if (inner.includes('tailwind.config') || inner.includes('tailwind')) return full;
    return '';
  });

  // 2. Remove old CSS link tags
  html = html.replace(/<link[^>]+href=["']style\.css["'][^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]+href=["']mohit\.css["'][^>]*\/?>/gi, '');
  html = html.replace(/<link[^>]+href=["']insights\.css["'][^>]*\/?>/gi, '');

  // 3. Inject main.css once (after charset meta or at top of <head>)
  if (!html.includes('main.css')) {
    html = html.replace(
      /(<head[^>]*>)/i,
      '$1\n    <link rel="stylesheet" href="main.css" />'
    );
  }

  // 4. Replace script.js with script.min.js
  html = html.replace(/src=["']script\.js["']/gi, 'src="script.min.js"');

  // 5. Remove blank lines left by removed tags (more than 2 consecutive)
  html = html.replace(/\n{3,}/g, '\n\n');

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Updated: ${file}`);
  } else {
    console.log(`⏭️  No changes: ${file}`);
  }
}

// ─── STEP 6: Report sizes ──────────────────────────────────────────────────

console.log('\n📦 Final sizes:');
const files = ['main.css', 'script.min.js', ...htmlFiles];
for (const f of files) {
  const fp = path.join(BASE, f);
  if (fs.existsSync(fp)) {
    const kb = (fs.statSync(fp).size / 1024).toFixed(1);
    console.log(`   ${f.padEnd(20)} ${kb} KB`);
  }
}

console.log('\n🎉 Build complete! Old files (style.css, mohit.css, insights.css, script.js) are kept as backup.');
