FROM public.ecr.aws/lambda/nodejs:16

COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

CMD ["lambda.handler"]
