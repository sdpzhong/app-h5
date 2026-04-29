FROM nginx:stable-alpine

LABEL version="1.0"
LABEL name="iot web"
LABEL maintainer="wangdz"
LABEL author="wangdz"
LABEL email="wangdz@china-jado.com"

COPY mime.types /etc/nginx/
COPY dist.zip /tmp/

RUN tar zxf /tmp/dist.zip -C /tmp && ls /tmp &&  cp -rf /tmp/dist/. /usr/share/nginx/html/ && rm -rf /tmp/*
# RUN unzip -o /tmp/dist.zip -d /tmp/test && ls /tmp/test && cp -rf /tmp/test/dist/. /usr/share/nginx/html/ && rm -rf /tmp/* 


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
