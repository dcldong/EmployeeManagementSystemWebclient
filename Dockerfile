FROM  nginx:alpine

COPY ./nginx /etc/nginx/conf.d
COPY ./dist /usr/share/nginx/html
