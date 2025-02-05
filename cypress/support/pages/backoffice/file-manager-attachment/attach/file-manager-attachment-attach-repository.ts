import { injectable } from 'inversify';
import { autoWired } from '@utils';

@injectable()
@autoWired
export class FileManagerAttachmentAttachRepository {
  getAttachButtonSelector = (): string => '[data-qa="attach-button"]';
  getCompanyFieldSelector = (): string => '[data-qa="attach-company-field"]';
  getCompanyUserFieldSelector = (): string => '[data-qa="attach-company-user-field"]';
  getCompanyBusinessUnitFieldSelector = (): string => '[data-qa="attach-company-business-unit-field"]';
  getSiblingSelector = (): string => 'span';
  getSearchFieldSelector = (): string => 'input.select2-search__field';
  getDropdownOptionSelector = (): string => '.select2-results__option';
  getSubmitButtonSelector = (): string => '[data-qa="attach-submit-button"]';
  getSuccessMessageSelector = (): string => '[data-qa="success-message"]';
}
