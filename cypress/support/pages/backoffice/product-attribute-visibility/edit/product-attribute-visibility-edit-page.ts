import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ProductAttributeVisibilityEditRepository } from './product-attribute-visibility-edit-repository';

@injectable()
@autoWired
export class ProductAttributeVisibilityEditPage extends BackofficePage {
  @inject(ProductAttributeVisibilityEditRepository) private repository: ProductAttributeVisibilityEditRepository;

  protected PAGE_URL = '/product-attribute-gui/attribute';

  getTableBodyRows = (): Cypress.Chainable => cy.get(this.repository.getTableBodyRowsSelector());

  getSearchInput = (): Cypress.Chainable => cy.get(this.repository.getSearchInputSelector());

  getVisibilityTypesSelect = (): Cypress.Chainable => this.repository.getVisibilityTypesSelect();

  getSubmitButton = (): Cypress.Chainable => this.repository.getSubmitButton();
}
