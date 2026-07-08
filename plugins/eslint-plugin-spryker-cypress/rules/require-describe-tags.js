'use strict';

/**
 * Every top-level describe() block must declare @cypress/grep tags via a
 * configuration object as the second argument:
 *
 *   describe('name', { tags: ['@smoke', 'spryker-core'] }, () => { ... });
 *
 * Tags drive suite selection (sharding, smoke runs), so untagged suites are
 * invisible to the tag-filtered CI pipelines. Nested describe() blocks inherit
 * the tags of their parent suite and are therefore exempt — this matches the
 * existing specs (e.g. merchant-registration.cy.ts), which tag only the
 * outermost describe.
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Require every top-level describe() to declare tags: describe('...', { tags: [...] }, () => ...).",
    },
    schema: [],
    messages: {
      missingTags:
        "Top-level describe() must declare grep tags via a configuration object as second argument: describe('...', { tags: [...] }, () => ...).",
    },
  },

  create(context) {
    let describeDepth = 0;

    const isDescribeCallee = (callee) => {
      if (callee.type === 'Identifier' && callee.name === 'describe') {
        return true;
      }

      return (
        callee.type === 'MemberExpression' &&
        !callee.computed &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'describe' &&
        callee.property.type === 'Identifier' &&
        (callee.property.name === 'only' || callee.property.name === 'skip')
      );
    };

    const hasTagsProperty = (objectExpression) =>
      objectExpression.properties.some(
        (property) =>
          property.type === 'Property' &&
          !property.computed &&
          ((property.key.type === 'Identifier' && property.key.name === 'tags') ||
            (property.key.type === 'Literal' && property.key.value === 'tags'))
      );

    const containsSpread = (objectExpression) =>
      objectExpression.properties.some((property) => property.type === 'SpreadElement');

    const checkTopLevelDescribe = (node) => {
      const configArgument = node.arguments[1];

      if (!configArgument) {
        context.report({ node, messageId: 'missingTags' });

        return;
      }

      if (configArgument.type === 'ObjectExpression') {
        if (!hasTagsProperty(configArgument) && !containsSpread(configArgument)) {
          context.report({ node, messageId: 'missingTags' });
        }

        return;
      }

      // describe('name', () => {}) — second argument is the suite callback, no config object at all.
      if (configArgument.type === 'ArrowFunctionExpression' || configArgument.type === 'FunctionExpression') {
        context.report({ node, messageId: 'missingTags' });
      }

      // Anything else (identifier, call, …) cannot be verified statically; do not report.
    };

    return {
      CallExpression(node) {
        if (!isDescribeCallee(node.callee)) {
          return;
        }

        if (describeDepth === 0) {
          checkTopLevelDescribe(node);
        }

        describeDepth++;
      },
      'CallExpression:exit'(node) {
        if (isDescribeCallee(node.callee)) {
          describeDepth--;
        }
      },
    };
  },
};
