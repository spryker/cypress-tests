'use strict';

/**
 * Selectors belong to repository classes (cypress/support/pages/**\/repositories/)
 * so that specs and page objects stay selector-free. This rule forbids direct
 * cy.get() / cy.contains() calls in any file that is not located under a
 * `repositories/` or `support/` directory.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Forbid cy.get()/cy.contains() outside repository and support files; selectors belong to repository classes.',
    },
    schema: [],
    messages: {
      forbidden:
        'cy.{{method}}() is not allowed here. Move the selector into a repository class (repositories/ directory) and access it through the page object.',
    },
  },

  create(context) {
    const filename = context.getFilename().replace(/\\/g, '/');

    if (/\/(repositories|support)\//.test(filename)) {
      return {};
    }

    return {
      CallExpression(node) {
        const callee = node.callee;

        if (
          callee.type === 'MemberExpression' &&
          !callee.computed &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'cy' &&
          callee.property.type === 'Identifier' &&
          (callee.property.name === 'get' || callee.property.name === 'contains')
        ) {
          context.report({
            node,
            messageId: 'forbidden',
            data: { method: callee.property.name },
          });
        }
      },
    };
  },
};
