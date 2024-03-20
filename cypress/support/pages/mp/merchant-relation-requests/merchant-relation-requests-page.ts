import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '../mp-page';
import { MerchantRelationRequestsRepository } from './merchant-relation-requests-repository';

@injectable()
@autoWired
export class MerchantRelationRequestsPage extends MpPage {
  @inject(MerchantRelationRequestsRepository) private repository: MerchantRelationRequestsRepository;

  protected PAGE_URL = '/merchant-relation-request-merchant-portal-gui/merchant-relation-requests';

  findRequest = (query: string): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/merchant-relation-request-merchant-portal-gui/merchant-relation-requests/table-data**').as(
      interceptAlias
    );
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', 1);

    return this.repository.getFirstTableRow();
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };

  addInternalComment = (comment: string): void => {
    this.repository.getInternalCommentTextarea().type(comment);
    this.repository.getInternalCommentAddCommentButton().click();
  };

  approveRequest = (isSplitEnabled: boolean): void => {
    if (isSplitEnabled) {
      this.repository.getDrawer().find(this.repository.getIsSplitEnabledCheckboxSelector()).click();
    }

    this.repository.getDrawer().find('button:contains("Approve")').click();
    this.repository.getApprovalModalConfirmButton().click();
  };

  rejectRequest = (): void => {
    this.repository.getDrawer().find('button:contains("Reject")').click();
    this.repository.getRejectionModalConfirmButton().click();
  };

  uncheckBusinessUnits = (businessUnitIds: number[]): void => {
    this.getDrawer()
      .find('[id="assigneeCompanyBusinessUnits[]"]')
      .each(($businessUnitCheckbox) => {
        const idBusinessUnit = $businessUnitCheckbox.find('[type="checkbox"]').last().attr('value') ?? '';

        if (businessUnitIds.includes(parseInt(idBusinessUnit))) {
          cy.wrap($businessUnitCheckbox.find('[type="checkbox"]').first()).uncheck();
        }
      });
  };
}
