import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ProductConfiguratorRepository {
  // The example configurator renders one Angular component per option group, and the group element
  // itself carries no data-qa, so the component's own tag name is what identifies it.
  getGroups = (): Cypress.Chainable => cy.get('app-configurator-group');

  getGroupOption = (groupNumber: number, optionNumber: number): Cypress.Chainable =>
    this.getGroups()
      .eq(groupNumber - 1)
      .find('[data-qa="configurator-group-item"]')
      .eq(optionNumber - 1);

  getOptionLabelSelector = (): string => '[data-qa="configurator-item-label"]';

  getOptionInputSelector = (): string => '[data-qa="configurator-item-input"]';

  getSaveButton = (): Cypress.Chainable => cy.get('[data-qa="product-details-submit-button"]');

  getHeading = (): Cypress.Chainable => cy.get('[data-qa="header-heading"]');
}
