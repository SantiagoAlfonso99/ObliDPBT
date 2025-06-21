import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Dimensions, Alert, TextInput,
  ImageBackground, Image, ColorValue,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import Typical from 'react-native-typical';

/* ─── Assets ─────────────────────────────── */
const PATTERN     = require('../assets/images/login-pattern.png');
const GOOGLE_LOGO = require('../assets/images/google-logo.png');

WebBrowser.maybeCompleteAuthSession();

/* Gradientes translúcidos */
const gradientSets: [ColorValue, ColorValue, ColorValue][] = [
  ['rgba(219,234,254,0.7)', 'rgba(240,244,255,0.7)', 'rgba(255,255,255,0.7)'],
  ['rgba(255,224,224,0.7)', 'rgba(255,244,244,0.7)', 'rgba(255,255,255,0.7)'],
  ['rgba(224,247,255,0.7)', 'rgba(209,250,255,0.7)', 'rgba(255,255,255,0.7)'],
];

export default function LoginScreen() {
  /* ─── Estado ─────────────────────────── */
  const [loading, setLoading]          = useState(false);
  const [gradientIndex, setGradientId] = useState(0);
  const [email, setEmail]              = useState('');
  const [password, setPassword]        = useState('');

  /* Google auth */
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:     '1023559522000-070k0bp85712drrtu5i1pvd9n78lu29t.apps.googleusercontent.com',
    androidClientId: '1023559522000-6ucq2ifgjr5i8dttn17vpniduvitepkf.apps.googleusercontent.com',
    webClientId:     '1023559522000-2q9erg8jmhn7pjp7d0mq4qkoduec0qrc.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  });

  /* Animar gradiente */
  useEffect(() => {
    const id = setInterval(() => setGradientId(i => (i + 1) % gradientSets.length), 8000);
    return () => clearInterval(id);
  }, []);

  /* Manejar respuesta de Google */
  useEffect(() => {
    if (!response) return;
    setLoading(true);
    // Aquí normalmente validarías el token con tu backend.
    router.replace('/(tabs)');
  }, [response]);

  /* Ingreso tradicional (mock → siempre OK) */
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 800); // simula delay
  };

  return (
    <ImageBackground source={PATTERN} style={styles.bgImage} resizeMode="cover">
      <LinearGradient
        colors={gradientSets[gradientIndex]}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.center}>
        <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
          <Animatable.View animation="bounceIn" duration={1000}>
            <Ionicons name="medkit" size={64} color="#0B2C70" />
          </Animatable.View>

          <Text style={styles.title}>VitaBot</Text>

          {/* Frases animadas */}
          <View style={styles.typingContainer}>
            <Typical
              steps={[
                'Consulta tus resultados al instante', 1500,
                'Reprogramá o cancelá tu turno',        1500,
                'Recibí recordatorios personalizados 🏥',1500,
                'Hablá con tu asistente de voz',        1500,
                'Evaluá tu atención recibida',          1500,
              ]}
              loop={Infinity}
              style={styles.typing}
            />
          </View>

          {/* Inputs */}
          <TextInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {/* Botón Ingresar */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.loginText}>Ingresar</Text>}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} /><Text style={styles.dividerText}>o</Text><View style={styles.line} />
          </View>

          {/* Google */}
          <TouchableOpacity
            disabled={!request || loading}
            style={[styles.googleBtn, loading && { opacity: 0.6 }]}
            onPress={() => promptAsync()}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#666" />
              : <>
                  <Image source={GOOGLE_LOGO} style={styles.logoGoogle} />
                  <Text style={styles.btnText}>Ingresar con Google</Text>
                </>}
          </TouchableOpacity>

          {/* Registrarse */}
          <TouchableOpacity onPress={() => Alert.alert('Registrate', 'Pantalla de registro (pendiente)')}>
            <Text style={styles.register}>¿No tenés cuenta? <Text style={{ fontWeight: 'bold' }}>Registrate</Text></Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ImageBackground>
  );
}

/* ─── Estilos ───────────────────────────── */
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  bgImage:  { flex: 1 },
  center:   { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    width: width * 0.85,
    paddingVertical: 40,
    paddingHorizontal: 28,
    backgroundColor: '#FFF8F1',
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18, shadowRadius: 8, elevation: 8,
  },

  title: { fontSize: 34, fontWeight: 'bold', color: '#0B2C70', marginTop: 12 },

  typingContainer: { marginTop: 8, marginBottom: 24 },
  typing: { fontSize: 15, color: '#444', fontStyle: 'italic', textAlign: 'center' },

  input: {
    width: '100%', backgroundColor: '#fff', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 16, fontSize: 15,
    borderWidth: 1, borderColor: '#DDD', marginBottom: 12,
  },

  loginBtn: {
    width: '100%', backgroundColor: '#0B2C70', borderRadius: 50,
    paddingVertical: 14, alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3, elevation: 3,
  },
  loginText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 8, color: '#666' },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 50, width: '100%', borderWidth: 1, borderColor: '#D0D0D0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 4,
    marginBottom: 12,
  },
  logoGoogle: { width: 40, height: 40, marginRight: 10, resizeMode: 'contain' },
  btnText:    { color: '#444', fontSize: 16, fontWeight: '600' },

  register: { marginTop: 4, color: '#444', fontSize: 14 },
});