FROM node:18.14.2-alpine

# Create app directory
# WORKDIR /home/ubuntu/aoli/laneige-backend/
WORKDIR /home/ubuntu/aoli/laneige-backend/
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci

# set ownership and permissions
RUN chown -R node:node ./
#switch to node user
USER node

# Bundle app source
COPY . .

EXPOSE 4000
CMD [ "node", "server.js" ]