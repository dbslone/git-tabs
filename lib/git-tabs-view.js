'use babel';

export default class GitTabsView {

  constructor(serializedState) {
    // // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('git-tabs');
    //
    // // Create message element
    // const message = document.createElement('div');
    // message.textContent = 'The GitTabs package is Alive! It\'s ALIVE!';
    // message.classList.add('message');
    // this.element.appendChild(message);
    const repo = atom.project.getRepositories()[0]
    const branch = repo.getShortHead()
    console.log({project: repo, branch})

    repo.onDidChangeStatus(this.onDidChangeBranch)
  }

  onDidChangeBranch (event) {

    console.log({event})
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
