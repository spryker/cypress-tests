import { container } from '@utils';
import { IndexPage } from '@pages/backoffice';
import {
  UserMfaAuthDynamicFixtures,
  UserMfaAuthStaticFixtures,
} from '../../../support/types/backoffice/multi-factor-authentication';
import {
  UserLoginScenario,
  UserMfaActivationScenario,
  UserLogoutScenario,
  UserMfaLoginScenario,
} from '@scenarios/backoffice';
import { retryableBefore } from '../../../support/e2e';

describe(
  'user mfa auth',
  {
    tags: [
      '@backoffice',
      '@user-account-management',
      'spryker-core-back-office',
      'spryker-core-back-office',
      'spryker-core',
      'acl',
    ],
  },
  (): void => {
    const backofficeIndexPage = container.get(IndexPage);
    const mfaActivationScenario = container.get(UserMfaActivationScenario);
    const mfaLoginScenario = container.get(UserMfaLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const userLogoutScenario = container.get(UserLogoutScenario);

    let dynamicFixtures: UserMfaAuthDynamicFixtures;
    let staticFixtures: UserMfaAuthStaticFixtures;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      cy.cleanUpUserMultiFactorAuth();
      cy.cleanUpCustomerMultiFactorAuth();
    });

    it('should verify successful MFA activation and subsequent authenticated login', (): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      mfaActivationScenario.execute(dynamicFixtures.rootUserOne.username);

      userLogoutScenario.execute();
      mfaLoginScenario.execute({
        username: dynamicFixtures.rootUserOne.username,
        password: staticFixtures.defaultPassword,
      });

      backofficeIndexPage.assertPageLocation();
    });
  }
);
