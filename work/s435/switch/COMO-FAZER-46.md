# Esboço 46: o liga/desliga de cada parte da loja fica na tela do assunto · S435 ESBOCO · 21/11

Dono (11:09–11:12): ligar o site e o preço automático saem de Ajustes. Na tela de cada assunto fica **um botão que representa o interruptor**:
tocar abre a janela de baixo e o interruptor está lá dentro. "Assim não precisa de confirmação": a janela já é o 2º passo.
Regra (aceita pelo dono): **Ajustes = o aparelho e as contas; o que liga ou desliga uma parte da loja fica na tela daquele assunto, e só ali.**
Pela mesma regra, o pagamento automático vai para Pedidos online.

Imagens (celular escuro, Hoje × Proposta × janela):
- esboco_46a_site.jpg: Site › Resumo, botão "● No ar" e a janela "Site"
- esboco_46b_precos.jpg: Preços, botão "○ Automático" e a janela "Preço automático" (com o que mudaria ao ligar e Contas, taxas e meta)
- esboco_46c_pedidos.jpg: Pedidos online, botão "○ Automático" e a janela "Pagamento automático"
- esboco_46d_ajustes.jpg: Ajustes aprovado (20/11) × proposta, onde saem as linhas Preços e Pagamento automático

Base: aprovados + Ajustes em 3 blocos (20/11) + Preços (4b).

## O botão de estado (uma família só)
- Pílula de 44 px ao lado do título: **ponto verde = ligado / anel cinza = desligado** + o nome curto + "›".
  Os nomes são "No ar" (Site), "Automático" (Preços e Pedidos).
- Tocar abre a **janela de baixo** com o título do assunto, o(s) interruptor(es) e uma frase do que acontece.
- **O interruptor vale na hora** (é um estado, não um formulário): não tem "Salvar". Ao fechar a janela, o botão já mostra o estado novo.
- No Preço automático, a janela mostra antes o que mudaria ("Sobem N peças · Baixam N · revisa toda segunda", a prévia de hoje `paPrevia`) e a dobra "Contas, taxas e meta".

## O que sai
- **Site › Resumo:** a linha "Estado do site" (`st96`, que hoje abre o painel do site) vira o botão. O interruptor do site sai do painel "Site" de Ajustes (frete, PIX, idioma), que fica só com a configuração.
- **Preços:** a linha "Preço automático · em Ajustes ›" de Ferramentas (149pl/149fe) sai, e o botão ocupa o lugar.
- **Ajustes:** saem as linhas **Preços** (149p, aprovado em 19/11; o dono desfaz conscientemente) e **Pagamento automático**. O LOJA fica com Marca, Site e Pedidos do site.

## Como fazer (jeito natural, regra 12)
- Uma função **`botaoEstado(chave)`** desenha a pílula a partir do estado (`S.siteRes.on`, `S.pAuto.on`, o do pagamento) e abre `lfJanela` com o conteúdo de cada assunto.
  Os interruptores são os que já existem (`paSwitchHtml`, `paSw` do pagamento, o do site), só chamados de outro lugar. Nenhum novo.
- Cada interruptor mora **num lugar só**. Saem o `ajPreco` (149p), a linha `pauto` de Ajustes e o interruptor dentro do painel do site.
- Trava no porteiro:
  - Cada estado tem um único interruptor no app inteiro (contar os `role=switch` por chave).
  - O botão mostra o estado certo depois de mudar.
  - Ajustes não tem Preços nem Pagamento automático.
