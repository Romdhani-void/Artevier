FROM node:20-alpine
WORKDIR /app
COPY product-service/package*.json ./
RUN npm install
COPY product-service/. .
COPY shared ./shared
COPY shared /shared
RUN rm -rf /shared/node_modules && npm install --prefix /shared --no-cache && test -d /shared/node_modules/winston
EXPOSE 3002
CMD ["npm", "start"]