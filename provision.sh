#!/usr/bin/env bash
apt-get install gettext -y

sudo su vagrant -c "curl https://raw.githubusercontent.com/creationix/nvm/v0.11.1/install.sh | bash"
sudo su vagrant -c "source ~/.nvm/nvm.sh && nvm install 0.10.29 && nvm alias default 0.10.29"
ln -s /home/vagrant/.nvm/current/bin/node /usr/local/bin/
ln -s /home/vagrant/.nvm/current/bin/npm /usr/local/bin/
sudo su vagrant -c "npm install -g node-gyp"
sudo su vagrant -c "npm install -g forever"
sudo su vagrant -c "source ~/.nvm/nvm.sh && cd /vagrant/ && npm install"

cd /vagrant
forever start --watch app.js vagrant.json