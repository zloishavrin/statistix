# BUILD STAGE
FROM node:22-alpine AS builder

WORKDIR /task

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# PRODUCTION STAGE
FROM node:22-alpine

WORKDIR /task

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /task/dist ./dist
COPY --from=builder /task/package.json ./

ENV NODE_ENV=production

EXPOSE 3003

CMD ["node", "dist/main.js"]