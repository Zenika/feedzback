# Building layer
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Running layer
FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

EXPOSE 3000

ENV SERVER_PORT=3000

ENV CLIENT_URL=

ENV FIREBASE_PROJECT_ID=
ENV FIREBASE_PRIVATE_KEY=
ENV FIREBASE_CLIENT_EMAIL=

ENV MAILGUN_USERNAME=
ENV MAILGUN_KEY=
ENV MAILGUN_URL=
ENV MAILGUN_DOMAIN=

ENV CRYPTO_SECRET_KEY=
ENV CRYPTO_SECRET_IV=

ENV NODE_ENV=

ENTRYPOINT [ "node", "/app/dist/main.js"]
