#!/bin/bash

set -xe
sudo chown node node_modules
sudo apt-get update
sudo apt-get -y install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb
git config --global --add safe.directory /workspace
git submodule update --init
corepack install
corepack enable
pnpm config set store-dir /home/node/.local/share/pnpm/store
pnpm install --frozen-lockfile
cp .devcontainer/devcontainer.yml .config/default.yml
pnpm build
pnpm migrate
pnpm exec cypress install
git remote add sharkey https://activitypub.software/TransFem-org/Sharkey.git
git remote add shrimpia https://github.com/shrimpia/misskey.git
git remote add io https://github.com/MisskeyIO/misskey.git
git remote add upstream https://github.com/misskey-dev/misskey.git
git remote add youjo https://github.com/yojo-art/cherrypick.git
git remote add samunohito https://github.com/samunohito/misskey.git
git remote add gtyih https://github.com/kakkokari-gtyih/misskey.git
git remote add taichan https://github.com/tai-cha/misskey.git
git remote add anatawa https://github.com/anatawa12/misskey.git
git fetch --all
