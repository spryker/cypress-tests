import { injectable } from 'inversify';
import { CustomerNewsletterRepository } from '../customer-newsletter-repository';

@injectable()
export class B2cCustomerNewsletterRepository implements CustomerNewsletterRepository {
  getAccountSubscriptionCheckboxLabel(): Cypress.Chainable {
    return cy.get('[data-qa*="newsletterSubscriptionForm_subscribe"] label');
  }
  getAccountSubscriptionCheckboxInput(): Cypress.Chainable {
    return cy.get('[data-qa*="newsletterSubscriptionForm_subscribe"] input');
  }
  getAccountSubmitButton(): Cypress.Chainable {
    return cy.get('form[name="newsletterSubscriptionForm"] button[type="submit"]');
  }
  getHomepageSubscriptionEmailInput(): Cypress.Chainable {
    return cy.get('#newsletterSubscriptionWidgetForm_subscribe');
  }
  getHomepageSubmitButton(): Cypress.Chainable {
    return cy.get('#newsletterSubscriptionWidgetForm_subscribe').closest('form').find('button[type="submit"]');
  }
  getSubscribedMessage(): string {
    return 'You successfully subscribed to the newsletter';
  }
  getUnsubscribedMessage(): string {
    return 'You successfully unsubscribed from the newsletter';
  }
  getAlreadySubscribedMessage(): string {
    return 'You are already subscribed to the newsletter';
  }
}
