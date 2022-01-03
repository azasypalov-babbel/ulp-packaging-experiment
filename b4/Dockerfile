FROM node:14.15.4 as node-modules-builder

ARG NODE_AUTH_TOKEN

WORKDIR /lesson-player.spa/b4
ADD . /lesson-player.spa/b4
EXPOSE 3005

# this value is set in a .env file in this directory
RUN echo "//npm.pkg.github.com/:_authToken=$NODE_AUTH_TOKEN" >> ~/.npmrc

RUN npm ci
