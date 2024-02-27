import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DashboardRepository } from './dashboard-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class DashboardPage extends MpPage {
  protected PAGE_URL: string = '/dashboard-merchant-portal-gui/dashboard';

  constructor(@inject(DashboardRepository) private repository: DashboardRepository) {
    super();
  }

  public logout = (): void => {
    this.repository.getUserProfileMenu().click();
    this.repository.getLogoutButton().click();
  };
}
