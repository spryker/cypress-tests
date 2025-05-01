import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { MultiCartRepository } from './multi-cart-repository';

@injectable()
@autoWired
export class MultiCartPage extends YvesPage {
  @inject(REPOSITORIES.MultiCartRepository) private repository: MultiCartRepository;

  protected PAGE_URL = '/multi-cart';

  createCart = (params?: CreateCartParams): void => {
    cy.visit(`${this.PAGE_URL}/create`);
    const cartName = params?.name ?? `Cart #${this.faker.string.uuid()}`;

    this.repository.getCreateCartNameInput().clear().type(cartName);
    this.repository.getCreateCartForm().submit();

    cy.contains(`Cart '${cartName}' was created successfully`).should('exist');
  };

  selectCart = (params: SelectCartParams): void => {
    this.repository.getQuoteTable().contains(params.name).click();
  };

  getMiniCartRadios = (): Cypress.Chainable => {
    return this.repository.getMiniCartRadios();
  };
}

interface CreateCartParams {
  name?: string;
}

interface SelectCartParams {
  name: string;
}
