# Diagnóstico Financeiro — iFood

Next.js 15 + TypeScript + TailwindCSS + Recharts + React Hook Form + Zod.
Diagnóstico financeiro para restaurantes que vendem pelo iFood, com captura de
leads enviada direto para uma planilha do Google Sheets.

## Campos do formulário x colunas da planilha

O formulário pede: **Nome, E-mail, Telefone, Faturamento e Função.**
A planilha recebe 11 colunas — as 5 do formulário mais 6 que são capturadas
automaticamente pela aplicação (não aparecem para o usuário preencher):

| Coluna na planilha | Origem |
|---|---|
| Data | Gerada automaticamente no momento do envio |
| Nome | Formulário |
| Email | Formulário |
| Telefone | Formulário (só DDD + número, sem +55) |
| Faturamento | Formulário (lista fixa de faixas) |
| Função | Formulário (lista fixa de cargos) |
| Link | Capturado automaticamente: URL completa da página no momento do envio |
| utm_source | Capturado automaticamente da URL (`?utm_source=...`) |
| utm_campaign | Capturado automaticamente da URL (`?utm_campaign=...`) |
| utm_medium | Capturado automaticamente da URL (`?utm_medium=...`) |
| utm_content | Capturado automaticamente da URL (`?utm_content=...`) |

Se a página for aberta sem parâmetros de UTM (ex.: acesso direto), essas
colunas simplesmente ficam em branco naquela linha — nada quebra.

As opções fixas de **Faturamento** são: Faturo até 20 mil, Faturo até 50 mil,
Faturo até 100 mil, Faturo até 200 mil, Faturo até 300 mil, Faturo até 500 mil,
Faturo mais de 500 mil.

As opções fixas de **Função** são: Proprietário de delivery, Sócio, Gerente,
Gestor de lojas iFood/99, Gestor de tráfego, Outro.

Essas duas listas vivem em `lib/options.ts` — é o único lugar que você precisa
editar para adicionar, remover ou renomear uma opção.

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as variáveis do Google Sheets (veja abaixo)
npm run dev
```

Acesse `http://localhost:3000`.

## Estrutura do projeto

```
app/
  layout.tsx            # fontes (Barlow Condensed + IBM Plex Sans), metadata
  page.tsx              # ponto de entrada, renderiza o wizard
  globals.css           # tokens de cor da marca, tipografia, animações
  api/lead/route.ts      # recebe o formulário e grava no Google Sheets
components/
  ui/                   # Button, Card, CurrencyInput (primitivos reutilizáveis)
  diagnostico/          # telas e gráficos do fluxo (Landing, Lead, Dados, Processando, Resultado)
lib/
  calculations.ts        # TODA a regra financeira, em funções puras (sem React)
  types.ts               # tipos compartilhados (Lead, UtmParams, etc.)
  format.ts              # formatação BRL e máscara de moeda
  validation.ts           # schema Zod do formulário de lead
  options.ts              # listas fixas de Faturamento e Função
google-apps-script/
  Code.gs                # script gratuito que grava os leads na planilha
```

Nenhum cálculo financeiro vive dentro de componentes React — tudo está em
`lib/calculations.ts`, testável isoladamente.

## Configurar o Google Sheets — de graça, sem Google Cloud (passo a passo)

Em vez de conta de serviço / Google Cloud Console, usamos o **Google Apps
Script**, que já vem dentro do próprio Google Sheets, é 100% gratuito e não
exige criar projeto, ativar API nem gerar chave.

1. **Crie a planilha.** No Google Sheets, crie uma planilha nova. Não precisa
   criar a aba `Leads` manualmente — o script cria e escreve o cabeçalho
   automaticamente no primeiro envio.
2. **Abra o editor de scripts.** Na planilha, vá em **Extensões → Apps Script**.
3. **Cole o código.** Apague o conteúdo padrão (`function myFunction() {}`) e
   cole o conteúdo do arquivo [`google-apps-script/Code.gs`](./google-apps-script/Code.gs)
   deste projeto. Salve (ícone de disquete).
4. **Publique como Web App:**
   - Clique em **Implantar → Nova implantação**.
   - Em **Tipo**, escolha **App da Web**.
   - **Executar como:** Eu (sua conta).
   - **Quem tem acesso:** Qualquer pessoa.
   - Clique em **Implantar** e autorize as permissões pedidas (é a sua própria
     conta acessando a sua própria planilha).
   - Copie a **URL do app da Web** gerada — termina em `/exec`.
5. **Preencha o `.env.local`** (e depois as variáveis de ambiente na Vercel):
   ```
   GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_ID/exec
   ```

O endpoint `app/api/lead/route.ts` recebe os 5 campos do formulário, valida
com Zod, junta a `Data`, o `Link` e os 4 `utm_*` capturados automaticamente no
navegador, e envia tudo para essa URL — que grava uma nova linha completa na
planilha a cada envio, sem custo e sem infraestrutura extra.

> Sempre que editar o código no Apps Script, você precisa criar uma **nova
> implantação** (ou "Gerenciar implantações → editar → nova versão") para que
> as mudanças entrem no ar na mesma URL.

## Deploy (GitHub → Vercel)

1. Suba este projeto para um repositório no GitHub (pelo terminal do VS Code
   mesmo: `git init`, `git add .`, `git commit -m "diagnóstico ifood"`, `git push`).
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe
   o repositório.
3. Em **Environment Variables**, adicione `GOOGLE_SCRIPT_URL` com a URL do seu
   Web App do Apps Script (a mesma do `.env.local`).
4. Deploy. A cada `git push` na branch principal, a Vercel publica automaticamente.

## Cores da marca

| Token | Uso | Valor |
|---|---|---|
| `--bg` | Fundo do dashboard | `#0B0B0B` |
| `--card` | Cards | `#131313` |
| `--border` | Bordas | `#252525` |
| `--heading` | Títulos (sempre caixa alta, Barlow Condensed) | `#F0EDE8` |
| `--body` | Corpo de texto (IBM Plex Sans) | `#B8B4AE` |
| `--accent-pos` | Destaque positivo (números/ícones) | `#00BBF9` |
| `--accent-neg` | Destaque negativo (números/ícones) | `#f91719` |
| `--accent-big-pos` | Big numbers positivos | `#46fe6c` |

O "Termômetro de Aquisição" (a barra de 5 zonas usada na classificação e no
simulador) usa um espectro derivado da marca: azul → verde (`--accent-big-pos`,
a faixa ideal) → âmbar → laranja → vermelho (`--accent-neg`, a faixa de alerta).

## Máscara de valores em Real

Os campos de valores usam uma máscara "estilo cofrinho": o usuário digita
apenas números e os dois últimos dígitos se tornam os centavos automaticamente
(ex.: `6200000` vira `R$ 62.000,00`). Isso elimina qualquer ambiguidade entre
ponto e vírgula, sem precisar de texto explicativo adicional.
