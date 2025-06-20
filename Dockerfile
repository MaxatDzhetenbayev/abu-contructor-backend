FROM node:22 as dependencies
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM node:22 as builder
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs22-debian12:latest
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

COPY package.json ./

EXPOSE 3003

CMD ["dist/main.js"]