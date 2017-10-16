'use babel'

import md5 from 'md5'
import showConfirmNotification from './notification'
import { getTextEditors, isTextEditorOpen, normalizedTextEditors } from './utils'

class TabManager {
  constructor() {
    this.branchEditors = []
    this.initialized = false

    atom.project.onDidChangePaths(this.onDidChangeStatuses)

    this.getFirstRepository().then(this.initialize.bind(this))
  }

  initialize(repository) {
    if (!repository) {
      return
    }

    this.updateRepo(repository)

    atom.workspace.observeTextEditors(this.updateCache)
    atom.workspace.onDidDestroyPaneItem(this.updateCache)

    this.initialized = true
    this.updateTabs()
  }

  getFirstRepository() {
    const directories = atom.project.getDirectories();
    if (!directories.length) {
      return Promise.resolve(null);
    }

    return atom.project.repositoryForDirectory(directories[0]);
  }

  updateRepo(repository) {
    if (repository.isDestroyed()) {
      return;
    }

    this.md5 = md5(repository.getPath())
    this.repository = repository
    this.updateBranch(repository.getShortHead())

    repository.onDidChangeStatuses(this.onDidChangeStatuses)
  }

  updateBranch(branchName) {
    this.branchName = branchName
  }

  updateCache = () => {
    if (this.initialized && !this.updating) {
      const tabs = getTextEditors()
      window.localStorage.setItem(
        `git-tabs:${this.md5}:${this.branchName}`,
        JSON.stringify(tabs),
      )
    }
  }

  didRepositoryChange(newRepository) {
    return (
      !this.repository ||
      this.repository.isDestroyed() ||
      !newRepository.isDestroyed() && this.repository.getPath() !== newRepository.getPath()
    )
  }

  didBranchChange(newBranchName) {
    return this.branchName !== newBranchName
  }

  onDidChangeStatuses = (foo) => {
    this.getFirstRepository().then((repository) => {
      if (!repository) {
        return
      }

      // If repository changed, the old project's tabs will be loaded by project-manager
      // so we should not be doing anything here
      if (this.didRepositoryChange(repository)) {
        this.updateRepo(repository)
        return
      }

      const branchName = repository.getShortHead()
      if (this.didBranchChange(branchName)) {
        this.updateBranch(branchName)

        if (atom.config.get('git-tabs.useConfirmNotification')) {
          showConfirmNotification(branchName, this.updateTabs)
        } else {
          this.updateTabs()
        }
      } else {
        this.updateBranch(branchName)
      }
    })
  }

  updateEditors() {
    const raw = window.localStorage.getItem(
      `git-tabs:${this.md5}:${this.branchName}`,
    )
    const openTabs = JSON.parse(raw) || []
    this.branchEditors = openTabs
  }

  updateTabs = () => {
    this.updating = true
    this.updateEditors()

    const currentTextEditors = normalizedTextEditors()

    // Determine which tabs to open
    const tabsToOpen = this.branchEditors.reduce((accum, editor) => {
      if (!isTextEditorOpen(currentTextEditors, editor.path)) {
        return accum.concat(editor.path)
      }

      return accum
    }, [])

    // Determine which tabs to close
    const tabsToClose = currentTextEditors.reduce((accum, editor) => {
      if (!isTextEditorOpen(this.branchEditors, editor.path)) {
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
      atom.open({ pathsToOpen: tabsToOpen })
    }

    this.updating = false
  }

  destroy() {
    this.branchName = null
    this.initialized = false
    this.md5 = null
    this.repository = null
  }
}

export default TabManager
