# BUILD STAGE
FROM node:22-alpine AS builder

WORKDIR /notification

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# PRODUCTION STAGE
FROM node:22-alpine

WORKDIR /notification

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /notification/dist ./dist
COPY --from=builder /notification/package.json ./

ENV NODE_ENV=production

EXPOSE 3004

CMD ["node", "dist/main.js"]