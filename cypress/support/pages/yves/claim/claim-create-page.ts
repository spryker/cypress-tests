import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import 'cypress-file-upload';
import { ClaimRepository } from './claim-repository';

@injectable()
@autoWired
export class ClaimCreatePage extends YvesPage {
  @inject(REPOSITORIES.ClaimRepository) private repository: ClaimRepository;

  public PAGE_URL = '/customer/claim/create';

  createOrderClaim(params: OrderClaimParams): void {
    this.repository.getOrderReferenceInput().should('have.value', params.orderReference);
    this.createClaim(params);
  }

  createClaim(params: ClaimParams): void {
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

  getClaimCreatedMessage(): string {
    return this.repository.getClaimCreatedMessage();
  }
}

interface ClaimParams {
  subject: string;
  description: string;
  files: UploadFile[];
  availableTypes: string[];
}

interface OrderClaimParams extends ClaimParams {
  orderReference: string;
}

export interface UploadFile {
  name: string;
  size: string;
  extension: string;
}
