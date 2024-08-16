figma.showUI(__html__, { width: 400, height: 500 })

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'extract-local-variables') {
    try {
      // 提取本地字符串變數（假設使用 'STRING' 變數類型）
      const localStringVariables = await figma.variables.getLocalVariablesAsync('COLOR')
      console.log('localStringVariables:', localStringVariables)

      // 構建變數數據結構
      const localVariables = {
        strings: localStringVariables.map((variable) => ({
          name: variable.name,
        })),
      }
      console.log('localVariables:', localVariables)

      // 將變數數據發送給 UI，準備下載或顯示
      figma.ui.postMessage({ type: 'save-local-variables', localVariables })
      //save-local-variables

      figma.notify('Local variables extracted!')
      // figma.closePlugin()
    } catch (error) {
      console.error('Error extracting local variables:', error)
      figma.notify('Failed to extract local variables.')
    }
  }
}
