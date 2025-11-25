import { MerchantRegistrationListPage, MerchantRegistrationViewPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class MerchantRegistrationRejectionScenario {
  @inject(MerchantRegistrationListPage) private listPage: MerchantRegistrationListPage;
  @inject(MerchantRegistrationViewPage) private viewPage: MerchantRegistrationViewPage;

  execute = (params: ExecuteParams): void => {
    this.listPage.visit();
    this.listPage.viewRegistrationByEmail(params.email);

    if (params.internalNote) {
      this.viewPage.addInternalNote(params.internalNote);
    }

    this.viewPage.rejectRequest();
  };
}

interface ExecuteParams {
  email: string;
  internalNote?: string;
}
