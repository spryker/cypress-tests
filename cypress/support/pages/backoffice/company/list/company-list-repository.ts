import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CompanyListRepository {
  // The row actions are CSRF-protected forms, so their action URL is a steadier handle than the button label.
  getActivateButtonSelector = (): string => 'form[action*="/company-gui/edit-company/activate"] button[type="submit"]';
  getApproveButtonSelector = (): string => 'form[action*="/company-gui/edit-company/approve"] button[type="submit"]';
}
