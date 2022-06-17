FROM node:latest AS client

WORKDIR /app/client

COPY . ./

RUN npm i -S serve
RUN npm install

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "serve"]