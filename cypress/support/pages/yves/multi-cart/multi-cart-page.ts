import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../yves-page';
import { MultiCartRepository } from './multi-cart-repository';

@injectable()
@autoWired
export class MultiCartPage extends YvesPage {
  @inject(REPOSITORIES.MultiCartRepository) private repository: MultiCartRepository;

  protected PAGE_URL = '/multi-cart';

  createCart = (name?: string): void => {
    cy.visit(`${this.PAGE_URL}/create`);
    const cartName = name ?? `Cart #${this.faker.string.uuid()}`;

    this.repository.getCreateCartNameInput().clear().type(cartName);
    this.repository.getCreateCartForm().submit();

    cy.contains(`Cart '${cartName}' was created successfully`).should('exist');
  };

  selectCart = (name: string): void => {
    this.repository.getQuoteTable().contains(name).click();
  };
}
