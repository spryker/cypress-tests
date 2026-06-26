import { injectable } from 'inversify';
import { AiConfigurationRepository } from '../ai-configuration-repository';

/**
 * The core Configuration Management screen (`@Configuration/Manage/index.twig`) and its
 * setting-row partials expose few `data-qa` hooks, so most selectors fall back to the stable
 * markup contract the template guarantees:
 *   - the React-less server-rendered card (`.configuration-management`, `.card-title`),
 *   - the left-nav feature/tab items keyed by `data-feature` / `data-tab`,
 *   - the setting rows keyed by their fully-qualified `data-setting-key`
 *     (e.g. `ai_vendor:openai:general:api_token` — NOT the leaf key), and
 *   - the `[data-qa="save-configuration"]` action that the template does expose.
 *
 * Inputs/textareas inside a row carry an `id="setting-<fully-qualified-key>"`, but that id
 * contains `:` which is invalid in a CSS id selector, so we scope to the row by attribute and
 * read the input/textarea within it instead of selecting the id directly. See:
 *   vendor/spryker/configuration/.../Presentation/Manage/index.twig
 *   vendor/spryker/configuration/.../Presentation/Manage/_partials/setting-row.twig
 *   vendor/spryker/configuration/.../Presentation/Manage/_partials/inputs/{text,json,radio}.twig
 */
@injectable()
export class SuiteAiConfigurationRepository implements AiConfigurationRepository {
  getCardTitleSelector = (): string => '.configuration-management .card-title';

  getFeatureNavSelector = (feature: string): string => `.feature-header[data-feature="${feature}"]`;

  getTabNavSelector = (feature: string, tab: string): string =>
    `.feature-tabs__item[data-feature="${feature}"][data-tab="${tab}"]`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getSettingRowSelector = (settingKey: string): string => `.setting-row[data-setting-key="${settingKey}"]`;

  getSettingInputSelector = (settingKey: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] .config-input`;

  getJsonEditorSelector = (settingKey: string): string => `.setting-row[data-setting-key="${settingKey}"] .json-editor`;

  getRadioOptionSelector = (settingKey: string): string =>
    `.setting-row[data-setting-key="${settingKey}"] input[type="radio"]`;
}
