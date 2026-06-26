import { injectable } from 'inversify';
import { SmartCmsRepository } from '../smart-cms-repository';

/**
 * Smart CMS Content Assistant is a collapsible panel injected above the WYSIWYG content area of
 * the Back Office CMS Page (`cms-gui/create-glossary`) and CMS Block (`cms-block-gui/edit-glossary`)
 * glossary editors. It renders only when the config flag `ai_commerce:smart_cms:general:is_enabled`
 * is ON — default OFF — so the suite enables the flag once (via the Configuration Management UI)
 * before asserting the panel. The panel exposes stable `js-smart-cms-panel*` hook classes (the
 * partial's intended JS contract) rather than `data-qa` attributes:
 *   vendor/spryker-feature/ai-commerce/.../Presentation/Partials/smart-cms-glossary-panel.twig
 *
 * Enabling the flag is done through the core Configuration Management screen
 * (`@Configuration/Manage/index.twig`). That screen has few `data-qa` hooks, so the enable toggle
 * falls back to the stable `.setting-row[data-setting-key="…"]` contract (same pattern as the
 * Backoffice Assistant page object) and the `[data-qa="save-configuration"]` action the template
 * does expose:
 *   vendor/spryker/configuration/.../Presentation/Manage/index.twig
 *   vendor/spryker/configuration/.../Presentation/Manage/_partials/setting-row.twig
 */
@injectable()
export class SuiteSmartCmsRepository implements SmartCmsRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:smart_cms:general:is_enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${SuiteSmartCmsRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getPanelSelector = (): string => '.js-smart-cms-panel';

  getPanelToggleSelector = (): string => '.js-smart-cms-panel__toggle';

  getPanelInputSelector = (): string => '.js-smart-cms-panel__input';

  getPanelAskSelector = (): string => '.js-smart-cms-panel__ask';

  getPanelAttachSelector = (): string => '.js-smart-cms-panel__attach';
}
