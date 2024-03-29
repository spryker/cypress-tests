import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { MerchantCreateRepository } from './merchant-create-repository';

@injectable()
@autoWired
export class MerchantCreatePage extends BackofficePage {
  @inject(MerchantCreateRepository) private repository: MerchantCreateRepository;

  protected PAGE_URL = '/merchant-gui/create-merchant';

  create = (): Merchant => {
    const identifier = this.faker.string.uuid();

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

    return merchant;
  };
}

interface Merchant {
  name: string;
  reference: string;
  email: string;
  url: string;
}
