FROM public.ecr.aws/lambda/nodejs:16

# Install yarn
RUN npm install -g yarn

COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

CMD ["lambda.handler"]
