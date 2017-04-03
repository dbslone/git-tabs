'use babel'

export default class TabManager {

  constructor() {

    this.branchEditors = []

    if (atom.project.getRepositories().length > 0) {
      console.log('-- subscribe to git changes--')
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
      console.log('----branch changed---')
      this.currentBranchName = branchName
      const raw = window.localStorage.getItem(`git-tabs:${branchName}:tabs`)
      const openTabs = JSON.parse(window.localStorage.getItem(`git-tabs:${branchName}:tabs`))
      this.branchEditors = openTabs
      atom.notifications.addInfo(raw)

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

    arr.reduce((accum, tab) => {

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
debugger
      if (!this.isTextEditorOpen(currentTextEditors, editor.path)) {
        return accum.concat(editor)
      }

      return accum
    }, [])
    console.log({tabsToOpen})
    // Determine which tabs to close
    const tabsToClose = currentTextEditors.reduce((accum, editor) => {

      if (!this.isTextEditorOpen(this.branchEditors, editor.path)) {
        return accum.concat(editor)
      }

      return accum
    }, [])
    console.log({tabsToClose})

    // console.log({currentTabs: this.branchEditors})
    //
    // currentTextEditors.forEach((textEditor) => {
    //
    //   const path = textEditor.getPath()
    //   console.log({path})
    //   const found = this.branchEditors.reduce((accum, editor) => {
    //
    //     return (editor.path === path || accum)
    //       ? true
    //       : false
    //   }, false)
    //
    //   if (!found) {
    //     textEditor.destroy()
    //   }
    // })
    //
    // return []
  }

  destroy () {

    console.log('Destroy the class stuff here')
  }
}
