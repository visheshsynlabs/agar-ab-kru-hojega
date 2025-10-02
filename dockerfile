# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package.json first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

# Build the app
RUN npm run build


# ---- Run Stage ----
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Serve the dist folder
CMD ["serve", "-s", "dist", "-l", "3000"]
