import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../yves-page';
import { AgentLoginRepository } from './agent-login-repository';

@injectable()
@autoWired
export class AgentLoginPage extends YvesPage {
  protected PAGE_URL: string = '/agent/login';

  constructor(@inject(TYPES.AgentLoginRepository) private repository: AgentLoginRepository) {
    super();
  }

  public login = (username: string, password: string): void => {
    this.repository.getLoginEmailInput().clear().type(username);
    this.repository.getLoginPasswordInput().clear().type(password);

    this.repository.getLoginForm().submit();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
