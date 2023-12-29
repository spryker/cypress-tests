import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpAgentDashboardRepository } from './mp-agent-dashboard-repository';

@injectable()
@autoProvide
export class MpAgentDashboardPage extends AbstractPage {
  PAGE_URL: string = '/agent-dashboard-merchant-portal-gui/merchant-users';
  repository: MpAgentDashboardRepository;

  constructor(
    @inject(MpAgentDashboardRepository) repository: MpAgentDashboardRepository
  ) {
    super();
    this.repository = repository;
  }
}
