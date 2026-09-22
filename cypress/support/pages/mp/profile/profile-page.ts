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

  // The profile page has been observed to carry no tab strip at all under CI concurrency, which a
  // bare not-found cannot explain. Confirming the URL and then naming the text the page really
  // rendered says whether the browser is on a login form, an error page or the profile itself.
  openOnlineProfileTab = (): void => {
    this.assertPageLocation();

    // eslint-disable-next-line spryker-cypress/no-assertions-in-page-objects -- Reports the rendered page text instead of a bare not-found.
    this.getBody()
      .invoke('text')
      .invoke('replace', /\s+/g, ' ')
      .invoke('slice', 0, 400)
      .should('include', this.repository.getBusinessInformationTabLabel());

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
