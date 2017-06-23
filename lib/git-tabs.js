'use babel'

import TabManager from './tab-manager'

const GitTabs = {
  tabManager: null,

  activate() {
    this.tabManager = new TabManager()
  },

  deactivate() {
    this.tabManager.destroy()
  },

  serialize() {
    return {}
  },
}

export default GitTabs
