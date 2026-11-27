import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class QuicksightAnalyticsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getSynchronizeUsersFormAction = (): string => '/amazon-quicksight/user/synchronize-quicksight-users';

  getSynchronizeUsersFormSelector = (): string => `form[action="${this.getSynchronizeUsersFormAction()}"]`;

  getSynchronizeUsersButtonSelector = (): string => `${this.getSynchronizeUsersFormSelector()} button`;

  getSynchronizeUsersCsrfTokenSelector = (): string => `${this.getSynchronizeUsersFormSelector()} input[name="_token"]`;

  getInfoAlertSelector = (): string => '.alert-info';

  getNoPermissionText = (): string => 'No Analytics permission has been granted to the current user.';

  getSynchronizeUsersLabel = (): string => 'Synchronize Users';

  getSectionTitleText = (): string => 'Analytics';
}
