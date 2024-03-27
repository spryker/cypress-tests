import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MerchantRelationRequestEditRepository } from './merchant-relation-request-edit-repository';

@injectable()
@autoWired
export class MerchantRelationRequestEditPage extends BackofficePage {
  @inject(MerchantRelationRequestEditRepository) private repository: MerchantRelationRequestEditRepository;

  protected PAGE_URL = '/merchant-relation-request-gui/edit';

  addInternalComment = (params: AddInternalCommentParams): void => {
    this.repository.getInternalCommentTextarea().type(params.comment);
    this.repository.getInternalCommentSubmitButton().click();
  };

  reject = (): void => {
    this.repository.getRejectButton().click();
    this.repository.getConfirmRejectButton().click();
  };

  approve = (params: ApproveParams): void => {
    this.repository.getApprovalButton().click();

    if (params.isSplitEnabled) {
      this.repository.getIsSplitEnabledCheckbox().check();
    }

    this.repository.getConfirmApprovalButton().click();
  };
}

interface AddInternalCommentParams {
  comment: string;
}

interface ApproveParams {
  isSplitEnabled?: boolean;
}
