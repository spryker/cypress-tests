import { container, skipWhenFeatureAbsent } from '@utils';
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
    // The B2C shops do not install the workflow module.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C shops have no workflows', () => {});

      return;
    }

    skipWhenFeatureAbsent('workflow', ['b2b']);

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
      const { initialState, manualEvent, targetState, finalManualEvent, finalState } = staticFixtures;

      // The company-created trigger already ran during fixture synchronization, so the
      // instance exists on the active version, attached to the company id, in the initial state.
      workflowInstanceLifecyclePage.openWorkflowActivity(dynamicFixtures.workflow.process_name);

      // The version view lists the instances of every version of the workflow, most recently executed first.
      workflowInstanceLifecyclePage.getWorkflowActivityTable().should('be.visible');
      workflowInstanceLifecyclePage.getWorkflowActivityHeaders().then((headers: JQuery<HTMLElement>): void => {
        expect(headers.toArray().map((header: HTMLElement): string => header.innerText.trim())).to.deep.equal([
          'Subject Identifier',
          'Subject Type',
          'Version',
          'Current State',
          'Status',
          'Creation Date',
          'Actions',
        ]);
      });

      workflowInstanceLifecyclePage.getInstanceRow(identifier).should('contain', identifier);
      workflowInstanceLifecyclePage.getInstanceRowState(identifier).should('contain', initialState);
      workflowInstanceLifecyclePage.getInstanceRowStatus(identifier).should('contain', 'In progress');

      // View opens the instance; its only header action leads back to the workflow view it was opened from.
      cy.location('search').then((workflowViewSearch: string): void => {
        const idDefinition = new URLSearchParams(workflowViewSearch).get('id-definition');

        workflowInstanceLifecyclePage.openInstanceView(identifier);
        cy.location('pathname').should('eq', '/workflow/instance/view');
        workflowInstanceLifecyclePage.getPageActionButtons().should('have.length', 1);
        workflowInstanceLifecyclePage.getInstanceBackButton().should('contain', 'Back to workflow').click();
        cy.location('pathname').should('eq', '/workflow/version/view');
        cy.location('search').should('contain', `id-definition=${idDefinition}`);
      });

      // Admin fires the manual state-machine action directly from the Instances table and stays on the workflow view.
      workflowInstanceLifecyclePage.triggerManualAction({ identifier, eventName: manualEvent });
      cy.location('pathname').should('eq', '/workflow/version/view');

      workflowInstanceLifecyclePage.getInstanceRowState(identifier).should('contain', targetState);
      workflowInstanceLifecyclePage.getInstanceRowStatus(identifier).should('contain', 'In progress');
      workflowInstanceLifecyclePage.getInstanceRowManualAction(identifier, manualEvent).should('not.exist');

      workflowInstanceLifecyclePage.openInstanceView(identifier);
      workflowInstanceLifecyclePage.getInstanceCurrentState().should('have.text', targetState);
      workflowInstanceLifecyclePage.triggerInstanceManualEvent(finalManualEvent);

      cy.location('pathname').should('eq', '/workflow/instance/view');
      workflowInstanceLifecyclePage.getInstanceCurrentState().should('have.text', finalState);
      workflowInstanceLifecyclePage.getInstanceManualActions().should('not.exist');

      workflowInstanceLifecyclePage.getInstanceBackButton().click();
      workflowInstanceLifecyclePage.getInstanceRowState(identifier).should('contain', finalState);
      workflowInstanceLifecyclePage.getInstanceRowStatus(identifier).should('contain', 'Finished');
    });
  }
);
