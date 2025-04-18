import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementAttachRepository } from './ssp-file-management-attach-repository';

@injectable()
@autoWired
export class SspFileManagementAttachPage extends BackofficePage {
  @inject(SspFileManagementAttachRepository) private repository: SspFileManagementAttachRepository;

  selectCompany(): void {
    cy.intercept('GET', '/ssp-file-management/autocomplete/company**').as('companySearch');

    cy.get(this.repository.getCompanyFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(this.repository.getCompanyPrompt());

    cy.wait('@companySearch');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  selectCompanyUser(): void {
    cy.intercept('GET', '/ssp-file-management/autocomplete/company-user**').as('companyUserSearch');

    cy.get(this.repository.getCompanyUserFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(this.repository.getCompanyUserPrompt());

    cy.wait('@companyUserSearch');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  selectCompanyBusinessUnit(): void {
    cy.intercept('GET', '/ssp-file-management/autocomplete/company-business-unit**').as('companyBusinessUnitSearch');

    cy.get(this.repository.getCompanyBusinessUnitFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(this.repository.getCompanyBusinessUnitPrompt());

    cy.wait('@companyBusinessUnitSearch');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  clickAssetAttachmentTab(): void {
    cy.get(this.repository.getAssetAttachmentTabSelector()).click();
  }

  selectAsset(): void {
    cy.intercept('GET', '/ssp-asset-management/autocomplete/asset**').as('assetSearch');

    cy.get(this.repository.getAssetFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(this.repository.getAssetPrompt(), { force: true });

    cy.wait('@assetSearch');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  submitForm(): void {
    cy.get(this.repository.getSubmitButtonSelector()).click();
  }

  submitAssetForm(): void {
    cy.get(this.repository.getAssetSubmitButtonSelector()).click();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', 'File attachments have been created successfully.');
  }

  verifyAssetSuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', 'Asset attachment saved successfully.');
  }
}
