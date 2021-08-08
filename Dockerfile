FROM node:12-buster

WORKDIR /app

## We just need the build and package to execute the command
COPY ./node_modules node_modules
COPY ./scripts scripts

CMD [ "node", "scripts/upload.js" ]