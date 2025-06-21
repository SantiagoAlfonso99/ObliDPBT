import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

/* ─── Fondo & paleta ──────────────────── */
const BG = require('../../assets/images/login-pattern.png');

const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
  red:    '#FF9B9B',
};

/* ─── Mock de datos ───────────────────── */
type ApptStatus = 'Pendiente' | 'Confirmado' | 'Cancelado';

const MOCK: Record<string, any> = {
  '1': {
    name:     'Análisis de sangre',
    date:     '2025-06-18T08:30:00',
    status:   'Pendiente' as ApptStatus,
    doctor:   'Dra. Laura García',
    center:   'Laboratorio Central, Clínica Unión',
    address:  'Av. Rivera 1234, Montevideo',
    notes:    'Ayuno de 8 h. Hidratate con agua. Llevar documento de identidad.',
  },
  '2': { /* … otro turno … */ },
};

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState<any | null>(null);

  /* Simula fetch */
  useEffect(() => {
    setTimeout(() => {
      setData(MOCK[id] ?? null);
      setLoading(false);
    }, 600);
  }, [id]);

  /* Helpers */
  const statusColor = (s: ApptStatus) =>
    s === 'Confirmado' ? colors.mint : s === 'Cancelado' ? colors.red : colors.orange;

  const handleAction = (msg: string) => Alert.alert(msg, 'Acción pendiente 😅');

  const openMaps = () => {
    if (!data?.address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`;
    Linking.openURL(url);
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
        <Text style={{ color: colors.navy, fontSize: 18 }}>Turno no encontrado</Text>
      </View>
    );
  }

  /* ─── UI ────────────────────────────── */
  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.94)', 'rgba(255,248,241,0.94)']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={28} color={colors.navy} />
        </TouchableOpacity>

        {/* Título & estado */}
        <Text style={styles.title}>{data.name}</Text>
        <View style={[styles.badge, { backgroundColor: statusColor(data.status) }]}>
          <Text style={styles.badgeTxt}>{data.status}</Text>
        </View>

        {/* Meta */}
        <MetaRow icon="calendar" text={new Date(data.date)
          .toLocaleString('es-UY', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
        />
        <MetaRow icon="person"   text={data.doctor} />
        <MetaRow icon="business" text={data.center} />
        <TouchableOpacity onPress={openMaps}>
          <MetaRow icon="location" text={data.address} link />
        </TouchableOpacity>

        {/* Botones acción (solo si no está cancelado) */}
        {data.status !== 'Cancelado' && (
          <View style={styles.btnRow}>
            {data.status === 'Pendiente' && (
              <ActionBtn
                label="Confirmar"
                icon="checkmark"
                color={colors.mint}
                onPress={() => handleAction('Confirmar')}
              />
            )}
            {data.status !== 'Cancelado' && (
              <ActionBtn
                label="Reprogramar"
                icon="refresh"
                color={colors.orange}
                onPress={() => handleAction('Reprogramar')}
              />
            )}
            {data.status !== 'Cancelado' && (
              <ActionBtn
                label="Cancelar"
                icon="close"
                color={colors.red}
                onPress={() => handleAction('Cancelar')}
              />
            )}
          </View>
        )}

        {/* Instrucciones */}
        {data.notes && (
          <>
            <Text style={styles.sectionTitle}>Instrucciones</Text>
            <Text style={styles.paragraph}>{data.notes}</Text>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

/* ─── Sub-componentes ─────────────────── */

function MetaRow({ icon, text, link=false }:{
  icon: any; text: string; link?: boolean;
}) {
  return (
    <View style={styles.meta}>
      <Ionicons name={icon} size={20} color={colors.navy} style={{marginRight:8}} />
      <Text style={[styles.metaTxt, link && { textDecorationLine:'underline' }]}>{text}</Text>
    </View>
  );
}

function ActionBtn({ label, icon, color, onPress }:{
  label: string; icon: any; color: string; onPress: ()=>void;
}) {
  return (
    <TouchableOpacity style={[styles.action, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.navy} style={{ marginRight:6 }}/>
      <Text style={styles.actionTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ─── Estilos ─────────────────────────── */
const styles = StyleSheet.create({
  bg: { flex:1 },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },

  container:{ paddingTop:32, paddingBottom:80, paddingHorizontal:'6%' },
  back:{ marginBottom:12 },

  title:{ fontSize:26, fontWeight:'700', color:colors.navy, marginBottom:4 },
  badge:{ alignSelf:'flex-start', paddingHorizontal:12, paddingVertical:6, borderRadius:14, marginBottom:16 },
  badgeTxt:{ fontSize:12, fontWeight:'700', color:colors.navy },

  meta:{ flexDirection:'row', alignItems:'center', marginBottom:6 },
  metaTxt:{ fontSize:15, color:'#555', flexShrink:1 },

  btnRow:{ flexDirection:'row', marginTop:20, marginBottom:8, flexWrap:'wrap' },
  action:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:10,
    paddingHorizontal:18,
    borderRadius:26,
    marginRight:8,
    marginBottom:8,
    shadowColor:'#000',shadowOffset:{width:0,height:2},
    shadowOpacity:0.12,shadowRadius:3,elevation:3,
  },
  actionTxt:{ fontSize:14, fontWeight:'600', color:colors.navy },

  sectionTitle:{ fontSize:20, fontWeight:'700', color:colors.navy, marginTop:24, marginBottom:6 },
  paragraph:{ fontSize:15, color:'#444', lineHeight:22 },
});