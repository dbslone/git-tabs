'use babel'

export default function showConfirmNotification(branchName, onYes, onNo) {
  atom.notifications.addInfo('git-tabs detected a project or branch change', {
    description: `Do you want to load your previous tabs for branch "${branchName}"`,
    buttons: [
      {
        className: 'btn btn-info',
        text: 'Yes',
        onDidClick() {
          this.removeNotification()
          onYes()
        },
      },
      {
        className: 'btn btn-info',
        text: 'No',
        onDidClick() {
          this.removeNotification()
          if (onNo) {
            onNo()
          }
        },
      },
    ],
  })
}
