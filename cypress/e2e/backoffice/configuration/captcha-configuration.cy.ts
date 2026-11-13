import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import { CaptchaConfigurationDynamicFixtures, CaptchaConfigurationStaticFixtures } from '@interfaces/backoffice';

describe(
  'Configuration - CAPTCHA',
  {
    tags: ['@backoffice', '@configuration', 'configuration', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the CAPTCHA settings are installed only in suite', () => {});

      return;
    }

    const configurationPage = container.get(ConfigurationPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CaptchaConfigurationStaticFixtures;
    let dynamicFixtures: CaptchaConfigurationDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('hides the CAPTCHA mode and the failed attempt limits while the CAPTCHA is disabled', (): void => {
      const captchaSettings = staticFixtures.captchaSettings;

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(false);

      configurationPage.getSettingRow(captchaSettings.modeKey).should('not.be.visible');
      captchaSettings.limitKeys.forEach((limitKey: string): void => {
        configurationPage.getSettingRow(limitKey).should('not.be.visible');
      });
    });

    it('shows the failed attempt limits only in the After Failed Attempts mode of an enabled CAPTCHA', (): void => {
      const captchaSettings = staticFixtures.captchaSettings;

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(true);
      configurationPage.selectCaptchaMode(captchaSettings.modeAfterFailedAttempts);

      configurationPage.getSettingRow(captchaSettings.modeKey).should('be.visible');
      captchaSettings.limitKeys.forEach((limitKey: string): void => {
        configurationPage.getSettingRow(limitKey).should('be.visible');
      });

      configurationPage.selectCaptchaMode(captchaSettings.modeAlways);

      captchaSettings.limitKeys.forEach((limitKey: string): void => {
        configurationPage.getSettingRow(limitKey).should('not.be.visible');
      });
    });

    it('shows the account lock settings while the CAPTCHA is disabled', (): void => {
      const loginLockSettings = staticFixtures.loginLockSettings;

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(false);
      configurationPage.clickNavTab(loginLockSettings.tabKey);

      loginLockSettings.keys.forEach((settingKey: string): void => {
        configurationPage.getSettingRow(settingKey).should('be.visible');
      });
    });

    it('saves the CAPTCHA mode selected on the page when the CAPTCHA is enabled', (): void => {
      const captchaSettings = staticFixtures.captchaSettings;

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(false);
      configurationPage.setCaptchaEnabled(true);
      configurationPage.stubConfigurationSave();

      configurationPage.getSelectedCaptchaMode().then((selectedCaptchaMode: string) => {
        configurationPage.saveConfiguration();

        configurationPage
          .waitForConfigurationSave()
          .its('request.body.changes')
          .then((changes: Array<{ key: string; value: string }>) => {
            const modeChange = changes.find((change) => change.key === captchaSettings.modeKey);

            expect(modeChange?.value).to.equal(selectedCaptchaMode);
          });
      });
    });
  }
);
