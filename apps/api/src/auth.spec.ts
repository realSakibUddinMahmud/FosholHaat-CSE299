import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

describe('Auth API (System)', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should authenticate admin with correct password', async () => {
    const response = await service.login({
      identifier: 'admin',
      password: 'password',
      locale: 'en',
    });
    expect(response.sessionToken).toBeDefined();
    expect(response.user.role).toBe('buyer');
  });
});
