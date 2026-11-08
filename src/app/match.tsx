import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MatchRounds } from '@/components/MatchRounds';
import { ScoreCard } from '@/components/ScoreCard';
import { COLORS } from '@/constants/theme';
import type { MatchRecord } from '@/game/types';
import { findMatch } from '@/services/history';

// Detalhes de uma partida aberta a partir do histórico.
export default function MatchScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const [match, setMatch] = useState<MatchRecord | null | undefined>(undefined);

  useEffect(() => {
    if (date) findMatch(date).then(found => setMatch(found ?? null));
  }, [date]);

  if (match === undefined) return null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      {match === null ? (
        <Text style={styles.message}>Partida não encontrada.</Text>
      ) : (
        <>
          <ScoreCard match={match} showDate />
          <Text style={styles.sectionLabel}>RODADAS</Text>
          {match.rounds ? (
            <MatchRounds rounds={match.rounds} />
          ) : (
            <Text style={styles.message}>
              Esta partida foi jogada antes de o app guardar as rodadas.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { gap: 12, padding: 20 },
  sectionLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.muted,
  },
  message: { marginTop: 8, textAlign: 'center', fontSize: 15, color: COLORS.muted },
});
