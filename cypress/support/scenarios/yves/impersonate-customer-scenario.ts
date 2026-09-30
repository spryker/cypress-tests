import { AgentControlBarPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { AgentLoginScenario } from './agent-login-scenario';

@injectable()
@autoWired
export class ImpersonateCustomerScenario {
  @inject(AgentLoginScenario) private agentLoginScenario: AgentLoginScenario;
  @inject(AgentControlBarPage) private agentControlBarPage: AgentControlBarPage;

  /**
   * Signs an agent in and switches them into a customer's session. This is how a customer created
   * through a form can be driven at all: nothing knows their password, and the agent never needs it.
   */
  execute = (params: ExecuteParams): void => {
    this.agentLoginScenario.execute({
      username: params.agentUsername,
      password: params.agentPassword,
      withoutSession: true,
    });

    this.agentControlBarPage.visit();
    this.agentControlBarPage.impersonate(params.customerEmail);
  };
}

interface ExecuteParams {
  agentUsername: string;
  agentPassword: string;
  customerEmail: string;
}
