import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Geo Campus', headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="summary" options={{ title: 'Resultado', headerBackVisible: false }} />
        <Stack.Screen name="history" options={{ title: 'Histórico' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
