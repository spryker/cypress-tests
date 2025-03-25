import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import {YvesPage} from '@pages/yves';
import { SspDashboardManagementRepository } from './ssp-dashboard-management-repository';

@injectable()
@autoWired
export class SspDashboardPage extends YvesPage {
  @inject(REPOSITORIES.SspDashboardManagementRepository) private repository: SspDashboardManagementRepository;

  protected PAGE_URL = '/customer/dashboard';

  assertSspDashboardUserInfoPresent = (): void => {
    this.repository.getUserInfoBlock().should('exist');
  };

  assertSspDashboardUserInfoHasWelcomeText = (name: string): void => {
    this.repository.getUserInfoBlockWelcome().contains('Welcome, ' + name).should('exist');
  };

  assertSspDashboardUserInfoHasCompanyName = (name: string): void => {
    this.repository.getUserInfoBlock().contains(name).should('exist');
  };

  assertSspDashboardHasOverviewBlock = (): void => {
    this.repository.getOverview().contains(this.repository.getOverviewTitle()).should('exist');
  };
}
