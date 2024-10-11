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
    this.repository.getDefaultLocaleSelect().click();
    this.repository.getDefaultLocaleSearchInput().type(`${store.locale}{enter}`);
    this.repository.getLocaleSearchInput().clear().type(store.locale);
    this.repository.getAvailableLocaleInput(store.locale).click({ force: true });

    this.repository.getCurrenciesTab().click();
    this.repository.getDefaultCurrencySelect().click();
    this.repository.getDefaultCurrencySearchInput().type(`${store.currency}{downarrow}{enter}`);
    this.repository.getCurrencySearchInput().type(store.currency);
    this.repository.getAvailableCurrencyInput(store.currency).click({ force: true });

    this.repository.getDisplayRegionsTab().click();
    this.repository.getCountrySearchInput().clear().type(store.country);
    this.repository.getAvailableCountryInput(store.country).click({ force: true });

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
