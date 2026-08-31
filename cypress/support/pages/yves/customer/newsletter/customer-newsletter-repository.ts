export interface CustomerNewsletterRepository {
  getAccountSubscriptionCheckboxLabel(): Cypress.Chainable;
  getAccountSubscriptionCheckboxInput(): Cypress.Chainable;
  getAccountSubmitButton(): Cypress.Chainable;
  getHomepageSubscriptionEmailInput(): Cypress.Chainable;
  getHomepageSubmitButton(): Cypress.Chainable;
  getSubscribedMessage(): string;
  getUnsubscribedMessage(): string;
  getAlreadySubscribedMessage(): string;
}
