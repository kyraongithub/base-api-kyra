FROM node:18-alpine

WORKDIR /app/node

COPY package* .

RUN npm i

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]