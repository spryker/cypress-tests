import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL = '/sales';
  repository: Repository;

  constructor(@inject(Repository) repository: Repository) {
    super();
    this.repository = repository;
  }

  viewLastPlacedOrder = () => {
    cy.visitBackoffice(this.PAGE_URL);
    this.repository.getViewButtons().first().click();
  };
}
