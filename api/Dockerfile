FROM node:14-alpine

WORKDIR /src
ENV NODE_ENV=production
COPY package.json /src
COPY package-lock.json /src
COPY index.js /src
COPY .env /src
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]
