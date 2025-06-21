import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

/* ─── Fondo & paleta ─────────────────── */
const BG = require('../assets/images/login-pattern.png');
const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
  red:    '#FF9B9B',
};

/* ─── Tipos ───────────────────────────── */
type NType = 'Medicación' | 'Turno' | 'Info';
type Notification = {
  id:       string;
  title:    string;
  subtitle: string;
  when:     string; // ISO
  type:     NType;
  read:     boolean;
};

/* ─── Mock data ───────────────────────── */
const MOCK: Notification[] = [
  {
    id: '1',
    title: 'Tomá tu Atorvastatina 10 mg',
    subtitle: 'Dosis de la mañana',
    when: '2025-06-20T08:00:00',
    type: 'Medicación',
    read: false,
  },
  {
    id: '2',
    title: 'Hoy 15:00 h – Análisis de sangre',
    subtitle: 'Laboratorio Central, Clínica Unión',
    when: '2025-06-20T06:00:00',
    type: 'Turno',
    read: false,
  },
  {
    id: '3',
    title: 'Resultado del ECG disponible',
    subtitle: 'Valoración normal',
    when: '2025-06-18T11:00:00',
    type: 'Info',
    read: true,
  },
];

/* ─── Pantalla principal ──────────────── */
export default function NotificationsScreen() {
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => setList(MOCK), []);

  /* Alternar leído/no leído */
  const toggleRead = (id: string) =>
    setList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );

  /* Vaciar notificaciones */
  const clearAll = () =>
    Alert.alert('Borrar todas', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar', style: 'destructive', onPress: () => setList([]) },
    ]);

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.93)', 'rgba(255,248,241,0.93)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Ionicons name="chevron-back" size={28} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.hTitle}>Notificaciones</Text>

        {list.length > 0 && (
          <TouchableOpacity onPress={clearAll} style={{ marginLeft: 'auto' }}>
            <Ionicons name="trash-outline" size={24} color={colors.navy} />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {list.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#666', fontSize: 16 }}>Sin notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={list.sort((a, b) => +new Date(b.when) - +new Date(a.when))}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.flat}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <NotifCard data={item} onToggle={() => toggleRead(item.id)} />
          )}
        />
      )}
    </ImageBackground>
  );
}

/* ─── Tarjeta de notificación ─────────── */
function NotifCard({
  data,
  onToggle,
}: {
  data: Notification;
  onToggle: () => void;
}) {
  /* Ícono según tipo */
  const iconCfg: Record<NType, any> = {
    Medicación: { name: 'pill', color: colors.orange },
    Turno:      { name: 'calendar-check', color: colors.mint },
    Info:       { name: 'information', color: colors.navy },
  };
  const { name, color } = iconCfg[data.type];

  return (
    <TouchableOpacity
      style={[styles.card, !data.read && { backgroundColor: '#FFFDFC' }]}
      activeOpacity={0.85}
      onPress={onToggle}
    >
      <MaterialCommunityIcons
        name={name}
        size={28}
        color={color}
        style={{ marginRight: 12 }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.title,
            data.read && { color: '#777', fontWeight: '400' },
          ]}
        >
          {data.title}
        </Text>
        <Text style={[styles.subtitle, data.read && { color: '#AAA' }]}>
          {data.subtitle}
        </Text>
        <Text style={styles.date}>
          {new Date(data.when).toLocaleString('es-UY', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Punto indicador de no leído */}
      {!data.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

/* ─── Estilos ─────────────────────────── */
const styles = StyleSheet.create({
  bg: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: '4%',
  },
  hTitle: { fontSize: 22, fontWeight: '700', color: colors.navy },

  flat: { paddingHorizontal: '5%', paddingTop: 12, paddingBottom: 80 },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: { fontSize: 15, fontWeight: '600', color: colors.navy },
  subtitle: { fontSize: 13, color: '#555', marginTop: 2 },
  date: { fontSize: 12, color: '#999', marginTop: 2 },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.red,
    marginLeft: 8,
  },
});