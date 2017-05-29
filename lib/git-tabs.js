'use babel'

import TabManager from './tab-manager'

export default {

  tabManager: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {

    this.tabManager = new TabManager()
  },

  deactivate () {

    this.tabManager.destroy()
  },

  serialize () {

    return {}
  }
}
