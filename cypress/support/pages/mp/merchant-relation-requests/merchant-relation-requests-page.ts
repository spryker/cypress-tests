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
        search: params.query,
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

    cy.wait(`@${createCommentAlias}`);
  };

  approve = (params?: ApproveParams): void => {
    if (params?.isSplitEnabled) {
      this.repository.getDrawer().find(this.repository.getIsSplitEnabledCheckboxSelector()).click();
    }

    const updateRequestAlias = this.faker.string.uuid();
    cy.intercept({
      method: 'POST',
      pathname: '/merchant-relation-request-merchant-portal-gui/update-merchant-relation-request',
    }).as(updateRequestAlias);

    this.repository.getDrawer().find(this.repository.getApproveButtonSelector()).click();
    this.repository.getApprovalModalConfirmButton().click();

    cy.wait(`@${updateRequestAlias}`);
  };

  reject = (): void => {
    const updateRequestAlias = this.faker.string.uuid();
    cy.intercept({
      method: 'POST',
      pathname: '/merchant-relation-request-merchant-portal-gui/update-merchant-relation-request',
    }).as(updateRequestAlias);

    this.repository.getDrawer().find(this.repository.getRejectButtonSelector()).click();
    this.repository.getRejectionModalConfirmButton().click();

    cy.wait(`@${updateRequestAlias}`);
  };

  uncheckBusinessUnits = (params: UncheckBusinessUnitsParams): void => {
    this.getDrawer()
      .find(this.repository.getBusinessUnitsCheckboxSelector())
      .each(($businessUnitCheckbox) => {
        const checkboxSelector = this.repository.getBusinessUnitCheckboxSelector();
        const idBusinessUnit = $businessUnitCheckbox.find(checkboxSelector).last().attr('value') ?? '';

        // The visible ng-zorro input does not carry the checked state, so uncheck() on it is a no-op.
        if (params.businessUnitIds.includes(parseInt(idBusinessUnit))) {
          cy.wrap($businessUnitCheckbox.find(this.repository.getBusinessUnitCheckboxToggleSelector())).click();
        }
      });
  };

  getMessageFromCompanyValue = (): Cypress.Chainable => {
    return this.repository.getMessageFromCompanyValue();
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
