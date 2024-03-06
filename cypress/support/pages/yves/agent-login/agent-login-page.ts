import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../yves-page';
import { AgentLoginRepository } from './agent-login-repository';

@injectable()
@autoWired
export class AgentLoginPage extends YvesPage {
  @inject(REPOSITORIES.AgentLoginRepository) private repository: AgentLoginRepository;

  protected PAGE_URL = '/agent/login';

  login = (username: string, password: string): void => {
    this.repository.getLoginEmailInput().clear().type(username);
    this.repository.getLoginPasswordInput().clear().type(password);

    this.repository.getLoginForm().submit();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
