import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ServicePointViewRepository {
  getNameContainer = (): Cypress.Chainable => cy.get('[data-qa="service-point-name"]');

  getKeyContainer = (): Cypress.Chainable => cy.get('[data-qa="service-point-key"]');

  getStatusContainer = (): Cypress.Chainable => cy.get('[data-qa="service-point-status"]');

  getStoresContainer = (): Cypress.Chainable => cy.get('[data-qa="service-point-stores"]');

  getAddressContainer = (): Cypress.Chainable => cy.get('[data-qa="service-point-address"]');

  getEmptyAddressContainer = (): Cypress.Chainable => cy.get('[data-qa="service-point-address-empty"]');

  getServicesTable = (): Cypress.Chainable => cy.get('[data-qa="service-point-services"]');

  getEmptyServicesMessage = (): Cypress.Chainable => cy.get('[data-qa="service-point-services-empty"]');

  getConnectedOffersSection = (): Cypress.Chainable => cy.get('[data-qa="service-point-product-offers"]');

  getConnectedOfferViewButton = (): Cypress.Chainable =>
    this.getConnectedOffersSection().find('a[href*="/product-offer-gui/view"]');
}
