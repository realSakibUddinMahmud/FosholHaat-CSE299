import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOBILE_TOKENS, TOKENS } from '../styles/tokens';
import { BrandLockup } from './brand-lockup';

type SharedAuthLayoutProps = {
  rightAction?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function SharedAuthLayout({
  rightAction,
  title,
  subtitle,
  children,
  footer,
  contentStyle,
  titleStyle,
}: SharedAuthLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandLockup />
          {rightAction ? <View>{rightAction}</View> : null}
        </View>

        <View style={styles.main}>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <View style={[styles.contentCard, contentStyle]}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: TOKENS.color.surface,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: TOKENS.color.canvas,
  },
  header: {
    minHeight: 76,
    paddingHorizontal: MOBILE_TOKENS.spacing.headerTop,
    paddingVertical: 16,
    backgroundColor: TOKENS.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.color.borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: MOBILE_TOKENS.spacing.headerTop,
    paddingTop: 28,
    paddingBottom: 32,
    gap: 28,
  },
  titleBlock: {
    gap: 10,
    padding: 20,
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    shadowColor: TOKENS.color.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 2,
  },
  title: {
    color: TOKENS.brand.primary,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: MOBILE_TOKENS.font.sectionTitle.weight,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: TOKENS.color.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  contentCard: {
    borderRadius: MOBILE_TOKENS.radius.heroCard,
    backgroundColor: TOKENS.color.surface,
    borderWidth: 1,
    borderColor: TOKENS.color.borderSoft,
    padding: MOBILE_TOKENS.spacing.productCardPadding + 8,
    shadowColor: TOKENS.color.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    gap: 18,
  },
  footer: {
    alignItems: 'center',
  },
});
