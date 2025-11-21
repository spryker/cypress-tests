import { ActionEnum, UserIndexPage, UserUpdatePage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

@injectable()
@autoWired
export class UserActivationScenario {
  @inject(UserIndexPage) private userIndexPage: UserIndexPage;
  @inject(UserUpdatePage) private userUpdatePage: UserUpdatePage;

  execute = (params: ExecuteParams): void => {
    this.userIndexPage.visit();
    this.userIndexPage.update({ query: params.email, action: ActionEnum.activate });
    this.userIndexPage.update({ query: params.email, action: ActionEnum.edit });
    this.userUpdatePage.setDefaultPassword();
  };
}

interface ExecuteParams {
  email: string;
}
