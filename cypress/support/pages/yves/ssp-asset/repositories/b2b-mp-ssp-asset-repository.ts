import { SspAssetRepository } from '../ssp-asset-repository';
import { injectable } from 'inversify';

@injectable()
export class B2bMpSspAssetRepository implements SspAssetRepository {
  getSspAssetCustomerMenuItem(): Cypress.Chainable {
    return cy.get('[data-qa*="ssp-asset-customer-menu-item"]');
  }

  getCreateAssetButton(): Cypress.Chainable {
    return cy.get('[data-qa="create-ssp-asset"]');
  }

  getAssetForm(): Cypress.Chainable {
    return cy.get('[data-qa="customer-asset-form"]');
  }

  getNameInput(): Cypress.Chainable {
    return cy.get('#assetForm_name');
  }

  getSerialNumberInput(): Cypress.Chainable {
    return cy.get('#assetForm_serialNumber');
  }

  getNoteInput(): Cypress.Chainable {
    return cy.get('#assetForm_note');
  }

  getImageUploadInput(): Cypress.Chainable {
    return cy.get('#assetForm_asset_image_file');
  }

  getSspAssetImageDeleteCheckbox(): Cypress.Chainable {
    return cy.get('#assetForm_asset_image_delete');
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

  getUnassignmentErrorMessage(): string {
    return 'You cannot unassign your own business unit from the asset';
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
    return cy.get('[data-qa="edit-ssp-asset"]');
  }

  getUnassignButton(): Cypress.Chainable {
    return cy.get('[data-qa="unassign-ssp-asset"]');
  }

  getUnassignLink(): Cypress.Chainable {
    return cy.get('[data-qa="unassign-ssp-asset-link"]');
  }

  getCreateInquiryButton(): Cypress.Chainable {
    return cy.get('[data-qa="ssp-aset-create-inquiry"]');
  }

  getCreateClaimButton(): Cypress.Chainable {
    return cy.contains('Create inquiry');
  }

  getFirstRowViewButton(): Cypress.Chainable {
    return cy.get('[data-qa*="cell-actions"] a[href*="/customer/asset/details?reference="]').first();
  }

  getFirstRowReference(): Cypress.Chainable<string> {
    return this.getAssetReferenceCells()
      .first()
      .invoke('text')
      .then((text) => text.trim());
  }

  getAssetTableRows(): Cypress.Chainable {
    return cy.get('[data-qa*="advanced-table-ssp-assets"] tbody tr');
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

  getAccessTableFilterSelect(): Cypress.Chainable {
    return cy.get('[data-qa="ssp-asset-filter-scope"]');
  }

  getSspAssetAssignments(): Cypress.Chainable {
    return cy.get('[data-qa="ssp-asset-assignments"]');
  }

  getSspAssetServicesButton(): Cypress.Chainable {
    return cy.get('[data-qa="ssp-asset-services"]');
  }

  getSspAssetInquiriresTable(): Cypress.Chainable {
    return cy.get('[data-qa*="ssp-inquiry-table"]');
  }
  getSspAssetImageSrc(): Cypress.Chainable {
    return cy.get('[data-qa*="ssp-asset-image"]').invoke('attr', 'image-src');
  }
  getViewAllInquiriesLink(): Cypress.Chainable {
    return cy.get('[data-qa*="ssp-inquiry-table"]').find('a[href*="/customer/ssp-inquiry?ssp-asset-reference="');
  }

  getAccessTableFilterByBusinessUnitValue(): string {
    return 'filterByBusinessUnit';
  }

  getSspAssetFiltersSubmitButton(): Cypress.Chainable {
    return cy.get('[data-qa="submit-filters"]');
  }
}
