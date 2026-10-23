#!/usr/bin/env python3
"""Testes automáticos do La Fouch.  Uso:  python3 tests/run.py   (ou: npm test)

Abre www/ num Chromium sem interface, com a URL terminando em #test (o app então expõe
window.__LF com as funções internas) e confere contas, lotes, leitor de código, gravação
e as telas. Requer: pip install playwright  (e um Chromium; PLAYWRIGHT_BROWSERS_PATH ou o do sistema).
"""
import asyncio, glob, json, os, subprocess, sys, time
from playwright.async_api import async_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTA = 8799
PRE = """
const L = window.__LF, S = L.S;
// zera as listas que cada teste usa, para não depender dos dados de exemplo
S.fx = {pyg: 7000, brl: 1400, ts: Date.now(), live: false, src: 't', status: ''};
S.cash = {pyg: 100000, usd: 100, brl: 0};
S.ini = {rep: 0, colch: 0, melh: 0};
S.sales = []; S.compras = []; S.melhUso = []; S.imprev = []; S.elog = []; S.cpay = []; S.dlog = []; S.items = []; S.grp = []; S.lotes = [];
S.exp = []; S.volume = 1; S.fxHist = []; S.janela = 30;
"""

# (nome, corpo JS que devolve um valor, esperado)
TESTES = [
 # ---- contas da venda ----
 ("pagamento em R$ com câmbio combinado e troco em G$: caixa, preço líquido e estorno", """
   S.fx.pyg=7000; S.cash={pyg:100000,usd:0,brl:0}; S.volume=1000; S.exp=[]; S.fxHist=[]; S.lotes=[]; S.sales=[];
   S.items=[{tipo:'pre',ref:'T1',grau:'+1',cor:'P',qty:5}];
   const s=L.addSale(S.items[0],1,{moeda:'brl',recebido:20,forma:'din',pag:{rate:1400,extra:[],troco:[{moeda:'pyg',v:3000,rate:1}]}});
   const a=[s.price, S.cash.brl, S.cash.pyg, s.pags.length, s.troco.length];
   L.ACT.estorno(s.id); L.ACT.estorno(s.id);
   return a.concat([S.cash.brl, S.cash.pyg])""", [25000, 20, 97000, 1, 1, 0, 100000]),
 ("pagamento misto: duas moedas somam no caixa e na venda", """
   S.fx.pyg=7000; S.cash={pyg:0,usd:0,brl:0}; S.volume=1000; S.exp=[]; S.fxHist=[]; S.lotes=[]; S.sales=[];
   S.items=[{tipo:'pre',ref:'T1',grau:'+1',cor:'P',qty:5}];
   const s=L.addSale(S.items[0],1,{moeda:'pyg',recebido:10000,forma:'deb',pag:{rate:1,extra:[{moeda:'usd',v:2,rate:7500}],troco:[]}});
   return [s.price, S.cash.pyg, S.cash.usd, s.pags.length, s.taxa]""", [25000, 9800, 1.96, 2, 500]),
 ("período das vendas: hoje, semana (começa na segunda), mês e datas escolhidas", """
   const d=new Date(), y=d.getFullYear(), m=d.getMonth(), dia=d.getDate();
   const iniSem=new Date(y,m,dia-((d.getDay()+6)%7)).getTime(), iniMes=new Date(y,m,1).getTime(), iniDia=new Date(y,m,dia).getTime();
   const mk=(ts)=>({id:'x'+ts,ts:ts,qty:1,price:1000,estorno:false});
   const n=(p,ini)=>{S.per=p; S.sales=[mk(ini+1000), mk(ini-1000)]; return L.vendasPeriodo().length};
   const a=[n('hoje',iniDia), n('semana',iniSem), n('mes',iniMes)];
   S.per='custom'; const dt=y+'-'+('0'+(m+1)).slice(-2)+'-01'; S.perDe=dt; S.perAte=dt; S.sales=[mk(iniMes+1000), mk(iniMes+3*86400000)];
   const c=L.vendasPeriodo().length; S.per='mes';
   return a.concat([c, L.periodoAtual().ini===iniMes])""", [1, 1, 1, 1, True]),
 ("taxa da maquininha: sai do lucro e do caixa, e o estorno devolve só o líquido", """
   S.fx.pyg=7000; S.cash={pyg:0,usd:0,brl:0}; S.volume=1000; S.exp=[]; S.fxHist=[]; S.lotes=[];
   S.items=[{tipo:'pre',ref:'T1',grau:'+1',cor:'P',qty:5}];
   const it=S.items[0];
   const a=L.addSale(it,1,{moeda:'pyg',recebido:25000,forma:'deb'});
   const b=L.addSale(it,1,{moeda:'pyg',recebido:25000,forma:'pix'});
   const cashDepois=S.cash.pyg;
   return [a.forma,a.taxa,b.taxa,b.livre-a.livre,cashDepois]""", ["deb",500,0,500,49500]),
 ("resultado do mês: vendas, custo, taxas, contas pagas, retiradas e sobra", """
   S.fx.pyg=7000; S.cash={pyg:0,usd:0,brl:0}; S.volume=1000; S.exp=[]; S.fxHist=[]; S.lotes=[];
   S.items=[{tipo:'pre',ref:'T1',grau:'+1',cor:'P',qty:5}]; S.retiradas=[]; S.contagens=[];
   const s=L.addSale(S.items[0],2,{moeda:'pyg',recebido:50000,forma:'cre'});
   S.cpay=[{ts:Date.now(),id:1,ym:'x',nome:'Aluguel',valor:10000,cat:'loja'},{ts:Date.now(),id:2,ym:'x',nome:'Casa',valor:4000,cat:'casa'}];
   S.retiradas=[{ts:Date.now(),moeda:'pyg',orig:1000,valor:1000,nota:''}];
   const d=new Date(), r=L.resultadoMes(d.getFullYear(), d.getMonth());
   const ant=L.resultadoMes(d.getFullYear()-1, d.getMonth());
   return [r.vendas, r.taxas, r.contasLoja, r.retTotal, r.resultado===r.vendas-r.cmv-r.taxas-10000, r.sobra===r.resultado-5000, ant.tem]""", [50000, 2000, 10000, 5000, True, True, False]),
 ("fluxo de caixa: entra pelas vendas, sai em contas e avisa quando falta moeda", """
   S.fx.pyg=7000; S.cash={pyg:100000,usd:10,brl:0}; S.volume=1000; S.fxHist=[]; S.lotes=[]; S.sales=[];
   const d=new Date().getDate();
   S.exp=[{id:1,nome:'Condomínio',cat:'loja',tipo:'fixa',moeda:'usd',orig:100,valor:700000,rate0:7000,hist:[],dia:d}];
   const f=L.fluxoCaixa(30);
   return [f.entra, f.contas.length>=1, f.pm.usd.need>=100, f.pm.usd.tem, f.saldo===f.wal+f.entra-f.repGs-f.contasGs]""", [0, True, True, 10, True]),
 ("capital do estoque e dólar favorável", """
   S.fx.pyg=6000; S.sales=[]; S.appStart=Date.now()-100*86400000;
   S.items=[{tipo:'pre',ref:'T1',grau:'+1',cor:'P',qty:10,custo:1}];
   const c=L.capitalEstoque();
   const t=Date.now(); S.janela=30; S.fxHist=[]; for(let i=0;i<10;i++) S.fxHist.push({ts:t-(10-i)*86400000,pyg:7000+i*10,brl:1400});
   S.fx.pyg=6900; const f=L.dolarFavoravel();
   return [c.total>0, c.parado===c.total, f.barato, f.caro]""", [True, True, True, False]),
 ("PIN: guarda só o resumo e confere", """
   return L.hashPin('1234','sal').then(h=>L.hashPin('1234','sal').then(h2=>L.hashPin('1235','sal').then(h3=>[h===h2, h!==h3, h.indexOf('1234')<0])))""", [True, True, True]),
 ("contas em dólar: valor em guaranis segue o câmbio e a reserva cambial entra na peça", """
   S.fx.pyg=7000; S.exp=[{id:1,nome:'Condomínio',cat:'loja',tipo:'fixa',moeda:'usd',orig:100,valor:700000,rate0:7000,hist:[],dia:10}];
   S.volume=100; S.fxHist=[{ts:Date.now()-1000,pyg:7000,brl:1400}]; S.lotes=[];
   const a=L.totalMensal(); S.fx.pyg=7350; const b=L.totalMensal(); const ef=L.efeitoCambio();
   return [a,b,ef,L.reservaCambioContas()>0, L.contasPeca()>Math.round(b/100)]""", [700000, 735000, 35000, True, True]),
 ("aviso de vencimento: dia, moeda e dica de troca", """
   S.fx.pyg=7000; S.cash={pyg:900000,usd:10,brl:0};
   const d=new Date().getDate(), x=new Date(), ym=x.getFullYear()+'-'+('0'+(x.getMonth()+1)).slice(-2), pago={}; pago[ym]=1;
   S.exp=[{id:1,nome:'Condomínio',cat:'loja',tipo:'fixa',moeda:'usd',orig:100,valor:700000,rate0:7000,hist:[],dia:d},
          {id:2,nome:'Longe',cat:'loja',tipo:'fixa',valor:1000,hist:[],dia:((d+14)%28)+1},
          {id:3,nome:'Paga',cat:'loja',tipo:'fixa',valor:1000,hist:[],dia:d,paid:pago}];
   const av=L.avisosVenc(7).filter(a=>a.dias<=0||a.dias<=7); const c=av.filter(a=>a.e.id===1); return [c.length, av.filter(a=>a.e.id===3).length, c[0].e.nome, c[0].ok, /Troque/.test(c[0].dica)]""", [1, 0, 'Condomínio', False, True]),
 ("calcSale: divisão básica", """return L.calcSale({price:25000, repUSD:.65}, 2, 7000, .1, 1000, 500)""",
  {"price":50000,"rep":9100,"repUSD":1.3,"contas":2000,"colch":910,"melh":1000,"livre":36990,"trava":5550}),
 ("calcSale: soma das partes = preço", """
   let ruim = 0;
   for (const qty of [1,2,5]) for (const fx of [6000,7000,8100]) for (const pct of [.05,.12,.25]) for (const p of [3000,25000,90000]) {
     const c = L.calcSale({price:p, repUSD:.65}, qty, fx, pct, 1100, 700);
     if (Math.abs(c.rep + c.contas + c.colch + c.melh + c.livre - c.price) > 1e-6) ruim++;
   } return ruim""", 0),
 ("calcSale: preço manual", """const c = L.calcSale({price:25000, repUSD:.65}, 1, 7000, .1, 1000, 500, 40000); return [c.price, c.livre]""", [40000, 40000-4550-1000-455-500]),
 ("calcSale: venda abaixo do custo não gera melhoria e fica negativa", """const c = L.calcSale({price:5000, repUSD:.65}, 1, 7000, .1, 1000, 500); return [c.melh, c.livre]""", [0, -1005]),
 ("totalMensal e contasPeca", """S.exp=[{valor:100},{valor:300}]; S.volume=40; const a=[L.totalMensal(), L.contasPeca()]; S.volume=0; return a.concat(L.contasPeca())""", [400, 10, 400]),
 # ---- moedas ----
 ("ratePyg e conv", """return [L.ratePyg('pyg'), L.ratePyg('usd'), L.ratePyg('brl'), L.conv(10,'usd','pyg'), L.conv(70000,'pyg','usd'), L.conv(1400,'brl','usd')]""", [1, 7000, 5, 70000, 10, 1]),
 ("walletGs soma as três moedas", """S.cash={pyg:1000, usd:2, brl:10}; return L.walletGs()""", 1000 + 2*7000 + 10*5),
 ("parseDec por moeda", """return [L.parseDec('1.234,56','usd'), L.parseDec('25.000','pyg'), L.parseDec('3,6','brl'), L.parseDec('abc','pyg')]""", [1234.56, 25000, 3.6, 0]),
 ("numAmt", """return ['1.234,56','1,234.56','12,5','US$ 3.60','R$ 75','0,50','',].map(L.numAmt)""", [1234.56, 1234.56, 12.5, 3.6, 75, 0.5, None]),
 # ---- colchão cambial ----
 ("colchao: mínimo 5%", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:7350}]; return L.colchao().pct""", 0.05),
 ("colchao: acompanha a alta", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:7840}]; return L.colchao().pct""", 0.12),
 ("colchao: teto de 25%", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:11000}]; return L.colchao().pct""", 0.25),
 ("colchao: queda do câmbio não conta", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:6000}]; return L.colchao().pct""", 0.05),
 # ---- reservas do caixa ----
 ("reservas: reposição, colchão, contas e livre", """
   const n=Date.now();
   S.sales=[{ts:n, repUSD:1.3, colch:910, melh:1000, contas:2000, estorno:false}];
   S.compras=[{usd:.5}]; S.cash={pyg:100000, usd:0, brl:0};
   const r=L.reservas(); return [r.rUSD, r.repGs, r.colch, r.con, r.melh, r.guard, r.livre]""",
  [0.8, 5600, 910, 2000, 1000, 8510, 90490]),
 ("reservas: venda estornada não reserva nada", """
   S.sales=[{ts:Date.now(), repUSD:1.3, colch:910, melh:1000, contas:2000, estorno:true}]; const r=L.reservas(); return [r.rUSD, r.colch, r.con, r.melh]""", [0, 0, 0, 0]),
 ("reservas: conta paga abate as contas a pagar", """
   const n=Date.now(); S.sales=[{ts:n, repUSD:0, colch:0, melh:0, contas:2000, estorno:false}]; S.cpay=[{ts:n, valor:500}]; return L.reservas().con""", 1500),
 # ---- lotes ----
 ("gUnit: custo médio simples", """return L.gUnit({id:'G', qty:10, totalUsd:20})""", 2),
 ("gUnit: desconta peças com custo próprio", """S.items=[{lote:'G', qty:2, custo:1, bulk:false}]; return L.gUnit({id:'G', qty:10, totalUsd:20})""", 2.25),
 ("grpFalta: total − vendidas − detalhadas", """const g={id:'G', qty:10, sold:2, totalUsd:10}; S.items=[{lote:'G', qty:3, bulk:false},{lote:'G', qty:9, bulk:true}]; return [L.grpTot(g), L.grpDet(g), L.grpFalta(g)]""", [8, 3, 5]),
 ("effCusto: próprio, do lote ou nenhum", """
   S.grp=[{id:'G', qty:10, totalUsd:20}]; return [L.effCusto({custo:3}), L.effCusto({lote:'G'}), L.effCusto({})]""", [3, 2, None]),
 ("lotCharge: desconta do caixa e registra a compra", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'usd'}; L.lotCharge(g); return [S.cash.usd, S.compras.length, S.compras[0].usd, S.compras[0].lot]""", [80, 1, 20, 'G']),
 ("lotCharge: pagamento em guaranis", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'pyg', custoOrig:50000}; L.lotCharge(g); return [S.cash.pyg, S.cash.usd]""", [50000, 100]),
 ("lotRefund: devolve o valor ao caixa", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'usd'}; L.lotCharge(g); L.lotRefund(g); return [S.cash.usd, S.compras.length]""", [100, 0]),
 ("lotAdjust: custo editado ajusta o caixa", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'usd'}; L.lotCharge(g); g.totalUsd=30; L.lotAdjust(g,'usd',20); return [S.cash.usd, S.compras[0].orig]""", [70, 30]),
 ("dedupeItems: junta iguais e mantém diferentes", """
   const a={tipo:'pre', ref:'SP1', grau:'+1.00', cor:'Preto', qty:2}, b=Object.assign({}, a, {qty:3}), c=Object.assign({}, a, {grau:'+2.00'});
   S.items=[a,b,c]; const n=L.dedupeItems(); return [n, S.items.length, S.items[0].qty]""", [1, 2, 5]),
 ("whiten: foto sintética (armação escura em fundo cinza)", """
   const c = L.mkCanvas(600, 400), g = c.getContext('2d');
   g.fillStyle = '#d8d8d8'; g.fillRect(0, 0, 600, 400);
   g.strokeStyle = '#2a2a2a'; g.lineWidth = 14;
   g.beginPath(); g.ellipse(190, 200, 90, 70, 0, 0, 7); g.stroke();
   g.beginPath(); g.ellipse(410, 200, 90, 70, 0, 0, 7); g.stroke();
   g.beginPath(); g.moveTo(280, 190); g.lineTo(320, 190); g.stroke();
   const r = L.whiten(c);
   const d = r.canvas.getContext('2d').getImageData(0, 0, r.canvas.width, r.canvas.height).data;
   let escuros = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 80) escuros++;
   return [r.canvas.width, r.canvas.height, d[0] > 245 && d[1] > 245, escuros > 2000, r.bg.map(v => Math.abs(v - 216) < 12).every(Boolean)]""", [2000, 2000, True, True, True]),
 # ---- movimentos (livro + histórico gravados juntos) ----
 ("lancarCompra: livro e histórico recebem o mesmo fato", """
   L.lancarCompra({ts: 5, desc: 'Compra X', usd: 12.5}); return [S.compras.length, S.dlog.length, S.dlog[0]]""",
  [1, 1, {"ts": 5, "kind": "lote", "desc": "Compra X", "usd": 12.5}]),
 ("lancarMelhoria e lancarImprevisto", """
   L.lancarMelhoria('Tinta', 15000); L.lancarImprevisto('Vitrine', 60000);
   return [S.melhUso.length, S.imprev.length, S.dlog.map(x => x.kind), S.dlog[0].valor, S.dlog[1].valor, S.dlog[0].ts === S.melhUso[0].ts]""",
  [1, 1, ["melh", "imp"], 15000, 60000, True]),
 ("lancarPagamento e desfazerPagamento", """
   const e = {id: 7, nome: 'Aluguel', cat: 'fixa', valor: 900000};
   L.lancarPagamento(e, '2026-10', 99); const dep = [S.cpay.length, S.dlog.length, S.dlog[0].kind, S.dlog[0].valor];
   L.desfazerPagamento(e, '2026-10', 99); return dep.concat([S.cpay.length, S.dlog.length])""",
  [1, 1, "pago", 900000, 0, 0]),
 ("logDespesa: formato e ordem dos campos", """
   L.logDespesa('alt', {nome: 'Luz', cat: 'fixa', de: 100, para: 120}); return Object.keys(S.dlog[0]).join(',')""", "ts,kind,nome,cat,de,para"),
 ("entradaEstoque: registro de entrada", """
   L.entradaEstoque('pre', 'SP1', 'Preto', '+1.00', 6); const x = S.elog[S.elog.length - 1]; return [Object.keys(x).join(','), x.qty, x.ref]""",
  ["ts,tipo,ref,cor,grau,qty", 6, "SP1"]),
 # ---- leitor de código ----
 ("parseHaste: código, medida e variação", """return L.parseHaste(['BR7722\\n51□18 140\\nC3'])""", {"ref":"BR-7722","med":"51□18-140","vr":"C3"}),
 ("parseHaste: 3 letras no prefixo", """return L.parseHaste(['HKJ7241 52-18-145 C2'])""", {"ref":"HKJ-7241","med":"52□18-145","vr":"C2"}),
 ("parseHaste: medidas separadas por espaço", """return L.parseHaste(['SP 1234 54 18 140 C5'])""", {"ref":"SP1234","med":"54□18-140","vr":"C5"}),
 ("parseHaste: texto sem sentido não inventa nada", """return L.parseHaste(['xx'])""", {"ref":"","med":"","vr":""}),
 ("flatParse: linha única", """return L.flatParse('BR7722 51-18-140 C3')""", {"ref":"BR-7722","med":"51□18-140","vr":"C3"}),
 ("parseVote: a maioria vence uma leitura errada", """const v=L.parseVote(['BR7722 51-18-140 C3','BR7722 51-18-140 C3','BR7Z22 51-18-140 C3']); return [v.ref, v.med, v.vr, v.frames]""", ["BR-7722","51□18-140","C3",3]),
 ("hKey e lev (códigos parecidos)", """return [L.hKey('br-77 22'), L.lev('abc','abd'), L.lev('br7722','hkj7241')]""", ["8R7722", 1, 5]),
 ("normRef e normGrau", """return [L.normRef(' br 7722 ', false), L.normRef(' br  7722 ', true), L.normGrau('+2,5'), L.normGrau('2.50'), L.normGrau('')]""", ["BR7722", "BR 7722", "+2.50", "+2.50", ""]),
 ("nrm: sem acento e minúsculo", """return L.nrm('Óculos Espelhado')""", "oculos espelhado"),
 ("parseLote: quantidade da nota", """return ['24 pecas US$ 36,00 total 120','Qtd 30 total USD 45.50','10 pcs'].map(t => L.parseLote(t).qty)""", [24, 30, 10]),
 # ---- faixas, piso, pacotes, brindes ----
 ("pisoPeca: faixa 30% sobre o preço", """S.fx.pyg=7000; S.pfaixa={X:'f1'}; S.faixas=[{id:'f1',nome:'Eco',margem:30,precos:{}}]; const p=L.pisoPeca({tipo:'pre',ref:'X',custo:1,qty:1}); return [p.trava,p.piso,p.saida,p.lista]""", [7000, 10500, 7000, 25000]),
 ("pisoPeca: sem faixa o piso é trava + colchão", """S.pfaixa={}; const p=L.pisoPeca({tipo:'pre',ref:'X',custo:1,qty:1}); return [p.trava,p.piso]""", [7000, 7500]),
 ("pisoPeca: faixa com preço próprio", """S.pfaixa={X:'f1'}; S.faixas=[{id:'f1',nome:'Eco',margem:30,precos:{pre:30000}}]; return L.pisoPeca({tipo:'pre',ref:'X',custo:1,qty:1}).lista""", 30000),
 ("calcSale: brinde entra na reposição e baixa o lucro", """const c = L.calcSale({price:25000, repUSD:.65}, 1, 7000, .1, 1000, 500, undefined, 0.4); return [c.rep, c.repUSD, c.melh, c.livre]""", [7350, 1.05, 500, 15695]),
 ("calcPacote: peças e custo por peça", """return [L.calcPacote(24,2,12), L.calcPacote(20,1,0), L.calcPacote(0,3,5)]""", [{"qty":48,"custo":0.5},{"qty":20,"custo":0},{"qty":0,"custo":0}]),
 ("sazonFator: solar sobe no verão e a curva é editável", """const a=[L.sazonFator('solar',0), L.sazonFator('solar',5), L.sazonFator('pre',0)]; S.sazon={pre:[2,1,1,1,1,1,1,1,1,1,1,1]}; a.push(L.sazonFator('pre',0)); S.sazon={}; return a""", [1.5, 0.6, 1, 2]),
 ("reposicao: vende rápido e acaba logo", """const n=Date.now(); S.faixas=[{id:'f1',nome:'Eco',margem:30,precos:{}}]; S.pfaixa={}; S.sazon={pre:Array(12).fill(1)};
   S.items=[{tipo:'pre',ref:'A',grau:'+1.00',cor:'Preto',qty:3,custo:1}];
   S.sales=[{ts:n-864e5,tipo:'pre',ref:'A',qty:10,livre:7000,fx:7000,estorno:false}];
   const r=L.reposicao(); return [r.length, Math.round(r[0].dias), r[0].comprar]""", [1, 9, 12]),
 ("parados: sem venda há 100 dias tem preço de saída", """S.pfaixa={}; S.sazon={pre:Array(12).fill(1)}; S.appStart=Date.now()-100*864e5; S.sales=[];
   S.items=[{tipo:'pre',ref:'B',grau:'+1.00',cor:'Preto',qty:5,custo:1}]; const p=L.parados(); return [p.length, p[0].pp.saida, Math.round(p[0].diasParado)]""", [1, 7000, 100]),
 ("parados: baixa estação não conta como parado", """S.sazon={solar:Array(12).fill(0.5)}; S.appStart=Date.now()-100*864e5; S.sales=[];
   S.items=[{tipo:'solar',ref:'C',vr:'C1',cor:'Preto',qty:5,custo:1}]; return L.parados().length""", 0),
 ("metaInfo: lucro do mês por faixa", """const n=Date.now(); S.metaUsd=100; S.sales=[{ts:n,tipo:'pre',ref:'A',qty:1,livre:7000,fx:7000,faixa:'f1',estorno:false},{ts:n,tipo:'pre',ref:'A',qty:1,livre:3500,fx:7000,faixa:'',estorno:false},{ts:n,tipo:'pre',ref:'A',qty:1,livre:9999,fx:7000,faixa:'f1',estorno:true}];
   const m=L.metaInfo(); return [m.meta, m.lucro, m.por.f1, m.por['']]""", [100, 1.5, 1, 0.5]),
 ("curvaAbc: A, B e C pelo lucro", """const n=Date.now(); S.items=['P1','P2','P3'].map(r=>({tipo:'pre',ref:r,grau:'+1.00',cor:'Preto',qty:1,custo:1}));
   S.sales=[['P1',80],['P2',15],['P3',5]].map(a=>({ts:n,tipo:'pre',ref:a[0],qty:1,livre:a[1]*7000,fx:7000,estorno:false}));
   return L.curvaAbc().lista.map(m=>m.abc)""", ["A", "B", "C"]),
 ("sugestoes: vende muito e o estoque acaba, sugere subir a margem", """const n=Date.now(); S.appStart=n-120*864e5; S.sazon={pre:Array(12).fill(1)}; S.metaUsd=0;
   S.faixas=[{id:'f1',nome:'Eco',margem:30,precos:{}},{id:'f2',nome:'Lux',margem:50,precos:{}}]; S.pfaixa={P:'f1'}; S.sugIgn={};
   S.items=[{tipo:'pre',ref:'P',grau:'+1.00',cor:'Preto',qty:5,custo:1}];
   S.sales=[{ts:n-864e5,qty:40,faixa:'f1',tipo:'pre',ref:'P',livre:1,fx:7000,estorno:false},{ts:n-60*864e5,qty:20,faixa:'f1',tipo:'pre',ref:'P',livre:1,fx:7000,estorno:false}];
   const r=L.sugestoes(); return [r[0].acao, r[0].para, r[1].acao]""", ["subir", 33, "sem-base"]),
 ("sugestoes: vende pouco e sobra estoque, sugere descer a margem", """const n=Date.now(); S.appStart=n-120*864e5; S.sazon={pre:Array(12).fill(1)}; S.sugIgn={};
   S.faixas=[{id:'f1',nome:'Eco',margem:30,precos:{}}]; S.pfaixa={P:'f1'};
   S.items=[{tipo:'pre',ref:'P',grau:'+1.00',cor:'Preto',qty:100,custo:1}];
   S.sales=[{ts:n-864e5,qty:3,faixa:'f1',tipo:'pre',ref:'P',livre:1,fx:7000,estorno:false},{ts:n-60*864e5,qty:20,faixa:'f1',tipo:'pre',ref:'P',livre:1,fx:7000,estorno:false}];
   const r=L.sugestoes(); return [r[0].acao, r[0].para]""", ["descer", 27]),
 ("sugestoes: sem histórico não sugere nada", """S.appStart=Date.now()-10*864e5; S.sales=[]; S.sugIgn={}; return L.sugestoes()[0].acao""", "sem-base"),
 ("volumeAuto: usa a média real só com histórico", """const n=Date.now(); S.volume=350; S.volAuto=true; S.appStart=n-10*864e5; S.sales=[{ts:n-864e5,qty:50,estorno:false}]; const a=L.volumeEfetivo();
   S.appStart=n-120*864e5; S.sales=[{ts:n-10*864e5,qty:60,estorno:false},{ts:n-40*864e5,qty:30,estorno:false},{ts:n-5*864e5,qty:99,estorno:true}]; const b=[L.volumeAuto(), L.volumeEfetivo()];
   S.volAuto=false; const c=L.volumeEfetivo(); S.volAuto=true; S.sales=[{ts:n-10*864e5,qty:5,estorno:false}]; return [a, b, c, L.volumeEfetivo()]""", [350, [30, 30], 350, 350]),
 ("backup: exporta e restaura tudo", """S.metaUsd=77; S.items=[{tipo:'pre',ref:'K1',grau:'+1.00',cor:'Preto',qty:3}]; S.pfaixa={K1:'f1'}; const txt=L.backupDados();
   S.metaUsd=1; S.items=[]; S.pfaixa={}; const e=L.restaurarDados(txt); return [e, S.metaUsd, S.items.length, S.pfaixa.K1, L.restaurarDados('lixo').length>0, L.restaurarDados('{"app":"outro"}').length>0]""", ["", 77, 1, "f1", True, True]),
]

def igual(a, b):
    if isinstance(b, float) or isinstance(a, float):
        return a is not None and b is not None and abs(a - b) < 1e-6
    if isinstance(b, list):
        return isinstance(a, list) and len(a) == len(b) and all(igual(x, y) for x, y in zip(a, b))
    if isinstance(b, dict):
        return isinstance(a, dict) and all(k in a and igual(a[k], v) for k, v in b.items())
    return a == b

async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORTA), '-d', os.path.join(RAIZ, 'www')],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    exe = next((p for p in ['/opt/pw-browsers/chromium'] + glob.glob('/opt/pw-browsers/chromium*/chrome-linux/chrome') if os.path.exists(p)), None)
    falhas, total = [], 0
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=exe, args=['--no-sandbox']) if exe else await p.chromium.launch(args=['--no-sandbox'])

            async def pagina(scheme='dark', url='#test', ctx=None):
                ctx = ctx or await b.new_context(viewport={'width': 420, 'height': 900}, color_scheme=scheme, service_workers='block')
                await ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = await ctx.new_page()
                pg.erros = []
                pg.on('pageerror', lambda e: pg.erros.append(str(e)))
                await pg.goto(f'http://localhost:{PORTA}/index.html{url}')
                await pg.wait_for_function('window.__LF', timeout=10000)
                return pg

            # contas, lotes e leitor
            pg = await pagina()
            for nome, corpo, esperado in TESTES:
                total += 1
                try:
                    got = await pg.evaluate('() => {' + PRE + corpo + '}')
                    ok = igual(got, esperado)
                except Exception as e:
                    got, ok = f'ERRO {e}', False
                print(('  ok  ' if ok else ' FALHA ') + nome)
                if not ok:
                    falhas.append(nome); print('        esperado', json.dumps(esperado, ensure_ascii=False), '\n        veio    ', json.dumps(got, ensure_ascii=False))
            total += 1
            if pg.erros: falhas.append('erros de JavaScript'); print(' FALHA erros de JavaScript:', pg.erros)
            else: print('  ok  sem erros de JavaScript nos testes')


            # fluxos pela tela: os botões gravam livro + histórico e mexem no caixa
            pg = await pagina()
            await pg.evaluate("() => { const S = window.__LF.S; S.cash = {pyg: 5000000, usd: 500, brl: 0}; S.compras = []; S.dlog = []; S.imprev = []; S.melhUso = []; S.cpay = []; window.__LF.render(); }")
            total += 1
            await pg.evaluate("() => { const S = window.__LF.S; S.ini.melh = 400000; window.__LF.render(); }")
            await pg.locator('#mainnav >> text="Caixa"').first.click(); await pg.wait_for_timeout(300)
            await pg.fill('#muD', 'Tinta'); await pg.fill('#muV', '50000')
            await pg.locator('[data-act="melhuso"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.melhUso.length, S.dlog.filter(x => x.kind === 'melh').length, S.cash.pyg] }")
            ok = got == [1, 1, 4950000]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Caixa: registrar uso de melhorias')
            if not ok: falhas.append('tela melhorias'); print('        veio', got)
            total += 1
            await pg.locator('#mainnav >> text="Despesas"').first.click(); await pg.wait_for_timeout(300)
            await pg.fill('#impD', 'Conserto'); await pg.fill('#impV', '60000')
            await pg.locator('[data-act="impadd"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.imprev.length, S.dlog.filter(x => x.kind === 'imp').length] }")
            ok = got == [1, 1]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Despesas: registrar imprevisto')
            if not ok: falhas.append('tela imprevisto'); print('        veio', got)


            # tela do produto: lista única de cores, um só botão Vender e janela Editar
            FOTO = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            SETUP = """(foto) => { const L = window.__LF, S = L.S;
              S.items = S.items.filter(i => i.ref !== 'BR44118');
              [['C1','Preto',4,5],['C2','Bege',4,null],['C3','Tartaruga',2,null]].forEach(a => { const it = {tipo:'sem', ref:'BR44118', grau:'', med:'53x18-140', vr:a[0], fmt:'Quadrado', cor:a[1], qty:a[2]}; if (a[3] != null) it.custo = a[3]; S.items.push(it); });
              S.tiposX = [{id:'estojo', label:'Estojos', full:'Estojos', price:10000, repUSD:1, pago:1, simple:true}]; L.syncTipos();
              S.items = S.items.filter(i => i.ref !== 'Estojo A');
              [['Preto',3],['Marrom',2]].forEach(a => S.items.push({tipo:'estojo', ref:'Estojo A', grau:'', med:'', vr:'', fmt:'', cor:a[0], qty:a[1]}));
              S.pnome = S.pnome || {}; S.pnome['BR44118'] = 'Hexagonal';
              S.fotos['BR44118|Preto'] = foto; S.fotos['Estojo A|Preto'] = foto; S.desc = S.desc || {}; delete S.desc['BR44118'];
              S.det = false; S.open = ''; S.qEdit = false; L.render(); }"""

            async def abrir(tipo, nome):
                pg = await pagina()
                await pg.evaluate(SETUP, FOTO)
                await pg.evaluate("(t) => { window.__LF.S.tipo = t; window.__LF.S.todos = false; window.__LF.render(); }", tipo)
                await pg.locator('#mainnav >> text="Inventário"').first.click(); await pg.wait_for_timeout(300)
                await pg.locator('#listCard >> text=' + nome).first.click(); await pg.wait_for_timeout(400)
                return pg

            async def checa(nome, ok, got=None):
                nonlocal total
                total += 1
                print(('  ok  ' if ok else ' FALHA ') + nome)
                if not ok:
                    falhas.append(nome); print('        veio', got)

            pg = await abrir('sem', 'Hexagonal')
            got = await pg.evaluate("() => [document.querySelectorAll('#detail .pl.pick').length, document.querySelectorAll('#detail .vbar button').length, document.querySelectorAll('#detail .pl button').length, document.querySelector('#detail .vbar button').innerText]")
            await checa('produto: 3 cores em lista única e um só botão Vender', got == [3, 1, 0, 'Vender C1 · Preto'], got)
            await pg.locator('#detail .pl.pick').nth(1).click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => [document.querySelector('#detail .vbar button').innerText, window.__LF.S.detCor]")
            await checa('produto: tocar numa cor muda o que o Vender vende', got == ['Vender C2 · Bege', 'Bege'], got)
            await pg.locator('#detail .vbar button').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.vSel && window.__LF.S.vSel.cor]")
            await checa('produto: Vender leva à venda da cor selecionada', got == ['vendas', 'Bege'], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty = 0; S.detRow = null; S.detCor = ''; window.__LF.render(); }")
            await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => [document.querySelector('#detail .vbar button').innerText, document.querySelector('#detail .vbar button').disabled]")
            await checa('produto: cor sem estoque não é escolhida por padrão', got == ['Vender C2 · Bege', False], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            ok = await pg.locator('#editModal').count() == 1
            await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('9'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab'); await pg.wait_for_timeout(200)
            await pg.locator('#editModal input[aria-label="Custo por peça em US$"]').nth(1).fill('2,5'); await pg.locator('#editModal input[aria-label="Custo por peça em US$"]').nth(1).press('Tab'); await pg.wait_for_timeout(200)
            antes = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'BR44118').map(i => [i.cor, i.qty, i.custo])")
            await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(300)
            depois = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'BR44118').map(i => [i.cor, i.qty, i.custo])")
            fechou = await pg.locator('#editModal').count() == 0
            await checa('janela Editar: quantidade e custo só valem ao salvar', ok and antes[0][1] == 4 and depois == [['Preto', 9, 5], ['Bege', 4, 2.5], ['Tartaruga', 2, None]] and fechou, [antes, depois, fechou])

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('1'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab')
            await pg.fill('#descTa', 'rascunho'); await pg.wait_for_timeout(200)
            await pg.locator('#editModal button:text-is("Cancelar")').last.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty, window.__LF.S.desc['BR44118'], !!document.getElementById('editModal')]")
            await checa('janela Editar: Cancelar descarta tudo', got == [4, None, False], got)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.fill('#descTa', 'Polarizado, mola flexível'); await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.desc['BR44118'], document.getElementById('detail').innerText.includes('Polarizado, mola flexível')]")
            await checa('janela Editar: descrição salva e mostrada na tela', got == ['Polarizado, mola flexível', True], got)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal button:text-is("Excluir foto")').click(); await pg.wait_for_timeout(200)
            ainda = await pg.evaluate("() => !!window.__LF.S.fotos['BR44118|Preto']")
            await pg.locator('#editModal button:text-is("Sim, excluir")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [!!window.__LF.S.fotos['BR44118|Preto'], window.__LF.S.items.filter(i => i.ref === 'BR44118').length, !!document.getElementById('editModal')]")
            await checa('janela Editar: excluir foto pede confirmação e não mexe no estoque', ainda and got == [False, 3, True], [ainda, got])

            await pg.locator('#editModal #edCodigo').fill('br99999')
            await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(400)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR99999').length, window.__LF.S.items.filter(i => i.ref === 'BR44118').length, window.__LF.S.open, !!window.__LF.S.pnome['BR99999'], document.getElementById('detail').hidden]")
            await checa('janela Editar: trocar o código move o produto', got == [3, 0, 'BR99999', True, False], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => window.__LF.S.items.push({tipo:'sem', ref:'OUTRO1', grau:'', med:'', vr:'C1', fmt:'Quadrado', cor:'Azul', qty:1})")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal #edCodigo').fill('OUTRO1')
            await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR44118').length, !!document.getElementById('editModal')]")
            await checa('janela Editar: código repetido é recusado', got == [3, True], got)

            pg = await abrir('estojo', 'Estojo A')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal button:text-matches("Excluir a cor")').click(); await pg.wait_for_timeout(200)
            await pg.locator('#editModal button:text-is("Sim, excluir")').click(); await pg.wait_for_timeout(400)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'Estojo A').map(i => i.cor), !!window.__LF.S.fotos['Estojo A|Preto'], !!document.getElementById('editModal')]")
            await checa('janela Editar: excluir a cor remove peças e foto dela', got == [['Marrom'], False, False], got)

            # venda com desconto, piso, confirmação e brinde (pela tela)
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.exp = []; S.volume = 1; S.sales = []; S.cash = {pyg: 0, usd: 0, brl: 0};
              S.faixas = [{id:'f1', nome:'Eco', margem:30, precos:{}}]; S.pfaixa = {VP1:'f1'};
              S.tiposX = [{id:'estojo', label:'Estojos', full:'Estojos', price:10000, repUSD:1, pago:1, simple:true}]; L.syncTipos();
              S.items = [{tipo:'pre', ref:'VP1', grau:'+1.00', med:'', vr:'', fmt:'', cor:'Preto', qty:5, custo:1},
                         {tipo:'estojo', ref:'Estojo B', grau:'', med:'', vr:'', fmt:'', cor:'Preto', qty:3, custo:0.4}];
              S.vTipo = 'all'; S.vq = ''; S.vFaixa = ''; S.vRef = 'pre|VP1'; S.vSel = S.items[0]; S.qty = 1; S.moeda = 'pyg'; S.rec = null; S.descTxt = '';
              L.setView('vendas'); }""")
            await pg.wait_for_timeout(300)
            total += 1
            t1 = await pg.inner_text('#pisoSt')
            await pg.fill('#descIn', '20000'); await pg.wait_for_timeout(300)
            t2 = await pg.inner_text('#pisoSt'); b1 = await pg.inner_text('#sgo')
            await pg.click('#sgo'); await pg.wait_for_timeout(200)
            n1 = await pg.evaluate("() => window.__LF.S.sales.length")
            await pg.click('#sgo'); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S, s = S.sales[0]; return [S.sales.length, s && s.abaixo, s && s.perde, S.items[0].qty, s && s.faixa, s && s.lista] }")
            ok = 'Acima do piso' in t1 and 'Abaixo da trava' in t2 and 'abaixo do piso' in b1 and n1 == 0 and got == [1, True, True, 4, 'f1', 25000]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: desconto abaixo do piso pede confirmação')
            if not ok: falhas.append('venda abaixo do piso'); print('        veio', t1, '|', t2, '|', b1, n1, got, pg.erros)
            total += 1
            await pg.evaluate("() => { const S = window.__LF.S; S.vRef = 'pre|VP1'; S.vSel = S.items[0]; S.qty = 1; S.rec = null; S.descTxt = ''; window.__LF.render(); }")
            await pg.locator('#brChips button:has-text("Estojo B")').click(); await pg.wait_for_timeout(200)
            await pg.click('#sgo'); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S, s = S.sales[0]; return [S.sales.length, S.items[1].qty, s.brinde && s.brinde.usd, s.repUSD, s.abaixo] }")
            ok = got == [2, 2, 0.4, 1.4, False]
            await pg.evaluate("() => { const A = window.__LF.ACT, S = window.__LF.S, id = S.sales[0].id; A.estorno(id); A.estorno(id); }")
            got2 = await pg.evaluate("() => { const S = window.__LF.S; return [S.items[1].qty, S.items[0].qty] }")
            ok = ok and got2 == [3, 4]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: brinde sai do estoque, entra no custo e volta no estorno')
            if not ok: falhas.append('brinde'); print('        veio', got, got2, pg.erros)
            await pg.close()

            # aba Vendas: tocar no produto abre a mesma tela do catálogo em modo venda
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.vRef = ''; S.vSel = null; S.vq = ''; S.vTipo = 'all'; S.vFaixa = ''; S.qty = 1; L.setView('vendas'); }""")
            await pg.wait_for_timeout(300)
            total += 1
            a = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, document.getElementById('vSaleCard').hidden]")
            await pg.locator('#vRows .pcard:has-text("SP57765")').click(); await pg.wait_for_timeout(400)
            cat1 = await pg.evaluate("() => document.getElementById('catV').hidden")
            b1 = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, document.getElementById('vSaleCard').hidden, !!document.querySelector('#vDetail button[aria-label=\\'Editar\\']'), document.querySelectorAll('#vDetail .pl.pick').length]")
            await pg.locator('#vDetail .pl.pick').nth(1).click(); await pg.wait_for_timeout(300)
            c = await pg.evaluate("() => { const S = window.__LF.S; return [S.vSel && S.vSel.grau, document.getElementById('spc').textContent.indexOf(S.vSel.grau) >= 0] }")
            await pg.locator('#vDetail button[aria-label="Voltar"]').click(); await pg.wait_for_timeout(300)
            d = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, window.__LF.S.vRef]")
            cat2 = await pg.evaluate("() => document.getElementById('catV').hidden")
            ok = cat1 is True and cat2 is False and a == [False, True, True] and b1 == [True, False, False, False, 4] and c == ['+1.00', True] and d == [False, True, ''] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: produto abre em janela própria, escolhe a variante e volta à lista')
            if not ok: falhas.append('vendas janela'); print('        veio', a, b1, c, d, pg.erros)
            await pg.close()

            # contagem de estoque no cartão "Em estoque": por valor, com resumo e aplicação
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [
                {tipo:'pre', ref:'CT1', grau:'+1.00', med:'', vr:'', fmt:'', cor:'Preto', qty:10, custo:0.5},
                {tipo:'sem', ref:'CT2', grau:'', med:'', vr:'C1', fmt:'Quadrado', cor:'Preto', qty:3, custo:5}];
              S.todos = true; S.q = ''; S.faixaF = ''; S.sales = []; S.contagens = []; S.elog = []; S.conf = {}; S.tolUsd = 0.5; L.setView('estoque'); }""")
            await pg.wait_for_timeout(300)
            total += 1
            await pg.click('#kCont'); await pg.wait_for_timeout(300)
            ordem = await pg.evaluate("() => [...document.querySelectorAll('#contCard .card b')].map(b => b.textContent)")
            await pg.locator('#contCard input').nth(0).fill('2'); await pg.locator('#contCard input').nth(0).press('Tab'); await pg.wait_for_timeout(300)
            await pg.locator('#contCard input').nth(1).fill('9'); await pg.locator('#contCard input').nth(1).press('Tab'); await pg.wait_for_timeout(300)
            await pg.locator('#contCard button:has-text("Revisar")').click(); await pg.wait_for_timeout(300)
            resumo = await pg.inner_text('#contCard')
            await pg.locator('#contCard button:has-text("Aplicar")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.items[1].qty, S.items[0].qty, S.contagens.length, Math.round(S.contagens[0].valorUsd * 100) / 100, S.elog.filter(e => e.contagem).length, !!S.conf['sem|CT2'], !!S.conf['pre|CT1'], document.getElementById('contCard').hidden] }")
            ok = ordem[:2] == ['CT2', 'CT1'] and 'faltam US$ 5,50' in resumo and got == [2, 9, 1, -5.5, 2, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Estoque: contagem por valor, resumo em dinheiro e aplicação')
            if not ok: falhas.append('contagem'); print('        veio', ordem, resumo[-200:], got, pg.erros)
            await pg.close()

            # aba Ajustes: meta, faixa nova, contagem de estoque e backup
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.items = [{tipo:'pre', ref:'AJ1', grau:'+1.00', med:'', vr:'', fmt:'', cor:'Preto', qty:6, custo:1}]; L.setView('ajustes'); }")
            await pg.wait_for_timeout(300)
            total += 1
            await pg.fill('[data-aj="meta"]', '600'); await pg.press('[data-aj="meta"]', 'Tab'); await pg.wait_for_timeout(300)
            await pg.fill('#fnew', 'Premium'); await pg.locator('[data-act="fadd"]').click(); await pg.wait_for_timeout(300)
            await pg.fill('[data-aj="vol"]', '500'); await pg.press('[data-aj="vol"]', 'Tab'); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.metaUsd, S.faixas.map(f => f.nome).pop(), S.volume] }")
            ok = got == [600, 'Premium', 500] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Ajustes: meta, nova faixa e peças por mês')
            if not ok: falhas.append('tela ajustes'); print('        veio', got, pg.erros)
            total += 1
            await pg.locator('#mainnav >> text="Dashboard"').first.click(); await pg.wait_for_timeout(300)
            tx = await pg.inner_text('#v-dash')
            ok = 'Meta do mês' in tx and 'US$ 600' in tx and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Dashboard: mostra meta do mês')
            if not ok: falhas.append('dash meta'); print('        veio', tx[:200], pg.erros)
            await pg.close()

            # edição de faixa pela janela Editar e entrada por pacote
            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#edFaixas button:has-text("Luxo")').click(); await pg.wait_for_timeout(200)
            await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return S.pfaixa['BR44118'] === S.faixas.filter(f => f.nome === 'Luxo')[0].id }")
            await checa('janela Editar: escolher a faixa do produto', got is True, got)
            total += 1
            await pg.evaluate("""() => { const v = (id, x) => { const e = document.getElementById(id); e.value = x; e.dispatchEvent(new Event('input', {bubbles: true})); };
              v('pkN', '24'); v('pkQ', '2'); v('pkC', '12'); document.getElementById('pkGo').click(); }""")
            await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => [window.__LF.S.qty, document.getElementById('eCusto').value, document.getElementById('pkH').textContent]")
            ok = got[0] == 48 and got[1] == '0,5' and '48 peças' in got[2]
            print(('  ok  ' if ok else ' FALHA ') + 'cadastro: entrada por pacote preenche quantidade e custo')
            if not ok: falhas.append('pacote'); print('        veio', got)

            # finanças pela tela: retirada, conferência do caixa, resultado e fluxo no Dashboard
            pg = await pagina()
            await pg.evaluate("() => { const S = window.__LF.S; S.cash = {pyg: 5000000, usd: 500, brl: 0}; S.retiradas = []; S.confCx = []; S.dlog = []; window.__LF.render(); }")
            await pg.locator('#mainnav >> text="Caixa"').first.click(); await pg.wait_for_timeout(300)
            await pg.fill('#rtV', '200000'); await pg.fill('#rtN', 'Almoço')
            await pg.locator('[data-act="rtgo"]').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.retiradas.length, S.cash.pyg, S.dlog.filter(x => x.kind === 'ret').length] }")
            await checa('Caixa: retirada do dono sai do caixa e vai ao histórico', got == [1, 4800000, 1], got)
            await pg.locator('[data-act="rtdes"]').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.retiradas.length, S.cash.pyg, S.dlog.filter(x => x.kind === 'ret').length] }")
            await checa('Caixa: desfazer retirada devolve o dinheiro', got == [0, 5000000, 0], got)
            await pg.locator('[data-act="ccabrir"]').first.click(); await pg.wait_for_timeout(300)
            await pg.fill('#ccP', '4900000'); await pg.locator('[data-act="ccgo"]').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.ccRes && S.ccRes.ok, S.confCx.length] }")
            await checa('Caixa: conferência acha a diferença', got == [False, 1], got)
            await pg.locator('[data-act="ccadj"]').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.cash.pyg, S.confCx[0].ajustou, window.__LF.ccDias()] }")
            await checa('Caixa: ajustar o saldo para o contado', got == [4900000, True, 0], got)
            await pg.locator('#mainnav >> text="Dashboard"').first.click(); await pg.wait_for_timeout(300)
            tx = await pg.inner_text('#v-dash')
            await checa('Dashboard: abre no Resumo com "Atenção agora" e as 4 partes', 'Atenção agora' in tx and all(t in tx for t in ['Resumo', 'Dinheiro', 'Giro', 'Preços']) and not pg.erros, [tx[:150], pg.erros])
            await pg.locator('[data-act="dtab"][data-id="din"]').first.click(); await pg.wait_for_timeout(300)
            tx = await pg.inner_text('#v-dash')
            await checa('Dashboard Dinheiro: resultado e fluxo em linhas que abrem', 'Resultado do mês' in tx and 'Fluxo de caixa projetado' in tx and 'Retirada do dono' in tx and 'Resultado de outubro' not in tx.lower() and not pg.erros, [tx[:200], pg.erros])
            await pg.locator('[data-act="dfold"][data-id="flx"]').first.click(); await pg.wait_for_timeout(300)
            await pg.locator('[data-act="fluxod"][data-id="90"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => window.__LF.S.fluxoD")
            await checa('Dashboard: fluxo muda para 90 dias', got == 90, got)
            for tab in ['giro', 'prec']:
                await pg.locator(f'[data-act="dtab"][data-id="{tab}"]').first.click(); await pg.wait_for_timeout(300)
            await checa('Dashboard: abas Giro e Preços abrem sem erro', not pg.erros, pg.erros)
            await pg.close()

            # venda concluída: marca de ok e barras do resumo
            pg = await pagina()
            got = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [{tipo:'pre', ref:'T1', grau:'+1', cor:'P', qty:3}];
              const s = L.addSale(S.items[0], 1, {moeda:'pyg', recebido:25000, forma:'din'}); L.showSplit(s);
              return [document.querySelectorAll('#splitCard .okck').length, document.querySelectorAll('#splitBar i').length > 3, !document.getElementById('splitCard').hidden] }""")
            await checa('venda concluída: marca de ok e barras aparecem', got == [1, True, True], got)
            await pg.close()

            # PIN: ativar, recarregar e desbloquear; cópia automática
            ctx = await b.new_context(viewport={'width': 420, 'height': 900}, service_workers='block')
            pg = await pagina(ctx=ctx)
            await pg.locator('#mainnav >> text="Ajustes"').first.click(); await pg.wait_for_timeout(300)
            await pg.fill('#pin1', '4321'); await pg.fill('#pin2', '4321')
            await pg.locator('[data-act="pinset"]').first.click(); await pg.wait_for_timeout(500)
            await pg.locator('[data-act="abagora"]').first.click(); await pg.wait_for_timeout(800)
            tx = await pg.inner_text('#v-ajustes')
            await checa('Ajustes: PIN ativo e cópia automática listada', 'PIN ativo' in tx and ' KB' in tx, tx[-300:])
            await pg.wait_for_timeout(1500)
            await pg.evaluate("() => history.replaceState(null, '', '#test')")
            await pg.reload(); await pg.wait_for_function('window.__LF')
            vis = await pg.evaluate("() => !document.getElementById('lockScr').hidden")
            await checa('PIN: o app abre bloqueado', vis is True, vis)
            await pg.fill('#lockPin', '0000'); await pg.click('#lockGo'); await pg.wait_for_timeout(300)
            msg = await pg.inner_text('#lockM')
            await checa('PIN: errado não abre', 'incorreto' in msg, msg)
            await pg.fill('#lockPin', '4321'); await pg.click('#lockGo'); await pg.wait_for_timeout(300)
            vis = await pg.evaluate("() => !document.getElementById('lockScr').hidden")
            await checa('PIN: certo abre', vis is False, vis)
            await ctx.close()

            # venda: formas de pagamento aparecem
            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail .vbar button').click(); await pg.wait_for_timeout(500)
            await pg.evaluate("() => { window.__LF.S.forma = 'din'; window.__LF.render(); }")
            n = await pg.evaluate("() => document.querySelectorAll('#formaChips button').length")
            await checa('Vendas: botões de forma de pagamento', n == 4, n)

            # gravação: o que foi salvo volta depois de recarregar
            total += 1
            ctx = await b.new_context(viewport={'width': 420, 'height': 900}, service_workers='block')
            pg = await pagina(ctx=ctx)
            await pg.evaluate("() => { const L = window.__LF; L.S.items.push({tipo:'pre', ref:'TESTE999', grau:'+1.00', cor:'Preto', qty:7}); L.S.cash.usd = 123.45; L.saveSoon(); }")
            await pg.wait_for_timeout(1500)
            await pg.reload(); await pg.wait_for_function('window.__LF')
            got = await pg.evaluate("() => { const S = window.__LF.S; const i = S.items.filter(x => x.ref === 'TESTE999')[0]; return [!!i && i.qty, S.cash.usd] }")
            ok = got == [7, 123.45]
            print(('  ok  ' if ok else ' FALHA ') + 'gravação: dados voltam após recarregar')
            if not ok: falhas.append('gravação'); print('        veio', got)
            await ctx.close()

            # telas: 8 abas x 2 temas, sem erro e com conteúdo
            fundos = {}
            for scheme in ['dark', 'light']:
                pg = await pagina(scheme)
                for aba in ['Dashboard', 'Inventário', 'Vendas', 'Caixa', 'Câmbio', 'Despesas', 'Histórico', 'Ajustes']:
                    total += 1
                    loc = pg.locator(f'#mainnav >> text="{aba}"').first
                    try:
                        await loc.click(timeout=3000); await pg.wait_for_timeout(300)
                        n = await pg.evaluate("() => document.body.innerText.length")
                        ok = n > 150 and not pg.erros
                    except Exception as e:
                        ok, n = False, str(e)[:80]
                    print(('  ok  ' if ok else ' FALHA ') + f'tela {aba} ({scheme})')
                    if not ok: falhas.append(f'tela {aba} {scheme}'); print('        ', n, pg.erros)
                fundos[scheme] = await pg.evaluate("() => getComputedStyle(document.body).backgroundColor")
            total += 1
            ok = fundos['dark'] != fundos['light']
            print(('  ok  ' if ok else ' FALHA ') + f'tema automático: escuro {fundos["dark"]} / claro {fundos["light"]}')
            if not ok: falhas.append('tema')
            await b.close()
    finally:
        srv.kill()
    print(f'\n{total - len(falhas)}/{total} testes passaram' + ('' if not falhas else f'  |  FALHARAM: {", ".join(falhas)}'))
    sys.exit(1 if falhas else 0)

asyncio.run(main())
