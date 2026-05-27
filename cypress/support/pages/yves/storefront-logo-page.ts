import { autoWired } from '@utils';
import { injectable } from 'inversify';
import { YvesPage } from '@pages/yves';

/**
 * Placeholder page for verifying the storefront logo after upload.
 * Visits the storefront home page and asserts the logo image is visible.
 */
@injectable()
@autoWired
export class StorefrontLogoPage extends YvesPage {
  protected PAGE_URL = '/';

  verifyLogoIsVisible = (): void => {
    // Generic selector; adjust later if a stable data-qa selector exists in the storefront.
    cy.get('img[alt*="logo"], img[class*="logo"], header img, .logo img')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('not.be.empty');
  };
}
