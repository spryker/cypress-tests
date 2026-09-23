import { injectable, inject } from 'inversify';
import { autoWired } from '@utils';
import { UserCreatePage, MultiFactorAuthPage } from '../../pages/backoffice';

@injectable()
@autoWired
export class UserMfaCreateScenario {
  @inject(UserCreatePage) private userCreatePage: UserCreatePage;
  @inject(MultiFactorAuthPage) private mfaPage: MultiFactorAuthPage;

  execute(params: ExecuteParams): void {
    this.userCreatePage.visit();
    this.userCreatePage.create(params);

    this.mfaPage.getVerificationPopup().should('be.visible');

    cy.getUserMultiFactorAuthCode(params.adminUsername, 'email').then((code) => {
      this.mfaPage.verifyCode(code);
    });

    this.userCreatePage.getUserCreatedSuccessMessage().should('be.visible');
  }
}

interface ExecuteParams {
  password: string;
  adminUsername: string;
  isRootUser: boolean;
}
