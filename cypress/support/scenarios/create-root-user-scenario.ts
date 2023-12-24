import { inject, injectable } from 'inversify';
import { autoProvide } from '../utils/inversify/auto-provide';
import { UserCreatePage } from '../pages/backoffice/user/create/user-create-page';
import { UserIndexPage } from '../pages/backoffice/user/index/user-index-page';

@injectable()
@autoProvide
export class CreateRootUserScenario {
  constructor(
    @inject(UserCreatePage) private userCreatePage: UserCreatePage,
    @inject(UserIndexPage) private userIndexPage: UserIndexPage
  ) {}

  execute = (): User => {
    cy.visitBackoffice(this.userIndexPage.PAGE_URL);
    this.userIndexPage.createNewUser();

    return this.userCreatePage.createRootUser();
  };
}
