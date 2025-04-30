import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspAssetDetailRepository {
  getReferenceValueSelector = (): string => '[data-qa="ssp-asset-reference"]';
  getNameValueSelector = (): string => '[data-qa="ssp-asset-name"]';
  getSerialNumberValueSelector = (): string => '[data-qa="ssp-asset-serial-number"]';
  getStatusValueSelector = (): string => '[data-qa="ssp-asset-status"]';
  getNoteValueSelector = (): string => '[data-qa="ssp-asset-note"]';
  getBusinessUnitOwnerValueSelector = (): string => '[data-qa="ssp-asset-business-unit-owner"]';
  getImageSelector = (): string => '[data-qa="ssp-asset-image"]';
  getEditButtonSelector = (): string => 'a[href*="/ssp-asset-management/update?id-ssp-asset="]';
  getBackButtonSelector = (): string => 'a[href*="/ssp-asset-management"]';

  getCompanyTableSelector = (): string => 'table[data-qa="data-table"]';
  getCompaniesTabContent = (): Cypress.Chainable => cy.get('[data-qa=tab-content-companies]');
  getOrderReferenceColumnSelector = (): string => 'div#tab-content-ssp-services td.column-spy_sales_order\\.order_reference';

  getSspAssetRelationTabs = (): Cypress.Chainable => cy.get('[data-qa="ssp-asset-relations"]');
  getCompaniesTabSelector = (): string => '[data-qa="tab-content-companies"]';
  getInquiriesTabSelector = (): string => '[data-qa="tab-content-ssp-inquiries"]';
  getServicesTabSelector = (): string => 'a[href="#tab-content-ssp-services"]';
}
