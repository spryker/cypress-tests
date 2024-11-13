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
            this.repository.getAvailableLocaleInput(store.locale).click({ force: true });
        });

        this.repository.getCurrenciesTab().click();
        this.repository.getDefaultCurrencySelect().select(store.currency, { force: true });
        this.repository.getCurrencySearchInput().clear().type(store.currency);
        this.interceptTable({ url: '/currency-gui/index/available-currency-table-selectable**' }).then(() => {
            this.repository.getAvailableCurrencyInput(store.currency).click({ force: true });
        });

        this.repository.getDisplayRegionsTab().click();
        this.repository.getCountrySearchInput().clear().type(store.country);
        this.interceptTable({ url: '/country-gui/index/available-country-table-selectable**' }).then(() => {
            this.repository.getAvailableCountryInput(store.country).click({ force: true });
        });

        this.repository.getStoreContextTabButton().click();
        this.repository.getAddStoreContextButton().click();
        this.repository.getTimezoneSelector().select(store.timezone);

        this.repository.getSaveButton().click();
    };
}

interface Store {
  name: string;
  locale: string;
  currency: string;
  country: string;
  timezone: string;
}
