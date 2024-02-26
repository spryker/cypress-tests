import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IndexRepository } from './index-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { BackofficePage } from '../backoffice-page';

@injectable()
@autoWired
export class IndexPage extends BackofficePage {
  protected PAGE_URL: string = '/';

  constructor(@inject(IndexRepository) private repository: IndexRepository) {
    super();
  }
}
