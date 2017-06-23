'use babel'

export function getTextEditors() {
  return atom.workspace.getTextEditors().reduce((accum, editor) => (
    accum.concat({
      id: editor.id,
      path: editor.getPath(),
    })
  ), [])
}

export function isTextEditorOpen(arr, path) {
  return arr.reduce((accum, tab) => (tab.path === path || accum), false)
}

export function normalizedTextEditors() {
  return atom.workspace.getTextEditors().reduce((accum, editor) => (
    accum.concat({
      id: editor.id,
      path: editor.getPath(),
    })
  ), [])
}
