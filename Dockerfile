FROM alpine:3.14
WORKDIR /project
RUN apk add --no-cache --virtual .timezone tzdata \
  && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && apk del .timezone \
  && apk add --no-cache nodejs
COPY ./dist .
EXPOSE 3333
CMD [ "node", "/project/apps/main/main.js" ]
