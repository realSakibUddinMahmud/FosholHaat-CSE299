import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { Locale, SignupRequest, SignupRole } from '@fosholhaat/types';

export class SignupRequestDto implements SignupRequest {
  @IsIn(['buyer', 'seller'])
  role!: SignupRole;

  @IsString()
  @MinLength(2)
  businessName!: string;

  @IsString()
  @MinLength(2)
  contactName!: string;

  @IsString()
  @MinLength(6)
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsIn(['bn', 'en'])
  locale!: Locale;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  focus?: string;
}
