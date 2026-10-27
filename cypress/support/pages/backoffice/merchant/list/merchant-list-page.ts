import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage, ActionEnum } from '@pages/backoffice';
import { MerchantListRepository } from './merchant-list-repository';

@injectable()
@autoWired
export class MerchantListPage extends BackofficePage {
  @inject(MerchantListRepository) private repository: MerchantListRepository;

  protected PAGE_URL = '/merchant-gui/list-merchant';

  update = (params: UpdateParams): void => {
    this.find(this.createFindParams(params.query)).then((getRow) => {
      if (!getRow) {
        return;
      }

      getRow().then(($merchantRow: JQuery<HTMLElement>) => {
        if (params.action === ActionEnum.edit) {
          this.clickEditAction($merchantRow);
        }

        const statusButtonSelectors: Partial<Record<ActionEnum, string>> = {
          [ActionEnum.activate]: this.repository.getActivateButtonSelector(),
          [ActionEnum.deactivate]: this.repository.getDeactivateButtonSelector(),
          [ActionEnum.approveAccess]: this.repository.getApproveAccessButtonSelector(),
          [ActionEnum.denyAccess]: this.repository.getDenyAccessButtonSelector(),
        };
        const statusButtonSelector = statusButtonSelectors[params.action];

        if (statusButtonSelector) {
          this.submitStatusForm($merchantRow, statusButtonSelector);
        }
      });
    });
  };

  findRow = (params: FindRowParams): Cypress.Chainable => {
    return this.find(this.createFindParams(params.query)).then((getRow) => (getRow ? getRow() : cy.wrap(null)));
  };

  // The table redraws after the search response arrives, so the first visible row can still be a merchant of the
  // unfiltered list. The row count and the name filter make the row getter wait for the searched merchant.
  private createFindParams = (query: string): Parameters<BackofficePage['find']>[0] => ({
    interceptTableUrl: `**/merchant-gui/list-merchant/table**`,
    searchQuery: query,
    expectedCount: 1,
    rowFilter: [($row: JQuery<HTMLElement>): boolean => $row.text().includes(query)],
  });

  // Every status form saves the whole merchant as it read it, so a form posted before the previous one is
  // saved writes the previous change back; each post is therefore awaited.
  private submitStatusForm = ($row: JQuery<HTMLElement>, buttonSelector: string): void => {
    const statusFormAlias = this.faker.string.uuid();
    cy.intercept({ method: 'POST', pathname: this.repository.getStatusFormPathPattern() }).as(statusFormAlias);

    cy.wrap($row).find(buttonSelector).click({ force: true });

    cy.wait(`@${statusFormAlias}`);
  };

  clickEditAction = ($row: JQuery<HTMLElement>): void => {
    cy.wrap($row).find(this.repository.getEditButtonSelector()).click();
  };

  rowIsAssignedToStore = (params: IsAssignedParams): boolean => {
    if (typeof params.storeName !== 'string') {
      return false;
    }

    return params.row.find(this.repository.getStoreCellSelector()).text().includes(params.storeName);
  };
}

interface UpdateParams {
  action: ActionEnum;
  query: string;
}

interface FindRowParams {
  query: string;
}

interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}
