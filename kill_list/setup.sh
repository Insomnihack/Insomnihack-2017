#!/usr/bin/env bash
#
apt-get update && apt-get upgrade -qy
apt-get install -qy \
    build-essential apt-transport-https libssl-dev \
    vim curl wget lsof \
    python g++ make \
    nginx redis-server

## Clean up
rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoclean

##
## Install nodejs
##
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
bash nodesource_setup.sh
apt-get install nodejs
npm install -g pm2

##
## Install mongodb
##
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" > /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get update && apt-get install -y mongodb-org


