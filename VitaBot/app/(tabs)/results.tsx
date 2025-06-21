import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

/* ─── Assets & colores ─────────────────── */
const BG = require('../../assets/images/login-pattern.png');

const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
  red:    '#FF7D7D',
};

/* ─── Tipo de dato ─────────────────────── */
type Result = {
  id:         string;
  name:       string;
  date:       string; // ISO 8601
  status:     'Normal' | 'Anormal';
  shortDesc?: string;
};

/* ─── Componente principal ─────────────── */
export default function ResultsScreen() {
  const [loading, setLoading]     = useState(true);
  const [results, setResults]     = useState<Result[]>([]);

  /* Simulación de llamada a backend */
  useEffect(() => {
    setTimeout(() => {
      setResults([
        {
          id:    '1',
          name:  'Electrocardiograma',
          date:  '2025-06-12',
          status:'Normal',
          shortDesc: 'Sin cambios significativos',
        },
        {
          id:    '2',
          name:  'Radiografía de Tórax',
          date:  '2025-05-21',
          status:'Anormal',
          shortDesc: 'Hallazgo compatible con...',
        },
        {
          id:    '3',
          name:  'Analítica de sangre',
          date:  '2025-05-01',
          status:'Normal',
        },
      ]);
      setLoading(false);
    }, 1200); // simula delay
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.92)', 'rgba(255,248,241,0.92)']}
        style={StyleSheet.absoluteFillObject}
      />

      <FlatList
        data={results}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ResultCard result={item} />}
        ListHeaderComponent={() => (
          <Text style={styles.title}>Resultados</Text>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ImageBackground>
  );
}

/* ─── Tarjeta de resultado ─────────────── */
function ResultCard({ result }: { result: Result }) {
  const statusColor = result.status === 'Normal' ? colors.mint : colors.red;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '../results/[id]', params: { id: result.id } })}
    >
      <Ionicons
        name="document-text-outline"
        size={28}
        color={colors.navy}
        style={{ marginRight: 12 }}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.cardName}>{result.name}</Text>
        <Text style={styles.cardDate}>
          {new Date(result.date).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Text>

        {result.shortDesc && (
          <Text
            style={styles.cardDesc}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {result.shortDesc}
          </Text>
        )}
      </View>

      <View style={[styles.badge, { backgroundColor: statusColor }]}>
        <Text style={styles.badgeTxt}>{result.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ─── Estilos ─────────────────────────── */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  list: {
    paddingTop: 48,
    paddingHorizontal: '5%',
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 24,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 4,
  },
  cardName: { fontSize: 16, fontWeight: '600', color: colors.navy },
  cardDate: { fontSize: 13, color: '#666', marginTop: 2 },
  cardDesc: { fontSize: 13, color: '#888', marginTop: 2 },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  badgeTxt: { color: colors.navy, fontWeight: '700', fontSize: 12 },
});