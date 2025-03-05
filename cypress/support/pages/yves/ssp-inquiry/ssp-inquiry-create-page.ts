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

  createOrderSspInquiry(params: OrderSspInquiryParams): void {
    this.repository.getOrderReferenceInput().should('have.value', params.orderReference);
    this.createSspInquiry(params);
  }

  createSspInquiry(params: SspInquiryParams): void {
    this.repository.getTypeOptions().should('have.length', params.availableTypes.length);
    params.availableTypes.forEach((type, index) => {
      this.repository.getTypeOptions().eq(index).should('have.value', type);
    });

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
  availableTypes: string[];
}

interface OrderSspInquiryParams extends SspInquiryParams {
  orderReference: string;
}

export interface UploadFile {
  name: string;
  size: string;
  extension: string;
}
