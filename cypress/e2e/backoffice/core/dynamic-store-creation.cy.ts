import { container } from '@utils';
import { CatalogPage, CmsContentPage, HomePage, LoginPage, ProductPage } from '@pages/yves';
import { DynamicStoreCreationDynamicFixtures, DynamicStoreCreationStaticFixtures } from '@interfaces/backoffice';
import {
  AssignStoreToDefaultWarehouseScenario,
  AssignStoreToProductScenario,
  CreateCmsPageScenario,
  CreateStoreScenario,
  EnableCmsBlockForAllStoresScenario,
  UserLoginScenario,
} from '@scenarios/backoffice';
import { SelectStoreScenario } from '@scenarios/yves';

describe(
  'dynamic store creation',
  {
    tags: [
      '@backoffice',
      '@core',
      '@dms',
      'spryker-core-back-office',
      'spryker-core',
      'customer-account-management',
      'cms',
      'content-item',
      'catalog',
      'search',
      'product',
      'prices',
    ],
  },
  (): void => {
    if (!Cypress.env('isDynamicStoreEnabled')) {
      it.skip('skipped due to disabled dynamic store feature', () => {});

      return;
    }

    const homePage = container.get(HomePage);
    const loginPage = container.get(LoginPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const cmsContentPage = container.get(CmsContentPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const createStoreScenario = container.get(CreateStoreScenario);
    const selectStoreScenario = container.get(SelectStoreScenario);
    const createCmsPageScenario = container.get(CreateCmsPageScenario);
    const assignStoreToProductScenario = container.get(AssignStoreToProductScenario);
    const enableCmsBlockForAllStoresScenario = container.get(EnableCmsBlockForAllStoresScenario);
    const assignStoreToDefaultWarehouseScenario = container.get(AssignStoreToDefaultWarehouseScenario);

    let staticFixtures: DynamicStoreCreationStaticFixtures;
    let dynamicFixtures: DynamicStoreCreationDynamicFixtures;

    let cmsPageName: string;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      // The page name goes verbatim into every localized url and the server rejects a duplicate,
      // so it has to be unique per run.
      cmsPageName = `${staticFixtures.cmsPageName}-${Math.random().toString(36).substring(2, 8)}`;

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      createStoreScenario.execute({ store: staticFixtures.store, shouldTriggerPublishAndSync: true });

      // A store with no warehouse sells nothing, so the product would read as unavailable there
      // however well it is priced.
      assignStoreToDefaultWarehouseScenario.execute({
        storeName: staticFixtures.store.name,
        shouldTriggerPublishAndSync: true,
      });

      assignStoreToProductScenario.execute({
        abstractProductSku: dynamicFixtures.product.abstract_sku,
        storeName: staticFixtures.store.name,
        bulkProductPrice: staticFixtures.productPrice,
        shouldTriggerPublishAndSync: true,
      });

      createCmsPageScenario.execute({ cmsPageName: cmsPageName, shouldTriggerPublishAndSync: true });

      // Registration renders the double-opt-in blocks, and a store they are not enabled for
      // fails the submit rather than the mail.
      staticFixtures.registrationCmsBlockNames.forEach((cmsBlockName: string): void => {
        enableCmsBlockForAllStoresScenario.execute({
          cmsBlockName: cmsBlockName,
          storeName: staticFixtures.store.name,
          shouldTriggerPublishAndSync: true,
        });
      });
    });

    it('given a store is created in the back office when a shopper opens the storefront then the store switcher offers it', (): void => {
      // Act
      homePage.visit();
      homePage.waitTillStoreAvailable(staticFixtures.store.name);

      // Assert
      homePage.getStoreSelectorOption(staticFixtures.store.name).should('exist');
    });

    it('given a product is assigned to a newly created store when a shopper opens its detail page on that store then the product is offered there', (): void => {
      // Arrange
      selectStoreScenario.execute(staticFixtures.store.name);

      // Act
      catalogPage.searchForProducts({ query: dynamicFixtures.product.abstract_sku });
      catalogPage.openProductDetailPageFromResults({
        productName: dynamicFixtures.product.localized_attributes[0].name,
      });

      // Assert
      productPage.getProductConfigurator().should('contain', dynamicFixtures.product.sku);

      if (!productPage.isRepository('b2b', 'b2b-mp')) {
        productPage.getProductConfigurator().should('contain', staticFixtures.productPrice);
      }
    });

    it('given a cms page is published when a shopper opens it on a newly created store then the page is served', (): void => {
      // Arrange
      selectStoreScenario.execute(staticFixtures.store.name);

      // Act
      cy.url().then((storeHomeUrl: string) => {
        cmsContentPage.visitCmsPageUrl(`${storeHomeUrl.replace(/\/$/, '')}/${cmsPageName}`);
      });

      // Assert
      cmsContentPage.assertBodyContainsText(cmsPageName).should('exist');
    });

    it('given the registration content blocks are enabled for a newly created store when a guest registers there then the registration completes', (): void => {
      // Arrange
      selectStoreScenario.execute(staticFixtures.store.name);

      // Act
      loginPage.visit();
      loginPage.register();

      // Assert
      loginPage.assertBodyContainsText(loginPage.getRegistrationCompletedMessage()).should('exist');
    });
  }
);
