// Estende o app.json. A chave do Google Maps para Android (exigida pelo react-native-maps fora do
// Expo Go) vem da variável GOOGLE_MAPS_ANDROID_API_KEY, cadastrada no EAS (eas env:create), e não
// fica no repositório. A chave é restrita no Google Cloud ao pacote com.henriquekuroda.geocampus.
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []),
    ['react-native-maps', { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY }],
  ],
});
