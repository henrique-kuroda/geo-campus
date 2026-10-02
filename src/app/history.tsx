import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';
import { loadHistory, type MatchRecord } from '@/services/history';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export default function HistoryScreen() {
  const [history, setHistory] = useState<MatchRecord[] | null>(null);

  useEffect(() => {
    loadHistory().then(setHistory);
  }, []);

  if (history === null) return null;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={history}
      keyExtractor={item => item.date}
      ListEmptyComponent={<Text style={styles.empty}>Nenhuma partida jogada ainda.</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View>
            <Text style={styles.mode}>{item.mode === 'daily' ? 'Desafio do dia' : 'Partida'}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          </View>
          <Text style={styles.total}>
            {item.total.toLocaleString('pt-BR')}
            {item.max ? (
              <Text style={styles.date}>{` / ${item.max.toLocaleString('pt-BR')}`}</Text>
            ) : null}
          </Text>
        </View>
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
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  mode: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  date: { fontSize: 13, color: COLORS.muted },
  total: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
});
