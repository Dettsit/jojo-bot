# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
deno task dev       # servidor em modo watch com .env
deno task seed      # popula DynamoDB com stands e shinies
deno task register  # registra slash commands no Discord
```

## Variáveis de ambiente

Requeridas em `.env`:
- `DISCORD_APP_ID`, `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ID`, `DISCORD_PUBLIC_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- `DYNAMO_ENDPOINT` (opcional — para DynamoDB local)
- `DYNAMO_TABLE_INFO_STANDS`, `DYNAMO_TABLE_OWNED_STANDS`, `DYNAMO_TABLE_INVENTORY`
- `API_SECRET`

## Arquitetura

Bot Discord de coleta temático de JoJo's Bizarre Adventure. Itens e Stands aparecem aleatoriamente no canal; o primeiro jogador a usar o slash command correto coleta.

### Camadas

- **`domain/`** — lógica de negócio pura; define interfaces (ports) e nunca importa infra ou Discord
- **`infra/`** — implementações das ports: DynamoDB, Deno KV, Discord API, telemetria
- **`messages/`** — handlers dos slash commands Discord
- **`config/`** — container de DI (factory functions), env, cliente DynamoDB

### Fluxo de spawn

Dois `Deno.cron` rodam em `main.ts` (escala `* 0-3,10-23 * * *`): um para itens, um para Stands. A função `shouldSpawn` usa probabilidade baseada em tempo (máx 12 minutos) para decidir se spawna. O estado do stand ativo fica em Deno KV; dados persistentes ficam em DynamoDB.

### Sistemas principais

**Itens**: aparecem no canal → `/pegar` coleta → armazenado em DynamoDB inventory (Deno KV para estado ativo).

**Stands**: obtidas com `/obter-stand` usando uma Flecha de Stand do inventário → `obtainStand` limpa o KV, rola shiny, persiste em `OwnedStand`.

**Shiny**: um stand tem `shinies: ShinyVariant[]` (cada variant tem `id` e `weight`). Se o array não for vazio, há 5% de chance (`SHINY_RATE`) de virar shiny. Passando esse teste, usa `selectWeighted` para sortear qual variant. `InfoShiny` (tabela separada via `tableInfoStands` por `id`) guarda a imagem alternativa.

**Raridades**: `common` (100) → `uncommon` (40) → `rare` (15) → `epic` (5) → `legendary` (1) — pesos usados em `selectWeighted` no spawn.

### Seed

`seed.ts` popula duas listas: `shinies` (objetos `{ id, image }`) e `stands` (com `shinies: ShinyVariant[]` referenciando IDs da primeira lista). Shinies com `image: ""` estão aguardando imagem.

### Imports

Aliases configurados em `deno.json`: `@domain/`, `@infra/`, `@messages/`, `@config/`.
