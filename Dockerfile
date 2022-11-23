FROM node:latest as build
WORKDIR /api
ADD . /api
COPY package*.json ./
COPY . ./api
RUN npm install
RUN npm run build

FROM node:latest as run
WORKDIR /built
COPY --from=build ./api .
RUN npm install
CMD ["node", "./build/index.js"]