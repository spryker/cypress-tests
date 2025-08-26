import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspFileManagementAttachRepository {
  getAttachButtonSelector = (): string => '[data-qa="attach-button"]';
  
  getAttachmentScopeHiddenInput = (): string => '[data-qa="attachmentScope"]';
  
  getAssetScopeTab = (): string => '.nav-tabs a[href="#tab-content-asset"], [data-qa="tab-asset"], .nav-tabs li:nth-child(1) a';
  getBusinessUnitScopeTab = (): string => '.nav-tabs a[href="#tab-content-business-unit"], [data-qa="tab-business-unit"], .nav-tabs li:nth-child(2) a';
  getCompanyUserScopeTab = (): string => '.nav-tabs a[href="#tab-content-company-user"], [data-qa="tab-company-user"], .nav-tabs li:nth-child(3) a';
  getCompanyScopeTab = (): string => '.nav-tabs a[href="#tab-content-company"], [data-qa="tab-company"], .nav-tabs li:nth-child(4) a';
  
  getAssetTabSelector = (): string => 'a[href="#asset-attachment"]';
  getBusinessUnitTabSelector = (): string => 'a[href="#business-unit-attachment"]';
  getCompanyUserTabSelector = (): string => 'a[href="#company-user-attachment"]';
  getCompanyTabSelector = (): string => 'a[href="#company-attachment"]';
  
  getAvailableAssetTableSelector = (): string => '#available-ssp-asset-table';
  getAvailableBusinessUnitTableSelector = (): string => '#available-business-unit-table';
  getAvailableCompanyUserTableSelector = (): string => '#available-company-user-table';
  getAvailableCompanyTableSelector = (): string => '#available-company-table';
  
  getAssignedAssetTableSelector = (): string => '#assigned-ssp-asset-table';
  getAssignedBusinessUnitTableSelector = (): string => '#assigned-business-unit-table';
  getAssignedCompanyUserTableSelector = (): string => '#assigned-company-user-table';
  getAssignedCompanyTableSelector = (): string => '#assigned-company-table';
  
  getTableRowCheckboxSelector = (): string => 'input[type="checkbox"]';
  getSelectAllCheckboxSelector = (): string => 'thead input[type="checkbox"]';
  
  getAssetCsvImportSelector = (): string => '[data-qa="asset-file-upload"]';
  getBusinessUnitCsvImportSelector = (): string => '[data-qa="business-unit-file-upload"]';
  getCompanyUserCsvImportSelector = (): string => '[data-qa="company-user-file-upload"]';
  getCompanyCsvImportSelector = (): string => '[data-qa="company-file-upload"]';
  
  getSubmitButtonSelector = (): string => 'button[type="submit"], input[type="submit"]';
  getSaveButtonSelector = (): string => '.form-actions button, .tabs-footer button';
  getModalSubmitButtonSelector = (): string => '[data-qa="attach-submit-button"]';
  
  getSuccessMessageSelector = (): string => '.alert-success, [data-qa="success-message"]';
  getFileAttachmentSuccessText = (): string => 'File attachments have been created successfully.';
  
  getAssetTableSearchSelector = (): string => '#available-ssp-asset-table_filter label input';
  getBusinessUnitTableSearchSelector = (): string => '#available-business-unit-table_filter label input';
  getCompanyUserTableSearchSelector = (): string => '#available-company-user-table_filter label input';
  getCompanyTableSearchSelector = (): string => '#available-company-table_filter label input';
  
  getAssignedAssetTableSearchSelector = (): string => '#assigned-ssp-asset-table_filter label input';
  getAssignedBusinessUnitTableSearchSelector = (): string => '#assigned-business-unit-table_filter label input';
  getAssignedCompanyUserTableSearchSelector = (): string => '#assigned-company-user-table_filter label input';
  getAssignedCompanyTableSearchSelector = (): string => '#assigned-company-table_filter label input';
  
  getTableSearchSelector = (): string => '.dataTables_filter input[type="search"]';
  
  getTablePaginationSelector = (): string => '.dataTables_paginate';
  getNextPageSelector = (): string => '.dataTables_paginate .next';
  getPrevPageSelector = (): string => '.dataTables_paginate .previous';
}