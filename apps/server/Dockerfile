FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm@8.15.4
RUN pnpm install

COPY . .
RUN pnpm build

EXPOSE 3010

CMD ["node", "./dist/index.js"]