import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { ResumableZoom } from 'react-native-zoom-toolkit';

type Props = {
  source: number | { uri: string };
  showHint?: boolean;
};

// Tamanho em que a foto cobre a tela inteira sem distorcer. A parte que passa da borda
// não é cortada: fica acessível arrastando (o ResumableZoom libera o arrasto até a borda).
function coverSize(aspect: number, width: number, height: number) {
  return width / height > aspect
    ? { width, height: width / aspect }
    : { width: height * aspect, height };
}

export function PhotoViewer({ source, showHint = false }: Props) {
  const screen = useWindowDimensions();
  const [aspect, setAspect] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);

  // Antes de carregar, usa o tamanho da tela: com contentFit="cover" o recorte é o mesmo,
  // então não há salto quando a foto ganha o tamanho real.
  const size = aspect ? coverSize(aspect, screen.width, screen.height) : screen;
  const hideHint = () => setTouched(true);

  return (
    <View style={styles.container}>
      <ResumableZoom maxScale={3} onPanStart={hideHint} onPinchStart={hideHint}>
        <Image
          source={source}
          style={{ width: size.width, height: size.height }}
          contentFit="cover"
          onLoad={event => setAspect(event.source.width / event.source.height)}
        />
      </ResumableZoom>
      {showHint && !touched && (
        <Text style={styles.hint} pointerEvents="none">
          Arraste para olhar ao redor · pinça para zoom
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // overflow: no navegador, a parte da foto além da tela alargaria a página inteira.
  container: { flex: 1, overflow: 'hidden', backgroundColor: '#000' },
  hint: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
