import { inject, injectable } from 'inversify';
import { LoginPage } from '../../pages/yves';
import { autoWired } from '../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class CustomerLoginScenario {
  constructor(@inject(LoginPage) private loginPage: LoginPage) {}

  public execute = (email: string, password: string): void => {
    this.loginPage.login(email, password);
  };
}
