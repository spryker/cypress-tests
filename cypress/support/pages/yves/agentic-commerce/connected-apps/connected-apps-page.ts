import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '../../yves-page';
import { ConnectedAppsRepository } from './connected-apps-repository';

@injectable()
@autoWired
export class ConnectedAppsPage extends YvesPage {
  @inject(ConnectedAppsRepository) private repository: ConnectedAppsRepository;

  protected PAGE_URL = '/customer/connected-apps';

  getConnectedApp = (clientName: string): Cypress.Chainable => this.repository.getConnectedApp(clientName);

  getConnectedAppPrincipal = (clientName: string): Cypress.Chainable =>
    this.repository.getConnectedApp(clientName).find(this.repository.getPrincipalSelector());

  getList = (): Cypress.Chainable => this.repository.getList();

  disconnect = (clientName: string): void => {
    this.repository.getConnectedApp(clientName).find(this.repository.getDisconnectButtonSelector()).click();
  };
}
