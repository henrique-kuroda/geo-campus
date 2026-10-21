import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MatchRounds } from '@/components/MatchRounds';
import { ScoreCard } from '@/components/ScoreCard';
import { COLORS } from '@/constants/theme';
import type { MatchRecord } from '@/game/types';
import { findMatch } from '@/services/history';

// A partida já foi salva pela tela do jogo; aqui só é lida pelo identificador (data).
export default function SummaryScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const insets = useSafeAreaInsets();
  const [match, setMatch] = useState<MatchRecord | null>(null);

  useEffect(() => {
    if (date) findMatch(date).then(found => setMatch(found ?? null));
  }, [date]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {match && (
          <>
            <ScoreCard match={match} />
            {match.rounds && (
              <>
                <Text style={styles.sectionLabel}>RODADAS</Text>
                <MatchRounds rounds={match.rounds} />
              </>
            )}
          </>
        )}
      </ScrollView>

      <View style={[styles.buttons, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() => router.replace('/game')}
        >
          <Text style={styles.buttonText}>Nova partida</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Início</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { gap: 12, padding: 20 },
  sectionLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.muted,
  },
  buttons: { gap: 12, paddingHorizontal: 20, paddingTop: 12 },
  button: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  secondary: { backgroundColor: COLORS.dark },
  pressed: { opacity: 0.75 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
