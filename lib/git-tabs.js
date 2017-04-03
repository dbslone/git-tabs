'use babel'

import TabManager from './tab-manager'
// import {GitRepository, Pane} from 'atom'

export default {

  tabManager: null,
  modalPanel: null,
  subscriptions: null,

  activate (state) {

    console.log({state, atom})
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.gitTabsView.getElement(),
    //   visible: false
    // });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'git-tabs:toggle': () => this.toggle()
    // }));


    // TODO: Solve issue when opening a new window without a repo

    this.tabManager = new TabManager()

  },

  deactivate () {

    // this.modalPanel.destroy();
    // this.subscriptions.dispose();
    this.tabManager.destroy()
  },

  serialize () {

    return {
      // gitTabsViewState: this.gitTabsView.serialize()
    }
  }
}
