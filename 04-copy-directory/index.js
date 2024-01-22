const fs = require('fs').promises;
const path = require('path');

const inputFolder = path.join(__dirname, 'files');
const outputFolder = path.join(__dirname, 'files-copy');
const consoleColors = ['\x1b[32m%s\x1b[0m', '\x1b[31m%s\x1b[0m'];

async function clearDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (let entry of entries) {
    const entryPath = path.join(dir, entry.name);

    entry.isDirectory()
      ? await fs.rm(entryPath, { recursive: true })
      : await fs.unlink(entryPath);
  }
}

async function copy(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  await fs.mkdir(dest, { recursive: true });
  await clearDirectory(dest);

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copy(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

async function main() {
  try {
    await copy(inputFolder, outputFolder);
    console.log(consoleColors[0], 'Files copied successfully');
  } catch (error) {
    console.error(consoleColors[1], 'Error while copying files:', error);
  }
}

main();
