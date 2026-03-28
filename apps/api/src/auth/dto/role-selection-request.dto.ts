import { IsEnum } from 'class-validator';
import type {
  RoleSelectionRequest,
  Locale,
  SignupRole,
} from '@fosholhaat/types';

export class RoleSelectionRequestDto implements RoleSelectionRequest {
  @IsEnum(['buyer', 'seller'])
  role!: SignupRole;

  @IsEnum(['bn', 'en'])
  locale!: Locale;
}
