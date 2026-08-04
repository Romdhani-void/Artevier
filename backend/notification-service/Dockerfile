FROM node:20-alpine
WORKDIR /app
COPY notification-service/package*.json ./
RUN npm install
COPY notification-service/. .
COPY shared ./shared
COPY shared /shared
RUN rm -rf /shared/node_modules && npm install --prefix /shared --no-cache && test -d /shared/node_modules/winston
EXPOSE 3004
CMD ["npm", "start"]
