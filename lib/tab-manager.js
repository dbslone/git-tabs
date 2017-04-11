'use babel'

export default class TabManager {

  constructor() {

    this.branchEditors = []

    if (atom.project.getRepositories().length > 0) {
      const repo = atom.project.getRepositories()[0]
      const branchName = repo.getShortHead()
      this.currentBranchName = branchName

      repo.onDidChangeStatuses(this.onDidChangeStatuses)

      atom.workspace.observeTextEditors((event) => {

        const tabs = this.getTextEditors()
        console.log('writing the tabs: ', this.currentBranchName)
        // window.localStorage.setItem(`git-tabs:${this.currentBranchName}:tabs`, JSON.stringify(tabs))
      })
    }
  }

  didChangeBranch (newBranchName) {

    return this.currentBranchName !== newBranchName
  }

  onDidChangeStatuses = () => {

    const repo = atom.project.getRepositories()[0]
    const branchName = repo.getShortHead()

    if (this.didChangeBranch(branchName)) {
      // Time to start saving the open tabs
      this.currentBranchName = branchName
      const raw = window.localStorage.getItem(`git-tabs:${branchName}:tabs`)
      const openTabs = JSON.parse(window.localStorage.getItem(`git-tabs:${branchName}:tabs`))
      this.branchEditors = openTabs

      this.updateTabs()
    }
  }

  getTextEditors () {

    return atom.workspace.getTextEditors().reduce((accum, editor) => {

      return accum.concat({
        id: editor.id,
        path: editor.getPath()
      })
    }, [])
  }

  isTextEditorOpen = (arr, path) => {

    return arr.reduce((accum, tab) => {

      return (tab.path === path || accum)
        ? true
        : false
    }, false)
  }

  normalizedTextEditors () {

    return atom.workspace.getTextEditors().reduce((accum, editor) => {

      return accum.concat({
        id: editor.id,
        path: editor.getPath()
      })
    }, [])
  }

  updateTabs = () => {

    const currentTextEditors = this.normalizedTextEditors()

    // Determine which tabs to open
    const tabsToOpen = this.branchEditors.reduce((accum, editor) => {

      if (!this.isTextEditorOpen(currentTextEditors, editor.path)) {
        return accum.concat(editor.path)
      }

      return accum
    }, [])

    // Determine which tabs to close
    const tabsToClose = currentTextEditors.reduce((accum, editor) => {

      if (!this.isTextEditorOpen(this.branchEditors, editor.path)) {
        return accum.concat(editor.path)
      }

      return accum
    }, [])

    if (tabsToClose.length > 0) {
      atom.workspace.getTextEditors().forEach((textEditor) => {

        if (tabsToClose.includes(textEditor.getPath())) {
          textEditor.destroy()
        }
      })
    }

    if (tabsToOpen.length > 0) {
      atom.open({pathsToOpen: tabsToOpen})
    }
  }

  destroy () {

    console.log('Destroy the class stuff here')
  }
}
