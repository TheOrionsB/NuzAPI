FROM node:latest as build
WORKDIR /api
ADD . /api
COPY package*.json ./
COPY . .
RUN npm install
CMD ["npm", "run" ,"build"]

FROM node:latest as run
WORKDIR /built
COPY --from=build /api/package*.json /built
COPY --from=build /api/build /built
RUN npm install
CMD ["node", "index.js"]
