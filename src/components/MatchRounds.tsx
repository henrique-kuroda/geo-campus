import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { GAME_CONFIG } from '@/game/config';
import type { RoundResult } from '@/game/types';

type Props = {
  rounds: RoundResult[];
};

// Lista rodada a rodada: local, distância do palpite e pontos (com barra proporcional).
export function MatchRounds({ rounds }: Props) {
  return (
    <View style={styles.list}>
      {rounds.map((round, index) => (
        <View key={`${round.placeId}-${index}`} style={styles.row}>
          <Text style={styles.index}>{index + 1}</Text>
          <View style={styles.grow}>
            <Text style={styles.name}>{round.placeName}</Text>
            <Text style={styles.distance}>
              {`${round.distance.toLocaleString('pt-BR')} m do local certo`}
            </Text>
            <View style={styles.track}>
              <View
                style={[styles.bar, { width: `${(round.score / GAME_CONFIG.maxScore) * 100}%` }]}
              />
            </View>
          </View>
          <Text style={styles.score}>{round.score.toLocaleString('pt-BR')}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  index: {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  grow: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  distance: { fontSize: 13, color: COLORS.muted },
  track: {
    height: 4,
    marginTop: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: COLORS.primarySoft,
  },
  bar: { height: 4, backgroundColor: COLORS.primary },
  score: { minWidth: 48, textAlign: 'right', fontSize: 16, fontWeight: '700', color: COLORS.primary },
});
