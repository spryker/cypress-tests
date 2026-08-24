import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { CompanyListRepository } from './company-list-repository';

@injectable()
@autoWired
export class CompanyListPage extends BackofficePage {
  @inject(CompanyListRepository) private repository: CompanyListRepository;

  protected PAGE_URL = '/company-gui/list-company';

  update = (params: UpdateParams): void => {
    this.find({
      interceptTableUrl: '**/company-gui/list-company/table**',
      searchQuery: params.query,
    }).then((getRow) => {
      if (!getRow) {
        return;
      }

      getRow().then(($companyRow: JQuery<HTMLElement>) => {
        if (params.action === ActionEnum.activate) {
          cy.wrap($companyRow).find(this.repository.getActivateButtonSelector()).click({ force: true });
        }

        if (params.action === ActionEnum.approve) {
          cy.wrap($companyRow).find(this.repository.getApproveButtonSelector()).click({ force: true });
        }
      });
    });
  };

  getRow = (companyName: string): Cypress.Chainable => cy.contains('tbody tr', companyName);
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}
