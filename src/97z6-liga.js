  // ===== 46 (aprovado 22/11/2026): o liga e desliga de cada parte da loja mora na tela do assunto =====
  // Um botão redondo ⏻ ao lado do título (mesma família do "+" redondo, .pl78) abre a janela de baixo com o(s) interruptor(es).
  // O interruptor vale na hora (é um estado, não um formulário): sem "Salvar" e sem confirmação.
  // Ligado = ícone verde · desligado = ícone cinza (sem luz). A tabela LIGA é o único lugar que diz o que cada botão liga.
  var LIGA_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M12 3.5v8"/><path d="M6.6 6.8a7.5 7.5 0 1 0 10.8 0"/></svg>';
  // uma linha de interruptor (título + frase · chave), a mesma em todas as janelas de liga e desliga
  function ligaSw(act, tit, sub, on, dis) {
    return '<button type="button" class="paSw" data-act="' + act + '" role="switch" aria-checked="' + on + '"' + (dis ? ' disabled' : '') + '><span><b>' + tit + '</b><small>' + sub + '</small></span><span class="sw"><input type="checkbox" tabindex="-1" aria-hidden="true"' + (on ? ' checked' : '') + '><i></i></span></button>';
  }
  var LIGA = {
    // Pedidos online: imprimir sozinho o pedido pago e dar baixa sozinho ao entregar (o "Confirmar o PIX sozinho" saiu, dono 22/11)
    ped: {
      titulo: 'Impressão automática',
      on: function () { return fichaAutoOn() || !!S.baixaAuto; },
      corpo: function () {
        return ligaSw('fichaTog', 'Imprimir pedidos pagos sozinho', imp ? 'ficha de separação nesta impressora' : 'conecte uma impressora em Ajustes', fichaAutoOn(), !imp) +
          ligaSw('pedbaixa', 'Baixa automática', S.baixaAuto ? 'ao entregar, o estoque baixa e a venda entra sozinha' : 'ao entregar, você registra a venda à mão', !!S.baixaAuto) +
          '<p class="lgFr">Ligado, todo pedido pago sai na impressora sem você tocar em nada.</p>';
      }
    },
    // Preços: o preço automático; ao ligar, a janela já mostra o que o app faria com os dados de hoje
    prec: {
      titulo: 'Preço automático',
      on: function () { return !!(S.pAuto && S.pAuto.on); },
      corpo: function () { return paSwitchHtml(); }
    }
  };
  function botaoEstado(k) {
    var L = LIGA[k], on = L.on();
    return '<button type="button" class="pl78 lgB' + (on ? ' on' : '') + '" data-act="ligaAbre" data-id="' + k + '" aria-pressed="' + on + '" aria-label="' + L.titulo + (on ? ' · ligado' : ' · desligado') + '">' + LIGA_ICO + '</button>';
  }
  var LIGA_ABERTA = null;
  ACT.ligaAbre = function (k) {
    var L = LIGA[k];
    if (!L) return;
    lfJanela({
      titulo: L.titulo,
      cls: 'lgJn',
      monta: function (c) { LIGA_ABERTA = { k: k, c: c }; c.innerHTML = L.corpo(); setTimeout(function () { nvListaCabe(c.parentNode); }, 0); },
      aoFechar: function () { LIGA_ABERTA = null; }
    });
  };
  // o interruptor muda o estado e o app redesenha: a janela aberta acompanha (e o ⏻ da tela já sai com a cor nova)
  aposRender(function () {
    if (LIGA_ABERTA && LIGA_ABERTA.c.isConnected) { LIGA_ABERTA.c.innerHTML = LIGA[LIGA_ABERTA.k].corpo(); nvListaCabe(LIGA_ABERTA.c.parentNode); }
  });
