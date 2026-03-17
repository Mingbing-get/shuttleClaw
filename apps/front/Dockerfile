FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm@8.15.4
RUN pnpm install

COPY . .
RUN pnpm build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]