## Description

This repository is dedicated to housing an extensive collection of UI end-to-end tests, meticulously crafted using
Cypress for Spryker applications. These tests are designed to thoroughly evaluate the user interface, ensuring that all
interactions and visual elements function as intended in real-world scenarios. By leveraging Cypress's advanced browser
automation capabilities, this suite provides an efficient and effective means of validating the user experience,
confirming the seamless operation and aesthetic integrity of Spryker's front-end components. Our commitment to rigorous
UI testing helps maintain the high standard of quality and reliability that Spryker users expect.

## Setup

To get started with these tests, follow these setup steps:

1. **Install Dependencies:**

- Install all necessary dependencies required for running the tests.
  ```bash
  npm install
  ```

2. **Environment Configuration:**

- Set up your environment variables for Cypress.
  - Copy the `.env.example` file to a new file named `.env`.
  - Open the `.env` file and fill in the necessary environment variables.
  - These variables are crucial for Cypress to connect with your Spryker application and perform tests effectively.

## Running Tests

To run the Cypress tests, use the following command:

```bash
npm run cy:open
```

This command opens the Cypress Test Runner, a powerful interface that allows you to see tests running in real time.

## Development workflow in the shop (suite-nonsplit or demoshop)

To update the cypress-tests to use a different branch or commit, you need to modify these three locations:

### 1. Update the dependency version in `require-dev`

```json
"require-dev": {
    "spryker/cypress-tests": "dev-YOUR_BRANCH_NAME"
}
```

### 2. Update the package version in the repository definition

```json
"repositories": [
    {
        "type": "package",
        "package": {
            "name": "spryker/cypress-tests",
            "version": "dev-YOUR_BRANCH_NAME",
            "source": {
                "url": "https://github.com/spryker/cypress-tests.git",
                "type": "git",
                "reference": "YOUR_COMMIT_HASH_OR_BRANCH"
            },
            "type": "zend-module",
            "license": [
                "MIT"
            ]
        }
    }
]
```

### 3. Update the reference (commit hash or branch name)

In the same repository definition, update the `reference` field:

```json
"reference": "YOUR_COMMIT_HASH_OR_BRANCH"
```

## Troubleshooting

### URI malformed

```
The following error originated from your test code, not from Cypress.

> URI malformed

When Cypress detects uncaught errors originating from your test code it will automatically fail the current test.

Cypress could not associate this error to any specific test.

We dynamically generated a new test to display this failure.
```

When you encounter a "URI malformed" error in Cypress, it NOT always indicates that there is an issue with the URL used in your tests.

To resolve this error, you can try the following steps:

- Ensure "Node.js" version is **22.16.0** or higher.
- Ensue "npm" version is **11.6.0** or higher.
- If you changed version of Node or npm, delete the `node_modules` folder and reinstall dependencies. (`rm -rf node_modules/ && npm install`)
- Clear Cypress App Data following [this guide](https://docs.cypress.io/app/references/troubleshooting#Clear-App-Data).

### Other issues

If you encounter other issues not described here, refer to the [Troubleshooting](https://docs.cypress.io/app/references/troubleshooting) for common problems and solutions.
