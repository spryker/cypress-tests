import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { SspAssetDetailRepository } from './ssp-asset-detail-repository';

@injectable()
@autoWired
export class SspAssetDetailPage extends BackofficePage {
  @inject(SspAssetDetailRepository) private repository: SspAssetDetailRepository;

  protected PAGE_URL = '/self-service-portal/view-asset';

  openCompaniesTab(): void {
    this.repository
      .getSspAssetRelationTabs()
      .find(this.repository.getCompaniesTabClickSelector())
      .click({ force: true });
  }

  openServicesTab(): void {
    this.repository.getSspAssetRelationTabs().find(this.repository.getServicesTabSelector()).click();
  }

  getReferenceValue(): Cypress.Chainable {
    return cy.get(this.repository.getReferenceValueSelector());
  }

  getNameValue(): Cypress.Chainable {
    return cy.get(this.repository.getNameValueSelector());
  }

  getSerialNumberValue(): Cypress.Chainable {
    return cy.get(this.repository.getSerialNumberValueSelector());
  }

  getStatusValue(): Cypress.Chainable {
    return cy.get(this.repository.getStatusValueSelector());
  }

  getNoteValue(): Cypress.Chainable {
    return cy.get(this.repository.getNoteValueSelector());
  }

  getImage(): Cypress.Chainable {
    return cy.get(this.repository.getImageSelector());
  }

  getBusinessUnitOwnerValue(): Cypress.Chainable {
    return cy.get(this.repository.getBusinessUnitOwnerValueSelector());
  }

  getCompaniesTab(): Cypress.Chainable {
    return this.repository.getSspAssetRelationTabs().find(this.repository.getCompaniesTabSelector());
  }

  getInquiriesTab(): Cypress.Chainable {
    return this.repository.getSspAssetRelationTabs().find(this.repository.getInquiriesTabSelector());
  }

  getServicesTab(): Cypress.Chainable {
    return this.repository.getSspAssetRelationTabs().find(this.repository.getServicesTabSelector());
  }

  getCompanyTable(): Cypress.Chainable {
    return this.repository.getSspAssetRelationTabs().find(this.repository.getCompanyTableSelector());
  }

  getCompaniesTabContent(): Cypress.Chainable {
    return this.repository.getCompaniesTabContent();
  }

  getOrderReferenceColumn(): Cypress.Chainable {
    return cy.get(this.repository.getOrderReferenceColumnSelector());
  }

  clickEditButton(): void {
    cy.get(this.repository.getEditButtonSelector()).click();
  }

  clickBackButton(): void {
    cy.get(this.repository.getBackButtonSelector()).click();
  }

  /**
   * Gets the asset ID from the current URL
   * @returns Cypress.Chainable with the asset ID as a number
   */
  getAssetId(): Cypress.Chainable<number> {
    return cy.url().then((url) => {
      const urlParams = new URLSearchParams(new URL(url).search);
      const idSspAsset = urlParams.get('id-ssp-asset');

      if (idSspAsset) {
        return parseInt(idSspAsset, 10);
      }

      throw new Error('Asset ID not found in URL');
    });
  }

  getReference(): Cypress.Chainable<string> {
    return cy
      .get(this.repository.getReferenceValueSelector())
      .invoke('text')
      .then((text) => text.trim());
  }
}
