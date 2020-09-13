#!/usr/bin/env sh
set -e

envsubst '$${HASURA_UPSTREAM_HOST}$${KEYCLOAK_UPSTREAM_HOST}$${RAZZLE_UPSTREAM_HOST}$${HASURA_UPSTREAM_PORT}$${KEYCLOAK_UPSTREAM_PORT}$${RAZZLE_UPSTREAM_PORT}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf

nginx -g 'daemon off;'
