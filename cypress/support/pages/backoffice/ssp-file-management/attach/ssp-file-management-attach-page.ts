import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { BackofficePage } from '@pages/backoffice';
import { SspFileManagementAttachRepository } from './ssp-file-management-attach-repository';

@injectable()
@autoWired
export class SspFileManagementAttachPage extends BackofficePage {
  @inject(SspFileManagementAttachRepository) private repository: SspFileManagementAttachRepository;

  /**
   * Select attachment scope by clicking on the tab
   */
  selectAttachmentScope(scope: 'asset' | 'business-unit' | 'company-user' | 'company'): void {
    cy.get('.nav-tabs', { timeout: 10000 }).should('be.visible');
    
    cy.get('.nav-tabs a').then($tabs => {
      const tabTexts = Array.from($tabs).map(tab => tab.textContent?.trim());
      cy.log('Available tabs:', tabTexts.join(', '));
      
      const tabHrefs = Array.from($tabs).map(tab => tab.getAttribute('href'));
      cy.log('Tab hrefs:', tabHrefs.join(', '));
    });
    
    const scopeText = scope === 'business-unit' ? 'Business Unit' : 
                     scope === 'company-user' ? 'Company User' :
                     scope === 'company' ? 'Company' : 'Asset';
    
    cy.get('.nav-tabs a').contains(scopeText, { matchCase: false }).then($tab => {
      if ($tab.length > 0) {
        cy.wrap($tab).first().click({ force: true });
        cy.log(`Clicked tab by text: ${scopeText}`);
      } else {

        cy.get(`.nav-tabs a[href="#tab-content-${scope}"]`).then($hrefTab => {
          if ($hrefTab.length > 0) {
            cy.wrap($hrefTab).first().click({ force: true });
            cy.log(`Clicked tab by href: #tab-content-${scope}`);
          } else {

            const tabIndex = ['asset', 'business-unit', 'company-user', 'company'].indexOf(scope);
            cy.get('.nav-tabs a').eq(tabIndex).click({ force: true });
            cy.log(`Clicked tab by index: ${tabIndex}`);
          }
        });
      }
    });
    

    cy.wait(1000);
  }

  /**
   * Click on specific scope tab
   */
  clickScopeTab(scope: 'asset' | 'business-unit' | 'company-user' | 'company'): void {
    const tabSelectors = {
      'asset': this.repository.getAssetTabSelector(),
      'business-unit': this.repository.getBusinessUnitTabSelector(),
      'company-user': this.repository.getCompanyUserTabSelector(),
      'company': this.repository.getCompanyTabSelector(),
    };
    
    cy.get(tabSelectors[scope]).click({ force: true });
  }

  /**
   * Select items in available table by searching and checking checkboxes
   */
  selectAvailableItems(scope: 'asset' | 'business-unit' | 'company-user' | 'company', searchTerms: string[]): void {
    const tableSelectors = {
      'asset': this.repository.getAvailableAssetTableSelector(),
      'business-unit': this.repository.getAvailableBusinessUnitTableSelector(),
      'company-user': this.repository.getAvailableCompanyUserTableSelector(),
      'company': this.repository.getAvailableCompanyTableSelector(),
    };


    const searchSelectors = {
      'asset': this.repository.getAssetTableSearchSelector(),
      'business-unit': this.repository.getBusinessUnitTableSearchSelector(),
      'company-user': this.repository.getCompanyUserTableSearchSelector(),
      'company': this.repository.getCompanyTableSearchSelector(),
    };

    const tableSelector = tableSelectors[scope];
    const searchSelector = searchSelectors[scope];
    
    searchTerms.forEach((searchTerm) => {

      cy.get(searchSelector)
        .clear({ force: true })
        .type(searchTerm, { force: true });
      

      cy.wait(1000);
      

      cy.get(`${tableSelector} tbody tr`)
        .first()
        .find(this.repository.getTableRowCheckboxSelector())
        .check({ force: true });
    });
  }

  /**
   * Select items in assigned table (for detachment)
   */
  selectAssignedItems(scope: 'asset' | 'business-unit' | 'company-user' | 'company', searchTerms: string[]): void {
    const tableSelectors = {
      'asset': this.repository.getAssignedAssetTableSelector(),
      'business-unit': this.repository.getAssignedBusinessUnitTableSelector(),
      'company-user': this.repository.getAssignedCompanyUserTableSelector(),
      'company': this.repository.getAssignedCompanyTableSelector(),
    };


    const searchSelectors = {
      'asset': this.repository.getAssignedAssetTableSearchSelector(),
      'business-unit': this.repository.getAssignedBusinessUnitTableSearchSelector(),
      'company-user': this.repository.getAssignedCompanyUserTableSearchSelector(),
      'company': this.repository.getAssignedCompanyTableSearchSelector(),
    };

    const tableSelector = tableSelectors[scope];
    const searchSelector = searchSelectors[scope];
    
    searchTerms.forEach((searchTerm) => {

      cy.get(searchSelector)
        .clear({ force: true })
        .type(searchTerm, { force: true });
      

      cy.wait(1000);
      

      cy.get(`${tableSelector} tbody tr`)
        .first()
        .find(this.repository.getTableRowCheckboxSelector())
        .check({ force: true });
    });
  }

  /**
   * Upload CSV file for import
   */
  uploadCsvFile(scope: 'asset' | 'business-unit' | 'company-user' | 'company', fileName: string): void {
    const csvSelectors = {
      'asset': this.repository.getAssetCsvImportSelector(),
      'business-unit': this.repository.getBusinessUnitCsvImportSelector(),
      'company-user': this.repository.getCompanyUserCsvImportSelector(),
      'company': this.repository.getCompanyCsvImportSelector(),
    };

    cy.get(csvSelectors[scope]).attachFile(fileName);
  }

  /**
   * Attach assets manually by selection
   */
  attachAssets(assetNames: string[]): void {
    this.selectAttachmentScope('asset');
    this.selectAvailableItems('asset', assetNames);
    this.submitForm();
  }

  /**
   * Attach business units manually by selection
   */
  attachBusinessUnits(businessUnitNames: string[]): void {
    this.selectAttachmentScope('business-unit');
    this.selectAvailableItems('business-unit', businessUnitNames);
    this.submitForm();
  }

  /**
   * Attach company users manually by selection
   */
  attachCompanyUsers(companyUserNames: string[]): void {
    this.selectAttachmentScope('company-user');
    this.selectAvailableItems('company-user', companyUserNames);
    this.submitForm();
  }

  /**
   * Attach companies manually by selection
   */
  attachCompanies(companyNames: string[]): void {
    this.selectAttachmentScope('company');
    this.selectAvailableItems('company', companyNames);
    this.submitForm();
  }

  /**
   * Attach assets via CSV import
   */
  attachAssetsViaCsv(csvFileName: string): void {
    this.selectAttachmentScope('asset');
    this.uploadCsvFile('asset', csvFileName);
    this.submitForm();
  }

  /**
   * Detach assets by selecting them in assigned table
   */
  detachAssets(assetNames: string[]): void {
    this.selectAttachmentScope('asset');
    this.selectAssignedItems('asset', assetNames);
    this.submitForm();
  }

  /**
   * Legacy methods for backward compatibility (updated to use new approach)
   */
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

  /**
   * Submit the form
   */
  submitForm(): void {

    cy.get(this.repository.getSaveButtonSelector()).first().click({ force: true });
    

    cy.get(this.repository.getModalSubmitButtonSelector(), { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });
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

  /**
   * Wait for table to load
   */
  waitForTableToLoad(scope: 'asset' | 'business-unit' | 'company-user' | 'company'): void {
    const tableSelectors = {
      'asset': this.repository.getAvailableAssetTableSelector(),
      'business-unit': this.repository.getAvailableBusinessUnitTableSelector(),
      'company-user': this.repository.getAvailableCompanyUserTableSelector(),
      'company': this.repository.getAvailableCompanyTableSelector(),
    };

    cy.get(tableSelectors[scope]).should('be.visible');

    cy.get(`${tableSelectors[scope]}_processing`, { timeout: 10000 }).should('not.exist');
  }
}