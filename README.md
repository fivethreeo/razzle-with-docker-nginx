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

export CERTS_VOLUME_PATH=$(pwd)/certs
export CERTS_VOLUME=nginx_certs

export NGINX_VOLUME=nginx_conf
export VHOST_D_VOLUME=nginx_vhost_d
export HTML_VOLUME=nginx_html

export POSTGRES_VOLUME=postgres_data
export POSTGRES_PASSWORD=postgrespassword

export KEYCLOAK_USER=admin
export KEYCLOAK_PASSWORD=password

sudo -E docker volume create ${CERTS_VOLUME}
sudo -E docker volume create ${VHOST_D_VOLUME}
sudo -E docker volume create ${HTML_VOLUME}
sudo -E docker volume create ${POSTGRES_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.dev.yml up -d
sudo -E docker-compose -f docker-compose.hasura.yml up -d
sudo -E docker-compose -f docker-compose.keycloak.yml up -d
sudo -E docker-compose -f docker-compose.dev.yml up --build -d

cd certs
rm localhost*
bash makecert.sh --dn-c "US" --dn-st "TX" --dn-l "Houston" \
  --dn-o "Your organization" --dn-ou "Your department" \
  --dn-email "your@email.com" \
  --common-name "localhost" --dns "localhost" --ip "127.0.0.1" --https

certutil -d sql:$HOME/.pki/nssdb -A -t "TCu,Cuw,Tuw" -n localhost \
-i localhost_https_ca.pem

certutil -d sql:$(dirname $(find  ~/.mozilla* -name "cert9.db")) -A -t "TCu,Cuw,Tuw" -n localhost \
-i localhost_https_ca.pem
```

## To run in dev with https on dev.example.com using letsencrypt:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

export LETSENCRYPT_DEFAULT_EMAIL=email@example.com
export VIRTUAL_HOST=dev.example.com

export CERTS_VOLUME_PATH=$(pwd)/certs
export CERTS_VOLUME=nginx_certs

export NGINX_VOLUME=nginx_conf
export VHOST_D_VOLUME=nginx_vhost_d
export HTML_VOLUME=nginx_html

export POSTGRES_VOLUME=postgres_data
export POSTGRES_PASSWORD=postgrespassword

export KEYCLOAK_USER=admin
export KEYCLOAK_PASSWORD=password

sudo -E docker volume create ${CERTS_VOLUME}
sudo -E docker volume create ${VHOST_D_VOLUME}
sudo -E docker volume create ${HTML_VOLUME}
sudo -E docker volume create ${POSTGRES_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.dev.yml up -d
sudo -E docker-compose -f docker-compose.hasura.yml up -d
sudo -E docker-compose -f docker-compose.keycloak.yml up -d
sudo -E docker-compose -f docker-compose.dev.yml up --build -d

sudo docker network inspect \
    -f '{{ range $key, $value := .Containers }}{{printf "%s: %s\n" $key .Name}}{{ end }}' \
    razzle-with-docker-nginx_default
```

## In production with https on example.com using letsencrypt:

```bash
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1

export LETSENCRYPT_DEFAULT_EMAIL=email@example.com
export VIRTUAL_HOST=example.com

export CERTS_VOLUME_PATH=$(pwd)/certs
export CERTS_VOLUME=nginx_certs

export NGINX_VOLUME=nginx_conf
export VHOST_D_VOLUME=nginx_vhost_d
export HTML_VOLUME=nginx_html

export POSTGRES_VOLUME=postgres_data
export POSTGRES_PASSWORD=postgrespassword

export KEYCLOAK_USER=admin
export KEYCLOAK_PASSWORD=password

sudo -E docker volume create ${CERTS_VOLUME}
sudo -E docker volume create ${VHOST_D_VOLUME}
sudo -E docker volume create ${HTML_VOLUME}
sudo -E docker volume create ${POSTGRES_VOLUME}

sudo -E docker-compose -f docker-compose.proxy.yml up -d
sudo -E docker-compose -f docker-compose.hasura.yml up -d
sudo -E docker-compose -f docker-compose.keycloak.yml up -d
sudo -E docker-compose -f docker-compose.yml up --build -d
```

## Idea behind the example
This is a basic, bare-bones example of how to use razzle. It satisfies the entry points
`src/index.js` for the server and and `src/client.js` for the browser.
