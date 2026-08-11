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
    this.repository.getLocaleSearchInput().clear().type(store.locale, { delay: 0 });
    this.interceptTable({ url: '/locale-gui/index/available-locale-table-selectable**' }).then(() => {
      this.checkRelation(this.repository.getAvailableLocaleInput(store.locale));
      this.selectDefault(this.repository.getDefaultLocaleSelect(), store.locale);
    });

    this.repository.getCurrenciesTab().click();
    this.repository.getCurrencySearchInput().clear().type(store.currency);
    this.interceptTable({ url: '/currency-gui/index/available-currency-table-selectable**' }).then(() => {
      this.checkRelation(this.repository.getAvailableCurrencyInput(store.currency));
      this.selectDefault(this.repository.getDefaultCurrencySelect(), store.currency);
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

  // The relation tables redraw after their selectable-table request resolves, so a bare
  // click can land on a row that is about to be replaced. `force: true` then hides the
  // failure and the store saves without that relation — a store with no locale is
  // accepted, published into the store list, and only surfaces much later as a 500 from
  // Yves when something visits it (`defaultLocaleIsoCode` is null). `check()` is
  // checkbox-aware and idempotent, and the retried assertion makes a lost click fail
  // here, where the cause is obvious, instead of in an unrelated hook.
  private checkRelation = (input: Cypress.Chainable): void => {
    input.check({ force: true }).should('be.checked');
  };

  // The default-locale and default-currency dropdowns are populated from the rows checked
  // in the relation table, so they have to be set after that checkbox, not before it —
  // selecting first left the store with a null `defaultLocaleIsoCode`, which Yves only
  // reports as a 500 the next time anything visits the store. The assertion holds the
  // value against the re-render the checkbox triggers.
  private selectDefault = (select: Cypress.Chainable, value: string): void => {
    select.select(value, { force: true }).should('have.value', value);
  };
}

interface Store {
  name: string;
  locale: string;
  currency: string;
  country: string;
  timezone: string;
}
