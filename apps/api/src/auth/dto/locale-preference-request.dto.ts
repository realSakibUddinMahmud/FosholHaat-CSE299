import { IsIn } from 'class-validator';
import type { LocalePreferenceRequest, Locale } from '@fosholhaat/types';

export class LocalePreferenceRequestDto implements LocalePreferenceRequest {
  @IsIn(['bn', 'en'])
  locale!: Locale;
}
