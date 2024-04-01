import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { MerchantRelationRequestCreateRepository } from './merchant-relation-request-create-repository';

@injectable()
@autoWired
export class MerchantRelationRequestCreatePage extends YvesPage {
  @inject(REPOSITORIES.MerchantRelationRequestCreateRepository)
  private repository: MerchantRelationRequestCreateRepository;

  protected PAGE_URL = '/company/merchant-relation-request/create';

  create = (params: CreateParams): void => {
    if (params.merchantReference) {
      this.repository.getMerchantSelect().select(params.merchantReference, { force: true });
    }

    this.repository.getBusinessUnitOwnerSelect().select(params.ownerBusinessUnitId.toString(), { force: true });

    if (params.businessUnitIds.length > 0) {
      this.repository.getBusinessUnitCheckboxes().check(params.businessUnitIds.map(String), { force: true });
    }

    if (params.messageToMerchant) {
      this.repository.getRequestNoteInput().clear().type(params.messageToMerchant);
    }

    this.repository.getSubmitButton().click();
  };
}

interface CreateParams {
  merchantReference?: string;
  ownerBusinessUnitId: number;
  businessUnitIds: number[];
  messageToMerchant?: string;
}
