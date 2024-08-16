figma.showUI(__html__)

// Helper 函數：將 RGB 顏色轉換為 HEX
function rgbToHex(r, g, b) {
  const toHex = (value) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// 遞歸函數來處理嵌套節點
function extractColorsFromNode(node) {
  let colors = []

  // 檢查是否有填充顏色
  if ('fills' in node && node.fills.length > 0) {
    for (const fill of node.fills) {
      if (fill.type === 'SOLID') {
        const hexColor = rgbToHex(fill.color.r, fill.color.g, fill.color.b)
        let nodeName = node.name ? node.name.trim().replace(/\s+/g, '-').toLowerCase() : 'unnamed'
        nodeName = nodeName.replace(/[^a-zA-Z0-9-]/g, '') // 移除特殊字元
        colors.push({
          name: nodeName,
          color: hexColor,
        })
      }
    }
  }

  // 如果節點有子節點，遞歸遍歷子節點
  if ('children' in node) {
    for (const child of node.children) {
      colors = colors.concat(extractColorsFromNode(child))
    }
  }

  return colors
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'extract-colors') {
    const { keyword, prefix, suffix } = msg // 從 UI 傳來的參數
    const selectedNodes = figma.currentPage.selection

    if (selectedNodes.length === 0) {
      figma.notify('No nodes selected. Please select some nodes.')
      return
    }

    let allColors = []

    // 遍歷每個選中的節點
    for (const node of selectedNodes) {
      const colorsFromNode = extractColorsFromNode(node)
      allColors = allColors.concat(colorsFromNode)
    }

    if (allColors.length === 0) {
      figma.notify('No colors found in the selected nodes.')
    } else {
      // 過濾包含特定關鍵字的顏色（如果有）
      if (keyword && keyword.trim() !== '') {
        allColors = allColors.filter((color) => color.name.includes(keyword.trim().toLowerCase()))
      }

      // 生成 SCSS 變數
      let scssContent = ''
      allColors.forEach((color) => {
        scssContent += `$${prefix || ''}${color.name}${suffix || ''}: ${color.color};\n`
      })

      // 將 SCSS 文件內容傳遞給 UI 界面
      figma.ui.postMessage({ type: 'save-scss', scssContent })

      figma.notify('Colors extracted and SCSS file generated!')
    }
  }
}
