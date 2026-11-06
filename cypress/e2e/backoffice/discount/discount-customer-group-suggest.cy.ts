import { container } from '@utils';
import {
  DiscountCustomerGroupSuggestDynamicFixtures,
  DiscountCustomerGroupSuggestStaticFixtures,
} from '@interfaces/backoffice';
import { DiscountPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'discount customer group suggest',
  { tags: ['@backoffice', '@discount', 'discount', 'spryker-discount'] },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});
      return;
    }

    const discountPage = container.get(DiscountPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: DiscountCustomerGroupSuggestStaticFixtures;
    let dynamicFixtures: DiscountCustomerGroupSuggestDynamicFixtures;

    const uid = Math.random().toString(36).substring(2, 8);

    const discountData = {
      type: 'Cart rule',
      description: 'customer group suggest',
      isExclusive: false,
      validFrom: '01.01.2016 00:00',
      validTo: `01.01.${new Date().getFullYear() + 1} 00:00`,
      calculatorPlugin: 'Fixed amount',
      amount: '1,00',
      applyTo: "sku = 'ANY-SKU'",
    };

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should store the customer group picked from the suggestions', (): void => {
      const customerGroupName = dynamicFixtures.customerGroup.name;

      discountPage.createDiscountWithSuggestedConditionValue(
        { ...discountData, name: `Customer Group Suggest ${uid}` },
        {
          field: 'customer-group',
          suggestUrl: '/customer-group/suggest',
          searchTerm: customerGroupName.substring(0, 5),
          value: customerGroupName,
        }
      );

      discountPage.getSuccessMessage().should('be.visible');
      discountPage
        .getDecisionRuleQueryString()
        .should('match', new RegExp(`^customer-group = '${customerGroupName}'$`, 'i'));
    });

    it('should show an error when a stored condition names customer groups that do not exist', (): void => {
      const missingCustomerGroupNames = ['cypress-missing-customer-group-a', 'cypress-missing-customer-group-b'];

      discountPage.visitEdit(dynamicFixtures.discountWithMissingCustomerGroups.id_discount);

      discountPage.getDecisionRuleOperators().should('deep.equal', ['in']);
      discountPage.getDecisionRuleSelectedValues().should('deep.equal', missingCustomerGroupNames);

      discountPage.submitWithoutChanges();

      discountPage.getUnknownConditionValueError('customer-group', missingCustomerGroupNames).should('exist');
      discountPage.getUpdateSuccessMessage().should('not.exist');
    });

    it('should show an error when a new condition names a customer group that does not exist', (): void => {
      const customerGroupName = dynamicFixtures.customerGroup.name;
      const missingCustomerGroupName = `missing-group-${uid}`;

      discountPage.createDiscount({
        ...discountData,
        name: `Customer Group Missing ${uid}`,
        applyWhen: `customer-group is in '${customerGroupName};${missingCustomerGroupName}'`,
      });

      discountPage.getUnknownConditionValueError('customer-group', [missingCustomerGroupName]).should('exist');
      discountPage.getSuccessMessage().should('not.exist');
    });
  }
);
