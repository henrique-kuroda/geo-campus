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
| `npm run import-photos` | Trata as fotos de `fotos-originais/` e gera os dados dos locais |

## Adicionando locais

1. Ative a localização na câmera do celular (no iPhone, formato "Mais compatível", porque HEIC não é lido).
2. Nomeie as fotos como `biblioteca-1.jpg`, `biblioteca-2.jpg`: o número final agrupa fotos do mesmo local.
3. Coloque em `fotos-originais/` (fica fora do Git) e rode `npm run import-photos`.
4. Edite à mão `name`, `difficulty` e `indoor` em `src/data/places.json`. Fotos sem GPS ficam com `coordinate: null` e não entram no jogo até você preencher.

O script redimensiona as fotos para `assets/places/` e remove os metadados, senão a resposta ficaria dentro do arquivo. Rodar de novo preserva o que foi editado à mão.

## Estrutura

```
src/
  app/          telas (Expo Router): início, partida, resumo, histórico
  components/   mapa do palpite e mapa do resultado
  constants/    região do campus no mapa e cores
  data/         locais (places.json), mapa de fotos (images.ts) e repositório
  game/         regra do jogo, sem React Native (testada com Jest)
  services/     histórico no AsyncStorage
scripts/        importação das fotos
```

A pasta `src/game/` concentra a lógica: pontuação por distância (`scoring.ts`), sorteio das rodadas e seed do desafio diário (`random.ts`) e a máquina de estados da partida (`engine.ts`).
