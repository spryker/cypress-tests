# Start the final image
FROM cypress/browsers:latest

# Set and create the working directory
ENV CYPRESS_TESTS_WORK_DIR /opt/cypress-tests
RUN mkdir -p ${CYPRESS_TESTS_WORK_DIR}

# Set the working directory
WORKDIR ${CYPRESS_TESTS_WORK_DIR}

# Copy the cypress tests to the working directory
COPY . .

# Install the dependencies
RUN npm install

# Starts a bash shell in the container that ignores termination signals and keeps the container running indefinitely.
ENTRYPOINT ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
