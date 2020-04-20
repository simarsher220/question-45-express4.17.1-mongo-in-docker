FROM node:dubnium-buster-slim

USER root

RUN apt-get update && apt-get install --assume-yes wget

# Pre build commands
RUN wget https://codejudge-starter-repo-artifacts.s3.ap-south-1.amazonaws.com/backend-project/springboot/maven/2.x/pre-build-2.sh
RUN chmod 775 ./pre-build-2.sh
RUN sh pre-build-2.sh

# Pre build commands
RUN wget https://codejudge-starter-repo-artifacts.s3.ap-south-1.amazonaws.com/backend-project/database/db-setup.sh
RUN chmod 775 ./db-setup.sh
RUN sh db-setup.sh

# Pre Build Commands
# RUN wget https://codejudge-starter-repo-artifacts.s3.ap-south-1.amazonaws.com/backend-project/node/express/pre-build.sh
# RUN chmod 775 ./pre-build.sh
# RUN sh pre-build.sh

COPY . /tmp/
WORKDIR /tmp/

EXPOSE 8080

# Build the app
RUN wget https://codejudge-starter-repo-artifacts.s3.ap-south-1.amazonaws.com/backend-project/node/express/build.sh
RUN chmod 775 ./build.sh
RUN sh build.sh

# Add extra docker commands here (if any)...

# Run the app
# RUN wget https://codejudge-starter-repo-artifacts.s3.ap-south-1.amazonaws.com/backend-project/node/express/run.sh
RUN chmod 775 ./run.sh
CMD sh run.sh