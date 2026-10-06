import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { MerchantRepository } from './merchant-repository';

@injectable()
@autoWired
export class MerchantPage extends YvesPage {
  @inject(REPOSITORIES.MerchantRepository) private repository: MerchantRepository;

  protected PAGE_URL = '/merchant';

  visitProfile = (params: VisitProfileParams): void => {
    cy.visit(params.url);
  };

  sendMerchantRelationRequest = (): void => {
    this.repository.getMerchantRelationRequestButton().click();
  };

  // The profile renders label/value pairs as information items; the label is the only stable handle.
  getInformationItemValue = (params: GetInformationItemValueParams): Cypress.Chainable => {
    return cy
      .get('[data-qa="component merchant-profile"]')
      .contains('[data-qa="component information-item"] strong', params.label)
      .parent();
  };

  getProfileContent = (): Cypress.Chainable => {
    return cy.get('[data-qa="component merchant-profile"]');
  };
}

interface VisitProfileParams {
  url: string;
}

interface GetInformationItemValueParams {
  label: string;
}
