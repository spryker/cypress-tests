#!/bin/bash


mkdir -p artifacts

docker-compose -f docker-compose.cypress-post-deploy.yml up -d

# Run the cypress smoke tests in the cypress-tests service's container
# If the tests fail, upload the artifacts to the specified AWS S3 bucket
if ! docker-compose -f docker-compose.cypress-post-deploy-workflow.yml exec -T cypress-tests bash -c "ENV_REPOSITORY_ID=$DEMO_SHOP_TYPE npm run $NPM_COMMAND"; then
    AWS_DEFAULT_REGION=$ROBOT_TESTS_ARTIFACTS_BUCKET_REGION AWS_ACCESS_KEY_ID=$ROBOT_TESTS_ARTIFACTS_KEY AWS_SECRET_ACCESS_KEY=$ROBOT_TESTS_ARTIFACTS_SECRET aws s3 cp .artifacts s3://$ROBOT_TESTS_ARTIFACTS_BUCKET/cypress-ui/$DEMO_SHOP_TYPE/post-deploy/$CODEBUILD_BUILD_ID/ \
                         --recursive \
                         --expires "$(date -d '+7 days' --utc +'%Y-%m-%dT%H:%M:%SZ')"

    echo "Error: Cypress tests failed. Artifacts are uploaded to s3://$ROBOT_TESTS_ARTIFACTS_BUCKET/cypress-ui/$DEMO_SHOP_TYPE/post-deploy/$CODEBUILD_BUILD_ID/"
    exit 1
fi

docker-compose -f docker-compose.cypress-post-deploy.yml down
