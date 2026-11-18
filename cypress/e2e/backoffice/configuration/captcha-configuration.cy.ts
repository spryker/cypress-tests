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

    it('asks about the unsaved CAPTCHA mode before the Login Lock link leaves the page, saves the mode, and then opens the Login Lock tab from the link', (): void => {
      const captchaSettings = staticFixtures.captchaSettings;
      const loginLockSettings = staticFixtures.loginLockSettings;
      const unsavedChangesConfirm = cy.stub().returns(false);

      configurationPage.visitCaptchaTab();
      configurationPage.setCaptchaEnabled(false);
      configurationPage.setCaptchaEnabled(true);

      cy.wrap(null).then((): void => {
        cy.on('window:confirm', unsavedChangesConfirm);
      });
      configurationPage.getSettingTabLink(captchaSettings.modeKey).click();

      cy.wrap(unsavedChangesConfirm).should('have.been.calledOnce');
      cy.location('search').should('not.contain', `tab=${loginLockSettings.tabKey}`);
      configurationPage.getSettingRow(captchaSettings.modeKey).should('be.visible');

      configurationPage.stubConfigurationSave();
      configurationPage.interceptConfigurationPageLoad();
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
      configurationPage.waitForConfigurationPageLoad();
      configurationPage.getSettingTabLink(captchaSettings.modeKey).click();

      cy.wrap(unsavedChangesConfirm).should('have.been.calledOnce');
      cy.location('search').should('contain', `tab=${loginLockSettings.tabKey}`);
      configurationPage.getSettingRow(loginLockSettings.settingKey).should('be.visible');
    });
  }
);
