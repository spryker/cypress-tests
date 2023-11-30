import { LoginPage } from "../../pages/yves/login/login.page";

export class LoginUserScenario {
  static execute = (email: string, password: string) => {
    const loginPage = new LoginPage();

    loginPage.login(email, password);
  };
}
