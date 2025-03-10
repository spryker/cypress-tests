import { SspAssetRepository } from '../ssp-asset-repository';
import { injectable } from 'inversify';

@injectable()
export class SuiteSspAssetRepository implements SspAssetRepository {
  getCreateAssetButton(): Cypress.Chainable {
    return cy.get('[data-qa="create-ssp-asset"]');
  }

  getAssetForm(): Cypress.Chainable {
    return cy.get('[data-qa="customer-asset-form"]');
  }

  getNameInput(): Cypress.Chainable {
    return cy.get('#assetForm_name');
  }

  getSubmitButton(): Cypress.Chainable {
    return cy.get('[data-qa="submit-button"]');
  }

  getAssetCreatedMessage(): string {
    return 'Asset has been successfully created';
  }

  getAssetEditedMessage(): string {
    return 'Asset has been successfully updated';
  }

  getAssetDetailsTitle(): Cypress.Chainable {
    return cy.get('[data-qa="component asset-details-title"] .title--h3');
  }

  getAssetDetailsReference(reference: string): string {
    return reference;
  }

  getAssetDetailsName(name: string): string {
    return name;
  }

  getAssetDetailsSerialNumber(serialNumber: string): string {
    return serialNumber;
  }

  getAssetDetailsNote(note: string): string {
    return note;
  }

  getEditAssetButton(): Cypress.Chainable {
    return cy.get('[title="Edit"]');
  }

  getCreateClaimButton(): Cypress.Chainable {
    return cy.contains('Create claim');
  }

  getFirstRowViewButton(): Cypress.Chainable {
    return cy.get('.web-table-actions-cell .menu__item a').first();
  }

  getFirstRowReference(): Cypress.Chainable<string> {
    return this.getAssetReferenceCells().first().invoke('text').then(text => text.trim());
  }

  getAssetTableRows(): Cypress.Chainable {
    return cy.get('tr');
  }

  getAssetTableHeaders(): Cypress.Chainable {
    return cy.get('th');
  }

  getAssetNameCells(): Cypress.Chainable {
    return cy.get('[data-qa="cell-name"]');
  }

  getAssetReferenceCells(): Cypress.Chainable {
    return cy.get('[data-qa="cell-reference"]');
  }

  getAssetSerialNumberCells(): Cypress.Chainable {
    return cy.get('[data-qa="cell-serial_number"]');
  }
}
