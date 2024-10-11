import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { HomeRepository } from './home-repository';

@injectable()
@autoWired
export class HomePage extends YvesPage {
  @inject(REPOSITORIES.HomeRepository) private repository: HomeRepository;

  protected PAGE_URL = '/';

  selectStore = (store: string): void => {
    this.repository.getStoreSelect().select('Store: ' + store);
  };
}
