import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ContentUsageRepository } from './content-usage-repository';

@injectable()
@autoWired
export class ContentUsagePage extends BackofficePage {
  @inject(ContentUsageRepository) private repository: ContentUsageRepository;

  protected PAGE_URL = '/content-experience-management/usage';

  getHeader = (): Cypress.Chainable => this.repository.getHeader();

  getSourceRows = (): Cypress.Chainable => this.repository.getSourceRows();
}
