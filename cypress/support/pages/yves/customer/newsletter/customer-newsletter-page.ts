import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CustomerNewsletterRepository } from './customer-newsletter-repository';

@injectable()
@autoWired
export class CustomerNewsletterPage extends YvesPage {
  @inject(REPOSITORIES.CustomerNewsletterRepository) private repository: CustomerNewsletterRepository;

  protected PAGE_URL = '/customer/newsletter';
  protected HOMEPAGE_URL = '/';

  visitHomepage = (): void => {
    cy.visit(this.HOMEPAGE_URL);
  };

  toggleAccountSubscriptionAndSubmit = (): void => {
    this.repository.getAccountSubscriptionCheckboxLabel().click();
    this.repository.getAccountSubmitButton().click();
  };

  subscribeOnHomepage = (email: string): void => {
    this.repository.getHomepageSubscriptionEmailInput().clear().type(email);
    this.repository.getHomepageSubmitButton().click();
  };

  getSubscribedMessage = (): Cypress.Chainable => cy.contains(this.repository.getSubscribedMessage());

  getUnsubscribedMessage = (): Cypress.Chainable => cy.contains(this.repository.getUnsubscribedMessage());

  getAlreadySubscribedMessage = (): Cypress.Chainable => cy.contains(this.repository.getAlreadySubscribedMessage());

  getAccountSubscriptionCheckboxInput = (): Cypress.Chainable => this.repository.getAccountSubscriptionCheckboxInput();
}
