import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '../mp-page';
import { DashboardRepository } from './dashboard-repository';

@injectable()
@autoWired
export class DashboardPage extends MpPage {
  @inject(DashboardRepository) private repository: DashboardRepository;

  protected PAGE_URL = '/dashboard-merchant-portal-gui/dashboard';

  logout = (): void => {
    this.repository.getUserProfileMenu().click();
    this.repository.getLogoutButton().click();
  };

  interceptRequest = (): string => {
    const alias = 'dashboardPageRequest';
    cy.intercept({ url: this.PAGE_URL }).as(alias);

    return alias;
  };

  assert500StatusCode = (params: Assert500StatusCodeParams): void => {
    cy.wait(`@${params.alias}`).then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.equal(500);
      }
    });
  };
}

interface Assert500StatusCodeParams {
  alias: string;
}
