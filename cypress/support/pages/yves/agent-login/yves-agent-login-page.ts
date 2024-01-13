import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { YvesAgentLoginRepository } from './yves-agent-login-repository';

@injectable()
@autoProvide
export class YvesAgentLoginPage extends AbstractPage {
  public PAGE_URL: string = '/agent/login';

  constructor(@inject(TYPES.YvesAgentLoginRepository) private repository: YvesAgentLoginRepository) {
    super();
  }

  public login = (user: User): void => {
    cy.visit(this.PAGE_URL);
    this.repository.getLoginEmailInput().clear().type(user.username);
    this.repository.getLoginPasswordInput().clear().type(user.password);

    this.repository.getLoginForm().submit();
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
