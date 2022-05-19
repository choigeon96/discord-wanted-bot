FROM node:16
WORKDIR /WANTED-BOT
COPY . /WANTED-BOT/

RUN npm install

RUN cd ./node_modules/puppeteer
RUN npm install

CMD npm run start:dev