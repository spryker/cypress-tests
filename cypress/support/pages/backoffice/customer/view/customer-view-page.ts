import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CustomerViewRepository } from './customer-view-repository';

@injectable()
@autoWired
export class CustomerViewPage extends BackofficePage {
  @inject(CustomerViewRepository) private repository: CustomerViewRepository;

  protected PAGE_URL = '/customer/view';

  clickAddNewAddress = (): void => {
    this.repository.getAddNewAddressButton().click();
  };
}
