import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import { SspInquiryRepository } from './ssp-inquiry-repository';

@injectable()
@autoWired
export class SspInquiryCreatePage extends YvesPage {
  @inject(REPOSITORIES.SspInquiryRepository) private repository: SspInquiryRepository;

  public PAGE_URL = '/customer/ssp-inquiry/create';

  getTypeOptions(): Cypress.Chainable {
    return this.repository.getTypeOptions();
  }

  getOrderReferenceInput(): Cypress.Chainable {
    return this.repository.getOrderReferenceInput();
  }

  getSspAssetReferenceInput(): Cypress.Chainable {
    return this.repository.getSspAssetReferenceInput();
  }

  createOrderSspInquiry(params: OrderSspInquiryParams): void {
    this.createSspInquiry(params);
  }
  createSspAssetSspInquiry(params: SspAssetSspInquiryParams): void {
    this.createSspInquiry(params);
  }

  createSspInquiry(params: SspInquiryParams): void {
    this.repository.getSubjectInput().type(params.subject);
    this.repository.getDescriptionTextarea().type(params.description);
    for (const file of params.files) {
      this.repository.getFileInput().attachFile(file.name);
    }

    this.repository.getSubmitButton().click();
  }

  getSspInquiryCreatedMessage(): string {
    return this.repository.getSspInquiryCreatedMessage();
  }
}

interface SspInquiryParams {
  subject: string;
  description: string;
  files: UploadFile[];
  availableTypes: SspInquiryType[];
}

interface OrderSspInquiryParams extends SspInquiryParams {
  orderReference: string;
}

interface SspAssetSspInquiryParams extends SspInquiryParams {
  sspAssetReference: string;
}

export interface UploadFile {
  name: string;
  size: string;
  extension: string;
}

interface SspInquiryType {
  key: string;
  value: string;
}
