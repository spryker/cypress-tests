import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { QuickOrderImageToCartPage } from '@pages/yves';
import { QuickAddByImageDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "Quick Add by Image" feature (storefront / Yves).
 *
 * Scope: confirm the image-to-cart control injected into the Quick Order page (`/quick-order`) by
 * `AiCommerceQuickOrderImageToCartFormPlugin` renders for a logged-in B2B customer — the page loads
 * (HTTP 200, no 500/crash), the `quick-order-image-to-cart` custom element + "Add to cart from image"
 * section are visible, and the upload control (file input `uploadImageOrder`, browse-file label,
 * `uploadImage` submit button) is present and clickable.
 *
 * DYNAMIC ENABLE (no hardcode): the control is toggle-gated. It renders only when
 * `AiCommerceConfig::isQuickOrderImageToCartEnabled()` returns true, which reads the dynamic config
 * key `ai_commerce:quick_order:visual_add_to_cart:enabled` (default OFF) through the Configuration
 * client. On Yves this value is resolved from Redis P&S storage (`kv:configuration:global`), NOT the
 * database. The project no longer force-enables it in `Pyz\Yves\AiCommerce\AiCommerceConfig` (the
 * previous `return true;` override was removed), so the spec must self-provision the enable: it turns
 * the Back Office Configuration toggle ON and runs the Publish & Synchronize commands to push the
 * value into Yves' Redis. This matches the Search by Image spec's storefront-read toggle mechanism —
 * see `enableQuickAddByImage` for the full rationale and the exact P&S step.
 *
 * The enable is performed once in `before` and is idempotent/state-based (it only re-saves when the
 * toggle is currently off). Behind the submit, an uploaded image runs through AI product recognition
 * (`ProductImageRecognizer`) — a real AI provider call — so NO image is uploaded and NO recognition
 * is triggered: presence/visibility/clickability only. Static fixtures only — no dynamic fixtures.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'quick add by image',
  {
    tags: ['@demo', '@quick-add-by-image', 'ai-commerce'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the Quick Add by Image demo feature ships only in b2b-mp', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const quickOrderImageToCartPage = container.get(QuickOrderImageToCartPage);

    let staticFixtures: QuickAddByImageDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

      // Dynamic precondition (no hardcode): authenticate as a Back Office user, then enable the
      // storefront toggle through the Configuration UI and Publish & Synchronize it into Yves Redis.
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      quickOrderImageToCartPage.enableQuickAddByImage();
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('loads the Quick Order page (HTTP 200) and renders the image-to-cart section', (): void => {
      quickOrderImageToCartPage.visitQuickOrder().its('response.statusCode').should('eq', 200);

      quickOrderImageToCartPage.getPageTitle().should('be.visible').and('contain.text', 'Quick Order');

      quickOrderImageToCartPage.getImageToCartSection().should('exist');
      quickOrderImageToCartPage
        .getImageToCartTitle()
        .should('be.visible')
        .and('contain.text', 'Add to cart from image');
    });

    it('renders the image upload control, browse-file label and Upload submit button as clickable', (): void => {
      quickOrderImageToCartPage.visitQuickOrder();

      quickOrderImageToCartPage
        .getImageUploadInput()
        .should('exist')
        .and('have.attr', 'type', 'file')
        .and('have.attr', 'name', 'image_order_form[uploadImageOrder]')
        .and('have.attr', 'accept', 'image/jpeg,image/jpg,image/png');

      quickOrderImageToCartPage
        .getBrowseFileLabel()
        .should('be.visible')
        .and('have.attr', 'for', 'image_order_form_uploadImageOrder');

      quickOrderImageToCartPage
        .getUploadSubmitButton()
        .should('be.visible')
        .and('not.be.disabled')
        .and('contain.text', 'Upload');
    });
  }
);
