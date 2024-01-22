const fs = require('fs').promises;
const path = require('path');

const folderName = 'secret-folder';
const folderPath = path.join(__dirname, folderName);
const consoleColors = ['\x1b[36m%s\x1b[0m', '\x1b[32m%s\x1b[0m'];

const displayFileInfo = async (file) => {
  try {
    const filePath = path.join(folderPath, file);
    const stats = await fs.stat(filePath);

    if (!stats.isDirectory()) {
      const { name, ext } = path.parse(file);
      const sizeKB = `${(stats.size / 1024).toFixed(3)}kb`;
      const result = `${name} - ${ext.slice(1)} - ${sizeKB}`;
      console.log(consoleColors[1], result);
    }
  } catch (err) {
    console.error('Error reading file:', err);
  }
};

(async () => {
  try {
    const files = await fs.readdir(folderPath);
    console.log(consoleColors[0], `Files list in ${folderName}:`);
    await Promise.all(files.map(displayFileInfo));
  } catch (err) {
    console.error('Error reading directory:', err);
  }
})();
