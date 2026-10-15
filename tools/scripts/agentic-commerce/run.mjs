#!/usr/bin/env node
// Runs the AgenticCommerce user-story specs for one cut and writes a JSON summary.
// Usage: node tools/scripts/agentic-commerce/run.mjs --cut <cut> --summary <path> [--headed] [--spec <glob or path>]...
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import cypress from 'cypress';

const DEFAULT_SPEC = 'cypress/e2e/**/agentic-commerce/**/*.cy.ts';

const parseArguments = (argv) => {
  const options = { cut: process.env.AGENTIC_COMMERCE_CUT ?? '', summary: '', headed: false, specs: [] };

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];

    if (argument === '--cut') options.cut = argv[++index];
    else if (argument === '--summary') options.summary = argv[++index];
    else if (argument === '--headed') options.headed = true;
    else if (argument === '--spec') options.specs.push(argv[++index]);
    else throw new Error(`Unknown argument ${argument}`);
  }

  if (!options.cut) throw new Error('--cut (or AGENTIC_COMMERCE_CUT) is required, e.g. --cut 6a-1');

  return options;
};

const toState = (test) => (test.state === 'pending' ? 'skipped' : test.state);

const summarize = (cut, startedAt, results) => ({
  cut,
  startedAt,
  endedAt: new Date().toISOString(),
  specs: (results.runs ?? []).map((run) => ({
    spec: run.spec.relative,
    tests: run.tests.map((test) => ({
      title: test.title.join(' › '),
      state: toState(test),
      error: test.displayError ? test.displayError.split('\n')[0] : null,
    })),
    video: run.video ?? null,
    screenshots: (run.screenshots ?? []).map((screenshot) => screenshot.path),
  })),
});

const options = parseArguments(process.argv.slice(2));
const startedAt = new Date().toISOString();
const results = await cypress.run({
  browser: 'chrome',
  headed: options.headed,
  spec: (options.specs.length ? options.specs : [DEFAULT_SPEC]).join(','),
  env: { agenticCommerceCut: options.cut, grepTags: '@agentic-commerce', repositoryId: 'suite' },
});

if (results.status === 'failed') {
  console.error(results.message);
  process.exit(1);
}

if (options.summary) {
  mkdirSync(dirname(options.summary), { recursive: true });
  writeFileSync(options.summary, JSON.stringify(summarize(options.cut, startedAt, results), null, 2));
}

process.exit(Math.min(results.totalFailed, 255));
