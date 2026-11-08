# Geo Campus

Jogo estilo GeoGuessr dentro do campus da FHO (Araras-SP): o app mostra uma foto de um lugar do campus, você marca no mapa satélite onde acha que ela foi tirada e ganha até 5000 pontos por rodada, conforme a distância.

Feito com Expo (SDK 57) + React Native + TypeScript + Expo Router.

## Funcionalidades

- **Partida:** 5 fotos sorteadas; para cada uma, palpite no mapa satélite do campus e resultado com a distância e os pontos.
- **Desafio do dia:** as mesmas 5 fotos para todo mundo no mesmo dia (sorteio com seed da data).
- **Todos os locais:** joga todas as fotos cadastradas, cada uma uma vez.
- **Explorar a foto:** arrastar para ver as laterais e pinça para dar zoom.
- **Histórico e recorde:** as partidas ficam salvas no celular, com os detalhes de cada rodada.

## Telas

| Tela | Arquivo | O que tem |
|---|---|---|
| Início | `src/app/index.tsx` | Recorde, como jogar e escolha do modo |
| Partida | `src/app/game.tsx` | Foto, mini-mapa do palpite e resultado de cada rodada |
| Resumo | `src/app/summary.tsx` | Total da partida e pontos de cada rodada |
| Histórico | `src/app/history.tsx` | Lista das partidas jogadas |
| Detalhes da partida | `src/app/match.tsx` | Rodada a rodada de uma partida do histórico |

```
Início ──► Partida (foto → palpite → resultado, por rodada) ──► Resumo ──► Início
  └──► Histórico ──► Detalhes da partida
```

## Como executar

Pré-requisitos: [Node.js](https://nodejs.org) 20 ou mais recente e o app **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)).

```bash
git clone https://github.com/henrique-kuroda/geo-campus.git
cd geo-campus
npm install
npx expo start
```

Leia o QR code que aparece no terminal com o Expo Go (no iPhone, com a câmera). O computador e o celular precisam estar na mesma rede Wi-Fi.

- **iPhone:** o Expo Go exige estar logado na mesma conta Expo no app e no terminal (`npx expo login`).
- O mapa é nativo (Apple Maps no iPhone, Google Maps no Android) e funciona no Expo Go sem chave de API. Ele não roda no navegador.

## Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento |
| `npm test` | Testes da regra do jogo (Jest) |
| `npm run typecheck` | Checagem de tipos |
| `npm run lint` | ESLint |
| `npm run import-photos` | Trata as fotos de `fotos-originais/` e gera os dados dos locais |

## Banco de dados (Supabase)

Os locais e as fotos ficam no [Supabase](https://supabase.com): a tabela `places` guarda nome, coordenada, dificuldade e as fotos, e o bucket público `places` guarda as imagens. Assim um local novo aparece no app de todo mundo sem gerar uma nova versão.

- O app só **lê** o banco, com a chave publishable (protegida pelo RLS em `supabase/schema.sql`).
- Sem internet, o app usa a última lista baixada; sem ela, os locais empacotados em `src/data/places.json`.
- Sem o arquivo `.env`, o app funciona só com os locais empacotados.

Configuração (uma vez):

1. Crie um projeto no Supabase e rode `supabase/schema.sql` no SQL Editor.
2. Copie `.env.example` para `.env` e preencha a URL e a chave publishable.
3. Crie `.env.local` com `SUPABASE_SECRET_KEY=...` (fica fora do Git; só o script de envio usa).
4. Rode `npm run sync-supabase` para enviar os locais e as fotos.

## Adicionando locais

1. Ative a localização na câmera do celular (no iPhone, formato "Mais compatível", porque HEIC não é lido).
2. Nomeie as fotos como `biblioteca-1.jpg`, `biblioteca-2.jpg`: o número final agrupa fotos do mesmo local.
3. Coloque em `fotos-originais/` (fica fora do Git) e rode `npm run import-photos`.
4. Edite à mão `name`, `difficulty` e `indoor` em `src/data/places.json`. Fotos sem GPS ficam com `coordinate: null` e não entram no jogo até você preencher a coordenada (no Google Maps, clique com o botão direito no ponto onde a foto foi tirada).

O script redimensiona as fotos para `assets/places/` e remove os metadados, senão a resposta ficaria dentro do arquivo. Rodar de novo preserva o que foi editado à mão.

## Estrutura

```
src/
  app/          telas (Expo Router): início, partida, resumo, histórico, detalhes da partida
  components/   componentes reutilizáveis: GuessMap, ResultMap, PhotoViewer, ScoreCard, MatchRounds
  constants/    área do campus no mapa e cores
  data/         locais (places.json), mapa de fotos (images.ts) e repositório
  game/         regra do jogo, sem React Native (testada com Jest)
  services/     histórico no AsyncStorage
scripts/        importação das fotos
```

A pasta `src/game/` concentra a lógica: pontuação por distância (`scoring.ts`), sorteio das rodadas e seed do desafio diário (`random.ts`), máquina de estados da partida (`engine.ts`), limites do mapa (`bounds.ts`) e modos de jogo (`modes.ts`).

A pontuação usa uma curva em sino: até 10 m vale 5000, cai devagar perto do ponto e chega a zero em ~150 m. Os parâmetros ficam em `src/game/config.ts`.
