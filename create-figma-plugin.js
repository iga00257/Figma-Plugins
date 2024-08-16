const fs = require('fs')
const path = require('path')

// 定義插件文件夾和文件內容
const pluginDir = path.join(__dirname, 'sample-plugin')
const manifestContent = `{
  "name": "Sample Plugin",
  "id": "sample-plugin",
  "api": "1.0.0",
  "editorType": ["figma"], 
  "main": "code.js",
  "ui": "ui.html"
}`

const codeContent = `figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangles') {
    const nodes = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.closePlugin();
  }
};`

const uiContent = `<!DOCTYPE html>
<html>
  <body>
    <h2>Create Rectangles</h2>
    <button id="create">Create 5 Rectangles</button>

    <script>
      document.getElementById('create').onclick = () => {
        parent.postMessage({ pluginMessage: { type: 'create-rectangles', count: 5 } }, '*');
      };
    </script>
  </body>
</html>`

// 創建文件夾和文件
if (!fs.existsSync(pluginDir)) {
  fs.mkdirSync(pluginDir)
}

fs.writeFileSync(path.join(pluginDir, 'manifest.json'), manifestContent)
fs.writeFileSync(path.join(pluginDir, 'code.js'), codeContent)
fs.writeFileSync(path.join(pluginDir, 'ui.html'), uiContent)

console.log('Figma plugin has been created successfully in the sample-plugin directory.')
