import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class QuicksightAnalyticsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getTitleActionSelector = (): string => '[data-qa="title-action"]';

  getSynchronizeUsersButtonSelector = (): string =>
    'form[action="/amazon-quicksight/user/synchronize-quicksight-users"] button';

  getNoPermissionMessageSelector = (): string => '.alert-info';
}
