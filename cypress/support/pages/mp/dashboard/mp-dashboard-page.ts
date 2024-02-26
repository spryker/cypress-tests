import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpDashboardRepository } from './mp-dashboard-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class MpDashboardPage extends MpPage {
  protected PAGE_URL: string = '/dashboard-merchant-portal-gui/dashboard';

  constructor(@inject(MpDashboardRepository) private repository: MpDashboardRepository) {
    super();
  }

  public logout = (): void => {
    this.repository.getUserProfileMenu().click();
    this.repository.getLogoutButton().click();
  };
}
