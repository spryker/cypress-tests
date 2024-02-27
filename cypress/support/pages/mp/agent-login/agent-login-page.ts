import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { AgentLoginRepository } from './agent-login-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { MpPage } from '../mp-page';

@injectable()
@autoWired
export class AgentLoginPage extends MpPage {
  protected PAGE_URL: string = '/agent-security-merchant-portal-gui/login';

  constructor(@inject(AgentLoginRepository) private repository: AgentLoginRepository) {
    super();
  }

  public login = (username: string, password: string): void => {
    this.repository.getEmailInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
