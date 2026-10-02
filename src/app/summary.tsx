import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { saveMatch } from '@/services/history';

export default function SummaryScreen() {
  const params = useLocalSearchParams<{ total?: string; max?: string; mode?: string }>();
  const total = Number(params.total ?? 0);
  const max = Number(params.max ?? 0);
  const mode = params.mode ?? 'classic';
  const saved = useRef(false);

  // O ref evita salvar a mesma partida duas vezes se o efeito rodar de novo.
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    saveMatch({ date: new Date().toISOString(), mode, total, max });
  }, [mode, total, max]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>{mode === 'daily' ? 'Desafio do dia' : 'Partida'}</Text>
        <Text style={styles.total}>{total.toLocaleString('pt-BR')}</Text>
        <Text style={styles.label}>de {max.toLocaleString('pt-BR')} pontos</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => router.replace('/game')}>
          <Text style={styles.buttonText}>Nova partida</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Início</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 48,
    backgroundColor: COLORS.background,
  },
  card: {
    alignItems: 'center',
    gap: 4,
    marginTop: 32,
    padding: 32,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  label: { fontSize: 16, color: COLORS.muted },
  total: { fontSize: 48, fontWeight: '800', color: COLORS.primary },
  buttons: { gap: 12 },
  button: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  secondary: { backgroundColor: COLORS.dark },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
