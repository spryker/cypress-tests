import { container } from '@utils';
import { DiscountListDynamicFixtures, DiscountListStaticFixtures } from '@interfaces/backoffice';
import { DiscountPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('discount list', { tags: ['@backoffice', '@discount', 'discount', 'spryker-discount'] }, (): void => {
  const discountPage = container.get(DiscountPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: DiscountListStaticFixtures;
  let dynamicFixtures: DiscountListDynamicFixtures;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should show a discount with its actions in the list and open its edit page', (): void => {
    const discountName = dynamicFixtures.discount.display_name;

    discountPage.assertDiscountVisibleWithActions(discountName);
    discountPage.openEditPageFromList(discountName, dynamicFixtures.discount.id_discount);
  });

  it('should open the discount view page from the list', (): void => {
    const discountName = dynamicFixtures.discount.display_name;

    discountPage.openViewPageFromList(discountName, dynamicFixtures.discount.id_discount);
  });

  it('should show the discount data table on the list page', (): void => {
    discountPage.assertListTableIsShown();
  });
});
