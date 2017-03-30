'use babel';

import GitTabsView from './git-tabs-view';
import { CompositeDisposable } from 'atom';

export default {

  gitTabsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.gitTabsView = new GitTabsView(state.gitTabsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gitTabsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'git-tabs:toggle': () => this.toggle()
    }));

    const repo = atom.project.getRepositories()[0]
    const branch = repo.getShortHead()
    console.log({project: repo, branch})

    repo.onDidChangeStatuses(() => {

      const repo = atom.project.getRepositories()[0]
      const branch = repo.getShortHead()
      console.log({branch})
    })
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gitTabsView.destroy();
  },

  serialize() {
    return {
      gitTabsViewState: this.gitTabsView.serialize()
    };
  },

  toggle() {
    console.log('GitTabs was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
