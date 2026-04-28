import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import type { LoginRequest, Locale } from '@fosholhaat/types';

export class LoginRequestDto implements LoginRequest {
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsIn(['bn', 'en'])
  locale!: Locale;
}
