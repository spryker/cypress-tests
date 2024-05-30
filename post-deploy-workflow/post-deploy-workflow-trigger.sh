#!/bin/bash

# Parse arguments
for arg in "$@"
do
    case $arg in
        --deploy-file=*)
        DEPLOY_FILE="${arg#*=}"
        shift
        ;;
        --demo-shop-type=*)
        DEMO_SHOP_TYPE="${arg#*=}"
        shift
        ;;
        --npm-command=*)
        NPM_COMMAND="${arg#*=}"
        shift
        ;;
    esac
done

# Check if demo shop type is specified
if [ -z "$DEMO_SHOP_TYPE" ]; then
    echo "Error: --demo-shop-type is not specified"
    exit 1
fi

# Check if npm command is specified
if [ -z "$NPM_COMMAND" ]; then
    echo "Error: --npm-command is not specified"
    exit 1
fi

# Function to extract host by application type using sed
extract_host() {
    local app_type="$1"
    awk -v app="$app_type" '
    $0 ~ "application: " app {found=1}
    found && $0 ~ "endpoints:" {getline; print; exit}
    ' "$DEPLOY_FILE" | awk -F: '{gsub(/[ \t]+/, "", $1); print $1}'
}

# Extract domain names based on application type
SPRYKER_BE_HOST=$(extract_host "backoffice")
SPRYKER_MP_HOST=$(extract_host "merchant-portal")
SPRYKER_API_HOST=$(extract_host "glue")
SPRYKER_GLUE_BACKEND_HOST=$(extract_host "glue-backend")
SPRYKER_GLUE_STOREFRONT_HOST=$(extract_host "glue-storefront")
SPRYKER_FE_HOST=$(extract_host "yves")
SPRYKER_SMTP_HOST=${SPRYKER_SMTP_HOST}
SPRYKER_SSL_ENABLED=${SPRYKER_SSL_ENABLED}
CODEBUILD_BUILD_ID=${CODEBUILD_BUILD_ID}

# List of variable names
SPRYKER_VARS="CODEBUILD_BUILD_ID DEMO_SHOP_TYPE NPM_COMMAND SPRYKER_BE_HOST SPRYKER_MP_HOST SPRYKER_API_HOST SPRYKER_GLUE_BACKEND_HOST SPRYKER_GLUE_STOREFRONT_HOST SPRYKER_FE_HOST SPRYKER_SMTP_HOST SPRYKER_SSL_ENABLED"

# Prepare the client payload
client_payload='{"workflow":"true"'

# Add SPRYKER_ environment variables to the client payload
for var in $SPRYKER_VARS; do
    value=${!var}
    client_payload+=',"'"$var"'":"'"$value"'"'
done

client_payload+='}'

curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_WORKFLOW_RUNNER_BEARER_TOKEN}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/${GITHUB_WORKFLOW_RUNNER_GITHUB_ORG_NAME}/${GITHUB_WORKFLOW_RUNNER_GITHUB_REPOSITORY}/dispatches \
  -d '{"event_type":"post-deploy-workflow","client_payload":'"$client_payload"'}'
