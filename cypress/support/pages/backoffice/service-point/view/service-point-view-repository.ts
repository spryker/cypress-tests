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

  getServicesTable = (): Cypress.Chainable => cy.get('[data-qa="service-point-services"]');

  getConnectedOffersSection = (): Cypress.Chainable => cy.get('[data-qa="service-point-product-offers"]');
}
