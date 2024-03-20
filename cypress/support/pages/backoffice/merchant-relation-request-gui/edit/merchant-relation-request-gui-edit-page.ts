import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '../../backoffice-page';
import { MerchantRelationRequestGuiEditRepository } from './merchant-relation-request-gui-edit-repository';

@injectable()
@autoWired
export class MerchantRelationRequestGuiEditPage extends BackofficePage {
  @inject(MerchantRelationRequestGuiEditRepository) private repository: MerchantRelationRequestGuiEditRepository;

  protected PAGE_URL = '/merchant-relation-request-gui/edit';

  addInternalComment = (comment: string): void => {
    this.repository.getInternalCommentTextarea().type(comment);
    this.repository.getInternalCommentSubmitButton().click();
  };

  rejectRequest = (): void => {
    this.repository.getRejectButton().click();
    this.repository.getConfirmRejectButton().click();
  };

  approveRequest = (isSplitEnabled: boolean): void => {
    this.repository.getApprovalButton().click();

    if (isSplitEnabled) {
      this.repository.getIsSplitEnabledCheckbox().check();
    }
    this.repository.getConfirmApprovalButton().click();
  };
}
