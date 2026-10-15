#!/usr/bin/env node
// Runs the AgenticCommerce user-story specs for one cut and writes a JSON summary.
// Usage: node tools/scripts/agentic-commerce/run.mjs --cut <cut> --summary <path> [--headed] [--video] [--demo] [--spec <glob or path>]...
// --video records one MP4 per spec into cypress/videos/.
// --demo records too, paced for an audience: the page fills the frame and every action waits DEMO_DELAY ms.
// API specs keep the command log, since they open no page.
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import cypress from 'cypress';

const DEFAULT_SPEC = 'cypress/e2e/**/agentic-commerce/**/*.cy.ts';
const API_SPEC_PATH = 'cypress/e2e/api/';
const DEMO_DELAY = 800;

const parseArguments = (argv) => {
  const options = {
    cut: process.env.AGENTIC_COMMERCE_CUT ?? '',
    summary: '',
    headed: false,
    video: false,
    demo: false,
    specs: [],
  };

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];

    if (argument === '--cut') options.cut = argv[++index];
    else if (argument === '--summary') options.summary = argv[++index];
    else if (argument === '--headed') options.headed = true;
    else if (argument === '--video') options.video = true;
    else if (argument === '--demo') options.demo = true;
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

const runSpecs = async (options, specs, { runnerUi = true, keepAssets = false } = {}) =>
  cypress.run({
    browser: 'chrome',
    headed: options.headed,
    runnerUi,
    spec: specs.join(','),
    env: {
      agenticCommerceCut: options.cut,
      grepTags: '@agentic-commerce',
      repositoryId: 'suite',
      ...(options.demo ? { demoDelay: DEMO_DELAY } : {}),
    },
    config: {
      ...(options.video || options.demo ? { video: true, videoCompression: false } : {}),
      ...(keepAssets ? { trashAssetsBeforeRuns: false } : {}),
    },
  });

const mergeResults = (results) => ({
  status: results.some((result) => result.status === 'failed') ? 'failed' : 'finished',
  message: results
    .map((result) => result.message)
    .filter(Boolean)
    .join('\n'),
  runs: results.flatMap((result) => result.runs ?? []),
  totalFailed: results.reduce((total, result) => total + (result.totalFailed ?? 0), 0),
});

const SPEC_ROOT = 'cypress/e2e';

const listSpecFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    return entry.isDirectory() ? listSpecFiles(path) : entry.name.endsWith('.cy.ts') ? [path] : [];
  });

const globToRegExp = (glob) =>
  new RegExp(
    `^${glob
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*\//g, '\u0000')
      .replace(/\*/g, '[^/]*')
      .replace(/\u0000/g, '(?:.*/)?')}$`
  );

const runDemo = async (options, specs) => {
  const patterns = specs.map(globToRegExp);
  const files = listSpecFiles(SPEC_ROOT)
    .filter((file) => patterns.some((pattern) => pattern.test(file)))
    .sort();
  const pageFiles = files.filter((file) => !file.startsWith(API_SPEC_PATH));
  const apiFiles = files.filter((file) => file.startsWith(API_SPEC_PATH));
  const results = [];

  if (pageFiles.length) results.push(await runSpecs(options, pageFiles, { runnerUi: false }));
  // The second run keeps the videos and screenshots of the first.
  if (apiFiles.length) results.push(await runSpecs(options, apiFiles, { keepAssets: results.length > 0 }));

  return mergeResults(results);
};

const options = parseArguments(process.argv.slice(2));
const specs = options.specs.length ? options.specs : [DEFAULT_SPEC];
const startedAt = new Date().toISOString();
const results = options.demo ? await runDemo(options, specs) : await runSpecs(options, specs);

if (results.status === 'failed') {
  console.error(results.message);
  process.exit(1);
}

if (options.summary) {
  mkdirSync(dirname(options.summary), { recursive: true });
  writeFileSync(options.summary, JSON.stringify(summarize(options.cut, startedAt, results), null, 2));
}

process.exit(Math.min(results.totalFailed, 255));
