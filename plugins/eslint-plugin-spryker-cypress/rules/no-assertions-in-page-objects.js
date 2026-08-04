'use strict';

/**
 * Page objects (files under a pages/ directory) should expose state and
 * actions; asserting belongs to the spec.
 *
 * A method that only asserts is the violation — it forces the spec to delegate
 * its expectations. Flagged: .should(...) chains and expect(...) calls in a
 * page-object method that performs no action of its own.
 *
 * A .should(...) inside a method that also acts is a *synchronization guard*
 * (`getButton().should('be.visible').click()`, or a standalone
 * `getCheckbox().should('be.visible')` before checking it) and is allowed.
 * Those guards carry the retry-until-ready that keeps the interaction from
 * racing the UI, so hoisting them into the spec makes tests flakier rather
 * than cleaner. Attributing the action to every enclosing function — nested
 * callbacks included — also stops the rule being satisfied by a rename.
 */

/**
 * Cypress commands that change state or drive the UI. Read-only queries and
 * traversals (get, find, first, its, invoke, wrap, contains, …) are absent on
 * purpose: they do not turn an assertion-only method into an action.
 */
const ACTIONS = new Set([
  'blur',
  'check',
  'clear',
  'click',
  'dblclick',
  'focus',
  'go',
  'reload',
  'rightclick',
  'scrollIntoView',
  'scrollTo',
  'select',
  'selectFile',
  'submit',
  'trigger',
  'type',
  'uncheck',
  'visit',
]);

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage assertion-only methods on page objects; return the element and assert in the spec.',
    },
    schema: [],
    messages: {
      assertion:
        'Avoid {{kind}} assertions inside page objects; return the element or value and assert in the spec. A .should() guard inside a method that also acts is allowed.',
    },
  },

  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/');

    if (!/\/pages\//.test(filename)) {
      return {};
    }

    const functionStack = [];
    const actingFunctions = new Set();
    const pending = [];

    const enterFunction = (node) => functionStack.push(node);
    const exitFunction = () => functionStack.pop();

    return {
      FunctionDeclaration: enterFunction,
      'FunctionDeclaration:exit': exitFunction,
      FunctionExpression: enterFunction,
      'FunctionExpression:exit': exitFunction,
      ArrowFunctionExpression: enterFunction,
      'ArrowFunctionExpression:exit': exitFunction,

      CallExpression(node) {
        const callee = node.callee;

        if (callee.type === 'Identifier' && callee.name === 'expect') {
          pending.push({ node, kind: 'expect()', scope: [...functionStack] });

          return;
        }

        if (callee.type !== 'MemberExpression' || callee.computed || callee.property.type !== 'Identifier') {
          return;
        }

        if (callee.property.name === 'should') {
          pending.push({ node, kind: '.should()', scope: [...functionStack] });

          return;
        }

        if (ACTIONS.has(callee.property.name)) {
          functionStack.forEach((enclosing) => actingFunctions.add(enclosing));
        }
      },

      'Program:exit'() {
        pending
          .filter(({ scope }) => !scope.some((enclosing) => actingFunctions.has(enclosing)))
          .forEach(({ node, kind }) => context.report({ node, messageId: 'assertion', data: { kind } }));
      },
    };
  },
};
