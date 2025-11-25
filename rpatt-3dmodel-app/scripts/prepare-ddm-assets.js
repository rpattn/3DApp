const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const ddmRoot = path.resolve(repoRoot, '..', 'ddm-files');
const sourcePublic = path.join(ddmRoot, 'public');
const sourceDemo = path.join(ddmRoot, 'data', 'demo');
const destinationRoot = path.join(repoRoot, 'public', 'ddm-files');

const assets = [
  { src: path.join(sourcePublic, 'autumn_field_puresky_4k.hdr'), dest: path.join(destinationRoot, 'autumn_field_puresky_4k.hdr') },
  { src: path.join(sourcePublic, 'ground.jpg'), dest: path.join(destinationRoot, 'ground.jpg') },
  { src: path.join(sourcePublic, 'waternormals.jpeg'), dest: path.join(destinationRoot, 'waternormals.jpeg') },
];

const models = [
  { src: path.join(sourceDemo, 'generic_fou.glb'), dest: path.join(destinationRoot, 'data', 'demo', 'generic_fou.glb') },
  { src: path.join(sourceDemo, 'generic_pin_piles.glb'), dest: path.join(destinationRoot, 'data', 'demo', 'generic_pin_piles.glb') },
];

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(entry) {
  if (!fs.existsSync(entry.src)) {
    throw new Error(`Missing ddm-files asset: ${entry.src}`);
  }

  ensureDirectory(path.dirname(entry.dest));
  fs.copyFileSync(entry.src, entry.dest);
}

function main() {
  if (!fs.existsSync(ddmRoot)) {
    throw new Error(`Cannot find ddm-files project at ${ddmRoot}. Make sure it is checked out next to rpatt-3dmodel-app.`);
  }

  [...assets, ...models].forEach(copyFile);

  console.log(`Copied ddm-files assets into ${destinationRoot}`);
}

main();
