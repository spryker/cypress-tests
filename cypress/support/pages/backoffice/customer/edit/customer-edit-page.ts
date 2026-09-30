import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CustomerEditRepository } from './customer-edit-repository';

@injectable()
@autoWired
export class CustomerEditPage extends BackofficePage {
  @inject(CustomerEditRepository) private repository: CustomerEditRepository;

  protected PAGE_URL = '/customer/edit';

  update = (params: UpdateParams): void => {
    this.repository.getSalutationSelect().select(params.salutation, { force: true });
    this.repository.getFirstNameInput().clear().type(params.firstName);
    this.repository.getLastNameInput().clear().type(params.lastName);
    this.repository.getSaveButton().click();
  };
}

interface UpdateParams {
  salutation: string;
  firstName: string;
  lastName: string;
}
