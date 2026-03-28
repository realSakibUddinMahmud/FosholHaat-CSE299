import { IsEnum } from 'class-validator';
import type { LocalePreferenceRequest, Locale } from '@fosholhaat/types';

export class LocalePreferenceRequestDto implements LocalePreferenceRequest {
  @IsEnum(['bn', 'en'])
  locale!: Locale;
}
