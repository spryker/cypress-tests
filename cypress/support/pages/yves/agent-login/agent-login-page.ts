import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { AgentLoginRepository } from './agent-login-repository';
import { autoWired } from '../../../utils/inversify/auto-wired';
import {User} from "../../../types/user";

@injectable()
@autoWired
export class AgentLoginPage extends AbstractPage {
  public PAGE_URL: string = '/agent/login';

  constructor(@inject(TYPES.YvesAgentLoginRepository) private repository: AgentLoginRepository) {
    super();
  }

  public login = (user: User): void => {
    this.repository.getLoginEmailInput().clear().type(user.username);
    this.repository.getLoginPasswordInput().clear().type(user.password);

    this.repository.getLoginForm().submit();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
