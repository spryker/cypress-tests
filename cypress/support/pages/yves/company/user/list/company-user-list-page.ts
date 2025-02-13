import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CompanyUserListRepository } from './company-user-list-repository';

@injectable()
@autoWired
export class CompanyUserListPage extends YvesPage {
  @inject(REPOSITORIES.CompanyUserListRepository) private repository: CompanyUserListRepository;

  protected PAGE_URL = '/company/user';

  enableUser = (): void => {
    this.repository.getTopUserEnableButton().click();
  };

  disableUser = (): void => {
    this.repository.getTopUserDisableButton().click();
  };

  assertTopUserIsDisabled = (): void => {
    this.repository.getTopUserEnableButton().should('exist');
  };

  assertTopUserIsEnabled = (): void => {
    this.repository.getTopUserDisableButton().should('exist');
  };
}
