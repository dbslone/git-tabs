'use babel';

export default class GitTabsView {

  constructor(serializedState) {
    // // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('git-tabs');

    // const repo = atom.project.getRepositories()[0]
    // const branch = repo.getShortHead()
    // console.log({project: repo, branch})
    //
    // repo.onDidChangeStatuses(this.onDidChangeBranch)
  }

  onDidChangeBranch () {


  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
