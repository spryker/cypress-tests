import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { BackofficePage } from '@pages/backoffice';
import { CategoryCreateRepository } from './category-create-repository';

@injectable()
@autoWired
export class CategoryCreatePage extends BackofficePage {
  @inject(REPOSITORIES.CategoryCreateRepository) private repository: CategoryCreateRepository;

  protected PAGE_URL = '/category-gui/create';

  // Fills the category form and submits it. Assumes the page has already been visited so the
  // caller can assert on the breadcrumb of the freshly-loaded create page first (mirrors the
  // Codeception amOnPage -> seeBreadcrumbNavigation -> fill -> submit order).
  createCategory = (data: CategoryCreateData): void => {
    this.repository.getKeyInput().clear().type(data.categoryKey);
    this.repository.getParentNodeSelect().select(data.parentNodeValue, { force: true });
    this.repository.getTemplateSelect().select(data.templateValue, { force: true });

    // The non-current locale ibox renders collapsed, so expand it before its inputs are reachable.
    this.repository.getCollapsedLocalizedAttributeToggle().click();

    data.localizedAttributes.forEach((attributes) => {
      Object.entries(attributes).forEach(([name, value]) => {
        this.repository.getFieldByName(name).clear({ force: true }).type(value, { force: true });
      });
    });

    this.repository.getSubmitButton().click();
  };

  assertBreadcrumb = (text: string): void => {
    this.repository.getBreadcrumb().should('contain', text);
  };

  assertSuccessMessage = (): void => {
    cy.contains(this.repository.getSuccessMessage()).should('be.visible');
  };

  buildLocalizedAttributes = (categoryKey: string, position: number, localeName: string): Record<string, string> => ({
    [`category[localized_attributes][${position}][name]`]: `${categoryKey} ${localeName}`,
    [`category[localized_attributes][${position}][meta_title]`]: `${categoryKey} ${localeName} Title`,
    [`category[localized_attributes][${position}][meta_description]`]: `${categoryKey} ${localeName} Description`,
    [`category[localized_attributes][${position}][meta_keywords]`]: `${categoryKey} ${localeName} Keywords`,
  });
}

interface CategoryCreateData {
  categoryKey: string;
  parentNodeValue: string;
  templateValue: string;
  localizedAttributes: Array<Record<string, string>>;
}
