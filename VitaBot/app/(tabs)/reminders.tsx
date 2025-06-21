import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

/* ─── Fondo & paleta ─────────────────── */
const BG = require('../../assets/images/login-pattern.png');
const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
  red:    '#FF9B9B',
};

/* ─── Tipos ───────────────────────────── */
type Reminder = {
  id:       string;
  title:    string;
  when:     string;            // ISO 8601
  active:   boolean;
  done:     boolean;
  kind:     'Medicación' | 'Estudio' | 'Chequeo';
};

/* ─── Data simulada ───────────────────── */
const MOCK: Reminder[] = [
  { id:'1', title:'Tomar Atorvastatina 10 mg', when:'2025-06-20T22:00:00', active:true,  done:false, kind:'Medicación' },
  { id:'2', title:'Control de presión arterial', when:'2025-06-20T08:00:00', active:true,  done:true,  kind:'Chequeo'   },
  { id:'3', title:'Ayuno para análisis de sangre', when:'2025-06-19T22:00:00', active:false, done:false, kind:'Estudio' },
];

/* ─── Componente principal ───────────── */
export default function RemindersScreen() {
  const [list, setList] = useState<Reminder[]>([]);

  useEffect(() => setList(MOCK), []);

  const toggleActive = (id: string) =>
    setList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );

  const markDone = (id: string) =>
    setList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    );

  const addReminder = () => Alert.alert('Crear recordatorio', 'Función pendiente 🙂');

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.93)', 'rgba(255,248,241,0.93)']}
        style={StyleSheet.absoluteFillObject}
      />

      <FlatList
        data={list.sort((a, b) => +new Date(a.when) - +new Date(b.when))}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.flat}
        renderItem={({ item }) => (
          <ReminderCard
            data={item}
            onToggle={() => toggleActive(item.id)}
            onDone={() => markDone(item.id)}
          />
        )}
        ListHeaderComponent={() => (
          <Text style={styles.title}>Recordatorios</Text>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* FAB para crear */}
      <TouchableOpacity style={styles.fab} onPress={addReminder}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </ImageBackground>
  );
}

/* ─── Tarjeta de recordatorio ─────────── */
function ReminderCard({
  data,
  onToggle,
  onDone,
}: {
  data: Reminder;
  onToggle: () => void;
  onDone: () => void;
}) {
  const isToday =
    new Date(data.when).toDateString() === new Date().toDateString();
  const expired = new Date(data.when) < new Date() && !isToday;

  const badgeClr = expired ? colors.red : isToday ? colors.orange : colors.mint;
  const badgeTxt = expired ? 'Vencido' : isToday ? 'Hoy' : 'Próximo';

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.cardTitle,
            data.done && { textDecorationLine: 'line-through', color: '#888' },
          ]}
        >
          {data.title}
        </Text>

        <Text style={styles.time}>
          {new Date(data.when).toLocaleString('es-UY', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>

        <View style={[styles.badge, { backgroundColor: badgeClr }]}>
          <Text style={styles.badgeTxt}>{badgeTxt}</Text>
        </View>
      </View>

      {/* Columnita de acciones */}
      <View style={styles.actions}>
        <Switch
          value={data.active}
          onValueChange={onToggle}
          thumbColor={data.active ? colors.navy : '#ccc'}
          trackColor={{ false: '#ccc', true: colors.mint }}
        />

        <TouchableOpacity
          style={[styles.doneBtn, data.done && { opacity: 0.4 }]}
          onPress={onDone}
          activeOpacity={0.8}
        >
          <Ionicons
            name={data.done ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={24}
            color={colors.navy}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ─── Estilos ─────────────────────────── */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  flat: {
    paddingTop: 48,
    paddingBottom: 80,
    paddingHorizontal: '5%',
  },
  title: { fontSize: 32, fontWeight: '700', color: colors.navy, marginBottom: 24 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.navy },
  time: { fontSize: 13, color: '#666', marginTop: 2 },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 6,
  },
  badgeTxt: { color: colors.navy, fontSize: 11, fontWeight: '700' },

  actions: { alignItems: 'center', marginLeft: 12 },
  doneBtn: { marginTop: 6 },

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    backgroundColor: colors.navy,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});