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

Cypress.Commands.add('loadDynamicFixturesByPayload', (dynamicFixturesFilePath) => {
  cy.fixture(dynamicFixturesFilePath).then((operationRequestPayload) => {
    return cy
      .request({
        method: 'POST',
        url: Cypress.env().glueBackendUrl + '/dynamic-fixtures',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        body: operationRequestPayload,
        timeout: 40000,
      })
      .then((response) => {
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
});

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

Cypress.Commands.add('reloadUntilFound', (url, findSelector, getSelector = 'body', retries = 3, retryWait = 1000) => {
  if (retries === 0) {
    throw `exhausted retries looking for ${getSelector} on ${url}`;
  }

  cy.visit(url);
  cy.get(getSelector).then((body) => {
    const msg = `url:${url} getSelector:${getSelector} findSelector:${findSelector} retries:${retries} retryWait:${retryWait}`;

    if (body.find(findSelector).length === 1) {
      console.log(`found ${msg}`);
    } else {
      console.log(`NOT found ${msg}`);
      cy.wait(retryWait);
      cy.reloadUntilFound(url, findSelector, getSelector, retries - 1, retryWait);
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
      timeout: 20000,
    },
  });
});
