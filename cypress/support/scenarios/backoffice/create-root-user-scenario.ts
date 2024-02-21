import { inject, injectable } from 'inversify';
import { BackofficeUserCreatePage } from '../../pages/backoffice/user/create/backoffice-user-create-page';
import { BackofficeUserIndexPage } from '../../pages/backoffice/user/index/backoffice-user-index-page';
import { autoWired } from '../../utils/inversify/auto-wired';
import {User} from "../../types/refactor_this_file_and_drop_it";

@injectable()
@autoWired
export class CreateRootUserScenario {
  constructor(
    @inject(BackofficeUserCreatePage) private userCreatePage: BackofficeUserCreatePage,
    @inject(BackofficeUserIndexPage) private userIndexPage: BackofficeUserIndexPage
  ) {}

  public execute = (): User => {
    cy.visitBackoffice(this.userIndexPage.PAGE_URL);
    this.userIndexPage.createNewUser();

    return this.userCreatePage.createRootUser();
  };
}
