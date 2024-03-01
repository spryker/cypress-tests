import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { MultiCartRepository } from './multi-cart-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { YvesPage } from '../yves-page';

@injectable()
@autoWired
export class MultiCartPage extends YvesPage {
  protected PAGE_URL: string = '/multi-cart';

  constructor(@inject(TYPES.MultiCartRepository) private repository: MultiCartRepository) {
    super();
  }

  public createCart = (name?: string): void => {
    cy.visit(`${this.PAGE_URL}/create`);
    const cartName = name ?? `Cart #${this.faker.string.uuid()}`;

    this.repository.getCreateCartNameInput().clear().type(cartName);
    this.repository.getCreateCartForm().submit();

    cy.contains(`Cart '${cartName}' was created successfully`).should('exist');
  };

  public selectCart = (name: string): void => {
    this.repository.getQuoteTable().contains(name).click();
  };
}
