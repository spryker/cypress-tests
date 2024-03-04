import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { MerchantCreateRepository } from './merchant-create-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { BackofficePage } from '../../backoffice-page';

@injectable()
@autoWired
export class MerchantCreatePage extends BackofficePage {
  protected PAGE_URL: string = '/merchant-gui/create-merchant';

  constructor(@inject(MerchantCreateRepository) private repository: MerchantCreateRepository) {
    super();
  }

  public createMerchant = () => {
    const identifier: string = this.faker.string.uuid();

    const merchant = {
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
