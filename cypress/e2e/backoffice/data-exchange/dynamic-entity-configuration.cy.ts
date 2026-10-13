import { container } from '@utils';
import {
  DynamicEntityConfigurationDynamicFixtures,
  DynamicEntityConfigurationStaticFixtures,
} from '@interfaces/backoffice';
import { DataExchangePage, FieldDefinition } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// spy_mime_type carries one column of every type the form offers a choice for, so configuring it
// exercises the integer, string and boolean branches of the field-definition table in one pass.
const TABLE_NAME = 'spy_mime_type';

const FIELD_DEFINITIONS: Array<FieldDefinition> = [
  { name: 'id_mime_type', type: 'integer', isCreatable: true, isEditable: false, isRequired: false },
  { name: 'comment', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'extensions', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'is_allowed', type: 'boolean', isCreatable: true, isEditable: true, isRequired: true },
  { name: 'name', type: 'string', isCreatable: true, isEditable: true, isRequired: true },
];

describe(
  'data exchange api configuration',
  { tags: ['@backoffice', 'data-exchange-api', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const dataExchangePage = container.get(DataExchangePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: DynamicEntityConfigurationStaticFixtures;
    let dynamicFixtures: DynamicEntityConfigurationDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a data exchange api configuration for a table when its resource name and fields are configured and saved then the reloaded form renders back what was saved', (): void => {
      // Arrange
      // The resource name and the visible names are drawn per attempt, which makes them the witness
      // that this run wrote the definition: every other value in the form is one an earlier run could
      // have left behind, so the configuration is never reset and nothing is cleaned up afterwards.
      const runMarker = `${Cypress._.random(100000, 999999)}`;
      const resourceName = `mime-types-${runMarker}`;
      const fieldDefinitions = FIELD_DEFINITIONS.map(
        (field: FieldDefinition): FieldDefinition => ({ ...field, visibleName: `${field.name}_${runMarker}` })
      );

      dataExchangePage.openConfiguration(TABLE_NAME);

      // Act
      dataExchangePage.setResourceName(resourceName);
      dataExchangePage.setConfigurationEnabled(true);
      fieldDefinitions.forEach((field: FieldDefinition): void => dataExchangePage.configureField(field));
      dataExchangePage.saveConfiguration();

      // Assert
      dataExchangePage.getConfigurationSavedMessage().should('be.visible');
      dataExchangePage.getErrorMessage().should('not.exist');

      dataExchangePage.openConfiguration(TABLE_NAME);
      dataExchangePage.getResourceNameInput().should('have.value', resourceName);
      dataExchangePage.getIsEnabledCheckbox().should('be.checked');

      fieldDefinitions.forEach((field: FieldDefinition): void => {
        dataExchangePage.getFieldControl(field.name, 'enabled').should('be.checked');
        dataExchangePage.getFieldControl(field.name, 'visibleName').should('have.value', field.visibleName);
        dataExchangePage.getFieldControl(field.name, 'type').should('have.value', field.type);
        dataExchangePage
          .getFieldControl(field.name, 'creatable')
          .should(field.isCreatable ? 'be.checked' : 'not.be.checked');
        dataExchangePage
          .getFieldControl(field.name, 'editable')
          .should(field.isEditable ? 'be.checked' : 'not.be.checked');
        dataExchangePage
          .getFieldControl(field.name, 'required')
          .should(field.isRequired ? 'be.checked' : 'not.be.checked');
      });
    });
  }
);
