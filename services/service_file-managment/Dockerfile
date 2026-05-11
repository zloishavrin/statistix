# BUILD STAGE
FROM node:22-alpine AS builder

WORKDIR /file-managment

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# PRODUCTION STAGE
FROM node:22-alpine

WORKDIR /file-managment

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /file-managment/dist ./dist
COPY --from=builder /file-managment/package.json ./

ENV NODE_ENV=production

EXPOSE 3002

CMD ["node", "dist/main.js"]