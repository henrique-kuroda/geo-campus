import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';
import { GAME_CONFIG } from '@/game/config';
import { loadHistory } from '@/services/history';

type Icon = SymbolViewProps['name'];

// iPhone usa SF Symbols; Android e web usam Material Symbols.
const ICONS = {
  map: { ios: 'map.fill', android: 'map', web: 'map' },
  camera: { ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' },
  pin: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  trophy: { ios: 'trophy.fill', android: 'emoji_events', web: 'emoji_events' },
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  calendar: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
} satisfies Record<string, Icon>;

const STEPS: { icon: Icon; text: string }[] = [
  { icon: ICONS.camera, text: 'Veja a foto' },
  { icon: ICONS.pin, text: 'Marque no mapa' },
  { icon: ICONS.trophy, text: `Ganhe até ${GAME_CONFIG.maxScore}` },
];

const today = () => new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [best, setBest] = useState<number | null>(null);

  // Recarrega ao voltar para a tela, para o recorde aparecer logo depois de uma partida.
  useFocusEffect(
    useCallback(() => {
      loadHistory().then(history =>
        setBest(history.length ? Math.max(...history.map(match => match.total)) : null),
      );
    }, []),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <SymbolView name={ICONS.map} tintColor="#fff" size={28} />
        </View>
        <Text style={styles.heroTitle}>Geo Campus</Text>
        <Text style={styles.heroSubtitle}>
          Você conhece mesmo o campus? Descubra onde cada foto foi tirada.
        </Text>
        <View style={styles.recordPill}>
          <SymbolView name={ICONS.trophy} tintColor={COLORS.gold} size={16} />
          <Text style={styles.recordText}>
            {best === null
              ? 'Jogue sua primeira partida!'
              : `Recorde: ${best.toLocaleString('pt-BR')} pontos`}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>COMO JOGAR</Text>
      <View style={styles.steps}>
        {STEPS.map(step => (
          <View key={step.text} style={styles.step}>
            <View style={styles.stepIcon}>
              <SymbolView name={step.icon} tintColor={COLORS.primary} size={22} />
            </View>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}
          onPress={() => router.push('/game')}
        >
          <SymbolView name={ICONS.play} tintColor="#fff" size={20} />
          <Text style={styles.playText}>Jogar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.dailyCard, pressed && styles.pressed]}
          onPress={() => router.push({ pathname: '/game', params: { mode: 'daily' } })}
        >
          <View style={styles.stepIcon}>
            <SymbolView name={ICONS.calendar} tintColor={COLORS.primary} size={22} />
          </View>
          <View style={styles.grow}>
            <Text style={styles.dailyTitle}>Desafio do dia</Text>
            <Text style={styles.dailySubtitle}>{`Mesmas fotos para todos · ${today()}`}</Text>
          </View>
          <SymbolView name={ICONS.chevron} tintColor={COLORS.muted} size={16} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
          onPress={() => router.push('/history')}
        >
          <SymbolView name={ICONS.history} tintColor={COLORS.muted} size={18} />
          <Text style={styles.linkText}>Ver histórico</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, gap: 16, paddingHorizontal: 20 },
  hero: {
    gap: 10,
    padding: 24,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
  },
  heroIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  heroTitle: { fontSize: 34, fontWeight: '800', color: '#fff' },
  heroSubtitle: { fontSize: 16, lineHeight: 22, color: 'rgba(255, 255, 255, 0.88)' },
  recordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.primaryDark,
  },
  recordText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  sectionLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.muted,
  },
  steps: { flexDirection: 'row', gap: 10 },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  stepIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
  },
  stepText: { fontSize: 13, fontWeight: '600', textAlign: 'center', color: COLORS.text },
  actions: { flex: 1, justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  playText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  grow: { flex: 1 },
  dailyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  dailySubtitle: { fontSize: 13, color: COLORS.muted },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  linkText: { fontSize: 15, fontWeight: '600', color: COLORS.muted },
  pressed: { opacity: 0.75 },
});
