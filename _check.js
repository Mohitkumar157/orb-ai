const fs = require('fs');
const base = 'c:/Users/mrsac/Downloads/AI-project-main/AI-project-main/';
const files = ['index.html','features.html','service.html','solution.html','insights.html'];
for (const f of files) {
  const h = fs.readFileSync(base + f, 'utf8');
  const hb = (h.match(/id="hamburger"/g) || []).length;
  const mm = (h.match(/id="mobile-menu"/g) || []).length;
  const sc = h.includes('script.js');
  console.log(f, 'hamburger:' + hb, 'mobile-menu:' + mm, 'script.js:' + sc);
}
