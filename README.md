# Razzle With Docker Nginx Example

## How to use
Download the example [or clone it](https://github.com/fivethreeo/razzle-with-docker-nginx.git):

```bash
curl https://codeload.github.com/fivethreeo/razzle-with-docker-nginx/tar.gz/master | tar -xz razzle-with-docker-nginx-master
cd razzle-with-docker-nginx-master
```
## In dev files in `razzle/src/` will rebuild and reload in the browser

## To run locally in dev with http on localhost:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

sudo -E docker-compose -f docker-compose.dev.expose.yml up --build
```

## To run locally in dev with https on dev.example.com:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

export LETSENCRYPT_DEFAULT_EMAIL=email@example.com
export VIRTUAL_HOST=dev.example.com
export PUBLIC_SCHEME=https


export CERTS_VOLUME=nginx_certs
export VHOST_D_VOLUME=nginx_vhost_d
export HTML_VOLUME=nginx_html

docker volume create ${CERTS_VOLUME}
docker volume create ${VHOST_D_VOLUME}
docker volume create ${HTML_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.yml up -d
sudo -E docker-compose -f docker-compose.dev.yml up --build -d
```


## To run locally in dev with https on dev.example.com, with nginx-proxy on other computer:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

sudo -E docker-compose -f docker-compose.dev.expose.yml up --build -d

On other computer

export LETSENCRYPT_DEFAULT_EMAIL=email@example.com
export VIRTUAL_HOST=dev.example.com
export PUBLIC_SCHEME=https

export BACKEND=other.ip:80


export CERTS_VOLUME=nginx_certs
export VHOST_D_VOLUME=nginx_vhost_d
export HTML_VOLUME=nginx_html

docker volume create ${CERTS_VOLUME}
docker volume create ${VHOST_D_VOLUME}
docker volume create ${HTML_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.yml up -d
sudo -E docker-compose -f docker-compose.forward.yml up

```

## In production with https on example.com:

```bash

export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

export LETSENCRYPT_DEFAULT_EMAIL=email@example.com
export VIRTUAL_HOST=example.com
export PUBLIC_SCHEME=https


export CERTS_VOLUME=nginx_certs
export VHOST_D_VOLUME=nginx_vhost_d
export HTML_VOLUME=nginx_html

docker volume create ${CERTS_VOLUME}
docker volume create ${VHOST_D_VOLUME}
docker volume create ${HTML_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.yml up -d
sudo -E docker-compose -f docker-compose.yml up --build -d
```

## Idea behind the example
This is a basic, bare-bones example of how to use razzle. It satisfies the entry points
`src/index.js` for the server and and `src/client.js` for the browser.
