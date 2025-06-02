import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { ActionEnum, CustomerIndexPage, CustomerRemoveMfaPage, MultiFactorAuthPage } from '../../pages/backoffice';

@injectable()
@autoWired
export class CustomerMfaRemoveScenario {
  @inject(CustomerIndexPage) private customerIndexPage: CustomerIndexPage;
  @inject(CustomerRemoveMfaPage) private customerRemoveMfaPage: CustomerRemoveMfaPage;
  @inject(MultiFactorAuthPage) private multiFactorAuthPage: MultiFactorAuthPage;

  execute(params: ExecuteParams): void {
    this.customerIndexPage.visit();
    this.customerIndexPage.update({
      action: ActionEnum.removeMultiFactorAuthentication,
      searchQuery: params.email,
    });

    this.customerRemoveMfaPage.confirmRemoveMultiFactorAuthentication();

    this.multiFactorAuthPage.waitForDeactivationSuccessMessage();

    this.customerIndexPage.assertPageLocation();
    this.customerIndexPage.assertRemoveMultiFactorAuthenticationButtonDoesNotExist({
      searchQuery: params.email,
    });
  }
}

interface ExecuteParams {
  email: string;
}
