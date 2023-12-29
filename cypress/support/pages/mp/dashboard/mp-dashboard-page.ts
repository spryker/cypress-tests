import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { MpDashboardRepository } from './mp-dashboard-repository';

@injectable()
@autoProvide
export class MpDashboardPage extends AbstractPage {
  PAGE_URL: string = '/dashboard-merchant-portal-gui/dashboard';
  repository: MpDashboardRepository;

  constructor(
    @inject(MpDashboardRepository) repository: MpDashboardRepository
  ) {
    super();
    this.repository = repository;
  }
}
