import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import TopBar from '@/components/TopBar';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B2C70' }} edges={["top"]}>
      <TopBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({ ios: { position: 'absolute' }, default: {} }),
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} /> }} />
        <Tabs.Screen name="create" options={{ title: 'Crear', tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} /> }} />
        <Tabs.Screen name="stats" options={{ title: 'Ranking', tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} /> }} />
        <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} /> }} />
      </Tabs>
    </SafeAreaView>
  );
}