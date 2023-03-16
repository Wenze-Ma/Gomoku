# Stage 1: install packages
FROM node:16.10.0-alpine AS BUILD_IMAGE
ENV NODE_ENV=development
WORKDIR /app

RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

COPY package.json ./
COPY yarn.lock ./
COPY . .
RUN yarn install --production
RUN yarn build

# Stage 2: start app
FROM node:16.10.0-alpine
ENV NODE_ENV=development
WORKDIR /app

# RUN addgroup -S react && adduser -S react -G react
# RUN chown -R react /app
# USER react
COPY --from=BUILD_IMAGE /app/build .
# COPY --from=BUILD_IMAGE /app/node_modules ./node_modules

RUN yarn global add serve
CMD ["serve", "-s", "."]
#CMD ["yarn", "start"]
