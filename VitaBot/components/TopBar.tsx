import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TopBar() {

  const handleLogout = async () => {
    router.replace('/login');
  };

  const handleSettings = () => {
    router.push('/(tabs)/settings');
  };

  const handleNotification = () => {
    router.push('/notifications');
  };

  return (
    <View style={styles.container}>
      {/* Avatar + Nombre */}
      <View style={styles.userBox}>
          <Image
            source={require('../assets/onboarding1.png')} // ← poné aquí tu ruta real
            style={styles.avatar}
          />

          <Text style={styles.userName} numberOfLines={1}>
            Pepe
          </Text>
        </View>

      <View style={styles.spacer} />

      {/* Notificaciones */}
      <TouchableOpacity style={styles.iconBtn} onPress={handleNotification}>
        <Ionicons name="notifications" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Ajustes */}
      <TouchableOpacity style={styles.iconBtn} onPress={handleSettings}>
        <Ionicons name="settings" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#0B2C70',
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  userName: { color: '#fff', maxWidth: 120, fontWeight: '600' },
  spacer: { flex: 1 },
  iconBtn: { marginLeft: 16 },
});
