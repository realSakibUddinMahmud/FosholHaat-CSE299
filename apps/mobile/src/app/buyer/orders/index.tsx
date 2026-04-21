import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BuyerOrderSummary, Locale } from '@fosholhaat/types';
import tokens from '@fosholhaat/tokens/tokens.json';
import { MOCK_ORDERS, getOrderCopy } from '../order-data';
import { Ionicons } from '@expo/vector-icons';

const OrderCard = ({ item, onPress, onTrackPress, locale }: { item: BuyerOrderSummary; onPress: () => void; onTrackPress: () => void; locale: Locale }) => {
  const copy = getOrderCopy(locale);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': return styles.statusInTransit;
      case 'PROCESSING': return styles.statusProcessing;
      case 'SHIPPED': return styles.statusShipped;
      default: return styles.statusDefault;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': return copy.inTransit;
      case 'PROCESSING': return copy.processing;
      case 'SHIPPED': return copy.shipped;
      case 'DELIVERED': return copy.delivered;
      default: return status;
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
              <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
            </View>
            <Text style={styles.orderId}>Order #{item.id}</Text>
          </View>
          <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.orderTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{copy.total}: {item.total}</Text>
            <View style={styles.dot} />
            <Text style={styles.infoText}>{copy.estDelivery}: {item.estDelivery}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.trackButton} onPress={onTrackPress}>
          <Text style={styles.trackButtonText}>{copy.track}</Text>
          <Ionicons name="chevron-forward" size={16} color={tokens.brand.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
          <Text style={styles.detailsButtonText}>{copy.viewDetails}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function BuyerOrdersListScreen() {
  const router = useRouter();
  const locale: Locale = 'bn'; // In real app, get from context
  const copy = getOrderCopy(locale);
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed'>('ongoing');

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ongoing') return ['PROCESSING', 'IN_TRANSIT', 'SHIPPED'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'DELIVERED';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: copy.listTitle,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: tokens.color.canvas },
        }}
      />

      <View style={styles.tabs}>
        {(['all', 'ongoing', 'completed'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {copy[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => (
          <OrderCard
            item={item}
            locale={locale}
            onPress={() => router.push({ pathname: '/buyer/orders/[orderId]', params: { orderId: item.id } })}
            onTrackPress={() => router.push({ pathname: '/buyer/orders/[orderId]/tracking', params: { orderId: item.id } })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{copy.listTitle}</Text>
            <Text style={styles.headerSubtitle}>{copy.listSubtitle}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.canvas,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: tokens.color.surface,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: tokens.color.borderSoft,
  },
  tab: {
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: tokens.brand.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.color.textSecondary,
  },
  activeTabText: {
    color: tokens.brand.primary,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: tokens.color.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: tokens.color.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: tokens.color.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
    shadowColor: tokens.color.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusContainer: {
    gap: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusProcessing: {
    backgroundColor: tokens.color.soft,
  },
  statusInTransit: {
    backgroundColor: tokens.color.progressTrack,
  },
  statusShipped: {
    backgroundColor: tokens.brand.primary,
  },
  statusDefault: {
    backgroundColor: tokens.color.soft,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: tokens.color.textPrimary,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.color.textPrimary,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cardBody: {
    marginBottom: 16,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: tokens.color.textBody,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: tokens.color.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: tokens.color.borderSoft,
    marginHorizontal: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: tokens.color.borderSoft,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.brand.primary,
  },
  detailsButton: {
    backgroundColor: tokens.color.canvas,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: tokens.brand.primary,
  },
});
