import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { MerchantUpdateRepository } from './merchant-update-repository';

@injectable()
@autoWired
export class MerchantUpdatePage extends BackofficePage {
  @inject(MerchantUpdateRepository) private repository: MerchantUpdateRepository;

  protected PAGE_URL = '/merchant-gui/edit-merchant';

  create = (): void => {
    this.openUsersTab();
    this.repository.getAddMerchantUserButton().click();
  };

  openUsersTab = (): void => {
    this.repository.getUsersTab().click();
  };

  // The merchant-user table declares every column non-searchable, so its rows are matched on the
  // e-mail text rather than through the table search.
  findMerchantUserRow = (params: FindMerchantUserRowParams): Cypress.Chainable =>
    this.repository.getMerchantUserTableRows().filter(`:contains("${params.email}")`, { timeout: 20000 });

  updateMerchantUser = (params: UpdateMerchantUserParams): void => {
    const selectors = {
      [ActionEnum.edit]: this.repository.getMerchantUserEditButtonSelector(),
      [ActionEnum.activate]: this.repository.getMerchantUserActivateButtonSelector(),
      [ActionEnum.deactivate]: this.repository.getMerchantUserDeactivateButtonSelector(),
      [ActionEnum.delete]: this.repository.getMerchantUserDeleteButtonSelector(),
    };

    // DataTables re-renders the row when its ajax settles, so the action is clicked through an
    // alias, which Cypress re-queries instead of holding a detached element.
    this.findMerchantUserRow({ email: params.email }).find(selectors[params.action]).as('merchantUserAction');
    cy.get('@merchantUserAction').click();

    if (params.action === ActionEnum.delete) {
      this.repository.getConfirmDeleteButton().click();
    }
  };

  rename = (params: RenameParams): void => {
    this.repository.getNameInput().clear().type(params.name);
    this.repository.getSaveButton().click();
  };

  // Taking every store off the relation is what retires the merchant's storefront page.
  unassignAllStores = (): void => {
    this.repository.getAllAvailableStoresInputs().uncheck({ force: true });
    this.repository.getSaveButton().click();
  };

  assignAllAvailableStore = (): void => {
    this.repository.getAllAvailableStoresInputs().check();
    this.repository.getSaveButton().click();
  };
}

interface RenameParams {
  name: string;
}

interface FindMerchantUserRowParams {
  email: string;
}

interface UpdateMerchantUserParams {
  email: string;
  action: ActionEnum.edit | ActionEnum.activate | ActionEnum.deactivate | ActionEnum.delete;
}
