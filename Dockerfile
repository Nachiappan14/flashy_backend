FROM node:latest
ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install --production

EXPOSE 15000

CMD [ "node", "index.js" ]
