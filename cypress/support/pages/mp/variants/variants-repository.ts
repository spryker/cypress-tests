import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class VariantsRepository {
  getFirstTableRow = (): Cypress.Chainable => cy.get('tbody > :nth-child(1):visible');
  getSearchSelector = (): string => '.spy-table-search-feature input[type="text"]';
  getProductConcretesCountSelector = (): Cypress.Chainable => cy.get('spy-table-features-renderer > div:nth-child(1) > span > spy-chips');
}
