\FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

# Clean install to avoid optional native builds
RUN npm install --no-optional --legacy-peer-deps

COPY . .

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
