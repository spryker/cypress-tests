import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { RefundRepository } from './refund-repository';

@injectable()
@autoWired
export class RefundPage extends BackofficePage {
  @inject(REPOSITORIES.RefundRepository) private repository: RefundRepository;

  protected PAGE_URL = '/refund/table';

  // Mirrors the Codeception RefundListCest::testThatRefundListIsVisible /
  // RefundPresentationTester::canOpenRefundListPage: open /refund/table and
  // assert the DataTables container is rendered.
  assertRefundListIsVisible = (): void => {
    this.visit();
    this.repository.getRefundTable().should('be.visible');
  };
}
