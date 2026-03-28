import type { TextStyle } from 'react-native';
import tokens from '../../../../packages/tokens/tokens.json';

export const TOKENS = tokens;

const parsePx = (value: string) => Number.parseFloat(value);
const parseFont = (
  value: string,
): { size: number; weight: NonNullable<TextStyle['fontWeight']> } => {
  const [size, weight = '400'] = value.split(' ');
  return {
    size: parsePx(size),
    weight: weight as NonNullable<TextStyle['fontWeight']>,
  };
};

export const MOBILE_TOKENS = {
  spacing: {
    shellHorizontal: parsePx(TOKENS.spacing.shellHorizontal),
    headerTop: parsePx(TOKENS.spacing.headerTop),
    productCardPadding: parsePx(TOKENS.spacing.productCardPadding),
  },
  radius: {
    base: parsePx(TOKENS.radius.base),
    control: parsePx(TOKENS.radius.control),
    panel: parsePx(TOKENS.radius.panel),
    large: parsePx(TOKENS.radius.large),
    card: parsePx(TOKENS.radius.card),
    productCard: parsePx(TOKENS.radius.productCard),
    heroCard: parsePx(TOKENS.radius.heroCard),
  },
  font: {
    brandTitle: parseFont(TOKENS.font.brandTitle),
    sectionTitle: parseFont(TOKENS.font.sectionTitle),
    heroTitle: parseFont(TOKENS.font.heroTitle),
    productCardTitle: parseFont(TOKENS.font.productCardTitle),
    bodyMeta: parseFont(TOKENS.font.bodyMeta),
    ctaLabel: parseFont(TOKENS.font.ctaLabel),
    utilityLabel: parseFont(TOKENS.font.utilityLabel),
  },
} as const;
