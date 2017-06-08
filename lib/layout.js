'use babel'

export default class GTLayout {

  constructor () {
    console.log('START LAYOUT')
    this._panels = {}
  }

  addPane = (pane) => {

    const parentElement = pane.getElement().parentElement
    const rect = parentElement.getBoundingClientRect()
    const identifier = `${rect.top}:${rect.left}:${rect.width}:${rect.height}`
console.log({rect, identifier})
    if (!this._panels[identifier]) {
      this._panels[identifier] = {
        rect,
        textEditors: []
      }
    }
console.log({items: pane.getItems()})
    pane.getItems().forEach((editor) => {

      // console.log({editor})
      this._panels[identifier].textEditors = this._panels[identifier].textEditors.concat({
        id: editor.id,
        path: editor.getPath()
      })
    })

    console.log({panels: this._panels})
  }
}
