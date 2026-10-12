import { useEffect, useReducer, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GuessMap } from '@/components/GuessMap';
import { PhotoViewer } from '@/components/PhotoViewer';
import { ResultMap } from '@/components/ResultMap';
import { COLORS } from '@/constants/theme';
import { resolvePhoto } from '@/data/images';
import { placeRepository } from '@/data/repository';
import { GAME_CONFIG } from '@/game/config';
import { gameReducer, initialGameState, totalScore } from '@/game/engine';
import { modeLabel, roundCount } from '@/game/modes';
import { buildRounds, dailySeed, mulberry32 } from '@/game/random';
import type { Place } from '@/game/types';

export default function GameScreen() {
  const { mode = 'classic' } = useLocalSearchParams<{ mode?: string }>();
  const insets = useSafeAreaInsets();
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [places, setPlaces] = useState<Record<string, Place>>({});
  const [mapExpanded, setMapExpanded] = useState(false);

  useEffect(() => {
    placeRepository.getAll().then(list => {
      const random = mode === 'daily' ? mulberry32(dailySeed()) : Math.random;
      setPlaces(Object.fromEntries(list.map(place => [place.id, place])));
      dispatch({ type: 'START', rounds: buildRounds(list, roundCount(mode, list.length), random) });
    });
  }, [mode]);

  useEffect(() => {
    if (state.status === 'finished') {
      const max = state.rounds.length * GAME_CONFIG.maxScore;
      router.replace({
        pathname: '/summary',
        params: { total: String(totalScore(state)), max: String(max), mode },
      });
    }
  }, [state, mode]);

  if (state.status === 'idle') {
    return (
      <View style={[styles.fill, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (state.rounds.length === 0) {
    return (
      <View style={[styles.fill, styles.center, styles.empty]}>
        <Text style={styles.title}>Nenhum local cadastrado ainda</Text>
        <Text style={styles.info}>Rode o script de importação de fotos e tente de novo.</Text>
        <Pressable style={[styles.button, styles.emptyButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const round = state.rounds[state.current];
  const place = places[round.placeId];
  if (!place || state.status === 'finished') return null;

  const confirm = () => {
    dispatch({ type: 'CONFIRM', target: place.coordinate });
    setMapExpanded(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (state.status === 'result' && round.guess) {
    const isLast = state.current + 1 === state.rounds.length;
    return (
      <View style={styles.fill}>
        <ResultMap guess={round.guess} target={place.coordinate} />
        <View style={[styles.panel, { bottom: insets.bottom + 16 }]}>
          <Text style={styles.title}>{place.name}</Text>
          <Text style={styles.info}>{Math.round(round.distance ?? 0)} m do local certo</Text>
          <Text style={styles.score}>{round.score} pontos</Text>
          <Pressable style={styles.button} onPress={() => dispatch({ type: 'NEXT' })}>
            <Text style={styles.buttonText}>{isLast ? 'Ver resultado' : 'Próxima rodada'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const label = mode === 'classic' ? '' : `${modeLabel(mode)} · `;

  return (
    <View style={styles.fill}>
      {/* key por rodada: cada foto nova começa sem zoom e centralizada */}
      <PhotoViewer
        key={state.current}
        source={resolvePhoto(round.photo)}
        showHint={state.current === 0}
      />
      <Text style={[styles.counter, { top: insets.top + 12 }]} pointerEvents="none">
        {`${label}Rodada ${state.current + 1} de ${state.rounds.length}`}
      </Text>
      <View
        style={mapExpanded ? styles.mapLarge : [styles.mapSmall, { bottom: insets.bottom + 16 }]}
      >
        <GuessMap
          guess={state.pendingGuess}
          onGuess={coordinate => dispatch({ type: 'SET_GUESS', coordinate })}
        />
        {!mapExpanded && (
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMapExpanded(true)} />
        )}
      </View>
      {mapExpanded && (
        <View style={[styles.actions, { bottom: insets.bottom + 16 }]}>
          <Pressable
            style={[styles.button, styles.grow, styles.secondary]}
            onPress={() => setMapExpanded(false)}
          >
            <Text style={styles.buttonText}>Ver foto</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.grow, !state.pendingGuess && styles.disabled]}
            disabled={!state.pendingGuess}
            onPress={confirm}
          >
            <Text style={styles.buttonText}>Confirmar palpite</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  empty: { gap: 8, padding: 24, backgroundColor: COLORS.background },
  emptyButton: { alignSelf: 'stretch', marginTop: 16 },
  counter: {
    position: 'absolute',
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    color: '#fff',
    fontWeight: '600',
  },
  mapSmall: {
    position: 'absolute',
    right: 16,
    width: 150,
    height: 150,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  mapLarge: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '75%' },
  actions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    gap: 6,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  info: { fontSize: 15, color: COLORS.muted },
  score: { fontSize: 28, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  button: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  grow: { flex: 1 },
  secondary: { backgroundColor: COLORS.dark },
  disabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
