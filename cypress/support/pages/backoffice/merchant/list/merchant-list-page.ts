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
    this.find({ tableUrl: '/merchant-gui/list-merchant/table**', searchQuery: params.query }).then(($merchantRow) => {
      if (params.action === ActionEnum.edit) {
        this.clickEditAction($merchantRow);
      }

      if (params.action === ActionEnum.activate) {
        cy.wrap($merchantRow).find(this.repository.getActivateButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.deactivate) {
        cy.wrap($merchantRow).find(this.repository.getDeactivateButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.approveAccess) {
        cy.wrap($merchantRow).find(this.repository.getDeactivateButtonSelector()).should('exist').click();
      }

      if (params.action === ActionEnum.denyAccess) {
        cy.wrap($merchantRow).find(this.repository.getDeactivateButtonSelector()).should('exist').click();
      }
    });
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

interface IsAssignedParams {
  row: JQuery<HTMLElement>;
  storeName?: string;
}

interface FindParams {
  query: string;
  expectedCount?: number;
}
