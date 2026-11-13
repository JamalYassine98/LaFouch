/**
 * Robô do PIX automático (S197, aprovado 12/11/2026) — roda no Google Apps Script da conta lafouch.eyewear@gmail.com.
 * Lê os e-mails do Nubank encaminhados pelo filtro do Gmail, confere remetente + DKIM do nubank.com.br e manda o valor
 * para a função "pix" do Firebase. A chave NÃO fica aqui: Projeto › Configurações › Propriedades do script › PIX_ROBO.
 * Instalar: script.google.com › Novo projeto › colar este arquivo › salvar › Gatilhos › "verifica" a cada 1 minuto.
 */
var URL_PIX = 'https://southamerica-east1-lafouch-2f6bd.cloudfunctions.net/pix';
var ASSUNTO = 'Você recebeu uma transferência';
var REMETENTE = 'todomundo@nubank.com.br';
// Itaú Paraguay (13/11/2026)
var ITAU_DE = 'info@itau.com.py', ITAU_ASSUNTO = 'Aviso de transferencia recibida';

function verifica() {
  verificaItau();
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

function verificaItau() {
  var chave = PropertiesService.getScriptProperties().getProperty('PIX_ROBO');
  if (!chave) return;
  var rot = GmailApp.getUserLabelByName('itau-lido') || GmailApp.createLabel('itau-lido');
  GmailApp.search('from:' + ITAU_DE + ' subject:"' + ITAU_ASSUNTO + '" -label:itau-lido newer_than:2d', 0, 20).forEach(function (f) {
    f.getMessages().forEach(function (m) {
      var cab = m.getRawContent().split(/\r?\n\r?\n/)[0].replace(/\r?\n[ \t]+/g, ' ');
      var dkim = /^(?:ARC-)?Authentication-Results:.*dkim=pass[^;]*header\.(?:i|d)=@?(?:[a-z0-9-]+\.)*itau\.com\.py/im.test(cab);
      var de = (m.getFrom().match(/<([^>]+)>/) || [, m.getFrom()])[1].toLowerCase();
      var v = m.getPlainBody().match(/Monto:?\s*Gs\.?\s*([\d.]+)/i);
      if (de !== ITAU_DE || !v) return;
      var r = UrlFetchApp.fetch(URL_PIX, { method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-robo': chave },
        payload: JSON.stringify({ banco: 'itau', valor: v[1], mid: m.getId(), dkim: dkim, dom: 'itau.com.py' }) });
      if (r.getResponseCode() >= 500) throw new Error('função pix ' + r.getResponseCode());
    });
    f.addLabel(rot);
  });
}
