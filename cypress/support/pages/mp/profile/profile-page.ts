import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { MpPage } from '@pages/mp';
import { ProfileRepository } from './profile-repository';

@injectable()
@autoWired
export class ProfilePage extends MpPage {
  @inject(ProfileRepository) private repository: ProfileRepository;

  protected PAGE_URL = '/merchant-profile-merchant-portal-gui/profile';

  updatePhone = (params?: UpdatePhoneParams): void => {
    this.repository
      .getPhoneNumberInput()
      .clear()
      .type(params?.phone ?? this.faker.phone.number());

    this.repository.getProfileForm().submit();
  };

  // The tab this opens has been observed to be absent in CI while the page itself is fine, and a
  // bare not-found names neither the page nor the tabs it did render. Confirming the URL and then
  // asserting on the tab strip's own text reports both.
  openOnlineProfileTab = (): void => {
    this.assertPageLocation();

    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Reports the rendered tab labels instead of a bare not-found.
    this.repository.getProfileTabs().invoke('text').should('include', this.repository.getOnlineProfileTabLabel());

    this.repository.getOnlineProfileTab().click();
  };

  // The glossary fields repeat per locale, so every locale gets the same value and the
  // storefront renders the right one whichever locale it is read in.
  updateOnlineProfile = (params: UpdateOnlineProfileParams): void => {
    this.repository.getPublicEmailInput().clear().type(params.publicEmail);
    this.repository.getPublicPhoneInput().clear().type(params.publicPhone);

    this.repository.getLocalizedFieldsetCount().each((_element, localeIndex) => {
      this.repository.getDeliveryTimeInput(localeIndex).clear().type(params.deliveryTime);
      this.repository.getDataPrivacyTextarea(localeIndex).clear().type(params.dataPrivacy);
    });
  };

  setStoreStatus = (params: SetStoreStatusParams): void => {
    const checkbox = this.repository.getStoreStatusCheckbox();

    if (params.isOnline) {
      checkbox.check({ force: true });

      return;
    }

    checkbox.uncheck({ force: true });
  };

  save = (): void => {
    cy.intercept('POST', '**/merchant-profile-merchant-portal-gui/profile**').as('profileSaved');
    this.repository.getSaveButton().click();
    cy.wait('@profileSaved');
  };
}

interface UpdatePhoneParams {
  phone: string;
}

interface UpdateOnlineProfileParams {
  publicEmail: string;
  publicPhone: string;
  deliveryTime: string;
  dataPrivacy: string;
}

interface SetStoreStatusParams {
  isOnline: boolean;
}
