import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { SspModelViewRepository } from './ssp-model-view-repository';

@injectable()
@autoWired
export class SspModelViewPage extends BackofficePage {
  @inject(SspModelViewRepository) private repository: SspModelViewRepository;

  protected readonly PAGE_URL = '/self-service-portal/view-model';

  public getCodeBlock(): Cypress.Chainable {
    return this.repository.getCodeBlock();
  }
}
