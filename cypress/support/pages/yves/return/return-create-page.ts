import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { ReturnCreateRepository } from './return-create-repository';

@injectable()
@autoWired
export class ReturnCreatePage extends YvesPage {
  @inject(ReturnCreateRepository) private repository: ReturnCreateRepository;

  protected PAGE_URL = '/return/create';

  // The visible control is a styled label; the real input is the one carrying the value and it is
  // covered by CSS, so it has to be checked forcibly. Its change event is what enables the submit
  // button, which SalesReturnPage renders disabled until a line is ticked.
  selectItem = (sku: string): void => {
    this.repository
      .getReturnItemBlock(sku)
      .find(this.repository.getReturnItemCheckboxSelector())
      .check({ force: true });
  };

  getItemCheckbox = (sku: string): Cypress.Chainable =>
    this.repository.getReturnItemBlock(sku).find(this.repository.getReturnItemCheckboxSelector());

  submit = (): void => {
    this.repository.getSubmitButton().click();
  };
}
