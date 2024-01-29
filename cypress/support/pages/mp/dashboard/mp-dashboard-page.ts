import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpDashboardRepository } from './mp-dashboard-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MpDashboardPage extends AbstractPage {
  public PAGE_URL: string = '/dashboard-merchant-portal-gui/dashboard';

  constructor(@inject(MpDashboardRepository) private repository: MpDashboardRepository) {
    super();
  }

  public logout = (): void => {
    this.repository.getUserProfileMenu().click();
    this.repository.getLogoutButton().click();
  };
}
