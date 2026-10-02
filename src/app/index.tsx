import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Onde foi tirada esta foto?</Text>
        <Text style={styles.subtitle}>
          Veja a foto, marque o ponto no mapa do campus e ganhe até 5000 pontos por rodada.
        </Text>
      </View>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => router.push('/game')}>
          <Text style={styles.buttonText}>Jogar</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => router.push({ pathname: '/game', params: { mode: 'daily' } })}
        >
          <Text style={styles.buttonText}>Desafio do dia</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => router.push('/history')}>
          <Text style={styles.buttonText}>Histórico</Text>
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
  header: { gap: 12, marginTop: 32 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 16, lineHeight: 22, color: COLORS.muted },
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
