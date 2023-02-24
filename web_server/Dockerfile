# syntax=docker/dockerfile:1

FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 8080
EXPOSE 3306

CMD [ "node", "server.js" ]

#BUILD
#docker build --tag web_server .

#RUN
#docker run -d --name web_server --publish 8080:8080 --link my-mysql web_server