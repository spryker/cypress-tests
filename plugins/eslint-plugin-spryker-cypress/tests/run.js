'use strict';

/**
 * Rule tests for eslint-plugin-spryker-cypress.
 *
 * Run with: node plugins/eslint-plugin-spryker-cypress/tests/run.js
 * RuleTester throws on the first failing assertion, so a zero exit code means
 * every test passed. No test-runner dependency needed.
 */
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

const specFile = 'cypress/e2e/yves/login/login.cy.ts';
const repositoryFile = 'cypress/support/pages/yves/login/repositories/suite-login-repository.ts';
const supportFile = 'cypress/support/commands.ts';
const pageFile = 'cypress/support/pages/yves/login/login-page.ts';

ruleTester.run('no-cy-get-outside-repository', require('../rules/no-cy-get-outside-repository'), {
  valid: [
    { code: "cy.get('#loginForm_email');", filename: repositoryFile },
    { code: "cy.contains('Login');", filename: repositoryFile },
    { code: "cy.get('[data-qa=submit]');", filename: supportFile },
    { code: "cy.visit('/login');", filename: specFile },
    { code: "cy.intercept('POST', '/login');", filename: specFile },
    { code: 'repository.getLoginForm().submit();', filename: specFile },
    // computed access is not flagged
    { code: "cy['get']('#id');", filename: specFile },
    // in this repo page objects live under cypress/support/, so the support allowance covers them
    { code: "cy.get('.menu');", filename: pageFile },
  ],
  invalid: [
    {
      code: "cy.get('#loginForm_email').type('a@b.c');",
      filename: specFile,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: "cy.contains('Add to cart').click();",
      filename: specFile,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: "cy.get('.menu');",
      filename: 'cypress.config.ts',
      errors: [{ messageId: 'forbidden' }],
    },
  ],
});

ruleTester.run('no-numeric-wait', require('../rules/no-numeric-wait'), {
  valid: [
    { code: "cy.wait('@loginRequest');", filename: specFile },
    { code: "cy.wait(['@a', '@b']);", filename: specFile },
    { code: "cy.wait('@request', { timeout: 10000 });", filename: specFile },
    // non-cy waits are out of scope
    { code: 'queue.wait(500);', filename: specFile },
  ],
  invalid: [
    { code: 'cy.wait(5000);', filename: specFile, errors: [{ messageId: 'numericWait' }] },
    { code: 'cy.wait(0);', filename: specFile, errors: [{ messageId: 'numericWait' }] },
    { code: 'cy.wait(15000); // sync', filename: supportFile, errors: [{ messageId: 'numericWait' }] },
  ],
});

ruleTester.run('require-describe-tags', require('../rules/require-describe-tags'), {
  valid: [
    {
      code: "describe('health check', { tags: ['@smoke', '@api'] }, () => {});",
      filename: specFile,
    },
    {
      code: "describe.skip('wip', { tags: ['@yves'] }, () => {});",
      filename: specFile,
    },
    {
      code: "describe('quoted key', { 'tags': ['@mp'] }, () => {});",
      filename: specFile,
    },
    // config held in a variable cannot be verified statically — not reported
    {
      code: "describe('dynamic', suiteConfig, () => {});",
      filename: specFile,
    },
    // spread may carry tags — not reported
    {
      code: "describe('spread', { ...baseConfig }, () => {});",
      filename: specFile,
    },
    // other mocha callables are out of scope
    { code: "it('works', () => {});", filename: specFile },
    // nested describes inherit the parent tags and need none of their own
    {
      code: "describe('outer', { tags: ['@yves'] }, () => { describe('inner', () => { it('works', () => {}); }); });",
      filename: specFile,
    },
  ],
  invalid: [
    {
      code: "describe('untagged', () => {});",
      filename: specFile,
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: "describe('untagged');",
      filename: specFile,
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: "describe('config without tags', { retries: 2 }, () => {});",
      filename: specFile,
      errors: [{ messageId: 'missingTags' }],
    },
    {
      code: "describe.only('untagged', () => {});",
      filename: specFile,
      errors: [{ messageId: 'missingTags' }],
    },
    // sibling top-level describes are each checked (depth bookkeeping survives the first suite)
    {
      code: "describe('first', { tags: ['@yves'] }, () => {}); describe('second', () => {});",
      filename: specFile,
      errors: [{ messageId: 'missingTags' }],
    },
  ],
});

ruleTester.run('no-assertions-in-page-objects', require('../rules/no-assertions-in-page-objects'), {
  valid: [
    // assertions outside pages/ are fine
    { code: "cy.get('.msg').should('be.visible');", filename: specFile },
    { code: 'expect(total).to.equal(3);', filename: specFile },
    { code: 'expect(total).to.equal(3);', filename: supportFile },
    // non-assertion page-object code
    { code: 'this.repository.getLoginForm().submit();', filename: pageFile },
  ],
  invalid: [
    {
      code: "this.repository.getMessage().should('be.visible');",
      filename: pageFile,
      errors: [{ messageId: 'assertion' }],
    },
    {
      code: 'expect(rows.length).to.equal(1);',
      filename: pageFile,
      errors: [{ messageId: 'assertion' }],
    },
    {
      code: "cy.get('.row').should('have.length', 2);",
      filename: repositoryFile,
      errors: [{ messageId: 'assertion' }],
    },
  ],
});

console.log('eslint-plugin-spryker-cypress: all rule tests passed.');
