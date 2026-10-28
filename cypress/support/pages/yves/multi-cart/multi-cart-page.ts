import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { MultiCartRepository } from './multi-cart-repository';

@injectable()
@autoWired
export class MultiCartPage extends YvesPage {
  @inject(REPOSITORIES.MultiCartRepository) private repository: MultiCartRepository;

  protected PAGE_URL = '/multi-cart';

  createCart = (params?: CreateCartParams): string => {
    cy.visit(`${this.PAGE_URL}/create`);
    const cartName = params?.name ?? `Cart #${this.faker.string.uuid()}`;

    this.repository.getCreateCartNameInput().clear().type(cartName);
    this.repository.getCreateCartForm().submit();

    return cartName;
  };

  getCartCreatedMessage = (cartName: string): Cypress.Chainable =>
    cy.contains(`Cart '${cartName}' was created successfully`);

  selectCart = (params: SelectCartParams): void => {
    this.repository.getQuoteTable().contains(params.name).click();
  };

  getMiniCartRadios = (): Cypress.Chainable => {
    return this.repository.getMiniCartRadios();
  };

  getCartRow = (name: string): Cypress.Chainable => this.repository.getQuoteTable().contains('tr', name);

  openShareCartPage = (name: string): void => {
    this.getCartRow(name).find('a[href*="/shared-cart/share/"]').click();
  };

  // The share form lists every other company user by name and one access level each. The B2B
  // themes cover the native select with a select2 widget, so it is selected forcibly.
  shareCartWithCompanyUser = (params: ShareCartWithCompanyUserParams): void => {
    cy.contains('[data-qa="component user-share-list"] li', params.name)
      .find('select')
      .select(params.accessLevel, { force: true });
    cy.get('form[name="shareCartForm"] button[type="submit"]').click();
  };
}

interface CreateCartParams {
  name?: string;
}

interface SelectCartParams {
  name: string;
}

interface ShareCartWithCompanyUserParams {
  name: string;
  accessLevel: string;
}
