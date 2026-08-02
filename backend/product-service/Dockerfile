FROM node:20-alpine
WORKDIR /app
COPY product-service/package*.json ./
RUN npm install
COPY product-service/. .
COPY shared ./shared
COPY shared /shared
EXPOSE 3002
CMD ["npm", "start"]