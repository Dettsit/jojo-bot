# JoJo Bot — Plano

## Visão Geral

Bot Discord de coleta e batalha temático de JoJo's Bizarre Adventure. Itens e Stands aparecem aleatoriamente no chat; jogadores competem para pegá-los primeiro.

---

## Sistemas

### Itens

- Itens especiais aparecem aleatoriamente no canal onde o bot está ativo
- O bot anuncia o aparecimento (ex: "Uma Flecha de Stand apareceu!")
- O primeiro jogador a digitar `/pegar` recebe o item
- O item desaparece após ser coletado ou após um tempo limite

**Itens planejados**
- Flecha de Stand — usada para obter uma Stand aleatória
- Itens de evolução — específicos por Stand

---

### Stands

Obtidas principalmente via Flecha de Stand com o comando `/obter-stand`.

#### Raridades

| Tier | Símbolo | Descrição |
|------|---------|-----------|
| Comum | ⚪ | Alta chance |
| Incomum | 🟢 | Chance média-alta |
| Rara | 🔵 | Chance média-baixa |
| Épica | 🟣 | Chance baixa |
| Lendária | 🟡 | Chance muito baixa |

#### Shiny

- Stands Rara ou superior têm chance baixa de aparecer como **Shiny**
- Algumas exceções podem existir
- Shiny é uma variação visual/cosmética da Stand

---

### Evolução

- Algumas Stands podem evoluir para formas mais poderosas
- Evolução requer o item específico daquela Stand
- Benefícios: aumento de atributos, novas habilidades, maior valor de coleção
- Nem toda Stand possui evolução
- Nem toda evolução será canônica ao mangá/anime

---

## Comandos (rascunho)

| Comando | Descrição |
|---------|-----------|
| `/pegar` | Pega o item ativo no canal |
| `/obter-stand` | Usa uma Flecha de Stand para obter uma Stand |
| `/evoluir` | Evolui uma Stand usando o item de evolução correspondente |
| `/inventario` | Exibe itens e Stands do jogador |
| `/dex` | Exibe informações sobre uma Stand específica |

---

## Referências

- Estrutura de spawn/captura baseada no **spawn-bot** (`~/dev/garug/spawn-bot`)
  - Mesmo padrão: item aparece → jogador coleta → processamento assíncrono
  - Stack compatível: TypeScript + Deno + MongoDB + discord-interactions
