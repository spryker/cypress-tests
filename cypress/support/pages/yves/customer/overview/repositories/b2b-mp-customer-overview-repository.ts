import { injectable } from 'inversify';
import { CustomerOverviewRepository } from '../customer-overview-repository';

@injectable()
export class B2bMpCustomerOverviewRepository implements CustomerOverviewRepository {
  getPlacedOrderSuccessMessage = (): string => 'Your order has been placed successfully!';
}
