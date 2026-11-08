import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { formatMatchDate } from '@/components/ScoreCard';
import { COLORS } from '@/constants/theme';
import { modeLabel } from '@/game/modes';
import { loadHistory, type MatchRecord } from '@/services/history';

export default function HistoryScreen() {
  const [history, setHistory] = useState<MatchRecord[] | null>(null);

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  if (history === null) return null;

  return (
    <FlatList
      style={styles.list}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      data={history}
      keyExtractor={item => item.date}
      ListEmptyComponent={<Text style={styles.empty}>Nenhuma partida jogada ainda.</Text>}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => router.push({ pathname: '/match', params: { date: item.date } })}
        >
          <View style={styles.grow}>
            <Text style={styles.mode}>{modeLabel(item.mode)}</Text>
            <Text style={styles.date}>{formatMatchDate(item.date)}</Text>
          </View>
          <Text style={styles.total}>
            {item.total.toLocaleString('pt-BR')}
            {item.max ? (
              <Text style={styles.date}>{` / ${item.max.toLocaleString('pt-BR')}`}</Text>
            ) : null}
          </Text>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            tintColor={COLORS.muted}
            size={14}
          />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: COLORS.background },
  content: { gap: 8, padding: 16 },
  empty: { marginTop: 32, textAlign: 'center', fontSize: 16, color: COLORS.muted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  pressed: { opacity: 0.75 },
  grow: { flex: 1 },
  mode: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  date: { fontSize: 13, color: COLORS.muted },
  total: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
});
