export interface NavigationTreeRepository {
  // Navigation element CRUD (main Zed pages)
  getNavigationCreateUrl(): string;
  getNavigationListUrl(): string;
  getNavigationUpdateUrl(idNavigation: number): string;
  getNavigationDeleteUrl(idNavigation: number): string;
  getNameInput(): Cypress.Chainable;
  getKeyInput(): Cypress.Chainable;
  getIsActiveCheckbox(): Cypress.Chainable;
  getNavigationSaveButton(): Cypress.Chainable;
  getDeleteSubmitButton(): Cypress.Chainable;
  getSuccessAlert(): Cypress.Chainable;
  getListTableRows(): Cypress.Chainable;
  getCreateSuccessPattern(): RegExp;
  getUpdateSuccessPattern(): RegExp;
  getDeleteSuccessPattern(): RegExp;

  // Navigation table (drives the jstree load)
  getNavigationTableSelector(): string;
  getTableSearchInput(): Cypress.Chainable;
  getTableRowByText(text: string): Cypress.Chainable;

  // jstree navigation tree (main page)
  getTreeSelector(): string;
  getTreeNodeSelector(): string;
  getRootNodeAnchorSelector(): string;
  getNodeAnchorSelector(idNavigationNode: number): string;
  getNodeSelector(idNavigationNode: number): string;
  getTreeSaveButton(): Cypress.Chainable;

  // Save-order confirmation (SweetAlert)
  getSweetAlertContainer(): string;
  getSweetAlertConfirm(): string;
  getTreeUpdateSuccessMessage(): string;

  // Node form (inside the #navigation-node-form-iframe)
  getNodeFormIframeSelector(): string;
  getNodeFormSubmitSelector(): string;
  getNodeTypeSelectSelector(): string;
  getNodeIsActiveSelector(): string;
  getAddChildNodeButtonSelector(): string;
  getLocalizedTitleSelector(index: number): string;
  getLocalizedExternalUrlSelector(index: number): string;
  getLocalizedCategoryUrlSelector(index: number): string;
  getLocalizedCmsPageUrlSelector(index: number): string;
  getCreateChildNodeHeading(): string;
  getEditNodeHeading(): string;
  getNodeCreateSuccessPattern(): RegExp;
  getNodeUpdateSuccessPattern(): RegExp;
}
