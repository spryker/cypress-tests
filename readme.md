# Cypress Spryker [POC]

_This project serves as a proof of concept to evaluate Cypress as an effective tool for end-to-end (E2E) testing. It aims to demonstrate the capabilities, ease of use, and integration features of Cypress within a typical web application development workflow._

_By implementing a variety of test cases, the project showcases how Cypress can be utilized for comprehensive E2E testing, highlighting its strengths in terms of readability, maintainability, and robustness in handling various testing scenarios._

_The insights gained from this project will guide decisions on whether Cypress is the suitable choice for future web application testing needs._

## Setup

- **Install Dependencies:** `npm install`
- **Environment Configuration:**
  - Copy the `.env.example` file to a new file named `.env`.
  - Open the `.env` file and fill in the necessary environment variables. These variables will be used by Cypress for various configurations.

## Running Tests

Run Cypress tests with:

```bash
npm run cy:open
```

## Environment Variables

Ensure to specify the required environment variables in the `.env` file. For example:

- `ENV_MAIL_CATCHER_URL`: URL for the mail catcher service.
- `E2E_BASE_URL`: The base URL for your E2E tests.

These variables will be loaded into Cypress's configuration as per the setup in the Cypress configuration file.

## Contributing

Feel free to fork and submit pull requests.
