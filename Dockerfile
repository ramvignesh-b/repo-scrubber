FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build --configuration=production

FROM caddy:alpine

COPY --from=builder /app/dist/repo-scrubber/browser/ /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
