import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { BackofficeIndexRepository } from './backoffice-index-repository';

@injectable()
@autoProvide
export class BackofficeIndexPage extends AbstractPage {
  PAGE_URL: string = '/';
  repository: BackofficeIndexRepository;

  constructor(
    @inject(BackofficeIndexRepository) repository: BackofficeIndexRepository
  ) {
    super();
    this.repository = repository;
  }
}
