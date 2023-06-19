FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build product-request

CMD ["npm", "run", "start:dev", "catalog-request"]