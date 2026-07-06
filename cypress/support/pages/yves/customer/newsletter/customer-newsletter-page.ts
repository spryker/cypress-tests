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

  assertSubscribed = (): void => {
    cy.contains(this.repository.getSubscribedMessage()).should('be.visible');
  };

  assertUnsubscribed = (): void => {
    cy.contains(this.repository.getUnsubscribedMessage()).should('be.visible');
  };

  assertAlreadySubscribed = (): void => {
    cy.contains(this.repository.getAlreadySubscribedMessage()).should('be.visible');
  };

  assertAccountSubscriptionUnchecked = (): void => {
    this.repository.getAccountSubscriptionCheckboxInput().should('not.be.checked');
  };
}
