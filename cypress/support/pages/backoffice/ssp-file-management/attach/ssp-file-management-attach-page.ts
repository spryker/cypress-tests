import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementAttachRepository } from './ssp-file-management-attach-repository';

@injectable()
@autoWired
export class SspFileManagementAttachPage extends BackofficePage {
  @inject(SspFileManagementAttachRepository) private repository: SspFileManagementAttachRepository;

  selectAttachmentScope(
    scope: 'asset' | 'business-unit' | 'company-user' | 'company' | 'model',
    options?: Partial<Cypress.ClickOptions>
  ): void {
    const scopeTextMap = {
      asset: 'Asset',
      'business-unit': 'Business Unit',
      'company-user': 'Company User',
      company: 'Company',
      model: 'Model',
    };

    const scopeText = scopeTextMap[scope];
    const scopeOrder = ['asset', 'model', 'business-unit', 'company-user', 'company'];

    cy.get('.nav-tabs', { timeout: 10000 })
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('a').then(($tabs) => {
          const matchingTab = $tabs.filter((index, element) => {
            const text = Cypress.$(element).text().trim();
            return text.toLowerCase() === scopeText.toLowerCase();
          });

          if (matchingTab.length > 0) {
            cy.wrap(matchingTab).first().click(options);
            return;
          }

          const matchingHrefTab = $tabs.filter((index, element) => {
            const href = Cypress.$(element).attr('href');
            return href === `#tab-content-${scope}`;
          });

          if (matchingHrefTab.length > 0) {
            cy.wrap(matchingHrefTab)
              .first()
              .click(options || { force: true });
            return;
          }

          const tabIndex = scopeOrder.indexOf(scope);
          cy.wrap($tabs)
            .eq(tabIndex)
            .click(options || { force: true });
        });
      });
  }

  clickScopeTab(scope: 'asset' | 'business-unit' | 'company-user' | 'company'): void {
    const tabSelectors = {
      asset: this.repository.getAssetTabSelector(),
      'business-unit': this.repository.getBusinessUnitTabSelector(),
      'company-user': this.repository.getCompanyUserTabSelector(),
      company: this.repository.getCompanyTabSelector(),
    };

    cy.get(tabSelectors[scope]).click({ force: true });
  }

  selectAvailableItems(scope: 'asset' | 'business-unit' | 'company-user' | 'company', searchTerms: string[]): void {
    const tableSelectors = {
      asset: this.repository.getAvailableAssetTableSelector(),
      'business-unit': this.repository.getAvailableBusinessUnitTableSelector(),
      'company-user': this.repository.getAvailableCompanyUserTableSelector(),
      company: this.repository.getAvailableCompanyTableSelector(),
    };

    const searchSelectors = {
      asset: this.repository.getAssetTableSearchSelector(),
      'business-unit': this.repository.getBusinessUnitTableSearchSelector(),
      'company-user': this.repository.getCompanyUserTableSearchSelector(),
      company: this.repository.getCompanyTableSearchSelector(),
    };

    const tableSelector = tableSelectors[scope];
    const searchSelector = searchSelectors[scope];

    searchTerms.forEach((searchTerm) => {
      cy.get(searchSelector).clear();
      cy.get(searchSelector).type(searchTerm);
      cy.get(`${tableSelector} tbody tr`)
        .first()
        .find(this.repository.getTableRowCheckboxSelector())
        .check({ force: true });
    });
  }

  selectAssignedItems(scope: 'asset' | 'business-unit' | 'company-user' | 'company', searchTerms: string[]): void {
    const tableSelectors = {
      asset: this.repository.getAssignedAssetTableSelector(),
      'business-unit': this.repository.getAssignedBusinessUnitTableSelector(),
      'company-user': this.repository.getAssignedCompanyUserTableSelector(),
      company: this.repository.getAssignedCompanyTableSelector(),
    };

    const searchSelectors = {
      asset: this.repository.getAssignedAssetTableSearchSelector(),
      'business-unit': this.repository.getAssignedBusinessUnitTableSearchSelector(),
      'company-user': this.repository.getAssignedCompanyUserTableSearchSelector(),
      company: this.repository.getAssignedCompanyTableSearchSelector(),
    };

    const tableSelector = tableSelectors[scope];
    const searchSelector = searchSelectors[scope];

    searchTerms.forEach((searchTerm) => {
      cy.get(searchSelector).clear({ force: true });
      cy.get(searchSelector).type(searchTerm, { force: true });
      cy.get(`${tableSelector} tbody tr`)
        .first()
        .find(this.repository.getTableRowCheckboxSelector())
        .check({ force: true });
    });
  }

  uploadCsvFile(scope: 'asset' | 'business-unit' | 'company-user' | 'company', fileName: string): void {
    const csvSelectors = {
      asset: this.repository.getAssetCsvImportSelector(),
      'business-unit': this.repository.getBusinessUnitCsvImportSelector(),
      'company-user': this.repository.getCompanyUserCsvImportSelector(),
      company: this.repository.getCompanyCsvImportSelector(),
    };

    cy.get(csvSelectors[scope]).attachFile(fileName);
  }

  attachAssets(assetNames: string[]): void {
    this.selectAttachmentScope('asset');
    this.selectAvailableItems('asset', assetNames);
    this.submitForm();
  }

  attachBusinessUnits(businessUnitNames: string[]): void {
    this.selectAttachmentScope('business-unit');
    this.selectAvailableItems('business-unit', businessUnitNames);
    this.submitForm();
  }

  attachCompanyUsers(companyUserNames: string[]): void {
    this.selectAttachmentScope('company-user');
    this.selectAvailableItems('company-user', companyUserNames);
    this.submitForm();
  }

  attachCompanies(companyNames: string[]): void {
    this.selectAttachmentScope('company');
    this.selectAvailableItems('company', companyNames);
    this.submitForm();
  }

  attachAssetsViaCsv(csvFileName: string): void {
    this.selectAttachmentScope('asset');
    this.uploadCsvFile('asset', csvFileName);
    this.submitForm();
  }

  detachAssets(assetNames: string[]): void {
    this.selectAttachmentScope('asset');
    this.selectAssignedItems('asset', assetNames);
    this.submitForm();
  }

  selectCompany(companyName: string): void {
    this.attachCompanies([companyName]);
  }

  selectCompanyUser(companyUserName: string): void {
    this.attachCompanyUsers([companyUserName]);
  }

  selectCompanyBusinessUnit(businessUnitName: string): void {
    this.attachBusinessUnits([businessUnitName]);
  }

  selectAsset(assetName: string): void {
    this.attachAssets([assetName]);
  }

  clickAssetAttachmentTab(): void {
    this.selectAttachmentScope('asset');
  }

  submitForm(): void {
    cy.get(this.repository.getSaveButtonSelector()).first().click({ force: true });

    cy.get(this.repository.getModalSubmitButtonSelector(), { timeout: 10000 }).click({ force: true });
  }

  submitAssetForm(): void {
    this.submitForm();
  }

  verifySuccessMessage(): void {
    cy.get(this.repository.getSuccessMessageSelector())
      .should('be.visible')
      .and('contain', this.repository.getFileAttachmentSuccessText());
  }

  verifyAssetSuccessMessage(): void {
    this.verifySuccessMessage();
  }

  waitForTableToLoad(scope: 'asset' | 'business-unit' | 'company-user' | 'company'): void {
    const tableSelectors = {
      asset: this.repository.getAvailableAssetTableSelector(),
      'business-unit': this.repository.getAvailableBusinessUnitTableSelector(),
      'company-user': this.repository.getAvailableCompanyUserTableSelector(),
      company: this.repository.getAvailableCompanyTableSelector(),
    };

    cy.get(tableSelectors[scope]).should('be.visible');
    cy.get(`${tableSelectors[scope]}_processing`, { timeout: 10000 }).should('not.exist');
  }
}
