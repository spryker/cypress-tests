import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class BundleConfiguratorRepository {
  getTemplateName = (templateName: string): Cypress.Chainable =>
    cy.contains('[data-qa="component template-list"] .template-list__item-name', templateName);
  getTemplateLinkSelector = (): string => 'a';
  getConfiguratorSidebar = (): Cypress.Chainable => cy.get('[data-qa="component configurator-sidebar"]');
  getSlotButton = (slotName: string): Cypress.Chainable =>
    cy.contains('form[name="configurator_state_form"] button', slotName);
  // Every shop renders the slot's candidates as configurator-product cards; what identifies one
  // differs - suite and b2b print the sku in the card, b2c only the product name - so the caller
  // passes whichever text its own shop shows.
  getConfiguratorProduct = (productIdentifier: string): Cypress.Chainable =>
    cy.contains('[data-qa="component configurator-product"]', productIdentifier);
  getConfiguratorProductSelectButtonSelector = (): string => 'button';
  getAddToCartButton = (): Cypress.Chainable =>
    cy.get('form[name="configurator_state_form"][action*="add-to-cart"] button');
}
