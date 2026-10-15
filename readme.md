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

Note: to run tests against different demoshops automatically, use [Multi-Store-Runner script](tools/scripts/multi-store-runner/readme.md).

## AgenticCommerce user stories

Every user story of the AgenticCommerce feature (CC-40820) has one spec under
`cypress/e2e/{yves,backoffice,api}/agentic-commerce/`. The feature is built in cuts; a spec
runs only when `agenticCommerceCut` names its cut or a later one, in landing order
`1, 6a-1, 3, 2, 4, 4b, 5, 7a, 6a-2, 6b, 6c, 6d, 7b`. Without it every agentic spec is
skipped, which is what CI sees.

All commands below run from the **root of this repository**.

### Step by step

1. **Prepare the shop.** Check out the suite branch of the cut you want to test, and have
   the docker/sdk stack serve it in dynamic-store mode (`*.eu.spryker.local`): schema
   migrated, transfers generated, demo data imported. The stories log in with the suite
   demo accounts (`maria.williams@acme.com`, `sonia@acme.com`, `admin@spryker.com`, all
   `change123`).
2. **Install once.**
   ```bash
   npm ci
   npx cypress verify
   cp .env.dynamic-store.example .env
   ```
3. **Run the stories of a cut** (and every cut below it):
   ```bash
   npm run cy:agentic-commerce -- --cut 6a-1
   ```
   Cypress prints one block per spec; the command exits with the number of failed tests.
4. **Read failures.** Screenshots are in `cypress/screenshots/`. For a JSON summary of the
   run, add `--summary <path>`.

### Options

| You want to …                        | Add                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Watch the run in a visible Chrome    | `--headed`                                                                |
| Record one MP4 per spec              | `--video`                                                                 |
| Record videos to show to colleagues  | `--demo`                                                                  |
| Run a single spec                    | `--spec cypress/e2e/yves/agentic-commerce/customer-connects-client.cy.ts` |
| Pick specs in the Cypress UI instead | `npx cypress open --e2e --browser chrome --env agenticCommerceCut=6a-1`   |

### Record videos

1. Prepare the shop and install as in steps 1 and 2.
2. Run, for example:
   ```bash
   npm run cy:agentic-commerce -- --cut 6a-1 --demo
   npm run cy:agentic-commerce -- --cut 1 --demo --spec cypress/e2e/yves/agentic-commerce/customer-connects-client.cy.ts
   ```
   `--demo` records for an audience: 1920×1080, the shop fills the frame, every click and
   entry waits 0.8 s, typing is visible, each test holds its last screen, and the Symfony
   toolbar is collapsed. The API specs open no page, so their videos keep the Cypress command
   log. `--video` records at normal speed with the command log, which is quicker for
   debugging.
3. The videos are in `cypress/videos/`, one per spec, named after it. A run of several specs
   keeps their folders, e.g. `cypress/videos/yves/agentic-commerce/customer-connects-client.cy.ts.mp4`;
   a run of one spec writes it straight into `cypress/videos/`.
4. Copy the ones you want to keep: every Cypress run in this repository empties
   `cypress/videos/` first, also one without `--video`. The folder is git-ignored.
5. For smooth, retina-quality footage, run with `--headed` and record the Chrome window with
   the macOS screen recorder (Cmd+Shift+5) instead.

To change the demo settings: the pause per action is `DEMO_DELAY` in
`tools/scripts/agentic-commerce/run.mjs`, the video size is `DEMO_WINDOW_WIDTH` and
`DEMO_WINDOW_HEIGHT` in `cypress.config.ts` (the height includes 88 px of browser toolbar), and
the typing speed and the paused actions are in `cypress/support/demo-pace.ts`.

### Good to know

- Each spec registers its own client per run and blocks it afterwards, so runs do not share
  data. A failed client registration stops the spec in its `before` hook with
  `Client "…" was not registered.`
- Back Office lists need about 5 s for their first load on a dev stack; the specs wait up
  to 30 s.

## Development workflow in the shop (suite-nonsplit or demoshop)

To use a different branch, modify the project `composer.json`

```json
"require-dev": {
    "spryker/cypress-tests": "dev-YOUR_BRANCH_NAME"
}
```

and run `composer update spryker/cypress-tests`, then commit `composer.json` and `composer.lock` files.

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

## Test Tagging

When adding a new test or extending the coverage of an existing test - add the tag for the covered feature. The tag should be named the same as the corresponding feature in the Release App. E.g. if you create a new test that touches Marketplace Agent Assist feature, you should add tags `marketplace-agent-assist` and `marketplace-merchantportal-core`. Please see the existing tests for the tag syntax.
