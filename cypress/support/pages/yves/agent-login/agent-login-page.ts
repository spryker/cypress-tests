import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { AgentLoginRepository } from './agent-login-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import { YvesPage } from '../yves-page';

@injectable()
@autoWired
export class AgentLoginPage extends YvesPage {
  protected PAGE_URL: string = '/agent/login';

  constructor(@inject(TYPES.YvesAgentLoginRepository) private repository: AgentLoginRepository) {
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
