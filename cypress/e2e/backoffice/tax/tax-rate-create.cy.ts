import { container } from '@utils';
import { TaxRateCreateDynamicFixtures, TaxRateCreateStaticFixtures } from '@interfaces/backoffice';
import { TaxRatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe('tax rate create', { tags: ['@backoffice', 'tax', 'spryker-core-back-office', 'spryker-core'] }, (): void => {
  const taxRatePage = container.get(TaxRatePage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: TaxRateCreateStaticFixtures;
  let dynamicFixtures: TaxRateCreateDynamicFixtures;

  // Tax rate names are made run-unique so repeated CI runs never collide on the
  // "already exists" validation. The Codeception original relied on a Propel
  // teardown to purge fixed names; Cypress has no equivalent DB access here.
  const uid = Math.random().toString(36).substring(2, 8);
  const validCountry = 'Germany';

  before((): void => {
    ({ dynamicFixtures, staticFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('should create a valid tax rate and show a success message', (): void => {
    taxRatePage.createTaxRate({
      name: `Acceptance Standard Valid ${uid}`,
      country: validCountry,
      percentage: '5',
    });

    taxRatePage.assertSuccessMessage();
  });

  it('should show error messages when creating an invalid tax rate', (): void => {
    taxRatePage.createTaxRate({
      name: '',
      country: '',
      percentage: '888',
    });

    taxRatePage.assertValidationErrors();
  });

  it('should open the tax rate list page without saving when navigating back', (): void => {
    const notCreatedName = `Acceptance Standard Not Created ${uid}`;

    taxRatePage.createTaxRateWithoutSaving({
      name: notCreatedName,
      country: validCountry,
      percentage: '5',
    });
    taxRatePage.clickListOfTaxRatesButton();

    taxRatePage.assertNoSuccessMessage();

    taxRatePage.searchTaxRateOnListPage(notCreatedName);
    taxRatePage.assertEmptyTable();
  });

  it('should show an error when recreating a tax rate that already exists', (): void => {
    const duplicateName = `Acceptance Standard Duplicate ${uid}`;
    const taxRate = { name: duplicateName, country: validCountry, percentage: '5' };

    taxRatePage.createTaxRate(taxRate);
    taxRatePage.createTaxRate(taxRate);

    taxRatePage.assertAlreadyExistsError();
  });

  it('should show an error when submitting one and the same tax rate twice in a row', (): void => {
    taxRatePage.createDuplicateTaxRate({
      name: `Acceptance Standard Same ${uid}`,
      country: validCountry,
      percentage: '5',
    });

    taxRatePage.assertAlreadyExistsError();
  });
});
