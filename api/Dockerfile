FROM node:14-alpine

WORKDIR /src
COPY package.json /src
COPY package-lock.json /src
COPY index.js /src
COPY .env /src
COPY .env /
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]
