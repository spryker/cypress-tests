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

    it('shows the CAPTCHA mode only while the CAPTCHA is enabled', (): void => {
      const captchaSettings = staticFixtures.captchaSettings;

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(false);

      configurationPage.getSettingRow(captchaSettings.modeKey).should('not.be.visible');

      configurationPage.setCaptchaEnabled(true);

      configurationPage.getSettingRow(captchaSettings.modeKey).should('be.visible');
    });

    it('shows the account lock and the security check limits on the Login Lock tab while the CAPTCHA is disabled', (): void => {
      const loginLockSettings = staticFixtures.loginLockSettings;

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(false);
      configurationPage.clickNavTab(loginLockSettings.tabKey);

      loginLockSettings.keys.forEach((settingKey: string): void => {
        configurationPage.getSettingRow(settingKey).should('be.visible');
      });
    });

    it('opens the Login Lock tab from the CAPTCHA mode link after asking about the unsaved changes', (): void => {
      const captchaSettings = staticFixtures.captchaSettings;
      const loginLockSettings = staticFixtures.loginLockSettings;
      const unsavedChangesConfirm = cy.stub().as('unsavedChangesConfirm').returns(true);
      cy.on('window:confirm', unsavedChangesConfirm);

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(true);

      configurationPage.getSelectedCaptchaMode().then((selectedCaptchaMode: string) => {
        configurationPage.selectCaptchaMode(
          selectedCaptchaMode === captchaSettings.modeAlways
            ? captchaSettings.modeAfterFailedAttempts
            : captchaSettings.modeAlways
        );
        configurationPage.getSettingTabLink(captchaSettings.modeKey).click();

        cy.get('@unsavedChangesConfirm').should('have.been.calledOnce');
        cy.location('search').should('contain', `tab=${loginLockSettings.tabKey}`);
        configurationPage.getSettingRow(loginLockSettings.keys[0]).should('be.visible');
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
