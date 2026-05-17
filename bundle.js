const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("script.js", "utf8");

const out = html.replace(
  /<script>\s*\/\/ Personalize[\s\S]*?<\/script>/,
  `<script>\n${js}\n</script>`
);

if (out === html) {
  console.error("Could not find script block in index.html to update.");
  process.exit(1);
}

fs.writeFileSync("index.html", out);
console.log("Synced script.js into index.html — re-upload index.html to GitHub.");
