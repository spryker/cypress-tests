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

