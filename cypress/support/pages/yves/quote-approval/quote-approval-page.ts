import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../yves-page';
import { QuoteApprovalRepository } from './quote-approval-repository';

@injectable()
@autoWired
export class QuoteApprovalPage extends YvesPage {
  @inject(QuoteApprovalRepository) private repository: QuoteApprovalRepository;

  protected PAGE_URL = '/cart';

  getApprovalStatus = (): Cypress.Chainable => this.repository.getApprovalStatus();

  sendForApproval = (approverName: string): void => {
    this.repository.getApproverSelect().select(approverName);
    this.repository.getSendForApprovalButton().click();
  };

  approve = (): void => {
    this.repository.getApproveButton().click();
  };
}
