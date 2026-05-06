import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import type { BuyerOrderDetail, Locale } from '@fosholhaat/types';
import tokens from '@fosholhaat/tokens/tokens.json';
import { getOrderCopy } from '../order-data';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { apiFetch } from '../../../lib/api-client';

export default function BuyerOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const locale: Locale = 'bn';
  const copy = getOrderCopy(locale);
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const [order, setOrder] = useState<BuyerOrderDetail | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!orderId) return;
    apiFetch<BuyerOrderDetail>(`/buyer/orders/${orderId}`).then(setOrder).catch((err: Error) => setError(err.message));
  }, [orderId]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: copy.listTitle,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: tokens.color.canvas },
          }}
        />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Order not found</Text>
          <Text style={styles.notFoundText}>{error || "This order is unavailable."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: `Order #${order.id}`,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: tokens.color.canvas },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          {order.imageUrl ? <Image source={{ uri: order.imageUrl }} style={styles.statusImage} /> : null}
          <View style={styles.statusOverlay}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>{copy.statusSummary}</Text>
              <View style={styles.statusRow}>
                <MaterialCommunityIcons name="truck-delivery" size={24} color={tokens.brand.primary} />
                <Text style={styles.statusValue}>
                  {order.status === 'HUB_RECEIVED'
                    ? copy.inTransit
                    : order.status === 'CONFIRMED'
                      ? copy.processing
                      : order.status === 'COMPLETED'
                        ? copy.delivered
                        : copy.shipped}
                </Text>
              </View>
              <View style={styles.deliveryRow}>
                <Ionicons name="calendar-outline" size={16} color={tokens.color.textSecondary} />
                <Text style={styles.deliveryText}>{copy.estimated}: {order.estDelivery}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.orderItems}</Text>
          <View style={styles.itemsCard}>
            {order.items.map((item, index) => (
              <View key={index} style={[styles.itemRow, index === order.items.length - 1 && styles.lastItemRow]}>
                <Image
                  source={{ uri: order.imageUrl }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemQty}>{copy.quantity}: {item.quantity.split(' ')[0]}</Text>
                </View>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{copy.pricingBreakdown}</Text>
          <View style={styles.pricingCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{copy.subtotal}</Text>
              <Text style={styles.priceValue}>{order.subtotal}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{copy.deliveryFee}</Text>
              <Text style={styles.priceValue}>{order.deliveryFee}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: tokens.brand.primary }]}>{copy.bulkSavings}</Text>
            <Text style={[styles.priceValue, { color: tokens.brand.primary, fontWeight: '700' }]}>৳0</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{copy.totalAmount}</Text>
              <Text style={styles.totalValue}>{order.total}</Text>
            </View>
          </View>
        </View>

        {/* Fulfillment & Payment */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <View style={styles.infoTitleRow}>
              <MaterialCommunityIcons name="warehouse" size={16} color={tokens.brand.primary} />
              <Text style={styles.infoTitle}>{copy.fulfillment}</Text>
            </View>
            <Text style={styles.infoMain}>{order.shippingAddress}</Text>
            <Text style={styles.infoSub}>{order.orderType === "GROUP" ? "Waiting for group target before seller fulfillment." : "Waiting for seller confirmation."}</Text>
          </View>
          <View style={styles.infoBox}>
            <View style={styles.infoTitleRow}>
              <Ionicons name="card-outline" size={16} color={tokens.brand.primary} />
              <Text style={styles.infoTitle}>{copy.payment}</Text>
            </View>
            <Text style={styles.infoMain}>{order.paymentMethod}</Text>
            <Text style={[styles.infoSub, { color: tokens.brand.primary, fontWeight: '700' }]}>{copy.status}: {copy.verified}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="headset-outline" size={20} color={tokens.color.textSecondary} />
          <Text style={styles.helpText}>{copy.needHelp}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => router.push(`/buyer/orders/${order.id}/tracking`)}
        >
          <Ionicons name="location-outline" size={20} color={tokens.color.surface} />
          <Text style={styles.trackButtonText}>{copy.track}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.canvas,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.color.textPrimary,
    marginBottom: 6,
  },
  notFoundText: {
    fontSize: 14,
    color: tokens.color.textSecondary,
    textAlign: 'center',
  },
  statusCard: {
    height: 180,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: tokens.color.surface,
  },
  statusImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'flex-end',
  },
  statusInfo: {
    gap: 4,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.color.textSecondary,
    textTransform: 'uppercase',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '800',
    color: tokens.brand.primary,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryText: {
    fontSize: 12,
    color: tokens.color.textBody,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.color.textPrimary,
    marginBottom: 12,
  },
  itemsCard: {
    backgroundColor: tokens.color.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
  },
  itemRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.borderSoft,
  },
  lastItemRow: {
    borderBottomWidth: 0,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.color.textPrimary,
  },
  itemQty: {
    fontSize: 12,
    color: tokens.color.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.color.textPrimary,
  },
  pricingCard: {
    backgroundColor: tokens.color.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 14,
    color: tokens.color.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: tokens.color.textPrimary,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.color.borderSoft,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.color.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: tokens.brand.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: tokens.color.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.color.textSecondary,
    textTransform: 'uppercase',
  },
  infoMain: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.color.textPrimary,
  },
  infoSub: {
    fontSize: 11,
    color: tokens.color.textSecondary,
    marginTop: 2,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  helpText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.color.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.color.surface,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: tokens.color.borderSoft,
  },
  trackButton: {
    backgroundColor: tokens.brand.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
