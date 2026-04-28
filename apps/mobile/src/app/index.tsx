import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { getSession, nextRouteForRole } from '../lib/session';

export default function IndexScreen() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    void getSession().then((session) => {
      setRoute(session ? nextRouteForRole(session.role) : '/language');
    });
  }, []);

  if (!route) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={route as never} />;
}
