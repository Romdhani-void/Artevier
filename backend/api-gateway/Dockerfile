FROM node:20-alpine
WORKDIR /app
COPY api-gateway/package*.json ./
RUN npm install
COPY api-gateway/. .
COPY shared ./shared
COPY shared /shared
RUN rm -rf /shared/node_modules && npm install --prefix /shared --no-cache && test -d /shared/node_modules/winston
EXPOSE 3000
CMD ["npm", "start"]
