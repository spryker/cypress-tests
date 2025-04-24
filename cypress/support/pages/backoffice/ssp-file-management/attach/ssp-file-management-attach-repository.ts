import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class SspFileManagementAttachRepository {
  getAttachButtonSelector = (): string => '[data-qa="attach-button"]';
  getCompanyFieldSelector = (): string => '[data-qa="attach-company-field"]';
  getCompanyUserFieldSelector = (): string => '[data-qa="attach-company-user-field"]';
  getCompanyBusinessUnitFieldSelector = (): string => '[data-qa="attach-company-business-unit-field"]';
  getAssetFieldSelector = (): string => '[data-qa="asset-field"]';
  getAssetAttachmentTabSelector = (): string => 'a[href="#tab-content-asset-attachment"]';
  getSiblingSelector = (): string => 'span';
  getSearchFieldSelector = (): string => 'input.select2-search__field';
  getDropdownOptionSelector = (): string => '.select2-results__option';
  getSubmitButtonSelector = (): string => '[data-qa="attach-submit-button"]';
  getAssetSubmitButtonSelector = (): string => '[data-qa="attach-asset-submit-button"]';
  getSuccessMessageSelector = (): string => '[data-qa="success-message"]';
  getAssetAttachmentSuccessText = (): string => 'Asset attachment saved successfully.';
  getFileAttachmentSuccessText = (): string => 'File attachments have been created successfully.';
}
