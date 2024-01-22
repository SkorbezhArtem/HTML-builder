const fs = require('fs');
const path = require('path');

const styleFolderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const consoleColors = ['\x1b[32m%s\x1b[0m', '\x1b[31m%s\x1b[0m'];

async function bundleStyles(styleFolderPath, bundlePath) {
  try {
    const files = await fs.promises.readdir(styleFolderPath, {
      withFileTypes: true,
    });

    const ws = fs.createWriteStream(bundlePath);

    for (let file of files) {
      const filePath = path.join(styleFolderPath, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const rs = fs.createReadStream(filePath);
        await new Promise((resolve) => {
          rs.pipe(ws, { end: false });
          rs.on('end', resolve);
        });
      }
    }

    ws.end();
    await new Promise((resolve) => ws.on('finish', resolve));

    console.log(consoleColors[0], 'Styles bundled successfully!');
  } catch (err) {
    console.error(consoleColors[1], 'Error bundling styles:', err);
  }
}

bundleStyles(styleFolderPath, bundlePath);
