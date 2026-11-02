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

    this.interceptTable(
      {
        url: '/merchant-relation-request-merchant-portal-gui/merchant-relation-requests/table-data**',
        expectedCount: params.expectedCount,
        searchQuery: params.query,
      },
      () => {
        cy.get(searchSelector).clear();
        cy.get(searchSelector).type(params.query, { delay: 0 });
        cy.get(searchSelector).type('{enter}');
      }
    );

    return this.repository.getTableRowContaining(params.query);
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };

  addInternalComment = (params: AddInternalCommentParams): void => {
    const createCommentAlias = this.faker.string.uuid();
    cy.intercept({ pathname: '/comment-merchant-portal-gui/comment/create' }).as(createCommentAlias);

    this.repository.getInternalCommentTextarea().type(params.comment);
    this.repository.getInternalCommentAddCommentButton().click();

    cy.wait(`@${createCommentAlias}`).its('response.statusCode').should('eq', 200);
  };

  approve = (params?: ApproveParams): void => {
    if (params?.isSplitEnabled) {
      this.repository.getDrawer().find(this.repository.getIsSplitEnabledCheckboxSelector()).click();
    }

    this.repository.getDrawer().find(this.repository.getApproveButtonSelector()).click();
    this.submitDecision(() => this.repository.getApprovalModalConfirmButton().click());
  };

  reject = (): void => {
    this.repository.getDrawer().find(this.repository.getRejectButtonSelector()).click();
    this.submitDecision(() => this.repository.getRejectionModalConfirmButton().click());
  };

  uncheckBusinessUnits = (params: UncheckBusinessUnitsParams): void => {
    params.businessUnitIds.forEach((idBusinessUnit) => {
      const submittedCheckboxSelector = this.repository.getSubmittedBusinessUnitCheckboxSelector(idBusinessUnit);
      const getVisibleCheckbox = (): Cypress.Chainable =>
        this.getDrawer()
          .find(submittedCheckboxSelector)
          .closest(this.repository.getBusinessUnitsCheckboxSelector())
          .find(this.repository.getBusinessUnitCheckboxSelector())
          .first();

      // spy-checkbox gets its initial checked state from ngModel after the first render, the visible box later than
      // the submitted one. An uncheck before that does nothing, and the decision is submitted with this business unit.
      this.getDrawer().find(submittedCheckboxSelector).should('be.checked');
      getVisibleCheckbox().should('be.checked');

      getVisibleCheckbox().uncheck();

      this.getDrawer().find(submittedCheckboxSelector).should('not.be.checked');
    });
  };

  getMessageFromCompanyValue = (): Cypress.Chainable => {
    return this.repository.getMessageFromCompanyValue();
  };

  private submitDecision = (confirm: () => void): void => {
    const updateRequestAlias = this.faker.string.uuid();
    cy.intercept({
      method: 'POST',
      pathname: '/merchant-relation-request-merchant-portal-gui/update-merchant-relation-request',
    }).as(updateRequestAlias);

    confirm();

    cy.wait(`@${updateRequestAlias}`);
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
