import { injectable } from 'inversify';
import { NavigationTreeRepository } from '../navigation-tree-repository';

@injectable()
export class B2cNavigationTreeRepository implements NavigationTreeRepository {
  getNavigationCreateUrl(): string {
    return '/navigation-gui/create';
  }

  getNavigationListUrl(): string {
    return '/navigation-gui';
  }

  getNavigationUpdateUrl(idNavigation: number): string {
    return `/navigation-gui/update?id-navigation=${idNavigation}`;
  }

  getNavigationDeleteUrl(idNavigation: number): string {
    return `/navigation-gui/delete?id-navigation=${idNavigation}`;
  }

  getNameInput(): Cypress.Chainable {
    return cy.get('#navigation_name');
  }

  getKeyInput(): Cypress.Chainable {
    return cy.get('#navigation_key');
  }

  getIsActiveCheckbox(): Cypress.Chainable {
    return cy.get('#navigation_is_active');
  }

  getNavigationSaveButton(): Cypress.Chainable {
    return cy.get('#navigation-save-btn');
  }

  getDeleteSubmitButton(): Cypress.Chainable {
    return cy.get('#delete_navigation_form_submit');
  }

  getSuccessAlert(): Cypress.Chainable {
    return cy.get('.flash-messages .alert-success', { timeout: 30000 });
  }

  getListTableRows(): Cypress.Chainable {
    return cy.get('#navigation-table tbody tr');
  }

  getCreateSuccessPattern(): RegExp {
    return /Navigation element \d+ was created successfully\./;
  }

  getUpdateSuccessPattern(): RegExp {
    return /Navigation element \d+ was updated successfully\./;
  }

  getDeleteSuccessPattern(): RegExp {
    return /Navigation element \d+ was deleted successfully\./;
  }

  getNavigationTableSelector(): string {
    return '#navigation-table';
  }

  getTableSearchInput(): Cypress.Chainable {
    return cy.get('#navigation-table_filter input[type="search"]');
  }

  getTableRowByText(text: string): Cypress.Chainable {
    return cy.get('#navigation-table tbody').contains('td', text);
  }

  getTreeSelector(): string {
    return '#navigation-tree';
  }

  getTreeNodeSelector(): string {
    return '.jstree-node';
  }

  getRootNodeAnchorSelector(): string {
    return '#navigation-node-0_anchor';
  }

  getNodeAnchorSelector(idNavigationNode: number): string {
    return `#navigation-node-${idNavigationNode}_anchor`;
  }

  getNodeSelector(idNavigationNode: number): string {
    return `#navigation-node-${idNavigationNode}`;
  }

  getTreeSaveButton(): Cypress.Chainable {
    return cy.get('#navigation-tree-save-btn');
  }

  getSweetAlertContainer(): string {
    return '.swal2-container';
  }

  getSweetAlertConfirm(): string {
    return '.swal2-confirm';
  }

  getTreeUpdateSuccessMessage(): string {
    return 'Navigation tree updated successfully.';
  }

  getNodeFormIframeSelector(): string {
    return '#navigation-node-form-iframe';
  }

  getNodeFormSubmitSelector(): string {
    return '#navigation-node-form-submit';
  }

  getNodeTypeSelectSelector(): string {
    return '#navigation_node_node_type';
  }

  getNodeIsActiveSelector(): string {
    return '#navigation_node_is_active';
  }

  getAddChildNodeButtonSelector(): string {
    return '#add-child-node-btn';
  }

  getLocalizedTitleSelector(index: number): string {
    return `[name="navigation_node[navigation_node_localized_attributes][${index}][title]"]`;
  }

  getLocalizedExternalUrlSelector(index: number): string {
    return `[name="navigation_node[navigation_node_localized_attributes][${index}][external_url]"]`;
  }

  getLocalizedCategoryUrlSelector(index: number): string {
    return `[name="navigation_node[navigation_node_localized_attributes][${index}][category_url]"]`;
  }

  getLocalizedCmsPageUrlSelector(index: number): string {
    return `[name="navigation_node[navigation_node_localized_attributes][${index}][cms_page_url]"]`;
  }

  getCreateChildNodeHeading(): string {
    return 'Create child node';
  }

  getEditNodeHeading(): string {
    return 'Edit node';
  }

  getNodeCreateSuccessPattern(): RegExp {
    return /Navigation node "[^"]*" was created successfully\./;
  }

  getNodeUpdateSuccessPattern(): RegExp {
    return /Navigation node "[^"]*" was updated successfully\./;
  }
}
