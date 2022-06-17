FROM node:latest

WORKDIR /app

COPY . .

RUN npm install pm2 -g

RUN npm install

EXPOSE 3000

CMD ["pm2-runtime", "index.js"];