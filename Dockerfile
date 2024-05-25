FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN apk add --no-cache make gcc g++ python3 yarn

RUN yarn install
RUN npm rebuild bcrypt --build-from-source

RUN apk del make gcc g++ python3

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]
