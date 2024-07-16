#!/bin/sh
echo "Gitting git"
sudo apt update && sudo apt install git

echo "Installing node"
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install 22
node -v

git clone https://github.com/redheineymonkey/thing.git
cd thing

npm install
npm run build