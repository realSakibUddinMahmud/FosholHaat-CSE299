import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Locale } from '@fosholhaat/types';
import tokens from '@fosholhaat/tokens/tokens.json';
import { getGroupBuyById, getGroupBuyCopy } from '../group-buy-data';
import { formatBuyerMoney } from '../_data';

type JoinState = 'idle' | 'pending' | 'success' | 'error';

export default function GroupBuyDetailScreen() {
  const params = useLocalSearchParams<{ groupBuyId?: string | string[] }>();
  const router = useRouter();
  const locale: Locale = 'bn';
  const copy = getGroupBuyCopy(locale);
  const groupBuyId = Array.isArray(params.groupBuyId) ? params.groupBuyId[0] : params.groupBuyId;
  const item = useMemo(() => (groupBuyId ? getGroupBuyById(groupBuyId) : null), [groupBuyId]);
  const [joinState, setJoinState] = useState<JoinState>('idle');

  const handleJoin = () => {
    if (!item) return;
    setJoinState('pending');
    setTimeout(() => {
      setJoinState('success');
    }, 800);
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: copy.detailTitle,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: tokens.color.surface },
          }}
        />
        <View style={styles.stateWrap}>
          <Text style={styles.stateTitle}>{copy.notFoundTitle}</Text>
          <Text style={styles.stateText}>{copy.notFoundMessage}</Text>
          <TouchableOpacity style={styles.stateButton} onPress={() => router.back()}>
            <Text style={styles.stateButtonText}>{copy.backToList}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = item.targetQuantity > 0 ? Math.min(100, (item.currentQuantity / item.targetQuantity) * 100) : 0;
  const unit = item.unit[locale];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: copy.detailTitle,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: tokens.color.surface },
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} bounces={false}>
        <Image source={{ uri: item.productImage }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>{copy.activeStatus}</Text>
            </View>
            <Text style={styles.deadline}>{new Date(item.deadline).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' })}</Text>
          </View>

          <Text style={styles.productName}>{item.productName[locale]}</Text>
          <Text style={styles.sellerName}>{item.sellerName}</Text>

          <View style={styles.priceContainer}>
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>{copy.groupPriceLabel}</Text>
              <Text style={styles.groupPrice}>{formatBuyerMoney(item.groupPrice, locale)}/{unit}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>{copy.regularPriceLabel}</Text>
              <Text style={styles.unitPrice}>{formatBuyerMoney(item.unitPrice, locale)}/{unit}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{copy.progressTitle}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>{copy.targetLabel}: {item.targetQuantity} {unit}</Text>
              <Text style={styles.progressText}>{item.currentQuantity} {unit} {copy.currentLabel}</Text>
            </View>
            <Text style={styles.progressPercentage}>{Math.round(progress)}% {copy.currentLabel}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{copy.descriptionTitle}</Text>
          <Text style={styles.description}>{item.description[locale]}</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>• {copy.minQuantityNote} {item.minimumJoinQuantity} {unit}</Text>
            <Text style={styles.infoText}>• {copy.targetNote}</Text>
          </View>

          {joinState !== 'idle' ? (
            <View style={styles.feedbackBox}>
              {joinState === 'pending' ? (
                <ActivityIndicator color={tokens.brand.primary} />
              ) : (
                <Text style={styles.feedbackText}>
                  {joinState === 'success' ? copy.joinSuccess : copy.joinError}
                </Text>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>{copy.savingsLabel}</Text>
          <Text style={styles.footerPriceValue}>{formatBuyerMoney(item.unitPrice - item.groupPrice, locale)} {copy.perUnit} {unit}</Text>
        </View>
        <TouchableOpacity style={styles.joinButton} onPress={handleJoin} disabled={joinState === 'pending'}>
          {joinState === 'pending' ? (
            <ActivityIndicator color={tokens.color.surface} />
          ) : (
            <Text style={styles.joinButtonText}>{copy.joinButton}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 132,
  },
  stateWrap: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.color.textPrimary,
    marginBottom: 8,
  },
  stateText: {
    fontSize: 14,
    color: tokens.color.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  stateButton: {
    backgroundColor: tokens.brand.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  stateButtonText: {
    color: tokens.color.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeBadge: {
    backgroundColor: tokens.brand.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: tokens.brand.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  deadline: {
    color: tokens.color.alertLive,
    fontSize: 14,
    fontWeight: '600',
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.color.textPrimary,
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    color: tokens.color.textSecondary,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    backgroundColor: tokens.color.canvas,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  priceBlock: {
    flex: 1,
    alignItems: 'center',
  },
  priceDivider: {
    width: 1,
    backgroundColor: tokens.color.borderSoft,
    marginHorizontal: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: tokens.color.textSecondary,
    marginBottom: 4,
  },
  groupPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.brand.primary,
  },
  unitPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.color.textSecondary,
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 1,
    backgroundColor: tokens.color.borderSoft,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.color.textPrimary,
    marginBottom: 12,
  },
  progressContainer: {
    backgroundColor: tokens.color.canvas,
    padding: 16,
    borderRadius: 12,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: tokens.color.progressTrack,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: tokens.brand.primary,
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 13,
    color: tokens.color.textSecondary,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.brand.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.textBody,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: tokens.brand.primary + '05',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: tokens.brand.primary,
  },
  infoText: {
    fontSize: 13,
    color: tokens.color.textBody,
    marginBottom: 4,
  },
  feedbackBox: {
    marginTop: 16,
    minHeight: 36,
    justifyContent: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: tokens.color.textPrimary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.color.surface,
    padding: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: tokens.color.borderSoft,
  },
  footerPrice: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: tokens.color.textSecondary,
  },
  footerPriceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.brand.primary,
  },
  joinButton: {
    backgroundColor: tokens.brand.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: tokens.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    color: tokens.color.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
