import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CustomOrderReferenceCartRepository } from './custom-order-reference-cart-repository';

@injectable()
@autoWired
export class CustomOrderReferenceCartPage extends YvesPage {
  @inject(REPOSITORIES.CustomOrderReferenceCartRepository) private repository: CustomOrderReferenceCartRepository;

  addCustomOrderReferenceInput = (reference: string): void => {
    this.repository.getCustomOrderReferenceInput().type(reference);
    this.repository.getCustomOrderReferenceSubmitButton().click();
  };

  getCustomOrderReferenceInput = (): Cypress.Chainable => {
    return this.repository.getCustomOrderReferenceInput();
  };
}
