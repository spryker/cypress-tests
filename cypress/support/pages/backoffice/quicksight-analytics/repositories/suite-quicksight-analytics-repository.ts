import { injectable } from 'inversify';
import { QuicksightAnalyticsRepository } from '../quicksight-analytics-repository';

/**
 * The core AnalyticsGui page and the AmazonQuicksight partials expose no `data-qa` hooks,
 * so these selectors fall back to the stable Back Office layout structure
 * (`@Gui/Layout/layout.twig` page header + title-action slot) and the QuickSight
 * partial's translated text. See:
 *   vendor/spryker/gui/.../Presentation/Layout/layout.twig
 *   vendor/spryker-eco/amazon-quicksight/.../Presentation/_partials/quicksight-analytics.twig
 *   vendor/spryker-eco/amazon-quicksight/.../Presentation/_partials/synchronize-quicksight-users-action.twig
 */
@injectable()
export class SuiteQuicksightAnalyticsRepository implements QuicksightAnalyticsRepository {
  getSectionTitleSelector = (): string => '.page-title-head h2';

  getTitleActionSelector = (): string => '[data-qa="title-action"]';

  getSynchronizeUsersButtonSelector = (): string =>
    'form[action="/amazon-quicksight/user/synchronize-quicksight-users"] button';

  getNoPermissionMessageSelector = (): string => '.alert-info';
}
