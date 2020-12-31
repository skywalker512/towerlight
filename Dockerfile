FROM node:14.15.0-alpine3.12
WORKDIR /project
RUN apk add --no-cache --virtual .timezone tzdata \
  && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && apk del .timezone
COPY ./dist .
EXPOSE 3333
CMD [ "node", "/project/apps/main/main.js" ]
