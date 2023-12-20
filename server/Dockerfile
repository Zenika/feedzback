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

# Server Port
ENV SERVER_PORT=8080

# Firebase configuration
ENV FIREBASE_PROJECT_ID=
ENV FIREBASE_PRIVATE_KEY=
ENV FIREBASE_CLIENT_EMAIL=

# Mailgun configuration
ENV MAILGUN_USERNAME=
ENV MAILGUN_KEY=

ENTRYPOINT [ "node", "/app/dist/main.js"]