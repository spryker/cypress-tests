import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '../mp-page';
import { MerchantRelationsRepository } from './merchant-relations-repository';

@injectable()
@autoWired
export class MerchantRelationsPage extends MpPage {
  @inject(MerchantRelationsRepository) private repository: MerchantRelationsRepository;

  protected PAGE_URL = '/merchant-relationship-merchant-portal-gui/merchant-relationship';

  findRelation = (query: string, counter = 1): Cypress.Chainable => {
    const searchSelector = this.repository.getSearchSelector();
    cy.get(searchSelector).clear();
    cy.get(searchSelector).type(query);

    const interceptAlias = this.faker.string.uuid();
    cy.intercept('GET', '/merchant-relationship-merchant-portal-gui/merchant-relationship/table-data**').as(
      interceptAlias
    );
    cy.wait(`@${interceptAlias}`).its('response.body.total').should('eq', counter);

    return this.repository.getFirstTableRow();
  };

  getDrawer = (): Cypress.Chainable => {
    return this.repository.getDrawer();
  };
}
