FROM node:12-buster

WORKDIR /app

COPY ./node_modules node_modules
COPY ./scripts scripts

CMD [ "node", "scripts/upload.js" ]