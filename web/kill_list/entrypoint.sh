#!/usr/bin/env bash

if [ "$1" == "start_process" ]; then
    cd /opt/kill_list

    mongod --quiet --config /etc/mongod.conf &
    sleep 2
    mongo < create_admin.js
    node create_users.js

    redis-server /etc/redis/redis.conf
    service nginx start

    pm2 start process.json --no-daemon
    # the --no-daemon is a minor workaround to prevent the
    # docker container from thinking pm2 has stopped running and ending itself
fi

exec "$@"

