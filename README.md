# git-tabs package

git-tabs remembers the tabs you have open with each git repository branch.

If you open tabs `A,B,C` on the master branch then switch to develop and close
tabs `B,C` and open tabs `X,Y,Z`. When you switch to `master` it will reopen tabs
`A,B,C`. Upon switching to the develop branch only tabs `A,X,Y,Z` will be open.
