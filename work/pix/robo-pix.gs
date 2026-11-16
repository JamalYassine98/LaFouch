/**
 * Robô do PIX automático (S197, aprovado 12/11/2026) — roda no Google Apps Script da conta lafouch.eyewear@gmail.com.
 * Lê os e-mails do Nubank encaminhados pelo filtro do Gmail, confere remetente + DKIM do nubank.com.br e manda o valor
 * para a função "pix" do Firebase. A chave NÃO fica aqui: Projeto › Configurações › Propriedades do script › PIX_ROBO.
 * Instalar: script.google.com › Novo projeto › colar este arquivo › salvar › Gatilhos › "verifica" a cada 1 minuto.
 */
var URL_PIX = 'https://southamerica-east1-lafouch-2f6bd.cloudfunctions.net/pix';
var ASSUNTO = 'Você recebeu uma transferência';
var REMETENTE = 'todomundo@nubank.com.br';
// Banco Familiar / Eko (14/11/2026; o Itaú saiu do robô em 16/11/2026, pedido do dono): o aviso chega DIRETO neste Gmail (não precisa de filtro de reenvio).
// Assunto visto: "Transferencia de otros bancos"; corpo: "TRANSFERENCIA DE OTRAS ENTIDADES RECIBIDA" + "Moneda y Monto: PYG 200.000".
var FAM_DE = 'operbancaweb@familiar.com.py';

function verifica() {
  verificaFamiliar();
  var chave = PropertiesService.getScriptProperties().getProperty('PIX_ROBO');
  if (!chave) throw new Error('Falta a propriedade PIX_ROBO');
  var rot = GmailApp.getUserLabelByName('pix-lido') || GmailApp.createLabel('pix-lido');
  var fios = GmailApp.search('from:' + REMETENTE + ' subject:"' + ASSUNTO + '" -label:pix-lido newer_than:2d', 0, 20);
  fios.forEach(function (f) {
    f.getMessages().forEach(function (m) {
      var bruto = m.getRawContent();
      var cab = bruto.split(/\r?\n\r?\n/)[0].replace(/\r?\n[ \t]+/g, ' '); // só o cabeçalho, linhas juntadas
      var dkim = /^(?:ARC-)?Authentication-Results:.*dkim=pass[^;]*header\.(?:i|d)=@?(?:[a-z0-9-]+\.)*nubank\.com\.br/im.test(cab);
      var de = (m.getFrom().match(/<([^>]+)>/) || [, m.getFrom()])[1].toLowerCase();
      var txt = m.getSubject() + ' ' + m.getPlainBody();
      var v = txt.match(/R\$\s*([\d.]+,\d{2})/);
      if (de !== REMETENTE || !v) return;
      var r = UrlFetchApp.fetch(URL_PIX, {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        headers: { 'x-robo': chave },
        payload: JSON.stringify({ valor: v[1], mid: m.getId(), dkim: dkim, dom: 'nubank.com.br' })
      });
      if (r.getResponseCode() >= 500) throw new Error('função pix ' + r.getResponseCode()); // tenta de novo no próximo minuto
    });
    f.addLabel(rot);
  });
}

function verificaFamiliar() {
  var chave = PropertiesService.getScriptProperties().getProperty('PIX_ROBO');
  if (!chave) return;
  var rot = GmailApp.getUserLabelByName('familiar-lido') || GmailApp.createLabel('familiar-lido');
  GmailApp.search('from:' + FAM_DE + ' -label:familiar-lido newer_than:2d', 0, 20).forEach(function (f) {
    f.getMessages().forEach(function (m) {
      var cab = m.getRawContent().split(/\r?\n\r?\n/)[0].replace(/\r?\n[ \t]+/g, ' ');
      // autêntico = assinatura (DKIM) do familiar.com.py OU DMARC aprovado para o remetente familiar.com.py
      var auth = /^(?:ARC-)?Authentication-Results:.*dkim=pass[^;]*header\.(?:i|d)=@?(?:[a-z0-9-]+\.)*familiar\.com\.py/im.test(cab) ||
        /^(?:ARC-)?Authentication-Results:.*dmarc=pass[^;]*header\.from=(?:[a-z0-9-]+\.)*familiar\.com\.py/im.test(cab);
      var de = (m.getFrom().match(/<([^>]+)>/) || [, m.getFrom()])[1].toLowerCase();
      var txt = m.getPlainBody();
      var v = txt.match(/Monto:?\s*(?:PYG|Gs\.?)\s*([\d.]+)/i);
      if (de !== FAM_DE || !v || !/RECIBIDA/i.test(txt)) return; // só transferência RECEBIDA; o resto do banco é ignorado
      // quem pagou e quando (14/11): o servidor usa só para desempatar pedidos de mesmo valor
      var np = txt.match(/Pagador[^:\n]*:\s*([^\n\r]+)/i) || txt.match(/Ordenante[^:\n]*:\s*([^\n\r]+)/i);
      var fh = txt.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
      var hora = fh ? Date.UTC(+fh[3], +fh[2] - 1, +fh[1], +fh[4] + 3, +fh[5], +(fh[6] || 0)) : 0; // Paraguai = UTC-3 o ano todo
      var chegou = m.getDate().getTime();
      if (!hora || Math.abs(hora - chegou) > 6 * 36e5) hora = chegou; // data estranha no texto: vale a hora em que o e-mail chegou
      var r = UrlFetchApp.fetch(URL_PIX, { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-robo': chave },
        payload: JSON.stringify({ banco: 'familiar', valor: v[1], mid: m.getId(), dkim: auth, dom: 'familiar.com.py', nome: np ? np[1].trim().slice(0, 60) : '', hora: hora }) });
      if (r.getResponseCode() >= 500) throw new Error('função pix ' + r.getResponseCode());
      if (r.getResponseCode() === 403) console.log('Familiar: aviso recusado (autenticação do e-mail = ' + auth + ')');
    });
    f.addLabel(rot);
  });
}
