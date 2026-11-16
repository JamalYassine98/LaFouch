// S396 · esboço 60: o cliente recebendo o cartão de desconto por e-mail DEPOIS de receber a compra (molde aprovado dos e-mails). Nada implementado.
const E=require('/home/claude/lafouch/functions/email.js');
const val='Vale até 16/01/2027 · em lafouch.com e na loja';
const a=E.molde('Sua compra '+E.I('chegou'),E.P('Obrigada pela preferência, Maria. Para a sua próxima compra, um presente:')+E.cartao('CARTÃO PRESENTE','10% na próxima compra','LF-7K2M',val,true)+E.B('Usar agora','#')+E.PQ('Um código por compra. Não soma com OFERTA nem com “Leve 2”: vale o maior desconto.'));
const b=E.molde('Gostou dos seus '+E.I('óculos')+'?',E.P('Presenteie uma amiga: ela ganha 10% na primeira compra, e você ganha outro cartão de 10% quando ela comprar.')+E.cartao('CARTÃO PRESENTE','10% para sua amiga','AMIGA-9H3LQ5','Vale até 16/01/2027',false)+E.B('Enviar para uma amiga','#')+E.LK('Contar como foi a compra','#'));
require('fs').writeFileSync('/tmp/s396/e.json',JSON.stringify([{arq:'a',assunto:'Sua compra chegou · um presente para a próxima',html:a},{arq:'b',assunto:'Um presente para uma amiga',html:b}]));
