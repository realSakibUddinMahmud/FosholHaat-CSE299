import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  Optional,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginRequest,
  LoginResponse,
  LocalePreferenceRequest,
  LocalePreferenceResponse,
  RoleSelectionRequest,
  RoleSelectionResponse,
  SignupRequest,
  SignupResponse,
  AuthRole,
  SignupRole,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

type RoleRoute = { role: AuthRole; nextRoute: string };

const ROLE_ROUTES: Record<string, RoleRoute> = {
  BUYER: { role: 'buyer', nextRoute: '/buyer' },
  SELLER: { role: 'seller', nextRoute: '/seller' },
  HUB_MANAGER: { role: 'hub_manager', nextRoute: '/hub' },
};

@Injectable()
export class AuthService {
  constructor(@Optional() private readonly prisma?: PrismaService) {}

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { identifier, password, locale } = loginRequest;

    if (this.prisma) {
      const user = await this.findUserByIdentifier(identifier);
      const route = user ? ROLE_ROUTES[user.role] : undefined;

      if (user && route && password === user.passwordHash) {
        const session = await this.prisma.accountSession.create({
          data: {
            token: `session-${randomUUID()}`,
            userId: user.id,
            activeRole: user.role,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
        });

        await this.prisma.user.update({
          where: { id: user.id },
          data: { locale },
        });

        return {
          sessionToken: session.token,
          user: {
            id: user.id,
            role: route.role,
            locale,
          },
          nextRoute: route.nextRoute,
        };
      }
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

  private normalizePhone(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('880')) cleaned = cleaned.slice(2);
    if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);
    return cleaned;
  }

  private phoneFromGeneratedEmail(email: string): string | undefined {
    const match = /^(buyer|seller)-(\d+)@fosholhaat\.local$/i.exec(email);
    return match ? `+880${match[2]}` : undefined;
  }

  async signup(request: SignupRequest): Promise<SignupResponse> {
    if (!this.prisma) {
      throw new UnauthorizedException('Database unavailable');
    }

    const role = this.toDbSignupRole(request.role);
    const route = ROLE_ROUTES[role];
    const phoneKey = this.normalizePhone(request.phone) || randomUUID();
    const email = `${request.role}-${phoneKey}@fosholhaat.local`;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('An account already exists for this phone.');
    }

    const user = await this.prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: request.businessName.trim(),
          role,
          district: request.district?.trim() || 'Dhaka',
        },
      });

      return tx.user.create({
        data: {
          email,
          passwordHash: request.password,
          fullName: request.contactName.trim(),
          role,
          locale: request.locale,
          businessId: business.id,
        },
      });
    });

    const session = await this.prisma.accountSession.create({
      data: {
        token: `session-${randomUUID()}`,
        userId: user.id,
        activeRole: user.role,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    return {
      sessionToken: session.token,
      user: {
        id: user.id,
        role: route.role,
        locale: request.locale,
      },
      nextRoute: route.nextRoute,
    };
  }

  private async findUserByIdentifier(identifier: string) {
    if (!this.prisma) return null;
    const raw = identifier.trim().toLowerCase();
    if (raw.includes('@')) {
      return this.prisma.user.findUnique({ where: { email: raw } });
    }

    const phoneKey = this.normalizePhone(raw);
    if (phoneKey) {
      return this.prisma.user.findFirst({
        where: {
          OR: [
            { email: `buyer-${phoneKey}@fosholhaat.local` },
            { email: `seller-${phoneKey}@fosholhaat.local` },
          ],
        },
      });
    }

    return null;
  }

  async getMe(authorization?: string) {
    if (!this.prisma) {
      throw new UnauthorizedException('Not authenticated');
    }

    const token = authorization?.replace(/^Bearer\s+/i, '');
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.prisma.accountSession.findUnique({
      where: { token },
      include: {
        user: {
          include: { business: true },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    const user = session.user;
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: this.phoneFromGeneratedEmail(user.email),
      role: user.role,
      locale: user.locale,
      businessName: user.business?.name,
      corridor: user.business?.corridor,
      district: user.business?.district,
    };
  }

  private toDbSignupRole(role: SignupRole): 'BUYER' | 'SELLER' {
    return role === 'seller' ? 'SELLER' : 'BUYER';
  }
}
