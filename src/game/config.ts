export const GAME_CONFIG = {
  roundsPerMatch: 5,
  maxScore: 5000,
  // Até essa distância o palpite vale o máximo (erro do GPS da foto e do dedo no mapa).
  toleranceMeters: 10,
  // Curva em sino: a essa distância além da tolerância os pontos caem para ~37%
  // e no dobro dela para ~2%. O campus é pequeno, então errar o prédio vizinho já vale pouco.
  scoreFalloffMeters: 50,
};
