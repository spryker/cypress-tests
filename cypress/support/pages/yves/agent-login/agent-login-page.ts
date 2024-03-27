import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { AgentLoginRepository } from './agent-login-repository';

@injectable()
@autoWired
export class AgentLoginPage extends YvesPage {
  @inject(REPOSITORIES.AgentLoginRepository) private repository: AgentLoginRepository;

  protected PAGE_URL = '/agent/login';

  login = (params: LoginParams): void => {
    this.repository.getLoginEmailInput().clear().type(params.username);
    this.repository.getLoginPasswordInput().clear().type(params.password);

    this.repository.getLoginForm().submit();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}

interface LoginParams {
  username: string;
  password: string;
}
