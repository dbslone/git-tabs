'use babel'

import md5 from 'md5'

export default class TabManager {

  constructor() {

    this.branchEditors = []
    this.initialized = false

    const repo = atom.project.getRepositories()[0]

    if (repo) {
      const repo = atom.project.getRepositories()[0]
      const branchName = repo.getShortHead()
      this.md5 = md5(repo.path)
      this.currentBranchName = branchName

      repo.onDidChangeStatuses(this.onDidChangeStatuses)

      atom.workspace.observeTextEditors((event) => {

        if (this.initialized) {
          const tabs = this.getTextEditors()
          window.localStorage.setItem(`git-tabs:${this.md5}:${this.currentBranchName}`, JSON.stringify(tabs))
        }
      })

      atom.workspace.onDidDestroyPaneItem((event) => {

        if (this.initialized && !this.updating) {
          const tabs = this.getTextEditors()
          console.log(`git-tabs:${this.md5}:${this.currentBranchName}`)
          window.localStorage.setItem(`git-tabs:${this.md5}:${this.currentBranchName}`, JSON.stringify(tabs))
        }
      })

      this.initialized = true
      this.updateEditors()
      this.updateTabs()
    }
  }

  didChangeBranch (newBranchName) {

    return this.currentBranchName !== newBranchName
  }

  onDidChangeStatuses = () => {

    const repo = atom.project.getRepositories()[0]

    if (repo && this.didChangeBranch(branchName)) {
      const branchName = repo.getShortHead()

      // Time to start saving the open tabs
      this.currentBranchName = branchName
      this.updateEditors()
      this.updateTabs()
    }
  }

  updateEditors = () => {

    const raw = window.localStorage.getItem(`git-tabs:${this.md5}:${this.currentBranchName}`)
    const openTabs = JSON.parse(raw) || []
    this.branchEditors = openTabs
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

    this.updating = true
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

    this.updating = false
  }

  destroy () {

    this.initialized = false
  }
}
