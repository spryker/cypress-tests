import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '../../backoffice-page';
import { KillSwitchRepository } from './kill-switch-repository';

@injectable()
@autoWired
export class KillSwitchPage extends BackofficePage {
  @inject(KillSwitchRepository) private repository: KillSwitchRepository;

  protected PAGE_URL = '/agentic-commerce/agentic-commerce-kill-switch';

  getPageBody = (): Cypress.Chainable => this.repository.getPageBody();

  getForm = (): Cypress.Chainable => this.repository.getForm();

  getFlashMessage = (): Cypress.Chainable => this.repository.getFlashMessage();

  getSwitchOffButton = (): Cypress.Chainable => this.repository.getSwitchOffButton();

  getSwitchOnButton = (): Cypress.Chainable => this.repository.getSwitchOnButton();

  switchOff = (reason: string): void => {
    this.enterReason(reason);
    this.repository.getSwitchOffButton().click();
  };

  switchOn = (reason: string): void => {
    this.enterReason(reason);
    this.repository.getSwitchOnButton().click();
  };

  private enterReason = (reason: string): void => {
    this.repository.getReasonInput().clear();

    if (reason !== '') {
      this.repository.getReasonInput().type(reason);
    }
  };
}
