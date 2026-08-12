import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { StoreCreateRepository } from './store-create-repository';

@injectable()
@autoWired
export class StoreCreatePage extends BackofficePage {
  @inject(StoreCreateRepository) private repository: StoreCreateRepository;

  protected PAGE_URL = '/store-gui/create';

  create = (store: Store): void => {
    this.repository.getNameInput().type(store.name);

    this.repository.getLocalesTab().click();
    this.repository.getDefaultLocaleSelect().select(store.locale, { force: true });
    this.repository.getLocaleSearchInput().clear().type(store.locale, { delay: 0 });
    this.interceptTable({ url: '/locale-gui/index/available-locale-table-selectable**' }).then(() => {
      this.checkRelation(this.repository.getAvailableLocaleInput(store.locale));
    });

    this.repository.getCurrenciesTab().click();
    this.repository.getDefaultCurrencySelect().select(store.currency, { force: true });
    this.repository.getCurrencySearchInput().clear().type(store.currency);
    this.interceptTable({ url: '/currency-gui/index/available-currency-table-selectable**' }).then(() => {
      this.checkRelation(this.repository.getAvailableCurrencyInput(store.currency));
    });

    this.repository.getDisplayRegionsTab().click();
    this.repository.getCountrySearchInput().clear().type(store.country);
    this.interceptTable({ url: '/country-gui/index/available-country-table-selectable**' }).then(() => {
      this.checkRelation(this.repository.getAvailableCountryInput(store.country));
    });

    this.repository.getStoreContextTabButton().click();
    this.repository.getAddStoreContextButton().click({ force: true });
    this.repository.getTimezoneSelector().select(store.timezone);

    this.repository.getSaveButton().click();
  };

  // The table redraws when its request resolves, so a plain click can land on a row that is
  // about to be replaced; `check` is idempotent and the assertion catches a click that lost.
  private checkRelation = (input: Cypress.Chainable): void => {
    input.check({ force: true }).should('be.checked');
  };
}

interface Store {
  name: string;
  locale: string;
  currency: string;
  country: string;
  timezone: string;
}
