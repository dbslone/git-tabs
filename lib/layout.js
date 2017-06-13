'use babel'

export default class GTLayout {

  constructor () {
    this._panels = {}
  }

  addPane = (pane) => {

    const parentElement = pane.getElement().parentElement
    const rect = parentElement
      ? parentElement.getBoundingClientRect()
      : {left: 1000}

    const identifier = rect.left

    if (!this._panels[identifier]) {
      this._panels[identifier] = {
        rect,
        textEditors: []
      }
    }

    pane.getItems().forEach((editor) => {

      this._panels[identifier].textEditors = this._panels[identifier].textEditors.concat({
        id: editor.id,
        path: editor.getPath()
      })
    })
  }

  serialize = () => {

    const leftPanelOffset = this.leftPanelOffset()
    console.log({panels: this._panels, leftPanelOffset})
    const serializedPanes = Object.keys(this._panels).reduce((accum, key) => {

      const editors = this.serializeEditors(this._panels[key].textEditors)
      const panel = parseInt(key) === leftPanelOffset
        ? 'left'
        : 'right'

      return {
        ...accum,
        [panel]: editors
      }
    }, {})

    return JSON.stringify(serializedPanes)
  }

  serializeEditors = (editors) => {

    return editors.reduce((accum, editor) => {

      return accum.concat(editor.path)
    }, [])
  }

  leftPanelOffset = () => {

    const keys = Object.keys(this._panels).map((val) => {return parseInt(val)})
    return Math.min(...keys)
  }
}
