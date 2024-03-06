import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MpPage } from '../mp-page';
import { AgentLoginRepository } from './agent-login-repository';

@injectable()
@autoWired
export class AgentLoginPage extends MpPage {
  @inject(AgentLoginRepository) private repository: AgentLoginRepository;

  protected PAGE_URL = '/agent-security-merchant-portal-gui/login';

  login = (username: string, password: string): void => {
    this.repository.getEmailInput().clear().type(username);
    this.repository.getPasswordInput().clear().type(password);

    this.repository.getSubmitButton().click();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
