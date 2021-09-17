FROM node:12.18.3

WORKDIR .

COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
