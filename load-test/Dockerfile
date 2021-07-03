FROM node:14.16.1-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY test.js ./

RUN npm install


CMD [ "node", "test.js" ]