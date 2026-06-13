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
import { apiRegister } from '../api/auth';
import { getToken } from '../storage/token';
import { authStyles as s } from '../theme/authStyles';

export function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
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
      await apiRegister(name.trim(), email.trim(), password);
      navigation.replace('Login');
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
          <Text style={s.title}>Hesap oluştur</Text>
          <Text style={s.subtitle}>Timorize&apos;ye katılın</Text>

          <Text style={s.label}>Ad</Text>
          <TextInput
            style={s.input}
            placeholder="Adınız"
            placeholderTextColor="#525252"
            value={name}
            onChangeText={setName}
          />

          <Text style={s.label}>E-posta</Text>
          <TextInput
            style={s.input}
            placeholder="E-posta"
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
            placeholder="Şifre"
            placeholderTextColor="#525252"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          {error ? <Text style={s.error}>{error}</Text> : null}

          <Pressable
            style={[s.submit, loading && s.submitDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={s.submitText}>{loading ? 'Kaydediliyor…' : 'Kayıt ol'}</Text>
          </Pressable>

          <View style={s.footer}>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={s.footerLink}>Zaten hesabınız var mı? Giriş</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
