# Razzle With Docker Nginx Example

## How to use
Download the example [or clone it](https://github.com/fivethreeo/razzle-with-docker-nginx.git):

```bash
curl https://codeload.github.com/fivethreeo/razzle-with-docker-nginx/tar.gz/master | tar -xz razzle-with-docker-nginx-master
cd razzle-with-docker-nginx-master

# Ensure BUILDKIT support
sudo curl -L https://github.com/docker/compose/releases/download/1.27.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install certutil
sudo apt-get install libnss3-tools
```
In dev files in `razzle/src/` will rebuild and reload in the browser

## To run locally in dev with https on localhost:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

export SSL_VOLUME=nginx_ssl
export NGINX_VOLUME=nginx_conf
export SSL_VOLUME_PATH=$(pwd)/ssl

sudo -E docker volume create ${SSL_VOLUME}
sudo -E docker volume create ${NGINX_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.yml up -d
sudo -E docker-compose -f docker-compose.dev.yml up --build -d

certutil -d sql:$HOME/.pki/nssdb -A -t "TCu,Cuw,Tuw" -n localhost \
-i ssl/certs/localhost.selfsigned.crt

certutil -d sql:$(dirname $(find  ~/.mozilla* -name "cert9.db")) -A -t "TCu,Cuw,Tuw" -n localhost \
-i ssl/certs/localhost.selfsigned.crt
```

## To run in dev with https on dev.example.com using letsencrypt:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

export LETSENCRYPT_DEFAULT_EMAIL=email@example.com
export VIRTUAL_HOST=dev.example.com

export SSL_VOLUME=nginx_ssl
export NGINX_VOLUME=nginx_conf

sudo -E docker volume create ${SSL_VOLUME}
sudo -E docker volume create ${NGINX_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.yml up -d
sudo -E docker-compose -f docker-compose.dev.yml up --build -d
```

## In production with https on example.com using letsencrypt:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

export LETSENCRYPT_DEFAULT_EMAIL=email@example.com
export VIRTUAL_HOST=example.com

export SSL_VOLUME=nginx_ssl
export NGINX_VOLUME=nginx_conf

sudo -E docker volume create ${SSL_VOLUME}
sudo -E docker volume create ${NGINX_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.yml up -d
sudo -E docker-compose -f docker-compose.yml up --build -d
```

## Idea behind the example
This is a basic, bare-bones example of how to use razzle. It satisfies the entry points
`src/index.js` for the server and and `src/client.js` for the browser.
