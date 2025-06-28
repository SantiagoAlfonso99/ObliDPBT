import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

/* Fondo & paleta */
const BG = require('../../assets/images/login-pattern.png');
const colors = {
  cream:  '#FFF8F1',
  navy:   '#0B2C70',
  mint:   '#CFE9DF',
  orange: '#FAD7AF',
  red:    '#FF9B9B',
    grey:   '#F3F4F6', 
};

/* Mock de datos */
const SPECIALTIES       = ['Cardiología', 'Dermatología', 'Clínica Médica'];
const PROFESSIONALS: any = {
  Cardiología:    ['Dr. Pérez', 'Dra. García'],
  Dermatología:   ['Dra. Alonso'],
  'Clínica Médica':['Dr. Fernández', 'Dra. Suárez'],
};

/* Próximos 7 días */
const nextDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

/* Mock de horarios disponibles (por día) */
function mockSlots(date: Date) {
  const base = date.getDay() % 2 ? ['09:00', '09:30', '10:00'] : ['14:00', '14:30', '15:00'];
  return base.length ? base : ['Sin disponibilidad'];
}

export default function NewAppointment() {
  const [specialty, setSpec]   = useState(SPECIALTIES[0]);
  const [doctor,    setDoc]    = useState(PROFESSIONALS[SPECIALTIES[0]][0]);
  const [dayIdx,    setDayIdx] = useState(0);            // índice en nextDays
  const [slot,      setSlot]   = useState('');

  /* Actualizar doctor cuando cambia especialidad */
  useEffect(() => {
    const list = PROFESSIONALS[specialty];
    setDoc(list[0]);
  }, [specialty]);

  const slots = mockSlots(nextDays[dayIdx]);

  const handleConfirm = () => {
    if (!slot) return Alert.alert('Elegí un horario');
    const fecha = nextDays[dayIdx].toLocaleDateString('es-UY');
    Alert.alert(
      'Confirmar turno',
      `Especialidad: ${specialty}\nProfesional: ${doctor}\n${fecha} ${slot}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => {
            Alert.alert('Turno agendado', '¡Nos vemos pronto!'); 
            router.back();
          } 
        },
      ]
    );
  };

  return (
    <ImageBackground source={BG} style={{ flex:1 }} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.94)', 'rgba(255,248,241,0.94)']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Especialidad */}
        <View style={styles.card}>
          <Text style={styles.label}>Especialidad</Text>
          <Picker
            style={styles.picker}
            selectedValue={specialty}
            onValueChange={setSpec}
          >
            {SPECIALTIES.map(s => <Picker.Item key={s} label={s} value={s} />)}
          </Picker>
        </View>

        {/* Profesional */}
        <View style={styles.card}>
          <Text style={styles.label}>Profesional</Text>
          <Picker
            style={styles.picker}
            selectedValue={doctor}
            onValueChange={setDoc}
          >
            {PROFESSIONALS[specialty].map((d: string) => (
            <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>

        {/* Día */}
        <View style={styles.card}>
          <Text style={styles.label}>Día</Text>
          <Picker
            style={styles.picker}
            selectedValue={dayIdx}
            onValueChange={setDayIdx}
          >
            {nextDays.map((d, i) => (
              <Picker.Item
                key={i}
                label={d.toLocaleDateString('es-UY', { weekday:'short', day:'2-digit', month:'short' })}
                value={i}
              />
            ))}
          </Picker>
        </View>

        {/* Horarios */}
        <View style={styles.card}>
          <Text style={styles.label}>Horario</Text>
          <View style={styles.slotBox}>
            {slots.map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.slot, slot===h && styles.slotActive]}
                disabled={h==='Sin disponibilidad'}
                onPress={() => setSlot(h)}
              >
                <Text style={[styles.slotTxt, h==='Sin disponibilidad' && { color:'#888' }, slot===h && styles.slotTxtActive]}>
                  {h}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Confirmar */}
        <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
          <Ionicons name="checkmark-circle" size={22} color="#fff" style={{ marginRight:6 }}/>
          <Text style={styles.btnTxt}>Agendar turno</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

/* ─── Estilos ────────────────────────── */
const styles = StyleSheet.create({
  scroll:{ padding:'6%', paddingBottom:100 },
  card:{
    backgroundColor:'#FFF',
    borderRadius:18,
    padding:14,
    marginBottom:14,
    shadowColor:'#000',
    shadowOffset:{width:0,height:3},
    shadowOpacity:0.08,
    shadowRadius:5,
    elevation:3,
  },
  label:{ fontSize:14, fontWeight:'600', color:colors.navy, marginBottom:6 },
  picker:{ backgroundColor:colors.grey, borderRadius:10 },
  slotBox:{ flexDirection:'row', flexWrap:'wrap', gap:10 },
  slot:{
    paddingVertical:6, paddingHorizontal:14,
    backgroundColor:colors.grey,
    borderRadius:14,
  },
  slotActive:{ backgroundColor:colors.navy },
  slotTxt:{ fontSize:14, color:colors.navy },
  slotTxtActive:{ color:'#fff', fontWeight:'600' },

  btn:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:20,
    backgroundColor:colors.navy,
    borderRadius:26,
    paddingVertical:12,
    shadowColor:'#000',
    shadowOffset:{width:0,height:3},
    shadowOpacity:0.12,
    shadowRadius:4,
    elevation:4,
  },
  btnTxt:{ color:'#fff', fontSize:15, fontWeight:'600' },
});