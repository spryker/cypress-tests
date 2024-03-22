import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { MerchantRelationRequestsRepository } from './merchant-relation-requests-repository';

@injectable()
@autoWired
export class MerchantRelationRequestsPage extends MpPage {
  @inject(MerchantRelationRequestsRepository) private repository: MerchantRelationRequestsRepository;

  protected PAGE_URL = '/merchant-relation-request-merchant-portal-gui/merchant-relation-requests';

  find = (params: FindParams): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(params.query);

    this.interceptTable({
      url: '/merchant-relation-request-merchant-portal-gui/merchant-relation-requests/table-data**',
      expectedCount: params.expectedCount,
    });

    return this.repository.getFirstTableRow();
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };

  addInternalComment = (params: AddInternalCommentParams): void => {
    this.repository.getInternalCommentTextarea().type(params.comment);
    this.repository.getInternalCommentAddCommentButton().click();
  };

  approve = (params?: ApproveParams): void => {
    if (params?.isSplitEnabled) {
      this.repository.getDrawer().find(this.repository.getIsSplitEnabledCheckboxSelector()).click();
    }

    this.repository.getDrawer().find(this.repository.getApproveButtonSelector()).click();
    this.repository.getApprovalModalConfirmButton().click();
  };

  reject = (): void => {
    this.repository.getDrawer().find(this.repository.getRejectButtonSelector()).click();
    this.repository.getRejectionModalConfirmButton().click();
  };

  uncheckBusinessUnits = (params: UncheckBusinessUnitsParams): void => {
    this.getDrawer()
      .find(this.repository.getBusinessUnitsCheckboxSelector())
      .each(($businessUnitCheckbox) => {
        const checkboxSelector = this.repository.getBusinessUnitCheckboxSelector();
        const idBusinessUnit = $businessUnitCheckbox.find(checkboxSelector).last().attr('value') ?? '';

        if (params.businessUnitIds.includes(parseInt(idBusinessUnit))) {
          cy.wrap($businessUnitCheckbox.find(checkboxSelector).first()).uncheck();
        }
      });
  };
}

interface FindParams {
  query: string;
  expectedCount?: number;
}

interface AddInternalCommentParams {
  comment: string;
}

interface ApproveParams {
  isSplitEnabled: boolean;
}

interface UncheckBusinessUnitsParams {
  businessUnitIds: number[];
}
