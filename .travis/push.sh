#!/bin/sh

export GIT_AUTHOR_NAME="Botkaze"
export GIT_AUTHOR_EMAIL="gkpyon+1@gmail.com"
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

git checkout master
git add .
git commit -m "chore: autobuild for $(cat dist/version)"
git push "https://${GITHUB_TOKEN}@github.com/kcwiki/kancolle-main.git" master
