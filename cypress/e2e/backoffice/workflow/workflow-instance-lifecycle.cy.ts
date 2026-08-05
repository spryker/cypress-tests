import { container } from '@utils';
import {
  WorkflowInstanceLifecycleDynamicFixtures,
  WorkflowInstanceLifecycleStaticFixtures,
} from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { WorkflowInstanceLifecyclePage } from '@pages/backoffice';

describe(
  'workflow instance lifecycle',
  {
    tags: ['@backoffice', '@workflow', 'workflow', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (!['suite'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite', () => {});

      return;
    }

    const workflowInstanceLifecyclePage = container.get(WorkflowInstanceLifecyclePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: WorkflowInstanceLifecycleStaticFixtures;
    let dynamicFixtures: WorkflowInstanceLifecycleDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('admin should see a new instance and advance its state via a manual action', (): void => {
      const identifier = dynamicFixtures.company.id_company;
      // These states mirror the workflow XML authored in the dynamic fixture: `confirmed` is a final
      // state, so triggering the manual `confirm` event both advances the state and finishes the instance.
      const { initialState, manualEvent, targetState } = staticFixtures;

      // The company-created trigger already ran during fixture synchronization, so the
      // instance exists on the active version, attached to the company id, in the initial state.
      workflowInstanceLifecyclePage.openInstances(dynamicFixtures.workflow.process_name);

      workflowInstanceLifecyclePage.getInstanceRow(identifier).should('contain', identifier);
      workflowInstanceLifecyclePage.getInstanceRowState(identifier).should('contain', initialState);
      workflowInstanceLifecyclePage.getInstanceRowStatus(identifier).should('contain', 'In progress');

      // Admin fires the manual state-machine action directly from the Instances table.
      // Triggering redirects to the instance detail view, so re-open the list to read the updated row.
      workflowInstanceLifecyclePage.triggerManualAction({ identifier, eventName: manualEvent });
      workflowInstanceLifecyclePage.openInstances(dynamicFixtures.workflow.process_name);

      // The table reflects the new state and the finished status; the manual action is gone.
      workflowInstanceLifecyclePage.getInstanceRowState(identifier).should('contain', targetState);
      workflowInstanceLifecyclePage.getInstanceRowStatus(identifier).should('contain', 'Finished');
      workflowInstanceLifecyclePage.getInstanceRowManualAction(identifier, manualEvent).should('not.exist');
    });
  }
);
