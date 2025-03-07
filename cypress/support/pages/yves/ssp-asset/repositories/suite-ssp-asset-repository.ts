import { injectable } from 'inversify';
import { SspAssetRepository } from '../ssp-asset-repository';

@injectable()
export class SuiteSspAssetRepository implements SspAssetRepository {
  getCreateAssetButton(): Cypress.Chainable {
    return cy.get('[data-qa="create-asset-button"]');
  }

  getAssetForm(): Cypress.Chainable {
    return cy.get('[data-qa="customer-create-asset-form"]');
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

  // Asset detail page selectors
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
}
