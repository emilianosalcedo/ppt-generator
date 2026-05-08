FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY index.js ./
RUN mkdir -p input output
CMD ["npm", "start"]
