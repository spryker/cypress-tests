import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CompanyUserListRepository } from './company-user-list-repository';

@injectable()
@autoWired
export class CompanyUserListPage extends BackofficePage {
  @inject(CompanyUserListRepository) private repository: CompanyUserListRepository;

  protected PAGE_URL = '/company-user-gui/list-company-user';

  /**
   * The table lists user id, company name and the customer's full name but never the email, so a
   * company user is looked up by the company it belongs to.
   */
  findByCompanyName = (companyName: string): Cypress.Chainable => {
    return this.find({
      interceptTableUrl: '**/company-user-gui/list-company-user/table**',
      searchQuery: companyName,
    }).then((getRow) => (getRow ? getRow().find(this.repository.getCompanyUserNameCellSelector()) : cy.wrap(null)));
  };
}
