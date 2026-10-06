import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class CmsPageUpdateRepository {
  // The store relation renders one checkbox per store, all checked by default, with the
  // store name as the label text — so a store is addressed by its name, not by an index
  // that shifts as soon as another spec creates a store.
  getStoreCheckbox = (storeName: string): Cypress.Chainable =>
    cy
      .get('#cms_page_storeRelation_id_stores label')
      .contains(new RegExp(`^\\s*${storeName}\\s*$`))
      .find('input[type="checkbox"]');

  getSaveButton = (): Cypress.Chainable => cy.get('#submit-cms');

  getPublishButton = (): Cypress.Chainable => cy.get('[name="publish_version_page_form"]').find('.safe-submit');
}
