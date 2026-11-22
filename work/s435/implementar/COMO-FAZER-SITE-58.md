# Família SITE (painel do site dentro do app) — "implementar" do dono 22/11 12:51

Esboços (só a última versão vale): work/s435/painelsite/
- esboco_58a_resumo.jpg
- esboco_58b_ajustes_site.jpg (v2)
- esboco_58c_familia_site.jpg
- esboco_58d_destaque.jpg
- esboco_58f_mensagens.jpg (balão B)
- esboco_58g_avaliacoes.jpg
- esboco_58h_filtro_site.jpg

Estudo de base: work/s435/painelsite/ESTUDO-PAINEL-SITE-22-11.md.

## O que é
O painel do site passa a ser **tela do app**, sem a página do site carregada por dentro (admin.html).
Fica uma família só: **Resumo · Pedidos · Mensagens · Destaque · Avaliações · Ajustes do site**.
Os ícones das linhas ficam em cinza e cada linha tem o seu.

## Telas
1. **Resumo (58a)**
   - Botão redondo ⏻ ao lado do título "Site": verde se o site está no ar, cinza se está fora. É a mesma família do botão de liga e desliga aprovado no 46.
   - Tocar no ⏻ abre uma janela de baixo com o interruptor e a mensagem "Voltamos logo". Essa mensagem vem de "Se você desligar", que sai dos Ajustes.
   - "Prévia do site ›" fica numa linha.
   - O bloco AGORA tem linhas ›: Pedidos · Mensagens · No site (abre o Inventário já filtrado em "No site", ver 58h) · Destaque da semana.
   - Os números são lidos direto: sem cartões e sem "abra para atualizar".
2. **Pedidos:** fica como está.
3. **Mensagens (58f)**
   - Só as de **contato**. As de atacado ficam só em Atacado › Mensagens.
   - Abas **Novas · Respondidas**.
   - Tela vazia: `lfVazioHtml` com o **balão B** (retângulo com 2 linhas). O mesmo balão vai no vazio de Atacado › Mensagens: é uma família, com o desenho num lugar só.
4. **Destaque (58d)**
   - "As peças": uma linha › para Marketing › Destaque da semana (53), com o texto "4 peças do Semp · também abrem o catálogo". Aqui não há lista própria.
   - "Formato": **Slide de fotos · Vídeo · Campanha · Nada**.
   - Saem "Automático", "Uma peça", os 4 efeitos e "Ordem do catálogo".
   - O catálogo do site abre pelas peças do Semp e depois pelas mais vendidas. O cliente continua com os filtros.
5. **Avaliações (58g):** uma tela só. "Para revisar" (as suspeitas) fica em cima e "Publicadas" embaixo.
   Junta "Opiniões para revisar" (Vitrine) e "Avaliações dos clientes" (Ajustes do painel).
6. **Ajustes do site (58b v2)**
   - Entrega: Frete e transportadoras · Estojo e flanela.
   - Clientes: Inscritos em novidades ›.
   - Arquivos: Fotos e vídeos.
   - Saem "O site está no ar" (vai para o ⏻), Avaliações (tem tela própria), Segurança e Conta (eram do painel web) e o GitHub.

## Sai no mesmo passo (regra 12d)
- A tela **Modelos**. Ela vira o filtro "Site: No site · Ocultos" do Inventário (58h, que vai na família Inventário).
- O **Analisador** como tela solta. Ele vira parte de Marketing › Resultados.
- **Ajustes › Site** do app: fica só aqui.
- O código que carregava a página do painel por dentro do app.

## Depende de outras sessões
- **SITE / IDEIAS:**
  - o visual do formato "Campanha" no site;
  - a ordem padrão do catálogo pelo Semp;
  - o fim dos 4 efeitos, que nunca aparecem no site atual.
- **Painel web (lafouch.com/admin):** sai **depois** que estas telas estiverem publicadas e testadas no celular e no PC (dono 22/11 06:13).
  Junto saem o login, o autenticador e a conta próprios do painel (NUVEM/SITE). O recado já foi enviado.

## Trava (Argus/provas)
- A família Site tem 6 linhas, e nenhuma abre a página admin.html.
- Nenhuma mensagem de atacado aparece em Site › Mensagens.
- O Destaque não tem lista própria de peças.

Testado só no simulador (escuro); NÃO testado em aparelho real.
