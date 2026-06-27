import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { QuickOrderImageToCartPage } from '@pages/yves';
import { QuickAddByImageDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Quick Add by Image - storefront Quick Order image-to-cart',
  {
    tags: ['@demo', '@quick-add-by-image', '@ai-commerce'],
  },
  (): void => {
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const quickOrderImageToCartPage = container.get(QuickOrderImageToCartPage);

    let staticFixtures: QuickAddByImageDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

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

    it('Quick Order page opens (HTTP 200) and shows the "Add to cart from image" section', (): void => {
      quickOrderImageToCartPage.visitQuickOrder().its('response.statusCode').should('eq', 200);

      quickOrderImageToCartPage.getPageTitle().should('be.visible').and('contain.text', 'Quick Order');

      quickOrderImageToCartPage.getImageToCartSection().should('exist');
      quickOrderImageToCartPage
        .getImageToCartTitle()
        .should('be.visible')
        .and('contain.text', 'Add to cart from image');
    });

    it('image-to-cart control shows an image-only file input, a browse-file label and an enabled Upload button', (): void => {
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
