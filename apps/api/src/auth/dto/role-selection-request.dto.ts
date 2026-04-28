import { IsIn } from 'class-validator';
import type {
  RoleSelectionRequest,
  Locale,
  SignupRole,
} from '@fosholhaat/types';

export class RoleSelectionRequestDto implements RoleSelectionRequest {
  @IsIn(['buyer', 'seller'])
  role!: SignupRole;

  @IsIn(['bn', 'en'])
  locale!: Locale;
}
