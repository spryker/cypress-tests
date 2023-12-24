import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL: string = '/multi-cart';
  repository: Repository;

  constructor(@inject(TYPES.MultiCartRepository) repository: Repository) {
    super();
    this.repository = repository;
  }

  createCart = (name?: string): void => {
    cy.visit(`${this.PAGE_URL}/create`);
    const cartName = name ?? `Cart #${this.faker.string.uuid()}`;

    this.repository.getCreateCartNameInput().clear().type(cartName);
    this.repository.getCreateCartForm().submit();

    cy.contains(`Cart '${cartName}' was created successfully`).should('exist');
  };
}
