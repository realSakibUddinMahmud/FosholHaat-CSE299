import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Locale } from '@fosholhaat/types';
import tokens from '@fosholhaat/tokens/tokens.json';
import { getOrderCopy, getOrderTracking } from '../../order-data';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const TimelineItem = ({
  label,
  time,
  status,
  isLast
}: {
  label: string;
  time?: string;
  status: 'done' | 'current' | 'upcoming';
  isLast?: boolean;
}) => {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineNode,
          status === 'done' && styles.nodeDone,
          status === 'current' && styles.nodeCurrent,
          status === 'upcoming' && styles.nodeUpcoming,
        ]}>
          {status === 'done' && <Ionicons name="checkmark" size={12} color={tokens.color.surface} />}
          {status === 'current' && <View style={styles.nodeInnerPulse} />}
        </View>
        {!isLast && <View style={[styles.timelineLine, status === 'done' && styles.lineDone]} />}
      </View>
      <View style={styles.timelineRight}>
        <Text style={[
          styles.timelineLabel,
          status === 'current' && styles.labelCurrent,
          status === 'upcoming' && styles.labelUpcoming,
        ]}>{label}</Text>
        {time && <Text style={styles.timelineTime}>{time}</Text>}
      </View>
    </View>
  );
};

export default function BuyerOrderTrackingScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const locale: Locale = 'bn';
  const copy = getOrderCopy(locale);
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const tracking = getOrderTracking(orderId);

  if (!tracking) {
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
          <Text style={styles.notFoundTitle}>Tracking not found</Text>
          <Text style={styles.notFoundText}>This order is unavailable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: `${copy.track} #${tracking.orderId}`,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: tokens.color.canvas },
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.liveCard}>
          <View style={styles.liveIconContainer}>
            <MaterialCommunityIcons name="truck-delivery" size={24} color={tokens.color.surface} />
          </View>
          <View style={styles.liveInfo}>
            <Text style={styles.truckId}>DH-METRO-1234</Text>
            <Text style={styles.estArrival}>Est. Arrival: Oct 26, 04:00 PM</Text>
          </View>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>{copy.statusSummary}</Text>

          <View style={styles.timeline}>
            {tracking.timeline.map((step, index) => (
              <TimelineItem
                key={step.key}
                label={step.label}
                time={step.occurredAt}
                status={step.status}
                isLast={index === tracking.timeline.length - 1}
              />
            ))}
          </View>
        </View>

        <View style={styles.lastPingCard}>
          <View style={styles.pingInfo}>
            <Text style={styles.pingLabel}>{copy.lastPing}</Text>
            <Text style={styles.pingValue}>Jamuna Bridge Area</Text>
          </View>
          <View style={styles.pingDivider} />
          <View style={styles.pingInfo}>
            <Text style={styles.pingLabel}>Speed</Text>
            <Text style={[styles.pingValue, { color: tokens.brand.primary }]}>54 km/h</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.color.canvas,
  },
  scrollContent: {
    padding: 20,
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
  liveCard: {
    backgroundColor: tokens.color.progressTrack,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: tokens.color.primaryTint,
  },
  liveIconContainer: {
    backgroundColor: tokens.brand.primary,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveInfo: {
    marginLeft: 12,
    flex: 1,
  },
  truckId: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.color.textPrimary,
  },
  estArrival: {
    fontSize: 12,
    color: tokens.brand.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: tokens.color.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.color.textPrimary,
    marginBottom: 24,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 70,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
  },
  timelineNode: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: tokens.color.soft,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  nodeDone: {
    backgroundColor: tokens.brand.primary,
  },
  nodeCurrent: {
    backgroundColor: tokens.brand.primary,
  },
  nodeInnerPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.color.surface,
  },
  nodeUpcoming: {
    borderWidth: 2,
    borderColor: tokens.color.borderSoft,
    backgroundColor: tokens.color.surface,
  },
  timelineLine: {
    position: 'absolute',
    top: 18,
    bottom: 0,
    width: 2,
    backgroundColor: tokens.color.soft,
  },
  lineDone: {
    backgroundColor: tokens.brand.primary,
  },
  timelineRight: {
    flex: 1,
    marginLeft: 16,
    paddingTop: -2,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: tokens.color.textPrimary,
  },
  labelCurrent: {
    color: tokens.brand.primary,
  },
  labelUpcoming: {
    color: tokens.color.textSecondary,
    fontWeight: '500',
  },
  timelineTime: {
    fontSize: 12,
    color: tokens.color.textSecondary,
    marginTop: 4,
  },
  lastPingCard: {
    backgroundColor: tokens.color.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.color.borderSoft,
  },
  pingInfo: {
    flex: 1,
    alignItems: 'center',
  },
  pingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: tokens.color.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  pingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: tokens.color.textPrimary,
  },
  pingDivider: {
    width: 1,
    height: 30,
    backgroundColor: tokens.color.borderSoft,
  },
});
