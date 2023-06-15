FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build order

CMD ["npm", "run", "start:dev", "order"]