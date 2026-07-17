// ***********************************************
// This commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('iframe', { prevSubject: 'element' }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.on('load', () => {
      resolve($iframe.contents().find('body'));
    });
  });
});

Cypress.Commands.add('visitBackoffice', (url, options) => {
  return cy.visit(Cypress.env().backofficeUrl + url, options);
});

Cypress.Commands.add('visitMerchantPortal', (url, options) => {
  return cy.visit(Cypress.env().merchantPortalUrl + url, options);
});

Cypress.Commands.add('resetYvesCookies', () => {
  cy.clearCookies();
  cy.visit('/', {
    onBeforeLoad(win) {
      win.sessionStorage.clear();
    },
  });
});

Cypress.Commands.add(
  'loadDynamicFixturesByPayload',
  function loadDynamicFixturesByPayload(dynamicFixturesFilePath, retries = 2) {
    cy.fixture(dynamicFixturesFilePath).then((operationRequestPayload) => {
      return cy
        .request({
          method: 'POST',
          url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
          body: operationRequestPayload,
          timeout: 200000,
          failOnStatusCode: false,
        })
        .then((response) => {
          if (response.status === 500 || response.status === 408) {
            if (retries > 0) {
              cy.log('Retrying due to error or timeout...');
              return cy.loadDynamicFixturesByPayload(dynamicFixturesFilePath, retries - 1);
            } else {
              throw new Error(response.body);
            }
          }

          if (Array.isArray(response.body.data)) {
            return response.body.data.reduce(
              (acc: Record<string, unknown>, item: Record<string, { key: string; data: unknown }>) => {
                acc[item.attributes.key] = item.attributes.data;
                return acc;
              },
              {}
            );
          } else {
            return {
              [response.body.data.attributes.key]: response.body.data.attributes.data,
            };
          }
        });
    });
  }
);

Cypress.Commands.add('resetBackofficeCookies', () => {
  cy.clearCookies();
  cy.visitBackoffice('/security-gui/login', {
    onBeforeLoad(win) {
      win.sessionStorage.clear();
    },
  });
});

Cypress.Commands.add('resetMerchantPortalCookies', () => {
  cy.clearCookies();
  cy.visitMerchantPortal('/security-merchant-portal-gui/login', {
    onBeforeLoad(win) {
      win.sessionStorage.clear();
    },
  });
});

Cypress.Commands.add(
  'reloadUntilFound',
  (url, findSelector, getSelector = 'body', retries = 3, retryWait = 1000, commands = []) => {
    if (retries === 0) {
      throw `exhausted retries looking for ${getSelector} on ${url}`;
    }

    if (commands.length) {
      cy.runCliCommands(commands);
    }

    cy.visit(url);
    cy.get(getSelector).then((body) => {
      const msg = `url:${url} getSelector:${getSelector} findSelector:${findSelector} retries:${retries} retryWait:${retryWait}`;

      if (body.find(findSelector).length === 1) {
        cy.log(`found ${msg}`);
      } else {
        cy.log(`NOT found ${msg}`);
        cy.wait(retryWait);
        cy.reloadUntilFound(url, findSelector, getSelector, retries - 1, retryWait, commands);
      }
    });
  }
);

// Inverse of reloadUntilFound: re-visits the page until findSelector is ABSENT.
// Needed on the storefront delete path, where publish->sync can lag a single PDP
// load and cy.get().should('not.exist') then keeps finding the still-rendered node.
Cypress.Commands.add('reloadUntilGone', (url, findSelector, getSelector = 'body', retries = 25, retryWait = 5000) => {
  if (retries === 0) {
    throw `exhausted retries waiting for ${findSelector} to disappear on ${url}`;
  }

  cy.visit(url);
  cy.get(getSelector).then((body) => {
    const msg = `url:${url} getSelector:${getSelector} findSelector:${findSelector} retries:${retries} retryWait:${retryWait}`;

    if (body.find(findSelector).length === 0) {
      cy.log(`gone ${msg}`);
    } else {
      cy.log(`still present ${msg}`);
      cy.wait(retryWait);
      cy.reloadUntilGone(url, findSelector, getSelector, retries - 1, retryWait);
    }
  });
});

Cypress.Commands.add('runCliCommands', (commands) => {
  const operations = commands.map((command) => {
    return {
      type: 'cli-command',
      name: command,
    };
  });

  cy.request({
    method: 'POST',
    url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    body: {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: operations,
        },
      },
    },
    timeout: 100000,
  });
});

Cypress.Commands.add('runQueueWorker', () => {
  cy.runCliCommands(['console queue:worker:start --stop-when-empty']);

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000); // For some reason.  The delay or racing in processing the queue messages.
  cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
});

Cypress.Commands.add('confirmCustomerByEmail', (email) => {
  const operation = {
    type: 'helper',
    name: 'confirmCustomerByEmail',
    arguments: { email },
  };

  cy.request({
    method: 'POST',
    url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    body: {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: [operation],
        },
      },
    },
    timeout: 20000,
  });
});

Cypress.Commands.add('getMultiFactorAuthCode', (email, type) => {
  const operation = {
    type: 'helper',
    name: 'getMultiFactorAuthCode',
    key: 'code',
    arguments: [email, type],
  };

  return cy
    .request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: {
        data: {
          type: 'dynamic-fixtures',
          attributes: {
            operations: [operation],
          },
        },
      },
    })
    .then((response) => {
      if (response.body.data && response.body.data.attributes && response.body.data.attributes.data) {
        const mfaResponse = response.body.data.attributes.data;
        return mfaResponse.code;
      }
      return null;
    });
});

Cypress.Commands.add('getUserMultiFactorAuthCode', (username, type) => {
  const operation = {
    type: 'helper',
    name: 'getUserMultiFactorAuthCode',
    key: 'code',
    arguments: [username, type],
  };

  return cy
    .request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: {
        data: {
          type: 'dynamic-fixtures',
          attributes: {
            operations: [operation],
          },
        },
      },
    })
    .then((response) => {
      if (response.body.data && response.body.data.attributes && response.body.data.attributes.data) {
        const mfaResponse = response.body.data.attributes.data;
        return mfaResponse.code;
      }
      return null;
    });
});

Cypress.Commands.add('cleanUpMultiFactorAuthCode', (code: string) => {
  const operation = {
    type: 'helper',
    name: 'cleanUpMultiFactorAuthCode',
    arguments: [code],
  };

  return cy.request({
    method: 'POST',
    url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    body: {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: [operation],
        },
      },
    },
  });
});

Cypress.Commands.add('cleanUpUserMultiFactorAuthCode', (code: string) => {
  const operation = {
    type: 'helper',
    name: 'cleanUpUserMultiFactorAuthCode',
    arguments: [code],
  };

  return cy.request({
    method: 'POST',
    url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    body: {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: [operation],
        },
      },
    },
  });
});

Cypress.Commands.add('cleanUpUserMultiFactorAuth', () => {
  const operation = {
    type: 'helper',
    name: 'cleanUpUserMultiFactorAuth',
  };

  return cy.request({
    method: 'POST',
    url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    body: {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: [operation],
        },
      },
    },
  });
});

Cypress.Commands.add('cleanUpCustomerMultiFactorAuth', () => {
  const operation = {
    type: 'helper',
    name: 'cleanUpCustomerMultiFactorAuth',
  };

  return cy.request({
    method: 'POST',
    url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    body: {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: [operation],
        },
      },
    },
  });
});

Cypress.Commands.add('getCustomerAccessToken', (email, password) => {
  return cy
    .request({
      method: 'POST',
      url: Cypress.env().glueUrl + '/access-tokens',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        data: {
          type: 'access-tokens',
          attributes: {
            username: email,
            password,
          },
        },
      },
    })
    .then((response) => response.body.data.attributes.accessToken);
});

Cypress.Commands.add('createCart', (accessToken, attributes) => {
  return cy
    .request({
      method: 'POST',
      url: Cypress.env().glueUrl + '/carts',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        data: {
          type: 'carts',
          attributes,
        },
      },
    })
    .then((response) => response.body.data.id);
});

Cypress.Commands.add('deleteCustomerPersistentQuotes', (email) => {
  cy.request({
    method: 'POST',
    url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
    body: {
      data: {
        type: 'dynamic-fixtures',
        attributes: {
          operations: [
            {
              type: 'helper',
              name: 'deleteCustomerPersistentQuotes',
              arguments: { email },
            },
          ],
        },
      },
    },
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('createShoppingList', (accessToken, name) => {
  return cy
    .request({
      method: 'POST',
      url: Cypress.env().glueUrl + '/shopping-lists',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
        data: {
          type: 'shopping-lists',
          attributes: {
            name,
          },
        },
      },
    })
    .then((response) => response.body.data.id);
});
