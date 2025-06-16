import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementAttachRepository } from './ssp-file-management-attach-repository';

@injectable()
@autoWired
export class SspFileManagementAttachPage extends BackofficePage {
  @inject(SspFileManagementAttachRepository) private repository: SspFileManagementAttachRepository;

  selectCompany(prompt: string): void {
    cy.intercept('GET', '/self-service-portal/file-attachment-form-autocomplete/company**').as('companySearch');

    cy.get(this.repository.getCompanyFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(prompt);

    cy.wait('@companySearch');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  selectCompanyUser(prompt: string): void {
    cy.intercept('GET', '/self-service-portal/file-attachment-form-autocomplete/company-user**').as(
      'companyUserSearch'
    );

    cy.get(this.repository.getCompanyUserFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(prompt);

    cy.wait('@companyUserSearch');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  selectCompanyBusinessUnit(prompt: string): void {
    cy.intercept('GET', '/self-service-portal/file-attachment-form-autocomplete/company-business-unit**').as(
      'companyBusinessUnitSearch'
    );

    cy.get(this.repository.getCompanyBusinessUnitFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(prompt);

    cy.wait('@companyBusinessUnitSearch');

    cy.get(this.repository.getDropdownOptionSelector()).filter(':visible').first().click();
  }

  clickAssetAttachmentTab(): void {
    cy.get(this.repository.getAssetAttachmentTabSelector()).click();
  }

  selectAsset(prompt: string): void {
    cy.intercept('GET', '/self-service-portal/autocomplete-asset/asset**').as('assetSearch');

    cy.get(this.repository.getAssetFieldSelector())
      .siblings(this.repository.getSiblingSelector())
      .find(this.repository.getSearchFieldSelector())
      .type(prompt, { force: true });

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
      .and('contain', this.repository.getFileAttachmentSuccessText());
  }

  verifyAssetSuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', this.repository.getFileAttachmentSuccessText());
  }
}
