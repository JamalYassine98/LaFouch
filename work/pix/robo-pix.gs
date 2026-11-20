/**
 * Robô do PIX automático (S197, aprovado 12/11/2026) — roda no Google Apps Script da conta lafouch.eyewear@gmail.com.
 * Lê os avisos de transferência do Nubank (encaminhados pelo filtro do Gmail) e do Banco Familiar, confere que o e-mail é
 * mesmo do banco e manda o valor para a função "pix" do Firebase. A chave NÃO fica aqui: Projeto › Configurações ›
 * Propriedades do script › PIX_ROBO.
 * Instalar: script.google.com › o projeto do robô › apagar tudo › colar este arquivo › salvar (o gatilho "verifica" a cada 1 minuto continua).
 * As travas deste arquivo rodam antes de cada publicação da nuvem: functions/teste-robo.js.
 */
var URL_PIX = 'https://southamerica-east1-lafouch-2f6bd.cloudfunctions.net/pix';
// Os bancos num lugar só (20/11/2026): quem manda o aviso, de que domínio é a assinatura e como ler valor, pagador e hora.
var BANCOS = {
  // Nubank: "Você recebeu uma transferência de R$ 89,93 de MARIA ..."
  nubank: { de: 'todomundo@nubank.com.br', busca: 'subject:"Você recebeu uma transferência"', dom: 'nubank.com.br', rotulo: 'pix-lido',
    valor: /R\$\s*([\d.]+,\d{2})/, pagador: /R\$\s*[\d.]+,\d{2}\s+de\s+([^\n\r.,;]+?)(?=\s+(?:em|no|na|via|pelo|pela)\b|[\n\r.,;]|$)/i, recebida: /recebeu/i },
  // Banco Familiar / Eko (14/11/2026; o Itaú saiu do robô em 16/11/2026, pedido do dono): o aviso chega DIRETO neste Gmail.
  // Assunto visto: "Transferencia de otros bancos"; corpo: "TRANSFERENCIA DE OTRAS ENTIDADES RECIBIDA" + "Moneda y Monto: PYG 200.000".
  familiar: { de: 'operbancaweb@familiar.com.py', busca: '', dom: 'familiar.com.py', rotulo: 'familiar-lido',
    valor: /Monto:?\s*(?:PYG|Gs\.?)\s*([\d.]+)/i, pagador: /(?:Pagador|Ordenante)[^:\n]*:\s*([^\n\r]+)/i, recebida: /RECIBIDA/i },
};

// O e-mail é mesmo do banco? (20/11/2026, varredura do pagamento) Vale SÓ a marca que o próprio Gmail escreve ao receber:
// a PRIMEIRA linha "Authentication-Results: mx.google.com" do cabeçalho. Quem manda um e-mail falso pode escrever outras linhas
// parecidas mais abaixo — antes o robô aceitava qualquer uma. Autêntico = assinatura (DKIM) ou DMARC aprovados para o domínio do banco;
// no Nubank encaminhado pelo filtro, também vale a cadeia de reenvio (ARC) que o Gmail aprovou (arc=pass) com o DKIM do banco no 1º passo.
function autentico(cab, dom) {
  var linhas = String(cab || '').split(/\r?\n\r?\n/)[0].replace(/\r?\n[ \t]+/g, ' ').split(/\r?\n/);
  var d = dom.replace(/\./g, '\\.'), doDom = '(?:[a-z0-9-]+\\.)*' + d + '(?![a-z0-9.-])';
  var ok = new RegExp('(?:dkim=pass[^;]*header\\.(?:i|d)=@?' + doDom + '|dmarc=pass[^;]*header\\.from=' + doDom + ')', 'i');
  var ar = linhas.filter(function (l) { return /^Authentication-Results:/i.test(l); })[0];
  if (!ar || !/^Authentication-Results:\s*mx\.google\.com\s*;/i.test(ar)) return false;
  if (ok.test(ar)) return true;
  if (!/\barc=pass\b/i.test(ar)) return false;
  var arc1 = linhas.filter(function (l) { return /^ARC-Authentication-Results:\s*i=1\s*;\s*mx\.google\.com\s*;/i.test(l); })[0];
  return !!arc1 && ok.test(arc1);
}

// lê um aviso: { valor, nome, hora } ou null (não é transferência recebida)
function leAviso(b, txt, chegou) {
  var v = txt.match(b.valor);
  if (!v || !b.recebida.test(txt)) return null;
  var np = txt.match(b.pagador);
  // quando (14/11): o servidor usa nome e hora só para desempatar pedidos de mesmo valor
  var fh = txt.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
  var hora = fh ? Date.UTC(+fh[3], +fh[2] - 1, +fh[1], +fh[4] + 3, +fh[5], +(fh[6] || 0)) : 0; // Paraguai = UTC-3 o ano todo
  if (!hora || Math.abs(hora - chegou) > 6 * 36e5) hora = chegou; // data estranha no texto: vale a hora em que o e-mail chegou
  return { valor: v[1], nome: np ? np[1].trim().slice(0, 60) : '', hora: hora };
}

// Para o dono rodar UMA vez depois de colar (botão "Executar" com "confereUltimos" escolhido): mostra, para os últimos avisos
// de cada banco, se a conferência nova aprova. Todos têm de dar "autêntico = true"; algum "false" = me avise antes de esperar o robô.
function confereUltimos() {
  Object.keys(BANCOS).forEach(function (bc) {
    var b = BANCOS[bc];
    GmailApp.search('from:' + b.de + ' ' + b.busca + ' newer_than:30d', 0, 5).forEach(function (f) {
      var m = f.getMessages()[0];
      console.log(bc + ' · ' + m.getDate() + ' · autêntico = ' + autentico(m.getRawContent(), b.dom));
    });
  });
}

function verifica() {
  var chave = PropertiesService.getScriptProperties().getProperty('PIX_ROBO');
  if (!chave) throw new Error('Falta a propriedade PIX_ROBO');
  Object.keys(BANCOS).forEach(function (bc) {
    var b = BANCOS[bc], rot = GmailApp.getUserLabelByName(b.rotulo) || GmailApp.createLabel(b.rotulo);
    GmailApp.search('from:' + b.de + ' ' + b.busca + ' -label:' + b.rotulo + ' newer_than:2d', 0, 20).forEach(function (f) {
      f.getMessages().forEach(function (m) {
        var de = (m.getFrom().match(/<([^>]+)>/) || [, m.getFrom()])[1].toLowerCase();
        var a = de === b.de ? leAviso(b, m.getSubject() + '\n' + m.getPlainBody(), m.getDate().getTime()) : null;
        if (!a) return; // não é aviso de transferência recebida deste banco
        var auth = autentico(m.getRawContent(), b.dom);
        var r = UrlFetchApp.fetch(URL_PIX, { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-robo': chave },
          payload: JSON.stringify({ banco: bc, valor: a.valor, mid: m.getId(), dkim: auth, dom: b.dom, nome: a.nome, hora: a.hora }) });
        if (r.getResponseCode() >= 500) throw new Error('função pix ' + r.getResponseCode()); // tenta de novo no próximo minuto
        if (r.getResponseCode() === 403) console.log(bc + ': aviso recusado (e-mail autêntico = ' + auth + ')');
      });
      f.addLabel(rot);
    });
  });
}
