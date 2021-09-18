FROM node:14-alpine

WORKDIR /src
ENV NODE_ENV=production
COPY . /src
RUN npm ci
EXPOSE 5000
CMD ["node", "index.js"]
