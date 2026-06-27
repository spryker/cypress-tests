import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class QuicksightAnalyticsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getTitleActionSelector = (): string => '[data-qa="title-action"]';

  getSynchronizeUsersFormSelector = (): string => 'form[action="/amazon-quicksight/user/synchronize-quicksight-users"]';

  getSynchronizeUsersButtonSelector = (): string =>
    'form[action="/amazon-quicksight/user/synchronize-quicksight-users"] button';

  getSynchronizeUsersCsrfTokenSelector = (): string =>
    'form[action="/amazon-quicksight/user/synchronize-quicksight-users"] input[name="_token"]';

  getNoPermissionMessageSelector = (): string => '.alert-info';
}
