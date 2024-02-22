import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { MultiCartRepository } from './multi-cart-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class MultiCartPage extends AbstractPage {
  public PAGE_URL: string = '/multi-cart';

  constructor(@inject(TYPES.YvesMultiCartRepository) private repository: MultiCartRepository) {
    super();
  }

  public createCart = (name?: string): void => {
    cy.visit(`${this.PAGE_URL}/create`);
    const cartName = name ?? `Cart #${this.faker.string.uuid()}`;

    this.repository.getCreateCartNameInput().clear().type(cartName);
    this.repository.getCreateCartForm().submit();

    cy.contains(`Cart '${cartName}' was created successfully`).should('exist');
  };
}