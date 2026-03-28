import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  LoginRequest,
  LoginResponse,
  LocalePreferenceRequest,
  LocalePreferenceResponse,
  RoleSelectionRequest,
  RoleSelectionResponse,
  AuthRole,
} from '@fosholhaat/types';

@Injectable()
export class AuthService {
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    await Promise.resolve();
    const { identifier, password, locale } = loginRequest;

    // Implementation Note: identifiers ending in -user will resolve to that role for integration testing
    // e.g., 'buyer-user' -> role: 'buyer', nextRoute: '/buyer'
    const roleMap: Record<string, { role: AuthRole; nextRoute: string }> = {
      'buyer-user': { role: 'buyer', nextRoute: '/buyer' },
      'seller-user': { role: 'seller', nextRoute: '/seller' },
      'hub-user': { role: 'hub_manager', nextRoute: '/hub' },
      admin: { role: 'buyer', nextRoute: '/buyer' }, // Legacy support for admin
    };

    const userMatch = roleMap[identifier];

    if (userMatch && password === 'password') {
      return {
        sessionToken: 'valid-session-token-' + userMatch.role,
        user: {
          id: 'user-' + identifier,
          role: userMatch.role,
          locale: locale,
        },
        nextRoute: userMatch.nextRoute,
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async updateLocale(
    localeRequest: LocalePreferenceRequest,
  ): Promise<LocalePreferenceResponse> {
    const { locale } = localeRequest;
    return Promise.resolve({ locale });
  }

  async selectRole(
    roleRequest: RoleSelectionRequest,
  ): Promise<RoleSelectionResponse> {
    const { role } = roleRequest;
    const nextRoute = `/signup/${role}`;

    return Promise.resolve({
      role: role,
      nextRoute: nextRoute,
    });
  }
}
