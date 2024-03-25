# Start the final image
FROM cypress/browsers:node-20.11.0-chrome-121.0.6167.184-1-ff-123.0-edge-121.0.2277.128-1

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
