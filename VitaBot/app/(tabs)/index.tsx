import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

/* ─── Assets ───────────────────────────── */
const PATTERN_BG = require('../../assets/images/login-pattern.png'); // el que generamos
const AVATAR     = require('../../assets/images/login-bg.png');

/* ─── Colores base ─────────────────────── */
const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
};

export default function HomeScreen() {
  return (
    <ImageBackground source={PATTERN_BG} style={styles.bg} resizeMode="cover">
      {/* Overlay crema translúcido para contraste */}
      <LinearGradient
        colors={['rgba(255,248,241,0.92)', 'rgba(255,248,241,0.92)']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={AVATAR} style={styles.avatar} />
          <View>
            <Text style={styles.hello}>Hola,</Text>
            <Text style={styles.name}>Pepe</Text>
          </View>
          {/* Campana notificaciones */}
          <TouchableOpacity
            style={styles.bell}
            onPress={() => router.push('./notifications')}
          >
            <Ionicons name="notifications-outline" size={26} color={colors.navy} />
          </TouchableOpacity>
        </View>

        {/* ACCIONES RÁPIDAS */}
        <View style={styles.quickRow}>
          <QuickCard
            label="Resultados"
            icon="clipboard-pulse"
            color={colors.mint}
            onPress={() => router.push('./results')}
          />
          <QuickCard
            label="Turnos"
            icon="calendar-check"
            color={colors.orange}
            onPress={() => router.push('./appointments')}
          />
        </View>

        <View style={styles.quickRow}>
          <QuickCard
            label="Recordatorios"
            icon="pill"
            color={colors.orange}
            onPress={() => router.push('./reminders')}
          />
          <QuickCard
            label="Asistente"
            icon="headset"
            color={colors.mint}
            onPress={() => router.push('./assistant')}
          />
        </View>

        {/* PRÓXIMO TURNO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximo turno</Text>

          <View style={styles.appointmentCard}>
            <Ionicons name="medkit" size={30} color={colors.navy} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.appointmentLabel}>Análisis de sangre</Text>
              <Text style={styles.appointmentDate}>18 jun 2025 · 08:30 h</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('./appointments')}
              style={styles.seeBtn}
            >
              <Text style={styles.seeTxt}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

/* ─── Componente tarjeta rápida ─────────── */
type QuickCardProps = {
  label: string;
  icon:  string;
  color: string;
  onPress: () => void;
};

function QuickCard({ label, icon, color, onPress }: QuickCardProps) {
  return (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: color }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon as any} size={32} color={colors.navy} />
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ─── Estilos ───────────────────────────── */
const { width } = Dimensions.get('window');
const cardSize = (width * 0.9 - 24) / 2; // dos tarjetas por fila

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scroll: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 80,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 28,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginRight: 14,
    borderWidth: 2,
    borderColor: colors.navy,
  },
  hello: { fontSize: 18, color: '#555' },
  name:  { fontSize: 26, fontWeight: '700', color: colors.navy },
  bell:  { marginLeft: 'auto' },

  /* Quick cards */
  quickRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickCard: {
    width: cardSize,
    height: cardSize,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 6,
  },
  quickLabel: { marginTop: 8, fontSize: 15, fontWeight: '600', color: colors.navy },

  /* Secciones */
  section: {
    width: '90%',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 12,
  },

  /* Card turno */
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 4,
  },
  appointmentLabel: { fontSize: 16, fontWeight: '600', color: colors.navy },
  appointmentDate:  { fontSize: 14, color: '#666', marginTop: 2 },
  seeBtn: {
    backgroundColor: colors.navy,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  seeTxt: { color: '#fff', fontSize: 14, fontWeight: '600' },
});