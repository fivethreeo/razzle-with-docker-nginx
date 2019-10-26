FROM node:8-alpine as base
# Creating working directory
RUN mkdir /code
WORKDIR /code

ARG PUBLIC_PATH=https://localhost/
ARG CLIENT_PUBLIC_PATH=https://localhost/

ENV PUBLIC_PATH=${PUBLIC_PATH} CLIENT_PUBLIC_PATH=${PUBLIC_PATH}

# Copying requirements
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN apk add --no-cache --virtual .build-deps \
    musl-dev git \
    && yarn install \
    && cp yarn.lock yarn_run.lock \
    && cp -R node_modules node_modules_run \
    && yarn install --dev \
    && runDeps="$( \
        scanelf --needed --nobanner --recursive /usr/local \
                | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
                | sort -u \
                | xargs -r apk info --installed \
                | sort -u \
    )" \
    && apk add --virtual .rundeps $runDeps \
    && apk del .build-deps

FROM base as dev

RUN rm -rf node_modules_run && rm yarn_run.lock

# Start server 
CMD ["yarn", "start"]

FROM base as prod

COPY src src/
COPY public public/
COPY razzle.config.js razzle.config.js

RUN yarn build \
    && rm -rf node_modules \
    && rm yarn.lock \
    && mv node_modules_run node_modules \
    && mv yarn_run.lock yarn.lock \
    && rm -rf src public razzle.config.js

# Start server 
CMD ["yarn", "start:prod"]
