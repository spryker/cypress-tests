export interface QuickOrderImageToCartRepository {
  getEnableToggleSelector(): string;
  getSaveButtonSelector(): string;
  getPageTitleSelector(): string;
  getImageToCartSectionSelector(): string;
  getImageToCartTitleSelector(): string;
  getImageUploadInputSelector(): string;
  getBrowseFileLabelSelector(): string;
  getUploadSubmitButtonSelector(): string;
}
