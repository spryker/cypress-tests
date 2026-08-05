import { inject, injectable } from 'inversify';
import { REPOSITORIES, autoWired } from '@utils';
import { YvesPage } from '../yves-page';
import { MerchantRegistrationRepository } from './merchant-registration-repository';

export interface MerchantRegistrationData {
  companyName: string;
  country: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  registrationNumber: string;
  contactPerson: {
    title: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone?: string;
  };
}

export type PartialMerchantRegistrationData = Partial<Omit<MerchantRegistrationData, 'contactPerson'>> & {
  contactPerson?: Partial<MerchantRegistrationData['contactPerson']>;
};

export interface RegisteredMerchant {
  email: string;
  companyName: string;
}

@injectable()
@autoWired
export class MerchantRegistrationPage extends YvesPage {
  @inject(REPOSITORIES.MerchantRegistrationRepository) private repository: MerchantRegistrationRepository;

  protected PAGE_URL = '/merchant-registration-request';
  protected DEFAULT_TITLE = 'Mr';
  protected DEFAULT_COUNTRY = 'Germany';

  // Selectors for non-form elements
  private readonly pageTitle = '.title--h3';
  private readonly companySection = '[data-qa="component merchant-registration-request-subform"]:first';
  private readonly accountSection = '[data-qa="component merchant-registration-request-subform"]:last';
  private readonly successMessage = '[data-qa="component flash-message"].flash-message--success';
  private readonly validationError = '.input--error, .checkbox--error';
  private readonly footerLink = 'footer a[href*="/merchant-registration-request"]';

  register = (params?: PartialMerchantRegistrationData): RegisteredMerchant => {
    const companyName = params?.companyName ?? this.faker.company.name();
    const email = params?.contactPerson?.email ?? this.faker.internet.email();

    const registrationData: MerchantRegistrationData = {
      companyName: companyName,
      country: params?.country ?? this.DEFAULT_COUNTRY,
      street: params?.street ?? this.faker.location.street(),
      houseNumber: params?.houseNumber ?? this.faker.location.buildingNumber(),
      zipCode: params?.zipCode ?? this.faker.location.zipCode('#####'),
      city: params?.city ?? this.faker.location.city(),
      registrationNumber: params?.registrationNumber ?? this.faker.string.alphanumeric({ length: 10, casing: 'upper' }),
      contactPerson: {
        title: params?.contactPerson?.title ?? this.DEFAULT_TITLE,
        firstName: params?.contactPerson?.firstName ?? this.faker.person.firstName(),
        lastName: params?.contactPerson?.lastName ?? this.faker.person.lastName(),
        role: params?.contactPerson?.role ?? this.faker.person.jobTitle(),
        email: email,
        phone: params?.contactPerson?.phone,
      },
    };

    this.fillAndSubmitRegistration(registrationData);

    return { email, companyName };
  };

  fillFormWithoutTerms = (): void => {
    const registrationData: MerchantRegistrationData = {
      companyName: this.faker.company.name(),
      country: this.DEFAULT_COUNTRY,
      street: this.faker.location.street(),
      houseNumber: this.faker.location.buildingNumber(),
      zipCode: this.faker.location.zipCode('#####'),
      city: this.faker.location.city(),
      registrationNumber: this.faker.string.alphanumeric({ length: 10, casing: 'upper' }),
      contactPerson: {
        title: this.DEFAULT_TITLE,
        firstName: this.faker.person.firstName(),
        lastName: this.faker.person.lastName(),
        role: this.faker.person.jobTitle(),
        email: this.faker.internet.email(),
      },
    };

    this.fillAndSubmitRegistration(registrationData, false);
  };

  getTitle = (): Cypress.Chainable => cy.get(this.pageTitle);

  getCompanySection = (): Cypress.Chainable => cy.get(this.companySection);

  getAccountSection = (): Cypress.Chainable => cy.get(this.accountSection);

  getSuccessMessage = (): Cypress.Chainable => cy.get(this.successMessage, { timeout: 10000 });

  getErrorFlashMessage = (options?: Partial<Cypress.Timeoutable>): Cypress.Chainable =>
    cy.get('[data-qa="component flash-message"]', options).filter('.flash-message--error, .flash-message--alert');

  getValidationErrors = (): Cypress.Chainable => cy.get(this.validationError);

  fillCompanyInformation(data: Partial<MerchantRegistrationData>): void {
    if (data.companyName) {
      this.repository.getCompanyNameInput().clear().type(data.companyName);
    }
    if (data.country) {
      this.repository.selectCountry(data.country);
    }
    if (data.street) {
      this.repository.getStreetInput().clear().type(data.street);
    }
    if (data.houseNumber) {
      this.repository.getHouseNumberInput().clear().type(data.houseNumber);
    }
    if (data.zipCode) {
      this.repository.getZipCodeInput().clear().type(data.zipCode);
    }
    if (data.city) {
      this.repository.getCityInput().clear().type(data.city);
    }
    if (data.registrationNumber) {
      this.repository.getRegistrationNumberInput().clear().type(data.registrationNumber);
    }
  }

  fillContactPersonInformation(contactPerson: Partial<MerchantRegistrationData['contactPerson']>): void {
    if (contactPerson.title) {
      this.repository.selectTitle(contactPerson.title);
    }
    if (contactPerson.firstName) {
      this.repository.getFirstNameInput().clear().type(contactPerson.firstName);
    }
    if (contactPerson.lastName) {
      this.repository.getLastNameInput().clear().type(contactPerson.lastName);
    }
    if (contactPerson.role) {
      this.repository.getRoleInput().clear().type(contactPerson.role);
    }
    if (contactPerson.email) {
      this.repository.getEmailInput().clear().type(contactPerson.email);
    }
    if (contactPerson.phone) {
      this.repository.getPhoneInput().clear().type(contactPerson.phone);
    }
  }

  acceptTerms(): void {
    this.repository.getAcceptTermsCheckbox().check({ force: true });
  }

  submitForm(): void {
    this.repository.getSubmitButton().click();
  }

  fillAndSubmitRegistration(data: MerchantRegistrationData, acceptTerms = true): void {
    this.fillCompanyInformation(data);
    this.fillContactPersonInformation(data.contactPerson);
    if (acceptTerms) {
      this.acceptTerms();
    }
    this.submitForm();
  }

  getFooterLink(): Cypress.Chainable {
    return cy.get(this.footerLink);
  }

  clickFooterLink(): void {
    this.getFooterLink().click();
  }
}
