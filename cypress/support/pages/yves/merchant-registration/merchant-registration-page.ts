import { injectable } from 'inversify';
import { autoWired } from '@utils';
import { YvesPage } from '../yves-page';

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
  protected PAGE_URL = '/merchant-registration-request';
  protected DEFAULT_TITLE = 'Mr';
  protected DEFAULT_COUNTRY = 'Germany';

  // Selectors
  private readonly pageTitle = '.title--h3';
  private readonly companySection = '[data-qa="component merchant-registration-request-subform"]:first';
  private readonly accountSection = '[data-qa="component merchant-registration-request-subform"]:last';

  // Company fields
  private readonly companyNameInput = 'input[name="MerchantRegistrationRequestForm[company_name]"]';
  private readonly countrySelect = 'select[name="MerchantRegistrationRequestForm[iso2_code]"]';
  private readonly streetInput = 'input[name="MerchantRegistrationRequestForm[address1]"]';
  private readonly houseNumberInput = 'input[name="MerchantRegistrationRequestForm[address2]"]';
  private readonly zipCodeInput = 'input[name="MerchantRegistrationRequestForm[zip_code]"]';
  private readonly cityInput = 'input[name="MerchantRegistrationRequestForm[city]"]';
  private readonly registrationNumberInput = 'input[name="MerchantRegistrationRequestForm[registration_number]"]';

  // Contact person fields
  private readonly titleInput = 'select[name="MerchantRegistrationRequestForm[contact_person_title]"]';
  private readonly firstNameInput = 'input[name="MerchantRegistrationRequestForm[contact_person_first_name]"]';
  private readonly lastNameInput = 'input[name="MerchantRegistrationRequestForm[contact_person_last_name]"]';
  private readonly roleInput = 'input[name="MerchantRegistrationRequestForm[contact_person_role]"]';
  private readonly emailInput = 'input[name="MerchantRegistrationRequestForm[email]"]';
  private readonly phoneInput = 'input[name="MerchantRegistrationRequestForm[contact_person_phone]"]';
  private readonly acceptTermsCheckbox = 'input[type="checkbox"][name="MerchantRegistrationRequestForm[accept_terms]"]';

  // Buttons and messages
  private readonly submitButton = 'button.button--wider';
  private readonly successMessage = '[data-qa="component flash-message"].flash-message--success';
  private readonly errorMessage = '[data-qa="component flash-message"].flash-message--error';
  private readonly validationError = '.input--error, .checkbox--error';
  private readonly footerLink = 'footer a[href*="/merchant-registration-request"]';

  assertPageLoaded(): void {
    cy.url().should('include', this.PAGE_URL);
    cy.get(this.pageTitle).should('be.visible');
  }

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

  assertPageTitle(expectedTitle: string): void {
    cy.get(this.pageTitle).should('contain.text', expectedTitle);
  }

  assertCompanySectionVisible(): void {
    cy.get(this.companySection).should('be.visible');
  }

  assertAccountSectionVisible(): void {
    cy.get(this.accountSection).should('be.visible');
  }

  fillCompanyInformation(data: Partial<MerchantRegistrationData>): void {
    if (data.companyName) {
      cy.get(this.companyNameInput).clear();
      cy.get(this.companyNameInput).type(data.companyName);
    }
    if (data.country) {
      cy.get(this.countrySelect).select(data.country);
    }
    if (data.street) {
      cy.get(this.streetInput).clear();
      cy.get(this.streetInput).type(data.street);
    }
    if (data.houseNumber) {
      cy.get(this.houseNumberInput).clear();
      cy.get(this.houseNumberInput).type(data.houseNumber);
    }
    if (data.zipCode) {
      cy.get(this.zipCodeInput).clear();
      cy.get(this.zipCodeInput).type(data.zipCode);
    }
    if (data.city) {
      cy.get(this.cityInput).clear();
      cy.get(this.cityInput).type(data.city);
    }
    if (data.registrationNumber) {
      cy.get(this.registrationNumberInput).clear();
      cy.get(this.registrationNumberInput).type(data.registrationNumber);
    }
  }

  fillContactPersonInformation(contactPerson: Partial<MerchantRegistrationData['contactPerson']>): void {
    if (contactPerson.title) {
      const title = contactPerson.title;
      cy.get(this.titleInput).then(($el) => {
        if ($el.is('select')) {
          cy.wrap($el).select(title);
        } else {
          cy.wrap($el).clear();
          cy.wrap($el).type(title);
        }
      });
    }
    if (contactPerson.firstName) {
      cy.get(this.firstNameInput).clear();
      cy.get(this.firstNameInput).type(contactPerson.firstName);
    }
    if (contactPerson.lastName) {
      cy.get(this.lastNameInput).clear();
      cy.get(this.lastNameInput).type(contactPerson.lastName);
    }
    if (contactPerson.role) {
      cy.get(this.roleInput).clear();
      cy.get(this.roleInput).type(contactPerson.role);
    }
    if (contactPerson.email) {
      cy.get(this.emailInput).clear();
      cy.get(this.emailInput).type(contactPerson.email);
    }
    if (contactPerson.phone) {
      cy.get(this.phoneInput).clear();
      cy.get(this.phoneInput).type(contactPerson.phone);
    }
  }

  acceptTerms(): void {
    cy.get(this.acceptTermsCheckbox).check({ force: true });
  }

  submitForm(): void {
    cy.get(this.submitButton).click();
  }

  fillAndSubmitRegistration(data: MerchantRegistrationData, acceptTerms = true): void {
    this.fillCompanyInformation(data);
    this.fillContactPersonInformation(data.contactPerson);
    if (acceptTerms) {
      this.acceptTerms();
    }
    this.submitForm();
  }

  assertSuccessMessage(expectedMessage?: string): void {
    cy.get(this.successMessage, { timeout: 10000 }).should('be.visible');
    if (expectedMessage) {
      cy.get(this.successMessage).should('contain.text', expectedMessage);
    }
  }

  assertErrorMessage(expectedMessage?: string): void {
    cy.get('[data-qa="component flash-message"]', { timeout: 10000 })
      .filter('.flash-message--error, .flash-message--alert')
      .should('exist')
      .and('be.visible');

    if (expectedMessage) {
      cy.get('[data-qa="component flash-message"]')
        .filter('.flash-message--error, .flash-message--alert')
        .should('contain.text', expectedMessage);
    }
  }

  assertValidationErrors(): void {
    cy.get(this.validationError).should('have.length.greaterThan', 0);
  }

  assertFormNotSubmitted(): void {
    cy.url().should('include', this.PAGE_URL);
  }

  getFooterLink(): Cypress.Chainable {
    return cy.get(this.footerLink);
  }

  assertFooterLinkExists(linkText: string): void {
    this.getFooterLink().should('be.visible').should('contain.text', linkText);
  }

  clickFooterLink(): void {
    this.getFooterLink().click();
  }
}
