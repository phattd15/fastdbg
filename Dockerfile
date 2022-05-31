FROM alpine:latest

# RUN apk add python3 g++ make 
RUN apk update
RUN apk add --update nodejs npm python3

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]