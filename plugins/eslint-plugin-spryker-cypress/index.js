'use strict';

module.exports = {
  rules: {
    'no-cy-get-outside-repository': require('./rules/no-cy-get-outside-repository'),
    'no-numeric-wait': require('./rules/no-numeric-wait'),
    'require-describe-tags': require('./rules/require-describe-tags'),
    'no-assertions-in-page-objects': require('./rules/no-assertions-in-page-objects'),
  },
};
