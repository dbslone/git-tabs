'use babel'

import md5 from 'md5'
import GTLayout from './layout'

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
        console.log({event, initialized: this.initialized, this})

        if (this.initialized) {
          const tabs = this.getTextEditors()
          window.localStorage.setItem(`git-tabs:${this.md5}:${this.currentBranchName}`, JSON.stringify(tabs))
          this.updateLayout()
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

    if (repo) {
      const branchName = repo.getShortHead()

      if (this.didChangeBranch(branchName)) {
        // Time to start saving the open tabs
        this.currentBranchName = branchName
        this.updateEditors()
        this.updateTabs()
      }
    }
  }

  updateEditors = () => {

    const raw = window.localStorage.getItem(`git-tabs:${this.md5}:${this.currentBranchName}`)
    const openTabs = JSON.parse(raw) || []
    this.branchEditors = openTabs
  }

  getTextEditors = () => {

    return atom.workspace.getTextEditors().reduce((accum, editor) => {

      return accum.concat({
        id: editor.id,
        path: editor.getPath()
      })
    }, [])
  }

  updateLayout = () => {

    let columns = []
    let currentColumnIndex = 0
    let layout = new GTLayout()

    atom.workspace.getPanes().forEach((pane) => {

      if (this.paneHasTextEditors(pane)) {
        console.log('--HAS TEXT EDITORS')
        console.log({hasEditors: this.paneHasTextEditors(pane)})

        // Use the parentElement to determine if the TextEditor is in the same "column"
        // By using the css bounding rect of the element we can determine how many editors per pane and their position for the split.
        // Create a Layout class that iterates through the pane items adds them to their respective pane with their split-direction.

        layout.addPane(pane)
      }
    })
  }

  paneHasTextEditors (pane) {

    return pane.getItems().findIndex((item) => item.constructor.name === 'TextEditor') >= 0
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
