import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { YvesMultiCartRepository } from './yves-multi-cart-repository';

@injectable()
@autoProvide
export class YvesMultiCartPage extends AbstractPage {
  public PAGE_URL: string = '/multi-cart';

  constructor(@inject(TYPES.YvesMultiCartRepository) private repository: YvesMultiCartRepository) {
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
