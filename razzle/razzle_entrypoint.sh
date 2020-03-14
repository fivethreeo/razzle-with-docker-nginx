#!/usr/bin/env sh
set -e

if [ ! -z "${PUBLIC_PORT}" ]; then
  PUBLIC_PORT=":${PUBLIC_PORT}"
fi

if [ -z "${PUBLIC_SCHEME}" ]; then
  PUBLIC_SCHEME="http"
fi

if [ -z "${PUBLIC_HOST}" ]; then
  PUBLIC_HOST="localhost"
fi

if [ ! -z "${RAZZLE_DEV}" ]; then
  export PUBLIC_PATH="${PUBLIC_SCHEME}://${PUBLIC_HOST}${PUBLIC_PORT}/webpack/"
  export CLIENT_PUBLIC_PATH="${PUBLIC_SCHEME}://${PUBLIC_HOST}${PUBLIC_PORT}/webpack/"
else
  export PUBLIC_PATH="${PUBLIC_SCHEME}://${PUBLIC_HOST}${PUBLIC_PORT}/"
fi

exec "$@"
