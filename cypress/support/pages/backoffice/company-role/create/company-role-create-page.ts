import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { BackofficePage } from '@pages/backoffice';

@injectable()
@autoWired
export class CompanyRoleCreatePage extends BackofficePage {
  protected PAGE_URL = '/company-role-gui/create-company-role';
}
