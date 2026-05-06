import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  locale: string;
  businessId: string | null;
}

/**
 * Resolves the current authenticated user from a Bearer token.
 * Shared by all seller/buyer/hub services that need session-scoped data.
 */
export async function resolveCurrentUser(
  prisma: PrismaService,
  authorization: string | undefined,
): Promise<CurrentUser> {
  const token = authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    throw new UnauthorizedException('Not authenticated');
  }

  const session = await prisma.accountSession.findUnique({
    where: { token },
    include: {
      user: true,
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
    role: user.role,
    locale: user.locale,
    businessId: user.businessId,
  };
}

/**
 * Resolves the current user and asserts they have the SELLER role.
 */
export async function resolveCurrentSeller(
  prisma: PrismaService,
  authorization: string | undefined,
): Promise<CurrentUser> {
  const user = await resolveCurrentUser(prisma, authorization);
  if (user.role !== 'SELLER') {
    throw new UnauthorizedException('Current user is not a seller');
  }
  return user;
}

export async function resolveCurrentBuyer(
  prisma: PrismaService,
  authorization: string | undefined,
): Promise<CurrentUser> {
  const user = await resolveCurrentUser(prisma, authorization);
  if (user.role !== 'BUYER') {
    throw new UnauthorizedException('Current user is not a buyer');
  }
  return user;
}

export async function resolveCurrentHubManager(
  prisma: PrismaService,
  authorization: string | undefined,
): Promise<CurrentUser> {
  const user = await resolveCurrentUser(prisma, authorization);
  if (user.role !== 'HUB_MANAGER') {
    throw new UnauthorizedException('Current user is not a hub manager');
  }
  return user;
}
