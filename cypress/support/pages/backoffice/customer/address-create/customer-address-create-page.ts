import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CustomerAddressCreateRepository } from './customer-address-create-repository';

@injectable()
@autoWired
export class CustomerAddressCreatePage extends BackofficePage {
  @inject(CustomerAddressCreateRepository) private repository: CustomerAddressCreateRepository;

  protected PAGE_URL = '/customer/address/add';

  // Only the fields the form marks NotBlank, plus salutation, which the storefront prints.
  create = (params: CreateParams): void => {
    this.repository.getSalutationSelect().select(params.salutation, { force: true });
    this.repository.getFirstNameInput().clear().type(params.firstName);
    this.repository.getLastNameInput().clear().type(params.lastName);
    this.repository.getAddress1Input().clear().type(params.address1);
    this.repository.getCityInput().clear().type(params.city);
    this.repository.getZipCodeInput().clear().type(params.zipCode);
    this.repository.getCountrySelect().select(params.country, { force: true });

    this.repository.getSubmitButton().click();
  };
}

interface CreateParams {
  salutation: string;
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  zipCode: string;
  country: string;
}
