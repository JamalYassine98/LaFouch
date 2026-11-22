# Estudo 47b — o painel do Site inteiro × o app (redundâncias)

ESBOCO/S435 · 22/11/2026. Feito com o painel real (catalogo/admin.html, kit `work/kit/painel.py`), abrindo cada tela e cada linha.
Material: `estudo/txt_*.txt` (o texto de cada tela) e `estudo/s_*.png` (fotos).

Estrutura aprovada em 22/11 01:23: Resumo · Pedidos · Mensagens · Destaque e ordem · Modelos · Ajustes do site.
Este estudo confere, função por função, o que **já existe em outro lugar do app**.

## Tudo o que o painel faz hoje

| Tela do painel | Função | Também existe no app em | Proposta (um lugar só) |
|---|---|---|---|
| Topo | "No ar" | Resumo (botão ⏻, 58a) | Só o ⏻ do Resumo |
| Topo | "Cliente" (prévia) | Resumo › Prévia (58a) | Só a Prévia do Resumo |
| Topo | "Sair" (login do painel) | login do app (nuvem) | Sai: as telas viram do app, que já tem login |
| Vitrine | "16 produtos no ar · 2 ocultos" | Resumo › Modelos (58a) | Só no Resumo |
| Vitrine | Destaque do site: Nada · **Automático** (Girar, Mais vendido, Novidade, Tema) · Um produto · Vídeo · Slide | **Destaque da semana do Semp (53)** | As PEÇAS vêm do Destaque da semana. Aqui fica só o **formato** (slide, vídeo ou uma peça) e os **efeitos**. O modo "Automático" sai: era o Semp antes do Semp. |
| Vitrine | Efeitos do cartão (cascata, 3D, respiração, reflexo) | — | Fica, junto do formato do destaque |
| Vitrine | Ordem do catálogo (Equilibrada · Vender parados · Novidades) | Ordem do **Catálogo do Vender** (aprovada 23:23: Destaque → mais vendidas → resto) | **Uma regra de ordem só** para o site e o Vender, decidida pelo Semp. A escolha manual vira só "fixar no topo". |
| Vitrine | Precisa de atenção (sem foto: 4) | **Modelos › Precisa de atenção (49b)** · Inventário · Guardião no sino | Um lugar só: o **sino** avisa e leva à lista. "Sem foto" é assunto do **Estúdio**. |
| Vitrine | Opiniões para revisar (suspeitas) | **Ajustes › Avaliações dos clientes** (no próprio painel) | Uma tela **Avaliações**: as suspeitas para revisar em cima, as últimas embaixo |
| Modelos | Lista de modelos no site (Todos, No ar, Ocultos, Sem foto, Esgotado) | **Inventário** (as mesmas peças) | Ver a pergunta 1 |
| Modelos › peça | Aparece no site · Fixar no topo · Coleção no site | **Inventário › ficha › aba Site (134)** | Ver a pergunta 1 |
| Modelos › peça | "Produto antigo do painel" (não vem do app) | — | Dado e código mortos: saem (limpeza) |
| Mensagens | Todas · Contato · Atacado | **Atacado › Mensagens** (as abas ficam, 22/11 00:29) | Site › Mensagens só com as de **contato**. As de atacado ficam só no Atacado. |
| Temática | Calendário, evento no ar, evento manual | Marketing › Temática · Preços (Black Friday no "O Guardião decide hoje") | Fica no Marketing (aparência). Os preços do evento ficam com o Guardião. A "Ver prévia do site" sai (já decidido). |
| Analisador | Visitas do site (7 dias, 30 dias, 3 meses) | Fonte do **Semp** (Mercado e Resultados, 1c) | Ver a pergunta 2 |
| Ajustes | O site está no ar | ⏻ do Resumo | Sai (aprovado 58b) |
| Ajustes | Entrega · transportadoras (preço do frete) | — | Fica (58b) |
| Ajustes | Estojo e flanela | Brinde do Vender · cupom "kit" · Acessório no Inventário | Fica, mas tem de bater com o brinde e o estoque de acessórios (conferir) |
| Ajustes | Avaliações dos clientes ("ver as últimas") | Opiniões para revisar | Juntas numa tela (acima) |
| Ajustes | Inscritos em novidades | — | Fica (58b) |
| Ajustes | Se você desligar (mensagem) | janela do ⏻ | Vai para a janela do ⏻ (aprovado) |
| Ajustes | GitHub ("Conectado pelo Firebase") | — | **Sai da tela**: não pede nada ao dono. Se cair, o aviso vem pelo sino. |
| Ajustes | Segurança do painel (Authenticator, sair de todos) | **Ajustes › Segurança** do app | Uma segurança só, nos Ajustes gerais do app |
| Ajustes | Conta (alterar senha, sair do painel) | conta do app | Uma conta só, nos Ajustes gerais do app |

## Perguntas para o dono

1. **Modelos × Inventário.** São as mesmas peças. O "aparece no site / fixar / coleção" já existe na aba Site da ficha (134). Proposta: a tela **Modelos sai**. O Inventário ganha o filtro "No site · Ocultos", e o Resumo leva para ele já filtrado. Supera o 49b.
2. **Analisador.** Ele alimenta o Semp. Proposta: vira parte do setor **Resultados** do Marketing (1c), deixando de ser uma tela solta.
3. **O painel na web (lafouch.com/admin).** Com tudo isso no app, ele deixa de ser preciso, inclusive o login próprio, a segurança e a conta dele. O app no PC (Windows) faz o mesmo papel. Sai?

## Como fica a família Site, sem nada repetido

Resumo · Pedidos · Mensagens (só contato) · Destaque (formato e efeitos; as peças vêm do Semp) · Avaliações · Ajustes do site.
Modelos e Analisador saem se as perguntas 1 e 2 forem aprovadas.
