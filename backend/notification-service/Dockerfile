FROM node:20-alpine
WORKDIR /app
COPY notification-service/package*.json ./
RUN npm install
COPY notification-service/. .
COPY shared ./shared
COPY shared /shared
RUN npm install --prefix /shared
EXPOSE 3004
CMD ["npm", "start"]
