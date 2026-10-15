import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../../yves-page';
import { ConsentRepository } from './consent-repository';

@injectable()
@autoWired
export class ConsentPage extends YvesPage {
  @inject(ConsentRepository) private repository: ConsentRepository;

  protected PAGE_URL = '/connect/consent';

  getConsentBox = (): Cypress.Chainable => this.repository.getConsentBox();

  getPrincipalSelect = (): Cypress.Chainable => this.repository.getPrincipalSelect();

  selectStore = (storeName: string): void => {
    this.repository.getStoreSelect().select(storeName);
  };

  allow = (): void => {
    this.repository.getAllowButton().click();
  };

  deny = (): void => {
    this.repository.getDenyButton().click();
  };
}
