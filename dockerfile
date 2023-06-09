FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install n -g

RUN n 16.14.2

RUN npm install --registry=https://registry.npm.taobao.org

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm","run","serve"]
