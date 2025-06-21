import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/* ─── Assets y paleta ──────────────────── */
const BG = require('../../assets/images/login-pattern.png');

const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
  red:    '#FF7D7D',
};

/* ─── Mock de datos ────────────────────── */
const MOCK_RESULTS: Record<string, any> = {
  '1': {
    name:  'Electrocardiograma',
    date:  '2025-06-12',
    status:'Normal',
    summary: 'Sin cambios significativos en la repolarización. FC 72 lpm.',
    values: [
      { label: 'Frecuencia cardiaca', value: '72 lpm' },
      { label: 'PR',                  value: '160 ms' },
      { label: 'QT',                  value: '380 ms' },
    ],
    doctor: 'Dra. Laura García',
  },
  '2': {
    name:  'Radiografía de Tórax',
    date:  '2025-05-21',
    status:'Anormal',
    summary: 'Infiltrado basal derecho compatible con neumonía en resolución.',
    values: [
      { label: 'Hallazgo',   value: 'Infiltrado D/B' },
      { label: 'Revisión',   value: 'Requiere control en 15 días' },
    ],
    doctor: 'Dr. José Pérez',
  },
  '3': {
    name:  'Analítica de sangre',
    date:  '2025-05-01',
    status:'Normal',
    summary: 'Todos los parámetros dentro de rango.',
    values: [
      { label: 'Glucemia',         value: '92 mg/dL' },
      { label: 'Colesterol total', value: '174 mg/dL' },
      { label: 'HbA1c',            value: '5.2 %' },
    ],
    doctor: 'Dra. Laura García',
  },
};

export default function ResultDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState<any | null>(null);

  /** Simula llamada al backend */
  useEffect(() => {
    setTimeout(() => {
      setData(MOCK_RESULTS[id] ?? null);
      setLoading(false);
    }, 600);
  }, [id]);

  /* ─── Generar PDF ───────────────────── */
  const handleGeneratePdf = async () => {
    if (!data) return;
    try {
      const html = `
        <html>
          <body style="font-family: Arial; padding: 24px;">
            <h1>${data.name}</h1>
            <p><strong>Fecha:</strong> ${data.date}</p>
            <p><strong>Médico:</strong> ${data.doctor}</p>
            <h2>Resumen</h2>
            <p>${data.summary}</p>
            <h2>Valores</h2>
            <ul>
              ${data.values
                .map((v: any) => `<li><strong>${v.label}:</strong> ${v.value}</li>`)
                .join('')}
            </ul>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert('Error', 'No se pudo generar el PDF.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.navy, fontSize: 18 }}>Informe no encontrado</Text>
      </View>
    );
  }

  /* ─── UI ────────────────────────────── */
  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.93)', 'rgba(255,248,241,0.93)']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Header simple con back */}
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={colors.navy} />
        </TouchableOpacity>

        <Text style={styles.title}>{data.name}</Text>

        <View style={styles.meta}>
          <Ionicons
            name="calendar"
            size={18}
            color={colors.navy}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.metaTxt}>
            {new Date(data.date).toLocaleDateString('es-UY', { day:'2-digit', month:'short', year:'numeric' })}
          </Text>
        </View>

        <View style={styles.meta}>
          <Ionicons name="person" size={18} color={colors.navy} style={{ marginRight: 6 }} />
          <Text style={styles.metaTxt}>{data.doctor}</Text>
        </View>

        {/* Badge estado */}
        <View
          style={[
            styles.badge,
            { backgroundColor: data.status === 'Normal' ? colors.mint : colors.red },
          ]}
        >
          <Text style={styles.badgeTxt}>{data.status}</Text>
        </View>

        {/* Resumen */}
        <Text style={styles.sectionTitle}>Resumen</Text>
        <Text style={styles.paragraph}>{data.summary}</Text>

        {/* Valores */}
        <Text style={styles.sectionTitle}>Valores</Text>
        {data.values.map((v: any, idx: number) => (
          <View key={idx} style={styles.valueRow}>
            <Text style={styles.valueLabel}>{v.label}</Text>
            <Text style={styles.valueVal}>{v.value}</Text>
          </View>
        ))}

        {/* Botón generar PDF */}
        <TouchableOpacity style={styles.pdfBtn} onPress={handleGeneratePdf}>
          <Ionicons name="download-outline" size={22} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.pdfTxt}>Generar PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

/* ─── Estilos ─────────────────────────── */
const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  container: {
    paddingTop: 32,
    paddingBottom: 80,
    paddingHorizontal: '6%',
  },

  back: { marginBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 8,
  },

  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaTxt: { color: '#555', fontSize: 15 },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 6,
    marginBottom: 24,
  },
  badgeTxt: { color: colors.navy, fontWeight: '700' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.navy,
    marginTop: 12,
    marginBottom: 6,
  },
  paragraph: { fontSize: 15, color: '#444', lineHeight: 22 },

  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  valueLabel: { fontSize: 15, color: '#333' },
  valueVal:   { fontSize: 15, fontWeight: '600', color: colors.navy },

  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    backgroundColor: colors.navy,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  pdfTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
});