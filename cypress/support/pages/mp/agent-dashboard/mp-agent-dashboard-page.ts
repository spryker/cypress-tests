import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpAgentDashboardRepository } from './mp-agent-dashboard-repository';

@injectable()
@autoProvide
export class MpAgentDashboardPage extends AbstractPage {
  public PAGE_URL: string = '/agent-dashboard-merchant-portal-gui/merchant-users';

  constructor(
    @inject(MpAgentDashboardRepository)
    private repository: MpAgentDashboardRepository
  ) {
    super();
  }
}
