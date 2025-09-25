# Multi-Store Cypress Runner

This script automates running Cypress tests across multiple Spryker demoshops. It rotates (starts / stops) demoshop environments, run the tests with optional namespace and tag filters, and collects results into a dedicated directory.

---

## Prerequisites

```bash
chmod +x cypress-multistore-runner.sh
```

### Environments
 - A working Spryker demoshop setup:
   - All demoshops are cloned in the same parent directory.
   - Environments successfully built.
   - Queue messages are successfully consumed with empty queues.
 - All environments are initially **STOPPED** (docker/sdk stop) to mitigate unexpected issues.

### Directory structure
Out of the box the script expects demoshop directories to be named after repositories.
Entire directory structure is expected to look like this:
```
{parent_directory}/
├── suite-nonsplit/
│ └── tests/cypress-tests/tools/scripts/multi-store-runner/cypress-multistore-runner.sh
├── b2b-demo-marketplace/
├── b2b-demo-shop/
├── b2c-demo-marketplace/
└── b2c-demo-shop/
```


## Usage

The script writes test results to `./results/`.


### Basic

Run Cypress tests for all shops:

```bash
./cypress-multistore-runner.sh
```
### With Namespace

Run Cypress tests for all shops using a specific namespace (e.g., yves):

```bash
./cypress-multistore-runner.sh --namespace=yves
```

### With Tag

Run Cypress tests for all shops filtering by tag (e.g., @company-user):

```bash
./cypress-multistore-runner.sh --tag=@company-user
```

### Run Specific Shops

Run tests for specific demo shops by ENV_REPOSITORY_ID (`suite`, `b2b-mp`, `b2b`, `b2c-mp`, `b2c`):

```bash
./cypress-multistore-runner.sh --shops=suite,b2b-mp
```

### Combine Namespace, Tag, and Shops
```bash
./cypress-multistore-runner.sh --namespace=yves --tag=@company-user --shops=b2c-mp,b2c
```

## Script Behavior

For each selected shop:

- Start the shop using docker/sdk start.
- Update the Cypress .env file with the shop's ENV_REPOSITORY_ID.
- Run Cypress tests with optional namespace and tag filters.
- Save results to multi-store-runner/results/<shop-id>.txt.
- Stop the shop using docker/sdk stop.

The script prints logs to the console, including whether each shop’s tests passed or failed.

## Parameters
All parameters are optional and can be combined:
- `--namespace`- one of: backoffice, api, mp, yves, ssp. Appends to Cypress run command.
- `--tag` - any tag used in Cypress tests. Filters tests using --env grep=@tag.
 - `--shops` - comma-separated list of ENV_REPOSITORY_ID values. Only runs tests for these shops.

## Notes
- Script must be run from the `multi-store-runner/` directory.
- `.env` updates only modify the first line with ENV_REPOSITORY_ID, so it **MUST** be defined on the first line. After execution is finished, it's not set back to original value.
- `SSP` namespace tests for B2B require additional flag `ENV_IS_SSP_ENABLED` in `.env` which is not handled by the script and must be done manually.
- To avoid timeout issues override default value by adding `DEFAULT_COMMAND_TIMEOUT=10000` to `.env`.
