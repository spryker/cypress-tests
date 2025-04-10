import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { IndexRepository } from './index-repository';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class IndexPage extends BackofficePage {
  @inject(IndexRepository) private repository: IndexRepository;

  protected PAGE_URL = '/';

  assertAssetsHaveHash(): void {
    this.repository.getStylesheetLinkWithHash().should('exist');
    this.repository.getScriptImportWithHash().should('exist');
  }
}
