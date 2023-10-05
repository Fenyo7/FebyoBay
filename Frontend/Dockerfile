FROM node:18.16.0 AS build

WORKDIR /usr/local/app
COPY  ./ /usr/local/app

RUN npm install
RUN npm run build

FROM nginx:alpine AS ngi
COPY --from=build /usr/local/app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80