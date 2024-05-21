import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { StoreCreateRepository } from './store-create-repository';

@injectable()
@autoWired
export class StoreCreatePage extends BackofficePage {
  @inject(StoreCreateRepository) private repository: StoreCreateRepository;

  protected PAGE_URL = '/store-gui/create';

  create = (params: CreateParams): void => {
    this.repository.getNameInput().type(params.store.name);

    this.repository.getLocalesTab().click();
    this.repository.getDefaultLocaleSelect().click();
    this.repository.getDefaultLocaleSearchInput().type(`${params.store.defaultLocale}{enter}`);
    this.repository.getLocaleSearchInput().type(params.store.defaultLocale);
    this.repository.getAvailableEnUsLocaleInput().click({ force: true });

    this.repository.getCurrenciesTab().click();
    this.repository.getDefaultCurrencySelect().click();
    this.repository.getDefaultCurrencySearchInput().type(`${params.store.defaultCurrency}{downarrow}{enter}`);
    this.repository.getCurrencySearchInput().type(params.store.defaultCurrency);
    this.repository.getAvailableEuroCurrencyInput().click({ force: true });

    this.repository.getSaveButton().click();
  };

  generateStore = (name?: string): Store => {
    let storeName = name ?? this.faker.commerce.department();
    storeName = storeName.replace(/[\s-]/g, '_');
    storeName = storeName.toUpperCase();

    return {
      name: storeName,
      defaultLocale: 'en_US',
      defaultCurrency: 'Euro',
    };
  };
}

interface CreateParams {
  store: Store;
}

interface Store {
  name: string;
  defaultLocale: string;
  defaultCurrency: string;
}
