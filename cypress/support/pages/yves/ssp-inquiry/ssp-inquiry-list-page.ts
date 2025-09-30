import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { SspInquiryRepository } from './ssp-inquiry-repository';
import Chainable = Cypress.Chainable;

@injectable()
@autoWired
export class SspInquiryListPage extends YvesPage {
  @inject(REPOSITORIES.SspInquiryRepository) private repository: SspInquiryRepository;

  protected PAGE_URL = '/customer/ssp-inquiry';

  clickCreateSspInquiryButton(): void {
    this.getCreateSspInquiryButton().click();
  }

  getCreateSspInquiryButton(): Chainable {
    return this.repository.getCreateGeneralSspInquiryButton();
  }

  openLatestSspInquiryDetailsPage(): void {
    this.repository.getFirstRowViewButton().click();
  }

  assetPageHasNoSspInquiries(): void {
    this.repository.getSspInquiryDetailLinks().should('not.exist');
  }

  getFirstRowReference(): string {
    return this.repository.getFirstRowReference();
  }

  submitSspInquirySearchForm(): void {
    this.repository.getSspInquirySearchFormSubmitButton().click();
  }
}
