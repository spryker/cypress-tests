import { container } from '@utils';
import {
  ApiSpecificationDownloadDynamicFixtures,
  ApiSpecificationDownloadStaticFixtures,
} from '@interfaces/backoffice';
import { DataExchangePage, FieldDefinition } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// spy_mime_type is a core table with no configuration in demo data, so exposing it is observable
// as a resource the specification gained.
const TABLE_NAME = 'spy_mime_type';

const RESOURCE_PATH_PREFIX = '/dynamic-entity/';

// A resource demo data already exposes, so the very first download proves the file is the real
// specification and not an empty placeholder.
const ALREADY_EXPOSED_RESOURCE_PATH = '/dynamic-entity/product-abstracts';

const FIELD_DEFINITIONS: Array<FieldDefinition> = [
  { name: 'id_mime_type', type: 'integer', isCreatable: true, isEditable: false, isRequired: false },
  { name: 'comment', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'extensions', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'is_allowed', type: 'boolean', isCreatable: true, isEditable: true, isRequired: true },
  { name: 'name', type: 'string', isCreatable: true, isEditable: true, isRequired: true },
];

describe(
  'data exchange api specification download',
  { tags: ['@backoffice', 'data-exchange-api', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const dataExchangePage = container.get(DataExchangePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ApiSpecificationDownloadStaticFixtures;
    let dynamicFixtures: ApiSpecificationDownloadDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      // The browser saves a second download of the same name beside the first, so the file a retry
      // would read has to be gone before this attempt downloads its own.
      dataExchangePage.discardDownloadedApiSpecification();
    });

    it('given a table exposed under a resource name the specification does not know when its data exchange api configuration is enabled and the specification is regenerated then the downloaded specification gains the resource', (): void => {
      // Arrange
      // The resource name is drawn per attempt, so it is absent from every specification generated
      // before it and nothing an earlier run enabled has to be taken back first.
      const resourceName = `mime-types-${Cypress._.random(100000, 999999)}`;
      const resourcePath = `${RESOURCE_PATH_PREFIX}${resourceName}`;

      dataExchangePage.waitForApiSpecificationToBeCurrent();
      dataExchangePage.getDownloadSpecificationButton().should('not.have.class', 'disabled');
      dataExchangePage.downloadApiSpecification();
      dataExchangePage
        .getDownloadedApiSpecification()
        .should('contain', ALREADY_EXPOSED_RESOURCE_PATH)
        .and('not.contain', resourcePath);
      dataExchangePage.discardDownloadedApiSpecification();

      // Act
      dataExchangePage.openConfiguration(TABLE_NAME);
      dataExchangePage.setResourceName(resourceName);
      dataExchangePage.setConfigurationEnabled(true);
      FIELD_DEFINITIONS.forEach((field: FieldDefinition): void => dataExchangePage.configureField(field));
      dataExchangePage.saveConfiguration();

      // Assert
      dataExchangePage.getErrorMessage().should('not.exist');
      dataExchangePage.visit();
      dataExchangePage.getDownloadSpecificationButton().should('have.class', 'disabled');

      dataExchangePage.waitForApiSpecificationToBeCurrent();
      dataExchangePage.downloadApiSpecification();
      dataExchangePage.getDownloadedApiSpecification().should('contain', resourcePath);
    });
  }
);
