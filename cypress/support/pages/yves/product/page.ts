import { Repository } from './repository';
import { AbstractPage } from '../../abstract-page';

export class Page extends AbstractPage {
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
  }
}
