import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { BackofficeIndexRepository } from './backoffice-index-repository';

@injectable()
@autoProvide
export class BackofficeIndexPage extends AbstractPage {
  public PAGE_URL: string = '/';

  constructor(@inject(BackofficeIndexRepository) private repository: BackofficeIndexRepository) {
    super();
  }
}
