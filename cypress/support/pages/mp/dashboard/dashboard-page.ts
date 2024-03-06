import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpPage } from '../mp-page';
import { DashboardRepository } from './dashboard-repository';

@injectable()
@autoWired
export class DashboardPage extends MpPage {
  @inject(DashboardRepository) private repository: DashboardRepository;

  protected PAGE_URL: string = '/dashboard-merchant-portal-gui/dashboard';

  logout = (): void => {
    this.repository.getUserProfileMenu().click();
    this.repository.getLogoutButton().click();
  };
}
