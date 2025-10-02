#!/bin/bash
set -euo pipefail

# ----------------------
# Parameters handling
# ----------------------
NAMESPACE=""
TAG=""
SHOPS_FILTER=()

# Allowed namespaces
ALLOWED_NAMESPACES=("backoffice" "api" "mp" "yves" "ssp")

# All valid shop IDs (for validation of --shops)
VALID_SHOP_IDS=("suite" "b2b-mp" "b2b" "b2c-mp" "b2c")

# Parse arguments (supports both --param VALUE and --param=VALUE)
while [[ $# -gt 0 ]]; do
  case $1 in
    --namespace=*)
      NAMESPACE="${1#*=}"
      shift
      ;;
    --namespace)
      NAMESPACE="$2"
      shift 2
      ;;
    --tag=*)
      TAG="${1#*=}"
      shift
      ;;
    --tag)
      TAG="$2"
      shift 2
      ;;
    --shops=*)
      IFS=',' read -ra SHOPS_FILTER <<< "${1#*=}"
      shift
      ;;
    --shops)
      IFS=',' read -ra SHOPS_FILTER <<< "$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      echo "Usage: $0 [--namespace value] [--tag value] [--shops value1,value2,...]"
      exit 1
      ;;
  esac
done

# Validate namespace if provided
if [[ -n "$NAMESPACE" ]]; then
  if [[ ! " ${ALLOWED_NAMESPACES[*]} " =~ " $NAMESPACE " ]]; then
    echo "Invalid namespace: $NAMESPACE"
    echo "Allowed namespaces: ${ALLOWED_NAMESPACES[*]}"
    exit 1
  fi
fi

# Validate shops filter if provided
if [[ ${#SHOPS_FILTER[@]} -gt 0 ]]; then
  for SHOP in "${SHOPS_FILTER[@]}"; do
    if [[ ! " ${VALID_SHOP_IDS[*]} " =~ " $SHOP " ]]; then
      echo "Invalid shop: $SHOP"
      echo "Allowed shops: ${VALID_SHOP_IDS[*]}"
      exit 1
    fi
  done
fi

# ----------------------
# Paths
# ----------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cypress tests root
CY_DIR="$SCRIPT_DIR/../../.."
ENV_FILE="$CY_DIR/.env"
RESULTS_DIR="$SCRIPT_DIR/results"

# Projects directory (parent of suite-nonsplit)
PROJECTS_DIR="$(cd "$CY_DIR/../../../" && pwd)"

mkdir -p "$RESULTS_DIR"

# ----------------------
# Shops
# ----------------------
SHOPS=(
  "suite-nonsplit:suite"
  "b2b-demo-marketplace:b2b-mp"
  "b2b-demo-shop:b2b"
  "b2c-demo-marketplace:b2c-mp"
  "b2c-demo-shop:b2c"
)

# ----------------------
# Main loop
# ----------------------
for ENTRY in "${SHOPS[@]}"; do
  SHOP_PATH="${ENTRY%%:*}"   # repo name
  SHOP_ID="${ENTRY##*:}"     # env id

  # Skip shop if --shops filter is active
  if [[ ${#SHOPS_FILTER[@]} -gt 0 ]]; then
    if [[ ! " ${SHOPS_FILTER[*]} " =~ " $SHOP_ID " ]]; then
      continue
    fi
  fi

  echo "=============================================="
  echo " Running Cypress tests for $SHOP_ID"
  echo "=============================================="

  # Start shop
  pushd "$PROJECTS_DIR/$SHOP_PATH" > /dev/null
  echo "Starting shop: $SHOP_ID ..."
  docker/sdk start
  popd > /dev/null

  # Update .env (replace first line)
  echo "Updating .env file..."
  sed -i.bak "1s|.*|ENV_REPOSITORY_ID=$SHOP_ID|" "$ENV_FILE"

  # Build npm run command
  NPM_CMD="npm run cy:ci"
  if [[ -n "$NAMESPACE" ]]; then
    NPM_CMD+=":$NAMESPACE"
  fi
  if [[ -n "$TAG" ]]; then
    NPM_CMD+=" -- --env grep=$TAG"
  fi

  # Run Cypress
  echo "Running Cypress for $SHOP_ID with command: $NPM_CMD"
  pushd "$CY_DIR" > /dev/null
  mkdir -p "$RESULTS_DIR"

  set +e
  eval "$NPM_CMD" > "$RESULTS_DIR/${SHOP_ID}.txt" 2>&1
  STATUS=$?
  set -e

  if [ $STATUS -eq 0 ]; then
    echo "✅ Cypress finished for $SHOP_ID"
  else
    echo "❌ Cypress failed for $SHOP_ID (see $RESULTS_DIR/${SHOP_ID}.txt)"
  fi
  popd > /dev/null

  # Stop shop
  pushd "$PROJECTS_DIR/$SHOP_PATH" > /dev/null
  echo "Stopping shop: $SHOP_ID ..."
  docker/sdk stop
  popd > /dev/null

  echo "Done with $SHOP_ID"
  echo
done

echo "🎉 All Cypress tests completed. Results are in $RESULTS_DIR/"
