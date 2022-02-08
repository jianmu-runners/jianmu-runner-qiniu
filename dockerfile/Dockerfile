FROM node:12-buster

WORKDIR /app

CMD ["yarn"]
COPY ../node_modules node_modules
COPY ../scripts scripts

# CMD [ "node", "/app/scripts/upload.js" ]