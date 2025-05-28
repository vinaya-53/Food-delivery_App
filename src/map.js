// generateImageMap.js

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const outputFile = path.join(__dirname, 'imageMap.ts');

// Supported image types
const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

const files = fs
  .readdirSync(assetsDir)
  .filter((file) => validExtensions.includes(path.extname(file).toLowerCase()));

const mapEntries = files
  .map(
    (file) => `  "${file}": require("./assets/${file}"),`
  )
  .join('\n');

const output = `// Auto-generated image map
const imageMap: { [key: string]: any } = {
${mapEntries}
};

export default imageMap;
`;

fs.writeFileSync(outputFile, output);
console.log(`✅ imageMap.ts generated with ${files.length} images.`);
