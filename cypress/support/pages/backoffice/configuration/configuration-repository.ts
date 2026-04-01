import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class ConfigurationRepository {
  getScopeSelectorSelector = (): string => '[data-qa="scope-combined"]';

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getResetButtonSelector = (): string => '[data-qa="reset-changes"]';

  getBackofficeLogoContainerSelector = (): string =>
    '.file-upload-setting:has(input[id="setting-theme:logos:logos:backoffice_logo_url"])';

  getMerchantPortalLogoContainerSelector = (): string =>
    '.file-upload-setting:has(input[id="setting-theme:logos:logos:merchant_portal_logo"])';

  getStorefrontLogoContainerSelector = (): string =>
    '.file-upload-setting:has(input[id="setting-theme:logos:logos:yves_logo_url"])';

  getUploadTriggerSelector = (): string => '[data-qa="file-upload-trigger"]';

  getModalFileInputSelector = (): string => '.js-file-input';

  getModalUploadSubmitSelector = (): string => '.js-file-upload-submit';

  getLogoHiddenValueInputSelector = (): string => '.js-file-setting-value';

  getFileUploadUrl = (): string => '/configuration/file-upload/upload';

  getThemeMainColorSelector = (): string => 'input[id="setting-theme:storefront:colors:background_brand_primary"]';

  getThemeAltColorSelector = (): string => 'input[id="setting-theme:storefront:colors:background_brand_subtle"]';

  getCustomCssSelector = (): string => 'textarea[id="setting-theme:storefront:custom_css:yves_custom_css"]';

  getBackofficeColorSelector = (): string => 'input[id="setting-theme:backoffice:colors:bo_main_color"]';

  getBackofficeSidenavColorSelector = (): string => 'input[id="setting-theme:backoffice:colors:bo_sidenav_color"]';

  getBackofficeSidenavTextColorSelector = (): string =>
    'input[id="setting-theme:backoffice:colors:bo_sidenav_text_color"]';

  getMerchantPortalColorSelector = (): string => 'input[id="setting-theme:merchant_portal:colors:spy_primary_color"]';
}
