FROM node:latest
# Create app directory
WORKDIR /usr/src/app

ENV NODE_ENV production

#RUN npm install -g yarn

COPY ./package.docker.json /tmp/package.json

#RUN yarn install --ignore-engines
##RUN npm install --production

RUN cd /tmp && npm install --production
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

COPY ./build/api.users.js ./
COPY ./build/api.users.js.map ./
COPY ./build/apicert.pem ./

#RUN ls -la

EXPOSE 8081

CMD ["node", "./api.users.js"]
#RUN npm run serve-prod

# docker build -t joanmi/apis .
# docker run -p 49160:8080 -d joanmi/apis
# docker exec -it e3e6848020dc  /bin/bash
