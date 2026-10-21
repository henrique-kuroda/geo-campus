import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { modeLabel } from '@/game/modes';
import type { MatchRecord } from '@/game/types';

type Props = {
  match: MatchRecord;
  showDate?: boolean;
};

export const formatMatchDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

// Placar da partida: usado no resumo (logo após jogar) e nos detalhes (vindo do histórico).
export function ScoreCard({ match, showDate = false }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{modeLabel(match.mode)}</Text>
      <Text style={styles.total}>{match.total.toLocaleString('pt-BR')}</Text>
      <Text style={styles.label}>{`de ${match.max.toLocaleString('pt-BR')} pontos`}</Text>
      {showDate && <Text style={styles.date}>{formatMatchDate(match.date)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 4,
    padding: 28,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  label: { fontSize: 16, color: COLORS.muted },
  total: { fontSize: 48, fontWeight: '800', color: COLORS.primary },
  date: { marginTop: 4, fontSize: 13, color: COLORS.muted },
});
