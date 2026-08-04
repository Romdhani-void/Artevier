FROM node:20-alpine
WORKDIR /app
COPY user-service/package*.json ./
RUN npm install
COPY user-service/. .
COPY shared ./shared
COPY shared /shared
RUN rm -rf /shared/node_modules && npm install --prefix /shared --no-cache && test -d /shared/node_modules/winston
EXPOSE 3001
CMD ["npm", "start"]