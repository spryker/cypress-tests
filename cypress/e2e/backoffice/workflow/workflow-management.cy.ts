import { container } from '@utils';
import { WorkflowManagementDynamicFixtures, WorkflowManagementStaticFixtures } from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { WorkflowManagementPage } from '@pages/backoffice';

describe(
  'workflow management',
  {
    tags: ['@backoffice', '@workflow', 'workflow', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    const workflowManagementPage = container.get(WorkflowManagementPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: WorkflowManagementStaticFixtures;
    let dynamicFixtures: WorkflowManagementDynamicFixtures;

    // A unique name keeps the run idempotent and satisfies the "unique name" precondition.
    const workflowName = `E2E Onboarding ${Date.now()}`;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('admin should be able to create, configure, version and activate a workflow', (): void => {
      const { subjectType, triggerEventLabel, initialState } = staticFixtures;

      // The definition XML lives in the static fixture; only the unique process name is injected here.
      const definition = staticFixtures.definitionTemplate.replace('%process_name%', workflowName);

      workflowManagementPage.visit();

      // Create the workflow — it starts inactive.
      workflowManagementPage.createWorkflow({ name: workflowName, subjectType });
      workflowManagementPage.getProcessRow(workflowName).should('contain', 'Inactive');

      // Configure one trigger.
      workflowManagementPage.configureTrigger({ name: workflowName, eventLabel: triggerEventLabel });

      // Create a version with valid XML and validate it.
      workflowManagementPage.createVersion({ name: workflowName, initialState, definition });
      workflowManagementPage.validateDefinition();
      workflowManagementPage.getValidationResult().should('contain', 'The definition is valid.');

      // Save then activate the new version.
      workflowManagementPage.saveVersion();
      workflowManagementPage.activateLatestVersion();

      // The overview table reflects the active version, active status and trigger summary.
      workflowManagementPage.visit();
      workflowManagementPage.getProcessRowStatus(workflowName).should('contain', 'active');
      workflowManagementPage.getProcessRowActiveVersion(workflowName).should('contain', '1');
      workflowManagementPage.getProcessRowTriggers(workflowName).should('contain', triggerEventLabel);
    });
  }
);
