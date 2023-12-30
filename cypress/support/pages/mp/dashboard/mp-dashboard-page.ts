import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpDashboardRepository } from './mp-dashboard-repository';

@injectable()
@autoProvide
export class MpDashboardPage extends AbstractPage {
  public PAGE_URL: string = '/dashboard-merchant-portal-gui/dashboard';

  constructor(
    @inject(MpDashboardRepository) private repository: MpDashboardRepository
  ) {
    super();
  }
}
