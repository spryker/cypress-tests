import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import {SspInquiryDetails, YvesPage} from '@pages/yves';
import { SspDashboardManagementRepository } from './ssp-dashboard-management-repository';
import Chainable = Cypress.Chainable;
import {SspDashboardManagement} from "../../../types/yves";
import {Customer} from "../../../types/yves/shared";

@injectable()
@autoWired
export class SspDashboardPage extends YvesPage {
  @inject(REPOSITORIES.SspDashboardManagementRepository) private repository: SspDashboardManagementRepository;

  protected PAGE_URL = '/customer/dashboard';

  assertSspDashboard = (customer: Customer): void => {
    cy.contains(this.repository.getUserInfoBlock()).should('exist');
  };
}
