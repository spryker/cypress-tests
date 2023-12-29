import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { YvesAgentLoginRepository } from './yves-agent-login-repository';

@injectable()
@autoProvide
export class YvesAgentLoginPage extends AbstractPage {
  PAGE_URL: string = '/agent/login';
  repository: YvesAgentLoginRepository;

  constructor(
    @inject(TYPES.LoginYvesAgentLoginRepository)
    repository: YvesAgentLoginRepository
  ) {
    super();
    this.repository = repository;
  }

  login = (user: User): void => {
    cy.visit(this.PAGE_URL);
    this.repository.getLoginEmailInput().clear().type(user.username);
    this.repository.getLoginPasswordInput().clear().type(user.password);

    this.repository.getLoginForm().submit();
  };

  assertFailedAuthentication = (): void => {
    cy.contains(this.repository.getFailedAuthenticationText());
    this.assertPageLocation();
  };
}
