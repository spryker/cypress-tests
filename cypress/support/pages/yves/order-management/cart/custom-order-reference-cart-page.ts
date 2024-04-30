import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CustomOrderReferenceCartRepository } from './custom-order-reference-cart-repository';

@injectable()
@autoWired
export class CustomOrderReferenceCartPage extends YvesPage {
  @inject(REPOSITORIES.CustomOrderReferenceCartRepository) private repository: CustomOrderReferenceCartRepository;

  protected PAGE_URL = '/cart';

  visitCartWithItems = (): void => {
    this.visit();
    this.repository.getCartUpsellingAjaxLoader().should('be.visible');
    this.repository.getCartUpsellingAjaxLoader().should('be.not.visible');
  };

  addCustomOrderReferenceInput = (reference: string): void => {
    this.repository.getCustomOrderReferenceInput().type(reference);
    this.repository.getCustomOrderReferenceSubmitButton().click();

    this.repository.getCustomOrderReferenceAjaxLoader().should('be.visible');
    this.repository.getCustomOrderReferenceAjaxLoader().should('be.not.visible');
  };

  getCustomOrderReferenceInput = (): Cypress.Chainable => {
    return this.repository.getCustomOrderReferenceInput();
  };

  getCustomOrderReferenceSubmitButton = (): Cypress.Chainable => {
    return this.repository.getCustomOrderReferenceSubmitButton();
  };
}
