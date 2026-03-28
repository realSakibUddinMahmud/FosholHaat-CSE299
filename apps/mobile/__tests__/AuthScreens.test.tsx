// Business Logic & Export Verification (Environment-Agnostic)
import WelcomeScreen from '../src/app/welcome/index';
import LanguageScreen from '../src/app/language/index';
import LoginScreen from '../src/app/login/index';
import SignupRoleScreen from '../src/app/signup/role/index';

describe('Shared-Auth Mobile Screen Integrity', () => {
  it('exports the Welcome screen correctly', () => {
    expect(WelcomeScreen).toBeDefined();
    expect(typeof WelcomeScreen).toBe('function');
  });

  it('exports the Language screen correctly', () => {
    expect(LanguageScreen).toBeDefined();
    expect(typeof LanguageScreen).toBe('function');
  });

  it('exports the Login screen correctly', () => {
    expect(LoginScreen).toBeDefined();
    expect(typeof LoginScreen).toBe('function');
  });

  it('exports the Signup Role screen correctly', () => {
    expect(SignupRoleScreen).toBeDefined();
    expect(typeof SignupRoleScreen).toBe('function');
  });
});
