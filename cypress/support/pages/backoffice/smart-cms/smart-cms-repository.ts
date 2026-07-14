import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class SmartCmsRepository {
  private static readonly ENABLE_SETTING_KEY = 'ai_commerce:smart_cms:general:is_enabled';

  getEnableToggleSelector = (): string =>
    `.setting-row[data-setting-key="${SmartCmsRepository.ENABLE_SETTING_KEY}"] .config-input`;

  getSaveButtonSelector = (): string => '[data-qa="save-configuration"]';

  getPanelSelector = (): string => '.js-smart-cms-panel';

  getPanelCollapsedClass = (): string => 'smart-cms-panel--collapsed';

  getPanelToggleSelector = (): string => '.js-smart-cms-panel__toggle';

  getPanelInputSelector = (): string => '.js-smart-cms-panel__input';

  getPanelAskSelector = (): string => '.js-smart-cms-panel__ask';

  getPanelAttachSelector = (): string => '.js-smart-cms-panel__attach';

  getPanelFileInputSelector = (): string => '.js-smart-cms-panel__file-input';

  getPanelAttachmentNameSelector = (): string => '.js-smart-cms-panel__attachment-name';

  getPanelAttachmentRemoveSelector = (): string => '.js-smart-cms-panel__attachment-remove';

  getGlossaryEditorSelector = (): string => 'textarea.html-editor';

  getPanelMessageSelector = (): string => '.js-smart-cms-panel__message';

  getPanelMessageErrorClass = (): string => 'smart-cms-panel__message--error';

  getPanelMessageVisibleClass = (): string => 'smart-cms-panel__message--visible';

  getPanelSuccessMessageSelector = (): string =>
    '.js-smart-cms-panel__message.smart-cms-panel__message--success:not(.smart-cms-panel__message--error)';

  getGenerateEndpointGlob = (): string => '**/ai-commerce/smart-cms-content/generate';

  getPanelToggleTitle = (): string => 'Smart CMS Content Assistant';

  getPanelInputPlaceholder = (): string => 'Ask AI to generate or edit the title and content…';

  getPanelAskLabel = (): string => 'Ask AI';

  getContentConfigWindowKey = (): string => 'SmartCmsContentConfig';

  getHeroPrompt = (): string => 'Write a punchy hero title and a short intro paragraph for this landing page';

  getBlockPrompt = (): string => 'Write a short promotional block heading and a matching one-line description';

  getProbeImageFileName = (): string => 'search-by-image-probe.png';
}
