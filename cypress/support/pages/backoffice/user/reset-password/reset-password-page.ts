import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';
import { ResetPasswordRepository } from './reset-password-repository';

@injectable()
@autoWired
export class ResetPasswordPage extends BackofficePage {
  @inject(ResetPasswordRepository) private repository: ResetPasswordRepository;

  protected PAGE_URL = '/user/edit/password-reset';

  changePassword(currentPassword: string, newPassword: string): void {
    this.repository.getCurrentPasswordInput().type(currentPassword);
    this.repository.getNewPasswordInput().type(newPassword);
    this.repository.getConfirmPasswordInput().type(newPassword);
    this.repository.getSubmitButton().click();
  }
}
