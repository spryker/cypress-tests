import { container, skipUnlessAiProviderEnabled } from '@utils';
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

    it(
      'shows the "Add to cart from image" section with an image-only file input, browse-file label and enabled Upload button',
      { tags: ['@demo-smoke'] },
      (): void => {
        quickOrderImageToCartPage.visitQuickOrder().its('response.statusCode').should('eq', 200);

        quickOrderImageToCartPage
          .getPageTitle()
          .should('be.visible')
          .and('contain.text', quickOrderImageToCartPage.getPageTitleText());
        quickOrderImageToCartPage.getImageToCartSection().should('exist');
        quickOrderImageToCartPage
          .getImageToCartTitle()
          .should('be.visible')
          .and('contain.text', quickOrderImageToCartPage.getImageToCartTitleText());

        quickOrderImageToCartPage
          .getImageUploadInput()
          .should('exist')
          .and('have.attr', 'type', 'file')
          .and('have.attr', 'name', quickOrderImageToCartPage.getImageUploadInputName())
          .and('have.attr', 'accept', quickOrderImageToCartPage.getAcceptedImageMimeTypes());

        quickOrderImageToCartPage.getBrowseFileLabel().should('be.visible');

        quickOrderImageToCartPage
          .getUploadSubmitButton()
          .should('be.visible')
          .and('not.be.disabled')
          .and('contain.text', quickOrderImageToCartPage.getUploadButtonText());
      }
    );

    it(
      'shows an attached image by name and releases the browse label input binding',
      { tags: ['@demo-smoke'] },
      (): void => {
        quickOrderImageToCartPage.visitQuickOrder();

        quickOrderImageToCartPage
          .getFileSelectLabel()
          .should('be.visible')
          .and('contain.text', quickOrderImageToCartPage.getBrowseFileText());

        quickOrderImageToCartPage.attachImage(staticFixtures.imageFilePath);

        quickOrderImageToCartPage.getImageUploadInput().should(($input) => {
          const input = $input[0] as HTMLInputElement;
          expect(input.files).to.have.length(1);
          expect(input.files?.[0].name).to.eq(staticFixtures.imageFileName);
        });

        quickOrderImageToCartPage
          .getFileSelectLabel()
          .should('contain.text', staticFixtures.imageFileName)
          .and('not.contain.text', quickOrderImageToCartPage.getBrowseFileText());

        quickOrderImageToCartPage.getBrowseFileToggleLabel().should('not.have.attr', 'for');
      }
    );

    it(
      'rejects an oversized file client-side with the too-large error and clears the input',
      { tags: ['@demo-smoke'] },
      (): void => {
        quickOrderImageToCartPage.visitQuickOrder();

        quickOrderImageToCartPage.getImageUploadInput().then(($input) => {
          const maxFileSizeInBytes = Number(
            ($input.closest('[data-qa="component quick-order-image-to-cart"]')[0] as HTMLElement).getAttribute(
              'max-file-size'
            )
          );
          expect(maxFileSizeInBytes).to.be.greaterThan(0);

          quickOrderImageToCartPage.attachSyntheticFile({
            fileName: 'oversized-probe.png',
            sizeInBytes: maxFileSizeInBytes + 1,
            mimeType: 'image/png',
          });
        });

        quickOrderImageToCartPage.getFileSelectError().should('be.visible').invoke('text').should('match', /\S/);
        quickOrderImageToCartPage.getImageUploadInput().should(($input) => {
          expect(($input[0] as HTMLInputElement).value).to.eq('');
        });
      }
    );

    it(
      'removes the attached file, restoring the "Browse file" placeholder and re-binding the browse label',
      { tags: ['@demo-smoke'] },
      (): void => {
        quickOrderImageToCartPage.visitQuickOrder();
        quickOrderImageToCartPage.attachImage(staticFixtures.imageFilePath);

        quickOrderImageToCartPage.getFileSelectLabel().should('contain.text', staticFixtures.imageFileName);
        quickOrderImageToCartPage.getRemoveFileIcon().should('be.visible');

        quickOrderImageToCartPage.removeAttachedFile();

        quickOrderImageToCartPage
          .getFileSelectLabel()
          .should('contain.text', quickOrderImageToCartPage.getBrowseFileText())
          .and('not.contain.text', staticFixtures.imageFileName);
        quickOrderImageToCartPage.getRemoveFileIcon().should('not.be.visible');
        quickOrderImageToCartPage
          .getBrowseFileToggleLabel()
          .should('have.attr', 'for', 'image_order_form_uploadImageOrder');
        quickOrderImageToCartPage.getImageUploadInput().should(($input) => {
          expect(($input[0] as HTMLInputElement).value).to.eq('');
        });
      }
    );

    it(
      'shows the "no image" validation error when Upload is pressed with no file attached',
      { tags: ['@demo-smoke'] },
      (): void => {
        quickOrderImageToCartPage.visitQuickOrder();

        quickOrderImageToCartPage.submitEmptyImageOrder().then((interception) => {
          expect(interception.request.method).to.eq('POST');
          expect(interception.request.body).to.contain('name="uploadImage"');
          expect(interception.response?.statusCode).to.eq(200);
        });

        quickOrderImageToCartPage.getImageToCartSection().should('exist');
        quickOrderImageToCartPage.getErrorDropzone().should('exist');
        quickOrderImageToCartPage.getErrorMessage().should('be.visible').invoke('text').should('match', /\S/);
      }
    );

    it(
      'rejects a non-image file server-side with the error dropzone and no recognized row',
      { tags: ['@demo-smoke'] },
      (): void => {
        quickOrderImageToCartPage
          .submitNonImageFileViaRequest({
            fileName: 'not-an-image.txt',
            contents: 'this is plain text, not an image',
            mimeType: 'text/plain',
          })
          .then((response: { status: number; body: string }) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.contain('input-dropzone--error');
            expect(response.body).to.not.contain('js-autocomplete-form__value-input" value="');
          });
      }
    );

    it(
      'submits the attached image as a multipart POST and handles the no-provider response gracefully',
      { tags: ['@demo-smoke'] },
      (): void => {
        quickOrderImageToCartPage.visitQuickOrder();
        quickOrderImageToCartPage.attachImage(staticFixtures.imageFilePath);

        quickOrderImageToCartPage.submitImageOrder().then((interception) => {
          expect(interception.request.method).to.eq('POST');
          expect(interception.request.headers['content-type']).to.contain('multipart/form-data');
          expect(interception.request.body).to.contain('name="image_order_form[uploadImageOrder]"');
          expect(interception.request.body).to.contain(staticFixtures.imageFileName);
          expect(interception.request.body).to.contain('name="uploadImage"');
          expect(interception.response?.statusCode).to.eq(200);
        });

        quickOrderImageToCartPage.getImageToCartSection().should('exist');
        quickOrderImageToCartPage.getErrorDropzone().should('exist');
        quickOrderImageToCartPage.getErrorMessage().should('be.visible').invoke('text').should('match', /\S/);
      }
    );

    describe('real provider flow (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      it(
        'submits a real image to the AI provider and re-renders the quick-order rows with the recognition result',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          quickOrderImageToCartPage.visitQuickOrder();
          quickOrderImageToCartPage.attachImage(staticFixtures.imageFilePath);

          quickOrderImageToCartPage.submitImageOrderReal().then((interception) => {
            expect(interception.response?.statusCode).to.be.within(200, 299);
          });

          quickOrderImageToCartPage.getQuickOrderRows().should('exist');
          quickOrderImageToCartPage.getRecognizedSkuInputs().should('have.length.greaterThan', 0);
        }
      );
    });
  }
);
