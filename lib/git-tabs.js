'use babel'

import TabManager from './tab-manager'

export default {

  tabManager: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'git-tabs:toggle': () => this.toggle()
    // }));

    this.tabManager = new TabManager()

  },

  deactivate () {

    this.tabManager.destroy()
  },

  serialize () {

    return {
      // gitTabsViewState: this.gitTabsView.serialize()
    }
  }
}
