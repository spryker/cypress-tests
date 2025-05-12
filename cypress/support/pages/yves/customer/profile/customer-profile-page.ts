import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { CustomerProfileRepository } from './customer-profile-repository';

@injectable()
@autoWired
export class CustomerProfilePage extends YvesPage {
  @inject(REPOSITORIES.CustomerProfileRepository) private repository: CustomerProfileRepository;

  protected PAGE_URL = '/customer/profile';

  changePassword(currentPassword: string, newPassword: string): void {
    this.repository.getCurrentPasswordInput().type(currentPassword);
    this.repository.getNewPasswordInput().type(newPassword);
    this.repository.getConfirmPasswordInput().type(newPassword);
    this.repository.getSubmitButton().click();
  }

  waitForPasswordChangedMessage(): void {
    cy.contains(this.repository.getPasswordChangedMessage()).should('be.visible');
  }
}
