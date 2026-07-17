'use strict';

/**
 * Page objects (files under a pages/ directory) should expose state and
 * actions; asserting belongs to the spec. Flags .should(...) chains and
 * expect(...) calls inside page-object files.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage .should()/expect() assertions inside page objects; assert in the spec instead.',
    },
    schema: [],
    messages: {
      assertion: 'Avoid {{kind}} assertions inside page objects; return the element or value and assert in the spec.',
    },
  },

  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/');

    if (!/\/pages\//.test(filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        const callee = node.callee;

        if (callee.type === 'Identifier' && callee.name === 'expect') {
          context.report({ node, messageId: 'assertion', data: { kind: 'expect()' } });

          return;
        }

        if (
          callee.type === 'MemberExpression' &&
          !callee.computed &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'should'
        ) {
          context.report({ node, messageId: 'assertion', data: { kind: '.should()' } });
        }
      },
    };
  },
};
