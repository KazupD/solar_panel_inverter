# syntax=docker/dockerfile:1

FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

ENV MYSQL_IP 172.17.0.2
ENV SELF_IP  192.168.1.64

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 8080
EXPOSE 3306

CMD [ "node", "server.js" ]