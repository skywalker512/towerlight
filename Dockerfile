FROM node:14.15.0-alpine3.12 AS builder
WORKDIR /project
COPY . .
RUN yarn install --frozen-lockfile \
  && yarn nx run-many --target=build --projects=main,forum --parallel --prod \
  && yarn ncc build node_modules/react/index.js -o dist/node_modules/react

FROM node:14.15.0-alpine3.12
WORKDIR /project
RUN apk add --no-cache --virtual .timezone tzdata \
  && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && apk del .timezone
COPY --from=builder /project/dist .
EXPOSE 3333
CMD [ "node", "/project/apps/main/main.js" ]
