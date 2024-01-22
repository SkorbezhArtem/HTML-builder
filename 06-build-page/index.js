const fs = require('fs').promises;
const { createWriteStream, createReadStream } = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');
const consoleColors = ['\x1b[32m%s\x1b[0m', '\x1b[31m%s\x1b[0m'];

async function createDistFolder() {
  await fs.mkdir(distDir, { recursive: true });
}

async function replaceTemplateTags() {
  const components = await fs.readdir(componentsDir);
  const componentDataMap = new Map();

  await Promise.all(
    components.map(async (component) => {
      const componentName = path.basename(component, '.html');
      const componentPath = path.join(componentsDir, component);
      const componentData = await fs.readFile(componentPath, 'utf8');
      componentDataMap.set(`{{${componentName}}}`, componentData);
    }),
  );

  const readStream = createReadStream(templatePath, 'utf8');
  const writeStream = createWriteStream(path.join(distDir, 'index.html'));

  readStream.on('data', (chunk) => {
    let replacedChunk = chunk;
    for (const [key, value] of componentDataMap.entries()) {
      const regex = new RegExp(key, 'g');
      replacedChunk = replacedChunk.replace(regex, value);
    }
    writeStream.write(replacedChunk);
  });

  readStream.on('end', () => {
    writeStream.end();
  });

  readStream.on('error', (err) => {
    console.error(consoleColors[1], 'Read stream error:', err);
    writeStream.end();
  });

  writeStream.on('error', (err) => {
    console.error(consoleColors[1], 'Write stream error:', err);
  });

  writeStream.on('finish', () => {
    console.log(consoleColors[0], 'CSS was written successfully');
  });
}

async function buildStyles(styles, distBundle) {
  try {
    const files = await fs.readdir(styles, { withFileTypes: true });
    const ws = createWriteStream(distBundle);
    for (let file of files) {
      const rs = createReadStream(path.join(styles, path.basename(file.name)));
      if (path.extname(file.name) === '.css' && !file.isDirectory()) {
        rs.pipe(ws, { end: false });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function clearDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (let entry of entries) {
    const entryPath = path.join(dir, entry.name);

    entry.isDirectory()
      ? await fs.rm(entryPath, { recursive: true })
      : await fs.unlink(entryPath);
  }
}

async function copyAssets(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  await fs.mkdir(dest, { recursive: true });
  await clearDirectory(dest);

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? await copyAssets(srcPath, destPath)
      : await fs.copyFile(srcPath, destPath);
  }
}

async function buildPage() {
  try {
    await createDistFolder();
    await replaceTemplateTags();
    await buildStyles(stylesDir, path.join(distDir, 'style.css'));
    await copyAssets(assetsDir, path.join(distDir, 'assets'));
    console.log(consoleColors[0], 'Page built successfully');
  } catch (err) {
    console.error(err);
  }
}

buildPage();
