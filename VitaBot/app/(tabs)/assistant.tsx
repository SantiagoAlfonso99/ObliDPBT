import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
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
};

/* ─── Tipos ───────────────────────────── */
type Msg = { id: string; from: 'user' | 'bot'; text: string };

/* ─── Componente principal ───────────── */
export default function AssistantScreen() {
const [messages, setMessages] = useState<Msg[]>([
  // 1) Saludo inicial del bot
  { id: 'b0', from: 'bot', text: '¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte?' },

  // 2) Pregunta del paciente
  { id: 'u0', from: 'user', text: 'Mi análisis de sangre del 12-06-2025, ¿es malo o bueno? ¿Qué debería hacer para mejorar mis resultados?' },

  // 3) Respuesta simulada del bot
  { id: 'b1', from: 'bot', text:
      'He revisado tu estudio: la mayoría de los parámetros están dentro de rango, salvo el colesterol total (215 mg/dL) y los triglicéridos (185 mg/dL).\n\nPara mejorarlos te sugiero:\n• Aumentar frutas, verduras y fibra.\n• Reducir alimentos fritos y azúcares simples.\n• Hacer actividad física al menos 150 min/semana.\n• Consultar a tu médico para un control en 3 meses.' },
]);
  const [input, setInput] = useState('');
  const flatRef = useRef<FlatList<Msg>>(null);

  /* Scroll al último mensaje al agregar uno */
  useEffect(() => {
    flatRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  /* Enviar mensaje */
  const send = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { id: Date.now().toString(), from: 'user', text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    botReply(userMsg.text);
  };

  /* Simular respuesta del bot */
  const botReply = (prompt: string) => {
    setTimeout(() => {
      const answer: Msg = {
        id: Date.now().toString() + 'b',
        from: 'bot',
        text: `Entiendo tu pregunta sobre "${prompt}". (Respuesta simulada)`,
      };
      setMessages((m) => [...m, answer]);
      /** Aquí reemplazá el setTimeout por fetch/axios:
       *  const { data } = await axios.post('/api/assistant', { prompt });
       *  setMessages(m => [...m, { id: Date.now().toString(), from:'bot', text:data.reply }]);
       */
    }, 1000);
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(255,248,241,0.93)', 'rgba(255,248,241,0.93)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Ionicons name="chevron-back" size={28} color={colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asistente</Text>
      </View>

      {/* CHAT + INPUT */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <Bubble msg={item} />}
        />

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            onPress={() => alert('Grabación de voz pendiente')}
            style={styles.micBtn}
          >
            <Ionicons name="mic-outline" size={22} color={colors.navy} />
          </TouchableOpacity>

          <TextInput
            placeholder="Escribí tu mensaje..."
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
            returnKeyType="send"
          />

          <TouchableOpacity onPress={send} style={styles.sendBtn}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

/* ─── Burbuja de chat ────────────────── */
function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.from === 'user';
  return (
    <View style={[styles.bubbleRow, isUser && { justifyContent: 'flex-end' }]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? colors.navy : '#fff',
            borderTopRightRadius: isUser ? 0 : 16,
            borderTopLeftRadius: isUser ? 16 : 0,
          },
        ]}
      >
        <Text style={{ color: isUser ? '#fff' : '#333', fontSize: 15 }}>
          {msg.text}
        </Text>
      </View>
    </View>
  );
}

/* ─── Estilos ─────────────────────────── */
const { width } = Dimensions.get('window'); // si lo necesitás luego
const styles = StyleSheet.create({
  bg: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: '4%',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.navy },

  list: { paddingHorizontal: '4%', paddingBottom: 16, paddingTop: 8 },

  bubbleRow: { flexDirection: 'row', marginVertical: 4 },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  /* Input */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  micBtn: {
    backgroundColor: colors.orange,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  textInput: { flex: 1, paddingVertical: 6, fontSize: 15 },
  sendBtn: {
    backgroundColor: colors.navy,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});