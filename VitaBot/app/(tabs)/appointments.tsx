import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

/* ─── Assets y colores ───────────────── */
const BG = require('../../assets/images/login-pattern.png');

const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
  red:    '#FF9B9B',
  grey:   '#E1E1E1',
};

/* ─── Mock data ──────────────────────── */
type ApptStatus = 'Pendiente' | 'Confirmado' | 'Cancelado';
type Appointment = {
  id:     string;
  name:   string;
  date:   string;   // ISO fecha + hora
  status: ApptStatus;
};

const MOCK_APPOINTMENTS: Appointment[] = [
  { id:'1', name:'Análisis de sangre',   date:'2025-06-18T08:30:00', status:'Pendiente' },
  { id:'2', name:'Radiografía de Tórax', date:'2025-05-10T13:00:00', status:'Confirmado'},
  { id:'3', name:'Control clínico',      date:'2025-04-15T09:00:00', status:'Cancelado' },
  { id:'4', name:'ECG',                  date:'2024-12-02T10:15:00', status:'Confirmado'},
];

export default function AppointmentsScreen() {
  const [segment, setSegment] = useState<'next'|'past'>('next');
  const [list, setList]       = useState<Appointment[]>([]);

  useEffect(() => {
    // En producción filtra a partir de Date.now()
    const now = new Date();
    const upcoming = MOCK_APPOINTMENTS.filter(a => new Date(a.date) >= now);
    const past     = MOCK_APPOINTMENTS.filter(a => new Date(a.date) <  now);
    setList(segment === 'next' ? upcoming : past);
  }, [segment]);

  /* Acciones mock */
  const handleAction = (label: string) => Alert.alert(label, 'Función pendiente.');

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.92)', 'rgba(255,248,241,0.92)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Segmento Próximos / Pasados */}
      <View style={styles.segmentBox}>
        <SegButton
          label="Próximos"
          active={segment === 'next'}
          onPress={() => setSegment('next')}
        />
        <SegButton
          label="Pasados"
          active={segment === 'past'}
          onPress={() => setSegment('past')}
        />
      </View>

      {/* Lista */}
      <FlatList
        data={list}
        keyExtractor={(a)=>a.id}
        contentContainerStyle={styles.flat}
        ItemSeparatorComponent={()=><View style={{height:12}}/>}
        renderItem={({item})=><ApptCard appt={item} onAction={handleAction}/>}
        ListEmptyComponent={()=><Text style={styles.empty}>Sin turnos</Text>}
      />
    </ImageBackground>
  );
}

/* ─── Botón de segmento ───────────────── */
function SegButton({label, active, onPress}:{label:string;active:boolean;onPress:()=>void}) {
  return (
    <TouchableOpacity
      style={[styles.seg, active && styles.segActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.segText, active && styles.segTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ─── Tarjeta turno ───────────────────── */
function ApptCard({ appt, onAction }:{
  appt: Appointment;
  onAction:(label:string)=>void;
}) {
  const statusColor = {
    Pendiente:  colors.orange,
    Confirmado: colors.mint,
    Cancelado:  colors.red,
  }[appt.status];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={()=>router.push({pathname:'../appointments/[id]',params:{id:appt.id}})}
    >
      {/* Izquierda: ícono */}
      <Ionicons
        name="calendar-outline"
        size={28}
        color={colors.navy}
        style={{marginRight:12}}
      />

      {/* Centro: info */}
      <View style={{flex:1}}>
        <Text style={styles.cardName}>{appt.name}</Text>
        <Text style={styles.cardDate}>
          {new Date(appt.date)
             .toLocaleString('es-UY',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
        </Text>
      </View>

      {/* Derecha: acciones rapido para próximos */}
      {appt.status === 'Pendiente' && (
        <View style={styles.actionsRow}>
        <TouchableOpacity
            onPress={() => onAction('Confirmar')}
            style={[styles.quickBtn, { marginRight: 6 }]}
        >
            <Ionicons name="checkmark" size={20} color={colors.navy} />
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => onAction('Cancelar')}
            style={styles.quickBtn}
        >
            <Ionicons name="close" size={20} color={colors.navy} />
        </TouchableOpacity>
        </View>
      )}

      {/* Badge estado */}
      <View style={[styles.badge,{backgroundColor:statusColor}]}>
        <Text style={styles.badgeTxt}>{appt.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ─── Estilos ─────────────────────────── */
const {width}=Dimensions.get('window');
const styles=StyleSheet.create({
  bg:{flex:1},
  segmentBox:{
    flexDirection:'row',
    alignSelf:'center',
    backgroundColor:'#FFF',
    padding:4,
    borderRadius:30,
    marginTop:32,
    elevation:3,
    shadowColor:'#000',shadowOffset:{width:0,height:2},
    shadowOpacity:0.12,shadowRadius:4,
  },
  seg:{
    paddingVertical:8,
    paddingHorizontal:28,
    borderRadius:26,
  },
  segActive:{
    backgroundColor:colors.navy,
  },
  segText:{fontSize:15,color:colors.navy,fontWeight:'600'},
  segTextActive:{color:'#fff'},
  flat:{
    paddingHorizontal:'5%',
    paddingTop:24,
    paddingBottom:80,
  },
  empty:{textAlign:'center',marginTop:40,fontSize:16,color:'#555'},

  card:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#FFF',
    padding:18,
    borderRadius:22,
    shadowColor:'#000',shadowOffset:{width:0,height:3},
    shadowOpacity:0.1,shadowRadius:4,elevation:4,
  },
  cardName:{fontSize:16,fontWeight:'600',color:colors.navy},
  cardDate:{fontSize:13,color:'#666',marginTop:2},

actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quickBtn: {
    backgroundColor: colors.grey,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },

  badge:{
    position:'absolute',
    top:14,right:14,
    paddingHorizontal:10,paddingVertical:4,
    borderRadius:14,
  },
  badgeTxt:{fontSize:11,fontWeight:'700',color:colors.navy},
});