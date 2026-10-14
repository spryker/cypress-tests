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
  // Every shop renders the slot's candidates as configurator-product cards. Suite and b2b print the sku in the
  // card, b2c only the name, but every card's selection form carries the sku in a hidden input.
  getConfiguratorProduct = (productIdentifier: string): Cypress.Chainable =>
    cy.get(
      `[data-qa="component configurator-product"]:contains("${productIdentifier}"), ` +
        `[data-qa="component configurator-product"]:has(input[type="hidden"][value="${productIdentifier}"])`
    );
  getConfiguratorProductSelectButtonSelector = (): string => 'button';
  getAddToCartButton = (): Cypress.Chainable =>
    cy.get('form[name="configurator_state_form"][action*="add-to-cart"] button');
}
