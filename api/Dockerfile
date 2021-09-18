FROM node:14-alpine

WORKDIR /src
ENV NODE_ENV=production
ENV DBURL=postgres://usuario:senha@db:5432/sereducacional
COPY . /src
RUN npm ci
EXPOSE 5000
CMD ["node", "index.js"]
