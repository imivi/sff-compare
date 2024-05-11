FROM node:22-alpine

WORKDIR /bootstrap

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/index.js" ]