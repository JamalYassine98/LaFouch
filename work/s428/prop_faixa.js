/* S428 esboço FAIXA DA TEMÁTICA × MENU (bug achado pelo dono 18/11 21:26): a faixa (#evbar, camada 10001) ficava por cima
   do menu aberto (#drw, camada 38) e cobria o topo dele — ao rolar, o conteúdo passava por baixo da faixa.
   Proposta: com o menu aberto, a faixa vai para baixo do menu (o menu cobre a tela toda, com o fundo escurecido por cima da faixa);
   ao fechar, a faixa volta como está. */
(function(){var s=document.createElement('style');s.textContent='html body:has(#drw.on) #evbar{z-index:30!important}';document.head.appendChild(s)})();
