import { inject, injectable } from 'inversify';
import { autoWired } from '../../utils/inversify/auto-wired';
import {User} from "../../types/refactor_this_file_and_drop_it";
import { UserCreatePage, UserIndexPage } from '../../pages/backoffice';

@injectable()
@autoWired
export class CreateRootUserScenario {
  constructor(
    @inject(UserCreatePage) private userCreatePage: UserCreatePage,
    @inject(UserIndexPage) private userIndexPage: UserIndexPage
  ) {}

  public execute = (): User => {
    this.userIndexPage.visit();
    this.userIndexPage.createNewUser();

    return this.userCreatePage.createRootUser();
  };
}
