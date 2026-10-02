# Geo Campus

Jogo estilo GeoGuessr dentro do campus: o app mostra uma foto, você marca no mapa satélite onde acha que ela foi tirada e ganha até 5000 pontos por rodada, conforme a distância.

Feito com Expo (SDK 57) + React Native + TypeScript + Expo Router.

## Rodando

```bash
npm install
npx expo start
```

Abra no celular com o app **Expo Go** (lendo o QR code). O mapa funciona no Expo Go sem chave do Google.

## Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento |
| `npm test` | Testes da regra do jogo (Jest) |
| `npm run typecheck` | Checagem de tipos |
| `npm run lint` | ESLint |

## Estrutura

```
src/
  app/          telas (Expo Router)
  constants/    região do campus no mapa
  game/         regra do jogo, sem React Native (testada com Jest)
```

A pasta `src/game/` concentra a lógica: pontuação por distância (`scoring.ts`), sorteio das rodadas e seed do desafio diário (`random.ts`) e a máquina de estados da partida (`engine.ts`).
