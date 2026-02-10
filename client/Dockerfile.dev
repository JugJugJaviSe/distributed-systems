FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# --host -> tells Vite to bind to all network interfaces (0.0.0.0) instead of just localhost, so the browser (outside of the container) can reach it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]