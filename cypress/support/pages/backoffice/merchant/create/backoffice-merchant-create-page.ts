import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { BackofficeMerchantCreateRepository } from './backoffice-merchant-create-repository';

@injectable()
@autoProvide
export class BackofficeMerchantCreatePage extends AbstractPage {
  public PAGE_URL: string = '/merchant-gui/create-merchant';

  constructor(@inject(BackofficeMerchantCreateRepository) private repository: BackofficeMerchantCreateRepository) {
    super();
  }

  public createMerchant = (): Merchant => {
    const identifier: string = this.faker.string.uuid();

    const merchant: Merchant = {
      name: 'Name: ' + identifier,
      reference: 'ref-' + identifier,
      email: this.faker.internet.email(),
      url: identifier,
    };

    this.repository.getNameInput().clear().type(merchant.name);
    this.repository.getReferenceInput().clear().type(merchant.reference);
    this.repository.getEmailInput().clear().type(merchant.email);
    this.repository.getActiveCheckbox().check();
    this.repository.getDEUrlInput().clear().type(merchant.url);
    this.repository.getENUrlInput().clear().type(merchant.url);

    this.repository.getSaveButton().click();
    cy.contains('Merchant created successfully.').should('exist');

    return merchant;
  };
}
