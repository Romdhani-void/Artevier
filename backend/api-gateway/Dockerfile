FROM node:20-alpine
WORKDIR /app
COPY api-gateway/package*.json ./
RUN npm install
COPY api-gateway/. .
COPY shared ./shared
COPY shared /shared
RUN npm install --prefix /shared
EXPOSE 3000
CMD ["npm", "start"]
