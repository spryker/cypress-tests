import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BackofficeIndexRepository } from './backoffice-index-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class BackofficeIndexPage extends AbstractPage {
  public PAGE_URL: string = '/';

  constructor(@inject(BackofficeIndexRepository) private repository: BackofficeIndexRepository) {
    super();
  }
}
