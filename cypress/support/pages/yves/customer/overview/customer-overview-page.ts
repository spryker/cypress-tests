import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CustomerOverviewRepository } from './customer-overview-repository';

@injectable()
@autoWired
export class CustomerOverviewPage extends YvesPage {
  @inject(REPOSITORIES.CustomerOverviewRepository) private repository: CustomerOverviewRepository;

  protected PAGE_URL = '/customer/overview';

  getPlacedOrderSuccessMessage = (): string => this.repository.getPlacedOrderSuccessMessage();
}
