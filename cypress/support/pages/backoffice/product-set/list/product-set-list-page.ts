import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ProductSetListRepository } from './product-set-list-repository';

@injectable()
@autoWired
export class ProductSetListPage extends BackofficePage {
  @inject(ProductSetListRepository) private repository: ProductSetListRepository;

  protected PAGE_URL = '/product-set-gui';

  delete = (name: string): void => {
    this.visit();

    this.repository.getSearchInput().clear();
    this.repository.getSearchInput().type(name);

    this.repository.getTableInfo().should('contain', 'filtered from');
    this.repository.getTableProcessing().should('not.be.visible');
    this.repository.getTableRows().should('have.length', 1);

    this.repository.getTableRows().first().find(this.repository.getDeleteButtonSelector()).click();
  };

  getTableRows = (): Cypress.Chainable => this.repository.getTableRows();
}
