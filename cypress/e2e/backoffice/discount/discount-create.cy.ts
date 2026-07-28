import { container } from '@utils';
import { DiscountCreateDynamicFixtures, DiscountCreateStaticFixtures } from '@interfaces/backoffice';
import { DiscountPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('discount create', { tags: ['@backoffice', '@discount', 'discount', 'spryker-discount'] }, (): void => {
  const discountPage = container.get(DiscountPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: DiscountCreateStaticFixtures;
  let dynamicFixtures: DiscountCreateDynamicFixtures;

  // Discount names are made run-unique so repeated CI runs never collide with
  // discounts left behind by earlier runs (the Codeception original relied on a
  // Propel teardown to purge fixed names; Cypress has no equivalent DB access here).
  const uid = Math.random().toString(36).substring(2, 8);

  const validFrom = '01.01.2016 00:00';
  const validTo = `01.01.${new Date().getFullYear() + 1} 00:00`;
  // ISO-8601 day of week (1 = Monday … 7 = Sunday), matching the PHP date('N') the source used.
  const isoDayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const applyWhen = `day-of-week = '${isoDayOfWeek}'`;

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  // Skipped in source, rebuild when there is a need for. The body is complete,
  // so un-skipping is all it takes.
  it.skip('should create a valid exclusive discount and show a success message', (): void => {
    discountPage.createDiscount({
      type: 'Cart rule',
      name: `Exclusive Valid Discount ${uid}`,
      description: 'test test test',
      isExclusive: true,
      validFrom,
      validTo,
      calculatorPlugin: 'Fixed amount',
      amount: '18,36',
      applyTo: "attribute.width = '15'",
      applyWhen,
    });

    discountPage.assertSuccessMessage();
  });

  // Skipped in source, rebuild when there is a need for.
  it.skip('should create a valid non-exclusive discount and show a success message', (): void => {
    discountPage.createDiscount({
      type: 'Cart rule',
      name: `Not Exclusive Valid Discount ${uid}`,
      description: 'test test test',
      isExclusive: false,
      validFrom,
      validTo,
      calculatorPlugin: 'Fixed amount',
      amount: '18,36',
      applyTo: "attribute.width = '15'",
      applyWhen,
    });

    discountPage.assertSuccessMessage();
  });

  it('should show validation errors when creating a discount with a blank name and amount', (): void => {
    discountPage.createDiscount({
      type: 'Cart rule',
      name: '',
      validFrom,
      validTo,
      calculatorPlugin: 'Fixed amount',
      applyWhen,
    });

    discountPage.assertNoSuccessMessage();
    discountPage.assertOnCreatePage();
    discountPage.assertGeneralTabValidationError();
  });
});
