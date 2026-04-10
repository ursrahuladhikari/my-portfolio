import ghpages from 'gh-pages';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Publishing...");
ghpages.publish(path.join(__dirname, 'dist'), {
  repo: 'https://github.com/ursrahuladhikari/my-portfolio.git',
  branch: 'gh-pages',
  dotfiles: true
}, err => {
  if (err) {
    console.error("Deploy failed:", err);
    process.exit(1);
  }
  console.log("Published successfully!");
});
