import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../../yves-page';
import { CompanyConnectedAppsRepository } from './company-connected-apps-repository';

@injectable()
@autoWired
export class CompanyConnectedAppsPage extends YvesPage {
  @inject(CompanyConnectedAppsRepository) private repository: CompanyConnectedAppsRepository;

  protected PAGE_URL = '/company/connected-apps';

  getList = (): Cypress.Chainable => this.repository.getList();

  getFlashMessage = (): Cypress.Chainable => this.repository.getFlashMessage();

  getNavigationEntry = (): Cypress.Chainable => this.repository.getNavigationEntry();

  getConsentRow = (clientName: string, email: string): Cypress.Chainable =>
    this.repository
      .getConsentRows()
      .filter(`:has(${this.repository.getAppSelector()}:contains("${clientName}"))`)
      .filter(`:has(${this.repository.getEmailSelector()}:contains("${email}"))`);

  getUserCell = (clientName: string, email: string): Cypress.Chainable =>
    this.getConsentRow(clientName, email).find(this.repository.getUserSelector());

  getEmailCell = (clientName: string, email: string): Cypress.Chainable =>
    this.getConsentRow(clientName, email).find(this.repository.getEmailSelector());

  getAppCell = (clientName: string, email: string): Cypress.Chainable =>
    this.getConsentRow(clientName, email).find(this.repository.getAppSelector());

  getScopesCell = (clientName: string, email: string): Cypress.Chainable =>
    this.getConsentRow(clientName, email).find(this.repository.getScopesSelector());

  getLastUsedCell = (clientName: string, email: string): Cypress.Chainable =>
    this.getConsentRow(clientName, email).find(this.repository.getLastUsedSelector());

  getRevokeButton = (clientName: string, email: string): Cypress.Chainable =>
    this.getConsentRow(clientName, email).find(this.repository.getRevokeButtonSelector());

  revoke = (clientName: string, email: string): void => {
    this.getRevokeButton(clientName, email).click();
  };

  /**
   * Replaces the consent the row's revoke form carries, the way a forged request would, and submits it.
   */
  revokeForeignConsent = (clientName: string, email: string, consentUuid: string): void => {
    this.getConsentRow(clientName, email)
      .find(this.repository.getConsentUuidInputSelector())
      .invoke('val', consentUuid);
    this.revoke(clientName, email);
  };
}
