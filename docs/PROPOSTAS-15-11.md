# Propostas elaboradas em 15/11/2026 15:15 (seção B da lista viva) — NADA implementado

## 1. Tarjetas (cartões) da Minha conta não carregam — CAUSA ACHADA no código
- O pedido dos cartões (`cupFn({acao:'meus'})`, `js/lf-site.js`) manda a chave de login GUARDADA, sem renovar. Essa chave vale 1 hora. Passou 1 hora com a conta aberta → o servidor recusa → "No se pudieron cargar tus tarjetas ahora". As outras partes da conta usam `idTok()`, que renova sozinho; os cartões ficaram de fora.
- Proposta: os cartões passam a usar `idTok()`; se a sessão não puder ser renovada, pede para entrar de novo (em vez da frase de erro).
- Portão: prova nova "conta aberta há mais de 1 hora" (relógio adiantado) abrindo cada aba da conta.
- Limite: lido no código, não confirmado no celular do dono (bate com o vídeo dele: perfil carregado, cartões não).

## 2. Atacado num lugar só no app
- Hoje, espalhado: Início › "Atacado" (abre o painel do site em Mensagens › Atacado); Clientes › "Acesso atacado" e "Lotes"; Catálogo › chave Varejo | Atacado; Compartilhar › Lojista.
- Proposta: UMA tela "Atacado" do próprio app (não o painel), aberta pelo atalho do Início, com quatro blocos na ordem do trabalho: **Pedidos e mensagens de lojistas** (o que hoje só aparece no painel) · **Lojistas** (contas e acessos de visitante) · **Lotes** · **Tabela e envio** (ver preços de atacado, mandar catálogo para lojista). Clientes fica só com clientes; a chave Varejo | Atacado do Catálogo continua (é para vender no balcão).
- Precisa de esboço (celular e PC, claro e escuro).

## 3. Grupo de telas como uma tela inteira
- Combinado em 14/11: CAPA do grupo = nome do grupo + um RESUMO desenhado de cada tela + "Ver tudo"; as palavras em linha continuam para entrar na tela cheia.
- O que falta decidir no desenho: cada tela precisa de um resumo próprio (o que importa dela em 3 linhas + a ação principal). São ~24 telas. Proposta: desenhar primeiro os resumos das 8 telas mais usadas (Inventário, Catálogo, Caixa, Despesas, Câmbio, Dia, Histórico, Clientes) e mostrar 3 grupos de exemplo; as outras entram com um resumo padrão (título + número principal + "Ver tudo") até ganharem o seu.
- Inventário + Catálogo: o dono reprovou fundir os dois; na capa eles aparecem como dois blocos (o que vender agora · o que cuidar no estoque), não como uma lista só.
- Precisa de esboço.

## 4. Cabeçalho do grupo em cima do painel
- Regra proposta: o cabeçalho do grupo só aparece quando a tela aberta É uma das telas do grupo. O painel do site (Mensagens, Analisador, Temática, Atacado) deixa de contar como "Catálogo".
- Fica resolvido de vez quando o painel virar tela do app (aprovado, na lista).

## 5. Detector de cópias no app
- Mesmo motor do site (work/s330/fantasma.py): para cada par de janelas/folhas do app (abrir A e, com A aberta, abrir B por cada caminho), conta a cada quadro quantas cópias de cada janela e de cada fundo escuro existem; reprova com 2 ou mais, ou com sobra depois de fechar. Inclui a barra de escolher peças e o cabeçalho de grupo (defeitos plantados: os de hoje).

## 6. Animações do app — lotes B e C (vídeos a fazer)
- B · janelas e telas: abrir/fechar folhas e janelas (nascem do que foi tocado, fecham pelo caminho inverso, 0,3 s), ficha da peça, troca de tela, sem quique.
- C · listas, toques e carregando: entrada das listas uma vez só, toque afunda em 0,08 s, carregando com etapas; desenhos de tela vazia em 0,6 s.
- Entrega: vídeo Hoje × Luxo + quadros lado a lado, escuro e claro.

## 7. Hospedagem (site e atualização do app)
- Hoje: GitHub Pages (as regras do serviço dizem que não é para comércio; o risco é o GitHub tirar o site do ar sem aviso).
- Opções: **A** Cloudflare Pages (gratuito, aceita comércio, publica sozinho a cada mudança no repositório; o dono cria a conta e liga o repositório; o domínio lafouch.com passa a apontar para lá) · **B** Firebase Hosting (a loja já usa Firebase; publicar exige um comando no computador do dono ou uma chave guardada no GitHub) · **C** ficar como está.
- Recomendação: A para o site; a atualização do app e os APKs podem continuar no GitHub (não são loja). Antes de decidir eu confiro os limites e as regras atuais de cada serviço (não conferi hoje).
