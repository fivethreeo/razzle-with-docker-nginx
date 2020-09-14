
FROM node:12-alpine as razzle_base
# Creating working directory
RUN mkdir /code
WORKDIR /code

ARG PUBLIC_PATH=https://localhost/

ENV PUBLIC_PATH=${PUBLIC_PATH}

COPY razzle/razzle_entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Copying requirements
COPY razzle/package.json package.json
COPY razzle/yarn.lock yarn.lock

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

RUN chmod u+x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

FROM razzle_base as razzle_development

ENV RAZZLE_ENV=development

RUN rm -rf node_modules_run && rm yarn_run.lock

EXPOSE 3001

# Start server
CMD ["yarn", "start"]

FROM razzle_base as razzle_production

ENV RAZZLE_ENV=production

COPY razzle/src src/
COPY razzle/public public/
COPY razzle/razzle.config.js razzle.config.js

RUN yarn build \
    && rm -rf node_modules \
    && rm yarn.lock \
    && mv node_modules_run node_modules \
    && mv yarn_run.lock yarn.lock \
    && rm -rf src public razzle.config.js

EXPOSE 3000

# Start server
CMD ["yarn", "start:prod"]

FROM nginx:stable-alpine as nginx_development

ARG BUILD_TYPE=advanced

ENV HASURA_UPSTREAM_HOST="hasura"
ENV KEYCLOAK_UPSTREAM_HOST="keycloak"
ENV RAZZLE_UPSTREAM_HOST="razzle"
ENV HASURA_UPSTREAM_PORT="8080"
ENV KEYCLOAK_UPSTREAM_PORT="8080"
ENV RAZZLE_UPSTREAM_PORT="3001"

COPY nginx/nginx_entrypoint.sh /usr/local/bin/docker-entrypoint.sh

COPY nginx/${BUILD_TYPE}/default_dev.conf.template /etc/nginx/conf.d/default.template

RUN chmod u+x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]

FROM nginx:stable-alpine as nginx_production

ARG BUILD_TYPE=advanced

ENV HASURA_UPSTREAM_HOST="hasura"
ENV KEYCLOAK_UPSTREAM_HOST="keycloak"
ENV RAZZLE_UPSTREAM_HOST="razzle"
ENV HASURA_UPSTREAM_PORT="8080"
ENV KEYCLOAK_UPSTREAM_PORT="8080"
ENV RAZZLE_UPSTREAM_PORT="3000"

COPY nginx/nginx_entrypoint.sh /usr/local/bin/docker-entrypoint.sh

COPY nginx/${BUILD_TYPE}/default.conf.template /etc/nginx/conf.d/default.template

COPY --from=razzle_production /code/build/public/ /usr/share/nginx/html/

RUN chmod u+x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
