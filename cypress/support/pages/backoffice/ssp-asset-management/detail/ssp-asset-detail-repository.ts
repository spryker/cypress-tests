import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspAssetDetailRepository {
  getReferenceValueSelector = (): string => 'dd[data-qa="ssp-asset-reference"]';
  getNameValueSelector = (): string => 'dd[data-qa="ssp-asset-name"]';
  getSerialNumberValueSelector = (): string => 'dd[data-qa="ssp-asset-serial-number"]';
  getStatusValueSelector = (): string => 'dd[data-qa="ssp-asset-status"]';
  getNoteValueSelector = (): string => 'dd[data-qa="ssp-asset-note"]';
  getBusinessUnitOwnerValueSelector = (): string => 'dd[data-qa="ssp-asset-business-unit-owner"]';
  getImageSelector = (): string => 'img[data-qa="ssp-asset-image"]';
  getEditButtonSelector = (): string => 'a.btn-edit';
  getBackButtonSelector = (): string => 'a.btn-back';

  getCompanyTableSelector = (): string => 'table[data-qa="data-table"]';
  getCompanyNameColumnSelector = (): string => 'div#tab-content-companies td.column-spy_company\\.name';
  getBusinessUnitNameColumnSelector = (): string =>
    'div#tab-content-companies td.column-spy_company_business_unit\\.name';
  getOrderReferenceColumnSelector = (): string => 'div#tab-content-ssp-services td.column-spy_sales_order\\.order_reference';

  getSspAssetRelationTabs = (): Cypress.Chainable => cy.get('div[data-qa="ssp-asset-relations"]');
  getCompaniesTabSelector = (): string => 'a[href="#tab-content-companies"]';
  getInquiriesTabSelector = (): string => 'a[href="#tab-content-ssp-inquiries"]';
  getServicesTabSelector = (): string => 'a[href="#tab-content-ssp-services"]';
}
