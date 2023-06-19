FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build gateway

CMD ["npm", "run", "start:dev", "gateway"]
#CMD ["npm", "run", "start:debug"]