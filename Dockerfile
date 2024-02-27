# Start the final image
FROM cypress/browsers:latest

# Set and create the working directory
ENV CYPRESS_TESTS_WORK_DIR /opt/cypress-tests
RUN mkdir -p ${CYPRESS_TESTS_WORK_DIR}

# Set the working directory
WORKDIR ${CYPRESS_TESTS_WORK_DIR}

# Copy the package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Source the .env file to export the variables
ENTRYPOINT ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
