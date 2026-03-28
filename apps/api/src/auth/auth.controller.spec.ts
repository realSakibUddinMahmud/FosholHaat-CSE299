import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  LoginResponse,
  LocalePreferenceResponse,
  RoleSelectionResponse,
} from '@fosholhaat/types';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return a session token on valid credentials', async () => {
      const response: LoginResponse = await controller.login({
        identifier: 'admin',
        password: 'password',
        locale: 'en',
      });
      expect(response.sessionToken).toBe('valid-session-token-buyer');
      expect(response.user.role).toBe('buyer');
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      await expect(
        controller.login({
          identifier: 'wrong',
          password: 'wrong',
          locale: 'en',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('locale', () => {
    it('should return the updated locale', async () => {
      const response: LocalePreferenceResponse = await controller.updateLocale({
        locale: 'bn',
      });
      expect(response.locale).toBe('bn');
    });
  });

  describe('role-selection', () => {
    it('should return the correct next route for buyer', async () => {
      const response: RoleSelectionResponse = await controller.selectRole({
        role: 'buyer',
        locale: 'en',
      });
      expect(response.nextRoute).toBe('/signup/buyer');
    });

    it('should return the correct next route for seller', async () => {
      const response: RoleSelectionResponse = await controller.selectRole({
        role: 'seller',
        locale: 'bn',
      });
      expect(response.nextRoute).toBe('/signup/seller');
    });
  });
});
