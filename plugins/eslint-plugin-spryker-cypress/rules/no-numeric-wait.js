'use strict';

/**
 * Forbids fixed-duration waits: cy.wait(5000). Waiting for a fixed amount of
 * time makes tests slow and flaky. Wait on an intercepted alias instead:
 * cy.wait('@request').
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Forbid cy.wait(<number>); wait on an intercepted alias (cy.wait('@alias')) instead.",
    },
    schema: [],
    messages: {
      numericWait: "Do not wait a fixed {{value}} ms; wait on an intercepted alias instead, e.g. cy.wait('@request').",
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        const callee = node.callee;

        if (
          callee.type !== 'MemberExpression' ||
          callee.computed ||
          callee.object.type !== 'Identifier' ||
          callee.object.name !== 'cy' ||
          callee.property.type !== 'Identifier' ||
          callee.property.name !== 'wait'
        ) {
          return;
        }

        const firstArgument = node.arguments[0];

        if (firstArgument && firstArgument.type === 'Literal' && typeof firstArgument.value === 'number') {
          context.report({
            node,
            messageId: 'numericWait',
            data: { value: String(firstArgument.value) },
          });
        }
      },
    };
  },
};
