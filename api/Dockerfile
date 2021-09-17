FROM node:12.18.3

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install --production
RUN node initdb.js
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
