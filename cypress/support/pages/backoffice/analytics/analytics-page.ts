import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { AnalyticsRepository } from './analytics-repository';

@injectable()
@autoWired
export class AnalyticsPage extends BackofficePage {
  @inject(AnalyticsRepository) private repository: AnalyticsRepository;

  protected PAGE_URL = '/analytics-gui/analytics';

  getEnableAnalyticsButton = (): Cypress.Chainable => {
    return this.repository.getEnableAnalyticsButton();
  };
}
