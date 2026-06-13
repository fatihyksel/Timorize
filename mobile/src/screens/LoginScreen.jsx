import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiLogin } from '../api/auth';
import { getToken } from '../storage/token';
import { setUserId } from '../storage/user';
import { authStyles as s } from '../theme/authStyles';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getToken().then((token) => {
      if (token) navigation.replace('Dashboard');
      setChecking(false);
    });
  }, [navigation]);

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const { token, user } = await apiLogin(email.trim(), password);
      if (user?._id) await setUserId(user._id);
      if (token) navigation.replace('Dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <View style={[s.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.card}>
          <View style={s.logo}>
            <Text style={s.logoMark}>T</Text>
          </View>
          <Text style={s.title}>Timorize&apos;ye hoş geldiniz</Text>
          <Text style={s.subtitle}>Zamanınızı planlayın, odaklanın</Text>

          <Text style={s.label}>E-posta</Text>
          <TextInput
            style={s.input}
            placeholder="E-posta adresinizi girin…"
            placeholderTextColor="#525252"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={s.label}>Şifre</Text>
          <TextInput
            style={s.input}
            placeholder="Şifreniz"
            placeholderTextColor="#525252"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          {error ? <Text style={s.error}>{error}</Text> : null}

          <Pressable
            style={[s.submit, loading && s.submitDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={s.submitText}>
              {loading ? 'Giriş yapılıyor…' : 'E-posta ile giriş yap'}
            </Text>
          </Pressable>

          <View style={s.footer}>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={s.footerLink}>Hesap oluştur</Text>
            </Pressable>
            <Text style={s.footerDot}> · </Text>
            <Text style={s.footerMuted}>Kurumsal SSO (yakında)</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
