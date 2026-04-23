import { IndexPage } from '@pages/backoffice';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { UserLoginScenario } from './user-login-scenario';

const ACCESS_DENIED_URL_PART = '/acl/index/denied';

@injectable()
@autoWired
export class AclNavigationAccessScenario {
  @inject(IndexPage) private indexPage: IndexPage;
  @inject(UserLoginScenario) private userLoginScenario: UserLoginScenario;

  execute = (params: ExecuteParams): void => {
    this.userLoginScenario.execute({
      username: params.username,
      password: params.password,
    });
    this.indexPage.visit();

    params.expectedMenuItems.forEach((label) => {
      cy.contains('[data-qa="menu-item-label"]', label).should('exist');
    });

    params.allowedPaths.forEach((path) => {
      cy.visitBackoffice(path);
      cy.url().should('include', path).and('not.include', ACCESS_DENIED_URL_PART);
    });

    params.deniedPaths.forEach((path) => {
      cy.visitBackoffice(path);
      cy.url().should('include', ACCESS_DENIED_URL_PART);
    });
  };
}

interface ExecuteParams {
  username: string;
  password: string;
  expectedMenuItems: string[];
  allowedPaths: string[];
  deniedPaths: string[];
}
