import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import type { LoginRequest, Locale } from '@fosholhaat/types';

export class LoginRequestDto implements LoginRequest {
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(['bn', 'en'])
  locale!: Locale;
}
