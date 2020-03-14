#!/usr/bin/env sh
set -e

envsubst '$${UPSTREAM_HOST}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
