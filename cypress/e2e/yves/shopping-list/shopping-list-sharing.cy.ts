import { container } from '@utils';
import { CartPage, CatalogPage, ShoppingListPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { ShoppingListSharingDynamicFixtures, ShoppingListSharingStaticFixtures } from '@interfaces/yves';

describe(
  'shopping list sharing',
  {
    tags: ['@yves', '@shopping-list', 'shopping-lists', 'cart', 'spryker-core'],
  },
  (): void => {
    if (!['suite', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('runs only where customers act as company users', (): void => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const shoppingListPage = container.get(ShoppingListPage);
    const cartPage = container.get(CartPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: ShoppingListSharingDynamicFixtures;
    let staticFixtures: ShoppingListSharingStaticFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a shopping list shared with a colleague at full access when the colleague opens it then it is on their overview and its products reach their cart', (): void => {
      // Arrange
      const ownerName = `${dynamicFixtures.ownerCustomer.first_name} ${dynamicFixtures.ownerCustomer.last_name}`;
      const receiverName = `${dynamicFixtures.receiverCustomer.first_name} ${dynamicFixtures.receiverCustomer.last_name}`;

      customerLoginScenario.execute({
        email: dynamicFixtures.ownerCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      shoppingListPage.visit();
      const shoppingListName = shoppingListPage.createShoppingList();

      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      shoppingListPage.addDisplayedProductToShoppingList(shoppingListName);

      // Act
      shoppingListPage.visit();
      shoppingListPage.openShoppingList(shoppingListName);
      shoppingListPage.openSharePage();
      shoppingListPage.shareWithCompanyUser({ name: receiverName, accessLevel: staticFixtures.fullAccessText });

      // Assert
      customerLoginScenario.execute({
        email: dynamicFixtures.receiverCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      shoppingListPage.visit();

      // What the colleague's own overview has to say about a list somebody else owns.
      [ownerName, staticFixtures.fullAccessText].forEach((expectedText): void => {
        shoppingListPage.getShoppingListOverviewRow(shoppingListName).should('contain.text', expectedText);
      });

      shoppingListPage.openShoppingList(shoppingListName);
      shoppingListPage
        .getShoppingListItemsTable()
        .should('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant.name}`);

      // Full access is only real if the colleague can act on the list, not merely read it.
      shoppingListPage.addAllAvailableProductsToCart();
      cartPage.visit();
      cartPage
        .getProductCartItems()
        .should('contain.text', `${staticFixtures.soldByText} ${dynamicFixtures.merchant.name}`);
    });
  }
);
