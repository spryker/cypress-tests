// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("iframe", { prevSubject: "element" }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.on("load", () => {
      resolve($iframe.contents().find("body"));
    });
  });
});

Cypress.Commands.add("visitBackoffice", (url) => {
  return cy.visit(Cypress.env().backofficeUrl + url);
});

Cypress.Commands.add("resetCookies", () => {
  cy.clearCookies();
  cy.visit("/", {
    onBeforeLoad(win) {
      win.sessionStorage.clear();
    },
  });
});

Cypress.Commands.add(
  "reloadUntilFound",
  (url, findSelector, getSelector = "body", retries = 3, retryWait = 1000) => {
    if (retries === 0) {
      throw `exhausted retries looking for ${selector} on ${url}`;
    }

    cy.visit(url);
    cy.get(getSelector).then((body) => {
      let msg = `url:${url} getSelector:${getSelector} findSelector:${findSelector} retries:${retries} retryWait:${retryWait}`;
      if (body.find(findSelector).length === 1) {
        console.log(`found ${msg}`);
      } else {
        console.log(`NOT found ${msg}`);
        cy.wait(retryWait);
        cy.reloadUntilFound(
          url,
          findSelector,
          getSelector,
          retries - 1,
          retryWait,
        );
      }
    });
  },
);
