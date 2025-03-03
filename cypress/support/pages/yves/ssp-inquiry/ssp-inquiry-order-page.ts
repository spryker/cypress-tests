import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { SspInquiryRepository } from './ssp-inquiry-repository';

@injectable()
@autoWired
export class SspInquiryOrderPage extends YvesPage {
  @inject(REPOSITORIES.SspInquiryRepository) private repository: SspInquiryRepository;

  clickCreateSspInquiryButton(): void {
    this.repository.getCreateOrderSspInquiryButton().click();
  }
}
