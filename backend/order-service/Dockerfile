FROM node:20-alpine
WORKDIR /app
COPY order-service/package*.json ./
RUN npm install
COPY order-service/. .
COPY shared ./shared
COPY shared /shared
RUN npm install --prefix /shared
EXPOSE 3003
CMD ["npm", "start"]
