#!/bin/sh

echo
echo "**** Pulling changes into Prime [Hub's post-update hook]"
echo

DIR="/home/www/massagesante.co.uk"

cd $DIR || exit
unset GIT_DIR
git pull origin master

NODE_PATH="/root/.nave/installed/0.8.20/bin"
PATH="$PATH:$NODE_PATH"
$NODE_PATH/npm install
$NODE_PATH/grunt decrypt --key $1

