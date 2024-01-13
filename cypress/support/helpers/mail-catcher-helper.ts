import { injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class MailCatcherHelper {
  private readonly url: string;

  constructor() {
    this.url = Cypress.env().mailCatcherUrl;
  }

  public verifyCustomerEmail = (email: string): void => {
    cy.request({
      url: this.url,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status !== 200) {
        return;
      }
    });

    cy.visit(this.url);
    cy.get('#search').type(email + '{enter}');
    cy.contains('span', 'Thank you for signing up with Spryker Shop!').click();
    cy.get('.active > a').click();
    cy.get('#preview-html').iframe().contains('Validate your email address').invoke('removeAttr', 'target').click();
  };
}
