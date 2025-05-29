import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { CustomerRemoveMfaRepository } from './customer-remove-mfa-repository';

@injectable()
@autoWired
export class CustomerRemoveMfaPage extends BackofficePage {
  @inject(CustomerRemoveMfaRepository) private repository: CustomerRemoveMfaRepository;

  protected PAGE_URL = '/multi-factor-auth/customer/remove-mfa';

  confirmRemoveMultiFactorAuthentication(): void {
    cy.get(this.repository.getRemoveButtonSelector()).click();
  }
}
