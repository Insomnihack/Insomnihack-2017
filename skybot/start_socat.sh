#!/usr/bin/env bash
PORT=${1:-1337}
socat TCP-LISTEN:"${PORT}",reuseaddr,fork EXEC:./skybot
