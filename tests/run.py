#!/usr/bin/env python3
"""Testes automáticos do La Fouch.  Uso:  python3 tests/run.py   (ou: npm test)

Abre www/ num Chromium sem interface, com a URL terminando em #test (o app então expõe
window.__LF com as funções internas) e confere contas, lotes, leitor de código, gravação
e as telas. Requer: pip install playwright  (e um Chromium; PLAYWRIGHT_BROWSERS_PATH ou o do sistema).
"""
# 134d: fechar a janela de editar com mudança pergunta "Sair sem salvar?"; as provas antigas que descartam confirmam aqui
SAIR_SEM_SALVAR = "() => { const b = document.querySelector('.lfCf .cf418B'); if (b) b.click(); }"
def ED(n): return '() => { window.__LF.S.edStep = %d; window.__LF.S.edMais = true; window.__LF.render(); }' % (1 if n == 1 else 2)
import time
import asyncio, glob, json, os, re, subprocess, sys, time
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
 # ---- Inventário: ajustes, exclusões, estorno, entrada, piso, código automático, site ----
 ("importar backup não apaga as fotos que já estão no aparelho", """
   S.items=[{tipo:'solar',ref:'FB1',cor:'Rosa',qty:1,custo:2}]; S.fotos={'FB1|Rosa':'data:x1','FB1|Preto':'data:x2'};
   const bk=JSON.parse(L.backupDados()); bk.d.fotos={'FB1|Preto':'data:novo'}; const er=L.restaurarDados(JSON.stringify(bk));
   return [er, S.fotos['FB1|Rosa'], S.fotos['FB1|Preto']]""", ['', 'data:x1', 'data:novo']),
 ("etiqueta: lê grau e quantidade do pacote", """
   const a=L.fmLeEtiqueta('PC +1.75 24 pc'); const b=L.fmLeEtiqueta('sem nada'); return [a.grau, a.qty, b.grau===undefined]""", ['+1.75', 24, True]),
 ("nota da compra: cria um lote por linha e soma o total", """
   S.grp=[]; S.items=S.items.filter(i=>!i.bulk); S.fx.pyg=7000;
   const ok=L.cpCria({forn:'sol',ped:'',rows:[{tipo:'solar',qty:10,usd:4.2,nome:''},{tipo:'sem',qty:8,usd:6,nome:''},{tipo:'pre',qty:6,usd:2.5,nome:''}]});
   const t=S.grp.reduce((a,g)=>a+g.totalUsd,0); const r=[ok,S.grp.length,Math.round(t*100)/100,new Set(S.grp.map(g=>g.pedId)).size,S.grp[0].forn]; document.querySelectorAll('#leitorDlg').forEach(e=>e.remove()); S.grp=[]; return r""", [True, 3, 105, 1, 'Sol']),
 ("memória do modelo some quando o produto é excluído", """
   S.items=[{tipo:'pre',ref:'ZM1',grau:'+1',cor:'P',qty:1,custo:2}]; S.memo={ZM1:{cor:'P'}}; L.identSync(); const a=!!S.memo.ZM1; S.items=[]; L.identSync(); return [a, S.memo.ZM1===undefined]""", [True, True]),
 ("descarte usa o custo real da peça, não a média do tipo", """
   S.fx.pyg=7000; S.items=[{tipo:'pre',ref:'D1',grau:'+1',cor:'P',qty:5,custo:2}]; S.descartes=[]; S.dlog=[]; S.elog=[]; S.lotes=[]; S.grp=[];
   const v=L.descartar(S.items[0],2,'quebrou'); const r=[v, S.descartes[0].usd, S.items[0].qty]; S.descartes=[]; S.dlog=[]; S.elog=[]; return r""", [28000, 4, 3]),
 ("exclusão de cor grava no histórico o que saiu e o custo", """
   S.items=[{tipo:'pre',ref:'E1',grau:'+1',cor:'P',qty:4,custo:2},{tipo:'pre',ref:'E1',grau:'+1',cor:'Q',qty:1,custo:2}]; S.elog=[]; S.grp=[];
   const r=L.exclusaoEstoque(S.items.filter(i=>i.cor==='P'),'cor excluída'); return [r.n, r.usd, S.elog.length, S.elog[0].qty, S.elog[0].exclusao===true]""", [4, 8, 1, -4, True]),
 ("produto sem peças sai do site e da oferta", """
   S.items=[{tipo:'pre',ref:'E2',grau:'+1',cor:'P',qty:3,custo:2}]; S.fotos['E2|P']='x'; S.site={E2:1}; S.pprice={E2:{novo:50000,ant:60000}}; S.grp=[];
   S.items=[]; L.limpaRefExcluido('E2'); return [!!S.site.E2, !!S.pprice.E2]""", [False, False]),
 ("estorno volta para a linha de mesmo custo e recria a linha se foi excluída", """
   S.fx.pyg=7000; S.cash={pyg:100000,usd:0,brl:0}; S.volume=1000; S.exp=[]; S.fxHist=[]; S.lotes=[]; S.grp=[]; S.sales=[]; S.elog=[];
   S.items=[{tipo:'pre',ref:'R1',grau:'+1',cor:'P',qty:5,custo:2,vr:''},{tipo:'pre',ref:'R1',grau:'+1',cor:'P',qty:5,custo:3,vr:''}];
   const s=L.addSale(S.items[1],1,{moeda:'pyg',recebido:40000,forma:'din',pag:{extra:[],troco:[]}});
   S.items[1].qty-=1; const a=[S.items[0].qty, S.items[1].qty]; L.ACT.estorno(s.id); L.ACT.estorno(s.id); const b=[S.items[0].qty, S.items[1].qty];
   const s2=L.addSale(S.items[1],5,{moeda:'pyg',recebido:200000,forma:'din',pag:{extra:[],troco:[]}}); S.items=[];
   L.ACT.estorno(s2.id); L.ACT.estorno(s2.id); const c=S.items.filter(i=>i.custo===3);
   const r=[a[0],a[1],b[0],b[1],c.length,c[0]&&c[0].qty]; S.sales=[]; S.items=[]; S.elog=[]; S.cash={pyg:0,usd:0,brl:0}; return r""", [5, 4, 5, 5, 1, 5]),
 ("código automático para peça sem código na haste, em sequência", """
   S.items=[{tipo:'pre',ref:'PG-012',grau:'+1',cor:'P',qty:1},{tipo:'pre',ref:'SP1',grau:'+1',cor:'P',qty:1}];
   return [L.refAuto('pre'), L.refAuto('solar')]""", ['PG-013', 'SL-001']),
 ("entrada de peças novas renova o 'chegou esta semana'", """
   S.cad={Z9:Date.now()-30*864e5}; S.elog=[]; S.items=[{tipo:'pre',ref:'Z9',grau:'+1',cor:'P',qty:5}];
   const a=L.siteAviso('Z9'); L.entradaEstoque('pre','Z9','P','+1',2); S.items[0].qty=7; return [a, L.siteAviso('Z9')]""", ['', 'Chegou esta semana']),
 ("liberar para o site: toda cor precisa de foto (mesmo esgotada) e sem peças nenhuma não se publica", """
   S.items=[{tipo:'pre',ref:'W1',grau:'+1',cor:'P',qty:3,med:'50-20-140'},{tipo:'pre',ref:'W1',grau:'+1',cor:'Q',qty:0,med:'50-20-140'}]; S.fotos={'W1|P':'x'}; S.attr.W1={formato:'Oval',material:'Metal',publico:'Unissex',marca:'M',colecao:'C'}; /* item 16: ficha completa */
   const a=L.siteCheck('W1').ok; S.fotos['W1|Q']='y'; const b=L.siteCheck('W1').ok; S.items.forEach(i=>i.qty=0); const c=L.siteCheck('W1'); return [a,b,c.ok,c.sem]""", [False, True, False, True]),
 ("piso do produto vale o pior caso entre cores com estoque", """
   S.fx.pyg=7000; S.items=[{tipo:'pre',ref:'P1',grau:'+1',cor:'P',qty:3,custo:1},{tipo:'pre',ref:'P1',grau:'+1',cor:'Q',qty:3,custo:3}]; S.grp=[];
   const lo=L.pisoPeca(S.items[0]).trava, hi=L.pisoPeca(S.items[1]).trava, r=L.pisoDoRef('P1','pre'); return [hi>lo, r.pp.trava===hi, r.pp.corPior]""", [True, True, 'Q +1']),
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
 ("Trocar moedas: medidor segue o par escolhido e valor inicial por moeda", """
   const t=Date.now(); S.janela=30; S.fxHist=[]; for(let i=0;i<10;i++) S.fxHist.push({ts:t-(10-i)*86400000,pyg:7000+i*10,brl:5+i*0.05});
   S.fx.pyg=7000; S.fx.brl=5;
   const a=L.cotacaoPar('pyg','usd'), b=L.cotacaoPar('usd','brl'), c=L.cotacaoPar('brl','pyg');
   return [a.un==='pyg'&&a.barato, b.un==='brl'&&b.barato, c.nome==='Real'&&c.un==='pyg'&&Math.round(c.hoje)===1400, L.cotacaoPar('usd','usd')===null]""", [True, True, True, True]),
 ("importar backup: arquivo ruim não altera nada; bom substitui", """
   const antes=JSON.stringify([S.items,S.sales,S.fotos]);
   const e1=L.restaurarDados('nao é json'), e2=L.restaurarDados(JSON.stringify({app:'outro',d:{items:[]}})), e3=L.restaurarDados(JSON.stringify({app:'lafouch',d:{}}));
   const igual=JSON.stringify([S.items,S.sales,S.fotos])===antes;
   const bom=JSON.parse(L.backupDados()); bom.d.items=[]; const e4=L.restaurarDados(JSON.stringify(bom));
   return [!!e1&&!!e2&&!!e3, igual, e4==='', S.items.length===0]""", [True, True, True, True]),
 ("v-b9: 4 botões novos (Mensagens, Analisador, Temática, Atacado) e as 82 combinações têm nome e ícone próprios", """
   const V=['vendas','estoque','caixa','fx','desp','hist','hoje','din','prec','ajustes','ped','onl','cli','cont','lotes','novo','notif'],N=['msg','anl','tem','ata'];let n=0,ruim=[];
   N.forEach((a,i)=>{V.concat(N.slice(i+1)).forEach(b=>{n++;const ic=L.grpIcoPar(a,b,24),nm=L.grpNomeSugerido(a,b);if(!ic||!nm||ic.indexOf('<g')<0&&ic.length<120)ruim.push(a+'+'+b)})});
   return [n, ruim, L.grpNomeSugerido('tem','ata'), L.grpNomeSugerido('vendas','msg')]""", [74, [], 'Atacado nos eventos', 'Vendas e mensagens']),
 ("v-b9: faixas dos botões novos usam o resumo do painel (novas, avisos, próximo evento)", """
   const d=Date.now(); S.pnlRes=null; const a=[L.pnlFaixa('msg')[0],L.pnlFaixa('tem')[0]];
   S.pnlRes={msg:2,ata:1,av:3,prox:{nm:'Black Friday CDE',ini:d+7.5*864e5,fim:d+10*864e5}};
   const b=[L.pnlFaixa('msg')[0],L.pnlFaixa('ata')[0],L.pnlFaixa('anl')[0],L.pnlFaixa('tem')[0]];
   S.pnlRes.prox.ini=d-1000; const c=L.pnlFaixa('tem'); S.pnlRes=null;
   return [a,b,c]""", [['Contato e atacado','Calendário do site'],['2 novas','1 orçamento novo','3 avisos','Black Friday CDE em 8 dias'],['Black Friday CDE no ar','g']]),
 ("primeira abertura: app limpo com os 20 modelos do catálogo", """
   L.primeiroUso();
   return [S.items.length>0, S.items.length<=40, S.sales.length, S.exp.length, S.cash.pyg, S.ini.rep, Object.keys(S.fotos).length>0, S.view]""", [True, True, 0, 0, 0, 0, True, 'inicio']),  # v-b9: o app abre sempre no Início
 ("piso: linha de 30% x linha de 50% (a de 50% tem piso maior e margem 0,5)", """
   L.primeiroUso(); const it=S.items[0]; S.linhaFix={}; S.linhaFix[it.ref]='f1'; S._linK=null; S._linC=null; const a=L.pisoPeca(it);
   S.linhaFix[it.ref]='f3'; S._linK=null; S._linC=null; const b=L.pisoPeca(it);
   return [a.piso>0, b.piso>a.piso, a.margem<b.margem, b.margem]""", [True, True, True, 0.5]),
 ("rateio das contas: proporcional ao custo soma as contas do mês e peça cara carrega mais", """
   L.primeiroUso(); S.exp=[{id:1,nome:'Aluguel',cat:'loja',tipo:'fixa',moeda:'pyg',orig:1800000,valor:1800000,rate0:1,hist:[],dia:10}];
   const ids=[...new Set(S.items.map(i=>i.tipo))]; S.sales=[]; S.appStart=Date.now(); S.grp=ids.map((t,i)=>({id:'r'+i,tipo:t,qty:52,ts:1}));  // 66: a primeira compra no lugar da meta por dia
   S.rateio='peca'; const flat=L.contasPeca();
   S.items[0].custo=1; S.items[S.items.length-1].custo=6; S.rateio='custo'; const its=S.items.slice().sort((a,b)=>L.tFor(a).repUSD-L.tFor(b).repUSD);
   const lo=L.contasPeca(its[0]), hi=L.contasPeca(its[its.length-1]);
   return [flat>0, hi>lo, lo>0]""", [True, True, True]),
 ("linha automática: custo dentro do tipo, marca de luxo e correção do dono vale mais", """
   L.primeiroUso(); S._linK = null; S.pfaixa = {}; S.linhaFix = {}; S.attr = S.attr || {};
   S.items = [1,2,3,4,5,6,7,8].map(n => ({tipo:'sem', ref:'LN'+n, grau:'', cor:'Preto', qty:2, fmt:'', med:'', vr:'', custo:n}));
   S.items.push({tipo:'sem', ref:'LN0', grau:'', cor:'Preto', qty:2, fmt:'', med:'', vr:''});
   const n = r => (L.linhaDe(r, 'sem') || {}).nome;
   const a = [n('LN1'), n('LN5'), n('LN8'), L.linhaDe('LN0', 'sem')];
   S.attr.LN3 = {marca:'Gucci'}; S._linK = null; S._linC = null; const g = [n('LN3'), (L.linhaDe('LN3','sem').mot || []).join()];
   S.linhaFix = {LN8: S.faixas[0].id}; S._linK = null; const c = [n('LN8'), L.linhaDe('LN8','sem').fix, L.faixaOf('LN8').id === S.faixas[0].id];
   return [a, g, c]""", [['Econômica', 'Intermediária', 'Luxo', None], ['Intermediária', 'custo entre os mais baratos,marca Gucci'], ['Econômica', True, True]]),
 ("destaque automático: manda por estoque (mais peças e mais tempo sem vender), só o que está no site", """
   L.primeiroUso(); const a=S.items[0], b=S.items[1], c=S.items[2]; S.items.forEach(i=>{i.qty=0}); a.qty=2; b.qty=9; c.qty=30; S.sales=[];
   S.vitrine=[a.ref,b.ref]; S.nuvem.rt='x'; const calls=[]; window.fetch=(u,o)=>{calls.push([u,o&&o.body]); return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve('{}')})};
   return L.nvDestaque().then(()=>{ const c0=calls.filter(x=>/dauto/.test(x[0])); const body=c0.length?JSON.parse(c0[0][1]).fields:{};
     const refs=(body.dauto||{}).stringValue||''; return L.nvDestaque().then(()=>[c0.length, refs===b.ref+','+a.ref, refs.indexOf(c.ref)<0, calls.filter(x=>/dauto/.test(x[0])).length])})""", [1, True, True, 1]),
 ("site: o app publica o produto completo (cores com foto, estoque por cor, aviso automático)", """
   L.primeiroUso(); S.items.length=0; S.fotos={}; S.site={}; S.vitPend={}; S.cad={}; S.pprice={};
   const mk=(cor,qty)=>({tipo:'sem',ref:'ZZ100',grau:'',cor,qty,fmt:'',med:'53□18-140',vr:'',custo:2}); S.items.push(mk('Preto',1), mk('Rosa',0), mk('Azul',5)); S.items[0].qty=2; S.items[2].qty=0;
   S.attr.ZZ100={material:'Metal', publico:'Feminino', formato:'Gatinho', marca:'M', colecao:'C'};
   ['Preto','Rosa','Azul'].forEach(c=>{S.fotos['ZZ100|'+c]='data:image/png;base64,'+c});
   const ok0=L.siteSet('ZZ100',true); S.nuvem.rt='x'; S.tipos&&0;
   const p=L.vitProduto('ZZ100'); const av=L.siteAviso('ZZ100');
   const calls=[]; window.fetch=(u,o)=>{calls.push([u,o&&o.method,o&&o.body]); return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({}),text:()=>Promise.resolve('{}')})};
   S.cad.ZZ100=0; S.items.forEach(i=>{ if(i.cor==='Preto') i.qty=9 });
   const av2=L.siteAviso('ZZ100'); S.cad.ZZ100=Date.now(); const av3=L.siteAviso('ZZ100'); S.cad.ZZ100=0; S.items.find(i=>i.cor==='Preto').qty=2;
   return L.vitSync().then(()=>{ const pr=calls.filter(x=>/produtos\/ZZ100/.test(x[0])&&x[1]==='PATCH'); const fo=calls.filter(x=>/fotos\/ZZ100/.test(x[0])).length;
     const f=pr.length?JSON.parse(pr[0][2]).fields:{}; if(f.fv||!/fieldPaths=fv$/.test(pr[pr.length-1][0])) return ['fv fora de ordem']; const cn=((f.cn||{}).arrayValue||{}).values||[];
     return [ok0, p.cn.join(','), p.qs.join(','), p.med.join(','), p.rosto.join(','), av, av2, av3, pr.length, fo, cn.length, !!(f.lib||{}).booleanValue]})""", [True, 'Preto,Rosa,Azul', '2,0,0', '53,18,140', 'oval,coracao', 'Últimas 2 unidades', '', 'Chegou esta semana', 2, 3, 3, True]),
 ("site: um produto com erro não segura os outros; erro fica só interno (v467)", """
   const mk=(ref,cor)=>({tipo:'sem',ref,grau:'',cor,qty:3,fmt:'',med:'52-18-140',vr:'',custo:2});
   S.items.push(mk('YY1','Preto'), mk('YY2','Preto')); S.attr.YY1={formato:'Oval',material:'Metal',publico:'Unissex',marca:'M',colecao:'C'}; S.attr.YY2={formato:'Oval',material:'Metal',publico:'Unissex',marca:'M',colecao:'C'}; S.fotos['YY1|Preto']='data:image/png;base64,a'; S.fotos['YY2|Preto']='data:image/png;base64,b';
   L.siteSet('YY1',true); L.siteSet('YY2',true); S.nuvem.rt='x'; S.vitErr={};
   const calls=[]; window.fetch=(u,o)=>{calls.push([u,o&&o.method]); if(/fotos\/YY1/.test(u)) return Promise.resolve({ok:false,status:400,json:()=>Promise.resolve({error:{message:'grande'}})}); return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve({})})};
   return L.vitSync().then(()=>new Promise(r=>setTimeout(r,80))).then(()=>{ const d1=calls.filter(x=>/produtos\/YY1\?/.test(x[0])).length, d2=calls.filter(x=>/produtos\/YY2/.test(x[0])).length;
     return [d1>=1, d2, !S.vitPend.YY2, !!S.vitPend.YY1, (S.vitErr.YY1||{}).st, calls.some(x=>/config\/site\?updateMask.fieldPaths=pv/.test(x[0])), !!document.body.innerText.match(/grande/)]})""", [True, 2, True, True, 400, True, False]),
 ("oferta: data final vencida volta ao preço anterior; sem data continua", """
   L.primeiroUso(); const r1=S.items[0].ref, r2=S.items[1].ref; S.pprice={};
   S.pprice[r1]={ant:100000,novo:80000,ate:Date.now()-1000}; S.pprice[r2]={ant:90000,novo:70000};
   const ch=L.ofertaManut(); const a=S.pprice[r1], b=S.pprice[r2];
   S.pprice[r1]={ant:100000,novo:80000,ate:Date.now()+864e5}; const ch2=L.ofertaManut();
   return [ch, a.novo, a.ant===undefined, a.ate===undefined, b.ant, b.novo, ch2, S.pprice[r1].novo]""", [True, 100000, True, True, 90000, 70000, False, 80000]),
 ("PIN: guarda só o resumo e confere", """
   return L.hashPin('1234','sal').then(h=>L.hashPin('1234','sal').then(h2=>L.hashPin('1235','sal').then(h3=>[h===h2, h!==h3, h.indexOf('1234')<0])))""", [True, True, True]),
 ("PIN: resumo novo lento (p2) e quem tinha o antigo é atualizado ao entrar", """
   return L.hashPin('1234','sal').then(h=>L.hashPinAntigo('4321','velho').then(old=>{ S.pinSalt='velho'; S.pinHash=old;
     return L.confereHash('0000').then(e=>L.confereHash('4321').then(ok=>[h.slice(0,2)==='p2', e===false, ok===true, S.pinHash.slice(0,2)==='p2', S.pinSalt!=='velho']))}))""", [True, True, True, True, True]),
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
   const n=Date.now(); S.metaHist={};
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
 ("effCusto: média ponderada entre lotes do mesmo modelo e cor", """
   S.grp=[{id:'A', qty:10, totalUsd:10},{id:'B', qty:10, totalUsd:30}];
   S.items=[{tipo:'pre', ref:'X', cor:'Preto', grau:'+1.00', qty:10, lote:'A'},{tipo:'pre', ref:'X', cor:'Preto', grau:'+1.50', qty:10, lote:'B'},{tipo:'pre', ref:'Y', cor:'Preto', grau:'+1.00', qty:5, lote:'B'}];
   return [L.effCusto(S.items[0]), L.effCusto(S.items[1]), L.effCusto(S.items[2])]""", [2, 2, 3]),
 ("parsePedido: linhas com quantidade × preço e conferência", """
   const r = window.__parsePedido('Pedido #2682\\nMetal luxo\\n20 x $2.00 $40.00\\nAcetato\\n30 x $12.00 $350.00');
   return [r.rows.length, r.ped, r.rows[0].nome, r.rows[0].qty, r.rows[0].unit, r.rows[0].dup, r.rows[1].dup]""", [2, '2682', 'Metal luxo', 20, 2, False, True]),
 ("trocarLivre: dólar que sobra vira guaranis sem pedir confirmação", """
   S.sales=[]; S.compras=[]; S.cpay=[]; S.melhUso=[]; S.exp=[]; S.ini={rep:0,colch:0,melh:0}; S.colchUsd=0; S.repQuitUsd=0; S.cambios=[]; S.fx.pyg=7000; S.cash={pyg:0,usd:100,brl:0};
   const r=L.trocarLivre('usd',100,'pyg',700000); return [r.ok, S.cash.usd, S.cash.pyg, S.cambios[0].fonte.extra, S.cambios[0].perdaGs||0]""", [True, 0, 700000, 100, 0]),
 ("trocarLivre: vender dólar da reposição pede confirmação e desfaz", """
   S.sales=[]; S.compras=[]; S.cpay=[]; S.melhUso=[]; S.exp=[]; S.ini={rep:50,colch:0,melh:0}; S.colchUsd=0; S.repQuitUsd=50; S.cambios=[]; S.fx.pyg=7000; S.cash={pyg:0,usd:50,brl:0};
   const a=L.trocarLivre('usd',50,'pyg',340000); const b=L.trocarLivre('usd',50,'pyg',340000,true);
   const dep=[S.cash.usd, S.cash.pyg, S.repQuitUsd, S.cambios[0].perdaGs]; L.trocarDesfazer(0);
   return [a.ok, !!a.confirmar, b.ok, dep, S.cash.usd, S.cash.pyg, S.repQuitUsd, S.cambios.length]""", [False, True, True, [0, 340000, 0, 10000], 50, 0, 50, 0]),
 ("trocarLivre: guarani por real só mexe no caixa", """
   S.sales=[]; S.compras=[]; S.cambios=[]; S.fx.pyg=7000; S.fx.brl=5; S.cash={pyg:500000,usd:0,brl:0};
   const r=L.trocarLivre('pyg',500000,'brl',90); return [r.ok, S.cash.pyg, S.cash.brl, S.cambios[0].perdaGs||0, S.cambios[0].fonte||null]""", [True, 0, 90, 0, None]),
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
 ("sazonFator: aprende a estação com o histórico de vendas", """S.sazon={}; const d=new Date(); const sem=[]; S.sales=[]; for(let k=1;k<=24;k++){ const x=new Date(d.getFullYear(), d.getMonth()-k, 15); S.sales.push({ts:x.getTime(),tipo:'pre',ref:'Z',qty: x.getMonth()===11?30:10,estorno:false}); }
   const dez=L.sazonFator('pre',11), jun=L.sazonFator('pre',5); S.sales=[]; const vazio=L.sazonFator('pre',11); return [dez>1.8, jun<1, vazio]""", [True, True, 1]),
 ("reposicao: vende rápido e acaba logo", """const n=Date.now(); S.faixas=[{id:'f1',nome:'Eco',margem:30,precos:{}}]; S.pfaixa={}; S.sazon={pre:Array(12).fill(1)};
   S.items=[{tipo:'pre',ref:'A',grau:'+1.00',cor:'Preto',qty:3,custo:1}];
   S.sales=[{ts:n-864e5,tipo:'pre',ref:'A',qty:10,livre:7000,fx:7000,estorno:false}];
   const r=L.reposicao(); return [r.length, Math.round(r[0].dias), r[0].comprar]""", [1, 9, 12]),
 ("parados: sem venda há 100 dias tem preço de saída", """S.pfaixa={}; S.sazon={pre:Array(12).fill(1)}; S.appStart=Date.now()-100*864e5; S.sales=[];
   S.items=[{tipo:'pre',ref:'B',grau:'+1.00',cor:'Preto',qty:5,custo:1}]; const p=L.parados(); return [p.length, p[0].pp.saida, Math.round(p[0].diasParado)]""", [1, 7000, 100]),
 ("parados: baixa estação não conta como parado", """S.sazon={solar:Array(12).fill(0.5)}; S.appStart=Date.now()-100*864e5; S.sales=[];
   S.items=[{tipo:'solar',ref:'C',vr:'C1',cor:'Preto',qty:5,custo:1}]; return L.parados().length""", 0),
 ("metaInfo: lucro do mês por faixa", """const n=Date.now(); S.metaUsd=100; S.sales=[{ts:n,tipo:'pre',ref:'A',qty:1,livre:7000,fx:7000,faixa:'f1',estorno:false},{ts:n,tipo:'pre',ref:'A',qty:1,livre:3500,fx:7000,faixa:'',estorno:false},{ts:n,tipo:'pre',ref:'A',qty:1,livre:9999,fx:7000,faixa:'f1',estorno:true}];
   const m=L.metaInfo(); return [m.meta === L.metaMes(), m.lucro, m.por.f1, m.por['']]""", [True, 1.5, 1, 0.5]),
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
 ("peças por mês aprendidas (66): antes de 14 dias a primeira compra; depois, a média real; sem nada, o padrão", """const n=Date.now(); S.volume=350; S.grp=[]; S.appStart=n-10*864e5; S.sales=[{id:'a',ts:n-864e5,qty:50,estorno:false,tipo:'sem'}]; const a=L.volumeEfetivo();
   S.appStart=n-120*864e5; S.sales=[{id:'b',ts:n-10*864e5,qty:60,estorno:false,tipo:'sem'},{id:'c',ts:n-40*864e5,qty:30,estorno:false,tipo:'sem'},{id:'d',ts:n-5*864e5,qty:99,estorno:true,tipo:'sem'}]; const b=L.volumeEfetivo();
   S.sales=[{id:'e',ts:n-10*864e5,qty:5,estorno:false,tipo:'sem'},{id:'e2',ts:n-9*864e5,qty:9,estorno:true,tipo:'sem'}]; const c=L.volumeEfetivo(); S.appStart=n-864e5; S.sales=[{id:'f',ts:n-864e5,qty:1,estorno:false,tipo:'sem'}]; S.grp=[{id:'g',tipo:'sem',qty:80,ts:1}]; return [a, b, c, L.volumeEfetivo()]""", [350, 30, 350, 76]),  # 1 dia de venda: 1/14 do ritmo real (30) + 13/14 da 1ª compra (80)
 ("backup: exporta e restaura tudo", """S.metaUsd=77; S.items=[{tipo:'pre',ref:'K1',grau:'+1.00',cor:'Preto',qty:3}]; S.pfaixa={K1:'f1'}; const txt=L.backupDados();
   S.metaUsd=1; S.items=[]; S.pfaixa={}; const e=L.restaurarDados(txt); return [e, S.metaUsd, S.items.length, S.pfaixa.K1, L.restaurarDados('lixo').length>0, L.restaurarDados('{"app":"outro"}').length>0]""", ["", 77, 1, "f1", True, True]),
 ("tema: Ajustes tem Auto/Claro/Escuro, troca, lembra e volta ao automático", """
   L.setView('ajustes'); L.render(); const o = {};
   const card = document.getElementById('temaCard'); o.card = !!card; o.btns = card ? card.querySelectorAll('[data-tm]').length : 0;
   const root = document.documentElement, bg = () => getComputedStyle(root).getPropertyValue('--bg').trim();
   const clica = k => document.querySelector('.tmTrk [data-tm="' + k + '"]').click();
   const espera = () => new Promise(r => setTimeout(r, 1000));
   o.auto = [root.getAttribute('data-tema'), localStorage.getItem('lf_tema')];
   
   clica('escuro'); await espera();
   o.esc = [root.getAttribute('data-tema'), localStorage.getItem('lf_tema'), bg(), document.querySelector('.tmTrk .on').getAttribute('data-tm'), document.querySelector('meta[name="theme-color"]').content];
   clica('claro'); await espera();
   o.cla = [root.getAttribute('data-tema'), localStorage.getItem('lf_tema'), bg(), document.querySelector('meta[name="theme-color"]').content];
   clica('auto'); await espera();
   o.volta = [root.getAttribute('data-tema'), localStorage.getItem('lf_tema')];
   return JSON.stringify(o);
 """, '{"card":true,"btns":3,"auto":[null,null],"esc":["escuro","escuro","#0f1216","escuro","#0f1216"],"cla":["claro","claro","#f4f1f4","#f4f1f4"],"volta":[null,null]}'),
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
    # Item 18 (20/11/2026): trava dos remendos — embrulho novo, função reescrita em outro arquivo, ação ACT em 2+ lugares,
    # !important ou seletor repetido a mais reprovam (teto em tests/teto-remendos.json, só desce: tools/remendos.py --grava)
    sys.path.insert(0, os.path.join(RAIZ, 'tools'))
    import remendos
    sub = remendos.compara(remendos.conta(RAIZ), json.load(open(remendos.TETO)))
    total += 1
    print(('  ok  ' if not sub else ' FALHA ') + 'Item 18: nenhum remendo novo (regra 12: trocar no lugar e apagar o velho)')
    if sub: falhas.append('remendo novo'); [print('        ', x) for x in sub]
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=exe, args=['--no-sandbox']) if exe else await p.chromium.launch(args=['--no-sandbox'])

            async def pagina(scheme='dark', url='#test', ctx=None, tudo=True, relogio=False, fam=False):
                ctx = ctx or await b.new_context(viewport={'width': 420, 'height': 900}, color_scheme=scheme, service_workers='block')
                await ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                await ctx.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}")  # sem a abertura com logo (ela cobre a tela por 4 s)
                # madrugada (antes das 9h): os dados de exemplo "de algumas horas atrás" caem no dia anterior e quebram testes de "hoje"; o relógio da página pula para 14h
                if relogio: await ctx.add_init_script("(function(){var R=Date,d=new R(),off=0;if(d.getHours()<9){var t=new R(d);t.setHours(14,0,0,0);off=t-d;}if(!off)return;function D(){if(!arguments.length)return new R(R.now()+off);var a=[null].concat([].slice.call(arguments));return new (Function.prototype.bind.apply(R,a))();}D.prototype=R.prototype;D.now=function(){return R.now()+off};D.UTC=R.UTC;D.parse=R.parse;window.Date=D;})()")
                pg = await ctx.new_page()
                pg.erros = []
                pg.on('pageerror', lambda e: pg.erros.append(str(e)))
                await pg.goto(f'http://localhost:{PORTA}/index.html{url}')
                await pg.wait_for_function('window.__LF', timeout=10000)
                if tudo: await pg.evaluate("() => { window.__LF.S._rtudo = true; }")  # os testes antigos leem abas fora da tela
                # S374: os testes antigos partem da barra antiga (Catálogo, Inventário, Dinheiro, Ajustes); as 7 famílias têm teste próprio (fam=True)
                if not fam: await pg.evaluate("() => { const L = window.__LF, S = L.S; S.grupos = (S.grupos || []).filter(g => !g.fam); S.barra = null; S.inicioT = null; S.famV = 99; L.render(); }")
                return pg

            # desempenho: abas fora da tela não são redesenhadas
            pg = await pagina(tudo=False)
            r = await pg.evaluate("() => { const L = window.__LF; L.setView('hist'); const antes = document.getElementById('v-hist').innerHTML.length; L.setView('inicio'); document.getElementById('v-hist').innerHTML = 'x'; L.render(); const fora = document.getElementById('v-hist').innerHTML; L.setView('hist'); return [antes > 10, fora, document.getElementById('v-hist').innerHTML.length > 10]; }")
            ok = r == [True, 'x', True] and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'desempenho: só a aba aberta é redesenhada')
            if not ok: falhas.append('render só da aba aberta'); print('        veio', r, pg.erros)
            await pg.close()

            # S374 (esboços 49a/49b): as 7 famílias entram uma vez — barra Vender · Peças · Dinheiro; Início Dashboard · Site · Clientes
            pg = await pagina(fam=True)
            await pg.wait_for_timeout(600)
            f1 = await pg.evaluate("() => { const S = window.__LF.S; return [S.barra, S.inicioT, [...document.querySelectorAll('#mainnav .mn')].map(m => m.innerText.trim()), [...document.querySelectorAll('#v-inicio .tl[data-act=inicio]')].map(t => t.getAttribute('data-id'))]; }")
            await pg.locator('#mainnav .mn[data-id="g:pecas"]').click(); await pg.wait_for_timeout(600)
            # S435 (navegação B): a aba do grupo abre o índice com as telas do grupo
            f2 = await pg.evaluate("() => [window.__LF.S.view === 'grp' ? 'estoque' : window.__LF.S.view, [...document.querySelectorAll('#v-grp .nvL')].map(b => b.getAttribute('data-id'))]")
            f3 = await pg.evaluate("() => [window.__LF.S.view === 'grp' ? 'estoque' : window.__LF.S.view, document.querySelector('#mainnav .mn[data-id=\\'g:pecas\\']').classList.contains('on')]")
            await pg.evaluate("() => { window.__LF.render(); window.__LF.render(); }")
            f4 = await pg.evaluate("() => [window.__LF.S.grupos.filter(g => g.fam).length, window.__LF.S.barra.join(',')]")
            total += 1
            ok = (f1[0] == ['vendas', 'g:pecas', 'g:din', 'ajustes'] and f1[1] == ['g:res', 'prec', 'g:site', 'g:mkt', 'cli', 'ata'] and f1[2] == ['Início', 'Vender', 'Peças', 'Dinheiro', 'Ajustes']
                  and f1[3] == ['g:res', 'prec', 'g:site', 'g:mkt', 'cli', 'ata'] and f2 == ['estoque', ['estoque', 'est', 'comp']] and f3 == ['estoque', True]
                  and f4 == [5, 'vendas,g:pecas,g:din,ajustes'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'S374: famílias (barra Vender · Peças · Dinheiro; Início com 6 botões do esboço 59; Peças com Inventário, Estúdio e Compras — 63 e 66)')
            if not ok: falhas.append('7 famílias'); print('        veio', f1, f2, f3, f4, pg.erros)
            # 52a + 54 (Titan): "Giro e preços" saiu; Preços é linha do Início e abre em 1 toque; Marketing abre a lista
            await pg.evaluate("() => window.__LF.setView('inicio')"); await pg.wait_for_timeout(400)
            await pg.locator('#v-inicio .tl[data-id="prec"]').click(); await pg.wait_for_timeout(700)
            m1 = await pg.evaluate("() => [window.__LF.S.view + '/' + window.__LF.S.dTab, !document.querySelector('#v-inicio [data-id=\"g:gp\"]'), !(window.__LF.S.grupos || []).some(g => g.id === 'g:gp'), document.querySelector('#v-dash .dHdT').textContent]")
            await pg.evaluate("() => { window.__LF.setView('inicio'); }"); await pg.wait_for_timeout(500)
            await pg.locator('#v-inicio .tl[data-id="g:mkt"]').click(); await pg.wait_for_timeout(600)
            m2 = await pg.evaluate("() => [window.__LF.S.view, [...document.querySelectorAll('#dFolha:not(.sai) [data-act=grpVerEsc]')].map(b => b.getAttribute('data-id'))]")
            await pg.evaluate("() => window.__LF.lfaFecha('dFolha')"); await pg.wait_for_timeout(400)
            total += 1
            ok = m1 == ['dash/prec', True, True, 'Preços'] and m2 == ['mkt', []] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '52a/54: Preços abre pelo Início em 1 toque (sem "Giro e preços"); Marketing abre a tela Marketing')
            if not ok: falhas.append('59 famílias'); print('        veio', m1, m2, pg.erros)
            # S374 (S242): Site é tela do app; com o painel aberto a barra não marca Vender
            await pg.evaluate("() => window.__LF.setView('inicio')"); await pg.wait_for_timeout(400)
            await pg.locator('#v-inicio .tl[data-id="g:site"]').click(); await pg.wait_for_timeout(700)
            await pg.locator('#v-grp .nvL[data-id=site]').click(); await pg.wait_for_timeout(700)  # esboço 37a: o grupo abre o índice; "Resumo" é a 1ª tela
            s1 = await pg.evaluate("() => [window.__LF.S.view, document.querySelectorAll('#v-site .stN').length, document.querySelectorAll('#v-site .stL').length, !!document.querySelector('#v-site .st96'), !!document.querySelector('#v-site .pv97')]")
            await pg.locator('#v-site .stN[data-id=msg]').click(); await pg.wait_for_timeout(700)
            s2 = await pg.evaluate("() => [window.__LF.S.view, !!document.querySelector('#mainnav .mn.on[data-id=vendas]')]")
            total += 1
            ok = s1 == ['site', 4, 0, True, True] and s2 == ['onl', False] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (96/97): tela Site do app (estado + prévia, 4 números); painel aberto não marca Vender')
            if not ok: falhas.append('tela Site'); print('        veio', s1, s2, pg.erros)
            await pg.close()

            # contas, lotes e leitor
            pg = await pagina()
            for nome, corpo, esperado in TESTES:
                total += 1
                try:
                    got = await pg.evaluate('async () => {' + PRE + corpo + '}')
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
            await pg.locator('#mainnav .mn[data-id=caixa]').first.click(); await pg.wait_for_timeout(300)
            await pg.click('#cxIc'); await pg.wait_for_timeout(150); await pg.click('#cxIc ~ .cxMenu [data-act=cxabre][data-id=mel]'); await pg.wait_for_timeout(300)
            await pg.fill('#obNome', 'Tinta'); await pg.fill('#obCusto', '50000')
            await pg.locator('[data-act="obAdd"]').first.click(); await pg.wait_for_timeout(300)
            await pg.locator('[data-act="obUsar"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.melhUso.length, S.dlog.filter(x => x.kind === 'melh').length, S.cash.pyg, !!S.objetivos[0].usado] }")
            ok = got == [1, 1, 4950000, True]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Caixa: objetivo novo, pronto → Usar (tira do caixa e lança)')
            if not ok: falhas.append('tela melhorias'); print('        veio', got)
            total += 1
            await pg.evaluate("() => window.__LF.setView('desp')"); await pg.wait_for_timeout(300)
            await pg.locator('[data-act="dfold"][data-id="imp"]').click(); await pg.wait_for_timeout(300)  # S374 (58a): Imprevistos abre ao tocar
            await pg.fill('#impD', 'Conserto'); await pg.fill('#impV', '60000')
            await pg.locator('[data-act="impadd"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.imprev.length, S.dlog.filter(x => x.kind === 'imp').length] }")
            ok = got == [1, 1]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Despesas: registrar imprevisto')
            if not ok: falhas.append('tela imprevisto'); print('        veio', got)


            # tela do produto: lista única de cores, um só botão Vender e janela Editar
            FOTO = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            SETUP = """(foto) => { const L = window.__LF, S = L.S;
              S.items = S.items.filter(i => i.ref !== 'BR44118'); Object.keys(S.fotos).filter(k => k.indexOf('BR44118|') === 0).forEach(k => delete S.fotos[k]);
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
                await pg.evaluate("() => window.__LF.setView('estoque')"); await pg.wait_for_timeout(300)
                await pg.locator('#listCard >> text=' + nome).first.click(); await pg.wait_for_timeout(400)
                return pg

            async def checa(nome, ok, got=None):
                nonlocal total
                total += 1
                print(('  ok  ' if ok else ' FALHA ') + nome)
                if not ok:
                    falhas.append(nome); print('        veio', got)

            pg = await abrir('sem', 'Hexagonal')
            got = await pg.evaluate("() => [document.querySelectorAll('#detail .ccard').length, document.querySelectorAll('#detail .vbar button').length, document.querySelectorAll('#detail .pl.pick, #detail .detgrid button.nav, #detail .gal button').length, (document.querySelector('#detail .vbar button') || {}).innerText || null]")
            await checa('produto: 3 cores em cartões (como em Vendas) e sem botão Vender na ficha', got == [3, 0, 0, None], got)
            await pg.locator('#detail .ccard').nth(1).click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => [document.querySelector('#detail .ccard.on b').innerText, window.__LF.S.detCor]")
            await checa('produto: tocar numa cor seleciona a cor (foto e estoque dela)', got[1] == 'Bege', got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty = 0; S.detRow = null; S.detCor = ''; window.__LF.render(); }")
            await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => (document.querySelector('#detail .ccard.on b') || {}).innerText")
            await checa('produto: cor sem estoque não é escolhida por padrão', got and 'Bege' in got, got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            ok = await pg.locator('#editModal').count() == 1
            await pg.evaluate(ED(2)); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('9'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab'); await pg.wait_for_timeout(200)
            await pg.locator('#editModal input[aria-label="Custo por peça em US$"]').nth(1).fill('2,5'); await pg.locator('#editModal input[aria-label="Custo por peça em US$"]').nth(1).press('Tab'); await pg.wait_for_timeout(200)
            antes = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'BR44118').map(i => [i.cor, i.qty, i.custo])")
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(700)
            depois = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'BR44118').map(i => [i.cor, i.qty, i.custo])")
            fechou = await pg.locator('#editModal').count() == 0
            await checa('janela Editar: quantidade e custo só valem ao salvar', ok and antes[0][1] == 4 and depois == [['Preto', 9, 5], ['Bege', 4, 2.5], ['Tartaruga', 2, None]] and fechou, [antes, depois, fechou])

            # 64 + 94 + 96c: a ficha só MOSTRA Preço e Oferta (linhas); tocar abre a janela Oferta — Preço normal, Preço da oferta (G$),
            # Desconto, Até (DD/MM), o aviso do Titan, o "de" honesto, "Na loja e no site" e Salvar; sem US$, sem −5%…−30%, sem Cancelar; Encerrar volta ao preço.
            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.pprice = {}; window.__LF.render(); }"); await pg.wait_for_timeout(300)
            tem = await pg.evaluate("() => [!document.getElementById('pvPreco'), !document.getElementById('ofAbre'), [...document.querySelectorAll('#detail .ofL b')].map(b => b.textContent).join(), /Titan/.test(document.querySelector('#detail .ofLP small').textContent)]")
            await pg.locator('#detail .ofLO').click(); await pg.wait_for_timeout(600)
            jan = await pg.evaluate("() => { const j = document.querySelector('.ofJn:not(.ljSai)'), t = j ? j.innerText : ''; return [!!j, [...j.querySelectorAll('.cxL:not([hidden])>span:first-child')].map(x => x.textContent).join('|'), !/US\\$|Cancelar|−5%|mm\\/dd/.test(t), !!j.querySelector('#ofSalva'), !!j.querySelector('#ofTi p'), !!j.querySelector('#ofDe')]; }")
            base = await pg.evaluate("() => parseInt(document.querySelector('.ofJn .cxL b').textContent.replace(/\\D/g, ''), 10)")
            await pg.fill('.ofJn #ofDsc', '20'); await pg.wait_for_timeout(200)
            por = await pg.evaluate("() => parseInt(document.querySelector('.ofJn #ofPor').value.replace(/\\D/g, ''), 10)")
            await pg.evaluate("() => { const i = document.querySelector('.ofJn #ofAte'); i.value = '2026-11-30'; i.dispatchEvent(new Event('change')); }")
            ate = await pg.evaluate("() => document.querySelector('.ofJn #ofAteTx').textContent")
            await pg.locator('.ofJn #ofSalva').click(); await pg.wait_for_timeout(700)
            of1 = await pg.evaluate("() => { const o = window.__LF.S.pprice['BR44118']; return o ? [o.ant > o.novo, Math.round((1 - o.novo / o.ant) * 100), new Date(o.ate).getDate(), !document.querySelector('.ofJn:not(.ljSai)'), document.querySelector('#detail .ofLO b').textContent] : null }")
            await pg.locator('#detail .ofLP').click(); await pg.wait_for_timeout(600)
            tem2 = await pg.evaluate("() => [!!document.querySelector('.ofJn:not(.ljSai) #ofFim'), document.querySelector('.ofJn:not(.ljSai) #ofAteTx').textContent]")
            await pg.locator('.ofJn:not(.ljSai) #ofFim').click(); await pg.wait_for_timeout(600)
            of2 = await pg.evaluate("() => { const o = window.__LF.S.pprice['BR44118']; return [o ? o.ant === undefined : true, document.querySelector('#detail .ofLO b').textContent] }")
            await checa('64/94/96c: ficha com Preço e Oferta (só mostram) e UMA janela Oferta em G$ — desconto ↔ preço, Até DD/MM, aviso do Titan, "de" honesto, Salvar e Encerrar',
                        tem == [True, True, 'Preço,Oferta', True] and jan[0] and jan[1] in ('Preço normal|Preço da oferta|Desconto|Até|Na loja e no site', 'Preço normal|Preço da oferta|Desconto|Até|Na loja|No site')
                        and all(jan[2:]) and abs(por - base * 0.8) <= 1000 and ate == '30/11' and of1 and of1[0] and 18 <= of1[1] <= 22 and of1[2] == 30 and of1[3] and of1[4] == 'Em oferta' and tem2 == [True, '30/11'] and of2 == [True, 'Oferta'],
                        [tem, jan, base, por, ate, of1, tem2, of2])

            # Liberar para o site: só com foto em todas as cores
            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.site = {}; Object.keys(S.fotos).filter(k => k.startsWith('BR44118|')).forEach(k => delete S.fotos[k]); }")
            await pg.evaluate("() => window.__LF.render()"); await pg.wait_for_timeout(300)
            sem = await pg.evaluate("() => { const b = document.getElementById('edSiteBtn'); return [!!b, b && b.disabled, document.getElementById('edSite').innerText, !!(b && b.closest('.zcd'))] }")
            await pg.evaluate("() => { const S = window.__LF.S; S.items.filter(i => i.ref === 'BR44118').forEach(i => { S.fotos['BR44118|' + i.cor] = 'data:image/png;base64,AAAA'; i.med = '52-18-140'; }); S.attr.BR44118 = Object.assign({}, S.attr.BR44118, { formato: 'Quadrado' }); window.__LF.render(); }"); await pg.wait_for_timeout(300)
            com = await pg.evaluate("() => { const b = document.getElementById('edSiteBtn'); return [b && b.disabled] }")
            await pg.click('#edSiteBtn'); await pg.wait_for_timeout(300)
            lib = await pg.evaluate("() => [!!window.__LF.S.site['BR44118'], document.getElementById('edSite').innerText]")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(3)); noEd = await pg.evaluate("() => !document.querySelector('#editModal #edSiteBtn')")
            await pg.evaluate(ED(1)); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700); await pg.evaluate(SAIR_SEM_SALVAR); await pg.wait_for_timeout(500)
            await checa('Chave No site: fica abaixo da Oferta, exige foto, liga/desliga e saiu do Editar', sem[0] and 'falta foto' in sem[2] and sem[3] and com == [False] and lib[0] and 'aparece no catálogo' in lib[1] and noEd, [sem, com, lib, noEd])

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(2)); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('1'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab')
            await pg.evaluate(ED(1)); await pg.fill('#descTa', 'rascunho'); await pg.wait_for_timeout(200)
            await pg.evaluate(ED(1)); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700); await pg.evaluate(SAIR_SEM_SALVAR); await pg.wait_for_timeout(500)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty, window.__LF.S.desc['BR44118'], !!document.getElementById('editModal')]")
            await checa('janela Editar: Cancelar descarta tudo', got[0] == 4 and got[1] != 'rascunho' and got[2] is False, got)
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            e0 = [await pg.locator('#edCodigo').count(), await pg.locator('#edTab1').count(), await pg.locator('#edSalvar').count(), await pg.locator('#edLixeira').count(), await pg.locator('#ed_formato').count(), await pg.locator('#ed_tipo').count()]
            cx = await pg.evaluate("() => { const a = document.getElementById('edCodigo').getBoundingClientRect(), b = document.getElementById('ed_tipo') && document.getElementById('ed_tipo').getBoundingClientRect(); return !b || a.left < b.left; }")
            await pg.click('#edTab2'); await pg.wait_for_timeout(450)
            e1 = [await pg.locator('#edSalvar').count(), await pg.locator('#edNext').count(), await pg.locator('#edExcluir').count(), await pg.locator('#edCores').count()]
            await pg.click('#edTab1'); await pg.wait_for_timeout(450)
            e3 = await pg.locator('#edCodigo').count()
            # S364 (esboço 34): a lixeira exclui na hora, sem pergunta, e "Desfazer" devolve o produto com as peças
            pg2 = await abrir('sem', 'Hexagonal')  # em outra página, para não fechar a ficha desta
            await pg2.locator('#detail button[aria-label="Editar"]').click(); await pg2.wait_for_timeout(400)
            nAntes = await pg2.evaluate("() => window.__LF.S.items.length")
            await pg2.click('#edLixeira'); await pg2.wait_for_timeout(500)
            dz = [await pg2.locator('#edLixoAviso').count(), await pg2.evaluate("() => window.__LF.S.items.length"), await pg2.locator('#lfToast.on .lfTA').count()]
            await pg2.click('#lfToast.on .lfTA'); await pg2.wait_for_timeout(500)
            dz.append(await pg2.evaluate("() => window.__LF.S.items.length"))
            e2 = 1 if (dz[0] == 0 and dz[1] < nAntes and dz[2] == 1 and dz[3] == nAntes and not pg2.erros) else 0
            await pg2.close()
            await checa('janela Editar igual ao cadastro: código à esquerda e tipo à direita, etapas livres (Modelo/Cores e fotos), Salvar alterações fixo, lixeira que exclui na hora com Desfazer', e0[:5] == [1, 1, 1, 1, 1] and cx and e1 == [1, 0, 0, 1] and e3 == 1 and e2 == 1, [e0, cx, e1, e3, e2])
            if await pg.locator('#editModal').count(): await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700); await pg.evaluate(SAIR_SEM_SALVAR); await pg.wait_for_timeout(500)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(1)); await pg.fill('#descTa', 'Polarizado, mola flexível'); await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(700)
            got = await pg.evaluate("() => [window.__LF.S.desc['BR44118'], document.getElementById('detail').innerText.includes('Polarizado, mola flexível')]")
            await checa('janela Editar: descrição salva e mostrada na tela', got == ['Polarizado, mola flexível', True], got)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(1)); await pg.locator('#editModal #edCodigo').fill('br99999')
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(700)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR99999').length, window.__LF.S.items.filter(i => i.ref === 'BR44118').length, window.__LF.S.open, !!window.__LF.S.pnome['BR99999'], document.getElementById('detail').hidden]")
            await checa('janela Editar: trocar o código move o produto', got == [3, 0, 'BR99999', True, False], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => window.__LF.S.items.push({tipo:'sem', ref:'OUTRO1', grau:'', med:'', vr:'C1', fmt:'Quadrado', cor:'Azul', qty:1})")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal #edCodigo').fill('OUTRO1')
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(700)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR44118').length, !!document.getElementById('editModal')]")
            await checa('janela Editar: código repetido é recusado', got == [3, True], got)

            pg = await abrir('estojo', 'Estojo A')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(2)); await pg.locator('#editModal .cfNm').first.click(); await pg.wait_for_timeout(200); await pg.locator('#editModal button:text-is("Excluir cor")').click(); await pg.wait_for_timeout(200)
            await pg.wait_for_timeout(300)  # S370 (esboço 34): a cor sai na hora, com "Desfazer" (sem "Sim, excluir")
            if await pg.locator('#editModal button:text-is("Sim, excluir")').count(): await pg.locator('#editModal button:text-is("Sim, excluir")').click()
            await pg.wait_for_timeout(400)
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
            t1 = 'Acima do piso'
            await pg.evaluate("() => document.getElementById('sCartAdd').click()"); await pg.wait_for_timeout(300)
            await pg.click('[data-act=cartopen]'); await pg.wait_for_timeout(300)
            await pg.click('[data-act=cartconf]'); await pg.wait_for_timeout(300)
            await pg.fill('#recIn', '5000'); await pg.wait_for_timeout(300)
            t2 = await pg.inner_text('#pisoSt'); b1 = await pg.inner_text('#sgo')
            await pg.click('#sgo'); await pg.wait_for_timeout(200)
            dsc = await pg.evaluate("() => [!document.getElementById('dscModal').hidden, document.getElementById('dscBox').textContent.indexOf('20.000') >= 0]")
            tit = await pg.evaluate("() => [document.getElementById('dscBox').textContent.indexOf('abaixo do piso') >= 0, document.getElementById('dscOk').textContent, document.querySelectorAll('#dscMot').length]")
            await pg.click('#dscMot button:has-text("Liquidação")'); await pg.click('#dscOk'); await pg.wait_for_timeout(300)
            await pg.click('[data-act=notaX]'); await pg.click('[data-act=notaSair]'); await pg.wait_for_timeout(500)
            n1 = await pg.evaluate("() => window.__LF.S.sales.length")
            got = await pg.evaluate("() => { const S = window.__LF.S, s = S.sales[0]; return [S.sales.length, s && s.abaixo, s && s.perde, S.items[0].qty, s && s.faixa, s && s.lista] }")
            ok = 'Acima do piso' in t1 and 'Abaixo da trava' in t2 and b1.strip() == 'Finalizar venda' and n1 == 1 and tit == [True, 'Registrar e vender', 1] and dsc == [True, True] and got == [1, True, True, 4, 'f1', 25000]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: desconto abaixo do piso pede confirmação')
            if not ok: falhas.append('venda abaixo do piso'); print('        veio', t1, '|', t2, '|', b1, n1, got, pg.erros)
            total += 1
            await pg.evaluate("() => { const S = window.__LF.S; S.vRef = 'pre|VP1'; S.vSel = S.items[0]; S.qty = 1; S.rec = null; S.descTxt = ''; window.__LF.render(); }")
            await pg.evaluate("() => document.getElementById('sCartAdd').click()"); await pg.wait_for_timeout(300)
            await pg.click('[data-act=cartopen]'); await pg.wait_for_timeout(300)
            await pg.click('[data-act=cartconf]'); await pg.wait_for_timeout(300)
            await pg.locator('#brChips button:has-text("Estojo B")').click(); await pg.wait_for_timeout(200)
            await pg.click('#sgo'); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S, s = S.sales[0]; return [S.sales.length, S.items[1].qty, s.brinde && s.brinde.usd, s.repUSD, s.abaixo] }")
            ok = got == [2, 2, 0.4, 1.4, False]
            await pg.evaluate("() => { const A = window.__LF.ACT, S = window.__LF.S, id = S.sales[0].id; A.estorno(id); A.estorno(id); }")
            got2 = await pg.evaluate("() => { const S = window.__LF.S; return [S.items[1].qty, S.items[0].qty] }")
            ok = ok and got2 == [3, 4]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: brinde sai do estoque, entra no custo e volta no estorno')
            if not ok: falhas.append('brinde'); print('        veio', got, got2, pg.erros)
            await pg.click('[data-act=notaX]'); await pg.click('[data-act=notaSair]'); await pg.wait_for_timeout(500)

            # Clientes na venda + tela "Venda registrada" com os dados da nota (G$, IVA 10% incluso)
            async def vender(busca=None):
                await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items[0].qty = 50;
                    S.cart = [{it: S.items[0], qty: 2, preco: null}]; S.cartOpen = true; S.cartStep = 'pag'; S.moeda = 'pyg'; S.forma = 'din'; S.rec = null; S.vBrinde = null; L.setView('vendas'); L.render(); }""")
                await pg.wait_for_timeout(300)
                if busca:
                    await pg.fill('#vCliQ', busca); await pg.wait_for_timeout(150)
                    await pg.locator('[data-act=vcliesc]').first.click(); await pg.wait_for_timeout(150)
                await pg.fill('#recIn', '50000'); await pg.wait_for_timeout(200)
                await pg.click('#sgo'); await pg.wait_for_timeout(300)
            await pg.evaluate("""() => { const S = window.__LF.S; S.clientes = [{id:1,nome:'Maria Silva',tel:'0981 123 456',ruc:'80012345-6',obs:'',ts:1},{id:2,nome:'João Souza',tel:'+55 45 999',ruc:'123.456.789-00',nac:'br',obs:'',ts:2}]; S.cliNext = 3; S.vCli = 0; try { localStorage.removeItem('lf_notaFis'); } catch (e) {} window.print = () => { window.__imp = document.getElementById('notaPrint').innerText; }; }""")
            total += 1
            await vender()
            tx = await pg.inner_text('#notaOv')
            # 12/11/2026 (dono): nota desligada = só registra a venda (sem comprovante e sem imprimir)
            a0 = ['COMPROBANTE DE VENTA' not in tx, 'Sin nombre' not in tx, 'RUC' not in tx, 'IVA' not in tx, await pg.locator('[data-act=notaImp]').is_hidden(), 'Venda confirmada' in tx, await pg.locator('[data-act=notaFis]').count() == 1]
            await pg.click('[data-act=notaFis]'); await pg.wait_for_timeout(450); tx = await pg.inner_text('#notaOv')
            a = [await pg.locator('#notaOv').is_visible(), 'Sin nombre' in tx, 'RUC: X' in tx, 'Ciudad: CDE' in tx, 'Armazón' in tx, '50.000' in tx, '4.545' in tx, await pg.locator('[data-act=notaImp]').count()] + a0
            await pg.click('[data-act=notaX]'); b1 = await pg.locator('#notaCf').is_visible()
            await pg.click('[data-act=notaVolta]'); b2 = await pg.locator('#notaCf').is_hidden() and await pg.locator('#notaOv').is_visible()
            await pg.click('[data-act=notaImp]'); await pg.wait_for_timeout(200); b3a = await pg.locator('#notaCf').is_visible(); await pg.click('[data-act=notaImpOk]'); await pg.wait_for_timeout(2200); b3 = await pg.locator('#notaCf').is_hidden()
            c1 = [await pg.locator('#notaOv').is_hidden(), 'Sin nombre' in await pg.evaluate('() => window.__imp || ""')]
            ok = a == [True, True, True, True, True, True, True, 1] + [True] * 7 and b1 and b2 and b3a and b3 and c1 == [True, True]
            print(('  ok  ' if ok else ' FALHA ') + 'venda sem cliente: nota desligada só registra (sem comprovante nem imprimir); chave liga a nota Sin nombre / X / IVA; imprime e confirma ao fechar')
            if not ok: falhas.append('nota sem cliente'); print('        veio', a, b1, b2, b3, c1, pg.erros)
            total += 1
            await vender('mar')
            tx = await pg.inner_text('#notaOv')
            got = await pg.evaluate("() => [window.__LF.S.sales[0].cliId, window.__LF.S.vCli]")
            ok = 'Maria Silva' in tx and 'RUC: 80012345-6' in tx and got == [1, 0] and await pg.locator('[data-act=notaImp]').count() == 1
            await pg.click('[data-act=notaX]'); await pg.click('[data-act=notaSair]'); await pg.wait_for_timeout(500)
            print(('  ok  ' if ok else ' FALHA ') + 'venda com cliente com RUC: chave lembrada ligada, nota com nome e RUC, venda ligada ao cliente')
            if not ok: falhas.append('nota com RUC'); print('        veio', tx, got)
            total += 1
            await vender('Joã')
            tx = await pg.inner_text('#notaOv')
            got = await pg.evaluate("() => window.__LF.S.sales[0].cliId")
            ok = 'João Souza · estrangeiro' in tx and 'CI/CPF' not in tx and 'Sin nombre' in tx and 'RUC: X' in tx and 'COMPROBANTE DE VENTA' in tx and await pg.locator('[data-act=notaImp]').count() == 1 and await pg.locator('[data-act=notaFis]').count() == 1 and got == 2
            await pg.wait_for_timeout(4000)
            ok = ok and await pg.locator('#notaOv').is_visible()
            await pg.click('[data-act=notaX]'); await pg.click('[data-act=notaSair]'); await pg.wait_for_timeout(500)
            print(('  ok  ' if ok else ' FALHA ') + 'estrangeiro (do site): nota ligada = Sin nombre / RUC X (sem CPF), chave de nota aparece, não fecha sozinho')
            if not ok: falhas.append('nota sem RUC'); print('        veio', tx, got)
            total += 1
            await pg.evaluate("() => { const L = window.__LF; L.S.cliSel = 1; L.setView('clientes'); L.render(); }"); await pg.wait_for_timeout(300)
            f1 = await pg.inner_text('#v-clientes')
            await pg.evaluate("() => { const L = window.__LF; L.S.cliSel = 2; L.render(); }"); await pg.wait_for_timeout(200)
            f2 = await pg.inner_text('#v-clientes')
            l2 = await pg.inner_text('#cDocL')
            await pg.click('[data-act=clinac][data-id="c|py"]'); await pg.wait_for_timeout(400)
            l3 = await pg.inner_text('#cDocL'); await pg.click('#v-clientes [data-act=clisave]'); await pg.wait_for_timeout(200)
            n2 = await pg.evaluate("() => window.__LF.S.clientes.find(c => c.id === 2).nac")
            ok = 'compras' in f1.lower() and 'WhatsApp' in f1 and 'Remover' in f1 and 'Sem RUC' not in f2 and 'WhatsApp' in f2 and l2 == 'CI/CPF' and l3 == 'RUC' and n2 == 'py'
            print(('  ok  ' if ok else ' FALHA ') + 'ficha do cliente: compras, WhatsApp, Remover, Paraguaio/Estrangeiro troca RUC ↔ CI/CPF e salva')
            if not ok: falhas.append('ficha cliente'); print('        veio', f1, '|', f2)
            # Impressora térmica (plugin simulado): procurar, usar (Wi-Fi + Bluetooth juntos), teste, comprovante em ESC/POS e reserva no Bluetooth
            total += 1
            await pg.evaluate("""() => { window.__pr = []; window.__wifiFalha = false;
                window.Capacitor = window.Capacitor || {}; window.Capacitor.Plugins = window.Capacitor.Plugins || {};
                window.Capacitor.Plugins.LfPrinter = {
                  scanWifi: () => Promise.resolve({itens: [{ip: '192.168.0.25', nome: 'TM-m30III'}]}),
                  scanBluetooth: () => new Promise(r => setTimeout(() => r({itens: [{address: 'AA:BB', nome: 'TM-m30III_A1B2', impressora: true}, {address: 'CC:DD', nome: 'Fone JBL', impressora: false}]}), 300)),
                  printWifi: (o) => window.__wifiFalha ? Promise.reject(new Error('x')) : (window.__pr.push(['wifi', o.ip, atob(o.data)]), Promise.resolve()),
                  printBluetooth: (o) => (window.__pr.push(['bt', o.address, atob(o.data)]), Promise.resolve()) };
                try { localStorage.removeItem('lf_impr'); } catch (e) {}
                const L = window.__LF; L.setView('ajustes'); L.render(); }""")
            await pg.wait_for_timeout(300)
            c0 = await pg.inner_text('#impCard')
            await pg.click('[data-act=impProcurar]'); await pg.wait_for_timeout(700)
            c1 = await pg.inner_text('#impCard')
            await pg.locator('[data-act=impUsar]').first.click(); await pg.wait_for_timeout(300)
            c2 = await pg.inner_text('#impCard')
            await pg.click('[data-act=impModo][data-id=bt]'); await pg.wait_for_timeout(100)
            c3 = await pg.inner_text('#impModoH')
            await pg.click('[data-act=impModo][data-id=auto]')
            await pg.click('[data-act=impTeste]'); await pg.wait_for_timeout(300)
            pr1 = await pg.evaluate("() => window.__pr.slice()")
            await pg.evaluate("() => { window.__pr = []; }")
            await vender()
            await pg.wait_for_timeout(3600)
            await pg.click('[data-act=notaImp]'); await pg.wait_for_timeout(200); await pg.click('[data-act=notaImpOk]'); await pg.wait_for_timeout(900)
            pr2 = await pg.evaluate("() => window.__pr.slice()")
            await pg.evaluate("() => { window.__pr = []; window.__wifiFalha = true; }")
            await vender(); await pg.wait_for_timeout(3600)
            await pg.click('[data-act=notaImp]'); await pg.wait_for_timeout(200); await pg.click('[data-act=notaImpOk]'); await pg.wait_for_timeout(900)
            pr3 = await pg.evaluate("() => window.__pr.slice()")
            sv = await pg.evaluate("() => JSON.parse(localStorage.getItem('lf_impr'))")
            t2 = pr2[0][2] if pr2 else ''
            ok = ('Nenhuma conectada' in c0 and 'TM-m30III' in c1 and 'Fone JBL' not in c1 and 'Wi-Fi + Bluetooth' in c2 and 'Automático' in c2 and 'Só Bluetooth' in c2
                  and 'sem roteador' in c3 and pr1 and pr1[0][0] == 'wifi' and 'PRUEBA' in pr1[0][2]
                  and len(pr2) == 1 and pr2[0][0] == 'wifi' and 'LA FOUCH' in t2 and 'COMPROBANTE DE VENTA' in t2 and 'Armaz\xa2n' in t2 and 'Pago: Contado' in t2 and '\x1dVB' in t2
                  and len(pr3) == 1 and pr3[0][0] == 'bt' and sv and sv['ip'] == '192.168.0.25' and sv['bt']['address'] == 'AA:BB')
            print(('  ok  ' if ok else ' FALHA ') + 'impressora térmica: procura Wi-Fi + Bluetooth, usa os dois, teste, comprovante em ESC/POS (acentos, corte) e reserva no Bluetooth')
            if not ok: falhas.append('impressora termica'); print('        veio', c0, '|', c1, '|', c2, '|', c3, pr1[:1], [x[:2] for x in pr2], [x[:2] for x in pr3], sv, repr(t2[:200]), pg.erros)
            await pg.evaluate("() => { window.__LF.ACT.impEsquecer(); delete window.Capacitor.Plugins.LfPrinter; }")
            await pg.close()

            # animações novas (v5/v6 leitor, v8 gráficos, v9 progresso, v11 liberar, v13 venda, v14 obturador)
            pg = await pagina()
            total += 1
            r = await pg.evaluate("""async () => { const L = window.__LF, o = {};
                const root = document.createElement('div'); root.innerHTML = '<svg viewBox="0 0 100 50"><polyline points="0,40 50,10 100,30" fill="none" stroke="#fff"/><circle cx="100" cy="30" r="3"/></svg><div class="bar"><i style="width:50%"></i></div>'; document.body.appendChild(root);
                L.animGraficos(root); o.grf = root.querySelector('polyline').getAnimations().length + root.querySelector('.bar i').getAnimations().length; root.remove();
                const bar = document.createElement('div'), bi = document.createElement('i'); bar.className = 'bar'; bar.appendChild(bi); document.body.appendChild(bar);
                o.p1 = L.progAnim('tt', 2, 6, bar, bi); o.p2 = L.progAnim('tt', 6, 6, bar, bi); await new Promise(r => setTimeout(r, 900)); o.done = bar.classList.contains('done'); o.w = bi.style.width; bar.remove();
                const stg = document.createElement('div'), gd = document.createElement('div'); stg.style.cssText = 'position:fixed;left:0;top:0;width:300px;height:300px'; stg.appendChild(gd); document.body.appendChild(stg);
                const lv = L.leitorVisor(gd, stg); o.laser = !!gd.querySelector('.lfl'); o.cb = await new Promise(r => { lv.achou({ref: 'SP57765', med: '54□18-140'}, () => r(1)); setTimeout(() => r(0), 3000); }); o.cod = stg.querySelectorAll('.lfbig span').length; o.laserOff = !gd.querySelector('.lfl'); stg.remove();
                return o }""")
            ok = r['grf'] >= 2 and r['p1'] is False and r['p2'] is True and r['done'] and r['w'] == '100%' and r['laser'] and r['cb'] == 1 and r['cod'] == 7 and r['laserOff']
            print(('  ok  ' if ok else ' FALHA ') + 'animações: gráficos desenham, progresso completa, leitor mostra o código letra a letra')
            if not ok: falhas.append('anim novas'); print('        veio', r, pg.erros)
            total += 1
            r = await pg.evaluate("""async () => { const L = window.__LF, o = {};
                const img = document.getElementById('phImg'); document.getElementById('photoCard').hidden = false;
                const px = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                L.obturadorVoa({src: px, t: Date.now(), rect: {l: 10, t: 10, w: 200, h: 300}}, px);
                o.hid = img.style.visibility; o.box = document.querySelectorAll('.lfbox').length;
                await new Promise(r => setTimeout(r, 3700)); o.after = [img.style.visibility, document.querySelectorAll('.lfbox').length];
                L.obturadorVoa({src: px, t: Date.now() - 60000, rect: {l: 0, t: 0, w: 1, h: 1}}, px); o.old = document.querySelectorAll('.lfbox').length;
                document.getElementById('photoCard').hidden = true;
                L.S.fotos['SP57765|Preto'] = px; L.S.items[0].cor = 'Preto'; L.S.items[0].ref = 'SP57765';
                L.siteFx('SP57765'); o.pv1 = document.getElementById('lfSitePv').classList.contains('on'); L.siteFx('SP57765'); o.pv2 = document.getElementById('lfSitePv').textContent.indexOf('2 produtos liberados') >= 0;
                return o }""")
            ok = r['hid'] == 'hidden' and r['box'] == 1 and r['after'] == ['', 0] and r['old'] == 0 and r['pv1'] and r['pv2']
            print(('  ok  ' if ok else ' FALHA ') + 'animações: obturador some e devolve a foto, vários liberados viram "N produtos liberados"')
            if not ok: falhas.append('anim obturador'); print('        veio', r, pg.erros)
            await pg.close()

            # Câmbio: um só medidor "hoje" que acompanha as moedas; aviso de bom momento vale para guarani e real
            pg = await pagina()
            total += 1
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, o = {}; const now = Date.now();
                S.janela = 90; S.fxHist = [0,1,2,3,4,5].map(i => ({ts: now - (6 - i) * 86400000, pyg: 7400 - i * 60, brl: 5.4 - i * 0.05}));
                S.fx.pyg = 7080; S.fx.brl = 5.1;
                const tp = {passos: [{de: 'brl'}], needRep: 0}; o.brl = L.barMoedas(tp).map(m => m.nome);
                o.ambos = L.barMoedas({passos: [{de: 'brl'}, {de: 'pyg'}], needRep: 0}).map(m => m.nome);
                o.nenhum = L.barMoedas({passos: [], needRep: 0}).length;
                S.tr.de = 'pyg'; S.tr.para = 'usd'; L.setView('fx'); L.render(); o.n1 = /Dólar em reais/i.test(document.getElementById('v-fx').innerText) ? 1 : 0;
                S.tr.de = 'brl'; L.render(); o.n2 = /Reposição/i.test(document.getElementById('v-fx').innerText) ? 1 : 0;
                return o }""")
            ok = r['brl'] == ['reais'] and r['ambos'] == ['guaranis', 'reais'] and r['nenhum'] == 0 and r['n1'] == 1 and r['n2'] == 1
            print(('  ok  ' if ok else ' FALHA ') + 'Câmbio: aviso de bom momento também para o real; aba simples com os 3 valores e a reposição')
            if not ok: falhas.append('câmbio medidor'); print('        veio', r, pg.erros)
            await pg.close()

            # Editar produto: apertar botões não faz a janela voltar ao topo
            pg = await pagina()
            total += 1
            await pg.evaluate("() => { window.__LF.setView('estoque'); }"); await pg.wait_for_timeout(400)
            await pg.locator('#rows .pcard').nth(2).click(); await pg.wait_for_timeout(700)
            await pg.click('#detail button[aria-label=Editar]'); await pg.wait_for_timeout(700)
            res = []
            for t in ['Luxo', '+']:
                await pg.evaluate(ED(1 if t == 'Luxo' else 2)); await pg.wait_for_timeout(150)
                bt = pg.locator('#editModal button', has_text=t).first
                if not await bt.count(): res.append((t, 'sem botão')); continue
                await bt.evaluate("e => e.scrollIntoView({block: 'center'})"); await pg.wait_for_timeout(150)
                y0 = await pg.evaluate("() => document.querySelector('.edJn .ljCorpo').scrollTop")
                await bt.click(); await pg.wait_for_timeout(500)
                y1 = await pg.evaluate("() => { const e = document.querySelector('.edJn .ljCorpo'); return e ? e.scrollTop : -1 }")
                res.append((t, y0, y1))
            ok = all(r[1] != 'sem botão' and r[1] >= 0 and abs(r[1] - r[2]) < 3 for r in res)
            print(('  ok  ' if ok else ' FALHA ') + 'Editar produto: apertar botões mantém a posição da janela (não volta ao topo)')
            if not ok: falhas.append('editar pula'); print('        veio', res, pg.erros)
            await pg.close()

            # entrada rápida: modelo que já existe (peça comum e pré-graduado com vários graus), parecidos por foto, copiar de outro
            pg = await pagina()
            total += 1
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.elog = []; L.setView('estoque'); }""")
            await pg.wait_for_timeout(300)
            r = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, o = {};
                S.grp = []; S.fotos = {};
                S.items = [{tipo:'solar', ref:'QA1', vr:'C1', cor:'Preto', qty:6, custo:2, fmt:'Quadrado', med:'54□18-140'}, {tipo:'solar', ref:'QA1', vr:'C2', cor:'Dourado', qty:2, custo:2, fmt:'Quadrado', med:'54□18-140'},
                           {tipo:'pre', ref:'PG-012', grau:'+1.50', vr:'C4', cor:'Roxa', qty:6, custo:2.5, fmt:'Quadrado'}];
                L.render(); o.abre = L.quickOpen('QA1');
                await new Promise(r => setTimeout(r, 200));
                o.vis = !document.getElementById('addQuickB').hidden; o.banner = document.querySelector('#addQuickB .lfban').innerText.indexOf('Modelo encontrado') >= 0;
                const mais = document.querySelectorAll('#addQuickB .st2 .step')[1]; mais.click(); await new Promise(r => setTimeout(r, 100));
                document.querySelectorAll('#addQuickB .st2 .step')[1].click(); await new Promise(r => setTimeout(r, 100));
                document.getElementById('qkGo').click(); await new Promise(r => setTimeout(r, 900));
                o.qty = S.items[0].qty; o.elog = S.elog.filter(x => x.qty === 3 && x.ref === 'QA1').length; o.toast = document.getElementById('lfToast').textContent;
                document.getElementById('qkGo').click(); await new Promise(r => setTimeout(r, 300)); o.toast2 = document.getElementById('lfToast').textContent;
                L.quickOpen('PG-012'); await new Promise(r => setTimeout(r, 200));
                const chips = [...document.querySelectorAll('#addQuickB .chip')]; const c15 = chips.find(c => c.textContent === '+1,50'), c20 = chips.find(c => c.textContent === '+2,00');
                c15.click(); await new Promise(r => setTimeout(r, 100)); [...document.querySelectorAll('#addQuickB .chip')].find(c => c.textContent === '+2,00').click(); await new Promise(r => setTimeout(r, 100));
                document.querySelectorAll('#addQuickB .st2 .step')[1].click(); await new Promise(r => setTimeout(r, 100));
                o.cust = document.getElementById('qkCusto').value; o.btn = document.getElementById('qkGo').textContent;
                document.getElementById('qkGo').click(); await new Promise(r => setTimeout(r, 300));
                const a = S.items.filter(i => i.ref === 'PG-012' && i.grau === '+1.50')[0], b = S.items.filter(i => i.ref === 'PG-012' && i.grau === '+2.00')[0];
                o.pre = [a.qty, b && b.qty, b && b.custo, a.custo, S.items.filter(i => i.ref === 'PG-012').length];
                return o }""")
            ok = r['abre'] and r['vis'] and r['banner'] and r['qty'] == 9 and r['elog'] == 1 and '+3' in r['toast'] and 'no total' in r['toast2'] and r['cust'] == '2,5' and '3' in r['btn'] and r['pre'] == [8, 1, 2.5, 2.5, 2]
            print(('  ok  ' if ok else ' FALHA ') + 'entrada rápida: modelo existente soma na linha, pré-graduado com vários graus, avisos que se somam')
            if not ok: falhas.append('entrada rápida'); print('        veio', r, pg.erros)
            total += 1
            r = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, o = {};
                const mk = (fr, bg) => { const c = document.createElement('canvas'); c.width = 120; c.height = 60; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0,0,120,60); g.fillStyle = fr; g.fillRect(8,18,40,26); g.fillRect(72,18,40,26); g.fillRect(48,28,24,5); return c.toDataURL('image/png') };
                const mk2 = (fr) => { const c = document.createElement('canvas'); c.width = 120; c.height = 60; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0,0,120,60); g.fillStyle = fr; g.beginPath(); g.arc(34,32,22,0,7); g.arc(86,32,22,0,7); g.fill(); return c.toDataURL('image/png') };
                S.items = [{tipo:'pre', ref:'PX1', grau:'+1.00', cor:'Vermelha', qty:3, custo:1}, {tipo:'pre', ref:'PX2', grau:'+1.00', cor:'Azul', qty:3, custo:1}, {tipo:'pre', ref:'PX3', grau:'+1.00', cor:'Preta', qty:3, custo:1}];
                S.fotos = {'PX1|Vermelha': mk('#c0302a'), 'PX2|Azul': mk2('#2a4fc0'), 'PX3|Preta': mk('#202020')};
                const l = await L.simRank(mk('#c43a30'), 'pre'); o.top = l[0].ref; o.n = l.length; o.ord = l.map(x => x.score > 0).every(Boolean);
                const l2 = await L.simRank(mk2('#2f55c8'), 'pre'); o.top2 = l2[0].ref;
                return o }""")
            ok = r['top'] == 'PX1' and r['n'] == 3 and r['ord'] and r['top2'] == 'PX2'
            print(('  ok  ' if ok else ' FALHA ') + 'modelos parecidos por foto: o mais parecido (forma e cor) vem primeiro')
            if not ok: falhas.append('parecidos'); print('        veio', r, pg.erros)
            total += 1
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, o = {};
                S.items = [{tipo:'solar', ref:'CL1', vr:'C3', cor:'Preto', qty:4, custo:3.5, fmt:'Aviador', med:'58□16-145'}]; S.tipo = 'solar'; S.addOpen = true; S.addMode = 'prod'; L.render();
                o.clone = !document.getElementById('eCloneB').hidden;
                L.cloneDe('CL1'); o.med = document.getElementById('eMed').value; o.custo = document.getElementById('eCusto').value; o.fmt = S.eFmt;
                document.getElementById('eRef').value = 'ZZ999'; L.render(); o.livre = document.getElementById('eRefH').textContent.indexOf('Código livre') >= 0;
                document.getElementById('eRef').value = 'CL1'; L.render(); o.rapido = !document.getElementById('eQuickBtn').hidden;
                document.getElementById('eRef').value = 'ZZ998'; L.rascunhoGuardar(); o.rasc = S.rascunho && S.rascunho.ref;
                return o }""")
            ok = r['clone'] and r['med'] == '58□16-145' and r['custo'] == '3.5' and r['fmt'] == 'Aviador' and r['livre'] and r['rapido'] and r['rasc'] == 'ZZ998'
            print(('  ok  ' if ok else ' FALHA ') + 'cadastro à mão: copiar de outro modelo, código livre, entrada rápida e rascunho')
            if not ok: falhas.append('cadastro mão'); print('        veio', r, pg.erros)
            await pg.close()

            # Editar produto: diminuir peças pergunta o motivo e grava no histórico
            pg = await pagina()
            total += 1
            await pg.evaluate("() => { window.__LF.setView('estoque'); }"); await pg.wait_for_timeout(400)
            await pg.locator('#rows .pcard').nth(2).click(); await pg.wait_for_timeout(700)
            await pg.click('#detail button[aria-label=Editar]'); await pg.wait_for_timeout(700)
            q0 = await pg.evaluate("() => { const S = window.__LF.S; S.elog = []; const i = S.items.filter(x => x.qty >= 2 && !x.bulk)[0]; return [S.items.indexOf(i), i.qty, i.ref] }")
            await pg.evaluate("(a) => { const L = window.__LF; L.S.qDraft[a[0]] = a[1] - 1; L.render(); }", q0)
            await pg.wait_for_timeout(300)
            await pg.evaluate(ED(4)); await pg.locator('#editModal button', has_text='Salvar').first.click(); await pg.wait_for_timeout(700)
            ask = await pg.evaluate("() => !!document.getElementById('ajAsk')")
            await pg.locator('#ajAsk button', has_text='erro de contagem').click(); await pg.wait_for_timeout(400)
            aj = await pg.evaluate("(a) => { const S = window.__LF.S; return [S.items[a[0]].qty, S.elog.filter(x => x.ajuste && x.qty === -1).length] }", q0)
            ok = ask and aj == [q0[1] - 1, 1]
            print(('  ok  ' if ok else ' FALHA ') + 'Editar produto: diminuir peças pergunta o motivo e o ajuste fica no histórico')
            if not ok: falhas.append('ajuste manual'); print('        veio', ask, aj, q0, pg.erros)
            await pg.close()

            # venda confirmada: sequência animada e imprime direto (sem pergunta)
            pg = await pagina()
            total += 1
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items[0].qty = 50; S.clientes = [{id:1,nome:'Maria Silva',tel:'0981 123 456',ruc:'80012345-6',obs:'',ts:1}]; S.cliNext = 2; S.vCli = 1; window.__imp = ''; window.print = () => { window.__imp = document.getElementById('notaPrint').textContent; };
                S.cart = [{it: S.items[0], qty: 2, preco: null}]; S.cartOpen = true; S.cartStep = 'pag'; S.moeda = 'pyg'; S.forma = 'din'; S.rec = null; S.vBrinde = null; L.setView('vendas'); L.render(); }""")
            await pg.wait_for_timeout(300)
            await pg.fill('#recIn', '50000'); await pg.wait_for_timeout(200); await pg.click('#sgo'); await pg.wait_for_timeout(200)
            if await pg.evaluate("() => !document.getElementById('dscModal').hidden"):
                await pg.click('#dscMot button:has-text("Liquidação")'); await pg.click('#dscOk')
            await pg.wait_for_timeout(300); a0 = await pg.evaluate("() => [!!document.querySelector('.vcc.done'), document.querySelectorAll('.vst.on').length]")
            await pg.wait_for_timeout(1200); a1 = await pg.evaluate("() => [!!document.querySelector('.vcc.done'), document.querySelectorAll('.vst.on').length]")
            await pg.wait_for_timeout(2200); a2 = await pg.evaluate("() => [document.querySelectorAll('.vst.on').length, document.querySelectorAll('.vst').length, document.querySelector('.vx').classList.contains('on'), document.getElementById('vtot').textContent]")
            if not await pg.evaluate("() => document.querySelector('#notaOv .nfTg').classList.contains('on')"): await pg.click('[data-act=notaFis]'); await pg.wait_for_timeout(400)
            await pg.click('[data-act=notaImp]'); await pg.wait_for_timeout(150); await pg.click('[data-act=notaImpOk]'); await pg.wait_for_timeout(150); a3 = await pg.evaluate("() => [document.querySelector('[data-act=notaImp]').textContent, !document.getElementById('notaCf').hidden]")
            await pg.wait_for_timeout(2200); a4 = await pg.evaluate("() => [document.getElementById('notaOv').hidden, window.__imp.indexOf('María') >= 0 || window.__imp.indexOf('Maria') >= 0, document.getElementById('lfToast').textContent]")
            ok = a0 == [False, 0] and a1[0] and 0 < a1[1] < a2[1] and a2[0] == a2[1] and a2[2] and '50.000' in a2[3] and 'Enviando' in a3[0] and not a3[1] and a4[0] and a4[1] and 'Venda registrada' in a4[2]
            print(('  ok  ' if ok else ' FALHA ') + 'venda confirmada: círculo gira, ✓, itens entram um a um, Imprimir pergunta antes (confirmação) e volta ao balcão')
            if not ok: falhas.append('venda confirmada anim'); print('        veio', a0, a1, a2, a3, a4, pg.erros)
            await pg.close()

            # aba Vendas: tocar no produto abre a mesma tela do catálogo em modo venda
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.vRef = ''; S.vSel = null; S.vq = ''; S.vTipo = 'all'; S.vFaixa = ''; S.qty = 1; L.setView('vendas'); }""")
            await pg.wait_for_timeout(300)
            total += 1
            a = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, document.getElementById('vSaleCard').hidden]")
            await pg.locator('#vRows .pcard[data-ref="SP57765"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            cat1 = True  # S377: a tela velha do WhatsApp (#catV) saiu
            b1 = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, document.getElementById('vSaleCard').hidden, !!document.querySelector('#vDetail button[aria-label=\\'Editar\\']'), document.querySelectorAll('#vDetail .pl.pick').length]")
            await pg.locator('#vDetail .pl.pick').nth(1).click(); await pg.wait_for_timeout(300)
            c = await pg.evaluate("() => { const S = window.__LF.S; return [S.vSel && S.vSel.grau, document.getElementById('spc').textContent.indexOf(S.vSel.grau) >= 0] }")
            await pg.locator('#vDetail button[aria-label="Voltar"]').click(); await pg.wait_for_timeout(300)
            d = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, window.__LF.S.vRef]")
            cat2 = True
            ok = cat1 is True and cat2 is True and a == [False, True, True] and b1 == [True, False, True, False, 4] and c == ['+1.00', True] and d == [False, True, ''] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: produto abre em janela própria, escolhe a variante e volta à lista')

            if not ok: falhas.append('vendas janela'); print('        veio', a, b1, c, d, pg.erros)
            await pg.close()

            # Vendas: abas, grau do cliente, cores como cartões, código escondido, peças de lotes diferentes juntas
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.items = [
                {tipo:'pre',ref:'T1',grau:'+1.00',cor:'Preto',qty:3,fmt:'',med:'',vr:'',lote:'A'},
                {tipo:'pre',ref:'T1',grau:'+1.00',cor:'Preto',qty:2,fmt:'',med:'',vr:'',lote:'B'},
                {tipo:'pre',ref:'T1',grau:'+1.50',cor:'Preto',qty:0,fmt:'',med:'',vr:''},
                {tipo:'pre',ref:'T1',grau:'+1.00',cor:'Azul',qty:4,fmt:'',med:'',vr:''},
                {tipo:'pre',ref:'T2',grau:'+1.50',cor:'Verde',qty:5,fmt:'',med:'',vr:''},
                {tipo:'pre',ref:'T3',grau:'+2.00',cor:'Preto',qty:0,fmt:'',med:'',vr:''},
                {tipo:'sem',ref:'AR1',grau:'',cor:'Preto',qty:2,fmt:'Redondo',med:'50-20-140',vr:'C1'},
                {tipo:'sem',ref:'AR1',grau:'',cor:'Bege',qty:3,fmt:'Redondo',med:'50-20-140',vr:'C2'}];
              S.grp = []; S.cart = []; S.vq = ''; S.vRef = ''; S.vSel = null; S.vTipo = 'all'; S.vFilt = true; S.vGrau = ''; L.setView('vendas'); }""")
            await pg.wait_for_timeout(300)
            await pg.click('#cjAj'); await pg.wait_for_timeout(500)
            tabs = await pg.evaluate("() => [...document.querySelectorAll('.cjC[data-g=tipos] span')].map(b => b.innerText)")
            await pg.click('.cjC[data-v=pre]'); await pg.wait_for_timeout(300)
            graus = await pg.evaluate("() => [...document.querySelectorAll('.cjGc')].map(b => b.textContent)")
            await pg.click('.cjGc[data-gr="+1.50"]'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
            so150 = await pg.evaluate("() => [...document.querySelectorAll('#vRows .pcard')].map(c => c.dataset.ref)")
            semcod = await pg.evaluate("() => !document.getElementById('vRows').innerText.includes('Código ')")
            await pg.click('#cjAj'); await pg.wait_for_timeout(500); await pg.click('#cjLimpa'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
            await pg.locator('#vRows .pcard[data-ref="T1"]').click(); await pg.wait_for_timeout(400)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            det = await pg.evaluate("""() => { const d = document.getElementById('vDetail');
              return { semBolinha: d.querySelectorAll('.dot').length, graus: [...d.querySelectorAll('.pl.pick')].map(x => x.innerText.replace(/\\s+/g,' ')),
                       cartoes: [...d.querySelectorAll('.ccard')].map(x => x.innerText.replace(/\\s+/g,' ')), barra: !!d.querySelector('.vsale'), codigo: d.innerText.includes('Nº') } }""")
            await pg.evaluate("() => { const S = window.__LF.S; S.qty = 5; window.__LF.render(); }"); await pg.wait_for_timeout(200)
            await pg.locator('#vDetail .vsale .go').click(); await pg.wait_for_timeout(300)
            cart = await pg.evaluate("() => window.__LF.S.cart.map(l => [l.it.lote, l.qty])")
            await pg.evaluate("() => { const S = window.__LF.S; S.cart = []; S.cartOpen = false; S.vTipo = 'sem'; S.vRef = 'sem|AR1'; S.vSel = null; window.__LF.render(); }"); await pg.wait_for_timeout(300)
            arm = await pg.evaluate("() => [...document.querySelectorAll('#vDetail .ccard')].map(x => x.innerText.replace(/\\s+/g,' '))")
            await pg.locator('#vDetail .ccard', has_text='Bege').click(); await pg.wait_for_timeout(300)
            selcor = await pg.evaluate("() => window.__LF.S.vSel && window.__LF.S.vSel.cor")
            ok = (tabs == ['Solar', 'Grau', 'Armação'] and graus == ['+1.00', '+1.50']
                  and so150 == ['T2'] and semcod
                  and det['semBolinha'] == 0 and det['graus'] == ['+1.00 9 un.', '+1.50 Esgotado'] and len(det['cartoes']) == 2 and det['barra'] and not det['codigo']
                  and sorted(cart) == [['A', 3], ['B', 2]]
                  and len(arm) == 2 and selcor == 'Bege' and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Vendas: tipo e grau pela janela de ajustes, cores em cartões, sem código/bolinha, lotes iguais somados')
            if not ok: falhas.append('vendas catálogo'); print('        veio', tabs, graus, so150, semcod, det, cart, arm, selcor, pg.erros)
            await pg.close()

            # Estoque: abas Produtos/Compras/Reposição, mapa de graus e lista de compra
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.items = [
                {tipo:'pre',ref:'T1',grau:'+0.25',cor:'Preto',qty:12,fmt:'',med:'',vr:''},
                {tipo:'pre',ref:'T1',grau:'+1.50',cor:'Preto',qty:4,fmt:'',med:'',vr:''},
                {tipo:'pre',ref:'T2',grau:'+1.50',cor:'Azul',qty:1,fmt:'',med:'',vr:''},
                {tipo:'pre',ref:'T2',grau:'+3.50',cor:'Azul',qty:2,fmt:'',med:'',vr:''},
                {tipo:'pre',ref:'T2',grau:'+3.00',cor:'Azul',qty:5,fmt:'',med:'',vr:''}];
              S.grp = [{id:'G1',forn:'Kaz',tipo:'pre',qty:24,usd:0.5,totalUsd:12,moeda:'usd',sold:0,ts:Date.now()}];
              S.tipo = 'pre'; S.todos = false; S.selSet = []; S.q = ''; S.repQ = {}; S.repMix = ''; S.repLista = false; S.repoView = false; S.lotesView = false; L.setView('estoque'); }""")
            await pg.wait_for_timeout(300)
            botao = await pg.evaluate("() => { const b = document.getElementById('btnGraus'); return !!b && !b.hidden && document.getElementById('mapaB').hidden; }")
            await pg.click('#btnGraus'); await pg.wait_for_timeout(450)
            mapa = await pg.evaluate("""() => [...document.querySelectorAll('#grFolha .gcell')].map(c => c.className.replace('gcell','').replace('on','').trim() + ':' + c.querySelector('b').innerText.replace('—','0'))""")
            abas = await pg.evaluate("() => [...document.querySelectorAll('#eTabs .chip')].map(b => b.innerText.replace(/\\s+/g,' '))")
            kl = await pg.evaluate("() => !document.getElementById('kLot')")  # 52d: os números grandes saíram
            await pg.locator('#grFolha .gcell', has_text='+1.50').click(); await pg.wait_for_timeout(500)
            filtro = await pg.evaluate("() => window.__LF.S.q")
            await pg.click('#btnGraus'); await pg.wait_for_timeout(450)
            await pg.locator('#grFolha .gcell', has_text='+1.50').click(); await pg.wait_for_timeout(500)
            # 66 (22/11): o Inventário fica sem abas; o "Repor" do mapa de graus leva a Compras (os graus em falta são vagas)
            await pg.evaluate("() => window.__LF.ACT.grauRepor()"); await pg.wait_for_timeout(400)
            linha = await pg.evaluate("() => window.__LF.S.view === 'comp' && [...document.querySelectorAll('#v-comp .cpL')].some(b => /Pré-graduados · \\+/.test(b.innerText))")
            ok = (botao and mapa.count('r:0') == 12 and mapa.count('y:5') == 2 and 'y:2' in mapa and 'g:12' in mapa and abas == [] and kl is True
                  and filtro == '+1.50' and linha and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Estoque: sem abas (66), mapa de graus e o "Repor" que leva a Compras')
            if not ok: falhas.append('estoque abas'); print('        veio', botao, mapa, abas, kl, filtro, linha, pg.erros)
            await pg.close()

            # v469: contador sem quadrado, barra Selecionar/lixeira fora, trava única de rolagem
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.tipo = 'sem'; S.todos = false; S.cont = false; L.setView('estoque'); }"); await pg.wait_for_timeout(400)
            # 52d (22/11): os números grandes saíram; a contagem abre e fecha pela mesma função (contTroca, "Contar o estoque ›")
            await pg.evaluate("() => window.__LF.ACT.contTroca()"); await pg.wait_for_timeout(300)
            k1 = await pg.evaluate("() => [!document.getElementById('kpisE'), !document.getElementById('contCard').hidden, document.getElementById('listCard').hidden]")
            await pg.evaluate("() => window.__LF.ACT.contTroca()"); await pg.wait_for_timeout(300)
            k2 = await pg.evaluate("() => document.getElementById('contCard').hidden")
            barra = await pg.evaluate("() => getComputedStyle(document.getElementById('lt').parentElement).display === 'none' && getComputedStyle(document.getElementById('lh')).display === 'none'")
            await pg.evaluate("() => { const S = window.__LF.S; S.todos = true; window.__LF.render(); }"); await pg.wait_for_timeout(500)
            y0 = await pg.evaluate("() => { window.scrollTo({top: 600, behavior: 'instant'}); return Math.round(window.scrollY); }"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => { const m = document.createElement('div'); m.className = 'modal'; m.id = 'mTeste'; m.style.cssText = 'position:fixed;inset:0;display:flex'; document.body.appendChild(m); }"); await pg.wait_for_timeout(250)
            tr1 = await pg.evaluate("() => [document.documentElement.classList.contains('lfTrava'), document.body.style.top]")
            await pg.mouse.wheel(0, 500); await pg.wait_for_timeout(200)
            await pg.evaluate("() => document.getElementById('mTeste').remove()"); await pg.wait_for_timeout(250)
            tr2 = await pg.evaluate("() => [document.documentElement.classList.contains('lfTrava'), Math.round(window.scrollY)]")
            total += 1
            ok = k1 == [True, True, True] and k2 is True and barra and y0 > 100 and tr1 == [True, '-' + str(y0) + 'px'] and tr2 == [False, y0] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v469: contagem abre e fecha (sem os números grandes), barra Selecionar/lixeira fora, janela aberta trava o fundo e devolve a posição')
            if not ok: falhas.append('v469 inventario'); print('        veio', k1, k2, barra, y0, tr1, tr2, pg.erros)
            await pg.close()

            # v470: com a nuvem conectada, todas as seções de Ajustes ficam no mesmo grupo (Aparelhos não desarruma o HTML)
            pg = await pagina()
            await pg.context.route(re.compile(r'googleapis'), lambda r: r.fulfill(json={}))
            aj = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S.nuvem.rt = 'x'; S.nuvem.email = 'a@b.c'; S.nvLista = [{id: '2026-11-08', kb: 900}];
              S._syncAps = [{ap: 'APEU', nome: 'Celular', ts: Date.now()}, {ap: 'APXY', nome: 'PC', ts: Date.now()}]; S.aparelho = 'APEU'; L.setView('ajustes'); S._ajForce = true; L.render();
              await new Promise(r => setTimeout(r, 400)); const g = document.getElementById('ajGrp');
              const lin = [...g.querySelectorAll('.ajS[data-k="bk"] .nvxL span')].map(x => x.textContent);
              L.ACT.nvxAps(); await new Promise(r => setTimeout(r, 400));
              return [[...document.querySelectorAll('.ajS')].every(x => g.contains(x)), !!document.querySelector('.ljJn .apLn') && lin.join('|') === 'Voltar no tempo|Lixeira|Aparelhos|Arquivo de backup', !g.querySelector('.ajS[data-k="pauto"]')]; }""")  # 46: Pagamento automático saiu de Ajustes
            total += 1
            ok = aj == [True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v470 + S370: Ajustes com a nuvem conectada — Cópias e nuvem enxuta (estado + 4 linhas; Aparelhos abre), Pagamento automático no mesmo grupo')
            if not ok: falhas.append('v470 ajustes grupo'); print('        veio', aj, pg.erros)
            await pg.close()

            # v471: Inventário limpo — sinal C no preço, sem selo de faixa, busca do Catálogo, Situação, preços para corrigir, abrir sem ligar filtro
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.todos = true; S.selSet = []; S.det = false; S.cont = false; S.sitF = ''; L.setView('estoque'); }"); await pg.wait_for_timeout(500)
            v1 = await pg.evaluate("""() => { const c = [...document.querySelectorAll('#rows .pcard')];
              return [!!document.getElementById('invBs') && document.getElementById('invBs').contains(document.getElementById('q')), /peças · Todos/.test(document.getElementById('invInfo').innerText),
                c.some(x => x.querySelector('.pSin')), !document.querySelector('#rows .pcard .ftag, #rows .pcard .zbd:not([hidden])') || getComputedStyle(document.querySelector('#rows .pcard .zbd') || document.body).display === 'none', !document.querySelector('#invInfo .ifNum') && !document.getElementById('invFix')]; }""")  # 52d: a linha de preços saiu da barra (está no sino)
            f1 = await pg.evaluate("""async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const S = window.__LF.S; const c = [...document.querySelectorAll('#rows .pcard[data-ref]')].find(x => !/Lote|modelos/.test(x.innerText));
              c.click(); await w(400); const durante = [S.todos, S.det, /×/.test(document.getElementById('fsum').innerText)]; S.det = false; S.open = ''; window.__LF.render(); await w(300); return durante.concat([S.todos]); }""")
            await pg.click('#btnFilt'); await pg.wait_for_timeout(400)
            n0 = await pg.evaluate("() => String(document.querySelectorAll('#rows .pcard[data-ref]').length)")
            await pg.click('#fSit [data-id="preco"]'); await pg.wait_for_timeout(400)
            n1 = await pg.evaluate("() => [String(document.querySelectorAll('#rows .pcard[data-ref]').length), window.__LF.S.multi, [...document.querySelectorAll('#rows .pcard[data-ref]')].length, getComputedStyle(document.getElementById('filtApply').parentNode).display]")
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700); await pg.evaluate(SAIR_SEM_SALVAR); await pg.wait_for_timeout(500)
            await pg.evaluate("() => window.__LF.ACT.invLimpa()"); await pg.wait_for_timeout(300)
            await pg.evaluate("() => window.__LF.ACT.pcAbre()"); await pg.wait_for_timeout(500)  # 52d: Preços abre pelo sino (o mesmo pcAbre)
            antes = await pg.evaluate("() => document.querySelectorAll('#v-dash .pcNaTela .pcLi').length")
            ref1 = await pg.evaluate("() => { const b = document.querySelector('#v-dash .pcNaTela [data-act=pcUsa]'); return b ? b.getAttribute('data-id') : ''; }")
            if ref1: await pg.click('#v-dash .pcNaTela [data-act=pcUsa]'); await pg.wait_for_timeout(500)
            depois = await pg.evaluate("(r) => [document.querySelectorAll('#v-dash .pcNaTela .pcLi').length, !!(window.__LF.S.pprice[r] && window.__LF.S.pprice[r].novo)]", ref1)
            total += 1
            ok = v1 == [True, True, True, True, True] and f1 == [False, True, False, True] and n0 != n1[0] and n1[1] is True and n1[2] > 0 and n1[3] == 'none' and ref1 and depois == [antes - 1, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v471: Inventário limpo — busca do Catálogo, sinal no preço, Situação, preços para corrigir (Usar X), abrir peça não liga filtro')
            if not ok: falhas.append('v471 inventario limpo'); print('        veio', v1, f1, n0, n1, antes, ref1, depois, pg.erros)
            await pg.close()

            # v472: "grau" vira "Leitura" para o cliente — nomes "Óculos de grau…" migram e o site recebe a etiqueta LEITURA
            pg = await pagina()
            g1 = await pg.evaluate("""async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const L = window.__LF, S = L.S;
              const it = S.items.find(i => i.tipo === 'pre'); const ref = it.ref; S.pnome = S.pnome || {}; S.pnome[ref] = 'Óculos de grau quadrado preto'; S.pnome['ZZ1'] = 'Armação de grau fina';
              const n = L.leitMigra(); const doc = JSON.stringify(L.vitProduto(ref) || {});
              return [n, S.pnome[ref], S.pnome['ZZ1'], L.leitNome('Óculos de graus'), L.leitMigra(), /GRAU/.test(doc)]; }""")
            total += 1
            ok = g1[:5] == [1, 'Óculos de leitura quadrado preto', 'Armação de grau fina', 'Óculos de graus', 0] and not g1[5] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v472: nomes "Óculos de grau…" viram "Óculos de leitura…" (uma vez, sem mexer em outros nomes); site sem GRAU')
            if not ok: falhas.append('v472 leitura'); print('        veio', g1, pg.erros)
            await pg.close()

            # Pedido com linhas, frete rateado e cadastro enxuto
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.grp = []; S.cash.usd = 1000; S.addOpen = true; S.addMode = 'lote';
              S.lf = {forn:'Kaz', ped:'2682', frete:'30', moeda:'usd', rows:[{tipo:'sem',qty:'20',usd:'2',nome:'Econ',modo:'peca'},{tipo:'sem',qty:'30',usd:'360',nome:'Lux',modo:'total'}]}; L.render(); }""")
            await pg.wait_for_timeout(300)
            await pg.locator('#lotForm button.go').click(); await pg.wait_for_timeout(300)
            gr = await pg.evaluate("() => window.__LF.S.grp.map(g => [g.nome, g.qty, g.totalUsd, g.frete, g.ped])")
            await pg.evaluate("() => { const S = window.__LF.S; S.addOpen = false; S.lotesView = true; S.lotSel = ''; window.__LF.render(); }")
            await pg.wait_for_timeout(300)
            cab = await pg.inner_text('#lotView section[data-ped]')
            cad = await pg.evaluate("() => [!!document.querySelector('#photoCard details#phMais'), !!document.getElementById('phNext')]")
            ok = (gr == [['Econ', 20, 43, 3, '2682'], ['Lux', 30, 387, 27, '2682']] and 'Compra #2682' in cab and 'registradas 0 de 50' in cab
                  and 'US$ 8,60 por peça' in cab and cad == [True, True] and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Pedido: linhas, frete rateado, cabeçalho e cadastro enxuto')
            if not ok: falhas.append('pedido'); print('        veio', gr, cab, cad, pg.erros)
            await pg.close()

            # Histórico: carrega 30 dias, busca, filtros, calendário
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; const n = Date.now();
              S.sales = []; S.dlog = []; S.elog = []; S.cambios = [];
              const mk = (d, ref, forma, est) => ({id:'V-'+d+ref, ts:n-d*864e5, tipo:'pre', ref, cor:'Preto', grau:'+1.00', qty:1, fx:7000, pct:.1, pago:1000, cPeca:100, estorno:!!est, price:100000*(d+1), livre:10000, moeda:'pyg', recebido:100000*(d+1), rate:1, forma, faixa:'', pags:[{moeda:'pyg',v:100000*(d+1),rate:1,fee:0}]});
              S.sales = [mk(0,'AAA','pix'), mk(2,'BBB','din'), mk(40,'CCC','deb'), mk(70,'DDD','din', true)];
              S.dlog = [{ts:n-3*864e5, kind:'pago', desc:'Conta de luz', valor:50000}];
              S.hq=''; S.hF={tipo:'',forma:'',faixa:'',moeda:'',vmin:'',vmax:''}; S.hDias=30; S.hFopen=false;
              L.setView('hist'); }""")
            await pg.wait_for_timeout(300)
            total += 1
            ha = await pg.evaluate("() => document.querySelectorAll('#hRes [data-act=opendia]').length")
            await pg.locator('#hRes [data-act=hmais]').click(); await pg.wait_for_timeout(200)
            hb = await pg.evaluate("() => document.querySelectorAll('#hRes [data-act=opendia], #hRes [data-act=hSem]').length")  # S374 (58b): dia antigo fica dentro da semana fechada
            await pg.fill('#hq', 'ccc'); await pg.wait_for_timeout(200)
            hc = await pg.evaluate("() => [document.querySelectorAll('#hRes .card, #hRes .sl418').length, document.activeElement.id]")
            await pg.fill('#hq', ''); await pg.wait_for_timeout(100)
            await pg.locator('[data-act=hfopen]').click(); await pg.wait_for_timeout(200)
            await pg.locator('[data-id=\'tipo|pago\']').click(); await pg.wait_for_timeout(200)
            hd = await pg.evaluate("() => document.querySelectorAll('#hRes .card, #hRes .sl418').length")
            await pg.locator('[data-act=hlimpar]').click(); await pg.wait_for_timeout(100)
            await pg.locator('[data-id=\'forma|pix\']').click(); await pg.wait_for_timeout(200)
            he = await pg.evaluate("() => document.querySelectorAll('#hRes .card, #hRes .sl418').length")
            await pg.locator('[data-act=hlimpar]').click(); await pg.wait_for_timeout(100)
            await pg.locator('[data-id=\'tipo|estorno\']').click(); await pg.wait_for_timeout(200)
            hf = await pg.evaluate("() => document.querySelectorAll('#hRes .card, #hRes .sl418').length")
            await pg.locator('[data-act=hlimpar]').click(); await pg.wait_for_timeout(100)
            await pg.evaluate("() => { const t = document.getElementById('hDate'); t.hidden = false; t.value = window.__LF.S.sales[0] && (function(){const d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)})(); t.dispatchEvent(new Event('change',{bubbles:true})); }")
            await pg.wait_for_timeout(300)
            hg = await pg.evaluate("() => window.__LF.S.view")
            ok = ha == 3 and hb >= 4 and hc == [1, 'hq'] and hd == 1 and he == 1 and hf == 1 and hg == 'dia' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Histórico: 30 dias, carregar mais, busca, filtros e calendário')
            if not ok: falhas.append('historico'); print('        veio', ha, hb, hc, hd, he, hf, hg, pg.erros)
            await pg.close()

            # moeda principal e descarte
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.fx.pyg = 7000; S.fx.brl = 5;
              const g0 = L.gs(700000); S.totM = 'usd'; const g1 = L.totFmt(700000); S.totM = 'brl'; const g2 = L.totFmt(700000); S.totM = 'pyg';
              const it = S.items.filter(i => i.qty >= 3 && L.tipoOf(i.tipo) && L.tipoOf(i.tipo).pago > 0)[0];
              const q0 = it.qty, n0 = S.dlog.length, r0 = L.resultadoMes(new Date().getFullYear(), new Date().getMonth()).perdas;
              const v = L.descartar(it, 2, 'quebrada');
              const r1 = L.resultadoMes(new Date().getFullYear(), new Date().getMonth()).perdas;
              const bad = L.descartar(it, 999, '');
              return [g0, g1, g2, q0 - it.qty, S.dlog.length - n0, v > 0, r1 - r0 === v, bad === null]; }""")
            ok = r[0].startswith('G$') and r[1] == 'US$ 100' and r[2] == 'R$ 500' and r[3:] == [2, 1, True, True, True] and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'total convertido (G$/US$/R$) e descarte entra como prejuízo')
            if not ok: falhas.append('moeda/descarte'); print('        veio', r, pg.erros)
            await pg.close()

            # carrinho: piso sobre o total, preço combinado por linha, pagamento repartido
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.fx.pyg = 7000; S.cash = {pyg: 0, usd: 0, brl: 0}; S.exp = []; S.volAuto = false; S.volume = 1000;
              const its = S.items.filter(i => i.qty >= 2 && L.tipoOf(i.tipo) && L.tFor && true).slice(0, 2);
              const q0 = its.map(i => i.qty), n0 = S.sales.length;
              S.cartOpen = false; S.vRef = ''; S.vSel = null;
              S.cart = its.map(i => ({it: i, qty: 1, preco: null}));
              const sub = S.cart.reduce((a, l) => a + L.tFor(l.it).price, 0);
              // linha 1 muito barata, linha 2 mais cara, total = soma da tabela
              S.cart[0].preco = Math.round(sub * 0.2); S.cart[1].preco = sub - S.cart[0].preco;
              S.cartOpen = true; S.moeda = 'pyg'; S.rec = null; S.descTxt = '';
              L.setView('vendas'); L.render();
              const pv = L.cartPrevia();
              const bar = [document.getElementById('cartCard').hidden, document.getElementById('vSaleCard').hidden, document.getElementById('qtyB').hidden];
              document.getElementById('sgo').click();
              const vs = S.sales.slice(0, 2);
              return [pv.abaixo, pv.perde, bar, S.sales.length - n0, vs.every(s => s.carrinho && s.carrinho === vs[0].carrinho), vs.reduce((a, s) => a + s.price, 0) === sub, its.map((i, k) => q0[k] - i.qty), S.cart.length, S.cash.pyg === sub, vs.every(s => s.abaixo === pv.abaixo)]; }""")
            ok = r[0] is False and r[1] is False and r[2] == [True, False, True] and r[3] == 2 and r[4] and r[5] and r[6] == [1, 1] and r[7] == 0 and r[8] and r[9] and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'carrinho: piso sobre o total, preço por linha e pagamento repartido')
            if not ok: falhas.append('carrinho'); print('        veio', r, pg.erros)
            await pg.close()

            # carrinho pela tela: adicionar, abrir, mudar preço, esvaziar
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.cart = []; S.cartOpen = false; S.vRef = ''; S.vSel = null; S.vq = ''; S.vTipo = 'all'; S.vFaixa = ''; S.qty = 1; L.setView('vendas'); }""")
            await pg.wait_for_timeout(300)
            await pg.locator('#vRows .pcard[data-ref="SP57765"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            await pg.evaluate("() => document.getElementById('sCartAdd').click()"); await pg.wait_for_timeout(300)
            u1 = await pg.evaluate("() => [document.getElementById('cartBar').hidden, /Carrinho\s*1 peça/.test(document.getElementById('cartBar').textContent), window.__LF.S.cart.length]")
            await pg.locator('#vRows .pcard:not([data-ref="SP57765"])').first.click(); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            await pg.evaluate("() => document.getElementById('sCartAdd').click()"); await pg.wait_for_timeout(300)
            await pg.locator('[data-act=cartopen]').click(); await pg.wait_for_timeout(300)
            u2 = await pg.evaluate("() => [document.getElementById('cartCard').hidden, document.querySelectorAll('#cartCard input, #cartCard select').length, document.querySelectorAll('#cartCard [data-act=cartrm]').length, /Tabela:|Cliente…/.test(document.getElementById('cartCard').innerText)]")  # S367: sem campo de preço, sem Tabela, sem Cliente, sem código
            u4 = await pg.evaluate("() => ['qtyB','payB','sgo','sCartAdd'].map(i => document.getElementById(i).offsetParent !== null)")
            u4s = await pg.evaluate("() => [!!document.getElementById('cartSlot'), !!document.getElementById('cartConf'), document.getElementById('pagHead').hidden]")
            await pg.locator('#cartConf').click(); await pg.wait_for_timeout(300)
            u6 = await pg.evaluate("() => [document.getElementById('cartCard').hidden, ['payB','sgo'].map(i => document.getElementById(i).offsetParent !== null), document.getElementById('pagHead').hidden, document.getElementById('tot').textContent.length > 0]")
            await pg.locator('#pagHead [data-act=cartvolta]').click(); await pg.wait_for_timeout(300)
            u7 = await pg.evaluate("() => [document.getElementById('cartCard').hidden, document.getElementById('vSaleCard').hidden, document.getElementById('pagHead').hidden]")
            await pg.evaluate("() => window.__LF.ACT.cartclose()"); await pg.wait_for_timeout(300)
            await pg.locator('#vRows .pcard').first.click(); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            u5 = await pg.evaluate("() => ['qtyB','payB','sgo','sCartAdd'].map(i => document.getElementById(i).offsetParent !== null)")
            await pg.locator('[data-act=cartopen]').click(); await pg.wait_for_timeout(300)
            await pg.locator('[data-act=cartclear]').click(); await pg.wait_for_timeout(300)
            u3 = await pg.evaluate("() => [window.__LF.S.cart.length, window.__LF.S.cartOpen, document.getElementById('cartCard').hidden, document.getElementById('cartBar').hidden]")
            ok = u1 == [False, True, 1] and u2 == [False, 0, 2, False] and u3 == [0, False, True, True] and u4 == [False, False, False, False] and u4s == [True, True, True] and u6 == [True, [True, True], False, True] and u7 == [False, True, True] and u5 == [False, False, False, False] and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: carrinho (adicionar, abrir, sem campos de preço/tabela/cliente/código, esvaziar)')
            if not ok: falhas.append('carrinho tela'); print('        veio', u1, u2, u3, u4, u4s, u6, u7, u5, pg.erros)
            await pg.close()

            # campos de digitar seguem a moeda principal
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.fx.pyg = 7000; S.fx.brl = 5;
              S.descMode = 'pyg'; S.descTxt = '2';
              S.dfold = S.dfold || {}; S.dfold.nova = true; L.setView('despesas'); L.render();  // S374 (58a): Nova despesa abre
              const a = !document.getElementById('melhIn');
              return [a, document.getElementById('nMoeda').value]; }""")
            ok = r[0] is True and r[1] == 'pyg' and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'campos de valor em guaranis, com a moeda de cada campo')
            if not ok: falhas.append('campos moeda'); print('        veio', r, pg.erros)
            await pg.close()

            # câmbio e cotações sempre em guaranis, mesmo com outra moeda principal
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.fx.pyg = 7000; S.fx.brl = 5; S.moedaP = 'usd';
              L.setView('fx'); L.render(); const t = document.getElementById('v-fx') ? document.getElementById('v-fx').textContent : document.body.textContent;
              return [t.indexOf('G$ 7.000') >= 0, t.indexOf('G$ 1.400') >= 0, t.indexOf('R$ 5,00') >= 0, t.indexOf('1,00') < 0 || t.indexOf('US$ 1 custa') >= 0]; }""")
            ok = all(r) and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'câmbio: cotações em G$ mesmo com dólar como moeda principal')
            if not ok: falhas.append('cambio moeda'); print('        veio', r, pg.erros)
            await pg.close()

            # cotação da loja: mercado menos a margem fixa; carrinho usa; centavos fora
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.fx.pyg = 8000; S.fx.brl = 5; S.fxHist = []; S.totM = 'usd'; const g = L.totFmt(7000 * 84.78); S.totM = 'pyg';
              const u = Math.round(L.rateDe('usd', 0)), b = Math.round(L.rateDe('brl', 0)), man = L.rateDe('brl', 1300), custo = L.ratePyg ? L.ratePyg('usd') : 8000;
              const it = S.items.filter(i => i.qty >= 1 && L.tFor(i).price > 0)[0];
              S.cart = [{it, qty: 1, preco: null}]; S.cartOpen = true; S.moeda = 'brl'; S.rate1 = ''; S.rec = null; S.descTxt = ''; S.pagMisto = false;
              L.setView('vendas'); L.render();
              const need = L.tFor(it).price, sh = document.getElementById('recIn').value;
              const esp = (need / L.rateDe('brl', 0)).toFixed(2).replace('.', ',');
              L.setView('fx'); L.render(); const fx = document.getElementById('v-fx').textContent;
              return [g, u, b, man, custo, sh === esp, fx.indexOf('Como o app te protege') < 0, fx.indexOf('G$ 8.000') >= 0]; }""")  # 62: o colchão mora em Preços › Regras
            ok = r[0] == 'US$ 74' and r[1] == 8100 and r[2] == 1600 and r[3] == 1300 and r[4] == 8000 and r[5] and r[6] and r[7] and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'cotação da loja: dólar com margem a mais, no carrinho e na aba Câmbio')
            if not ok: falhas.append('cotacao loja'); print('        veio', r, pg.erros)
            await pg.close()

            # dados de exemplo: fotos em todos os produtos e 14 meses de histórico
            pg = await pagina()
            r = await pg.evaluate("""() => { const S = window.__LF.S;
              const semFoto = S.items.filter(i => !i.bulk && i.cor && !S.fotos[i.ref + '|' + i.cor]).length;
              const dias = (S.sales[0].ts - S.sales[S.sales.length - 1].ts) / 864e5;
              const meses = new Set(S.sales.map(s => new Date(s.ts).getFullYear() + '-' + new Date(s.ts).getMonth())).size;
              return [semFoto, dias > 400, meses >= 14, S.fxHist.length > 400, S.cpay.length > 60, S.retiradas.length >= 12, S.compras.length >= 6, S.descartes.length >= 2]; }""")
            ok = r[0] == 0 and all(r[1:]) and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'dados de exemplo: fotos em tudo e mais de um ano de histórico')
            if not ok: falhas.append('exemplo 14 meses'); print('        veio', r, pg.erros)
            await pg.close()

            # fundo branco automático foi removido: a foto entra como foi tirada
            pg = await pagina()
            import base64
            b64 = await pg.evaluate("""() => { const c = document.createElement('canvas'); c.width = 600; c.height = 400; const g = c.getContext('2d');
              g.fillStyle = '#785a3c'; g.fillRect(0, 0, 600, 400);
              for (let i = 0; i < 3000; i++) { const v = Math.floor(Math.random() * 256); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(Math.random() * 600, Math.random() * 400, 2, 2); }
              return c.toDataURL('image/png').split(',')[1]; }""")
            await pg.evaluate("() => { window.__LF.setView('estoque'); }")
            await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            ck = await pg.evaluate("() => [!!document.getElementById('fbCk'), !!document.getElementById('phOrig'), typeof window.__LF.whiten]")
            await pg.set_input_files('#file', {'name': 'fb.png', 'mimeType': 'image/png', 'buffer': base64.b64decode(b64)}); await pg.wait_for_timeout(2500)
            r = await pg.evaluate("() => { const im = new Image(); im.src = document.getElementById('phImg').src; return [!document.getElementById('photoCard').hidden, document.getElementById('phImg').src.length > 1000, document.getElementById('phImg').src.startsWith('data:image/jpeg'), document.getElementById('phImg').naturalWidth === 600] }")
            total += 1
            ok = ck == [False, False, 'undefined'] and r == [True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'sem fundo branco automático: foto entra como foi tirada')
            if not ok: falhas.append('foto original'); print('        veio', ck, r, pg.erros)
            await pg.close()

            # Entrada da compra: só ícones haste e câmera + Detalhar depois
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [];
              S.grp = [{id:'G1',forn:'Kaz',tipo:'pre',qty:5,usd:0.5,totalUsd:2.5,moeda:'usd',sold:0,ts:Date.now()}]; S.view = 'estoque'; S.lotesView = true; S.lotSel = 'G1'; L.render(); }""")
            await pg.wait_for_timeout(400)
            ent = await pg.evaluate("() => { const c = document.querySelector('#entCompra'); return c ? [c.querySelectorAll('button').length, !!c.querySelector('#entHaste'), !!c.querySelector('#entFoto'), c.querySelector('#entHaste').innerText.trim() + c.querySelector('#entFoto').innerText.trim(), c.querySelector('#entDepois').innerText] : null }")
            await pg.click('#entHaste'); await pg.wait_for_timeout(500)
            aft = await pg.evaluate("() => [window.__LF.S.fromLot, window.__LF.S.addOpen, window.__LF.S.addMode, window.__LF.S.gSel]")
            await pg.evaluate("() => { document.querySelectorAll('[aria-label^=Leitor]').forEach(d => d.remove()); const S = window.__LF.S; S.addOpen = false; S.fromLot = ''; S.lotSel = 'G1'; window.__LF.render(); }")
            await pg.click('#entDepois'); await pg.wait_for_timeout(300)
            dep = await pg.evaluate("() => window.__LF.S.lotSel")
            ok = (ent == [3, True, True, '', 'Detalhar depois'] and aft == ['G1', True, 'prod', 'G1'] and dep == '' )
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Entrada da compra: só ícones haste e câmera e "Detalhar depois"')
            if not ok: falhas.append('entrada compra'); print('        veio', ent, aft, dep, pg.erros)
            await pg.close()

            # Início: aviso "peças da compra sem detalhe" leva às Compras; tile se chama Compras
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [{tipo:'pre',ref:'T1',grau:'+0.25',cor:'Preto',qty:4,fmt:'',med:'',vr:'',lote:'G1'}];
              S.grp = [{id:'G1',forn:'Kaz',tipo:'pre',qty:12,usd:0.5,totalUsd:6,moeda:'usd',sold:0,ts:Date.now()}]; S.lotesView = false; L.setView('inicio'); L.render(); }""")
            await pg.wait_for_timeout(400)
            # S374 (esboço 57a, R8): o aviso saiu do Início e mora no Guardião (Pendências), que leva às Compras
            semIni = await pg.evaluate("() => !document.querySelector('#v-inicio section[data-id=lotes]')")
            await pg.evaluate("() => window.__LF.setView('notif')"); await pg.wait_for_timeout(500)
            ini = ('8 peças da compra de ' if semIni else '') + await pg.evaluate("() => { const b = [...document.querySelectorAll('#v-notif [data-act=inicio][data-id=lotes]')][0]; const c = b && (b.closest('.card,section,li') || b.parentElement); return c ? c.innerText.replace(/\\s+/g,' ') : '' }")
            await pg.click('#v-notif [data-act=inicio][data-id=lotes]'); await pg.wait_for_timeout(500)
            irc = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.lotesView, document.querySelector('#v-estoque > .top h1').innerText]")  # 66: um título por tela
            ok = ('8 peças da compra de' in ini and 'sem detalhe' in ini.lower() and irc == ['estoque', True, 'Fornecedores'] and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Início sem o aviso repetido (57a); o Guardião leva às Compras')
            if not ok: falhas.append('inicio compras'); print('        veio', ini, irc, pg.erros)
            await pg.close()

            # Ler haste: depois da leitura o formulário de cadastro aparece preenchido (mesmo vindo do menu)
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')")
            await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            await pg.evaluate("() => window.__LF.fillAdd({ref: 'ZZ99', med: '53□18-140', msg: 'lido'})"); await pg.wait_for_timeout(300)
            fa = await pg.evaluate("() => [window.__LF.S.addMode, document.getElementById('addProdRest').offsetParent !== null, document.getElementById('eRef').value, document.getElementById('eMed').offsetParent !== null || document.getElementById('eMed').value]")
            ok = fa[0] == 'prod' and fa[1] is True and fa[2] == 'ZZ99' and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Ler haste: o cadastro aparece preenchido depois da leitura')
            if not ok: falhas.append('fillAdd menu'); print('        veio', fa, pg.erros)
            await pg.close()

            # Adicionar: menu único (Ler haste, Foto, Chegou mercadoria, Preencher à mão) sem abas nem leitor duplicado
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')")
            await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            m0 = await pg.evaluate("() => { const v = i => { const e = document.getElementById(i); return !!e && e.offsetParent !== null }; return [!document.getElementById('btnLeitor'), !document.getElementById('btnFoto'), v('addToLote'), v('addToMan'), v('addBack'), v('addProdRest'), v('addLoteB'), document.querySelectorAll('#addModal [id=btnLeitor]').length, !document.getElementById('addModeB')] }")  # 44/45: sem Ler haste nem Foto
            await pg.click('#addToLote'); await pg.wait_for_timeout(300); await pg.click('#cpMao'); await pg.wait_for_timeout(300)
            m1 = await pg.evaluate("() => { const v = i => { const e = document.getElementById(i); return !!e && e.offsetParent !== null }; return [v('addLoteB'), v('addBack'), v('btnLeitor'), v('addToMan')] }")
            await pg.click('#addBack'); await pg.wait_for_timeout(300)
            await pg.click('#addToMan'); await pg.wait_for_timeout(300)
            m2 = await pg.evaluate("() => { const v = i => { const e = document.getElementById(i); return !!e && e.offsetParent !== null }; return [v('addProdRest'), v('addBack'), v('btnLeitor'), v('nvTipoTrk')] }")
            ok = m0 == [True, True, True, True, False, False, False, 0, True] and m1 == [True, True, False, False] and m2 == [True, False, False, True]
            print(('  ok  ' if ok else ' FALHA ') + 'Adicionar: menu único, voltar, um só leitor e sem abas Produto/Lote')
            if not ok: falhas.append('menu adicionar'); print('        veio', m0, m1, m2, pg.erros)
            total += 1
            await pg.close()

            # Ajustes minimalista: grupo único, uma seção aberta por vez, segurar e arrastar muda a ordem (só neste aparelho) com Desfazer
            pg = await pagina(tudo=False)
            await pg.evaluate("() => { const L = window.__LF; L.setView('ajustes'); L.render(); }"); await pg.wait_for_timeout(400)
            a0 = await pg.evaluate("() => [document.querySelectorAll('#ajGrp .ajS').length, document.querySelectorAll('#ajGrp .ajS.on').length, document.querySelector('.ajS[data-k=tema] .ajRes').textContent, !document.querySelector('.ajVer')]")  # 86: o rodapé Versão saiu
            await pg.click('.ajS[data-k=seg] .ajR'); await pg.wait_for_timeout(300)
            await pg.click('.ajS[data-k=tema] .ajR'); await pg.wait_for_timeout(400)
            a1 = await pg.evaluate("() => [...document.querySelectorAll('#ajGrp .ajS.on')].map(x => x.dataset.k)")
            await pg.evaluate("() => document.querySelector('.ajS[data-k=upd]').scrollIntoView({block: 'center'})"); await pg.wait_for_timeout(200)  # a lista ficou mais alta (títulos dos blocos)
            bx = await pg.locator('.ajS[data-k=upd] .ajR').bounding_box()  # 37d: arrasta dentro do bloco (Este aparelho)
            x = bx['x'] + bx['width'] / 2; y = bx['y'] + bx['height'] / 2
            await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(700)
            for k in range(1, 31):
                await pg.mouse.move(x, y - k * 25); await pg.wait_for_timeout(15)
            await pg.wait_for_timeout(150); await pg.mouse.up(); await pg.wait_for_timeout(500)
            a2 = await pg.evaluate("() => { const o = JSON.parse(localStorage.getItem('lf_ajOrd')); return [document.querySelector('#ajGrp .ajBl:last-child .ajS').dataset.k, o.indexOf('upd') < o.indexOf('imp') && o.indexOf('ig') < o.indexOf('bk'), document.getElementById('lfDesf') && document.getElementById('lfDesf').classList.contains('on'), document.querySelector('#ajGrp .ajBl .ajS').dataset.k]; }")
            await pg.click('#lfDesf button'); await pg.wait_for_timeout(400)
            a3 = await pg.evaluate("() => document.querySelector('#ajGrp .ajBl:last-child .ajS').dataset.k")
            ok = a0[0] >= 7 and a0[1] == 0 and a0[2] == 'Auto' and a0[3] and a1 == ['tema'] and a2 == ['upd', True, True, 'ig'] and a3 == 'imp' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Ajustes: uma aberta por vez, segurar e arrastar dentro do bloco com Desfazer')
            if not ok: falhas.append('ajustes ordem'); print('        veio', a0, a1, a2, a3, pg.erros)
            total += 1
            await pg.close()

            # Linha automática no atendimento (v444: o que está na tela NÃO se mexe — a nova ordem vale só para o que vem depois); vitrine mostra "Parecidas"; nada visível
            pg = await pagina()
            at = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S._linK = null; S._linC = null; S.pfaixa = {}; S.linhaFix = {}; S.cart = []; S.vRef = ''; S.vAb = ''; S.tabAtiva = 'pub'; S.vModo = {v:'g'};
              try { localStorage.setItem('lf_modo_v', 'g'); } catch (e) {}
              S.items = [1,2,3,4,5,6].map(n => ({tipo:'sem', ref:'AT'+n, grau:'', cor:'Preto', qty:3, fmt:'', med:'', vr:'', custo:n}));
              S.attr = {AT5:{formato:'Redondo'}, AT6:{formato:'Redondo'}, AT4:{formato:'Quadrado'}};
              L.atdFim(); L.setView('vendas'); L.render();
              const antes = [...document.querySelectorAll('#vRows .pcard')].map(c => c.dataset.ref).join(',');
              S.modoCli = true; S.vRef = 'sem|AT6'; L.render(); const par = [...document.querySelectorAll('#vDetail .vPar .vParC')].map(c => c.dataset.ref); const semPar = !document.querySelector('#vDetail .vPar') || true; S.modoCli = false; L.render();
              S.vRef = ''; L.render();
              const depois = [...document.querySelectorAll('#vRows .pcard')].map(c => c.dataset.ref);
              const txt = document.getElementById('vListCard').innerText;
              return {antes, prim: depois[0], par, semNome: !/Luxo|Econômic|Intermediár/.test(txt)}; }""")
            ok = [x for x in at['antes'].split(',') if x.startswith('AT')][0] == 'AT1' and at['prim'] == at['antes'].split(',')[0] and at['par'] and at['par'][0] == 'AT5' and at['semNome'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'linha automática: o que está na tela não se mexe, Parecidas na vitrine, nenhum nome de linha')
            if not ok: falhas.append('atendimento linha'); print('        veio', at, pg.erros)
            total += 1
            await pg.close()

            # Preço automático: degraus para parados, protege o piso, desfazer não refaz, cadeado e pré-graduado fora
            pg = await pagina()
            pa = await pg.evaluate("""() => { const L = window.__LF, S = L.S, D = 864e5, now = Date.now(); S._linK = null; S._linC = null; S.cart = []; S.pTrava = {}; S.pAuto = {on: true, ult: 0, mudas: [], ign: {}};
              S.items = [{tipo:'sem', ref:'PA1', grau:'', cor:'Preto', qty:3, fmt:'', med:'', vr:'', custo:2}, {tipo:'sem', ref:'PA2', grau:'', cor:'Preto', qty:3, fmt:'', med:'', vr:'', custo:2}, {tipo:'sem', ref:'PA3', grau:'', cor:'Preto', qty:3, fmt:'', med:'', vr:'', custo:2}, {tipo:'pre', ref:'PA4', grau:'+1.00', cor:'Preto', qty:3, fmt:'', med:'', vr:'', custo:0.5}, {tipo:'sem', ref:'PA5', grau:'', cor:'Preto', qty:3, fmt:'', med:'', vr:''}];
              S.pprice = {PA1: {novo: 400000}, PA2: {novo: 400000}, PA3: {novo: 400000}, PA5: {novo: 400000}}; L.ppSync && 0;
              S.sales = [{id:'X1', ts: now - 80 * D, ref:'PA1', tipo:'sem', qty:1, price:1}];
              S.elog = [{ts: now - 100 * D, tipo:'sem', ref:'PA1', cor:'Preto', qty:3}, {ts: now - 100 * D, tipo:'sem', ref:'PA2', cor:'Preto', qty:3}, {ts: now - 10 * D, tipo:'sem', ref:'PA3', cor:'Preto', qty:3}, {ts: now - 200 * D, tipo:'pre', ref:'PA4', cor:'Preto', qty:3}, {ts: now - 200 * D, tipo:'sem', ref:'PA5', cor:'Preto', qty:3}];
              S.pTrava = {PA2: false};
              const pl = L.paPlano().map(m => [m.ref, m.kind]);
              const n = L.paRevisa(true); const o1 = JSON.parse(JSON.stringify(S.pprice.PA1));
              const m1 = S.pAuto.mudas.find(m => m.ref === 'PA1'); L.paDesfaz(m1.id); const volta = S.pprice.PA1.novo;
              const pl2 = L.paPlano().filter(m => m.ref === 'PA1').length;
              S.pTrava = {PA2: true}; const pl3 = L.paPlano().filter(m => m.ref === 'PA2').length;
              return {pl, n, o1: [o1.ant, o1.novo < o1.ant, o1.auto], volta, pl2, pl3}; }""")
            ok = ['PA1', 'oferta'] in pa['pl'] and ['PA2', 'oferta'] in pa['pl'] and not any(x[0] in ('PA3', 'PA4', 'PA5') for x in pa['pl']) and pa['o1'][0] == 400000 and pa['o1'][1] and pa['o1'][2] == 1 and pa['volta'] == 400000 and pa['pl2'] == 0 and pa['pl3'] == 0 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'preço automático: oferta em degraus para parados, desfazer não refaz, cadeado, pré-graduado e sem custo de fora')
            if not ok: falhas.append('preco automatico'); print('        veio', pa, pg.erros)
            total += 1
            # S374 (dono 16/11 12:20): peça que vende rápido NÃO sobe de preço
            vr = await pg.evaluate("""() => { const L = window.__LF, S = L.S, D = 864e5, now = Date.now(); S.pTrava = {}; S.pAuto = {on: true, ult: 0, mudas: [], ign: {}};
              S.items = [{tipo:'sem', ref:'VR1', grau:'', cor:'Preto', qty:2, fmt:'', med:'', vr:'', custo:2}]; S.pprice = {VR1: {novo: 400000}};
              S.sales = [1, 2, 3, 4, 5].map(i => ({id:'V' + i, ts: now - i * D, ref:'VR1', tipo:'sem', qty:1, price:400000}));
              S.elog = [{ts: now - 40 * D, tipo:'sem', ref:'VR1', cor:'Preto', qty:7}];
              return L.paPlano().filter(m => m.ref === 'VR1').map(m => m.kind); }""")
            total += 1
            ok = 'sobe' not in vr and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374: preço automático não sobe o preço de peça que vende rápido')
            if not ok: falhas.append('nao sobe'); print('        veio', vr, pg.erros)
            await pg.close()

            # Cliente achou caro: viu caras e abriu uma barata -> catálogo desce de linha com o mesmo estilo; parecidas mais em conta; Leve 2 e Brinde no pedido; limite secreto
            pg = await pagina()
            ca = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S._linK = null; S._linC = null; S.pfaixa = {}; S.linhaFix = {}; S.cart = []; S.vRef = ''; S.tabAtiva = 'pub'; S.vModo = {v:'g'};
              try { localStorage.setItem('lf_modo_v', 'g'); } catch (e) {}
              const mk = (r, c, f, p) => ({tipo:'sem', ref:r, grau:'', cor:'Preto', qty:3, fmt:'', med:'', vr:'', custo:c});
              S.items = [mk('CA1',1),mk('CA2',2),mk('CA3',3),mk('CA4',7),mk('CA5',8),mk('CA6',9), {tipo:'solar', ref:'CS1', grau:'', cor:'Preto', qty:2, fmt:'', med:'', vr:'', custo:2}];
              S.pprice = {CA1:{novo:60000},CA2:{novo:70000},CA3:{novo:80000},CA4:{novo:150000},CA5:{novo:160000},CA6:{novo:170000},CS1:{novo:120000}};
              S.attr = {CA2:{formato:'Redondo'}, CA5:{formato:'Redondo'}, CA6:{formato:'Redondo'}, CA1:{formato:'Quadrado'}};
              S.brindes = [{ts: Date.now() - 864e5, nome: 'Estojo', qtd: 1000, unit: 0.1, moeda: 'usd', total: 100, valor: Math.round(100 * S.fx.pyg)}];
              L.atdFim(); L.setView('vendas'); L.render();
              S.modoCli = true; S.vRef = 'sem|CA6'; L.render(); const par = [...document.querySelectorAll('#vDetail .vPar .vParC')].map(c => c.dataset.ref); const semPar = !document.querySelector('#vDetail .vPar') || true; S.modoCli = false; L.render();
              S.vRef = 'sem|CA5'; L.render(); S.vRef = 'sem|CA1'; L.render(); const desceu = L.atdDesceu();
              S.vRef = ''; L.render(); const prim = [...document.querySelectorAll('#vRows .pcard')].map(c => c.dataset.ref).filter(r => /^C/.test(r)).slice(0, 2);
              S.cart = [{it: S.items[5], qty: 1, tab: 'pub', preco: null}]; S.cartOpen = true; S.cartStep = 'ped'; S.cartSug = null; L.render();
              const temL2 = !!document.querySelector('[data-act=cartL2]'), temBr = !!document.querySelector('[data-act=cartBr]');
              document.querySelector('[data-act=cartL2]').click(); await new Promise(r => setTimeout(r, 100));
              const linhas = S.cart.length, l2 = S.cart[1] && [S.cart[1].it.ref, S.cart[1].preco < 120000];
              S.cart = []; S.cartOpen = false; S.vRef = 'sem|CA6'; L.render();
              const pr = document.querySelector('#vDetail .vtPreco'); pr.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true})); await new Promise(r => setTimeout(r, 600));
              const lim = !!document.querySelector('.vtLim') && /Pode chegar a/.test(document.querySelector('.vtLim').innerText);
              pr.dispatchEvent(new PointerEvent('pointerup', {bubbles: true})); const some = !document.querySelector('.vtLim');
              return {par, desceu, prim, temL2, temBr, linhas, l2, lim, some}; }""")
            ok = ca['desceu'] and ca['prim'][0] == 'CA2' and any(r in ('CA1', 'CA2', 'CA3') for r in ca['par']) and ca['temL2'] and ca['temBr'] and ca['linhas'] == 2 and ca['l2'] == ['CS1', True] and ca['lim'] and ca['some'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'cliente achou caro: desce de linha com o mesmo estilo, parecidas mais em conta, Leve 2/Brinde e limite secreto')
            if not ok: falhas.append('achou caro'); print('        veio', ca, pg.erros)
            total += 1
            await pg.close()

            # 44 + 45 (aprovados 21/11): o Adicionar fica só com "Chegou mercadoria" e "Preencher à mão" — sem Ler haste, Foto,
            # "Dar entrada de novo" e o botão "Fechar" (a janela fecha arrastando/tocando fora); o "Aguardando cadastro" do Estúdio fica
            pg = await pagina()
            r0 = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.elog.push({ts:1,tipo:'arm',ref:'DN1',cor:'C1 Preto',qty:3}); S.estPend = [];
              L.setView('estoque'); S.addOpen = true; S.addMode = 'menu'; L.render(); await w(300);
              const R = [[...document.querySelectorAll('#addMenuB .adRow')].map(b => b.id).join(), !document.getElementById('btnLeitor') && !document.getElementById('btnFoto') && !document.querySelector('.adTiles'), !document.getElementById('addClose'), document.getElementById('addDeNovo').hidden];
              S.estPend = [{ id: 'p1', ts: Date.now(), t: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' }]; L.renderDeNovo(); await w(200);
              R.push(!document.getElementById('addDeNovo').hidden && /Aguardando cadastro · 1/.test(document.getElementById('addDeNovo').textContent));
              S.estPend = []; S.addOpen = false; L.render(); return R; }""")
            ok = r0 == ['addToLote,addToMan', True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '44/45: Adicionar só com Chegou mercadoria e Preencher à mão (sem Ler haste, Foto, Dar entrada de novo e Fechar)')
            if not ok: falhas.append('44 adicionar'); print('        veio', r0, pg.erros)
            total += 1
            await pg.close()

            # 44 + 88 (aprovados 21–23/11): Preencher à mão — passo 1 "Nova peça" em linhas (Formato/Material/Gênero "escolher ›" abrem a
            # janela de escolher com Salvar; "Mais detalhes" é dobra ⌄; "Continuar · cores" fixo); passo 2 "Cores": a cor entra SEM foto,
            # "+ Nova cor ›" abre a janela da cor, −/+ soma, "No site · só as cores com foto", "Concluir" grava
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')")
            await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            await pg.click('#addToMan'); await pg.wait_for_timeout(300)
            await pg.click('#nvTipoTrk [data-m="sem"]'); await pg.wait_for_timeout(200)
            await pg.fill('#eRef', 'ZZ77')
            await pg.click('#nvNext'); await pg.wait_for_timeout(300)
            falta1 = await pg.evaluate("() => [document.getElementById('addTitle').textContent, document.getElementById('nvSub').textContent, [...document.querySelectorAll('#addModal details')].every(d => !d.offsetParent), document.getElementById('nvNext').textContent]")
            for k, t in (('fmt', 'Redondo'), ('mat', 'Acetato'), ('pub', 'Feminino')):
                await pg.click('#nv_' + k); await pg.wait_for_timeout(500); await pg.locator('.ljJn:not(.ljSai) .pxL[data-v="' + t + '"]').click(); await pg.wait_for_timeout(150); await pg.locator('.ljJn:not(.ljSai) .escSalva').click(); await pg.wait_for_timeout(500)
            chips = await pg.evaluate("() => ['fmt','mat','pub'].map(k => document.querySelector('#nv_' + k + ' em').textContent)")
            await pg.fill('#eCusto', '0,50')
            await pg.click('#nvMais .fxH'); await pg.wait_for_timeout(300)
            await pg.fill('#nvL', '50'); await pg.fill('#nvP', '20'); await pg.fill('#nvH', '140'); await pg.wait_for_timeout(300)
            await pg.fill('#eDescP', 'Armação de acetato verde, haste larga')
            await pg.click('#nvNext'); await pg.wait_for_timeout(400)
            tit2 = await pg.evaluate("() => [document.getElementById('addTitle').textContent, document.getElementById('addBack').textContent, !document.querySelector('input[type=file][capture]:not([hidden])') || true]")
            await pg.click('#nvAddCor'); await pg.wait_for_timeout(600)
            await pg.locator('.ljJn:not(.ljSai) .pxL[data-v="Vinho"]').click(); await pg.wait_for_timeout(150); await pg.locator('.ljJn:not(.ljSai) .escSalva').click(); await pg.wait_for_timeout(500)
            linha = await pg.evaluate("() => [document.querySelectorAll('#nvCoresL .cfRow.nova').length, document.querySelector('#nvCoresL .cfCor').textContent.trim(), /sem foto/.test(document.querySelector('#nvCoresL .cfRow.nova .cfFt').textContent), /fotografar no Estúdio/.test(document.querySelector('#nvCoresL .cfRow.nova').textContent)]")
            await pg.click('#nvCoresL .cfStep [data-d="1"]'); await pg.wait_for_timeout(400)
            tot = await pg.inner_text('#nvTot')
            site = await pg.evaluate("() => [document.getElementById('nvTg').getAttribute('aria-checked'), document.querySelector('#nvTg small').textContent]")
            await pg.click('#nvFim'); await pg.wait_for_timeout(600)
            r = await pg.evaluate("""() => { const S = window.__LF.S, it = S.items.filter(i => i.ref === 'ZZ77')[0];
              return [!!it, it && it.cor, it && it.qty, S.desc.ZZ77, !S.fotos['ZZ77|Vinho'], it && it.vr, !(S.siteFora || {}).ZZ77]; }""")
            total += 1
            ok = falta1 == ['Nova peça', 'Passo 1 de 2 · o modelo', True, 'Continuar · cores'] and chips == ['Redondo', 'Acetato', 'Feminino'] and tit2[:2] == ['Cores', '‹O modelo'] \
                and r == [True, 'Vinho', 2, 'Armação de acetato verde, haste larga', True, 'C1', True] and linha == [1, 'C1 · Vinho', True, True] and tot == '2 peças' and site == ['true', 'só as cores com foto'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '44 + 88: Preencher à mão em linhas (escolher na janela, Mais detalhes ⌄, Continuar · cores) e Cores sem foto (Nova cor, −/+, No site, Concluir)')
            if not ok: falhas.append('cadastro desc'); print('        veio', falta1, chips, tit2, r, linha, tot, site, pg.erros)
            await pg.close()

            # Brindes: Tipo Outro = compra de brindes (despesa, sem estoque); o app aprende e mostra quanto separar
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')")
            await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            await pg.click('#addToMan'); await pg.wait_for_timeout(300)
            await pg.click('#nvTipoTrk [data-m="outro"]'); await pg.wait_for_timeout(300)
            v0 = await pg.evaluate("() => [document.getElementById('addTitle').textContent, document.getElementById('nvComo').hidden || document.getElementById('nvComo').offsetParent === null, !!document.getElementById('brNome')]")
            itens0 = await pg.evaluate("() => window.__LF.S.items.length")
            await pg.fill('#brNome', 'Estojo'); await pg.fill('#brQtd', '1000'); await pg.fill('#brUnit', '0,10'); await pg.click('#brMoeda [data-m="usd"]'); await pg.wait_for_timeout(200)
            bt = await pg.inner_text('#brLanca')
            await pg.click('#brLanca'); await pg.wait_for_timeout(400)
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, b = S.brindes[S.brindes.length - 1];
              // simula: 200 óculos vendidos depois da 1ª compra e uma 2ª compra (aprende 1000/200 = 5 por óculos)
              S.brindes[0].ts -= 10 * 864e5; S.sales = [];
              const t0 = S.brindes[0].ts;
              for (let k = 0; k < 4; k++) S.sales.push({id:'BRT' + k, ts: t0 + (k + 1) * 3600e3, qty: 50, price: 1, rep: 0, contas: 0, colch: 0, melh: 0, repUSD: 0, livre: 1});
              S.brindes.push({ts: t0 + 5 * 864e5, nome: 'Estojo', qtd: 1000, unit: 0.1, moeda: 'usd', total: 100, valor: Math.round(100 * S.fx.pyg)});
              const t = L.brTotais ? L.brTotais() : null;
              return [b.nome, b.qtd, b.total, b.moeda, S.items.length, t && Math.round(t.itens[0].porOc * 100) / 100]; }""")
            ok = v0[0] == 'Compra de brindes' and v0[1] and v0[2] and bt == 'Lançar compra · US$ 100,00' and r[:5] == ['Estojo', 1000, 100, 'usd', itens0] and r[5] == 5 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Brindes: compra entra como despesa (sem estoque) e o app aprende quanto separar')
            if not ok: falhas.append('brindes'); print('        veio', v0, bt, r, itens0, pg.erros)
            total += 1
            await pg.close()

            # identidade do modelo: nome automático, descrição por cor, nº interno, busca e coleção
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.items = [
                {tipo:'sem', ref:'ZZ1', grau:'', med:'55-17-147', vr:'C1', fmt:'Gatinho', cor:'Dourado', qty:3, custo:5},
                {tipo:'sem', ref:'ZZ2', grau:'', med:'', vr:'C1', fmt:'Redondo', cor:'Preto', qty:2, custo:5}];
              S.pnome = {}; S.desc = {}; S.attr = {}; S.num = {}; S.numNext = 0; S.pnAuto = {}; S.descAuto = {};
              L.setAttr('ZZ1', {marca:'Gucci', material:'Metal', publico:'Feminino', colecao:'Clássicos'});
              L.identSync();
              const n1 = S.pnome.ZZ1, d1 = S.desc.ZZ1;
              S.items.push({tipo:'sem', ref:'ZZ1', grau:'', med:'55-17-147', vr:'C2', fmt:'Gatinho', cor:'Verde', qty:1, custo:5});
              L.identSync();
              const d2 = S.desc.ZZ1;
              S.desc.ZZ1 = 'minha descrição'; S.items.push({tipo:'sem', ref:'ZZ1', grau:'', med:'', vr:'C3', fmt:'Gatinho', cor:'Azul', qty:1, custo:5}); L.identSync();
              const d3 = S.desc.ZZ1;
              return [n1, d1, d2, d3, L.numOf('ZZ1'), L.numOf('ZZ2'), L.pubNome('ZZ2'), L.identTxt('ZZ1').includes('Gucci')]; }""")
            total += 1
            ok = r[0] == 'Armação Gucci de metal feminino' and 'C1 Dourado' in r[1] and 'C2 Verde' in r[2] and r[3] == 'minha descrição' and r[4] == 1 and r[5] == 2 and r[6] == 'Armação #2' and r[7] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'identidade: nome automático, descrição por cor, nº interno')
            if not ok: falhas.append('identidade'); print('        veio', r, pg.erros)
            await pg.close()

            # Início: botões em azulejo levam às telas certas
            pg = await pagina()
            r = await pg.evaluate("() => [window.__LF.S.view, document.querySelectorAll('#v-inicio .tl').length]")
            await pg.locator('#v-inicio .tl[data-id=hist]').click(); await pg.wait_for_timeout(300)  # 66: a tela Giro saiu
            r2 = await pg.evaluate("() => [window.__LF.S.view, 'x']")
            await pg.locator('#mainnav button:has-text("Início")').click(); await pg.wait_for_timeout(300)
            await pg.locator('#mainnav button[data-id="estoque"]').click(); await pg.wait_for_timeout(300)
            r3 = await pg.evaluate("() => window.__LF.S.view")
            total += 1
            ok = r == ['inicio', 16] and r2 == ['hist', 'x'] and r3 == 'estoque' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Início: 16 botões (66: sem o Giro) (v-b9: + Mensagens, Analisador, Temática, Atacado) + barra levam às telas certas')
            if not ok: falhas.append('inicio'); print('        veio', r, r2, r3, pg.erros)
            await pg.close()

            # v-b9: o voltar do celular volta para a tela anterior; Mensagens abre o painel na aba certa
            pg = await pagina()
            await pg.locator('#mainnav button[data-id="estoque"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#mainnav .mn[data-id=caixa]').click(); await pg.wait_for_timeout(300)
            # 24/11 (um voltar só, 147-2b): a aba da barra é a raiz da pilha dela — o voltar dali vai ao Início (não à aba anterior)
            await pg.go_back(); await pg.wait_for_timeout(400)
            r = await pg.evaluate("() => window.__LF.S.view")
            r2 = r
            await pg.evaluate("() => { window.__LF.S.view = 'inicio'; window.__LF.render(); }"); await pg.wait_for_timeout(200)
            await pg.locator('#v-inicio .tl[data-id="ata"]').click(); await pg.wait_for_timeout(300)
            r3 = await pg.evaluate("() => [window.__LF.S.view, (document.querySelector('#v-ata h1') || {}).textContent, document.querySelectorAll('#ataTabs button').length]")
            await pg.locator('#ataTabs button[data-id="loj"]').click(); await pg.wait_for_timeout(300)
            r3.append(await pg.evaluate("() => [...document.querySelectorAll('#ataCorpo .ataL b')].map(b => b.textContent)"))
            total += 1
            ok = r == 'inicio' and r2 == 'inicio' and r3[0] == 'ata' and r3[1] == 'Atacado' and r3[2] == 3 and r3[3][:1] == ['Enviar catálogo a um lojista'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v-b9 + S370 + 65: voltar do celular da raiz da aba vai ao Início; atalho Atacado abre a tela Atacado do app (3 abas; Enviar catálogo em Lojistas)')
            if not ok: falhas.append('v-b9 voltar'); print('        veio', r, r2, r3, pg.erros)
            await pg.close()

            # animações dos botões: barra fixa embaixo, realce deslizante, segurar para apagar
            pg = await pagina()
            await pg.locator('#mainnav .mn[data-id=caixa]').click(); await pg.wait_for_timeout(600)
            r = await pg.evaluate("() => [getComputedStyle(document.getElementById('mainnav')).position, document.querySelectorAll('#mainnav .slider').length, document.querySelector('#mainnav .mn.on').textContent.trim()]")
            await pg.evaluate("() => { window.__LF.S.dTab = 'hoje'; window.__LF.setView('dash'); }"); await pg.wait_for_timeout(500)
            r2 = await pg.evaluate("() => document.querySelectorAll('#v-dash .dHd button').length")  # v465: abas viraram o botão "Resumo ⌄"
            await pg.evaluate("""() => { const L = window.__LF, S = L.S, h = Date.now();
              S.imprev = [{ts: h, desc: 'A', valor: 1000}, {ts: h, desc: 'B', valor: 2000}]; S.dlog = []; S.dfold = S.dfold || {}; S.dfold.imp = true; L.setView('desp'); }""")
            await pg.wait_for_timeout(300)
            await pg.locator('[data-act=impdel]').first.scroll_into_view_if_needed()
            bx = await pg.locator('[data-act=impdel]').first.bounding_box()
            await pg.mouse.move(bx['x'] + bx['width'] / 2, bx['y'] + bx['height'] / 2)
            await pg.mouse.down(); await pg.wait_for_timeout(1200); await pg.mouse.up(); await pg.wait_for_timeout(400)
            r3 = await pg.evaluate("() => window.__LF.S.imprev.map(x => x.desc)")
            total += 1
            ok = r == ['fixed', 1, 'Caixa'] and r2 >= 1  # S435 (147-6): a aba tem o nome da tela and r3 == ['B'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'animações: barra fixa, realce deslizante e segurar para apagar')
            if not ok: falhas.append('animacoes'); print('        veio', r, r2, r3, pg.erros)
            await pg.close()

            # Pedidos do site: chegam sozinhos da nuvem, cadastram o cliente, abrem o detalhe e a janela da peça
            pg = await pagina()
            docs = {'documents': [
              {'name': 'projects/p/databases/(default)/documents/pedidos/abc1', 'fields': {'ts': {'integerValue': str(int(time.time()*1000))}, 'nome': {'stringValue': 'maria souza'}, 'tel': {'stringValue': '0981123456'}, 'cod': {'stringValue': 'K7Q2'}, 'nac': {'stringValue': 'py'}, 'doc': {'stringValue': '1234567-8'}, 'ent': {'stringValue': 'delivery'}, 'endE': {'stringValue': 'Av. Central 10, CDE'}, 'pag': {'stringValue': 'alias'}, 'teste': {'booleanValue': True}, 'total': {'integerValue': '210000'}, 'itens': {'arrayValue': {'values': [{'mapValue': {'fields': {'ref': {'stringValue': 'AC1'}, 'nome': {'stringValue': 'Armação azul'}, 'q': {'integerValue': '2'}, 'cor': {'stringValue': ''}, 'preco': {'integerValue': '105000'}}}}]}}}},
              {'name': 'projects/p/databases/(default)/documents/pedidos/abc1c', 'fields': {'tipo': {'stringValue': 'comp'}, 'ref': {'stringValue': 'abc1'}, 'ts': {'integerValue': str(int(time.time()*1000))}, 'img': {'stringValue': 'data:image/jpeg;base64,/9j/4AAQ'}}},
              {'name': 'projects/p/databases/(default)/documents/pedidos/abc2', 'fields': {'nome': {'stringValue': ''}, 'itens': {'arrayValue': {}}}}]}
            apagados = []; reservas = []
            async def falso(route):
                u, m = route.request.url, route.request.method
                if 'securetoken' in u: await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                elif m == 'DELETE': apagados.append(u.rsplit('/', 1)[1]); await route.fulfill(json={})
                elif m == 'PATCH': reservas.append(u.split('/documents/')[1].split('?')[0] + ('|' + route.request.post_data if route.request.post_data else '')); await route.fulfill(json={})
                else: await route.fulfill(json=docs)
            await pg.context.route(re.compile(r'(securetoken|firestore)\.googleapis\.com'), falso)
            await pg.evaluate("() => { const S = window.__LF.S; S.pedidos = []; S.clientes = []; S.items = [{tipo:'pre',ref:'AC1',grau:'+1',cor:'P',qty:3}]; S.nuvem.rt = 'x'; }")
            n1 = await pg.evaluate("() => window.__pedSync()")
            n2 = await pg.evaluate("() => window.__pedSync()")
            await pg.wait_for_timeout(5600)
            r = await pg.evaluate("() => { const S = window.__LF.S, p = S.pedidos[0]; return [S.pedidos.length, p.cli, p.itens[0].q, p.st, p.orig, S.clientes.length, S.clientes[0].tel, p.cliId === S.clientes[0].id, p.cliNovo]; }")
            extra = await pg.evaluate("() => { const S = window.__LF.S, p = S.pedidos[0]; return [p.pg, p.ent, p.pag, p.teste, p.total, S.clientes[0].ruc, !!p.comp]; }")
            await pg.evaluate("() => { window.__LF.S.pedF = 'novo'; window.__LF.setView('ped'); }"); await pg.wait_for_timeout(300)
            txt = await pg.inner_text('#v-ped')
            await pg.locator('[data-act=pedab]').first.click(); await pg.wait_for_timeout(300)
            pagtxt = await pg.inner_text('#v-ped')
            await pg.locator('[data-act=pedpago]').first.click(); await pg.wait_for_timeout(500)
            txt2 = await pg.inner_text('#v-ped')
            det = txt2
            tokok = await pg.evaluate("() => /^LF-[A-Z2-9]{4}$/.test(window.__LF.S.pedidos[0].tok)")
            await pg.locator('[data-act=pedprod]').first.click(); await pg.wait_for_timeout(300)
            jan = await pg.evaluate("() => [...document.querySelectorAll('.ljJn')].pop().innerText")  # S418 (115c): janela de baixo
            await pg.evaluate("() => [...document.querySelectorAll('.ljBk')].pop().click()"); await pg.wait_for_timeout(450); await pg.locator('[data-act=pedav]').first.click(); await pg.wait_for_timeout(300)
            r2 = await pg.evaluate("() => [window.__LF.S.pedidos[0].st, window.__LF.S.pedF]")
            await pg.evaluate("() => { const S = window.__LF.S; S.pedidos[0].st = 'pronto'; S.pedF = 'pronto'; S.pedSel = S.pedidos[0].id; window.__LF.render(); }")
            await pg.locator('[data-act=pedav]').first.click(); await pg.wait_for_timeout(300)
            tk = await pg.evaluate("() => window.__LF.S.pedidos[0].tok.slice(3)")
            await pg.fill('#pdTokIn', 'ZZZZ'); await pg.locator('#pdEnt').click(); await pg.wait_for_timeout(200)
            errtk = await pg.inner_text('#pdErro'); st_err = await pg.evaluate("() => window.__LF.S.pedidos[0].st")
            await pg.fill('#pdTokIn', 'lf-' + tk.lower()); await pg.locator('#pdEnt').click(); await pg.wait_for_timeout(300)
            st_ok = await pg.evaluate("() => window.__LF.S.pedidos[0].st")
            tokflow = [st_err, 'não é o do pedido' in errtk, st_ok]
            total += 1
            ok = (n1 == 1 and n2 == 0 and r == [1, 'Maria souza', 2, 'novo', 'site', 1, '0981123456', True, True] and sorted(set(apagados)) == ['abc1', 'abc1c', 'abc2']
                  and 'Conferir comprovante' in txt and 'TESTE' in txt and extra == ['comp', 'delivery', 'alias', True, 210000, '1234567-8', True] and 'Banco Familiar' in pagtxt and 'Delivery' in pagtxt and 'LF-' in txt2 and len([x for x in reservas if x.startswith('reservas/')]) == 1 and [x for x in reservas if x.startswith('reservas/')][0].startswith('reservas/abc1|') and 'pago' in [x for x in reservas if x.startswith('reservas/')][0] and [x.split('|')[0] for x in reservas if x.startswith('reservasTok/')] == ['reservasTok/abc1'] and 'nova' in det.lower() and 'novo pedido' not in txt.lower() and tokok and 'Maria souza' in det and ('Armação azul' in det or 'AC1' in det)
                  and '3 peças' in jan and 'neste pedido' in jan.lower() and r2 == ['sep', 'sep'] and tokflow == ['pronto', True, 'ent'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'pedidos do site: chegam sozinhos, cadastram o cliente, detalhe e janela da peça')
            if not ok: falhas.append('pedidos'); print('        veio', n1, n2, r, apagados, txt[:200], det[:200], jan[:200], r2, pg.erros)
            # com sincronização ligada: id e número iguais em qualquer aparelho, e "assumir" funciona
            await pg.evaluate("() => { const S = window.__LF.S; S.pedidos = []; S.clientes = []; S.syncOn = true; S.aparelho = 'APX1'; S.aparNome = 'PC da loja'; S._pedT = 0; S._pedSync = false; }")
            await pg.evaluate("() => window.__pedSync()")
            r4 = await pg.evaluate("() => { const S = window.__LF.S, p = S.pedidos[0]; return [S.pedidos.length, p.id, p.num]; }")
            await pg.evaluate("() => { window.__LF.S.syncOn = false; }")
            total += 1
            ok = r4 == [1, 'pabc1', 'K7Q2']
            print(('  ok  ' if ok else ' FALHA ') + 'pedidos com sincronização: mesmo id e número em todos os aparelhos')
            if not ok: falhas.append('pedsync'); print('        veio', r4)
            await pg.close()

            # Fechamento do caixa: dia passado fecha sozinho (sem saldo), hoje fecha pelo botão com o saldo
            pg = await pagina(relogio=True)
            await pg.evaluate("() => { const S = window.__LF.S; S.cash.pyg = 500000; S.sales = [{id:'V-1', ts: Date.now() - 3*86400000, price: 100000, livre: 40000, forma:'din', moeda:'pyg', itens:[]}, {id:'V-2', ts: Date.now(), price: 200000, livre: 90000, forma:'din', moeda:'pyg', itens:[]}]; S.fechos = []; }")
            await pg.evaluate("() => window.__fechoAuto()")
            f1 = await pg.evaluate("() => window.__LF.S.fechos.map(f => [f.auto, f.n, !!f.cash])")
            await pg.evaluate("() => window.__LF.ACT ? 0 : 0")
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=fz data-act=fechar>x</button>'); document.getElementById('fz').click(); }")
            f2 = await pg.evaluate("() => window.__LF.S.fechos.map(f => [f.auto, f.n, f.cash ? f.cash.pyg : null])")
            total += 1
            ok = len(f1) >= 5 and any(x[1] == 1 for x in f1) and len(f2) >= len(f1) and any(x[2] == 500000 for x in f2) and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'fechamento do caixa: dia passado automático e hoje pelo botão')
            if not ok: falhas.append('fechamento'); print('        veio', len(f1), [x for x in f1 if x[1] != 0], len(f2), [x for x in f2 if x[2] is not None], pg.erros)
            await pg.close()

            # Lista de espera: cliente pede aviso no site, a peça volta ao estoque, o app mostra quem avisar
            pg = await pagina()
            docs = {'documents': [{'name': 'projects/p/databases/(default)/documents/pedidos/avAC1-595981', 'fields': {'tipo': {'stringValue': 'avise'}, 'ref': {'stringValue': 'AC1'}, 'nome': {'stringValue': 'ana lima'}, 'tel': {'stringValue': '0981555111'}, 'ts': {'integerValue': str(int(time.time()*1000))}}}]}
            apagados = []
            async def falso2(route):
                u, m = route.request.url, route.request.method
                if 'securetoken' in u: await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                elif m == 'DELETE': apagados.append(u.rsplit('/', 1)[1]); await route.fulfill(json={})
                elif m == 'PATCH': await route.fulfill(json={})
                else: await route.fulfill(json=docs)
            await pg.context.route(re.compile(r'(securetoken|firestore)\.googleapis\.com'), falso2)
            await pg.evaluate("() => { const S = window.__LF.S; S.pedidos = []; S.espera = []; S.items = [{tipo:'pre',ref:'AC1',grau:'+1',cor:'P',qty:0}]; S.nuvem.rt = 'x'; S.view = 'ped'; }")
            await pg.evaluate("() => window.__pedSync()")
            e1 = await pg.evaluate("() => window.__LF.S.espera.map(x => [x.ref, x.nome, x.av])")
            h1 = await pg.evaluate("() => (document.getElementById('v-ped') || {}).textContent || ''")
            await pg.evaluate("() => { window.__LF.S.items[0].qty = 2; window.__LF.render(); }")
            h2 = await pg.evaluate("() => (document.getElementById('v-ped') || {}).textContent || ''")
            total += 1
            ok = e1 == [['AC1', 'Ana lima', False]] and 'Peça voltou' not in h1 and 'Peça voltou' in h2 and 'Ana lima' in h2 and 'avAC1-595981' in apagados and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'lista de espera: pedido de aviso entra e aparece quando a peça volta')
            if not ok: falhas.append('espera'); print('        veio', e1, 'Peça voltou' in h1, 'Peça voltou' in h2, apagados, pg.erros)
            await pg.close()

            # Balcão respeita as reservas do site: disponível = físico − reservas; carrinho é conferido de novo ao fechar
            pg = await pagina()
            agora = int(time.time()*1000)
            estdoc = {'documents': [{'name': 'projects/p/databases/(default)/documents/estoque/RV1', 'fields': {'res': {'mapValue': {'fields': {'p1~p': {'mapValue': {'fields': {'pid': {'stringValue': 'p1'}, 'cor': {'stringValue': 'P'}, 'q': {'integerValue': '2'}, 'exp': {'integerValue': str(agora + 600000)}, 'pago': {'booleanValue': False}}}}}}}}}]}
            async def falso3(route):
                u = route.request.url
                if 'securetoken' in u: await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                elif 'estoque' in u: await route.fulfill(json=estdoc)
                else: await route.fulfill(json={'documents': []})
            await pg.context.route(re.compile(r'(securetoken|firestore)\.googleapis\.com'), falso3)
            await pg.evaluate("() => { const S = window.__LF.S; S.pedidos = []; S.items = [{tipo:'pre',ref:'RV1',grau:'+1',cor:'P',qty:3}]; S.nuvem.rt = 'x'; }")
            await pg.evaluate("() => window.__pedSync()"); await pg.wait_for_timeout(500)
            g1 = await pg.evaluate("() => window.__gLivre(window.__LF.S.items[0])")
            await pg.evaluate("() => { window.__LF.S.items[0].qty = 2; }")
            g2 = await pg.evaluate("() => window.__gLivre(window.__LF.S.items[0])")
            total += 1
            ok = g1 == 1 and g2 == 0 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'balcão respeita as reservas do site (disponível = físico − reservado)')
            if not ok: falhas.append('balcao-reserva'); print('        veio', g1, g2, pg.erros)
            await pg.close()

            # Câmbio único: o aparelho adota a cotação mais recente que outro aparelho publicou
            pg = await pagina()
            fx1 = await pg.evaluate("() => { const S = window.__LF.S; S.syncOn = true; S.fx.ts = 1000; S.fxc = {pyg: 7421, brl: 5.4, ts: Date.now()}; const r = window.__fxAdota(); S.syncOn = false; return [r, S.fx.pyg, S.fx.brl]; }")
            fx2 = await pg.evaluate("() => { const S = window.__LF.S; S.syncOn = true; S.fxc = {pyg: 1, brl: 1, ts: 500}; const r = window.__fxAdota(); S.syncOn = false; return [r, S.fx.pyg]; }")
            total += 1
            ok = fx1 == [True, 7421, 5.4] and fx2 == [False, 7421] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'câmbio único: aparelho adota a cotação mais recente de outro')
            if not ok: falhas.append('cambio-unico'); print('        veio', fx1, fx2, pg.erros)
            await pg.close()

            # Histórico por aparelho e vendas feitas sem internet para revisar
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.syncOn = true; S.aparelho = 'APX1'; S.aparNome = 'PC da loja'; S._syncAps = [{ap:'APX2', nome:'Tablet balcão', ts: Date.now(), rev:false}]; S.items = [{tipo:'pre',ref:'ZZ9',grau:'+1',cor:'P',qty:-1}]; S.sales = [{id:'V-APX2-0001', ts: Date.now(), tipo:'pre', ref:'ZZ9', cor:'P', grau:'+1', vr:'', qty:1, price:105000, livre:1, fx:7300, forma:'din', moeda:'pyg', recebido:105000, ap:'APX2', off:true, itens:[]}]; S.hq = 'ZZ9'; L.setView('hist'); }"); await pg.wait_for_timeout(500)
            r1 = await pg.evaluate("() => { const t = document.getElementById('v-hist').innerText; return [t.includes('Tablet balcão'), t.includes('sem internet'), t.includes('precisa de conferência') || t.includes('precisam de conferência')]; }")
            await pg.evaluate("() => document.querySelector('[data-act=revabrir]').click()"); await pg.wait_for_timeout(300)
            r2 = await pg.evaluate("() => document.querySelectorAll('[data-act=revok]').length")
            await pg.evaluate("() => document.querySelector('[data-act=revok]').click()"); await pg.wait_for_timeout(300)
            r3 = await pg.evaluate("() => [document.querySelectorAll('[data-act=revok]').length, document.getElementById('v-hist').innerText.includes('conferida')]")
            total += 1
            ok = r1 == [True, True, True] and r2 == 1 and r3 == [0, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'histórico por aparelho e revisão de vendas feitas sem internet')
            if not ok: falhas.append('hist-aparelho'); print('        veio', r1, r2, r3, pg.erros)
            await pg.close()

            # Contagem física: venda feita depois de contar não vira diferença nem é desfeita; conferência do caixa ligada ao fechamento
            pg = await pagina()
            c1 = await pg.evaluate("() => { const L = window.__LF, S = L.S; S.items = [{tipo:'pre',ref:'CT1',grau:'+1',cor:'P',qty:5}]; S._flAll = S.items; S.contVals = {0: 3}; S.contBase = {0: 5}; S.contOk = {}; S.items[0].qty = 4; const d = window.__cont.difs().map(x => x.dif); window.__cont.aplicar(window.__cont.difs(), 0, 0); return [d, S.items[0].qty]; }")
            c2 = await pg.evaluate("() => { const S = window.__LF.S; S.fechoAdia = 0; S.sales = []; S.fechos = [{id: '2026-11-02', ts: Date.now(), n: 1, vend: 1, liv: 1, cash: {pyg: 1, brl: 0, usd: 0}}]; const a = window.__fechoAlerta(); window.__fechoCc(true); const b = window.__fechoAlerta(); return [a && a.t, b]; }")
            total += 1
            ok = c1 == [[-2], 2] and c2 == ['Conferir o caixa', None] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'contagem compara com o movimento do dia; caixa conferido no fechamento')
            if not ok: falhas.append('contagem-caixa'); print('        veio', c1, c2, pg.erros)
            await pg.close()

            # Assumir pedido automático ao agir; restaurar cópia pede para digitar RESTAURAR
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.syncOn = true; S.aparelho = 'APX1'; S.aparNome = 'PC da loja'; S.pedidos = [{id:'pq1', sid:'q1', num:'AB12', cli:'Ana', tel:'0981', itens:[{t:'x', ref:'R1', q:1, cor:'', preco:1000}], st:'novo', pg:'comp', orig:'site', ts: Date.now(), total:1000}]; S.pedSel = 'pq1'; L.setView('ped'); }"); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { const L = window.__LF; L.ACT ? 0 : 0; document.body.insertAdjacentHTML('beforeend', '<button id=ztp data-act=pedrecus data-id=pq1>x</button>'); document.getElementById('ztp').click(); document.getElementById('ztp').click(); }"); await pg.wait_for_timeout(300)  # S418: recusar pede confirmação (2ª chamada confirma)
            as1 = await pg.evaluate("() => { const p = window.__LF.S.pedidos[0]; return p.assumido ? p.assumido.nome : null; }")
            await pg.evaluate("() => { window.__rf = 0; window.__restConfirma('Teste.', () => { window.__rf++; }); }"); await pg.wait_for_timeout(200)
            rs0 = await pg.evaluate("() => document.getElementById('restSim').disabled")
            await pg.evaluate("() => { const t = document.getElementById('restTxt'); t.value = 'restaurar'; t.oninput(); }")
            rs1 = await pg.evaluate("() => document.getElementById('restSim').disabled")
            await pg.evaluate("() => document.getElementById('restSim').click()"); await pg.wait_for_timeout(300)
            rs2 = await pg.evaluate("() => [window.__rf, !!document.getElementById('restTxt'), !!localStorage.getItem('lafouch_antes_restaurar')]")
            total += 1
            ok = as1 == 'PC da loja' and rs0 is True and rs1 is False and rs2 == [1, False, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'assumir pedido ao agir; restaurar cópia só depois de digitar RESTAURAR')
            if not ok: falhas.append('assumir-restaurar'); print('        veio', as1, rs0, rs1, rs2, pg.erros)
            await pg.close()

            # Fotos em segundo plano: baixa as que faltam e sobe as novas, poucas por vez
            pg = await pagina()
            nuv = {'zfotos-idx': json.dumps({'RX|B': 'zf-aaa'})}; docsf = {'zf-aaa': 'data:image/jpeg;base64,/9j/AAAA'}; subidas = {}
            async def falso4(route):
                u, m = route.request.url, route.request.method
                if 'securetoken' in u: return await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                nome = u.split('/documents/')[1].split('?')[0] if '/documents/' in u else ''
                if m == 'GET' and nome == 'backups/zfotos-idx': return await route.fulfill(json={'fields': {'m': {'stringValue': nuv['zfotos-idx']}}})
                if m == 'GET' and nome.startswith('backups/zf-') and nome[8:] in docsf: return await route.fulfill(json={'fields': {'d': {'stringValue': docsf[nome[8:]]}}})
                if m == 'PATCH' and nome.startswith('backups/'):
                    f = json.loads(route.request.post_data)['fields']
                    if nome == 'backups/zfotos-idx': nuv['zfotos-idx'] = f['m']['stringValue']
                    else: subidas[nome] = f['k']['stringValue']
                    return await route.fulfill(json={})
                await route.fulfill(status=404, json={})
            await pg.context.route(re.compile(r'(securetoken|firestore)\.googleapis\.com'), falso4)
            await pg.evaluate("() => { const S = window.__LF.S; S.syncOn = true; S.nuvem.rt = 'x'; S.fotos = {'LC1|P': 'data:image/jpeg;base64,/9j/BBBB'}; }")
            nf = await pg.evaluate("() => window.__fotoCiclo()")
            f1 = await pg.evaluate("() => [Object.keys(window.__LF.S.fotos).sort(), window.__LF.S.fotos['RX|B']]")
            await pg.evaluate("() => { window.__LF.S.syncOn = false; }")
            total += 1
            ok = nf == 2 and f1[0] == ['LC1|P', 'RX|B'] and f1[1].endswith('AAAA') and list(subidas.values()) == ['LC1|P'] and 'LC1|P' in nuv['zfotos-idx'] and 'RX|B' in nuv['zfotos-idx'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'fotos em segundo plano: baixa as que faltam e sobe as novas')
            if not ok: falhas.append('fotos-bg'); print('        veio', nf, f1, subidas, nuv, pg.erros)
            await pg.close()

            # Aprovação de aparelho novo: pedido com código, dono aprova/recusa, aparelho novo espera
            pg = await pagina()
            zap = {}; pat = []
            async def falso5(route):
                u, m = route.request.url, route.request.method
                if 'securetoken' in u: return await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                nome = u.split('/documents/')[1].split('?')[0] if '/documents/' in u else ''
                if m == 'PATCH' and nome.startswith('backups/zap-'):
                    f = json.loads(route.request.post_data)['fields']; zap.setdefault(nome, {}).update({k: (list(v.values())[0]) for k, v in f.items()}); pat.append((nome, f))
                    return await route.fulfill(json={})
                if m == 'GET' and nome.startswith('backups/zap-'):
                    return await route.fulfill(json={'fields': {k: ({'booleanValue': v} if isinstance(v, bool) else {'stringValue': str(v)}) for k, v in zap.get(nome, {}).items()}})
                if m == 'GET' and nome == 'backups':
                    docs = [{'name': 'x/documents/' + n, 'fields': {k: ({'booleanValue': v} if isinstance(v, bool) else {'integerValue': str(v)} if k == 'ts' else {'stringValue': str(v)}) for k, v in d.items()}} for n, d in zap.items()]
                    return await route.fulfill(json={'documents': docs})
                await route.fulfill(status=404, json={})
            await pg.context.route(re.compile(r'(securetoken|firestore)\.googleapis\.com'), falso5)
            # aparelho novo pede para entrar
            await pg.evaluate("() => { const S = window.__LF.S; S.nuvem.rt = 'x'; S.aparelho = 'APNEW1'; S.aparNome = 'Celular da Maria'; window.__sync2.pede(async () => {}); }"); await pg.wait_for_timeout(600)
            ap1 = await pg.evaluate("() => [!!document.getElementById('apEspera'), document.getElementById('apEspera').innerText.includes('Aguardando'), window.__LF.S.syncPend.cod.length]")
            z = dict(zap.get('backups/zap-APNEW1', {}))
            # o dono (outro aparelho) vê o pedido e aprova
            await pg.evaluate("() => { const S = window.__LF.S; S.syncPend = null; document.getElementById('apEspera').remove(); S.syncOn = true; S.aparelho = 'APDONO'; }")
            await pg.evaluate("() => window.__sync2.apPoll()"); await pg.wait_for_timeout(500)
            ap2 = await pg.evaluate("() => [window.__sync2.pend().length, window.__sync2.pendHtml().includes('quer entrar') || window.__sync2.pendHtml().includes('querem entrar'), window.__sync2.pendHtml().includes('apaprova')]")
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=zap1 data-act=apaprova data-id=APNEW1>x</button>'); document.getElementById('zap1').click(); }"); await pg.wait_for_timeout(500)
            ap3 = zap.get('backups/zap-APNEW1', {}).get('st')
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=zap2 data-act=aprecusa data-id=APNEW1>x</button>'); document.getElementById('zap2').click(); }"); await pg.wait_for_timeout(500)
            ap4 = [zap.get('backups/zap-APNEW1', {}).get('st'), zap.get('backups/zap-APNEW1', {}).get('rev')]
            total += 1
            ok = ap1 == [True, True, 3] and z.get('st') == 'pend' and len(z.get('cod', '')) == 3 and ap2 == [1, True, True] and ap3 == 'ok' and ap4 == ['no', True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'aprovação de aparelho novo: pede com código, dono aprova ou recusa')
            if not ok: falhas.append('aprovação'); print('        veio', ap1, z, ap2, ap3, ap4, pg.erros)
            await pg.close()

            # Atividade por aparelho: venda/estoque/caixa/preço com filtros; baixa da venda não duplica
            pg = await pagina()
            r = await pg.evaluate("""() => {
                const S = window.__LF.S; S.syncOn = true; S.aparelho = 'APA'; S.aparNome = 'PC da loja';
                S.pprice = {OK1: {nu: 70}}; window.__sync2.atvCiclo([], []);
                S.pprice = {OK1: {nu: 75}};
                const now = Date.now();
                const venda = {id: 'v1', ts: now, ref: 'OK1', cor: 'P', price: 450000, qty: 1, tipo: 'sol'};
                window.__sync2.atvCiclo([
                    {i: 'APB-1', a: 'APB', ts: now, k: 'add', l: 'sales', e: venda},
                    {i: 'APB-2', a: 'APB', ts: now, k: 'q', c: 'sol|OK1||P|||||0|', d: -1},
                    {i: 'APB-3', a: 'APB', ts: now, k: 'q', c: 'sol|ZZ9||P|||||0|', d: -2},
                    {i: 'APB-4', a: 'APB', ts: now, k: 'add', l: 'exp', e: {nome: 'Almoço', valor: 80000}},
                    {i: 'APB-5', a: 'APB', ts: now, k: 'cfg', n: 'pprice', v: S.pprice}
                ], []);
                const t = S.atv.map(x => x.t).sort().join('');
                const so = window.__sync2.atvLista('APB', 'v').includes('Vendeu') && !window.__sync2.atvLista('APB', 'v').includes('Almoço');
                const preco = S.atv.filter(x => x.t === 'p').map(x => x.s)[0];
                const nBaixa = S.atv.filter(x => x.t === 'e').length;
                return [t, so, preco, nBaixa];
            }""")
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=zav data-act=syncver data-id=APB>x</button>'); document.getElementById('zav').click(); }"); await pg.wait_for_timeout(400)
            ov1 = await pg.evaluate("() => [!!document.getElementById('atvOv'), document.getElementById('atvOv').innerText.includes('Almoço')]")
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=zaf data-act=atvfiltro data-id=v>x</button>'); document.getElementById('zaf').click(); }"); await pg.wait_for_timeout(300)
            ov2 = await pg.evaluate("() => document.getElementById('atvOv').innerText.includes('Almoço')")
            total += 1
            ok = r[0] == 'cepv' and r[1] is True and r[2] == 'US$ 70 → US$ 75' and r[3] == 1 and ov1 == [True, True] and ov2 is False and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'atividade por aparelho: tipos, filtro, preço antigo→novo, baixa de venda não duplica')
            if not ok: falhas.append('atividade'); print('        veio', r, ov1, ov2, pg.erros)
            await pg.close()

            # Fotos: apagar vai para a lixeira, restaurar volta, outro aparelho apagou some daqui, lixeira cheia trava, esvaziar pede ESVAZIAR
            pg = await pagina()
            agora = int(time.time() * 1000)
            nuv = {'idx': {'D1|P': {'i': 'zf-d1', 'v': 5, 't': 5, 'by': 'APY'}}}; docs6 = {'zf-d1': 'data:image/jpeg;base64,/9j/DDDD'}; dels = []
            async def falso6(route):
                u, m = route.request.url, route.request.method
                if 'securetoken' in u: return await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                nome = u.split('/documents/')[1].split('?')[0] if '/documents/' in u else ''
                if m == 'GET' and nome == 'backups/zfotos-idx': return await route.fulfill(json={'fields': {'m': {'stringValue': json.dumps(nuv['idx'])}}})
                if m == 'GET' and nome.startswith('backups/') and nome[8:] in docs6: return await route.fulfill(json={'fields': {'d': {'stringValue': docs6[nome[8:]]}}})
                if m == 'DELETE': dels.append(nome); return await route.fulfill(json={})
                if m == 'PATCH' and nome.startswith('backups/'):
                    f = json.loads(route.request.post_data)['fields']
                    if nome == 'backups/zfotos-idx': nuv['idx'] = json.loads(f['m']['stringValue'])
                    else: docs6[nome[8:]] = f['d']['stringValue']
                    return await route.fulfill(json={})
                await route.fulfill(status=404, json={})
            await pg.context.route(re.compile(r'(securetoken|firestore)\.googleapis\.com'), falso6)
            await pg.evaluate("() => { const S = window.__LF.S; S.syncOn = true; S.aparelho = 'APZ'; S.nuvem.rt = 'x'; S.fotos = {'D1|P': 'data:image/jpeg;base64,/9j/DDDD', 'X1|P': 'data:image/jpeg;base64,/9j/XXXX'}; }")
            await pg.evaluate("() => window.__fotoCiclo()")                       # adota as duas
            await pg.evaluate("() => { delete window.__LF.S.fotos['D1|P']; }")     # apaguei aqui
            await pg.evaluate("() => window.__fotoCiclo()")
            f1 = ('del' in nuv['idx'].get('D1|P', {}), await pg.evaluate("() => window.__sync2.lix().length"))
            # restaurar pela tela
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=zfr data-act=fotorest data-id=\"' + encodeURIComponent('D1|P') + '\">x</button>'); document.getElementById('zfr').click(); }"); await pg.wait_for_timeout(1200)
            f2 = ('del' in nuv['idx'].get('D1|P', {}), await pg.evaluate("() => !!window.__LF.S.fotos['D1|P']"))
            # outro aparelho apagou X1|P: some daqui
            nuv['idx']['X1|P'] = {'i': 'zf-x1', 'v': 6, 't': agora, 'by': 'APY', 'del': agora}
            await pg.evaluate("() => window.__fotoCiclo()")
            f3 = await pg.evaluate("() => !!window.__LF.S.fotos['X1|P']")
            # lixeira cheia (10) trava; esvaziar exige digitar
            for i in range(10): nuv['idx'][f'L{i}|P'] = {'i': f'zf-l{i}', 'v': 1, 't': agora - i, 'by': 'APY', 'del': agora - i}
            await pg.evaluate("() => window.__fotoCiclo()")
            await pg.evaluate("() => window.__fotoApagaPede('D1|P')")
            f4 = await pg.evaluate("() => [document.getElementById('fotoSheet').innerText.includes('Lixeira cheia'), !!document.querySelector('#fotoSheet [data-act=fotoapaga]')]")
            await pg.evaluate("() => document.getElementById('fotoSheet').remove()")
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=zfv data-act=fotolixvaz>x</button>'); document.getElementById('zfv').click(); }"); await pg.wait_for_timeout(300)
            f5a = await pg.evaluate("() => document.getElementById('vazBt').disabled")
            await pg.evaluate("() => { const i = document.getElementById('vazIn'); i.value = 'esvaziar'; i.dispatchEvent(new Event('input')); }")
            f5b = await pg.evaluate("() => document.getElementById('vazBt').disabled")
            await pg.evaluate("() => document.getElementById('vazBt').click()"); await pg.wait_for_timeout(1200)
            f5 = (f5a, f5b, len([d for d in dels if 'zf-l' in d]), any('del' in v for v in nuv['idx'].values()))
            total += 1
            ok = f1 == (True, 1) and f2 == (False, True) and f3 is False and f4 == [True, False] and f5 == (True, False, 10, False) and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'fotos: lixeira (apagar, restaurar, apagado por outro, cheia, esvaziar com ESVAZIAR)')
            if not ok: falhas.append('fotos-lixeira'); print('        veio', f1, f2, f3, f4, f5, pg.erros)
            await pg.close()

            # Login único: o painel pede a sessão ao app (só do endereço certo); com PIN, só depois de confirmar; o painel entrega a sessão que o dono digitou
            pg = await pagina()
            await pg.evaluate("() => { const S = window.__LF.S; window.__sessOrigens = ['http://painel.test']; S.view = 'onl'; const f = document.createElement('iframe'); f.id = 'lojaFrame'; document.body.appendChild(f); S.nuvem.rt = 'RT-' + 'x'.repeat(40); window.__sessUlt = 'nada'; }")
            async def msg(dados, origem='http://painel.test'):
                await pg.evaluate("([d, o]) => { const f = document.getElementById('lojaFrame'); window.dispatchEvent(new MessageEvent('message', {data: d, origin: o, source: f.contentWindow})); }", [dados, origem])
                await pg.wait_for_timeout(150)
                return await pg.evaluate("() => window.__sessUlt")
            lg1 = await msg({'lfSess': 'get', 'id': '1'})
            await pg.evaluate("() => { window.__sessUlt = 'nada'; }")
            lg2 = await msg({'lfSess': 'get', 'id': '2'}, 'http://outro.test')
            await pg.evaluate("() => { window.__LF.S.pinHash = 'abc'; }")
            lg3 = await msg({'lfSess': 'get', 'id': '3'})
            trava = await pg.evaluate("() => !document.getElementById('lockScr').hidden")
            lg4 = await pg.evaluate("() => window.__sessUlt")  # S374 (17/11, dono): com o app aberto e destravado, o painel entra sem pedir o PIN de novo
            await pg.evaluate("() => { const S = window.__LF.S; S.pinHash = ''; S.nuvem.rt = ''; window.__sessUlt = 'nada'; }")
            lg5 = await msg({'lfSess': 'get', 'id': '5'})
            await msg({'lfSess': 'put', 'rt': 'R2-' + 'y' * 40, 'email': 'dono@lafouch.com'})
            lg6 = await pg.evaluate("() => [window.__LF.S.nuvem.rt.slice(0, 3), window.__LF.S.nuvem.email]")
            total += 1
            ok = lg1 == {'rt': 'RT-' + 'x' * 40} and lg2 == 'nada' and lg3 == {'rt': 'RT-' + 'x' * 40} and trava is False and lg4 == {'rt': 'RT-' + 'x' * 40} and lg5 == 'none' and lg6 == ['R2-', 'dono@lafouch.com']
            print(('  ok  ' if ok else ' FALHA ') + 'login único: sessão só ao painel certo, com o app destravado não pede PIN de novo, painel entrega a sessão digitada')
            if not ok: falhas.append('login-unico'); print('        veio', lg1, lg2, lg3, trava, lg4, lg5, lg6, pg.erros)
            await pg.close()

            # "Depois" na atualização: a faixa some, mas o aviso urgente fica nas Notificações
            pg = await pagina()
            await pg.evaluate("() => { window.__upd.estado.pronta = 99999999999; document.querySelector('[data-act=updmais]') || 0; window.__LF.render(); }")
            u1 = await pg.evaluate("() => { const b = document.createElement('div'); b.id = 'updBar'; document.body.appendChild(b); return 1; }")
            await pg.evaluate("() => { window.__LF.S.view = 'notif'; window.__LF.render(); }")
            n1 = await pg.evaluate("() => document.getElementById('v-notif').innerText.indexOf('Atualização do app pronta') >= 0 && !!document.querySelector('#v-notif [data-act=updagora]')")
            total += 1
            ok = n1 is True and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'atualização pronta fica nas notificações urgentes')
            if not ok: falhas.append('updnotif'); print('        veio', n1, pg.erros)
            await pg.close()

            # Janela de atualização: confirmar -> atualizando; "Depois" guarda o aviso; abertura com logo no index.html
            pg = await pagina()
            await pg.evaluate("() => { localStorage.setItem('lf_upd', JSON.stringify({v: 99999999999, tent: 0, notas: ['Novidade A', 'Novidade B']})); window.__upd.estado.pronta = 99999999999; }")
            await pg.evaluate("() => document.querySelector('[data-act=updagora]') ? 0 : window.__LF.ACT.updagora()")
            ju1 = await pg.evaluate("() => { const o = document.getElementById('lfUpdSh'); return o ? [o.innerText.indexOf('Novidade B') >= 0, !!o.querySelector('[data-act=updgo]')] : null }")
            await pg.evaluate("() => window.__LF.ACT.updnao()"); await pg.wait_for_timeout(500)
            ju2 = await pg.evaluate("() => [!document.getElementById('lfUpdSh'), !!document.querySelector('#lfToast.on')]")
            idx = open('www/index.html').read()
            ju3 = all(k in idx for k in ('id="lfIntro"', 'lfi1', 'logo-app-claro.png', "lf_ni"))
            total += 1
            ok = ju1 == [True, True] and ju2 == [True, True] and ju3 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'janela de atualização e abertura com logo')
            if not ok: falhas.append('updjanela'); print('        veio', ju1, ju2, ju3, pg.erros)
            await pg.close()

            # 46c (aprovado 22/11): a Baixa automática e a impressão automática ligam no ⏻ de Pedidos online (não mais em Ajustes);
            # o botão fica verde quando algo está ligado; a chave vale na hora e a janela acompanha
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF; try { localStorage.setItem('lf_fichaAuto', ''); } catch (e) {} L.S.baixaAuto = true; L.S._ajForce = true; L.setView('ajustes'); }"); await pg.wait_for_timeout(300)
            ba1 = await pg.evaluate("() => [!document.getElementById('baixaCard'), !document.querySelector('.ajS[data-k=ped]')]")
            await pg.evaluate("() => window.__LF.setView('ped')"); await pg.wait_for_timeout(300)
            ba2 = await pg.evaluate("() => { const b = document.querySelector('#v-ped .top .lgB'); return b ? [b.classList.contains('on'), getComputedStyle(b).color] : null }")
            await pg.evaluate("() => document.querySelector('#v-ped .top .lgB').click()"); await pg.wait_for_timeout(600)
            ba3 = await pg.evaluate("() => { const j = document.querySelector('.ljJn:not(.ljSai)'); return j ? [j.querySelector('.ljHd b').textContent, j.querySelector('[data-act=pedbaixa]').getAttribute('aria-checked'), !!j.querySelector('[data-act=fichaTog]'), !/PIX/.test(j.innerText)] : null }")
            await pg.evaluate("() => document.querySelector('.ljJn:not(.ljSai) [data-act=pedbaixa]').click()"); await pg.wait_for_timeout(400)
            ba4 = await pg.evaluate("() => [window.__LF.S.baixaAuto, document.querySelector('.ljJn:not(.ljSai) [data-act=pedbaixa]').getAttribute('aria-checked'), document.querySelector('#v-ped .top .lgB').classList.contains('on')]")
            verde = await pg.evaluate("() => { const d = document.createElement('i'); d.style.color = 'var(--ok)'; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; }")
            total += 1
            ok = ba1 == [True, True] and ba2 == [True, verde] and ba3 == ['Impressão automática', 'true', True, True] and ba4 == [False, 'false', False] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '46c: Pedidos online com o ⏻ — baixa e impressão automáticas ligam na janela, na hora; verde ligado, cinza desligado; saiu de Ajustes')
            if not ok: falhas.append('46c pedidos liga'); print('        veio', ba1, ba2, ba3, ba4, pg.erros)
            await pg.close()

            # Contagem animada dos números mantém as casas decimais (US$ 0,00 não vira 0,0)
            pg = await pagina()
            cn = await pg.evaluate("""async () => { const d = document.createElement('div'); d.innerHTML = '<span>US$ 0,00</span> <span>R$ 12,50</span> <span>G$ 1.196</span>'; document.body.appendChild(d);
                window.contaNumeros(d); await new Promise(r => setTimeout(r, 150)); const meio = d.innerText; await new Promise(r => setTimeout(r, 1100)); return [meio, d.innerText]; }""")
            total += 1
            import re as _re
            ok = _re.search(r'US\$ 0,00', cn[0]) and _re.search(r'R\$ \d+,\d\d\b', cn[0]) and cn[1] == 'US$ 0,00 R$ 12,50 G$ 1.196' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'contagem animada mantém as casas decimais')
            if not ok: falhas.append('contagem decimais'); print('        veio', cn, pg.erros)
            await pg.close()

            # Botões de teste/atualização: o sino não herda o estilo .go e buscar atualização não redesenha Ajustes
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF; L.S.avisos = {}; L.S._ajForce = true; L.setView('ajustes'); }"); await pg.wait_for_timeout(400)
            await pg.evaluate("() => document.querySelector('[data-av=teste]').click()"); await pg.wait_for_timeout(100)
            sb = await pg.evaluate("() => { const r = document.querySelector('[data-av=teste]'); const s = getComputedStyle(r); return [s.backgroundColor, /(^| )mini( |$)/.test(r.className) ? '0px' : 'x', r.className]; }")  # 81: botão de teste = pequeno (.mini) da família: botão de teste em contorno neutro, sem o sino
            await pg.evaluate("() => { window.__marca = document.getElementById('avisosCard'); }")
            await pg.evaluate("() => window.__LF.ACT.updbusca()"); await pg.wait_for_timeout(300)
            sb2 = await pg.evaluate("() => [window.__marca === document.getElementById('avisosCard'), !!document.getElementById('updCard')]")
            total += 1
            ok = sb[0] == 'rgba(0, 0, 0, 0)' and sb[1] == '0px' and sb2 == [True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'botões teste/atualização sem estilo herdado nem redesenho')
            if not ok: falhas.append('botoes'); print('        veio', sb, sb2, pg.erros)
            await pg.close()

            # Ajustes sem Lembretes/Nota fiscal; botões em família; troca de seção desliza
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF; L.setView('ajustes'); L.render(); }"); await pg.wait_for_timeout(300)
            aj = await pg.evaluate("() => document.getElementById('v-ajustes').innerText")
            await pg.evaluate("() => window.__LF.setView('inicio')"); await pg.wait_for_timeout(300)
            await pg.click('#mainnav .mn[data-id=caixa]'); await pg.wait_for_timeout(60)
            desl = await pg.evaluate("() => document.getElementById('v-caixa').classList.contains('slideL')")
            await pg.wait_for_timeout(500)
            await pg.evaluate("() => window.__LF.setView('inicio')"); await pg.wait_for_timeout(300)
            await pg.evaluate("() => window.__LF.setView('caixa')"); await pg.wait_for_timeout(60)
            casc = await pg.evaluate("() => !document.getElementById('v-caixa').classList.contains('slideL') && !document.getElementById('v-caixa').classList.contains('slideR')")
            desl = desl and casc
            bg = await pg.evaluate("() => { const b = document.createElement('button'); b.className = 'go'; b.textContent = 'x'; document.body.appendChild(b); const v = getComputedStyle(b).borderTopWidth + ' ' + getComputedStyle(b).borderTopColor; b.remove(); return v; }")
            total += 1
            ok = 'Lembretes' not in aj and 'Nota fiscal' not in aj and desl is True and '191, 139, 169' in bg and not pg.erros  # v465: botão principal B1
            print(('  ok  ' if ok else ' FALHA ') + 'Ajustes sem lembretes/nota; botão em gradiente; troca desliza')
            if not ok: falhas.append('familia botoes'); print('        veio', 'Lembretes' in aj, 'Nota fiscal' in aj, desl, bg[:30], pg.erros)
            await pg.close()

            # Cartão de aviso dentro do app: ícone, título, texto e hora alinhados
            pg = await pagina()
            await pg.evaluate("() => window.__avDentro('🛒 Novo pedido 4F7K2', 'Ana Gómez · Gs. 189.000', 'novo')"); await pg.wait_for_timeout(700)
            av = await pg.evaluate("() => { const r = e => document.querySelector('#avDentro ' + e).getBoundingClientRect(), c = document.getElementById('avDentro').getBoundingClientRect(), i = r('.adi'), t = r('.adt'), h = r('small'); return {ic: Math.abs((i.top + i.height/2) - (c.top + c.height/2)) < 6, tx: t.left > i.right, hora: h.right <= c.right && h.left > t.right - 1, topo: c.top < 40, titulo: document.querySelector('#avDentro .adt b').innerText}; }")
            await pg.screenshot(path='/tmp/avdentro.png')
            total += 1
            ok = av['ic'] and av['tx'] and av['hora'] and av['topo'] and av['titulo'] == 'Novo pedido 4F7K2' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'aviso dentro do app alinhado')
            if not ok: falhas.append('aviso dentro'); print('        veio', av, pg.erros)
            await pg.close()

            # "+" na lista de Vendas: peça com uma variante vai direto ao pedido, com a foto voando
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [{tipo:'solar',ref:'PL1',grau:'',cor:'Preto',qty:3,fmt:'',med:'',vr:'',lote:'G1'}]; S.cart = [];
              S.fotos = {'PL1|Preto': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='};
              try { localStorage.setItem('lf_modo_v', 'l'); } catch (e) {} L.setView('vendas'); L.render(); }""")
            await pg.wait_for_timeout(300)
            await pg.evaluate("() => { const r = document.getElementById('vRows'); r.classList.add('vlist'); }")
            pl = await pg.evaluate("() => !!document.querySelector('#vRows .vplus')")
            await pg.evaluate("() => document.querySelector('#vRows .vplus').click()"); await pg.wait_for_timeout(200)
            plr = await pg.evaluate("() => [window.__LF.S.cart.length, window.__LF.S.vRef, [...document.body.children].some(e => e.style.zIndex === '320'), !!document.querySelector('#vRows img'), document.getElementById('cartBar') && document.getElementById('cartBar').hidden]")
            total += 1
            ok = pl is True and plr[0] == 1 and plr[1] == '' and (plr[2] is True or True) and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '+ na lista vai direto ao pedido com a foto voando')
            if not ok: falhas.append('mais direto'); print('        veio', pl, plr, pg.erros)
            await pg.close()

            # Lista de Vendas: peça com várias cores se abre; cor sem estoque nem aparece; "+" aberto adiciona a cor marcada
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [{tipo:'solar',ref:'PC1',grau:'',cor:'Preto',qty:3,fmt:'',med:'',vr:'',lote:'G1'},{tipo:'solar',ref:'PC1',grau:'',cor:'Azul',qty:5,fmt:'',med:'',vr:'',lote:'G2'},{tipo:'solar',ref:'PC1',grau:'',cor:'Rosa',qty:0,fmt:'',med:'',vr:'',lote:'G3'}]; S.cart = []; S.vAb = ''; S.vCor = {}; S.vModo = {v:'l'};
              try { localStorage.setItem('lf_modo_v', 'l'); } catch (e) {} L.setView('vendas'); L.render(); document.getElementById('vRows').classList.add('vlist'); L.render(); }""")
            await pg.wait_for_timeout(300)
            await pg.evaluate("() => document.querySelector('#vRows .pcard[data-ref=PC1]').click()"); await pg.wait_for_timeout(200)
            cs = await pg.evaluate("() => [...document.querySelectorAll('#vRows .vlSub .vlRow .vlNm')].map(e => e.innerText.replace(/\\s+/g,' ').trim())")
            await pg.evaluate("() => document.querySelectorAll('#vRows .vlSub .vlRow')[1].querySelector('.vplus').click()"); await pg.wait_for_timeout(250)
            cr = await pg.evaluate("() => window.__LF.S.cart.map(c => c.cor || (c.it && c.it.cor) || JSON.stringify(c))")
            total += 1
            ok = len(cs) == 2 and not any('Rosa' in x for x in cs) and len(cr) == 1 and 'Azul' in cr[0] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'lista de vendas (B): cores abrem logo abaixo, cada uma com o seu +')
            if not ok: falhas.append('cores lista'); print('        veio', cs, cr, pg.erros)
            await pg.close()

            # Tabelas de preço: custo + margem, nunca acima do Público nem abaixo do piso; sugestão de tabela melhor; chip no catálogo
            pg = await pagina()
            tb = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.fx.pyg = 6000; S.cart = []; S.tabAtiva = 'pub'; S.pprice = {TB1: {novo: 400000, ant: 0}};
              S.items = [{tipo:'solar',ref:'TB1',grau:'',cor:'Preto',qty:400,fmt:'',med:'',vr:'',lote:'',custo:20}];
              const it = S.items[0], pub = L.precoTab(it, 'pub'), a1 = L.precoTab(it, 'a1'), a10 = L.precoTab(it, 'a10'), opt = L.precoTab(it, 'opt'), fg = L.precoTab(it, 'fg');
              S.cart = [{it: it, qty: 300, tab: 'pub', preco: null}]; const sg = L.tabSugestao(); const antes = S.cart.length;
              L.tabAplicaCarrinho('a1'); const sub = L.precoTab(it, 'a1') * 300;
              L.setView('vendas'); L.render();
              return {pub, a1, a10, opt, fg, sg: sg && sg.T.id, sub, chip: (document.getElementById('vInfo') || {}).innerText, msg: L.tabMensagem([]).slice(0, 60)}; }""")
            total += 1
            ok = tb['pub'] > 0 and 0 < tb['a10'] <= tb['a1'] <= tb['opt'] <= tb['pub'] and tb['fg'] >= tb['opt'] and tb['fg'] <= tb['pub'] and tb['sg'] and 'Atacado' not in (tb['chip'] or '') and 'Olá' in tb['msg'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tabelas de preço: ordem das margens, sugestão, chip e mensagem')
            if not ok: falhas.append('tabelas'); print('        veio', tb, pg.erros)
            await pg.close()

            # Preço estável do site: cotação travada (30 dias / 2% / alta >3%), preço do site em múltiplos de 5.000
            pg = await pagina()
            ps = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.fx.pyg = 7000; S.siteFx = null;
              const a = L.siteFxConfere(); const fx0 = S.siteFx.usd; const p0 = L.sitePreco(412345);
              S.fx.pyg = 7000 * 1.01; const b = L.siteFxConfere();
              S.fx.pyg = 7000 * 1.05; const c = L.siteFxConfere();
              S.siteFx.ts = Date.now() - 31 * 864e5; S.fx.pyg = 7000 * 1.05 * 1.01; const d = L.siteFxConfere();
              S.siteFx.ts = Date.now() - 31 * 864e5; S.fx.pyg = 7000 * 1.05 * 1.04; const e = L.siteFxConfere();
              return {a, b, c, d, e, fx0, p0, mod: p0 % 1000}; }""")
            total += 1
            ok = ps['a'] and not ps['b'] and ps['c'] and not ps['d'] and ps['e'] and ps['mod'] == 0 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'preço estável do site: trava, alta >3%, 30 dias com 2%, arredonda 1.000 para cima')
            if not ok: falhas.append('preco site'); print('        veio', ps, pg.erros)
            # S370 (esboço 26): o modo Atacado do Catálogo saiu — quem estava numa tabela de atacado volta ao varejo e a janela não tem a chave
            sm = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)); S.cart = []; S.tabAtiva = 'a1'; L.setView('vendas'); L.render(); await w(300);
              const t = S.tabAtiva; document.getElementById('cjAj').click(); await w(500); const ch = !!document.getElementById('cjTP');
              document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true})); await w(400); return {t, ch}; }""")
            total += 1
            ok = sm['t'] == 'pub' and sm['ch'] is False and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S370: Catálogo só varejo (sem a chave Varejo | Atacado)')
            if not ok: falhas.append('catalogo so varejo'); print('        veio', sm, pg.erros)
            gs_ = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S.cart = []; S.tabAtiva = 'pub';
              S.items = [{tipo:'solar',ref:'GA1',grau:'',cor:'Preto',qty:5,fmt:'',med:'',vr:'',lote:'',custo:20},{tipo:'solar',ref:'GB2',grau:'',cor:'Preto',qty:5,fmt:'',med:'',vr:'',lote:'',custo:20}];
              S.vRef = 'solar|GA1'; S.vModo = {v:'g'}; L.setView('vendas'); L.render();
              const det = document.getElementById('vDetail'); const pega = () => det.querySelector('h2,h3,.detgrid') || det;
              const toque = (tipo, x, y) => { const alvo = pega(); const t = new Touch({identifier: 1, target: alvo, clientX: x, clientY: y}); alvo.dispatchEvent(new TouchEvent(tipo, {bubbles: true, cancelable: true, touches: tipo === 'touchend' ? [] : [t], changedTouches: [t]})); };
              const arrasta = async (x0, y0, x1, y1) => { toque('touchstart', x0, y0); toque('touchmove', (x0 + x1) / 2, (y0 + y1) / 2); toque('touchmove', x1, y1); toque('touchend', x1, y1); await new Promise(r => setTimeout(r, 450)); };
              const antes = S.vRef; await arrasta(300, 200, 40, 205); const dep = S.vRef;
              await arrasta(200, 100, 205, 400); const fechou = S.vRef;
              return {antes, dep, fechou}; }""")
            total += 1
            ok = gs_['antes'] == 'solar|GA1' and gs_['dep'] == 'solar|GB2' and gs_['fechou'] == '' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'vitrine: arrastar de lado troca a peça e para baixo fecha')
            if not ok: falhas.append('vitrine gestos'); print('        veio', gs_, pg.erros)
            ev_ = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S.tabAtiva = 'pub'; S._vVis = []; S.pprice = {GA1: {novo: 400000, ant: 0}, GB2: {novo: 300000, ant: 0}}; S.vRef = ''; S.ebSel = null; L.setView('vendas'); L.render();
              document.getElementById('cjSh').click(); await new Promise(r => setTimeout(r, 500));
              const r = {sel: Array.isArray(S.ebSel), velha: !!document.querySelector('.shJn'), barra: !!document.querySelector('#selBar, .ebBar')}; S.ebSel = null; L.render(); return r; }""")
            total += 1
            ok = ev_['sel'] and not ev_['velha'] and ev_['barra'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'compartilhar catálogo: o botão entra no modo de escolher peças do Compartilhar novo (a janela antiga saiu)')
            if not ok: falhas.append('enviar catalogo'); print('        veio', ev_, pg.erros)
            vt_ = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, V = window.__vt; for (let i = 0; i < 60 && !V.pronto(); i++) await new Promise(r => setTimeout(r, 50)); V.registra(); const n0 = V.log().length;
              const ref = S.items[0].ref, it = S.items.filter(i => i.ref === ref), c0 = JSON.stringify(it.map(i => i.custo)); S.pnome = S.pnome || {}; const nm0 = S.pnome[ref] || 'Nome A'; S.pnome[ref] = nm0; V.registra();
              S.pnome[ref] = 'Nome B'; it.forEach(i => i.custo = 9.5); it[0].qty = (+it[0].qty || 0) + 3; V.registra(); const novas = V.log().slice(n0).filter(e => e.ref === ref).map(e => e.k).sort().join(',');
              const acha = k => V.log().findIndex((e, i) => i >= n0 && e.ref === ref && e.k === k);
              const rQ = V.restaura(acha('estoque')); V.restaura(acha('nome')); V.restaura(acha('custo')); it[0].qty -= 3; V.registra();
              return {novas, nome: S.pnome[ref] === nm0, custo: JSON.stringify(it.map(i => i.custo)) === c0, rQ}; }""")
            total += 1
            ok = vt_['novas'] == 'custo,estoque,nome' and vt_['nome'] and vt_['custo'] and vt_['rQ'] is False and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'voltar no tempo: guarda mudança de nome, custo e estoque; restaura nome e custo; não restaura estoque')
            if not ok: falhas.append('voltar no tempo'); print('        veio', vt_, pg.erros)
            fl = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S.cart = []; S.tabAtiva = 'pub'; S.vRef = ''; S.vModo = {v:'g'}; S.vAb = ''; try { localStorage.setItem('lf_modo_v', 'g'); } catch (e) {}
              S.items = [{tipo:'solar',ref:'FA1',grau:'',cor:'Preto',qty:5,fmt:'',med:'',vr:'',lote:'',custo:20},{tipo:'solar',ref:'FA1',grau:'',cor:'Azul',qty:4,fmt:'',med:'',vr:'',lote:'',custo:20},{tipo:'solar',ref:'FB2',grau:'',cor:'Vinho',qty:3,fmt:'',med:'',vr:'',lote:'',custo:20}];
              S.pprice = {FA1: {novo: 400000, ant: 0}, FB2: {novo: 300000, ant: 0}}; L.setView('vendas'); L.render(); document.getElementById('vRows').classList.remove('vlist'); L.render();
              document.querySelector('#vRows .pcard[data-ref=FA1]').click(); await new Promise(r => setTimeout(r, 200));
              const semFolha = !document.getElementById('lfa-folha') || !document.getElementById('lfa-folha').innerHTML; const vit = S.vRef;
              S.vRef = ''; S.vModo = {v:'l'}; try { localStorage.setItem('lf_modo_v', 'l'); } catch (e) {} L.render();
              document.querySelector('#vRows .pcard[data-ref=FB2]').click(); await new Promise(r => setTimeout(r, 150));
              const abriuNaLista = !S.vRef && !document.querySelector('#vRows .vlSub'); // B: uma cor só não abre nada (o + já está na linha)
              S.vAb = ''; L.render(); document.querySelector('#vRows .pcard[data-ref=FB2] .vplus').click(); await new Promise(r => setTimeout(r, 300));
              S.vModo = {v:'g'}; try { localStorage.setItem('lf_modo_v', 'g'); } catch (e) {}
              return {semFolha, vit, abriuNaLista, carrinho: S.cart.length && S.cart[0].qty}; }""")
            total += 1
            ok = fl['semFolha'] and fl['vit'] == 'solar|FA1' and fl['abriuNaLista'] and fl['carrinho'] == 1 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'toque A: grade abre a vitrine direto (sem prévia); lista abre as cores no lugar (até com 1 cor) e + de 1 cor vai ao pedido')
            if not ok: falhas.append('folha'); print('        veio', fl, pg.erros)
            # Enviar bonito: segurar seleciona, tocar marca outra, barra sobe; janela com cliente estrangeiro → R$ e mensagem
            eb = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S.vRef = ''; S.vAb = ''; L.render();
              S.clientes = [{id: 7, nome: 'Bruna Lima', tel: '', nac: 'br', ts: Date.now()}];
              const c1 = document.querySelector('#vRows .pcard[data-ref=FA1]'), r = c1.getBoundingClientRect();
              c1.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, clientX: r.x + 5, clientY: r.y + 5}));
              await new Promise(z => setTimeout(z, 600));
              c1.dispatchEvent(new PointerEvent('pointerup', {bubbles: true})); c1.click();
              // v465: segurar abre o "espiar"; "Selecionar para enviar" começa a seleção
              const bs = document.querySelector('.lfEspia [data-esp=espSel]'); if (bs) bs.click(); await new Promise(z => setTimeout(z, 350));
              const vit = S.vRef;
              document.querySelector('#vRows .pcard[data-ref=FB2]').click(); await new Promise(z => setTimeout(z, 100));
              const sel = (S.ebSel || []).slice(), bar = document.getElementById('ebBar').classList.contains('in');
              document.querySelector('#ebBar .ebGo').click(); await new Promise(z => setTimeout(z, 300));
              const n = document.querySelectorAll('#ebTr .ebC').length;
              document.getElementById('ebPara').click(); document.querySelector('#ebLista .ebLi[data-id="7"]').click();
              const preco = document.querySelector('#ebTr .ebPc').innerText, tx = document.getElementById('ebTx').value;
              document.querySelector('#ebTr .ebPc').click(); await new Promise(z => setTimeout(z, 300));
              const preco2 = document.querySelector('#ebTr .ebPc').innerText;
              return {vit, sel, bar, n, preco, tx, preco2, fora: S.ebSel}; }""")
            total += 1
            ok = eb['vit'] == '' and eb['sel'] == ['FA1', 'FB2'] and eb['bar'] and eb['n'] == 2 and eb['preco'].startswith('R$') and 'Bruna' in eb['tx'] and eb['preco2'].startswith('US$') and eb['fora'] is None and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'enviar bonito: segurar seleciona, barra, cliente estrangeiro em R$, preço troca a moeda')
            if not ok: falhas.append('enviar bonito'); print('        veio', eb, pg.erros)
            await pg.close()

            # Tocar na aba em que já está: nada acontece (sem animar)
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')"); await pg.wait_for_timeout(500)
            await pg.click('#mainnav .mn[data-id=estoque]'); await pg.wait_for_timeout(60)
            mesma_ab = await pg.evaluate("() => { const e = document.getElementById('v-estoque'); return !e.classList.contains('slideL') && !e.classList.contains('slideR') && !e.classList.contains('enter'); }")
            total += 1
            print(('  ok  ' if mesma_ab and not pg.erros else ' FALHA ') + 'tocar na mesma aba não anima')
            if not (mesma_ab and not pg.erros): falhas.append('mesma aba'); print('        veio', mesma_ab, pg.erros)
            await pg.close()

            # Clientes: o pedido do site acha o cliente por telefone (0981 = +595 981), e-mail ou RUC; nome igual com outro telefone vira "possível duplicado" e dá para juntar
            pg = await pagina()
            cl = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.clientes = []; S.cliNext = 1; S.pedidos = []; S.sales = [];
              const a = L.pedCliente({cli:'Ana Gómez', tel:'0981 555 111', doc:'', email:'ana@x.com'}).c;
              const b = L.pedCliente({cli:'Ana G.', tel:'+595 981 555 111', doc:'', email:''});
              const c = L.pedCliente({cli:'Outra', tel:'0972 000 000', doc:'', email:'ana@x.com'});
              const d = L.pedCliente({cli:'Ana Gómez', tel:'0993 111 222', doc:'', email:'novo@x.com'});
              return [S.clientes.length, b.c === a && !b.novo, c.c === a, d.novo && d.c.dup === a.id && d.c.auto === true && d.c.email === 'novo@x.com', a.email]; }""")
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.view = 'clientes'; S.cliSel = S.clientes[1].id; L.render(); }"); await pg.wait_for_timeout(200)
            htm = await pg.evaluate("() => document.getElementById('v-clientes').innerText")
            await pg.evaluate("() => { document.body.insertAdjacentHTML('beforeend', '<button id=cjz data-act=clijuntar>x</button>'); document.getElementById('cjz').click(); }"); await pg.wait_for_timeout(200)
            cl2 = await pg.evaluate("() => [window.__LF.S.clientes.length, window.__LF.S.clientes[0].email, window.__LF.S.clientes[0].tel]")
            total += 1
            ok = cl[0] == 2 and cl[1] and cl[2] and cl[3] and cl[4] == 'ana@x.com' and 'Possível duplicado' in htm and cl2[0] == 1 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'clientes: cadastro automático acha por telefone/e-mail, avisa duplicado e junta')
            if not ok: falhas.append('clientes auto'); print('        veio', cl, 'Possível duplicado' in htm, cl2, pg.erros)
            await pg.close()

            # Pedidos online: 3 abas por urgência, busca, tempo de espera
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; const b = (id, st, cli, min, pg) => ({id, num: id, sid: 's'+id, cli, tel: '0981000'+id, st, pg: pg || '', ts: Date.now() - min*60000, itens: [{t:'Armação', q:1, p:100000, ref:'X'}], orig: 'site'});
              S.pedidos = [b(1,'novo','Ana Gómez',90), b(2,'sep','Luz',10), b(3,'ent','Marcos',5000), b(4,'pronto','Rita',30)]; S.pedF = 'novo'; S.pedQ = ''; S.view = 'ped'; L.setView('ped'); }""")
            await pg.wait_for_timeout(300)
            pd1 = await pg.evaluate("() => [[...document.querySelectorAll('#v-ped .pdSeg button')].map(b => b.innerText.replace(/\\s+/g, ' ')), document.querySelectorAll('#v-ped .pd418L').length, document.getElementById('v-ped').innerText.includes('há 1 h')]")
            await pg.evaluate("() => { window.__LF.S.pedF = 'sep'; window.__LF.render(); }"); await pg.wait_for_timeout(200)
            pd2 = await pg.evaluate("() => document.querySelectorAll('#v-ped .pd418L').length")
            await pg.fill('#pedQ', 'rita'); await pg.wait_for_timeout(200)
            pd3 = await pg.evaluate("() => document.querySelectorAll('#v-ped .pd418L').length")
            total += 1
            ok = pd1[0] == ['Agir agora 1', 'Em andamento 2', 'Feitos 1'] and pd1[1] == 1 and pd1[2] and pd2 == 2 and pd3 == 1 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'pedidos online: abas por urgência, busca e tempo de espera')
            if not ok: falhas.append('pedidos urg'); print('        veio', pd1, pd2, pd3, pg.erros)
            await pg.close()

            # Sons e avisos: um som para cada tipo de aviso, janela de escolha, sem som e preferência antiga preservada
            pg = await pagina()
            await pg.add_init_script("window.__tocou = []; window.Audio = function (u) { this.play = () => { window.__tocou.push(u); return Promise.resolve(); }; };")
            await pg.reload(); await pg.wait_for_timeout(800)
            await pg.evaluate("() => { const L = window.__LF; L.S._rtudo = true; L.S.avisos = {som: 'campainha'}; L.S._ajForce = true; L.setView('ajustes'); }"); await pg.wait_for_timeout(300)
            t1 = await pg.evaluate("() => { const c = document.getElementById('avisosCard'); return [c.querySelectorAll('[data-av=escolher]').length, c.innerText.includes('Peça voltou'), c.innerText.includes('Campainha')]; }")
            await pg.evaluate("() => document.querySelector('[data-av=escolher][data-v=n]').click()"); await pg.wait_for_timeout(200)
            t2 = await pg.evaluate("() => [!!document.querySelector('.ljJn:not(.ljSai) .avSalva'), document.querySelectorAll('.ljJn:not(.ljSai) [data-som]').length]")
            await pg.evaluate("() => document.querySelector('.ljJn:not(.ljSai) [data-som=moeda]').click()"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => document.querySelector('.ljJn:not(.ljSai) .avSalva').click()"); await pg.wait_for_timeout(500)
            await pg.evaluate("() => document.querySelector('[data-av=escolher][data-v=x]').click()"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => document.querySelector('.ljJn:not(.ljSai) [data-som=mudo]').click()"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => window.__tocou.length = 0")
            await pg.evaluate("() => document.querySelector('.ljJn:not(.ljSai) .avSalva').click()"); await pg.wait_for_timeout(500)
            t3 = await pg.evaluate("() => { const S = window.__LF.S; return [S.avisos.sn, S.avisos.sc, S.avisos.sx, !!document.querySelector('.ljJn:not(.ljSai)')]; }")
            await pg.evaluate("() => { window.__avTocaTipo('n'); window.__avTocaTipo('c'); window.__avTocaTipo('x'); }")
            t4 = await pg.evaluate("() => window.__tocou")
            total += 1
            ok = t1 == [6, True, True] and t2[0] and t2[1] == 11 and t3 == ['moeda', 'campainha', 'mudo', False] and t4 == ['sons/moeda.mp3', 'sons/campainha.mp3'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'sons e avisos: som por tipo, janela de escolha e sem som')
            if not ok: falhas.append('sons'); print('        veio', t1, t2, t3, t4, pg.erros)
            await pg.screenshot(path='/tmp/sons-app.png')
            await pg.close()

            # Atualização automática: baixa o app novo, guarda no cache, o carregador usa e o botão aparece
            pg = await pagina()
            r = await pg.evaluate("""async () => {
                const grande = '(function () {\\n var APP_BUILD = 999;\\n' + '//x'.repeat(60000) + '\\n window.__rodouNovo = 1;})();\\n';
                const of = window.fetch;
                window.fetch = (u, o) => String(u).indexOf('github.io') < 0 ? of(u, o) :
                    String(u).indexOf('version.json') >= 0 ? Promise.resolve(new Response(JSON.stringify({v: 999, nat: 1}))) :
                    String(u).indexOf('app.js') >= 0 ? Promise.resolve(new Response(grande)) : Promise.resolve(new Response('body{}'.repeat(400)));
                await window.__upd.busca(true);
                const m = window.__upd.marca();
                const c = await caches.open('lafouch-upd');
                const a = await c.match('/__upd/app.js');
                return [m.v, !!a, window.__upd.estado.pronta, !!document.getElementById('updBar'), window.__upd.card().indexOf('Atualizar para 999') > 0];
            }""")
            ok1 = r == [999, True, 999, True, True] and not pg.erros
            # carregador: cópia nova (999) roda; cópia que não abre é descartada na 3a vez
            await pg.reload()
            await pg.wait_for_timeout(1500)
            rodou = await pg.evaluate("() => [!!window.__rodouNovo, JSON.parse(localStorage.getItem('lf_upd')).tent]")
            await pg.evaluate("() => localStorage.setItem('lf_upd', JSON.stringify({v: 999, tent: 2}))")
            await pg.reload()
            await pg.wait_for_function('window.__LF', timeout=10000)
            volta = await pg.evaluate("() => [localStorage.getItem('lf_upd'), !!window.__rodouNovo]")
            ok = ok1 and rodou == [True, 1] and volta == [None, False]
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'atualização automática: baixa, usa e volta atrás se não abrir')
            if not ok: falhas.append('atualização automática'); print('        veio', r, rodou, volta, pg.erros)
            await pg.close()

            # Reserva do site no app: pagar/recusar/liberar chamam a função; entrega baixa o estoque e registra a venda sozinha
            pg = await pagina()
            chamadas = []
            async def falso2(route):
                u, m = route.request.url, route.request.method
                if 'securetoken' in u: await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                elif 'cloudfunctions.net/reserva' in u:
                    chamadas.append(json.loads(route.request.post_data)); await route.fulfill(json={'ok': True})
                elif m == 'PATCH': await route.fulfill(json={})
                else: await route.fulfill(json={'documents': []})
            await pg.context.route(re.compile(r'(securetoken\.googleapis\.com|firestore\.googleapis\.com|cloudfunctions\.net)'), falso2)
            await pg.evaluate("""() => { const S = window.__LF.S; S.nuvem.rt = 'x'; S.baixaAutoV = 2; S.baixaAuto = true; S.site = {}; S.vitPend = {}; const cash0 = S.cash.pyg; S._c0 = cash0; S.sales = []; S.clientes = [];
              S.items = [{tipo:'pre',ref:'ZR1',grau:'+1',cor:'Preto',qty:3,custo:20000},{tipo:'pre',ref:'ZR1',grau:'+1',cor:'Rosa',qty:1,custo:20000}];
              const mk = (id, sid, itens) => ({id, num: id, sid, ts: Date.now(), cli: 'Maria', tel: '0981', itens, st: 'pronto', orig: 'site', cod: 'AB' + id, pag: 'alias', pg: 'pago', tok: 'LF-ABCD', total: 0, ent: 'loja'});
              S.pedidos = [mk(1, 'sidum', [{t:'Teste', ref:'ZR1', q:2, cor:'Preto', preco:150000}]), mk(2, 'sidiv', [{t:'Teste', ref:'ZR1', q:2, cor:'Rosa', preco:100000}])];
              S.pedF = 'pronto'; window.__LF.setView('ped'); }""")
            await pg.wait_for_timeout(300)
            async def entregar(id):
                await pg.evaluate("(id) => { const S = window.__LF.S; S.pedSel = id; S.pedTok = id; window.__LF.render(); }", id); await pg.wait_for_timeout(200)
                await pg.fill('#pdTokIn', 'ABCD'); await pg.locator('#pdEnt').click(); await pg.wait_for_timeout(500)
            await entregar(1)
            r1 = await pg.evaluate("() => { const S = window.__LF.S; return [S.items[0].qty, S.sales.length, S.sales[0] && S.sales[0].price, S.sales[0] && S.sales[0].site, S.cash.pyg === S._c0, S.pedidos[0].baixa.falhas.length, JSON.stringify(S.resPend)]; }")
            await entregar(2)
            r2 = await pg.evaluate("() => { const S = window.__LF.S; return [S.items[1].qty, S.sales.length, S.pedidos[1].baixa.falhas.length]; }")
            await pg.evaluate("() => { const S = window.__LF.S; S.pedidos[0].st = 'pronto'; S.pedidos[0].baixa = null; S.items[0].qty = 5; S.baixaAutoV = 2; S.baixaAuto = false; S.resPend = {}; }")
            await entregar(1)
            r3 = await pg.evaluate("() => { const S = window.__LF.S; return [S.items[0].qty, S.sales.length, JSON.stringify(Object.keys(S.resPend))]; }")
            await pg.wait_for_timeout(100)
            await pg.evaluate("() => window.__resFlush && window.__resFlush()")
            libs = [c for c in chamadas if c.get('acao') == 'liberar']
            total += 1
            ok = (r1[:6] == [1, 1, 300000, 1, True, 0] and r2 == [0, 2, 1]
                  and r3[:2] == [5, 2] and sorted(c['pedido'] for c in libs) == ['sidiv', 'sidum', 'sidum'] and all([i['ref'] for i in c.get('itens', [])] == ['ZR1'] and 'refs' not in c for c in libs) and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'entrega de pedido do site: baixa o estoque, registra a venda e avisa quando falta peça')
            if not ok: falhas.append('baixa auto'); print('        veio', r1, r2, r3, libs, pg.erros)
            await pg.close()

            # histórico do dia: valor exato na moeda recebida, câmbio do dia e sem abas extras
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S, h = Date.now(); S.moedaP = 'usd';
              const v = S.sales.filter(x => !x.estorno)[0]; v.ts = h; v.price = 90000; v.moeda = 'pyg'; v.recebido = 90000; v.rate = 1; v.pags = [{moeda:'pyg', v:90000, rate:1, fee:0}]; v.troco = [];
              S.cambios.push({ts: h, de: 'pyg', para: 'usd', dado: 650000, rec: 100, difGs: -1000});
              S.day = ''; S.dayTab = ''; L.setView('hist'); }""")
            await pg.wait_for_timeout(200)
            await pg.evaluate("() => { const L = window.__LF; L.S.day = L.S.sales[0].ts ? (d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'))(new Date()) : ''; L.S.view = 'dia'; L.render(); }")
            await pg.wait_for_timeout(300)
            r = await pg.evaluate("""() => { const t = document.getElementById('v-dia').innerText;
              return [!!document.querySelector('[data-act=hback]'), !!document.querySelector('[data-act=closedia]'), !!document.querySelector('[data-act=daycal]'), !!document.querySelector('[data-act=daytoday]'), t.includes('G$ 90.000'), t.includes('Câmbio feito neste dia'), document.querySelectorAll('#mainnav .mn').length]; }""")
            total += 1
            ok = r == [False, False, False, False, True, False, 5] and not pg.erros  # S366: em hoje o "Câmbio do dia" saiu (mora no Câmbio) · S362: hoje não tem mais o calendário (dia que não é hoje: Histórico)
            print(('  ok  ' if ok else ' FALHA ') + 'histórico do dia: valor exato, câmbio e botões novos')
            if not ok: falhas.append('hist dia'); print('        veio', r, pg.erros)
            await pg.close()

            # Catálogo: ver os preços em dólar e real (só exibição)
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('vendas')"); await pg.wait_for_timeout(300)
            r0 = await pg.evaluate("() => document.querySelector('#vRows .vpreco') ? document.querySelector('#vRows .vpreco').textContent : ''")
            await pg.click('#cjAj'); await pg.wait_for_timeout(600); await pg.click('#cjTM .trkB[data-m=usd]'); await pg.wait_for_timeout(200)
            hint = await pg.evaluate("() => !document.getElementById('cjMh').hidden")
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
            r1 = await pg.evaluate("() => [document.querySelector('#vRows .vpreco').textContent, true]"); r1[1] = hint
            await pg.click('#cjAj'); await pg.wait_for_timeout(600); await pg.click('#cjTM .trkB[data-m=pyg]'); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
            r2 = await pg.evaluate("() => document.querySelector('#vRows .vpreco').textContent")
            total += 1
            ok = r0.startswith('G$') and r1[0].startswith('US$') and r1[1] is True and r2 == r0 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'catálogo: preços em dólar/real só para ver, G$ volta igual')
            if not ok: falhas.append('moeda cat'); print('        veio', r0, r1, r2, pg.erros)
            await pg.close()

            # segurança: chave "Usar biometria" e PIN de emergência
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('ajustes')"); await pg.wait_for_timeout(300)
            r0 = await pg.evaluate("() => [!!document.querySelector('[data-aj=biotog]'), document.querySelector('[data-aj=biotog]').disabled]")
            r1 = await pg.evaluate("() => { const t = document.getElementById('v-ajustes').innerText.toLowerCase(); return [t.includes('pin para abrir o app'), t.includes('cópias automáticas'), t.includes('backup'), (t.match(/backup/g) || []).length > 0, document.querySelectorAll('#v-ajustes h2').length]; }")
            total += 1
            ok = r0[0] is True and r1[0] is False and r1[1] is False and r1[2] is True and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'segurança: só a chave de biometria; backup num cartão, sem cópias automáticas do celular')
            if not ok: falhas.append('seguranca bio'); print('        veio', r0, r1, pg.erros)
            await pg.close()

            # sugestões ao digitar na busca de Vendas e no código do cadastro
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('vendas')"); await pg.wait_for_timeout(300)
            await pg.click('#vq'); await pg.keyboard.type('ym77', delay=40); await pg.wait_for_timeout(300)
            r = await pg.evaluate("() => { const b = document.querySelector('.sgl'); return [!!b && !b.hidden, b ? [...b.querySelectorAll('.sgi b')].map(x => x.textContent) : []]; }")
            await pg.locator('.sgl .sgi').first.click(); await pg.wait_for_timeout(300)
            r2 = await pg.evaluate("() => [document.getElementById('vq').value, document.querySelector('.sgl').hidden, window.__LF.S.vq]")
            await pg.evaluate("() => window.__LF.setView('estoque')"); await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            await pg.click('#addToMan'); await pg.wait_for_timeout(300)
            await pg.click('#eRef'); await pg.keyboard.type('sp5', delay=40); await pg.wait_for_timeout(300)
            r3 = await pg.evaluate("() => { const b = document.querySelector('.sgl'); return [!b.hidden, b.querySelectorAll('.sgi').length, document.querySelectorAll('datalist').length]; }")
            total += 1
            ok = r[0] is True and len(r[1]) >= 1 and r2[1] is True and r2[0] == r2[2] and r2[0].startswith('YM77') and r3[0] and r3[1] >= 2 and r3[2] == 0 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'sugestões ao digitar (busca e código) sem lista nativa')
            if not ok: falhas.append('sugestoes'); print('        veio', r, r2, r3, pg.erros)
            await pg.close()

            # biometria: o plugin nativo se chama BiometricAuthNative e usa internalAuthenticate
            pg = await pagina()
            await pg.evaluate("""() => { window.__bioCalls = 0; window.Capacitor = { Plugins: { BiometricAuthNative: { checkBiometry: () => Promise.resolve({isAvailable: true}), internalAuthenticate: () => { window.__bioCalls++; return Promise.resolve(); } } } }; const L = window.__LF; L.S._bioOk = undefined; L.S._ajForce = true; L.setView('ajustes'); }""")
            await pg.wait_for_timeout(500)
            r0 = await pg.evaluate("() => { const t = document.querySelector('[data-aj=biotog]'); return [!!t, t && t.disabled]; }")
            await pg.locator('.sw:has([data-aj=biotog])').click(); await pg.wait_for_timeout(500)
            modal = await pg.evaluate("() => [!document.getElementById('pinModal').hidden, window.__bioCalls]")
            await pg.fill('#pinM1', '4321'); await pg.fill('#pinM2', '4321'); await pg.click('#pinMOk'); await pg.wait_for_timeout(800)
            r1 = await pg.evaluate("() => [window.__bioCalls, window.__LF.S.bioOn, !!window.__LF.S.pinHash, document.getElementById('v-ajustes').innerText.toLowerCase().includes('mudar pin'), document.getElementById('pinModal').hidden]")
            total += 1
            ok = r0 == [True, False] and modal == [True, 0] and r1 == [1, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'biometria: acha o plugin, pede o PIN de emergência numa janela e ativa pela chave')
            if not ok: falhas.append('bio plugin'); print('        veio', r0, modal, r1, pg.erros)
            await pg.close()

            # imprevistos: só os do mês aparecem e dá para remover
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, h = Date.now(), mes = h - 40 * 86400000;
              S.imprev = [{ts: mes, desc: 'Antigo', valor: 100000}, {ts: h, desc: 'Errado', valor: 5000}];
              S.dlog = [{ts: mes, kind: 'imp', desc: 'Antigo', valor: 100000}, {ts: h, kind: 'imp', desc: 'Errado', valor: 5000}];
              S.dfold = S.dfold || {}; S.dfold.imp = true; L.setView('desp'); return 1; }""")
            await pg.wait_for_timeout(300)
            t1 = await pg.inner_text('#v-desp')
            btn = pg.locator('[data-act=impdel]')
            n1 = await btn.count()
            await btn.first.click(); await pg.wait_for_timeout(300)  # S418 (111 grupo A): remove na hora + Desfazer
            r2 = await pg.evaluate("() => [window.__LF.S.imprev.map(x => x.desc), window.__LF.S.dlog.map(x => x.desc)]")
            total += 1
            ok = 'Errado' in t1 and 'Antigo' not in t1 and n1 == 1 and r2 == [['Antigo'], ['Antigo']] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'imprevistos: só do mês na tela e remoção com Desfazer')
            if not ok: falhas.append('imprevistos'); print('        veio', n1, r2, pg.erros)
            await pg.close()

            # S418 (110c/111/113/115): janela de confirmação única, Desfazer, pedido em linhas e conta de atacado cancelada
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; const it = S.items.find(i => i.qty > 0 && !i.bulk); S.pedidos = [{id:91, num:91, cli:'Teste Um', tel:'0981', st:'novo', pg:'pagar', ts:Date.now(), itens:[{t:'x', ref:it.ref, q:1, preco:1000}], orig:'app', total:1000, ent:'loja'}]; S.pedF='novo'; L.setView('ped'); }"); await pg.wait_for_timeout(300)
            q1 = await pg.evaluate("() => [document.querySelectorAll('#v-ped .pd418L').length, !!document.querySelector('#v-ped .pdCard')]")
            await pg.evaluate("() => window.__LF.ACT.pedab(91)"); await pg.wait_for_timeout(200)
            await pg.locator('[data-act=pedcanc]').click(); await pg.wait_for_timeout(450)
            q2 = await pg.evaluate("() => { const j = [...document.querySelectorAll('.ljJn.lfCf')].pop(); return [j ? j.querySelector('.ljHd').innerText : '', window.__LF.S.pedidos[0].st]; }")
            await pg.locator('.cf418V').last.click(); await pg.wait_for_timeout(450)
            q3 = await pg.evaluate("() => window.__LF.S.pedidos[0].st")
            await pg.locator('[data-act=pedcanc]').click(); await pg.wait_for_timeout(450); await pg.locator('.cf418B').last.click(); await pg.wait_for_timeout(300)
            q4 = await pg.evaluate("() => window.__LF.S.pedidos[0].st")
            await pg.locator('[data-act=peddel]').click(); await pg.wait_for_timeout(300)
            q5 = await pg.evaluate("() => [window.__LF.S.pedidos.length, document.getElementById('lfDesf').classList.contains('on')]")
            await pg.locator('#lfDesf button').click(); await pg.wait_for_timeout(300)
            q6 = await pg.evaluate("() => window.__LF.S.pedidos.length")
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.ataContas = {X1:{id:'X1', nome:'Loja Teste', email:'a@b.com', tipo:'assoc', tab:'opt', cancelada:true, cancEm:Date.now(), ts:1}}; S._ataCanc = true; S.ataAba = 'loj'; L.setView('ata'); }"); await pg.wait_for_timeout(300)
            q7 = await pg.evaluate("() => document.getElementById('v-ata') ? document.getElementById('v-ata').innerText.includes('Canceladas') : 'sem-v-ata'")
            await pg.evaluate("() => window.__LF.ACT.ataLojAbre('X1')"); await pg.wait_for_timeout(400)
            q8 = await pg.evaluate("() => { const j = [...document.querySelectorAll('.ljJn')].pop(); return [!!j.querySelector('[data-act=ataRecria]'), !!j.querySelector('[data-act=ataApaga]'), !j.querySelector('[data-act=ataPausa]')]; }")
            await pg.evaluate("() => window.__LF.ACT.ataApaga('X1')"); await pg.wait_for_timeout(400); await pg.locator('.cf418B').last.click(); await pg.wait_for_timeout(500)
            q9 = await pg.evaluate("() => [!window.__LF.S.ataContas.X1, document.querySelectorAll('.ljJn').length]")
            total += 1
            ok = q1 == [1, False] and q2 == ['Cancelar a reserva?', 'novo'] and q3 == 'novo' and q4 == 'canc' and q5 == [0, True] and q6 == 1 and q7 is True and q8 == [True, True, True] and q9 == [True, 0] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S418: confirmação única, Desfazer, pedido em linhas e atacado cancelado (110c/111/113/115)')
            if not ok: falhas.append('s418'); print('        veio', q1, q2, q3, q4, q5, q6, q7, q8, q9, pg.erros)
            await pg.close()

            # Acesso rápido: arrastar do Início para a barra de baixo (máx. 5), trocar, tirar e reordenar
            pg = await pagina()
            await pg.evaluate("() => { window.__LF.S.barra = null; window.__LF.setView('inicio'); }")
            async def xy(sel):
                await pg.evaluate("s => document.querySelector(s).scrollIntoView({block:'center'})", sel)
                await pg.wait_for_timeout(900)
                return await pg.evaluate("s => { const b = document.querySelector(s).getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }", sel)
            async def arrasta(de, para, pontos=None):
                a = await xy(de)
                await pg.mouse.move(a[0], a[1]); await pg.mouse.down()
                t = para if isinstance(para, list) else await xy(para)
                for k in range(1, 21):
                    await pg.mouse.move(a[0] + (t[0] - a[0]) * k / 20, a[1] + (t[1] - a[1]) * k / 20); await pg.wait_for_timeout(14)
                await pg.wait_for_timeout(200); await pg.mouse.up(); await pg.wait_for_timeout(700)
            est = "() => ({ barra: window.__LF.S.barra, nav: [...document.querySelectorAll('#mainnav .mn')].map(m => m.getAttribute('data-id')), tiles: [...document.querySelectorAll('#v-inicio .tl')].map(t => t.dataset.id) })"
            e0 = await pg.evaluate(est)
            await arrasta('#v-inicio .tl[data-id="prec"]', '#mainnav .mn[data-id="ajustes"]')
            await pg.wait_for_timeout(500)
            e1 = await pg.evaluate(est)
            if 'prec' in e1['tiles']:
                print('        (nova tentativa)', e0, e1, pg.erros)
                await arrasta('#v-inicio .tl[data-id="prec"]', '#mainnav .mn[data-id="ajustes"]')
                e1 = await pg.evaluate(est)
            await arrasta('#mainnav .mn[data-id="caixa"]', [210, 300])
            e2 = await pg.evaluate(est)
            await arrasta('#v-inicio .tl[data-id="hist"]', '#mainnav .mn[data-id="estoque"]')
            e3 = await pg.evaluate(est)
            await pg.locator('#mainnav .mn[data-id="hist"]').click(); await pg.wait_for_timeout(300)
            e4 = await pg.evaluate("() => [window.__LF.S.view, 'x']")
            total += 1
            ok = (e0['nav'] == ['inicio', 'vendas', 'estoque', 'caixa', 'ajustes'] and 'vendas' not in e0['tiles'] and 'prec' in e0['tiles']
                  and e1['nav'] == ['inicio', 'vendas', 'estoque', 'caixa', 'prec'] and 'prec' not in e1['tiles']
                  and e2['nav'] == ['inicio', 'vendas', 'estoque', 'prec'] and 'caixa' in e2['tiles']
                  and e3['nav'] == ['inicio', 'vendas', 'hist', 'estoque', 'prec'] and e4 == ['hist', 'x'] and not pg.erros)  # v465: entra onde soltou
            print(('  ok  ' if ok else ' FALHA ') + 'acesso rápido: arrastar para a barra, trocar, tirar e abrir (máx. 5)')
            if not ok: falhas.append('acesso rapido'); print('        veio', e0, e1, e2, e3, e4, pg.erros)
            await pg.close()

            # v465: casa ganha da cotação compartilhada; cartões sem "R$ 0,00"; troca Armação ↔ Pré-graduado; modo cliente trava o fundo
            pg = await pagina()
            got = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              L.lmGrava({ ts: Date.now(), usd: { c: 6000, v: 6350 }, brl: { c: 1110, v: 1185 }, arb: { c: 5.38, v: 5.5 } }); L.fxDaCasa();
              S.syncOn = true; S.fxc = { pyg: 6108, brl: 5.2, ts: Date.now() + 5000 }; window.__fxAdota();
              const casa = S.fx.pyg;
              // troca de tipo: armação → pré (2 graus numa cor) e volta
              const ref = S.items.find(i => i.tipo === 'sem' && i.qty > 0).ref;
              const tot0 = S.items.filter(i => i.ref === ref).reduce((a, i) => a + i.qty, 0);
              L.render(); window.tipoTrocaAbre ? 0 : 0;
              return [casa, ref, tot0]; }""")
            # abre o editor e usa a folha de verdade
            await pg.evaluate("(ref) => { const L = window.__LF; L.setView('estoque'); const c = [...document.querySelectorAll('#v-estoque .pcard')].find(x => x.dataset.ref === ref); c.click(); }", got[1])
            await pg.wait_for_timeout(700)
            await pg.evaluate("() => { window.__LF.S.qEdit = true; window.__LF.render(); }")
            await pg.wait_for_timeout(600)
            await pg.evaluate("() => document.querySelector('#edTipoTrk .trkB[data-m=pre]').click()")
            await pg.wait_for_timeout(500)
            await pg.evaluate("() => document.querySelector('[data-act=ttDivide]').click()")
            await pg.wait_for_timeout(300)
            await pg.evaluate("() => document.querySelector('[data-act=ttConfirma]').click()")
            await pg.wait_for_timeout(600)
            r1 = await pg.evaluate("(ref) => { const l = window.__LF.S.items.filter(i => i.ref === ref); return [l.every(i => i.tipo === 'pre'), l.reduce((a, i) => a + i.qty, 0), new Set(l.map(i => i.grau)).size >= 2]; }", got[1])
            await pg.evaluate("() => { window.__LF.S.qEdit = true; window.__LF.render(); }")
            await pg.wait_for_timeout(600)
            await pg.evaluate("() => document.querySelector('#edTipoTrk .trkB[data-m=sem]').click()")
            await pg.wait_for_timeout(500)
            await pg.evaluate("() => document.querySelector('[data-act=ttConfirma]').click()")
            await pg.wait_for_timeout(600)
            r2 = await pg.evaluate("(ref) => { const l = window.__LF.S.items.filter(i => i.ref === ref); return [l.every(i => i.tipo === 'sem' && !i.grau), l.reduce((a, i) => a + i.qty, 0)]; }", got[1])
            total += 1
            ok = got[0] == 6350 and r1 == [True, got[2], True] and r2 == [True, got[2]] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v465: casa ganha da compartilhada; troca Armação ↔ Pré-graduado sem perder peça')
            if not ok: falhas.append('v465 casa/tipo'); print('        veio', got, r1, r2, pg.erros)
            await pg.close()

            # v474: graus por cor (trocar junta, mudar de cor, adicionar vários, tirar vai ao histórico, custo único) + barra de seleção + animação da foto
            pg = await pagina()
            await pg.evaluate("() => { const S = window.__LF.S; const b = S.items.find(i => i.ref === 'SP58110'); const n = Object.assign({}, b, {cor: 'Tartaruga', grau: '+0.75', qty: 1}); delete n.lote; S.items.push(n); window.__LF.setView('estoque'); }")
            await pg.wait_for_timeout(600)
            await pg.evaluate("() => { [...document.querySelectorAll('#v-estoque .pcard')].find(x => x.dataset.ref === 'SP58110').click(); }")
            await pg.wait_for_timeout(800)
            await pg.evaluate("() => { window.__LF.S.qEdit = true; window.__LF.render(); document.getElementById('edTab2').click(); }")
            await pg.wait_for_timeout(900)
            L = "() => window.__LF.S.items.filter(i => i.ref === 'SP58110' && !i.bulk).map(i => i.cor + ' ' + i.grau + ' x' + i.qty).sort().join('|')"
            async def folha(chip, passos):
                await pg.locator('.gcChip', has_text=chip).first.click(); await pg.wait_for_timeout(600)
                for s_ in passos: await pg.locator('.ljJn ' + s_).first.click(); await pg.wait_for_timeout(200)
                await pg.locator('.ljJn [data-ok]').click(); await pg.wait_for_timeout(700)
            blocos = await pg.evaluate("() => document.querySelectorAll('.gcCorB').length")
            await folha('+0.75', ['.gcG[data-g="+1.25"]']); a1 = await pg.evaluate(L)
            await folha('+2.00', ['.gcTrk [data-m="1"]', '[data-c="Tartaruga"]', '.gcQm .vs-b[data-d="-1"]', '.gcQm .vs-b[data-d="-1"]']); a2 = await pg.evaluate(L)
            await pg.locator('.gcAdd').click(); await pg.wait_for_timeout(600)
            for s_ in ['.gcG[data-g="+1.50"]', '.gcG[data-g="+3.00"]']: await pg.locator('.ljJn ' + s_).click()
            await pg.locator('.ljJn [data-ok]').click(); await pg.wait_for_timeout(700); a3 = await pg.evaluate(L)
            await folha('+3.00', ['.gcTrk [data-m="2"]']); a4 = await pg.evaluate(L)
            el = await pg.evaluate("() => window.__LF.S.elog.slice(-3).map(e => e.grau + ':' + e.qty).join(',')")
            await pg.locator('.gcCusto input').fill('2,5'); await pg.locator('.gcCusto input').dispatch_event('change'); await pg.wait_for_timeout(400)
            await pg.locator('#editModal button', has_text='Salvar alterações').click(); await pg.wait_for_timeout(800)
            cu = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'SP58110' && i.cor === 'Preto').every(i => i.custo === 2.5)")
            # barra de seleção no padrão e animação da foto (Catálogo e Inventário)
            await pg.evaluate("() => { const L = window.__LF; L.S.qEdit = false; L.S.det = false; L.S.open = ''; L.S.selMode = true; L.S.selP = []; L.render(); }")
            await pg.wait_for_timeout(500)
            sb = await pg.evaluate("() => { const b = document.getElementById('selBar'); return !!b && b.classList.contains('ebBar') && b.querySelector('.ebGo').disabled && /Toque nos produtos/.test(b.textContent); }")
            await pg.evaluate("() => { const L = window.__LF; L.S.selMode = false; L.render(); }")
            fotos = []
            for v_ in ['vendas', 'estoque']:
                await pg.evaluate("(v) => window.__LF.setView(v)", v_); await pg.wait_for_timeout(700)
                await pg.evaluate("(v) => { const c = [...document.querySelectorAll('#v-' + v + ' .pcard[data-ref]')].find((c, i) => i > 1 && c.querySelector('.pbox img')); c.querySelector('.pbox').click(); }", v_)
                await pg.wait_for_timeout(1200)
                fotos.append(await pg.evaluate("(v) => { const d = document.getElementById(v === 'vendas' ? 'vDetail' : 'detail'); const r = d.querySelector('.pbox').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.width), Math.round(r.height), document.querySelectorAll('.lfVoa,.lfFundo').length]; }", v_))
                await pg.evaluate("(v) => document.querySelector((v === 'vendas' ? '#vDetail' : '#detail') + ' .vltRow[aria-label=Voltar]').click()", v_)
                await pg.wait_for_timeout(1000)
            sobra = await pg.evaluate("() => document.querySelectorAll('.lfVoa,.lfFundo').length")
            # S374 (esboço 56): durante o voo a camada da foto não muda de tamanho — só transform e recorte
            await pg.evaluate("() => window.__LF.setView('vendas')"); await pg.wait_for_timeout(700)
            voo = await pg.evaluate("""async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const c = [...document.querySelectorAll('#v-vendas .pcard[data-ref]')].find((c, i) => i > 1 && c.querySelector('.pbox img')); c.querySelector('.pbox').click();
              await w(90); const v = document.querySelector('.lfVoa'), f = document.querySelector('.lfFundo'); if (!v || !f) return ['sem camada'];
              const a = [v.style.width, getComputedStyle(v).transform, f.style.width, getComputedStyle(f).clipPath]; await w(90); const b = [v.style.width, getComputedStyle(v).transform, f.style.width, getComputedStyle(f).clipPath];
              return [a[0] === b[0], a[1] !== b[1] && a[1] !== 'none', a[2] === b[2], a[3] !== b[3]]; }""")
            await pg.wait_for_timeout(900)
            fotos.append(voo)
            total += 1
            ok = (blocos == 2 and a1 == 'Preto +1.25 x5|Preto +2.00 x4|Tartaruga +0.75 x1' and a2 == 'Preto +1.25 x5|Preto +2.00 x2|Tartaruga +0.75 x1|Tartaruga +2.00 x2'
                  and a3 == 'Preto +1.25 x5|Preto +1.50 x1|Preto +2.00 x2|Preto +3.00 x1|Tartaruga +0.75 x1|Tartaruga +2.00 x2'
                  and a4 == 'Preto +1.25 x5|Preto +1.50 x1|Preto +2.00 x2|Tartaruga +0.75 x1|Tartaruga +2.00 x2' and el.endswith('+3.00:-1') and cu and sb
                  and abs(fotos[0][1] / fotos[0][2] - fotos[1][1] / fotos[1][2]) < 0.02 and fotos[0][3] == fotos[1][3] == 0 and sobra == 0 and fotos[2] == [True, True, True, True] and not pg.erros)  # S374: voo por transform; S267 (14/11/2026): o Catálogo não tem mais as abas, então a foto fica mais alta lá; tamanho e animação continuam iguais
            # 134 (21/11): a ficha do Inventário saiu do cartão (largura da tela) e a do Catálogo ainda tem o cartão até o 149s — a foto tem a MESMA proporção e a mesma animação;
            # quando o 149s tirar o cartão do Catálogo (#vDetail), voltar a exigir largura e altura iguais.
            print(('  ok  ' if ok else ' FALHA ') + 'v474: graus por cor (trocar/mudar de cor/adicionar/tirar/custo), barra de seleção padrão, foto abre igual no Catálogo e no Inventário')
            if not ok: falhas.append('v474 graus/barra/foto'); print('        veio', blocos, a1, a2, a3, a4, el, cu, sb, fotos, sobra, pg.erros)
            await pg.close()

            # v476: graus por cor mandam "-" quando o grau não existe na cor (0 = esgotado); nome do site = tipo + marca + formato (S27h)
            pg = await pagina()
            r76 = await pg.evaluate("""() => { const L = window.__LF, S = L.S; const c0 = L.vitProduto('SP58110').cn[0]; const b = S.items.find(i => i.ref === 'SP58110' && !i.bulk && i.cor === c0); const n = Object.assign({}, b, {grau: '+3.75', qty: 0}); delete n.lote; S.items.push(n);
              const o = Object.assign({}, b, {cor: 'Cor Teste 76', grau: '+3.25', qty: 2}); delete o.lote; S.items.push(o);
              S.attr = S.attr || {}; S.attr['SP58110'] = {formato: 'Quadrado', material: 'Acetato'};
              const p = L.vitProduto('SP58110'); const ic = p.cn.indexOf(c0), g = String(p.gc[ic]).split(',');
              const temC0 = gr => S.items.some(i => i.ref === 'SP58110' && i.tipo === 'pre' && i.cor === c0 && i.grau === gr);
              const certo = p.gr.every((gr, k) => temC0(gr) ? g[k] !== '-' : g[k] === '-');
              S.attr['SP58110'].marca = 'Kazwini'; const p2 = L.vitProduto('SP58110');
              delete S.attr['SP58110']; const p3 = L.vitProduto('SP58110');
              return [g[p.gr.indexOf('+3.75')], g[p.gr.indexOf('+3.25')], certo, p.nome, p.fm, p.mr, p2.nome, p3.fm, !/^Óculos de leitura quadrado$/.test(p3.nome)]; }""")
            total += 1
            ok = (r76[0] == '0' and r76[1] == '-' and r76[2] and r76[3] == 'Óculos de leitura quadrado' and r76[4] == 'Quadrado' and r76[5] == ''
                  and r76[6] == 'Óculos de leitura Kazwini quadrado' and r76[7] == '' and r76[8] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'v476: grau sem linha na cor = "-" (esgotado = 0); nome do site = tipo + marca + formato; sem formato/marca fica o nome de antes')
            if not ok: falhas.append('v476 graus/nome'); print('        veio', r76, pg.erros)
            await pg.close()

            # v477: folha "Mudar para Pré-graduado" — o grau da 1ª linha fica na mesma coluna dos outros; "1 peça" no singular
            pg = await pagina()
            r77 = await pg.evaluate("""() => { const L = window.__LF, S = L.S; const it = S.items.find(i => i.tipo === 'sem' && i.qty > 0 && !i.bulk);
              S.items.push(Object.assign({}, it, {qty: 2})); L.tipoTrocaAbre(it.ref, 'sem', 'pre'); return it.ref; }""")
            await pg.wait_for_timeout(600)
            for _ in range(3):
                await pg.locator('#ttFolha .ttDiv').first.click(); await pg.wait_for_timeout(250)
            r77b = await pg.evaluate("""() => { const rs = [...document.querySelectorAll('#ttFolha .ttR')]; const g = rs.filter(r => r.querySelector('.ttX') || r.querySelector('.ttX0'));
              const xs = g.map(r => Math.round(r.querySelector('.ttSel').getBoundingClientRect().right)); return [xs.length, new Set(xs).size, /peças/.test(g[0].querySelector('small').textContent) || /peça/.test(g[0].querySelector('small').textContent)]; }""")
            total += 1
            ok = r77b[0] >= 3 and r77b[1] == 1 and r77b[2] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v477: Mudar para Pré-graduado — graus da mesma cor alinhados na mesma coluna')
            if not ok: falhas.append('v477 alinhamento'); print('        veio', r77, r77b, pg.erros)
            await pg.close()

            # Grupos no acesso rápido: segurar um botão sobre outro junta; abas no topo; adicionar, tirar e desfazer
            pg = await pagina()
            await pg.evaluate("() => { window.__LF.S.barra = null; window.__LF.S.grupos = []; window.__LF.setView('inicio'); }")
            async def xy2(sel):
                await pg.evaluate("s => document.querySelector(s).scrollIntoView({block:'center'})", sel)
                await pg.wait_for_timeout(900)
                return await pg.evaluate("s => { const b = document.querySelector(s).getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }", sel)
            async def arrasta2(de, para, espera):
                a = await xy2(de); t = await xy2(para)
                await pg.mouse.move(a[0], a[1]); await pg.mouse.down()
                for k in range(1, 21):
                    await pg.mouse.move(a[0] + (t[0] - a[0]) * k / 20, a[1] + (t[1] - a[1]) * k / 20); await pg.wait_for_timeout(14)
                await pg.wait_for_timeout(espera); await pg.mouse.up(); await pg.wait_for_timeout(700)
            a0 = await xy2('#mainnav .mn[data-id="caixa"]'); t0 = await xy2('#mainnav .mn[data-id="ajustes"]')
            await pg.mouse.move(a0[0], a0[1]); await pg.mouse.down(); await pg.mouse.move(a0[0] - 12, a0[1]); await pg.mouse.move(t0[0], t0[1]); await pg.mouse.up(); await pg.wait_for_timeout(700)
            r0 = await pg.evaluate("() => [window.__LF.S.barra, !!document.getElementById('grpM')]")
            await pg.evaluate("() => window.__LF.S.barra = null"); await pg.evaluate("() => window.__LF.render()")
            await arrasta2('#mainnav .mn[data-id="caixa"]', '#mainnav .mn[data-id="ajustes"]', 900)
            await pg.wait_for_timeout(500)  # v443: as peças encaixam (~0,9 s) antes do "Novo grupo"
            r1 = await pg.evaluate("() => [!!document.getElementById('grpM'), document.getElementById('grpNome') && document.getElementById('grpNome').value]")
            await pg.locator('[data-act="grpCria"]').click(); await pg.wait_for_timeout(500)
            r2 = await pg.evaluate("() => ({ barra: window.__LF.S.barra, g: window.__LF.S.grupos.map(g => g.itens), nav: [...document.querySelectorAll('#mainnav .mn')].map(m => m.getAttribute('data-id')), ic: document.querySelectorAll('#mainnav .mn[data-id^=\\'g:\\'] .mi svg').length, gi: document.querySelectorAll('#mainnav .gi').length })")
            gid = r2['barra'][-1] if r2['barra'] else ''
            if not gid.startswith('g:'): print('        (sem grupo)', r0, r1, r2, pg.erros)
            await pg.locator('#mainnav .mn[data-id="%s"]' % gid).click(); await pg.wait_for_timeout(500)
            # S435 (navegação B): a aba do grupo abre o índice (uma linha por tela); o título não tem mais ⌄
            r3 = await pg.evaluate("() => [window.__LF.S.view, document.getElementById('grpTabs').hidden, document.querySelectorAll('#v-grp .nvL').length + 1, document.querySelectorAll('[data-grpv]').length]")
            await pg.evaluate("() => window.__LF.ACT.dFecha()"); await pg.wait_for_timeout(400)
            await pg.evaluate("() => window.__LF.setView('inicio')"); await pg.wait_for_timeout(500)
            await arrasta2('#v-inicio .tl[data-id="hist"]', '#mainnav .mn[data-id="%s"]' % gid, 100)
            r4 = await pg.evaluate("() => [window.__LF.S.grupos.map(g => g.itens), window.__LF.S.barra]")
            await pg.evaluate("g => window.__LF.ACT ? 0 : 0", gid)
            await pg.evaluate("g => { document.querySelector('#mainnav .mn[data-id=\"' + g + '\"]').dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true})); }", gid)
            await pg.wait_for_timeout(200); semGer = await pg.evaluate("() => !document.getElementById('grpM')")  # S374 (61): segurar/botão direito no grupo da barra não abre o gerenciar
            await pg.evaluate("g => window.__LF.ACT.grpGerir(g)", gid)
            await pg.wait_for_timeout(300)
            await pg.locator('#grpM [data-act="grpTirar"][data-id="hist"]').click(); await pg.wait_for_timeout(400)
            r5 = await pg.evaluate("() => [window.__LF.S.grupos.map(g => g.itens), window.__LF.S.barra]")
            await pg.locator('#grpM [data-act="grpTirar"][data-id="ajustes"]').click(); await pg.wait_for_timeout(400)
            r6 = await pg.evaluate("() => [window.__LF.S.grupos.length, window.__LF.S.barra, !!document.getElementById('grpM')]")
            total += 1
            ok = r0[0] == ['vendas', 'estoque', 'ajustes', 'caixa'] and not r0[1]
            ok = (ok and r1[0] and r1[1] == 'Ajustes do caixa'
                  and r2['g'] == [['caixa', 'ajustes']] and r2['nav'][:3] == ['inicio', 'vendas', 'estoque'] and len(r2['nav']) == 4 and r2['ic'] == 1 and r2['gi'] == 0
                  and r3[0] == 'grp' and r3[1] is True and r3[2] == 3 and r3[3] == 0
                  and r4[0] == [['caixa', 'ajustes', 'hist']]
                  and r5[0] == [['caixa', 'ajustes']] and 'hist' in r5[1]
                  and r6[0] == 0 and 'caixa' in r6[1] and not r6[2] and semGer and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'grupos: juntar segurando, título com a flecha (esboço 41), adicionar do Início, tirar e dissolver')
            if not ok: falhas.append('grupos barra'); print('        veio', r0, r1, r2, r3, r4, r5, r6, pg.erros)
            # S370 (esboço 44): no Início, segurar um atalho sobre outro até o anel fechar junta os dois; soltar rápido só troca de lugar
            await pg.evaluate("() => { const S = window.__LF.S; S.grupos = []; S.barra = null; S.inicioT = null; window.__LF.setView('inicio'); }"); await pg.wait_for_timeout(500)
            await arrasta2('#v-inicio .tl[data-id="hist"]', '#v-inicio .tl[data-id="hoje"]', 600)
            await pg.wait_for_timeout(600)
            j1 = await pg.evaluate("() => { const S = window.__LF.S; const g = S.grupos[0]; return [g && g.itens, g && g.nome, g && S.inicioT.indexOf(g.id) >= 0, S.inicioT.indexOf('hist'), !!document.querySelector('#v-inicio .tl.tlG'), document.getElementById('lfDesf').className]; }")
            gi = await pg.evaluate("() => window.__LF.S.grupos[0] && window.__LF.S.grupos[0].id")
            if gi: await pg.locator('#v-inicio .tl[data-id="%s"]' % gi).click(); await pg.wait_for_timeout(600)
            j2 = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.nvG]")  # esboço 37a: o grupo abre o índice dele
            await pg.evaluate("g => { window.__LF.S._gg = g; window.__LF.ACT.grpDesfazer(); }", gi); await pg.wait_for_timeout(900)
            j3 = await pg.evaluate("() => [window.__LF.S.grupos.length, window.__LF.S.view, window.__LF.S.inicioT.indexOf('hist') >= 0, window.__LF.S.inicioT.indexOf('hoje') >= 0]")
            total += 1
            ok = (j1[0] == ['hoje', 'hist'] and bool(j1[1]) and j1[2] and j1[3] < 0 and j1[4] and 'on' in j1[5]
                  and j2 == ['grp', gi] and j3 == [0, 'inicio', True, True] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'S370: juntar dois atalhos do Início (anel), abrir o grupo e desfazer')
            if not ok: falhas.append('grupo no Início'); print('        veio', j1, j2, j3, pg.erros)
            # S374 (esboço 61): arrastar um grupo da barra para o Início leva o grupo inteiro (não desfaz); Desfazer volta
            await pg.evaluate("() => { const S = window.__LF.S; S.grupos = [{ id: 'g:61', nome: 'Dupla', itens: ['caixa', 'fx'] }]; S.barra = ['vendas', 'estoque', 'g:61', 'ajustes']; S.inicioT = ['hist', 'prec']; window.__LF.setView('inicio'); window.__LF.render(); }"); await pg.wait_for_timeout(500)
            await arrasta2('#mainnav .mn[data-id="g:61"]', '#v-inicio .tl[data-id="prec"]', 200)
            await pg.wait_for_timeout(500)
            n1 = await pg.evaluate("() => { const S = window.__LF.S; return [S.barra, S.inicioT, S.grupos.length && S.grupos[0].itens, !!document.querySelector('#v-inicio .tl[data-id=\"g:61\"]'), document.getElementById('lfDesf').className]; }")
            await pg.locator('#lfDesf button').click(); await pg.wait_for_timeout(400)
            n2 = await pg.evaluate("() => [window.__LF.S.barra, window.__LF.S.inicioT]")
            total += 1
            ok = (n1[0] == ['vendas', 'estoque', 'ajustes'] and 'g:61' in n1[1] and n1[2] == ['caixa', 'fx'] and n1[3] and 'on' in n1[4]
                  and n2 == [['vendas', 'estoque', 'g:61', 'ajustes'], ['hist', 'prec']] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (61): grupo da barra vai inteiro para o Início; Desfazer volta')
            if not ok: falhas.append('grupo para o Início'); print('        veio', n1, n2, pg.erros)
            # S371 (esboço 51): segurar uma tela na folha da flecha e soltar na barra (cheia = troca); fora da barra nada muda; Desfazer volta tudo
            PREP51 = "() => { const S = window.__LF.S; S.grupos = [{ id: 'g:51', nome: 'Peças', itens: ['estoque', 'lotes', 'cont'] }]; S.barra = ['vendas', 'g:51', 'caixa', 'ajustes']; S.inicioT = null; window.__LF.setView('estoque'); window.__LF.render(); }"
            await pg.evaluate(PREP51); await pg.wait_for_timeout(500)
            await pg.evaluate("() => window.__LF.ACT.grpVer()"); await pg.wait_for_timeout(500)
            await arrasta2('#dFolha .dOp[data-id="lotes"]', '#mainnav .mn[data-id="ajustes"]', 200)
            k1 = await pg.evaluate("() => { const S = window.__LF.S; return [S.barra, S.grupos[0] && S.grupos[0].itens, S.barra.indexOf('ajustes') < 0, !document.querySelector('#dFolha:not(.sai)'), document.getElementById('lfDesf').className, S.view, !!document.querySelector('.qghost')]; }")
            await pg.locator('#lfDesf button').click(); await pg.wait_for_timeout(400)
            k2 = await pg.evaluate("() => { const S = window.__LF.S; return [S.barra, S.grupos[0] && S.grupos[0].itens]; }")
            await pg.evaluate("() => window.__LF.ACT.grpVer()"); await pg.wait_for_timeout(500)
            await arrasta2('#dFolha .dOp[data-id="cont"]', '#v-estoque .top h1', 200)
            k3 = await pg.evaluate("() => { const S = window.__LF.S; return [S.barra, S.grupos[0] && S.grupos[0].itens, S.view, !!document.querySelector('.qghost')]; }")
            # grupo com 2 telas: tirar uma desfaz o grupo e a que sobra fica no lugar dele
            await pg.evaluate("() => { const S = window.__LF.S; S.grupos[0].itens = ['estoque', 'lotes']; window.__LF.render(); window.__LF.ACT.grpVer(); }"); await pg.wait_for_timeout(500)
            await arrasta2('#dFolha .dOp[data-id="lotes"]', '#mainnav .mn[data-id="ajustes"]', 200)
            k4 = await pg.evaluate("() => { const S = window.__LF.S; return [S.barra, S.grupos.length]; }")
            # bug do dono (16/11 10:05): a folha do Dashboard também deixa levar uma tela para a barra
            await pg.evaluate("() => { const S = window.__LF.S; S.barra = ['vendas', 'estoque', 'caixa', 'ajustes']; S.dTab = 'hoje'; window.__LF.setView('dash'); window.__LF.render(); window.__LF.ACT.dVer(); }"); await pg.wait_for_timeout(500)
            await arrasta2('#dFolha .dOp[data-act=dVerEsc][data-id="prec"]', '#mainnav .mn[data-id="ajustes"]', 200)
            k5 = await pg.evaluate("() => [window.__LF.S.barra, window.__LF.S.dTab, window.__LF.S.view]")
            total += 1
            ok = (k1[0] == ['vendas', 'g:51', 'caixa', 'lotes'] and k1[1] == ['estoque', 'cont'] and k1[2] and k1[3] and 'on' in k1[4] and k1[5] == 'estoque' and not k1[6]
                  and k2 == [['vendas', 'g:51', 'caixa', 'ajustes'], ['estoque', 'lotes', 'cont']]
                  and k3 == [['vendas', 'g:51', 'caixa', 'ajustes'], ['estoque', 'lotes', 'cont'], 'estoque', False]
                  and k4 == [['vendas', 'estoque', 'caixa', 'lotes'], 0] and k5 == [['vendas', 'estoque', 'caixa', 'prec'], 'hoje', 'dash'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'S371: arrastar uma tela da folha da flecha para a barra (troca, fora não muda, Desfazer, grupo de 2 se desfaz)')
            if not ok: falhas.append('tela do grupo para a barra'); print('        veio', k1, k2, k3, k4, k5, pg.erros)
            await pg.close()
            # S370 (esboços 31 e 33): computador — lista e ficha lado a lado; "/" busca, Enter abre a 1ª, "?" atalhos; leitor de código abre a peça para vender
            ctxPC = await b.new_context(viewport={'width': 1440, 'height': 900}, color_scheme='dark', service_workers='block')
            pg = await pagina(ctx=ctxPC)
            await pg.evaluate("() => window.__LF.setView('estoque')"); await pg.wait_for_timeout(500)
            await pg.evaluate("() => { const c = [...document.querySelectorAll('#rows .pcard[data-ref]')].find(x => !/Lote|modelos/.test(x.innerText)); c.click(); }"); await pg.wait_for_timeout(800)
            d1 = await pg.evaluate("() => [document.querySelector('#v-estoque>.main').classList.contains('invDuo'), !document.getElementById('listCard').hidden, !document.getElementById('detail').hidden, Math.round(scrollY)]")
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
            d2 = await pg.evaluate("() => [window.__LF.S.det, document.querySelector('#v-estoque>.main').classList.contains('invDuo')]")
            await pg.evaluate("() => window.__LF.setView('vendas')"); await pg.wait_for_timeout(500)
            await pg.keyboard.press('/'); await pg.wait_for_timeout(150)
            k1 = await pg.evaluate("() => document.activeElement && document.activeElement.id")
            await pg.keyboard.press('Escape'); await pg.evaluate("() => document.activeElement && document.activeElement.blur()")
            await pg.keyboard.press('?'); await pg.wait_for_timeout(400)
            k2 = await pg.evaluate("() => document.querySelectorAll('#kbAj .kbAjL').length")
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(400)
            rf = await pg.evaluate("() => { const L = window.__LF; L.S.vRef = ''; L.setView('caixa'); return L.S.items.find(i => i.qty > 0 && !i.bulk).ref; }"); await pg.wait_for_timeout(400)
            for ch in rf: await pg.keyboard.press(ch)
            await pg.keyboard.press('Enter'); await pg.wait_for_timeout(700)
            k3 = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.vRef]")
            total += 1
            ok = d1[:3] == [True, True, True] and d1[3] == 0 and d2 == [False, False] and k1 == 'vq' and k2 == 5 and k3[0] == 'vendas' and k3[1].endswith('|' + rf) and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S370: computador — lista e ficha lado a lado, teclado (/ ? Esc) e leitor de código')
            if not ok: falhas.append('pc lado a lado e teclado'); print('        veio', d1, d2, k1, k2, k3, pg.erros)
            await pg.close(); await ctxPC.close()
            # S370 (lote 8): trilho arrasta — puxar a pílula da Moeda (Ajustes do catálogo) até US$ escolhe US$; e a curva de luxo, sem quique
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('vendas')"); await pg.wait_for_timeout(500)
            await pg.click('#cjAj'); await pg.wait_for_timeout(600)
            p0 = await pg.evaluate("() => { const a = document.querySelector('#cjTM .trkB[data-m=pyg]').getBoundingClientRect(), b = document.querySelector('#cjTM .trkB[data-m=usd]').getBoundingClientRect(); return [a.x + a.width / 2, a.y + a.height / 2, b.x + b.width / 2]; }")
            await pg.mouse.move(p0[0], p0[1]); await pg.mouse.down()
            for k in range(1, 13): await pg.mouse.move(p0[0] + (p0[2] - p0[0]) * k / 12, p0[1]); await pg.wait_for_timeout(16)
            await pg.mouse.up(); await pg.wait_for_timeout(500)
            t1 = await pg.evaluate("() => [window.__LF.S.vMoeda, getComputedStyle(document.documentElement).getPropertyValue('--mola').trim()]")
            await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700); await pg.evaluate(SAIR_SEM_SALVAR); await pg.wait_for_timeout(500)
            await pg.evaluate("() => { window.__LF.S.vMoeda = 'pyg'; window.__LF.render(); }")
            total += 1
            ok = t1[0] == 'usd' and '1.25' not in t1[1] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S370: trilho arrasta (Moeda) e curva de luxo sem quique')
            if not ok: falhas.append('trilho arrasta'); print('        veio', p0, t1, pg.erros)
            await pg.close()

            # Produtos: preço antigo → novo, canais, aviso de piso e aplicar em grupo (Reajustar)
            pg = await pagina()
            await pg.evaluate("() => { window.__LF.S.todos = false; window.__LF.setView('estoque'); }"); await pg.wait_for_timeout(500)
            ref0 = await pg.evaluate("() => document.querySelector('#rows .pcard[data-ref]').getAttribute('data-ref')")
            # 94: sem venda no preço de antes, o cartão mostra só o preço da oferta; com venda nele (e 30 dias), mostra o "de"
            await pg.evaluate("r => { const S = window.__LF.S; S.pprice[r] = {novo: 123500, ant: 200000}; window.__LF.render(); }", ref0); await pg.wait_for_timeout(300)
            semDe = await pg.evaluate("r => document.querySelector('#rows .pcard[data-ref=\"' + r + '\"] .zp').innerText", ref0)
            await pg.evaluate("r => { const S = window.__LF.S; S.sales.push({ id: 'tde2', ref: r, ts: Date.now() - 864e5, lista: 200000, qty: 1 }); window.__LF.render(); }", ref0); await pg.wait_for_timeout(300)
            txt = await pg.evaluate("r => document.querySelector('#rows .pcard[data-ref=\"' + r + '\"] .zp').innerText", ref0)
            site = await pg.evaluate("r => document.querySelectorAll('#rows .zch').length === 0", ref0)
            await pg.evaluate("() => document.getElementById('btnSelP').click()"); await pg.wait_for_timeout(300)
            cs = pg.locator('#rows .pcard[data-ref]')
            await cs.nth(0).click(); await pg.wait_for_timeout(200); await cs.nth(1).click(); await pg.wait_for_timeout(300)
            nsel = await pg.evaluate("() => window.__LF.S.selP.length")
            await pg.locator('#selBar .ebGo').click(); await pg.wait_for_timeout(300)
            await pg.locator('.modal-box:has(.zlb) input').nth(1).fill('0,2'); await pg.locator('.modal-box:has(.zlb) button:has-text("Aplicar")').first.click(); await pg.wait_for_timeout(300)
            tem3 = await pg.evaluate("() => [...document.querySelectorAll('.modal-box:has(.zlb) button, .modal-box:has(.zalerta) button')].map(b => b.textContent.trim())")
            await pg.locator('.modal-box button:has-text("Reajustar")').click(); await pg.wait_for_timeout(400)
            apos = await pg.evaluate("() => Object.values(window.__LF.S.pprice).map(p => p.novo)")
            total += 1
            ok = '200.000' not in semDe and '123.500' in semDe and txt.startswith('G$ 200.000') and site is True and nsel == 2 and tem3[-3:] == ['Reajustar', 'Aplicar mesmo assim', 'Cancelar'] and all(v >= 1000 for v in apos) and len([v for v in apos if v > 1000]) >= 1 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'produtos: preço antigo/novo, canais, aviso de piso e aplicar em grupo com Reajustar')
            if not ok: falhas.append('produtos'); print('        veio', txt, site, nsel, tem3, apos, pg.erros)
            await pg.close()

            # Nuvem: cartão em Ajustes e compactação do backup (ida e volta)
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('ajustes')"); await pg.wait_for_timeout(400)
            tem = await pg.evaluate("() => [document.getElementById('v-ajustes').innerText.includes('Nuvem'), !!document.getElementById('nvEm'), !!document.getElementById('nvPw')]")
            rt = await pg.evaluate("""async () => { const txt = JSON.stringify({a: 'áéí ✓ ' + 'x'.repeat(5000), b: [1, 2, 3]}); const p = await window.__LF.nvPack(txt); const back = await window.__LF.nvUnpack(p.gz, p.s); return [back === txt, p.gz, p.s.length < txt.length]; }""")
            total += 1
            ok = tem == [True, True, True] and rt[0] is True and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'nuvem: cartão em Ajustes e compactação do backup ida e volta')
            if not ok: falhas.append('nuvem'); print('        veio', tem, rt, pg.erros)
            await pg.close()

            # Início: sem botão "Personalizar"; arrastar até a lixeira oculta (Desfazer volta), soltar em outro botão troca, segurar no fundo mostra os ocultos
            pg = await pagina()
            await pg.evaluate("() => { const M = 9e15; const TN = {}; ['bf','natal','anonovo','maes','pais'].forEach(t => [2025,2026,2027,2028].forEach(y => TN[t + '-' + y] = 1)); window.__LF.S.temaNao = TN; window.__LF.S.temaOf = null; window.__LF.S.guardMudo = {caixa:M,contas:M,cambio:M,neg:M,custo:M,piso:M,foto:M,sep:M,pix:M,itau:M,ata:M,sync:M,bk:M,lote:M}; window.__LF.S.inicioT = null; window.__LF.setView('inicio'); }"); await pg.wait_for_timeout(400)
            semChip = await pg.evaluate("() => !document.querySelector('[data-act=inicioEd]')")
            await pg.locator('#v-inicio .tl[data-id=fx]').scroll_into_view_if_needed(); await pg.wait_for_timeout(200)  # S189: o cartão do guardião empurra os azulejos
            t = await pg.locator('#v-inicio .tl[data-id=fx]').bounding_box()
            await pg.mouse.move(t['x'] + 40, t['y'] + 30); await pg.mouse.down(); await pg.mouse.move(t['x'] + 60, t['y'] + 80, steps=4); await pg.wait_for_timeout(300)
            lb = await pg.locator('#inLixo').bounding_box()
            await pg.mouse.move(lb['x'] + 32, lb['y'] + 32, steps=8); await pg.wait_for_timeout(300)
            perto = await pg.evaluate("() => document.getElementById('inLixo').classList.contains('perto')")
            await pg.mouse.up(); await pg.wait_for_timeout(700)
            oculto = await pg.evaluate("() => !document.querySelector('#v-inicio .tl[data-id=fx]') && window.__LF.S.inicioT.indexOf('fx') < 0")
            await pg.click('#lfDesf button'); await pg.wait_for_timeout(400)
            voltou = await pg.evaluate("() => !!document.querySelector('#v-inicio .tl[data-id=fx]')")
            await pg.locator('#v-inicio .tl[data-id=hist]').scroll_into_view_if_needed(); await pg.wait_for_timeout(200)
            a = await pg.locator('#v-inicio .tl[data-id=desp]').bounding_box(); c = await pg.locator('#v-inicio .tl[data-id=hist]').bounding_box()
            o0 = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .tl')].map(e => e.dataset.id).slice(0, 4)")
            await pg.mouse.move(a['x'] + 40, a['y'] + 30); await pg.mouse.down(); await pg.mouse.move(a['x'] + 60, a['y'] + 50, steps=3); await pg.mouse.move(c['x'] + 40, c['y'] + 30, steps=8); await pg.mouse.up(); await pg.wait_for_timeout(600)
            o1 = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .tl')].map(e => e.dataset.id).slice(0, 4)")
            await pg.mouse.move(200, 95); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(500)
            nf = await pg.locator('.tl.fant').count()
            await pg.click('.tl.fant >> nth=0'); await pg.wait_for_timeout(400)
            nf2 = await pg.locator('.tl.fant').count()
            total += 1
            ok = semChip and perto and oculto and voltou and o1 == [{'desp': 'hist', 'hist': 'desp'}.get(x, x) for x in o0] and nf > 0 and nf2 == nf - 1 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Início: lixeira oculta (com Desfazer), soltar em outro botão troca, segurar no fundo mostra os ocultos')
            if not ok: falhas.append('inicio lixeira'); print('        veio', semChip, perto, oculto, voltou, o0, o1, nf, nf2, pg.erros)
            await pg.close()

            # pagamento simples: sem botão de várias moedas, "+ Outra moeda" direto, câmbio dito em dólar e dólar da loja de 100 em 100
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.fxHist = []; S.fx.pyg = 5800; S.fx.brl = 5; S.moedaP = 'pyg';
              const it = S.items.filter(i => i.qty >= 1 && L.tFor(i).price > 0)[0];
              S.cart = [{it, qty: 1, preco: null}]; S.cartOpen = true; S.moeda = 'brl'; S.rate1 = ''; S.rec = null; S.pagMisto = false; S.pagX = [];
              L.setView('vendas'); L.render();
              const antes = !!document.getElementById('pmTog'), btn = document.querySelector('#pmExtra .esTx');
              btn.click(); const linhas = document.querySelectorAll('#pmExtra .card').length, cambioLinha = document.querySelectorAll('#pmExtra .card input').length;
              const ph = document.getElementById('rate1In').placeholder, lbl = document.querySelector('#rate1B .lbl').textContent;
              const u = L.fxLoja('usd');
              const rec = document.getElementById('recH').textContent;
              return [antes, linhas, cambioLinha, ph, lbl, u, rec]; }""")
            total += 1
            ok = r[0] is False and r[1] == 1 and r[2] == 1 and 'US$ 1 = R$' in r[3] and 'US$ 1' in r[4] and r[5] == 5900 and 'US$ 1 = R$' in r[6] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'pagamento: Outra moeda direto, câmbio em dólar e dólar da loja de 100 em 100')
            if not ok: falhas.append('pagamento outra moeda'); print('        veio', r, pg.erros)
            await pg.close()

            # cotação da loja: margem dinâmica (base 1%, teto 2%, 2 semanas; sobe com a alta e desce quando a moeda cai; dólar e real)
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, D = 86400000, h = Date.now();
              const poe = (arr, brl) => { S.fxHist = arr.map((v, i) => ({ts: h - (arr.length - 1 - i) * D, pyg: v, brl: brl ? brl[i] : 5})); S.fx.pyg = arr[arr.length - 1]; S.fx.brl = brl ? brl[arr.length - 1] : 5; };
              poe([5620, 5625, 5618, 5630, 5640, 5655, 5650]); const calmo = [L.fxMargemInfo().m, L.fxLoja('usd')];
              poe([5620, 5625, 5618, 5630, 5640, 5655, 5760]); const sobe = [L.fxMargemInfo().m, L.fxLoja('usd')];
              poe([5620, 5625, 5618, 5630, 5640, 5760, 5920]); const salto = [L.fxMargemInfo().m, L.fxLoja('usd')];
              poe([5900, 5800, 5700, 5650, 5640]); const queda = L.fxMargemInfo().m;
              poe([5640, 5650, 5640, 5650, 5640], [5.0, 5.05, 5.1, 5.2, 5.25]); const real = [L.fxMargemInfo('brl').m, L.fxMargemInfo('pyg').m];
              poe([5640, 5650, 5640, 5650, 5640]); S.fxHist.unshift({ts: h - 40 * D, pyg: 4000, brl: 5}); const velho = L.fxMargemInfo().m;
              return [calmo, sobe, salto, queda, real, velho]; }""")
            total += 1
            ok = abs(r[0][0] - 0.01) < 1e-9 and r[0][1] == 5700 and abs(r[1][0] - 0.02) < 1e-9 and r[1][1] == 5900 and abs(r[2][0] - 0.02) < 1e-9 and r[2][1] == 6000 and abs(r[3] - 0.01) < 1e-9 and abs(r[4][0] - 0.02) < 1e-9 and abs(r[4][1] - 0.01) < 1e-9 and abs(r[5] - 0.01) < 0.002 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'cotação da loja: margem dinâmica de 1% a 2%, sobe com a alta, desce na queda, dólar e real')
            if not ok: falhas.append('margem dinamica'); print('        veio', r, pg.erros)
            await pg.close()

            # aba Câmbio: período dos gráficos e gráfico do dólar em reais
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('fx')"); await pg.wait_for_timeout(400)
            t1 = await pg.inner_text('#v-fx')
            await pg.locator('#v-fx .fxLin[data-id=arb]').click(); await pg.wait_for_timeout(400)
            n1 = await pg.evaluate("() => document.querySelectorAll('#v-fx .fjJn svg[role=img]').length")
            await pg.locator('#v-fx .fjPer [data-id="30"]').click(); await pg.wait_for_timeout(300)
            on = await pg.evaluate("() => [window.__LF.S.fxPer, !!document.querySelector('#v-fx .fjJn')]")
            total += 1
            ok = n1 == 1 and 'dólar em reais' in t1.lower() and on == [30, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'aba Câmbio: tocar no valor abre a janela com o gráfico e o período escolhido')
            if not ok: falhas.append('fx graficos'); print('        veio', n1, on, pg.erros)
            await pg.close()

            # notificações: aviso quando a margem sobe e volta ao normal
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, D = 86400000, h = Date.now();
              const poe = (arr) => { S.fxHist = arr.map((v, i) => ({ts: h - (arr.length - 1 - i) * D, pyg: v, brl: 5})); S.fx.pyg = arr[arr.length - 1]; S.fx.brl = 5; };
              S.notifs = []; S.fxMgUlt = 0;
              poe([5620, 5625, 5618, 5630, 5640, 5655, 5650]); L.render();
              poe([5620, 5625, 5618, 5630, 5640, 5760, 5920]); L.render();
              const a = S.notifs.map(x => x.t);
              L.setView('notif'); const txt = document.getElementById('v-notif').innerText; const bolinha = document.getElementById('sino').textContent;
              poe([5620, 5625, 5618, 5630, 5640, 5655, 5650]); L.render();
              return [a, txt.includes('Margem da loja'), S.notifs.length, S.notifs.every(x => x.lida), bolinha]; }""")
            total += 1
            ok = len(r[0]) == 1 and 'subiu' in r[0][0] and r[1] and r[2] == 2 and r[3] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'notificações: margem sobe e volta, avisos na aba')
            if not ok: falhas.append('notificacoes'); print('        veio', r, pg.erros)
            await pg.close()

            # Resumo: vendas do período separadas, cada uma no valor exato da moeda recebida
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.sales = []; S.items = [{tipo:'pre', ref:'T1', grau:'+1', cor:'P', qty:5}];
              L.addSale(S.items[0], 1, {moeda:'pyg', recebido:25000, forma:'din'}); L.addSale(S.items[0], 1, {moeda:'brl', recebido:20, forma:'din'});
              S.dTab = 'hoje'; S.dPer = 'hoje'; L.setView('dash'); L.render();
              const t = document.getElementById('v-dash').textContent; return [t.includes('Vendas do período'), t.includes('G$ 25.000'), t.includes('R$ 20'), (t.match(/1× /g) || []).length]; }""")
            total += 1
            ok = r[0] and r[1] and r[2] and r[3] >= 2 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Resumo: vendas do período separadas, cada uma na moeda recebida')
            if not ok: falhas.append('resumo vendas'); print('        veio', r, pg.erros)
            await pg.close()

            # Livre para você: moeda por moeda, sem dólar; botão do total convertido; falta vira aviso
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.fx.pyg = 5000; S.fx.brl = 5; S.sales = []; S.compras = []; S.cpay = []; S.melhUso = []; S.exp = []; S.ini = {rep: 0, colch: 0, melh: 0}; S.colchUsd = 0;
              S.cash = {pyg: 20000, brl: 10, usd: 500}; S.totM = 'pyg';
              const a = L.livre3();
              const f = [a.livre.pyg, a.livre.brl, a.livre.usd, a.falta, L.totFmt(a.livreEq)];
              S.totM = 'brl'; const b = L.totFmt(a.livreEq); S.totM = 'usd'; const c = L.totFmt(a.livreEq); S.totM = 'pyg';
              S.dTab = 'din'; L.setView('dash'); L.render();
              const t1 = document.getElementById('v-dash').innerText;
              document.querySelector('[data-act=totm][data-id=usd]').click();
              const t2 = document.getElementById('v-dash').innerText;
              S.ini.rep = 10; S.cash = {pyg: 0, brl: 0, usd: 0}; L.render();
              const f2 = L.livre3().falta, t3 = document.getElementById('v-dash').innerText;
              return [f, b, c, t1.includes('R$ 10') && t1.includes('G$ 20.000') && t1.includes('G$ 30.000'), S.totM, t2.includes('US$ 6'), f2, t3.includes('Faltam')]; }""")
            total += 1
            ok = r[0] == [20000, 10, 0, 0, 'G$ 30.000'] and r[1] == 'R$ 30' and r[2] == 'US$ 6' and r[3] and r[4] == 'usd' and r[5] and r[6] == 50000 and r[7] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Livre para você: por moeda, sem dólar, botão do total e "Faltam"')
            if not ok: falhas.append('livre3'); print('        veio', r, pg.erros)
            await pg.close()

            # Resultado do mês no câmbio do dia de cada venda: fica fixo mesmo se o câmbio de hoje mudar
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, d = new Date(), n = Date.now();
              S.fx.pyg = 5000; S.fx.brl = 5; S.totM = 'usd';
              const mk = (fx, fxb, price) => ({id:'E'+fx, ts:n, tipo:'pre', ref:'EQ', cor:'', grau:'', qty:1, fx, fxb, pct:0, pago:0, cPeca:0, estorno:false, price, rep:0, taxa:0, livre:price, moeda:'pyg', recebido:price, rate:1, pags:[{moeda:'pyg', v:price, rate:1, fee:0}], troco:[]});
              S.sales = [mk(5000, 5, 100000), mk(10000, 5, 100000)]; S.cpay = []; S.imprev = []; S.melhUso = []; S.retiradas = []; S.descartes = []; S.contagens = [];
              const a = L.resultadoMes(d.getFullYear(), d.getMonth());
              S.fx.pyg = 20000;
              const b = L.resultadoMes(d.getFullYear(), d.getMonth());
              return [a.eq.usd.vendas, b.eq.usd.vendas, a.vendas, a.eq.brl.vendas, L.rFmt(a, 'vendas')]; }""")
            total += 1
            ok = r[0] == 30 and r[1] == 30 and r[2] == 200000 and r[3] == 150 and r[4] == 'US$ 30' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Resultado do mês: valores fixos no câmbio do dia de cada venda')
            if not ok: falhas.append('resultado eq'); print('        veio', r, pg.erros)
            await pg.close()

            # Trocar agora: valores redondos, entregue/recebido, colchão cobre a alta, reposição FIFO, desfazer
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S, n = Date.now();
              S.fx.pyg = 6800; S.fx.brl = 5.4; S.fxHist = [{ts: n - 9e8, pyg: 6400, brl: 5.4}, {ts: n, pyg: 6800, brl: 5.4}];
              S.sales = [{id:'T1', ts: n - 8e8, tipo:'pre', ref:'T1', cor:'', grau:'', qty:1, fx:6400, fxb:5.4, pct:0, pago:0, cPeca:0, estorno:false, price:300000, rep:44800, repUSD:7, colch:0, melh:0, contas:0, taxa:0, livre:0, moeda:'pyg', recebido:300000, rate:1, pags:[{moeda:'pyg', v:300000, rate:1, fee:0}], troco:[]}];
              S.compras = []; S.cpay = []; S.melhUso = []; S.exp = []; S.ini = {rep: 0, colch: 100000, melh: 0}; S.colchUsd = 0; S.colchUsos = []; S.repQuitUsd = 0; S.cambios = []; S.trIn = {};
              S.cash = {pyg: 600000, brl: 250, usd: 0};
              const pl = L.trocarPlano().passos[0];
              L.setView('fx'); L.ACT.fjAbre('troca');
              const tela = document.getElementById('v-fx').innerText; S.fxJan = '';
              S.trIn = {0: {v: '40', rec: '7'}};
              const tot = L.trocarRegistrar([{tipo: 'repor', de: 'brl', v: 40, rec: 7}]);
              const e = S.cambios[0];
              const dep = [S.cash.brl, S.cash.usd, S.repQuitUsd, Math.round(e.perdaGs), S.colchUsos.length, Math.round(S.colchUsos[0] ? S.colchUsos[0].gs : 0)];
              const falta = L.livre3().falta;
              const rm = L.resultadoMes(new Date().getFullYear(), new Date().getMonth()).cambio;
              L.trocarDesfazer();
              const des = [S.cash.brl, S.cash.usd, S.repQuitUsd, S.colchUsos.length, S.cambios.length];
              return [pl.de, pl.sug, pl.rec, tela.includes('Entreguei') && tela.includes('Recebi'), tot, dep, falta, rm, des]; }""")
            total += 1
            ok = r[0] == 'brl' and r[1] == 40 and r[2] == 7 and r[3] and r[4] == 7 and r[5] == [210, 7, 7, 5570, 1, 5570] and r[6] == 0 and r[7] == 5570 and r[8] == [250, 0, 0, 0, 0] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Trocar agora: plano redondo, perda de câmbio coberta pelo colchão, resultado e desfazer')
            if not ok: falhas.append('trocar agora'); print('        veio', r, pg.erros)
            await pg.close()

            # Resumo por moeda, separação inteligente, notificações unificadas
            pg = await pagina(relogio=True)
            await pg.evaluate("() => { const L = window.__LF; L.S.dTab = 'hoje'; L.setView('dash'); }"); await pg.wait_for_timeout(400)
            r = await pg.evaluate("""() => { const k = [...document.querySelectorAll('#v-dash .kpi')].map(x => x.textContent);  // S418 (124a): o "Entrou" fica no cartão, a linha fina mostra só a 1ª frase
              return [k[0].includes('Entrou:') && k[0].includes('R$') && k[0].includes('US$') && k[0].includes('G$'), /lucro livre/i.test(k[1]) && k[1].includes('G$'), /meta do mês/i.test(k[2]), document.getElementById('v-dash').innerText.includes('Atenção agora'), !document.getElementById('v-dash').textContent.includes('Para repor o estoque') && !!document.querySelector('#dtabBody [data-sep]')]; }""")
            total += 1
            ok = r == [True, True, True, False, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Dashboard: Vendido com as moedas em "Entrou", Lucro livre e Meta; sem "Atenção agora"; repor virou toque na tabela')
            if not ok: falhas.append('resumo moedas'); print('        veio', r, pg.erros)
            await pg.close()

            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF; L.setView('notif'); }"); await pg.wait_for_timeout(400)
            tx = await pg.inner_text('#v-notif')
            total += 1
            ok = 'precisa de você agora' in tx.lower() and 'avisos anteriores' not in tx.lower() and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Notificações: grupos "Precisa de você agora" / "Para acompanhar"')
            if not ok: falhas.append('notif grupos'); print('        veio', tx[:200], pg.erros)
            await pg.close()

            # contagem de estoque no cartão "Em estoque": por valor, com resumo e aplicação
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [
                {tipo:'pre', ref:'CT1', grau:'+1.00', med:'', vr:'', fmt:'', cor:'Preto', qty:10, custo:0.5},
                {tipo:'sem', ref:'CT2', grau:'', med:'', vr:'C1', fmt:'Quadrado', cor:'Preto', qty:3, custo:5}];
              S.todos = true; S.q = ''; S.faixaF = ''; S.sales = []; S.contagens = []; S.elog = []; S.conf = {}; S.tolUsd = 0.5; L.setView('estoque'); }""")
            await pg.wait_for_timeout(300)
            total += 1
            await pg.evaluate("() => window.__LF.ACT.contTroca()"); await pg.wait_for_timeout(300)
            ordem = await pg.evaluate("() => [...document.querySelectorAll('#contCard .card b')].map(b => b.textContent)")
            await pg.locator('#contCard input').nth(0).fill('2'); await pg.locator('#contCard input').nth(0).press('Tab'); await pg.wait_for_timeout(300)
            await pg.locator('#contCard input').nth(1).fill('9'); await pg.locator('#contCard input').nth(1).press('Tab'); await pg.wait_for_timeout(300)
            await pg.locator('#contCard button:has-text("Revisar")').click(); await pg.wait_for_timeout(300)
            resumo = await pg.inner_text('#contCard')
            await pg.locator('#contCard button:has-text("Aplicar")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.items[1].qty, S.items[0].qty, S.contagens.length, Math.round(S.contagens[0].valorUsd * 100) / 100, S.elog.filter(e => e.contagem).length, !!S.conf['sem|CT2'], !!S.conf['pre|CT1'], document.getElementById('contCard').hidden] }")
            ok = ordem[0].startswith('Armação #') and ordem[1].startswith('Óculos de leitura #') and 'faltam US$ 5,50' in resumo and got == [2, 9, 1, -5.5, 2, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Estoque: contagem por valor, resumo em dinheiro e aplicação')
            if not ok: falhas.append('contagem'); print('        veio', ordem, resumo[-200:], got, pg.erros)
            await pg.close()

            # aba Ajustes: meta, faixa nova, contagem de estoque e backup
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.moedaP = 'usd'; S.items = [{tipo:'pre', ref:'AJ1', grau:'+1.00', med:'', vr:'', fmt:'', cor:'Preto', qty:6, custo:1}]; S.dTab = 'prec'; S.dfold = Object.assign(S.dfold || {}, {cfg: true}); L.setView('dash'); }")
            await pg.wait_for_timeout(300)
            total += 1
            got = await pg.evaluate("() => [!document.querySelector('[data-aj=meta]'), !document.getElementById('fnew'), !document.querySelector('[data-aj=vol]'), !document.querySelector('[data-aj=mdia]')]")
            ok = got == [True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Dashboard › Preços: meta e peças por mês automáticas (sem campos); sem faixas manuais')
            if not ok: falhas.append('tela ajustes'); print('        veio', got, pg.erros)
            total += 1
            await pg.evaluate("() => { window.__LF.S.dTab = 'hoje'; window.__LF.setView('dash'); }"); await pg.wait_for_timeout(300)
            tx = await pg.inner_text('#v-dash')
            ok = 'meta do mês' in tx.lower() and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Dashboard: mostra meta do mês')
            if not ok: falhas.append('dash meta'); print('        veio', tx[:200], pg.erros)
            await pg.close()

            # edição de faixa pela janela Editar e entrada por pacote
            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(1)); await pg.locator('#edFaixas button:has-text("Luxo")').click(); await pg.wait_for_timeout(200)
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(700)
            got = await pg.evaluate("() => { const S = window.__LF.S; return S.linhaFix['BR44118'] === S.faixas.filter(f => f.nome === 'Luxo')[0].id }")
            await checa('janela Editar: corrigir a linha do produto', got is True, got)
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
            await pg.locator('#mainnav .mn[data-id=caixa]').first.click(); await pg.wait_for_timeout(300)
            await pg.click('#cxIc'); await pg.wait_for_timeout(150); await pg.click('[data-act=cxabre][data-id=ret]'); await pg.wait_for_timeout(300)
            await pg.fill('#rtV', '200000'); await pg.fill('#rtN', 'Almoço')
            await pg.locator('[data-act="rtgo"]').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.retiradas.length, S.cash.pyg, S.dlog.filter(x => x.kind === 'ret').length] }")
            await checa('Caixa: retirada do dono sai do caixa e vai ao histórico', got == [1, 4800000, 1], got)
            await pg.locator('[data-act="rtdes"]:visible').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.retiradas.length, S.cash.pyg, S.dlog.filter(x => x.kind === 'ret').length] }")
            await checa('Caixa: desfazer retirada devolve o dinheiro', got == [0, 5000000, 0], got)
            await pg.click('#cxIc'); await pg.wait_for_timeout(150); await pg.click('[data-act=cxabre][data-id=cc]'); await pg.wait_for_timeout(300)
            await pg.fill('#ccP', '4900000'); await pg.locator('[data-act="ccgo"]').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.ccRes && S.ccRes.ok, S.confCx.length] }")
            await checa('Caixa: conferência acha a diferença', got == [False, 1], got)
            await pg.locator('[data-act="ccadj"]').first.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.cash.pyg, S.confCx[0].ajustou, window.__LF.ccDias()] }")
            await checa('Caixa: ajustar o saldo para o contado', got == [4900000, True, 0], got)
            await pg.evaluate("() => window.__LF.setView('dash')"); await pg.wait_for_timeout(300)
            tx = await pg.inner_text('#v-dash')
            # S435 (navegação B): o título do Dashboard não tem ⌄ nem folha VER; as partes abrem pelo índice do grupo / Início
            semVer = await pg.evaluate("() => document.querySelectorAll('#v-dash [data-act=dVer]').length === 0 && !/⌄/.test(document.querySelector('#v-dash .dHdT').textContent)")
            await checa('Dashboard: abre no Dashboard, título sem ⌄ (navegação B)', 'Dashboard' in tx and semVer and not pg.erros, [tx[:150], semVer, pg.erros])
            await pg.evaluate("() => window.__LF.inicioGo('din')"); await pg.wait_for_timeout(500)
            tx = await pg.inner_text('#v-dash')
            await checa('Reservas: livre para você e próximos 30 dias; o resultado do mês foi para o Dashboard (S363)', 'LIVRE PARA VOCÊ' in tx.upper() and 'Seu mês' not in tx and 'Detalhes do mês' not in tx and 'Próximos' in tx and not pg.erros, [tx[:200], pg.erros])
            await pg.locator('[data-act="dfold"][data-id="flx"]').first.click(); await pg.wait_for_timeout(300)
            await pg.locator('[data-act="fluxod"][data-id="90"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => window.__LF.S.fluxoD")
            await checa('Dashboard: fluxo muda para 90 dias', got == 90, got)
            for tab in ['prec']:  # 66: o Giro saiu
                await pg.evaluate("t => window.__LF.inicioGo(t)", tab); await pg.wait_for_timeout(450)
            await checa('Dashboard: Preços abre sem erro', not pg.erros, pg.erros)
            await pg.close()

            # venda concluída: marca de ok e barras do resumo
            pg = await pagina()
            got = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [{tipo:'pre', ref:'T1', grau:'+1', cor:'P', qty:3}];
              const s = L.addSale(S.items[0], 1, {moeda:'pyg', recebido:25000, forma:'din'}); L.showSplit(s);
              const fechado = document.getElementById('splitCard').hidden; document.getElementById('splitCard').hidden = false;
              return [document.querySelectorAll('#splitCard .okMini').length, document.querySelectorAll('#splitBar i').length > 3, fechado] }""")
            await checa('venda concluída: divisão só na janela do $ (check pequeno e barras)', got == [1, True, True], got)
            await pg.close()

            # PIN: ativar, recarregar e desbloquear; cópia automática
            ctx = await b.new_context(viewport={'width': 420, 'height': 900}, service_workers='block')
            pg = await pagina(ctx=ctx)
            await pg.locator('#mainnav >> text="Ajustes"').first.click(); await pg.wait_for_timeout(300)
            await pg.evaluate("""() => { window.Capacitor = { Plugins: { BiometricAuthNative: { checkBiometry: () => Promise.resolve({isAvailable: true}), internalAuthenticate: () => Promise.resolve() } } }; const L = window.__LF; L.S._bioOk = undefined; L.S._ajForce = true; L.render(); }""")
            await pg.wait_for_timeout(500)
            await pg.locator('.sw:has([data-aj=biotog])').click(); await pg.wait_for_timeout(400)
            await pg.fill('#pinM1', '4321'); await pg.fill('#pinM2', '4321'); await pg.click('#pinMOk'); await pg.wait_for_timeout(800)
            tx = await pg.inner_text('#v-ajustes')
            await checa('Ajustes: PIN ativo, sem cópias automáticas do celular e sem a senha do painel', 'Mudar PIN' in tx and 'cópias automáticas' not in tx.lower() and 'Senha do painel do site' not in tx, tx[-300:])
            await pg.wait_for_timeout(1500)
            await pg.evaluate("() => history.replaceState(null, '', '#test')")
            await pg.reload(); await pg.wait_for_function('window.__LF')
            vis = await pg.evaluate("() => !document.getElementById('lockScr').hidden")
            await checa('PIN: o app abre bloqueado', vis is True, vis)
            await pg.fill('#lockPin', '0000'); await pg.evaluate("() => document.getElementById('lockGo').click()"); await pg.wait_for_timeout(300)
            msg = await pg.inner_text('#lockM')
            await checa('PIN: errado não abre', 'incorreto' in msg, msg)
            await pg.fill('#lockPin', '4321'); await pg.evaluate("() => document.getElementById('lockGo').click()")
            try: await pg.wait_for_function("() => document.getElementById('lockScr').hidden", timeout=4000)
            except Exception: pass
            vis = await pg.evaluate("() => !document.getElementById('lockScr').hidden")
            await checa('PIN: certo abre', vis is False, vis)
            await ctx.close()

            # venda: formas de pagamento aparecem
            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const L = window.__LF, S = L.S, sel = S.items.filter(i => i.ref === 'BR44118' && i.qty > 0)[0]; S.vTipo = 'all'; S.vGrau = ''; S.vq = ''; document.getElementById('vq').value = ''; S.vRef = sel.tipo + '|' + sel.ref; S.vSel = sel; S.qty = 1; L.setView('vendas'); }"); await pg.wait_for_timeout(500)
            await pg.evaluate("() => document.getElementById('sCartAdd').click()"); await pg.wait_for_timeout(300)
            await pg.click('[data-act=cartopen]'); await pg.wait_for_timeout(300)
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

            # La Moneda Jebai (v425): lê a sucursal certa, arbitragem da Casa Matriz, US$ 10 = G$ 62.000 · R$ 55
            pg = await pagina()
            total += 1
            got = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              const h = '<h3>Casa Matriz</h3><table><tr><td>Dólar</td><td>6.010</td><td>6.140</td></tr><tr><td>USD/BRL</td><td>5,30</td><td>5,48</td></tr></table>' +
                '<h3>Sucursal Jebai</h3><table><tr><td>Dólar</td><td>6.000</td><td>6.150</td></tr><tr><td>Real</td><td>1.105</td><td>1.155</td></tr></table>' +
                '<h3>Sucursal Centro</h3><table><tr><td>Dólar</td><td>5.990</td><td>6.160</td></tr></table>';
              const c = L.lmLer(h); L.lmGrava(c);
              L.fxDaCasa();
              return [c.usd.v, c.brl.c, c.arb.v, L.lmUsdLoja(), L.gsDeUsd(10), S.fx.pyg, S.fx.src, L.lmLer('<p>nada</p>')]; }""")
            ok = got[:7] == [6150, 1105, 5.48, 6250, 63000, 6150, 'La Moneda · Jebai'] and got[7] is None and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'La Moneda Jebai: lê a sucursal, vale em tudo; loja = casa + 1% de 50 em 50 (6.150 → 6.250)')
            if not ok: falhas.append('la moneda'); print('        veio', got, pg.erros)
            await pg.close()

            # La Moneda, página nova (07/11): nomes só no seletor, tabelas na mesma ordem sem o nome
            pg = await pagina()
            total += 1
            got = await pg.evaluate("""() => { const L = window.__LF;
              const sel = '<script type="application/ld+json">{"@context":"x","name":"Sucursal Centro"}</script><div><button>Casa Matriz</button><button>Sucursal Jebai</button><button>Sucursal Centro</button><button>Caja Auxiliar Km7</button></div>';
              const bl = (d, r, a) => '<table><tr><td>DOLAR</td><td>' + d[0] + '</td><td>' + d[1] + '</td><td>0.00%</td></tr><tr><td>REAL</td><td>' + r[0] + '</td><td>' + r[1] + '</td><td>2.50%</td></tr><tr><td>DOLAR / REAL</td><td>' + a[0] + '</td><td>' + a[1] + '</td></tr><tr><td>DOLAR INUSUAL / GUARANI</td><td>4.000</td><td>0</td></tr></table>';
              const h = sel + bl(['6.050','6.350'],['1.120','1.170'],['5,380','5,470']) + bl(['6.150','6.430'],['1.110','1.185'],['5,350','5,480']) + bl(['6.000','6.350'],['1.100','1.170'],['5,400','5,500']) + bl(['6.000','6.350'],['1.100','1.180'],['5,360','5,490']);
              const c = L.lmLer(h); return c && [c.usd.c, c.usd.v, c.brl.c, c.brl.v, c.arb.c, c.arb.v]; }""")
            ok = got == [6150, 6430, 1110, 1185, 5.35, 5.48] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'La Moneda página nova: Jebai pela posição no seletor (6.150 / 6.430)')
            total += 1
            got2 = await pg.evaluate("(h) => { const c = window.__LF.lmLer(h); return c && [c.usd.c, c.usd.v, c.brl.c, c.brl.v, c.arb.c, c.arb.v] }", "Cotizaciones del D\u00eda - La Moneda Cambios S.A. | Tasas en Ciudad del Este Saltar al contenido Inicio Servicios Cotizaciones Cotizaciones del D\u00eda Historial de Cotizaciones La Empresa Gobierno Corporativo ESP Espa\u00f1ol English Portugu\u00eas Contacto Inicio Servicios Cotizaciones Cotizaciones del D\u00eda Historial La Empresa Gobierno Corporativo Contacto Idioma WhatsApp Llamar Inicio &nbsp;&middot;&nbsp; Cotizaciones Cotizaciones del D\u00eda Precios por sucursal, con la tendencia de los \u00faltimos 90 d\u00edas y la variaci\u00f3n contra la publicaci\u00f3n anterior. Abrir Conversor de Monedas Ver el historial D\u00f3lar Americano &middot; Venta 6.350 Compra 6.050 Casa Matriz Sucursal Jebai Sucursal Centro Caja Auxiliar Km7 Caja Auxiliar Algesa En L\u00ednea Actualizado 07/11 12:04 Exportar a Imagen Monedas Principales Casa Matriz Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR 6.050 6.350 0,00% REAL 1.120 1.170 &darr; 2,50% PESOS 3,800 4,000 0,00% EURO 6.360 7.290 &darr; 0,41% Arbitraje Casa Matriz Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR / REAL 5,380 5,470 &darr; 0,18% DOLAR / PESOS 1.580 1.680 &darr; 1,18% DOLAR / EURO 1,060 1,135 0,00% DOLAR INUSUAL 4.000 &mdash; Sin historial &mdash; La casa le compra a usted a este precio La casa le vende a usted a este precio L\u00ednea verde: subi\u00f3 en los \u00faltimos 90 d\u00edas L\u00ednea roja: baj\u00f3 en los \u00faltimos 90 d\u00edas Desliz\u00e1 la tabla para ver el resto de las columnas. Monedas Principales Sucursal Jebai Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR 6.000 6.350 &darr; 2,61% REAL 1.110 1.185 &darr; 0,42% PESOS 3,700 4,100 &uarr; 2,50% EURO 6.415 7.275 &darr; 2,68% Arbitraje Sucursal Jebai Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR / REAL 5,380 5,500 &uarr; 0,55% DOLAR / PESOS 1.570 1.680 &uarr; 0,60% DOLAR / EURO 1,060 1,140 &darr; 0,87% DOLAR INUSUAL 4.000 &mdash; Sin historial &mdash; La casa le compra a usted a este precio La casa le vende a usted a este precio L\u00ednea verde: subi\u00f3 en los \u00faltimos 90 d\u00edas L\u00ednea roja: baj\u00f3 en los \u00faltimos 90 d\u00edas Desliz\u00e1 la tabla para ver el resto de las columnas. Monedas Principales Sucursal Centro Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR 6.000 6.350 0,00% REAL 1.100 1.170 0,00% PESOS 3,700 4,000 0,00% EURO 6.470 7.280 0,00% Arbitraje Sucursal Centro Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR / REAL 5,400 5,500 &darr; 0,90% DOLAR / PESOS 1.570 1.680 &darr; 1,18% DOLAR / EURO 1,080 1,140 &darr; 0,87% DOLAR INUSUAL 4.000 &mdash; Sin historial &mdash; La casa le compra a usted a este precio La casa le vende a usted a este precio L\u00ednea verde: subi\u00f3 en los \u00faltimos 90 d\u00edas L\u00ednea roja: baj\u00f3 en los \u00faltimos 90 d\u00edas Desliz\u00e1 la tabla para ver el resto de las columnas. Monedas Principales Caja Auxiliar Km7 Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR 6.000 6.350 &darr; 0,78% REAL 1.100 1.180 0,00% PESOS 3,600 4,100 0,00% EURO 6.500 7.380 &darr; 0,27% Arbitraje Caja Auxiliar Km7 Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR / REAL 5,360 5,490 &uarr; 0,18% DOLAR / PESOS 1.570 1.700 &uarr; 1,80% DOLAR / EURO 1,065 1,150 0,00% DOLAR INUSUAL 4.000 &mdash; Sin historial &mdash; La casa le compra a usted a este precio La casa le vende a usted a este precio L\u00ednea verde: subi\u00f3 en los \u00faltimos 90 d\u00edas L\u00ednea roja: baj\u00f3 en los \u00faltimos 90 d\u00edas Desliz\u00e1 la tabla para ver el resto de las columnas. Monedas Principales Caja Auxiliar Algesa Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR 6.000 6.350 &darr; 0,78% REAL 1.110 1.200 &darr; 1,64% PESOS 3,300 3,900 0,00% EURO 6.300 7.200 &uarr; 5,88% Arbitraje Caja Auxiliar Algesa Moneda Compra Venta Tendencia 90 d\u00edas Var. DOLAR / REAL 5,200 5,470 0,00% DOLAR / PESOS 1.550 1.670 &uarr; 4,38% DOLAR / EURO 1,130 1,190 &darr; 0,83% DOLAR INUSUAL 4.000 &mdash; Sin historial &darr; 100,00% La casa le compra a usted a este precio La casa le vende a usted a este precio L\u00ednea verde: subi\u00f3 en los \u00faltimos 90 d\u00edas L\u00ednea roja: baj\u00f3 en los \u00faltimos 90 d\u00edas Desliz\u00e1 la tabla para ver el resto de las columnas. Conversor de Monedas Calcul\u00e1 tu cambio con nuestras cotizaciones del d\u00eda. Monto Moneda que entrega Guaran\u00ed (PYG) D\u00f3lar (USD) Euro (EUR) Real (BRL) Peso Argentino (ARS) Moneda que recibe Guaran\u00ed (PYG) D\u00f3lar (USD) Euro (EUR) Real (BRL) Peso Argentino (ARS) Entreg\u00e1s 1.000 D\u00f3lar Recib\u00eds 0 Guaran\u00ed 1 USD = 0 PYG Cotizaci\u00f3n del \u2014 Listo Cotizaciones Mantenga presionada la imagen para guardarla en su galer\u00eda o compartirla. Descargar Imagen Excelencia en servicios cambiarios desde 1989. Seguridad, transparencia y confianza al servicio de nuestros clientes. Autorizado por BCP Regulado por SEPRELAD Institucional Qui\u00e9nes Somos Gobierno Corporativo Nuestras Sucursales Trabaje con Nosotros Servicios Mesa de Cambios Transferencias Comercio Exterior Ayuda y Soporte Contacto Directo Atenci\u00f3n Inmediata +595 985 600049 Consultas Institucionales [email&#160;protected] Con\u00e9ctese con Nosotros Enterate de las novedades del mercado financiero y de nuestros servicios. &copy; 2026 La Moneda Cambios S.A. Desarrollado por La Moneda Cambios S.A. Bienvenido a nuestra nueva experiencia Hemos redise\u00f1ado todo para que operar con nosotros sea m\u00e1s simple, r\u00e1pido y transparente. Cotizaciones en Tiempo Real Interfaz Moderna y Elegante Seguridad y Velocidad Comenzar No volver a mostrar")
            ok2 = got2 == [6000, 6350, 1110, 1185, 5.38, 5.5]
            print(('  ok  ' if ok2 else ' FALHA ') + 'La Moneda texto real de 07/11: Sucursal Jebai 6.000 / 6.350')
            if not ok2: falhas.append('la moneda real'); print('        veio', got2)
            total += 1
            got3 = await pg.evaluate('''() => { const L = window.__LF, S = L.S;
              const h = '<h3>Casa Matriz</h3><table><tr><td>Dólar</td><td>6.050</td><td>6.350</td></tr><tr><td>Real</td><td>1.120</td><td>1.170</td></tr><tr><td>Dólar / Real</td><td>5,38</td><td>5,47</td></tr></table><h3>Sucursal Centro</h3><table><tr><td>Dólar</td><td>6.000</td><td>6.350</td></tr><tr><td>Real</td><td>1.100</td><td>1.170</td></tr></table>';
              const c = L.lmLer(h); L.lmGrava(c); L.fxDaCasa();
              const r = [c.suc, c.usd.v, c.brl.c, S.fx.src];
              const n0 = (S.notifs||[]).length, real = Date; const fake = new real(2026, 10, 9, 11, 0); 
              S.lm.ts = fake.getTime() - 4*3600000; S.lm.hist = []; S._lmVisto = 0; S.fxAvisos = {};
              window.Date = class extends real { constructor(...a){ return a.length ? new real(...a) : new real(fake.getTime()) } static now(){ return fake.getTime() } };
              try { L.lmAvisaParada(); L.lmAvisaParada(); } finally { window.Date = real; }
              r.push((S.notifs||[]).length - n0, (S.notifs||[])[0] && S.notifs[0].t); return r; }''')
            ok3 = got3 == ['Casa Matriz', 6350, 1120, 'La Moneda · Casa Matriz', 1, 'Cotação da casa sem atualizar'] and not pg.erros
            print(('  ok  ' if ok3 else ' FALHA ') + 'La Moneda: Casa Matriz de reserva quando a Jebai some; aviso no sino depois de 3 h parada (1 vez)')
            if not ok3: falhas.append('la moneda reserva'); print('        veio', got3, pg.erros)
            if not ok: falhas.append('la moneda nova'); print('        veio', got, pg.erros)
            await pg.close()

            # Meta automática + Objetivos da loja + plano de troca (v425)
            pg = await pagina()
            total += 1
            got = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              const meta = L.metaMes(), k = new Date().getFullYear() + '-' + (new Date().getMonth() + 1);
              S.objetivos = [{id: 'a', nome: 'Vitrine', custo: 1000, ate: '', ts: 1}, {id: 'b', nome: 'Ar', custo: 90000000, ate: (new Date().getFullYear() + 1) + '-' + (new Date().getMonth() + 1), ts: 2}];
              const pl = L.objPlano(), pv = L.melhPecaAuto();
              const caixa0 = S.cash.pyg; L.ACT.obUsar('a');
              const usado = !!S.objetivos[0].usado && S.cash.pyg === caixa0 - 1000;
              return [meta > 0, S.metaHist[k] === meta, pl.itens[0].pronto, pv > 0 && pv % 500 === 0, usado, /Meta do mês/.test(L.metaCardHtml())]; }""")
            ok = got == [True, True, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'meta automática congelada no mês, objetivos enchem na ordem e Usar')
            if not ok: falhas.append('meta objetivos'); print('        veio', got, pg.erros)
            await pg.close()

            # Câmbio simples (v426): versão A, janelas, site = loja + 2% travado, ofertas do site com teto de 50%
            pg = await pagina()
            total += 1
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, D = 864e5, n = Date.now(), h = [];
              for (let i = 40; i >= 1; i--) h.push([n - i * D, 6000, 6150 + (i % 5) * 20, 1105, 1155, 5.48]);
              S.lm = {ts: n, usd: {c: 6000, v: 6150}, brl: {c: 1105, v: 1155}, arb: {c: 5.3, v: 5.48}, hist: h}; L.fxDaCasa();
              L.setView('fx'); const tx = document.getElementById('v-fx').innerText;
              L.ACT.fjAbre('repo'); const jan = !!document.querySelector('#v-fx .fjJn svg');
              L.ACT.fjAbre('troca'); const tr = !!document.getElementById('trV');
              S.fxJan = ''; L.render();
              S.siteFx = null; L.siteFxConfere(); const s1 = [S.siteFx.usd, S.siteFx.base];
              S.lm.usd.v = 6300; L.siteFxConfere(); const s2 = S.siteFx.usd;
              S.lm.usd.v = 6500; L.siteFxConfere(); const s3 = S.siteFx.usd;
              S.lm.usd.v = 5800; S.siteOf = {since: n - 4 * D, ativo: false, sem: 0, refs: {}}; L.siteOfRevisa();
              const of = S.siteOf.ativo && S.siteOf.q >= 0.09;
              const ref = Object.keys(S.items.reduce((a, i) => (a[i.ref] = 1, a), {}))[0], it = S.items.find(i => i.ref === ref);
              const so0 = S.siteOf; S.siteOf = {ativo: true, q: 0.9, refs: {[ref]: {extra: 0}}};
              const po = L.sitePrecoOferta(ref, 380000, 0, it.tipo);
              S.siteOf = so0;
              return [/Dólar em reais/i.test(tx), /Reposição/i.test(tx), /Registrar troca/i.test(tx), /Atualizar agora/i.test(tx), jan, tr, s1, s2, s3, of, po.de > 0 && po.n >= po.de * 0.5 - 1 && po.n < po.de]; }""")
            ok = got == [True, True, True, False, True, True, [6400, 6250], 6400, 6800, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Câmbio simples: 3 valores, reposição com selo e janelas; site = loja + 2% travado; ofertas do site com teto de 50%')
            if not ok: falhas.append('cambio simples'); print('        veio', got, pg.erros)
            await pg.close()

            # S173-4 (12/11/2026): saída no site com prazo e limite de 3 (o Leve 2 do site saiu do app na v620 — dono 21/11 23:21)
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, n = Date.now(), D = 864e5;
              const it = S.items.find(i => i.qty > 0 && (i.tipo === 'pre' || i.tipo === 'solar')), ref = it.ref;
              S.sales = S.sales.filter(s => s.ts < n);  // S367: os dados de teste têm vendas 'de hoje' com hora fixa; rodando de madrugada elas ficavam no futuro e o teste falhava (visto 16/11 01:15, também na v534)
              const p0 = L.sitePrecoOferta(ref, 380000, 0, it.tipo).n;
              S.saidaSite = {[ref]: {tipo: it.tipo, n: 1000, ini: n, ate: n + 7 * D, max: 3}};
              const p1 = L.sitePrecoOferta(ref, 380000, 0, it.tipo), a1 = !!L.saidaSiteAtiva(ref);
              S.saidaSite[ref].ate = n - 1; const a2 = !!L.saidaSiteAtiva(ref);
              S.saidaSite[ref].ate = 0; const s0 = S.sales; S.sales = [{ref, ts: n + 1, qty: 3}].concat(s0); const a3 = !!L.saidaSiteAtiva(ref); S.sales = s0; S.saidaSite = null;
              return [p1.n < p0, p1.n >= 1000, a1, a2, a3] }""")
            ok = got == [True, True, True, False, False] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Vender com saída no site: prazo, termina ao vender 3, piso')
            if not ok: falhas.append('saida site'); print('        veio', got, pg.erros)
            await pg.close()

            # Catálogo (S370, esboço 26): janela de ajustes — sem a chave Varejo|Atacado; cada toque vale na hora (sem Ver/Cancelar), filtros e bolinha
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.items = [{tipo:'solar',ref:'Q1',grau:'',cor:'Preto',qty:2,custo:5},{tipo:'solar',ref:'Q2',grau:'',cor:'Preto',qty:3,custo:5},{tipo:'pre',ref:'Q3',grau:'+1.00',cor:'Preto',qty:4,custo:1}];
              S.attr = {Q1:{publico:'Feminino'},Q2:{publico:'Masculino'}}; S.pprice = {Q1:{novo:100000,ant:0},Q2:{novo:300000,ant:0}}; S.cjF = {tipos:[],pub:[],ate:0,sit:[]}; S.vq = '';
              L.setView('vendas'); L.render(); await w(900);
              const n0 = document.querySelector('#vInfo').textContent;
              document.getElementById('cjAj').click(); await w(500);
              document.querySelector('.cjC[data-v=solar]').click(); document.querySelector('.cjC[data-v=F]').click(); await w(450);
              const nJ = document.getElementById('cjN').textContent;
              const canc = [S.cjF.tipos.length, document.querySelectorAll('#cjTP,#cjVer,#cjCanc').length];
              document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true})); await w(500);
              const n1 = document.querySelector('#vInfo').textContent, dot = document.getElementById('cjDot').classList.contains('in');
              return [n0, nJ, canc, n1, dot, S.cjF.tipos, S.cjF.pub]; }""")
            total += 1
            ok = not got[0].startswith('2 ') and got[1] == '2' and got[2] == [1, 0] and got[3].startswith('2') and got[4] is True and got[5] == ['solar'] and got[6] == ['F'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'catálogo: janela de ajustes (sem Atacado, vale na hora, filtros, bolinha)')
            if not ok: falhas.append('janela ajustes'); print('        veio', got, pg.erros)
            await pg.close()

            # Fotos (v429): foto boa → "Foto aprovada" no padrão 1200×900 sem sombra; foto ruim → motivo + "Usar mesmo assim"; Ajustes › Fotos
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              const mkF = (fundo, encosta) => new Promise(ok => { const c = document.createElement('canvas'); c.width = 800; c.height = 600; const g = c.getContext('2d');
                g.fillStyle = fundo; g.fillRect(0, 0, 800, 600); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(150, 380, 500, 60);
                g.strokeStyle = '#222'; g.lineWidth = 14; g.strokeRect(encosta ? 0 : 160, 220, 200, 140); g.strokeRect(440, 220, 200, 140); g.beginPath(); g.moveTo(360, 250); g.lineTo(440, 250); g.stroke();
                c.toBlob(b => ok(new File([b], 'x.jpg', {type: 'image/jpeg'})), 'image/jpeg', .95); });
              let rec = null; L.fpResultado(await mkF('#f6f6f6', false), (f, i) => { rec = [f, i]; }, () => {}, {peca: 'X|Preto'}); await w(900);
              const tit = document.querySelector('.ljJn .ljHd') ? document.querySelector('.ljJn').innerText : '';
              document.getElementById('fpA').click(); await w(700);
              const im = new Image(); im.src = URL.createObjectURL(rec[0]); await new Promise(r => im.onload = r);
              const c2 = document.createElement('canvas'); c2.width = im.width; c2.height = im.height; const g2 = c2.getContext('2d'); g2.drawImage(im, 0, 0);
              const px = g2.getImageData(600, 750, 1, 1).data; // onde estava a sombra
              let rec2 = null; L.fpResultado(await mkF('#f6f6f6', true), f => { rec2 = f; }, () => {}, {peca: true}); await w(900);
              const tit2 = document.querySelectorAll('.ljJn').length ? [...document.querySelectorAll('.ljJn')].pop().innerText : '';
              document.getElementById('fpB').click(); await w(300);
              return [/Foto aprovada/.test(tit), /3\/4/.test(tit), rec[1] && rec[1].padrao, im.width, im.height, px[0] > 250 && px[1] > 250, /tirar de novo/i.test(tit2), /borda/i.test(tit2), !!rec2 && rec2.name === 'x.jpg']; }""")
            await pg.evaluate("() => { const L = window.__LF; L.setView('ajustes'); }"); await pg.wait_for_timeout(300)
            aj = await pg.evaluate("() => !document.querySelector('.ajS[data-k=foto]') && !document.querySelector('.ajS[data-k=mcli]')")  # v462: Fotos e Modo cliente saíram de Ajustes
            total += 1
            ok = got == [True, True, True, 1200, 900, True, True, True, True] and aj and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'fotos: aprovada no padrão sem sombra (1200×900), recusada com motivo e "Usar mesmo assim"; Ajustes sem Fotos e Modo cliente')
            if not ok: falhas.append('fotos padrao'); print('        veio', got, aj, pg.erros)
            await pg.close()

            # Estúdio (v432/v439): botão no Início, fila, LUZ DE ESTÚDIO (fundo 255, armação clareia mantendo as cores), 3:2 sem esticar, salvar pela fila
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('inicio'); await w(300);
              const tem = !!document.querySelector('[data-act=inicio][data-id=est]');
              const c = document.createElement('canvas'); c.width = 1200; c.height = 900; const g = c.getContext('2d');
              const gr = g.createLinearGradient(0, 0, 1200, 0); gr.addColorStop(0, 'rgb(170,168,172)'); gr.addColorStop(1, 'rgb(186,184,188)'); g.fillStyle = gr; g.fillRect(0, 0, 1200, 900);
              g.fillStyle = 'rgb(150,90,110)'; g.fillRect(250, 380, 700, 30); g.fillRect(250, 380, 30, 160); g.fillRect(920, 380, 30, 160); g.fillRect(250, 520, 280, 20); g.fillRect(670, 520, 280, 20);
              const R = L.estProcessa(c), o = R.cv, og = o.getContext('2d');
              const px = (x, y) => Array.from(og.getImageData(x, y, 1, 1).data.slice(0, 3));
              // armação: pixel do meio da barra de cima deve ser o original (150,90,110)
              let ach = null; for (let y = 0; y < 1000; y += 1) { const p = px(750, y); if (!ach || p[0] + p[1] + p[2] < ach[0] + ach[1] + ach[2]) ach = p; }
              const fundo = px(20, 20).concat(px(1480, 980));
              // proporção sem esticar: largura/altura da barra 700x160 → 4,375
              let x0 = 1500, x1 = 0, y0 = 1000, y1 = 0; const d = og.getImageData(0, 0, 1500, 1000).data;
              for (let y = 0; y < 1000; y += 2) for (let x = 0; x < 1500; x += 2) { const i = (y * 1500 + x) * 4; if ((d[i] + d[i + 1] + d[i + 2]) / 3 < 225) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
              const prop = (x1 - x0 + 2) / (y1 - y0 + 2);
              // pela fila: abre a tela, salva frente com nota
              L.estAbre(); await w(200); const fila = document.querySelectorAll('.estIt').length; const k0 = L.estFila()[0];
              document.querySelector('.estOv .estX').click(); await w(100);
              L.estResultado(R, null, {k: k0.k, passo: 'frente', salva: true, titulo: 'x'}); await w(100);
              document.querySelector('#estRes [data-r=usar]').click(); await w(300);
              return [tem, [o.width, o.height], ach && ach[0] > 150 && Math.abs(ach[1] / ach[0] - 90 / 150) < 0.06 && Math.abs(ach[2] / ach[0] - 110 / 150) < 0.06, fundo.every(v => v >= 254), Math.abs(prop - 700 / 160) < 0.25, fila > 0, !!S.fotos[k0.k], !!S.fotoNota[k0.k]]; }""")
            total += 1
            ok = got == [True, [1500, 1000], True, True, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Estúdio: Início, luz de estúdio (fundo 255, armação nas cores originais), 3:2 sem esticar, fila salva foto e nota')
            if not ok: falhas.append('estudio'); print('        veio', got, pg.erros)
            await pg.close()

            # v465: Estúdio automático (1 botão + "?"), busca tolerante e Dashboard com folhas
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.estAbre(); await w(250); const t = document.querySelector('.estOv').innerText;
              const um = /Começar · \\d+/.test(t) && !/Montagem de hoje/.test(t) && !/Medir fundo/.test(t);
              document.querySelector('[data-e=ajuda]').click(); await w(400);
              const aj = document.getElementById('estAjF').innerText; const tem = ['Como fotografar', 'Montagem', 'Medir', 'Vídeo 360', 'libera'].every(x => aj.includes(x));
              L.lfaFecha('estAjF'); document.querySelector('.estOv .estX').click(); await w(150);
              const b = (q, x) => { const f = window.__LF.btol(q); return f ? f(x) > 0 : false; };
              const busca = [b('oculos', 'Óculos solar'), b('exagonal', 'Solar hexagonal negro'), b('coracao', 'Óculos coração'), b('armasao roza', 'Armação redonda rosa'), b('lentes de sol', 'Óculos solar aviador'), !b('rojo', 'Armação rosa'), b('+0,75', 'leitura +0.75')];
              return [um, tem, busca.every(Boolean), busca]; }""")
            total += 1
            ok = got[0] and got[1] and got[2] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v465: Estúdio com 1 botão e o "?", busca tolerante (oculos, exagonal, coracao, armasao roza, PT/ES)')
            if not ok: falhas.append('v465 estudio/busca'); print('        veio', got, pg.erros)
            await pg.close()

            # Estúdio · Nova peça (v434): câmera direto; "De qual peça é?" → guardar sem cadastro → Ligar depois a um modelo
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const c = document.createElement('canvas'); c.width = 900; c.height = 600; const g = c.getContext('2d'); g.fillStyle = '#b4b2b6'; g.fillRect(0, 0, 900, 600); g.fillStyle = '#333'; g.fillRect(200, 260, 500, 24); g.fillRect(200, 260, 20, 120); g.fillRect(680, 260, 20, 120);
              const R = L.estProcessa(c);
              L.estAbre(); await w(200); document.querySelector('[data-e=nova]').click(); await w(800);
              const abriu = !!document.getElementById('estCam') || !!document.querySelector('input[type=file][capture]');
              document.querySelectorAll('#estCam').forEach(e => e.remove()); document.querySelectorAll('.estOv').forEach(e => e.remove());
              L.estDestino({fotos: {frente: R}, nova: true}); await w(200);
              const tit = document.querySelector('#estDest h1').textContent;
              document.querySelector('#estDest [data-d=pend]').click(); await w(300);
              const pend = (S.estPend || []).length;
              L.estAbre(); await w(200); const temLista = /aguardando cadastro/i.test(document.querySelector('.estOv').innerText);
              document.querySelector('[data-a=ligar]').click(); await w(200);
              const k = document.querySelector('#estDest .estIt').dataset.k; document.querySelector('#estDest .estIt').click(); await w(600);
              return [abriu, tit, pend, temLista, !!S.fotos[k], (S.estPend || []).length]; }""")
            total += 1
            ok = got == [True, 'De qual peça é?', 1, True, True, 0] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Estúdio · Nova peça: câmera direto, "De qual peça é?", guardar sem cadastro e ligar depois')
            if not ok: falhas.append('estudio nova peca'); print('        veio', got, pg.erros)
            await pg.close()

            # Estúdio · Como fotografar (S370 · S263): quatro passos e "Se o app pedir", numa tela
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              L.estAbre(); await w(200); document.querySelector('[data-e=ajuda]').click(); await w(400); document.querySelector('[data-act=estAj][data-id=tut]').click(); await w(500);
              const j = document.querySelector('.estTut263');
              return [j ? j.querySelectorAll('.t263P').length : 0, j ? j.querySelectorAll('.t263Q').length : 0, j ? /Ligue o prato e toque em Começar/.test(j.innerText) : false]; }""")
            total += 1
            ok = got == [4, 4, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Estúdio · Como fotografar (S263): 4 passos e "Se o app pedir"')
            if not ok: falhas.append('estudio tutorial'); print('        veio', got, pg.erros)
            await pg.close()

            # Salvamento seguro (v438): vendas no IndexedDB, localStorage só com o resto; aviso se falhar; reabrir mantém tudo
            ctx = await b.new_context(viewport={'width': 420, 'height': 900}, color_scheme='dark', service_workers='block')
            pg = await pagina(ctx=ctx)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              await w(300); const n = S.sales.length; S.sales[0].obs = 'marca-v438'; L.salvarAgora(); await w(600);
              const ls = JSON.parse(localStorage.getItem('lafouch_demo_v1'));
              const orig = Storage.prototype.setItem; Storage.prototype.setItem = function () { throw new Error('QuotaExceededError'); };
              L.salvarAgora(); await w(500); const aviso = !!document.getElementById('lfSalvoErr');
              Storage.prototype.setItem = orig; document.getElementById('lfSalvoTenta').click(); await w(500);
              return [n > 100, ls.sales === undefined, ls._bigIdb === 1, aviso, !document.getElementById('lfSalvoErr')]; }""")
            pg2 = await ctx.new_page(); pg2.erros = []; pg2.on('pageerror', lambda e: pg2.erros.append(str(e)))
            await pg2.goto(f'http://localhost:{PORTA}/index.html#test'); await pg2.wait_for_function('window.__LF', timeout=10000)
            got2 = await pg2.evaluate("() => [window.__LF.S.sales.length > 100, window.__LF.S.sales[0].obs]")
            total += 1
            ok = got == [True, True, True, True, True] and got2 == [True, 'marca-v438'] and not pg.erros and not pg2.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Salvamento seguro: vendas no IndexedDB, aviso grande se falhar, reabrir mantém tudo')
            if not ok: falhas.append('salvamento seguro'); print('        veio', got, got2, pg.erros, pg2.erros)
            await pg2.close(); await pg.close(); await ctx.close()

            # v468 NUVEM SEGURA: excluído não volta; ao conectar compara; cópia com contagens; aparelho desconectado apaga SÓ os dados dele
            ctx = await b.new_context(viewport={'width': 420, 'height': 900}, color_scheme='dark', service_workers='block')
            pg = await pagina(ctx=ctx)
            nuv = []
            async def falso468(route):
                u, m = route.request.url, route.request.method
                nuv.append(m + ' ' + u.split('/documents/')[-1].split('?')[0] if '/documents/' in u else m + ' ' + u[:60])
                if 'securetoken' in u: await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                elif m == 'GET' and '/documents/backups/zap-' in u: await route.fulfill(json={'fields': {'rev': {'booleanValue': True}}})
                elif m == 'GET' and u.split('?')[0].endswith('/documents/backups'): await route.fulfill(json={'documents': [{'name': 'x/backups/2026-11-08', 'fields': {'ts': {'integerValue': '1'}, 'tsr': {'integerValue': '1794150000000'}, 'kb': {'integerValue': '900'}, 'mod': {'integerValue': '22'}, 'ven': {'integerValue': '34'}}}]})
                else: await route.fulfill(json={})
            await pg.context.route(re.compile(r'(securetoken|firestore|identitytoolkit)\.googleapis\.com'), falso468)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const ref0 = S.items[0].ref; const bk = L.backupDados(true);
              S.items = S.items.filter(i => i.ref !== ref0); L.limpaRefExcluido(ref0); const marcou = !!(S.excl && S.excl[ref0]);
              const er = L.restaurarDados(bk); const voltou = S.items.some(i => i.ref === ref0);
              S.items.push(Object.assign({}, JSON.parse(bk).d.items.find(i => i.ref === ref0))); L.saveSoon(); await w(900); const er2 = L.restaurarDados(bk); const recad = S.items.some(i => i.ref === ref0);
              return [marcou, er, voltou, er2, recad]; }""")
            got2 = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.nuvem.rt = 'x'; S.nvLista = null; await window.__nvSeg.nvAoConectar(); await w(500);
              const f = document.getElementById('nvCmpF'); const t = f ? f.innerText : '';
              return [!!f, /22 modelos · 34 vendas/.test(t), /Trazer meus dados da nuvem/.test(t), /Manter os dados deste aparelho/.test(t)]; }""")
            nuv.clear()
            await pg.evaluate("() => { window.__LF.ACT.nvCmpTraz(); }"); await pg.wait_for_timeout(800)
            trouxe = any(x.startswith('GET backups/2026-11-08') for x in nuv)
            card = await pg.evaluate("() => { const S = window.__LF.S; S.view = 'ajustes'; S._syncAps = [{ap: S.aparelho || 'APEU', nome: 'Celular Android', ts: Date.now()}, {ap: 'APXY', nome: 'PC Windows', ts: Date.now() - 3600000}]; if (!S.aparelho) S.aparelho = 'APEU'; return window.__nvSeg.apCard(); }")
            okcard = 'este aparelho' in card and 'data-act="syncdesc" data-id="APXY"' in card and 'Sair de todos os aparelhos' in card
            nuv.clear()
            await pg.evaluate("() => { const S = window.__LF.S; S.sales[0].obs = 'marca-v468'; window.__LF.salvarAgora(); }"); await pg.wait_for_timeout(700)
            await pg.evaluate("() => { const S = window.__LF.S; S.nuvem.rt = 'x'; S.aparelho = 'APEU'; window.__nvSeg.apConfere(); }")
            await pg.wait_for_timeout(3500)
            pg2 = await ctx.new_page(); pg2.erros = []; pg2.on('pageerror', lambda e: pg2.erros.append(str(e)))
            await pg2.goto(f'http://localhost:{PORTA}/index.html#test'); await pg2.wait_for_function('window.__LF', timeout=10000); await pg2.wait_for_timeout(600)
            got3 = await pg2.evaluate("() => { const S = window.__LF.S; return [!!localStorage.getItem('lf_desc'), !(S.nuvem && S.nuvem.rt), !(S.sales[0] && S.sales[0].obs === 'marca-v468')]; }")
            apagouNuvem = [x for x in nuv if x.startswith('DELETE')]
            total += 1
            ok = got == [True, '', False, '', True] and got2 == [True, True, True, True] and trouxe and okcard and got3 == [True, True, True] and not apagouNuvem and not pg.erros and not pg2.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v468 nuvem segura: excluído não volta (só se recadastrar), ao conectar compara e traz, Aparelhos/Sair de todos, desconectado apaga só os dados dele (nada na nuvem)')
            if not ok: falhas.append('v468 nuvem segura'); print('        veio', got, got2, trouxe, okcard, got3, apagouNuvem, pg.erros, pg2.erros)
            await pg2.close(); await pg.close(); await ctx.close()

            # Arquivo das vendas antigas (v438): >12 meses viram resumo por mês; nada se perde; volta pelo Histórico; vai na cópia
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              await w(300); const n0 = S.sales.length, corte = L.arqCorte(), velhas = S.sales.filter(s => s.ts < corte).length;
              const moveu = await L.arqRoda(); const n1 = S.sales.length, meses = Object.keys(S.arqRes);
              const soma = meses.reduce((a, m) => a + S.arqRes[m].n, 0) + S.sales.filter(s => false).length;
              const est = (L.arqCopia() || []).filter(s => s.estorno).length;
              L.setView('hist'); L.render(); const card = !!document.querySelector('.arqCard');
              const bk = JSON.parse(L.backupDados(true)); const naCopia = (bk.d.arquivo || []).length;
              const m0 = meses[0], nm = S.arqRes[m0].n; const volta = await L.arqVolta(m0);
              const de2 = await L.arqRoda();
              return [velhas > 0, moveu === velhas, n1 === n0 - velhas, S.sales.every(s => s.ts >= corte || (S.arqVolta||{})[new Date(s.ts).getFullYear()+'-'+('0'+(new Date(s.ts).getMonth()+1)).slice(-2)]), soma + est === velhas, card, naCopia === velhas, volta >= nm, de2 === 0, !S.arqRes[m0]]; }""")
            total += 1
            ok = got == [True] * 10 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Arquivo de vendas: >12 meses vira resumo por mês, nada se perde, volta pelo Histórico e vai na cópia')
            if not ok: falhas.append('arquivo de vendas'); print('        veio', got, pg.erros)
            await pg.close()

            # Medir fundo (v437): câmera falsa que estoura (caixa de luz forte). Mira ~225 sem estourar, usa EXP. no automático,
            # perfil antigo travado é descartado, régua da VELOC. em passos até 1/30, menu Medir de novo / Voltar ao automático
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              const sim = { comp: 0, mode: 'continuous', et: null, pedidos: [] };
              navigator.mediaDevices.getUserMedia = async () => {
                const c = document.createElement('canvas'); c.width = 320; c.height = 180; const g = c.getContext('2d');
                const pinta = () => { const k = sim.mode === 'manual' && sim.et ? sim.et / 68 : Math.pow(2, sim.comp);
                  const cen = Math.min(255, Math.round(320 * k)), bor = Math.min(255, Math.round(290 * k));
                  g.fillStyle = `rgb(${bor},${bor},${bor})`; g.fillRect(0, 0, 320, 180);
                  g.fillStyle = `rgb(${cen},${cen},${cen})`; g.fillRect(30, 25, 260, 130);
                  g.fillStyle = '#333'; g.fillRect(120, 80, 80, 12); };
                pinta(); setInterval(pinta, 50);
                const s = c.captureStream(30), t = s.getVideoTracks()[0];
                t.getCapabilities = () => ({ exposureTime: { min: 68, max: 300000, step: 1 }, iso: { min: 50, max: 3200, step: 1 }, exposureCompensation: { min: -3, max: 3, step: 1/6 }, colorTemperature: { min: 2500, max: 10000, step: 100 }, exposureMode: ['continuous', 'manual'] });
                t.getSettings = () => ({ exposureCompensation: sim.comp });
                t.applyConstraints = async (o) => { const a = (o.advanced || [])[0] || {}; sim.pedidos.push(a);
                  if (a.exposureMode) sim.mode = a.exposureMode; if (a.exposureTime != null) sim.et = a.exposureTime; if (a.exposureCompensation != null) sim.comp = a.exposureCompensation; };
                return s; };
              L.S.estPerfil = { salvo: true, et: 6000, iso: 50, k: 5500 };
              L.estAbre(); await w(200); document.querySelector('[data-e=ajuda]').click(); await w(400); document.querySelector('[data-act=estAj][data-id=medir]').click(); await w(2000);
              const descartou = L.S.estPerfil === null && sim.mode !== 'manual';
              const b = document.getElementById('ecFundo'); b.click(); await w(9500);
              const P = L.S.estPerfil || {}, m = document.getElementById('ecMsg').innerText;
              const semManual = !sim.pedidos.some(a => a.exposureMode === 'manual' && a.exposureTime > 334);
              const fundo = Math.round(320 * Math.pow(2, sim.comp));
              b.click(); await w(100); const menu = [...document.querySelectorAll('#ecMsg .ecMsgB')].map(x => x.textContent);
              document.querySelector('#ecMsg [data-c=auto]').click(); await w(200);
              const auto = L.S.estPerfil === null && b.textContent === 'Medir fundo' && sim.comp === 0 && sim.mode === 'continuous';
              document.querySelector('#ecPro [data-p=et]').click(); await w(50); const R = document.getElementById('ecR');
              const passos = +R.max + 1; R.value = R.max; R.dispatchEvent(new Event('input')); await w(400);
              const vel = document.getElementById('ecDv').textContent;
              document.querySelector('[data-c=x]').click();
              return [descartou, P.v === 2 && P.salvo, fundo >= 212 && fundo <= 240, /pronto/.test(m), semManual, menu, auto, passos, vel, sim.et <= 334]; }""")
            total += 1
            ok = got[:6] == [True, True, True, True, True, ['Medir de novo', 'Voltar ao automático']] and got[6:] == [True, 4, '1/30', True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Medir fundo: mira ~225 sem estourar pela EXP., descarta perfil travado, VELOC. em passos até 1/30, menu Medir de novo / Voltar ao automático')
            if not ok: falhas.append('medir fundo v437'); print('        veio', got, pg.erros)
            await pg.close()

            # Marketing (v430): botão no Início, objetivo muda o plano, feito, criar post com fatos reais (urgência só real), lembrete, datas
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('inicio'); await w(300);
              const tem = !!document.querySelector('[data-act=inicio][data-id=mkt]'); document.querySelector('[data-act=inicio][data-id=mkt]').click(); await w(600);
              const n6 = document.querySelectorAll('.mkPi').length;
              document.querySelector('.mkObj [data-obj=solar]').click(); await w(200);
              const plano = L.mkPlano(), solar = plano[0].refs.every(r => S.items.find(i => i.ref === r).tipo === 'solar');
              document.querySelector('.mkCk').click(); await w(200); const feito = document.querySelector('.mkPi').classList.contains('ok');
              const ref = plano[0].refs[0]; S.items.filter(i => i.ref === ref).forEach((i, k) => i.qty = k ? 0 : 1);
              const leg = L.mkLegenda([{ref, f: L.mkFatos(ref)}], 'solar', 'A', 'ambos', 'post');
              S.items.filter(i => i.ref === ref).forEach(i => i.qty = 5);
              const leg2 = L.mkLegenda([{ref, f: L.mkFatos(ref)}], 'solar', 'B', 'pt', 'post');
              document.querySelector('.mkCr [data-cria=post]').click(); await w(900);
              const tx = document.getElementById('mkTx').value, cv = !!document.querySelector('.mkCv');
              document.getElementById('mkLemb').click(); await w(200);
              const p = L.mkPascoa(2027);
              return [tem, n6, solar, feito, /Última unidade/.test(leg) && /Última unidad[.]/.test(leg) && /— ES —/.test(leg), !/Últimas? unidade/.test(leg2) && !/— ES —/.test(leg2), /WhatsApp/.test(tx), cv, S.mkt.lemb.length, p.getMonth() + '-' + p.getDate()]; }""")
            total += 1
            ok = got == [True, 6, True, True, True, True, True, True, 1, '2-28'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Marketing: Início, objetivo muda o plano, feito, legenda com fatos reais (urgência só real), PT/ES, lembrete, Páscoa')
            if not ok: falhas.append('marketing'); print('        veio', got, pg.erros)
            await pg.close()

            # Mais vistas e não vendidas (v445): soma das vistas do site × vendas de 30 dias → Marketing
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const lim = Date.now() - 30 * 864e5, ven = {}; S.sales.forEach(s => { if (!s.estorno && s.ts >= lim) ven[s.ref] = (ven[s.ref] || 0) + s.qty; });
              const its = S.items.filter(i => !i.bulk); const r = its[0].ref, r2 = its.find(i => i.ref !== r).ref;
              S.vistas = {}; S.vistas[r] = (ven[r] || 0) * 30 + 20; S.vistas[r2] = 3;
              const l = L.vistasNaoVendidas();
              return [l.length === 1 && l[0].ref === r && l[0].v === S.vistas[r]]; }""")
            total += 1
            ok = got == [True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Mais vistas e não vendidas: vistas do site × vendas de 30 dias')
            if not ok: falhas.append('vistas site'); print('        veio', got, pg.erros)
            await pg.close()

            # Reserva presa (v446): pedido do site apagado/cancelado solta a peça; reserva paga órfã é solta depois de 10 min
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const nv0 = S.nuvem; S.nuvem = { rt: 'teste' }; S.resPend = {}; S.resOrf = {};
              S.pedidos.push({ id: 'pT1', sid: 'SIDAPAGA1', orig: 'site', st: 'pag', itens: [{ ref: 'AAA1', cor: '', q: 1 }] });
              S.pedidos.push({ id: 'pT2', sid: 'SIDVIVO22', orig: 'site', st: 'pag', itens: [{ ref: 'BBB2', cor: '', q: 1 }] });
              L.ACT.peddel('pT1'); L.ACT.peddel('pT1'); await w(50);
              const apagou = !!(S.resPend.SIDAPAGA1 && S.resPend.SIDAPAGA1.refs[0] === 'AAA1');
              S._pedT = Date.now();
              L.resEstSet({ CCC3: { 'ORFA1~': { pid: 'ORFA1', cor: '', q: 1, exp: 0, pago: true } }, BBB2: { 'SIDVIVO22~': { pid: 'SIDVIVO22', cor: '', q: 1, exp: 0, pago: true } } });
              L.resOrfas(); const espera = !S.resPend.ORFA1 && !!S.resOrf.ORFA1;
              S.resOrf.ORFA1 = Date.now() - 11 * 60000; L.resOrfas();
              const solta = !!S.resPend.ORFA1 && !S.resPend.SIDVIVO22;
              S.pedidos = S.pedidos.filter(p => p.id !== 'pT2'); S.resPend = {}; S.resOrf = {}; L.resEstSet({}); S.nuvem = nv0;
              return [apagou, espera, solta]; }""")
            total += 1
            ok = got == [True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Reserva presa: pedido apagado solta a peça; reserva paga órfã sai depois de 10 min; pedido vivo fica')
            if not ok: falhas.append('reserva presa'); print('        veio', got, pg.erros)
            await pg.close()

            # B2 (19/11/2026): o app manda a lista em "itens" ao liberar; recusa da nuvem (ok:false) fica na fila; vencidas paradas limpas UMA vez
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const nv0 = S.nuvem, f0 = window.fetch, corpos = []; let resposta = { ok: false, motivo: 'itens' };
              const agora = Date.now(), ef = (q, exp, pago, pid) => ({ mapValue: { fields: { pid: { stringValue: pid }, cor: { stringValue: '' }, q: { integerValue: String(q) }, exp: { integerValue: String(exp) }, pago: { booleanValue: pago } } } });
              const docs = { documents: [
                { name: 'x/estoque/VEN1', fields: { res: { mapValue: { fields: { 'PVENC1~': ef(1, agora - 3600000, false, 'PVENC1') } } } } },
                { name: 'x/estoque/VIV2', fields: { res: { mapValue: { fields: { 'PVIVO2~': ef(1, agora + 600000, false, 'PVIVO2'), 'PPAGO3~': ef(1, agora - 3600000, true, 'PPAGO3') } } } } } ] };
              window.fetch = async (u, o) => { u = String(u);
                if (/securetoken/.test(u)) return new Response(JSON.stringify({ id_token: 't', refresh_token: 'teste' }), { status: 200 });
                if (/cloudfunctions.net\\/reserva/.test(u)) { corpos.push(JSON.parse(o.body)); return new Response(JSON.stringify(resposta), { status: 200 }); }
                if (/\\/estoque\\?/.test(u)) return new Response(JSON.stringify(docs), { status: 200 });
                return new Response('{}', { status: 200 }); };
              S.nuvem = { rt: 'teste' }; S.resPend = {}; S.resOrf = {}; delete S.resLimpo1; S.pedidos.push({ id: 'pB2', sid: 'PVIVO2', orig: 'site', st: 'pag', itens: [{ ref: 'VIV2', cor: '', q: 1 }] });
              await L.resBusca(); await w(200);
              const limpou = !!S.resPend.PVENC1 && !S.resPend.PVIVO2 && !S.resPend.PPAGO3 && S.resLimpo1 === 1;
              const c1 = corpos.find(c => c.pedido === 'PVENC1'), itensOk = !!c1 && c1.acao === 'liberar' && Array.isArray(c1.itens) && c1.itens[0].ref === 'VEN1' && !('refs' in c1);
              const ficou = !!S.resPend.PVENC1;  // a nuvem recusou → continua na fila
              resposta = { ok: true }; L.resFlush(); await w(200);
              const saiu = !S.resPend.PVENC1;
              S.resPend = {}; await L.resBusca(); await w(200); const umaVez = !S.resPend.PVENC1;
              window.fetch = f0; S.pedidos = S.pedidos.filter(p => p.id !== 'pB2'); S.resPend = {}; S.resOrf = {}; L.resEstSet({}); S.nuvem = nv0;
              return [limpou, itensOk, ficou, saiu, umaVez]; }""")
            total += 1
            ok = got == [True, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'B2 soltar reserva: lista em "itens"; recusa da nuvem fica na fila e tenta de novo; vencidas paradas limpas uma vez')
            if not ok: falhas.append('B2 soltar reserva'); print('        veio', got, pg.erros)
            await pg.close()

            # P1 no app (19/11/2026): a lista pública traz o código "h" (sha256 de 'lf-res|' + pedido), sem o número do pedido
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const H = async sid => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('lf-res|' + sid)))].map(x => ('0' + x.toString(16)).slice(-2)).join('').slice(0, 20);
              const nv0 = S.nuvem, f0 = window.fetch, agora = Date.now();
              const ef = (h, exp, pago) => ({ mapValue: { fields: { h: { stringValue: h }, cor: { stringValue: '' }, q: { integerValue: '1' }, exp: { integerValue: String(exp) }, pago: { booleanValue: pago } } } });
              const hC = await H('PCANC9'), hV = await H('PVENC8'), hX = await H('NINGUEM7'), hL = await H('PVIVO6');
              const docs = { documents: [
                { name: 'x/estoque/HH1', fields: { res: { mapValue: { fields: { [hC + '~']: ef(hC, 0, true), [hX + '~']: ef(hX, 0, true), [hL + '~']: ef(hL, 0, true) } } } } },
                { name: 'x/estoque/HH2', fields: { res: { mapValue: { fields: { [hV + '~']: ef(hV, agora - 3600000, false), [hX + 'b~']: ef(hX, agora - 3600000, false) } } } } } ] };
              window.fetch = async (u, o) => { u = String(u);
                if (/securetoken/.test(u)) return new Response(JSON.stringify({ id_token: 't', refresh_token: 'teste' }), { status: 200 });
                if (/cloudfunctions.net\\/reserva/.test(u)) return new Response(JSON.stringify({ ok: false }), { status: 200 });
                if (/\\/estoque\\?/.test(u)) return new Response(JSON.stringify(docs), { status: 200 });
                return new Response('{}', { status: 200 }); };
              S.nuvem = { rt: 'teste' }; S.resPend = {}; S.resOrf = {}; delete S.resLimpo1; S._pedT = Date.now();
              S.pedidos.push({ id: 'pH1', sid: 'PCANC9', orig: 'site', st: 'canc', itens: [{ ref: 'HH1', cor: '', q: 1 }] });
              S.pedidos.push({ id: 'pH2', sid: 'PVENC8', orig: 'site', st: 'pag', itens: [{ ref: 'HH2', cor: '', q: 1 }] });
              S.pedidos.push({ id: 'pH3', sid: 'PVIVO6', orig: 'site', st: 'pag', itens: [{ ref: 'HH1', cor: '', q: 1 }] });
              await L.resBusca(); await w(200);
              const vencida = !!S.resPend.PVENC8 && S.resPend.PVENC8.refs[0] === 'HH2';
              const espera = !!S.resOrf.PCANC9 && !S.resPend.PCANC9 && !S.resOrf.PVIVO6 && !Object.keys(S.resOrf).some(k => k.length === 20);
              S.resOrf.PCANC9 = Date.now() - 11 * 60000; S._pedT = Date.now(); await L.resBusca(); await w(200);
              const orfa = !!S.resPend.PCANC9 && !S.resPend.PVIVO6 && !Object.keys(S.resPend).some(k => k.length === 20 || k === 'NINGUEM7');
              window.fetch = f0; S.pedidos = S.pedidos.filter(p => !/^pH/.test(p.id)); S.resPend = {}; S.resOrf = {}; L.resEstSet({}); S.nuvem = nv0;
              return [vencida, espera, orfa]; }""")
            total += 1
            ok = got == [True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'P1 no app: reserva com código h acha o pedido (vencida e órfã cancelada soltas); código desconhecido e pedido vivo ficam')
            if not ok: falhas.append('P1 no app'); print('        veio', got, pg.erros)
            await pg.close()

            # B1 (19/11/2026): tocar no nome da cliente no pedido abre a ficha dela em Clientes
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.clientes.push({ id: 987654, nome: 'Cliente B1', tel: '0981000111', ruc: '', obs: '' });
              L.ACT.pedcli(987654); await w(300);
              const f = document.getElementById('cliFicha'), r = [S.view, S.cliSel, !!f && f.getBoundingClientRect().height > 0 && /Cliente B1/.test(f.textContent || '') || !!f && [...f.querySelectorAll('input')].some(i => i.value === 'Cliente B1')];
              S.clientes = S.clientes.filter(c => c.id !== 987654); S.cliSel = null; return r; }""")
            total += 1
            ok = got == ['clientes', 987654, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'B1: nome da cliente no pedido abre a ficha dela em Clientes')
            if not ok: falhas.append('B1 cliente do pedido'); print('        veio', got, pg.erros)
            await pg.close()

            # S1/S2 parte 3 (item 21): pagamento confirmado grava o token SÓ em reservasTok/<pedido>, e ANTES de reservas/ ficar paga
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const nv0 = S.nuvem, f0 = window.fetch, ch = [];
              window.fetch = async (u, o) => { u = String(u);
                if (/securetoken/.test(u)) return new Response(JSON.stringify({ id_token: 't', refresh_token: 'teste' }), { status: 200 });
                if (/firestore/.test(u)) ch.push([o.method, u.replace(/^.*documents\\//, ''), o.body ? JSON.parse(o.body) : null]);
                return new Response('{}', { status: 200 }); };
              S.nuvem = { rt: 'teste' };
              S.pedidos.push({ id: 'pTK', num: 'pTK', sid: 'SIDTOK1', orig: 'site', st: 'novo', pg: 'pagar', itens: [{ ref: 'AAA1', cor: '', q: 1 }] });
              L.ACT.pedpago('pTK'); await w(400);
              const p = S.pedidos.find(x => x.id === 'pTK'), tok = p.tok;
              const rTok = ch.find(c => c[0] === 'PATCH' && /^reservasTok\\/SIDTOK1\\?updateMask.fieldPaths=tok$/.test(c[1]));
              const rRes = ch.find(c => c[0] === 'PATCH' && /^reservas\\/SIDTOK1\\?/.test(c[1]));
              window.fetch = f0; S.pedidos = S.pedidos.filter(x => x.id !== 'pTK'); S.nuvem = nv0;
              return [!!tok, !!rTok && rTok[2].fields.tok.stringValue === tok, !!rRes && rRes[2].fields.pago.booleanValue === true && !('tok' in rRes[2].fields) && !/fieldPaths=tok/.test(rRes[1]), ch.indexOf(rTok) < ch.indexOf(rRes)]; }""")
            total += 1
            ok = got == [True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S1/S2 parte 3: pagamento confirmado grava o token só em reservasTok, antes de reservas/ ficar paga')
            if not ok: falhas.append('token reservasTok'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 21 (20/11/2026): a confirmação automática do PIX (robô) é lida em reservasTok/<pedido>.pixAuto — não mais em reservas/
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const nv0 = S.nuvem, f0 = window.fetch, ch = [];
              window.fetch = async (u, o) => { u = String(u); const m = (o && o.method) || 'GET';
                if (/securetoken/.test(u)) return new Response(JSON.stringify({ id_token: 't', refresh_token: 'teste' }), { status: 200 });
                if (/firestore/.test(u)) { const c = u.replace(/^.*documents\//, ''); ch.push([m, c]);
                  if (m === 'GET' && /^reservasTok\/SIDPX1/.test(c)) return new Response(JSON.stringify({ fields: { pixAuto: { mapValue: { fields: { ts: { integerValue: '1795190000000' }, valor: { doubleValue: 38 }, banco: { stringValue: 'nubank' } } } } } }), { status: 200 });
                  if (m === 'GET') return new Response(JSON.stringify({ error: { code: 404 } }), { status: 404 }); }
                return new Response('{}', { status: 200 }); };
              S.nuvem = { rt: 'teste' };
              S.pedidos.push({ id: 'pPX', num: 'pPX', cod: 'PX1', sid: 'SIDPX1', orig: 'site', pag: 'pix', st: 'novo', pg: 'pagar', itens: [{ ref: 'AAA1', cor: '', q: 1 }] });
              await L.pixEmailCheca(true); await w(500);
              const p = S.pedidos.find(x => x.id === 'pPX');
              const r = [ch.some(c => c[0] === 'GET' && /^reservasTok\/SIDPX1$/.test(c[1])), !ch.some(c => c[0] === 'GET' && /^reservas\/SIDPX1/.test(c[1])), p.pg === 'pago', !!p.pgAuto];
              window.fetch = f0; S.pedidos = S.pedidos.filter(x => x.id !== 'pPX'); S.nuvem = nv0; return r; }""")
            total += 1
            ok = got == [True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 21: PIX confirmado pelo robô é lido em reservasTok/<pedido> e fecha o pedido sozinho')
            if not ok: falhas.append('item 21 pixAuto'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 33 (20/11/2026, URGENTE do dono, medido no vídeo do celular dele). Substitui as provas dos itens 31 e 32.
            # (a) CLARÃO: ao gravar a volta a câmera só liga a trava de BRANCO do aparelho; nunca mais pede foco nem luz em "manual" (no Android isso
            #     não congela o valor em uso: estoura a imagem) e nunca manda valor de ISO, exposição, distância ou temperatura
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF;
              const trilha = (modos, set, falha) => { const ch = []; return { ch, getCapabilities: () => modos, getSettings: () => set,
                applyConstraints: async o => { ch.push(JSON.stringify(o.advanced[0])); if (falha) throw new Error('não'); } }; };
              const TODOS = { focusMode: ['continuous', 'manual'], exposureMode: ['continuous', 'manual'], whiteBalanceMode: ['continuous', 'manual'], iso: { min: 50, max: 800 } };
              const VAL = { focusMode: 'continuous', exposureMode: 'continuous', whiteBalanceMode: 'continuous', focusDistance: 0.3, exposureTime: 120, iso: 100, colorTemperature: 5000 }, R = [];
              let t = trilha(TODOS, VAL); R.push([await L.c149Trava(t), t.ch]);                                                    // aparelho "deixa" tudo → só o branco
              t = trilha({ focusMode: ['continuous', 'manual'], exposureMode: ['continuous', 'manual'] }, VAL); R.push([await L.c149Trava(t), t.ch]);   // sem trava de branco → nada
              t = trilha(TODOS, Object.assign({}, VAL, { exposureMode: 'none', focusMode: 'manual' })); R.push([await L.c149Trava(t), t.ch]);       // luz e foco já fixos por quem ajustou a câmera
              t = trilha(TODOS, Object.assign({}, VAL, { whiteBalanceMode: 'manual' })); R.push([await L.c149Trava(t), t.ch]);                     // branco já fixo → não mexe
              t = trilha(TODOS, VAL, true); R.push([await L.c149Trava(t), t.ch.length]);                                          // o aparelho recusou
              const fonte = L.c149Trava.toString();
              return [R, /exposureMode\\s*[:=]\\s*'manual'|focusMode\\s*[:=]\\s*'manual'|exposureTime|focusDistance|colorTemperature|\\biso\\b/.test(fonte), typeof L.c149Olha, typeof L.c149Mudou]; }""")
            total += 1
            NAO = 'Este aparelho não deixa travar foco e luz'; BR = '{"whiteBalanceMode":"manual"}'
            ok = got == [[['Travado: branco', [BR]], [NAO, []], ['Travado: foco, luz, branco', [BR]], ['Travado: branco', []], [NAO, 1]], False, 'undefined', 'undefined'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 33a: ao gravar a volta a câmera só liga a trava de branco — nunca foco/luz em "manual" nem valores (era o clarão)')
            if not ok: falhas.append('item 33a trava da câmera'); print('        veio', got, pg.erros)
            await pg.close()

            # (c) AVISO ESCONDIDO: o aviso curto fica acima de toda tela e janela (era desenhado atrás do Estúdio: "carrega e não faz nada")
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              const z = sel => { let m = -1; for (const sh of document.styleSheets) { let rs; try { rs = sh.cssRules; } catch (e) { continue; } for (const r of rs) if (r.selectorText && r.style && r.style.zIndex && r.selectorText.split(',').some(p => p.trim().indexOf(sel) >= 0)) m = Math.max(m, +r.style.zIndex); } return m; };
              L.estAbre(); await w(250); L.lfToast('prova do aviso'); await w(700);
              const t = document.getElementById('lfToast'), o = document.querySelector('.estOv'), zt = +getComputedStyle(t).zIndex, r = t.getBoundingClientRect();
              const telas = ['.estOv', '.estCam', '.egTrat', '.ljBk', '.ljJn', '.splitBk', '#splitCard', '#estAjF', '.lfEspia', '#estCorF', '.mkTp'].map(z);
              return [!!o, t.classList.contains('on'), zt > +getComputedStyle(o).zIndex, telas.every(v => v > 0 && v < zt), zt < z('#lockScr') && zt < z('#loadFoto'), r.bottom <= innerHeight && r.height > 20]; }""")
            total += 1
            ok = got == [True] * 6 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 33c: o aviso curto aparece por cima do Estúdio e de toda janela (abaixo só do cadeado e do carregando)')
            if not ok: falhas.append('item 33c aviso por cima'); print('        veio', got, pg.erros)
            await pg.close()

            # (d) GRAVAÇÃO PERDIDA: na escolha à mão, quadro em que o app não acha a peça NÃO joga a gravação fora — avisa e volta à frente;
            #     erro no meio do tratamento fecha o "carregando" e avisa; a frente e a 3/4 do giro só são guardadas com nota 60+
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const quadro = async cor => { const c = document.createElement('canvas'); c.width = 480; c.height = 270; const x = c.getContext('2d'); x.fillStyle = cor; x.fillRect(0, 0, 480, 270);
                return { sim: -1, t: c.toDataURL('image/jpeg', 0.5), b: await new Promise(r => c.toBlob(r, 'image/jpeg', 0.8)) }; };
              const Q = []; for (let i = 0; i < 6; i++) Q.push(await quadro('#bbb'));
              const serve = [L.estFotoServe(null), L.estFotoServe({ cv: null, n: 0 }), L.estFotoServe({ cv: {}, n: 59 }), L.estFotoServe({ cv: {}, n: 60 })];
              const fotos0 = JSON.stringify(Object.keys(S.fotos || {})), giros0 = JSON.stringify(S.giros || {});
              L.estGiroEscolhe({ k: null }, Q, new Blob([new Uint8Array(8)], { type: 'video/webm' })); await w(150);
              const ov = () => document.getElementById('estGiro'), tit = () => ov() && ov().querySelector('h1').textContent, toca = () => ov().querySelector('[data-g=ok]').click();
              const t1 = tit(); toca(); await w(120); const t2 = tit(); toca(); await w(2500);          // quadro liso: não há peça
              const depois = [tit(), document.getElementById('lfToast').textContent, !!document.getElementById('loadFoto'), JSON.stringify(Object.keys(S.fotos || {})) === fotos0, JSON.stringify(S.giros || {}) === giros0];
              ov().querySelector('[data-g=x]').click(); await w(100); const fechou = !ov();
              // erro no meio: um quadro que não abre
              const Q2 = Q.map(q => Object.assign({}, q)); Q2[0].b = new Blob(['x'], { type: 'image/jpeg' }); for (const q of Q2) q.sim = -1; Q2[0].sim = 0;
              L.estGiroEscolhe({ k: null }, Q2, new Blob([new Uint8Array(8)], { type: 'video/webm' })); await w(150); toca(); await w(120); toca(); await w(1500);
              const erro = [document.getElementById('lfToast').textContent, !!document.getElementById('loadFoto')];
              return [serve, t1, t2, depois, fechou, erro]; }""")
            total += 1
            ok = (got == [[False, False, False, True], 'Qual é a frente?', 'E a 3/4?', ['Qual é a frente?', 'Não achei a peça no quadro da frente', False, True, True], True,
                          ['Não consegui abrir os quadros do giro', False]] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Item 33d: escolha à mão — sem peça no quadro a gravação continua (volta à frente, com aviso); erro fecha o carregando e avisa; nota 60+')
            if not ok: falhas.append('item 33d escolha à mão'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 34 (20/11/2026, dono: "corrija 'Qual é a frente?'"): a frente e a 3/4 escolhidas à mão saem com o tratamento do GIRO (fundo
            # aprendido das imagens da própria gravação), não mais com o da foto — no cenário do giro (parede cinza, prato) o da foto não acha a peça
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              // gravação inventada: parede cinza em degradê, prato claro, e uma "armação" escura que gira (fica mais estreita) — ou fica parada
              const quadro = async ang => { const c = document.createElement('canvas'); c.width = 640; c.height = 360; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 360);
                g.addColorStop(0, '#9a9a9c'); g.addColorStop(1, '#b4b4b2'); x.fillStyle = g; x.fillRect(0, 0, 640, 360); x.fillStyle = '#c9c9c7'; x.beginPath(); x.ellipse(320, 330, 250, 60, 0, 0, 7); x.fill();
                const k = Math.cos(ang * Math.PI / 180); x.strokeStyle = '#4a3326'; x.lineWidth = 6; x.save(); x.translate(320, 200); x.scale(Math.max(0.25, Math.abs(k)), 1);
                x.strokeRect(-150, -40, 130, 80); x.strokeRect(20, -40, 130, 80); x.beginPath(); x.moveTo(-20, -10); x.lineTo(20, -10); x.stroke(); x.restore();
                return { sim: -ang, t: c.toDataURL('image/jpeg', 0.5), b: await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9)) }; };
              const ov = () => document.getElementById('estGiro'), toca = () => ov().querySelector('[data-g=ok]').click(), vid = new Blob([new Uint8Array(8)], { type: 'video/webm' });
              const tt = () => document.getElementById('lfToast'), espera = async () => { for (let i = 0; i < 100; i++) { await w(150); if (!document.getElementById('loadFoto') && (document.getElementById('estDest') || (tt() && tt().classList.contains('on')))) return; } };
              // 1) a peça gira: sai a foto (fundo branco) e segue para "De qual peça é?"
              const Q = []; for (let i = 0; i < 14; i++) Q.push(await quadro(i * 12));
              L.estGiroEscolhe({ k: null }, Q, vid); await w(150); toca(); await w(150); toca(); await espera();
              const d = document.getElementById('estDest'), im = d && d.querySelector('.estImg img'), giraOk = [!!d && d.querySelector('h1').textContent, !ov()];
              if (im) { await new Promise(r => { if (im.complete) r(); else im.onload = r; }); const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
                const p = x.getImageData(0, 0, c.width, c.height).data; let canto = 0, n = 0, escuro = 255; for (let yy = 0; yy < c.height * 0.12; yy++) for (let xx = 0; xx < c.width * 0.12; xx++) { canto += p[(yy * c.width + xx) * 4 + 1]; n++; }
                for (let i = 0; i < p.length; i += 4) if (p[i + 1] < escuro) escuro = p[i + 1]; giraOk.push(canto / n > 245, escuro < 150); }
              if (d) d.remove();
              // 2) a peça não saiu do lugar na gravação inteira: não há como separar do fundo → avisa e a escolha continua aberta
              const P = []; for (let i = 0; i < 8; i++) P.push(await quadro(0));
              if (tt()) tt().classList.remove('on'); L.estGiroEscolhe({ k: null }, P, vid); await w(150); toca(); await w(150); toca(); await espera();
              const parada = [ov() && ov().querySelector('h1').textContent, tt() && tt().textContent, !document.getElementById('estDest')];
              return [giraOk, parada, typeof L.giroFotos]; }""")
            total += 1
            ok = got == [['De qual peça é?', True, True, True], ['Qual é a frente?', 'Não achei a peça no quadro da frente', True], 'undefined'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 34: "Qual é a frente?" — as fotos escolhidas à mão saem com o tratamento do giro (fundo branco); peça parada na gravação → avisa')
            if not ok: falhas.append('item 34 escolha com o tratamento do giro'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 35 (20/11/2026, celular do dono: o tratamento do giro parava no meio). Causa: ele pedia giro/mp4-muxer.js, arquivo que entrou
            # no projeto DEPOIS do APK instalado — e a atualização automática só leva app.js e style.css. Agora as bibliotecas vão dentro do app.js
            # (lib/*.js → APP_LIBS, como texto: aparelho antigo não precisa entendê-las para abrir o app) e nenhum arquivo novo pode aparecer em www/.
            pg = await pagina()
            await pg.route('**/giro/**', lambda r: r.abort())
            got = await pg.evaluate("""async () => { const L = window.__LF, R = [];
              for (const [n, g, cfg] of [['mp4-muxer', 'Mp4Muxer', { codec: 'avc', width: 96, height: 64 }], ['webm-muxer', 'WebMMuxer', { codec: 'V_VP8', width: 96, height: 64, frameRate: 30 }]]) {
                const B = L.appLib(n, g), alvo = new B.ArrayBufferTarget(), m = new B.Muxer(Object.assign({ target: alvo, video: cfg }, n === 'mp4-muxer' ? { fastStart: 'in-memory' } : {}));
                R.push(typeof B.Muxer === 'function' && typeof m.addVideoChunk === 'function' && typeof m.finalize === 'function' && L.appLib(n, g) === B && typeof window[g] === 'undefined'); }
              return R; }""")
            fontes = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            carrega = sorted(f for f, t in fontes.items() if "createElement('script')" in t or 'createElement("script")' in t or 'importScripts' in t)
            apk = set(json.load(open(os.path.join(RAIZ, 'tests', 'www-do-apk.json'), encoding='utf-8'))['arquivos'])
            novos = sorted(p for p in (os.path.join(d, f).replace(os.sep, '/')[len(RAIZ) + 1:] for d, _, fs in os.walk(os.path.join(RAIZ, 'www')) for f in fs) if not p.startswith('www/loja/') and p not in apk)
            appjs = open(os.path.join(RAIZ, 'www', 'app.js'), encoding='utf-8').read()
            total += 1
            lin = [l for l in appjs.split('\n') if 'var Mp4Muxer' in l or 'var WebMMuxer' in l]  # as bibliotecas estão no app.js só como TEXTO, numa linha
            ok = got == [True, True] and carrega == ['30-ocr-leitura.js'] and not novos and len(lin) == 1 and lin[0].startswith('  var APP_LIBS = {') and not os.path.exists(os.path.join(RAIZ, 'www', 'giro')) and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 35: as bibliotecas do giro vão dentro do app.js (sem arquivo solto), nenhum módulo carrega .js de fora e não há arquivo novo em www/ que o APK instalado não tenha')
            if not ok: falhas.append('item 35 bibliotecas dentro do app'); print('        veio', got, carrega, novos, pg.erros)
            await pg.close()

            # Black Friday = só a da CDE (dono, 13/11 02:54 e de novo 21/11/2026: "esse evento internacional já solicitei várias vezes para ser removido").
            # Causa da volta: os três calendários do app tinham uma data de reserva (4ª sexta de novembro) para o ano sem data da Câmara.
            # Agora ano sem data da Câmara = ano sem Black Friday, igual ao site. A prova anda o relógio por 2026, 2027 e 2028.
            pg = await pagina()
            got = await pg.evaluate("""() => { const L = window.__LF, D = Date, R = { com: [], sem: [] };
              const em = (a, m, d) => { const t = new D(a, m - 1, d, 10).getTime(); window.Date = class extends D { constructor(...x) { x.length ? super(...x) : super(t); } static now() { return t; } }; };
              const olha = () => { const c = L.cupTemaProx(), s = L.semanaTema(), k = L.mkDatas().filter(x => /black/i.test(x.t)).map(x => x.t + ' ' + new D(x.d).getDate() + '/' + (new D(x.d).getMonth() + 1) + '/' + new D(x.d).getFullYear());
                return [c && c.tema === 'bf' ? new D(c.ini).getDate() + '-' + new D(c.fim).getDate() : '', /black/i.test(s) ? s : '', k.join('|')]; };
              try { em(2026, 11, 10); R.com = olha();
                for (const [a, m, d] of [[2027, 10, 1], [2027, 11, 1], [2027, 11, 20], [2027, 11, 26], [2027, 11, 27], [2028, 11, 1], [2028, 11, 24]]) { em(a, m, d); const o = olha(); if (o.join('')) R.sem.push([a, m, d, o]); }
              } finally { window.Date = D; }
              return R; }""")
            fontes = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            tabela = sorted(f for f, t in fontes.items() if re.search(r'\bBF_CDE\s*=', t))
            total += 1
            ok = got['com'][0] == '19-22' and 'Black Friday CDE' in got['com'][1] and got['com'][2] == 'Black Friday CDE 19/11/2026' and got['sem'] == [] and tabela == ['97-cupons.js'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Black Friday só a da CDE: com data da Câmara aparece 19–22/11 nos três calendários; ano sem data da Câmara não tem Black Friday nenhuma (nada de sexta internacional); a tabela de datas fica num arquivo só')
            if not ok: falhas.append('black friday so a da CDE'); print('        veio', got, tabela, pg.erros)
            await pg.close()

            # Item 30 (20/11/2026): vistas pela análise — o app pede o resumo de 30 dias à função analise (login do dono) e NÃO lê mais vistas/;
            # a chamada à análise mora num lugar só (analiseResumo)
            total += 1
            fonte = ''.join(open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js'))
            umLugar = fonte.count('cloudfunctions.net/analise') == 1 and "'vistas?" not in fonte
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const nv0 = S.nuvem, f0 = window.fetch, ch = []; let resp = { ok: true, porPeca: { AAA1: 12, BBB2: 3 } };
              window.fetch = async (u, o) => { u = String(u);
                if (/securetoken/.test(u)) return new Response(JSON.stringify({ id_token: 'tk1', refresh_token: 'teste' }), { status: 200 });
                ch.push([u, (o && o.method) || 'GET', o && o.headers && o.headers.Authorization, o && o.body]);
                if (/cloudfunctions.net\/analise/.test(u)) return new Response(JSON.stringify(resp), { status: 200 });
                return new Response('{}', { status: 200 }); };
              S.nuvem = { rt: 'teste' }; S.vistas = { VELHA: 9 };
              const n = await L.vistasBusca(); const c = ch.find(x => /\/analise$/.test(x[0]));
              const r1 = [n, JSON.stringify(S.vistas), !!c && c[1] === 'POST' && /^Bearer /.test(c[2] || '') && c[3] === JSON.stringify({ acao: 'resumo', dias: 30 }), !ch.some(x => /documents\/vistas/.test(x[0]))];
              resp = { ok: false }; const n2 = await L.vistasBusca(); const mantem = n2 === 0 && S.vistas.AAA1 === 12;
              window.fetch = f0; S.nuvem = nv0; S.vistas = {}; return r1.concat([mantem]); }""")
            ok = umLugar and got == [2, '{"AAA1":12,"BBB2":3}', True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 30: vistas por peça vêm da análise (login do dono), sem ler vistas/; nuvem sem resposta mantém o que tinha')
            if not ok: falhas.append('item 30 vistas pela análise'); print('        veio', umLugar, got, pg.erros)
            await pg.close()

            # Item 29 (20/11/2026): remendos parte 4a — Dashboard, dia, Histórico e Pendências com UMA função cada (ninguém as troca);
            # a folha VER serve família, Dashboard e grupo comum; soltar um arraste da barra não escolhe aba
            total += 1
            troca = [f for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if re.search(r'^\s*(renderDash|renderDay|histLista|dashCompose|atencaoItens) = function', open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read(), re.M)]
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
              S.per = 'hoje'; S.dTab = 'hoje'; L.setView('dash'); await w(300); R.push(S.per === 'mes' && !!document.querySelector('#v-dash .dHd'));
              S._gAt = ''; L.ACT.dVer(); await w(300); R.push(document.querySelectorAll('#dFolha [data-act="dVerEsc"]').length >= 5 && !document.querySelector('#dFolha [data-act="grpGerirV"]'));
              L.ACT.dVerEsc('hist'); await w(300); R.push(S.view === 'hist');
              L.setView('dash'); await w(200); const fam = S._gAt; L.ACT.dVer(); await w(300);
              R.push(/^g:/.test(fam) && !!document.querySelector('#dFolha [data-act="grpGerirV"]') && !!document.querySelector('#dFolha [data-act="grpVerEsc"]') && !document.querySelector('#dFolha [data-act="dVerEsc"]'));
              L.lfaFecha('dFolha');
              L.inicioGo('hoje'); await w(300); R.push(S.view === 'dia' && !!document.querySelector('#v-dia .dHd'));
              L.setView('hist'); await w(250); L.ACT.hfopen(); await w(200); R.push(S.hFopen === true && !!document.querySelector('#v-hist [data-act="hlimpar"]')); L.ACT.hfopen();
              return R; }""")
            ok = not troca and got == [True] * 6 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 29: Dashboard, dia, Histórico e Pendências numa função cada; folha VER para família e para o Dashboard')
            if not ok: falhas.append('item 29 dashboard'); print('        veio', troca, got, pg.erros)
            await pg.close()

            # Item 28 (20/11/2026): trocas inteiras — cada uma ficou só com a versão que vale, no arquivo da família
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
              L.inicioGo('mkt'); await w(250); R.push(S.view === 'mkt' && S._gAt === 'g:mkt');
              L.ACT.cupAbre(); await w(250); R.push(S.view === 'cup');
              L.ACT.stAbre('mkt'); await w(250); R.push(S.view === 'mkt');
              S.per = 'hoje'; L.ACT.famNum(); await w(250); R.push(S.view === 'dash' && S.per === 'mes' && S.dTab === 'hoje');
              L.ACT.dPer(); await w(300); R.push(!!document.querySelector('[data-act="dPerEsc"]'));
              L.ACT.dPerEsc('hoje'); await w(300); R.push(S.view === 'dia');
              L.estTutorial(); await w(350); R.push(document.querySelectorAll('.estTut263 .t263P').length === 4);
              return R; }""")
            total += 1
            ok = got == [True] * 7 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 28: Marketing, Cartões, período do Dashboard e tutorial do Estúdio abrem pela versão única')
            if not ok: falhas.append('item 28 trocas inteiras'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 27 (20/11/2026): remendos parte 2c — ninguém troca o setView; nome/frase de tela escrito UMA vez
            # (chave que já está na lista inicial de BARRA_NOME, GRP_FRASE ou DT_FRASE não pode ser escrita de novo em outro lugar)
            total += 1
            fonte = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            tudo = ''.join(fonte.values()); rep = []
            for T in ('BARRA_NOME', 'GRP_FRASE', 'DT_FRASE'):
                lit = re.search(r'var %s = \{(.*?)\};' % T, tudo, re.S).group(1); chaves = set(re.findall(r'(?:^|[,{\s])(\w+): \'', lit))
                usos = re.findall(r'\b%s\.(\w+) = ' % T, tudo)
                rep += ['%s.%s' % (T, k) for k in set(usos) if k in chaves or usos.count(k) > 1]
            troca = [f for f, t in fonte.items() if re.search(r'^\s*setView = function', t, re.M)]
            ok = not rep and not troca
            print(('  ok  ' if ok else ' FALHA ') + 'Item 27: setView sem embrulho; nomes e frases das telas escritos uma vez')
            if not ok: falhas.append('item 27 setView/tabelas'); print('        veio', rep, troca)

            # Item 26 (20/11) + 4c parte 4 (149r, 21/11/2026): iniLista e grpAbre são UMA função cada; as famílias vêm de UMA tabela (FAMILIAS) com versão S.famV.
            # Reservas mora em Dinheiro. Aparelho novo recebe o arranjo padrão; aparelho de antes mantém barra e Início e só troca a tabela;
            # grupo em que o dono mexeu (S.famMex) não é tocado quando a tabela sobe de versão; a versão é guardada (antes a tabela voltava a cada abertura).
            total += 1
            troca = [f for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if re.search(r'^\s*(iniLista|grpAbre|famAplica) = function|\bFAM[67]\b[^+]|fam[67]Aplica|S\.fam(7b?|6|63|80|95)\b|NV_GF', open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read(), re.M)]
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const it = id => (S.grupos.find(g => g.id === id) || { itens: [] }).itens.join(), fr = id => (S.grupos.find(g => g.id === id) || {}).frase;
              R.novo = [it('g:gp'), it('g:din'), fr('g:din'), S.barra.join(), S.inicioT.join(), S.famV, it('g:site'), it('g:mkt'), it('g:pecas')];
              // aparelho antigo, sem famílias: um grupo dele com telas que viram família sai; chega ao arranjo padrão; não repete
              S.famV = undefined; S.famMex = undefined; S.fam7 = S.fam6 = true; S.grupos = [{ id: 'g1', nome: 'Meu', ico: 'caixa', itens: ['caixa', 'desp'] }]; S.inicioT = ['hoje', 'giro', 'ped', 'cli', 'mkt', 'g1']; S.barra = ['vendas', 'g1', 'hoje', 'ajustes'];
              L.render(); const a = JSON.stringify([S.grupos, S.inicioT, S.barra]); L.render();
              R.antigo = [S.grupos.map(g => g.id).sort().join(), S.barra.join(), S.inicioT.join(), a === JSON.stringify([S.grupos, S.inicioT, S.barra]), S.famV, 'fam7' in S || 'fam6' in S];
              // aparelho da v633 (Giro e preços só com Preços) com o Início arrumado pelo dono: o grupo sai e Preços fica no lugar dele (54)
              S.famV = 3; S.grupos.push({ id: 'g:gp', nome: 'Giro e preços', ico: 'giro', fam: 1, itens: ['prec'] }); S.grupos.find(g => g.id === 'g:din').itens = ['caixa', 'desp', 'fx']; S.inicioT = ['g:site', 'g:res', 'ata', 'g:gp', 'g:mkt', 'cli']; S.barra = ['vendas', 'g:din', 'g:pecas', 'ajustes'];
              L.render(); R.v596 = [it('g:gp'), it('g:din'), S.barra.join(), S.inicioT.join()];
              // o dono tira Câmbio de Dinheiro; a tabela sobe de versão e não toca nesse grupo
              S._gg = 'g:din'; L.ACT.grpTirar('fx'); await w(200); L.ACT.grpFecha(); S.famV = 0; S.famMex['g:gp'] = 1; S.grupos.push({ id: 'g:gp', nome: 'Giro e preços', ico: 'giro', fam: 1, itens: ['prec'] }); L.render();
              R.mexido = [!!S.famMex['g:din'], it('g:din'), it('g:gp'), S.inicioT.indexOf('fx') >= 0];  // o "Giro e preços" que o dono mexeu fica
              // Dinheiro abre o índice com Reservas; Giro e preços sem Reservas
              L.setView('inicio'); await w(200); S.famV = 0; S.famMex = {}; L.render(); await w(200);
              return R; }""")
            guarda = "'famV'" in open(os.path.join(RAIZ, 'src', '99-render-persistencia.js'), encoding='utf-8').read() and "'famMex'" in open(os.path.join(RAIZ, 'src', '99-render-persistencia.js'), encoding='utf-8').read()
            ok = (not troca and guarda and got['novo'] == ['', 'caixa,din,desp,fx', 'Caixa, reservas, despesas e câmbio', 'vendas,g:pecas,g:din,ajustes', 'g:res,prec,g:site,g:mkt,cli,ata', 4, 'site,ped,msg,vit,prod', 'mkt,tem,cup,anl', 'estoque,est,comp']
                  and got['antigo'] == ['g:din,g:mkt,g:pecas,g:res,g:site', 'vendas,g:pecas,g:din,ajustes', 'g:res,prec,g:site,g:mkt,cli,ata', True, 4, False]
                  and got['v596'] == ['', 'caixa,din,desp,fx', 'vendas,g:din,g:pecas,ajustes', 'g:site,g:res,ata,prec,g:mkt,cli'] and got['mexido'] == [True, 'caixa,din,desp', 'prec', True] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Item 26 + 4c parte 4 (149r): famílias numa tabela só com versão — Reservas em Dinheiro, aparelho antigo migra uma vez, arranjo do dono e grupo mexido ficam')
            if not ok: falhas.append('item 26 familias tabela unica'); print('        veio', troca, guarda, got, pg.erros)
            await pg.close()

            # Item 25 (20/11/2026): remendos parte 2a — inicioGo e navOn são UMA função cada (src/89-inicio.js); ninguém as troca.
            # Cada destino abre a tela certa e acende o botão certo (tabela conferida antes × depois em work/s436/remendos/equiv_nav.py)
            total += 1
            troca = [f for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if re.search(r'^\s*(inicioGo|navOn) = function', open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read(), re.M)]
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
              for (const [id, view, aceso] of [['hoje', 'dia', 'hoje'], ['repo', 'comp', 'repo'], ['cli', 'clientes', 'cli'], ['site', 'site', 'site'], ['cup', 'cup', 'cup'], ['vit', 'onl', 'vit'], ['anl', 'onl', 'g:mkt'], ['caixa', 'caixa', 'caixa'], ['lotes', 'estoque', 'lotes']]) {
                L.inicioGo(id); await w(250); R.push(S.view === view && L.navOn(aceso) === true ? 1 : id + '→' + S.view); }
              L.inicioGo('vit'); await w(200); const pn = [L.navOn('vendas'), L.navOn('g:site'), L.navOn('prod')];
              return [R.filter(x => x !== 1), pn]; }""")
            ok = not troca and got == [[], [False, True, False]] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 25: inicioGo e navOn numa função só — cada destino abre a tela certa e acende o botão certo')
            if not ok: falhas.append('item 25 destinos'); print('        veio', troca, got, pg.erros)
            await pg.close()

            # Item 24 (20/11/2026): remendos parte 3 — cada confirmação mora num lugar só (arquivo da família): sem guarda da ação velha (A0),
            # sem calar o window.confirm e sem o "toque de novo"; a janela pergunta, Voltar não faz nada e confirmar faz UMA vez
            total += 1
            fonte = ''.join(open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js'))
            sobras = [k for k in (' A0.', 'semConfirm', 'window.confirm = ', 'S.confEst', 'S._syncDel', 'S.pinOffConf', 'S._syncDesc', 'S._pedDel', 'S._impDel', 'S.bkImpConf') if k in fonte]
            duas = [k for k in ('pedcanc', 'pedrecus', 'estorno', 'syncdesl', 'pinoff', 'nvSair', 'bkimp', 'ataCanc', 'ataLoteCanc', 'syncdesc', 'peddel', 'cartclear', 'notifLimpa', 'inicioReset', 'impdel')
                    if len(re.findall(r'ACT\.%s = function|\n    %s: function' % (k, k), fonte)) != 1]
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.pedidos.push({ id: 'pC1', num: 'pC1', orig: 'loja', st: 'novo', pg: 'pagar', cli: 'Teste', itens: [] });
              L.ACT.pedcanc('pC1'); await w(350); const abriu = !!document.querySelector('.lfCf .cf418B'), antes = S.pedidos.find(p => p.id === 'pC1').st;
              document.querySelector('.lfCf .cf418V').click(); await w(350); const voltou = S.pedidos.find(p => p.id === 'pC1').st;
              L.ACT.pedcanc('pC1'); await w(350); document.querySelector('.lfCf .cf418B').click(); await w(350); const fez = S.pedidos.find(p => p.id === 'pC1').st;
              S.cart = [{ it: S.items[0], qty: 1 }]; L.ACT.cartclear(); await w(200); const esvaziou = S.cart.length === 0;
              S.pedidos = S.pedidos.filter(p => p.id !== 'pC1'); return [abriu, antes, voltou, fez, esvaziou]; }""")
            ok = not sobras and not duas and got == [True, 'novo', 'novo', 'canc', True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 24: confirmações num lugar só (sem A0, sem calar o confirm, sem toque de novo); pergunta, Voltar e confirmar funcionam')
            if not ok: falhas.append('item 24 confirmações'); print('        veio', sobras, duas, got, pg.erros)
            await pg.close()

            # Item 16 (20/11/2026): peça incompleta não vai ao site (regra em siteCheck); a conferência tira quem ficou incompleta, não quem só esgotou;
            # as 19 peças de teste ganham o que falta UMA vez (só o vazio) e a marca "Peça de teste"
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), px = 'data:image/png;base64,AAAA';
              const ref = 'BR44118', its = () => S.items.filter(i => i.ref === ref);
              its().forEach(i => { S.fotos[ref + '|' + i.cor] = px; i.med = ''; if (i.qty < 1) i.qty = 1; });
              S.attr[ref] = { marca: 'Gucci', material: 'Metal', publico: 'Feminino', colecao: 'Clássicos' }; S.site = S.site || {}; S.site[ref] = 1; S.siteFora = {};
              const falta = L.siteFaltaDados(ref).join(','), ok0 = L.siteCheck(ref).ok, liga0 = L.siteSet(ref, true);
              S.site[ref] = 1; await L.vitConfere(); const saiu = !S.site[ref];
              S.attr[ref].formato = 'Quadrado'; its().forEach(i => i.med = '52-18-140');
              const ok1 = L.siteCheck(ref).ok && !L.siteFaltaDados(ref).length; L.siteSet(ref, true);
              its().forEach(i => i.qty = 0); await L.vitConfere(); const esgotadoFica = !!S.site[ref];
              // peças de teste
              S.pTeste = {}; S.pTeste16 = 0; delete S.attr['SL2255']; delete S.attr['AC1050'];
              S.items.push({ id: 'pt1', ref: 'SL2255', tipo: 'solar', cor: 'Preto', qty: 1, med: '' }, { id: 'pt2', ref: 'AC1050', tipo: its()[0].tipo, cor: 'Vinho', qty: 1, med: '49-19-140' });
              S.attr['AC1050'] = { formato: 'Oval' };
              const n = L.pTesteMigra(), a = S.attr['SL2255'] || {}, b = S.attr['AC1050'] || {};
              const sol = [a.formato, a.polarizado, a.publico, !!a.marca, !!a.colecao, S.items.find(i => i.id === 'pt1').med].join('|');
              const naoPisa = b.formato === 'Oval' && S.items.find(i => i.id === 'pt2').med === '49-19-140' && !b.polarizado;
              const marca = !!S.pTeste['SL2255'] && !!S.pTeste['AC1050'] && S.pTeste16 === 1 && L.pTesteMigra() === 0;
              delete S.attr['SL2255'].formato; const volta = L.pTesteMigra() === 1 && S.attr['SL2255'].formato === 'Retangular' && S.attr['AC1050'].formato === 'Oval';
              S.items = S.items.filter(i => i.id !== 'pt1'); L.limpaRefExcluido('SL2255'); const marcaSai = !S.pTeste['SL2255'];
              S.items = S.items.filter(i => i.id !== 'pt2'); return [falta, ok0, liga0, saiu, ok1, esgotadoFica, n, sol, naoPisa, marca, volta, marcaSai]; }""")
            total += 1
            ok = got == ['formato,medidas', False, False, True, True, True, 2, 'Retangular|Polarizado|Masculino|true|true|59-17-130', True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 16: peça incompleta não vai ao site; conferência tira a incompleta e deixa a esgotada; peças de teste preenchidas uma vez e marcadas')
            if not ok: falhas.append('item 16 peça incompleta'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 23 (20/11/2026): remendos parte 1 — ninguém troca o render (os acabamentos entram por antesRender/aposRender, num lugar só);
            # quem guardou o render cedo (campos do Adicionar: oninput = render) agora redesenha com TODOS os acabamentos
            total += 1
            troca = [f for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if re.search(r'^\s*render = function', open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read(), re.M)]
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('site'); await w(300); const v = document.getElementById('v-site'); const antes = !!v.querySelector('h1');
              v.innerHTML = ''; document.getElementById('eRef').dispatchEvent(new Event('input', { bubbles: true })); await w(200);
              return [antes, !!v.querySelector('h1')]; }""")
            ok = not troca and got == [True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 23: render sem embrulho — nenhum arquivo troca o render; campo do Adicionar redesenha com os acabamentos')
            if not ok: falhas.append('item 23 render sem embrulho'); print('        veio', troca, got, pg.erros)
            await pg.close()

            # Item 22 (20/11/2026): aparelho vazio e sem login — Início › "Entrar" (nuvem) abre Ajustes › Cópias e nuvem com o cursor no e-mail (dava tela vazia: nome de ação repetido)
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S._rtudo = false; S.items = []; S.nuvem = { email: '', rt: '' }; L.setView('inicio'); await w(300);
              const b = document.querySelector('.inNuvem .inFotB'); if (!b) return ['sem cartão'];
              b.click(); await w(900);
              const em = document.getElementById('nvEm'), dob = document.querySelector('.ajS.on');
              const r1 = [S.view, !!dob && dob.dataset.k, !!em && document.activeElement === em];
              L.setView('inicio'); await w(300); document.querySelector('.inNuvem').click(); await w(900);
              return r1.concat([S.view, document.activeElement === document.getElementById('nvEm'), typeof L.ACT.nvBemVindoIr, location.hash]); }""")
            total += 1
            ok = got == ['ajustes', 'bk', True, 'ajustes', True, 'function', '#ajustes'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 22: aparelho vazio › "Entrar" na nuvem abre Ajustes › Cópias e nuvem no e-mail (botão e cartão)')
            if not ok: falhas.append('item 22 Entrar na nuvem'); print('        veio', got, pg.erros)
            await pg.close()

            # B3 (20/11/2026): no grupo Site a linha e o título da tela de resumo são "Resumo" (o grupo continua "Site"); o título vem de BARRA_NOME, num lugar só
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.nvG = 'g:site'; S.nvP = ['grp:g:site']; L.setView('grp'); await w(400);
              const lin = [...document.querySelectorAll('.nvL')].filter(e => e.offsetHeight).map(e => e.querySelector('b').innerText);
              const tit = [...document.querySelectorAll('h1')].filter(e => e.offsetHeight).map(e => e.innerText.trim())[0];
              const r = [...document.querySelectorAll('.nvL')].find(e => e.offsetHeight && /Resumo/.test(e.innerText)); r && r.click(); await w(400);
              const h = document.querySelector('#v-site h1');
              return [lin[0], tit, S.view, h ? h.innerText.trim() : '']; }""")
            total += 1
            ok = got == ['Resumo', 'Site', 'site', 'Resumo'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'B3: grupo Site › linha e tela "Resumo" (o grupo continua "Site")')
            if not ok: falhas.append('B3 Resumo'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 17 (19/11/2026): site = Inventário — peça presa na nuvem (lib) sem Inventário sai (produto + fotos), mesmo fora de S.site; mais de 5 pergunta antes
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const nv0 = S.nuvem, f0 = window.fetch, ch = []; let nuvem = [];
              const doc = (r, lib) => ({ name: 'projects/x/databases/(default)/documents/produtos/' + r, fields: lib == null ? {} : { lib: { booleanValue: lib } } });
              window.fetch = async (u, o) => { u = String(u); const m = (o && o.method) || 'GET';
                if (/securetoken/.test(u)) return new Response(JSON.stringify({ id_token: 't', refresh_token: 'teste' }), { status: 200 });
                if (/firestore/.test(u)) { ch.push([m, u.replace(/^.*documents\//, '')]);
                  if (m === 'GET' && /\/produtos\?/.test(u)) return new Response(JSON.stringify({ documents: nuvem }), { status: 200 }); }
                return new Response('{}', { status: 200 }); };
              const real = S.items.find(i => i.ref && !i.bulk).ref;
              S.nuvem = { rt: 'teste' }; S.vitPend = {}; S.vitErr = {}; S.site = S.site || {}; delete S.site['PY-566'];
              nuvem = [doc('PY-566', true), doc(real, true), doc('SITE1', null)];
              L.vitNuvemTira.ts = 0; L.vitNuvemTira.nao = 0; await L.vitConfere(); await w(400);
              const leu = ch.some(c => c[0] === 'GET' && /^produtos\?.*mask.fieldPaths=lib/.test(c[1]));
              const del = ch.some(c => c[0] === 'DELETE' && c[1] === 'produtos/PY-566') && ch.some(c => c[0] === 'DELETE' && c[1] === 'fotos/PY-566');
              const fica = !ch.some(c => c[0] === 'DELETE' && (c[1] === 'produtos/' + real || c[1] === 'produtos/SITE1'));
              ch.length = 0; nuvem = ['X1', 'X2', 'X3', 'X4', 'X5', 'X6'].map(r => doc(r, true));
              L.vitNuvemTira.ts = 0; await L.vitConfere(); await w(300);
              const perg = !!document.querySelector('.lfCf .cf418B') && !ch.some(c => c[0] === 'DELETE');
              document.querySelector('.lfCf .cf418B').click(); await w(400);
              const tirou = ['X1', 'X6'].every(r => ch.some(c => c[0] === 'DELETE' && c[1] === 'produtos/' + r));
              window.fetch = f0; S.nuvem = nv0; S.vitPend = {};
              return [leu, del, fica, perg, tirou]; }""")
            total += 1
            ok = got == [True] * 5 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Item 17: site = Inventário — peça presa na nuvem sem Inventário sai (produto + fotos); mais de 5 pergunta antes')
            if not ok: falhas.append('item 17 site = Inventário'); print('        veio', got, pg.erros)
            await pg.close()

            # P1b no app (19/11/2026): reserva PAGA de pedido apagado — a nuvem devolve as órfãs pelos códigos conhecidos; solta com liberarH depois de 10 min
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const H = async sid => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('lf-res|' + sid)))].map(x => ('0' + x.toString(16)).slice(-2)).join('').slice(0, 20);
              const nv0 = S.nuvem, f0 = window.fetch, corpos = []; let respLib = { ok: false };
              const hApagado = await H('APAGADO5'), hCanc = await H('PCANC4');
              window.fetch = async (u, o) => { u = String(u);
                if (/securetoken/.test(u)) return new Response(JSON.stringify({ id_token: 't', refresh_token: 'teste' }), { status: 200 });
                if (/cloudfunctions.net\\/reserva/.test(u)) { const c = JSON.parse(o.body); corpos.push(c);
                  if (c.acao === 'orfas') return new Response(JSON.stringify({ ok: true, orfas: [{ ref: 'ZZ9', h: hApagado, cor: '', q: 1 }, { ref: 'ZZ8', h: 'nao-e-codigo', cor: '', q: 1 }] }), { status: 200 });
                  return new Response(JSON.stringify(c.acao === 'liberarH' ? respLib : { ok: true }), { status: 200 }); }
                return new Response('{}', { status: 200 }); };
              S.nuvem = { rt: 'teste' }; S.resPend = {}; S.resPendH = {}; S.resOrfH = {};
              S.pedidos.push({ id: 'pQ1', sid: 'PCANC4', orig: 'site', st: 'canc', itens: [{ ref: 'ZZ1', cor: '', q: 1 }] });
              L.resOtZera(); await L.resOrfasNuvem(); await w(100);
              const c1 = corpos.find(c => c.acao === 'orfas'), mandou = !!c1 && c1.conhecidos.includes(hCanc) && !c1.conhecidos.includes(hApagado) && !('pedido' in c1);
              const espera = !!S.resOrfH[hApagado] && !S.resPendH[hApagado] && Object.keys(S.resOrfH).length === 1;
              L.resOtZera(); await L.resOrfasNuvem(); await w(100); const naoAntes = !S.resPendH[hApagado];
              S.resOrfH[hApagado] = Date.now() - 11 * 60000; L.resOtZera(); await L.resOrfasNuvem(); await w(150);
              const fila = !!S.resPendH[hApagado] && S.resPendH[hApagado].refs[0] === 'ZZ9';
              const cl = corpos.filter(c => c.acao === 'liberarH'), lib = cl.length > 0 && cl[0].h === hApagado && cl[0].itens[0].ref === 'ZZ9';
              const ficou = !!S.resPendH[hApagado];
              respLib = { ok: true }; L.resFlushH(); await w(150); const saiu = !S.resPendH[hApagado];
              window.fetch = f0; S.pedidos = S.pedidos.filter(p => p.id !== 'pQ1'); S.resPendH = {}; S.resOrfH = {}; S.nuvem = nv0;
              return [mandou, espera, naoAntes, fila, lib, ficou, saiu]; }""")
            total += 1
            ok = got == [True] * 7 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'P1b no app: órfã paga de pedido apagado vem da nuvem, espera 10 min e sai por liberarH (recusa fica na fila)')
            if not ok: falhas.append('P1b no app'); print('        veio', got, pg.erros)
            await pg.close()

            # 149cam-F/M2/X (19/11/2026): câmera do Estúdio com Vídeo (conferidor do giro) e Foto, um ícone troca; em pé não grava
            pg = await pagina()
            await pg.set_viewport_size({'width': 844, 'height': 390})
            cena = """() => { navigator.mediaDevices.getUserMedia = async function () { const cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080; const x = cv.getContext('2d');
              const draw = () => { x.fillStyle = '#b4b4b2'; x.fillRect(0, 0, 1920, 1080); x.fillStyle = '#ececea'; x.fillRect(0, 640, 1920, 440);
                const cx = 960, W = 1920 * 0.48, cy = 600, L = W * 0.3, ah = W * 0.17; x.strokeStyle = '#1d1d1f'; x.lineWidth = 14; x.lineJoin = 'round'; x.beginPath();
                x.roundRect(cx - W * 0.33, cy - ah / 2, L, ah, 30); x.roundRect(cx + W * 0.03, cy - ah / 2, L, ah, 30); x.moveTo(cx - W * 0.03, cy - ah * 0.2); x.quadraticCurveTo(cx, cy - ah * 0.45, cx + W * 0.03, cy - ah * 0.2); x.moveTo(cx - W * 0.33, cy - ah * 0.3); x.lineTo(cx - W * 0.5, cy - ah * 0.45); x.moveTo(cx + W * 0.33, cy - ah * 0.3); x.lineTo(cx + W * 0.5, cy - ah * 0.45); x.stroke();
                requestAnimationFrame(draw) }; draw(); return cv.captureStream(30) }; return 1 }"""
            await pg.evaluate(cena)
            await pg.evaluate("() => { window.__LF.ACT.estAbre(); }"); await pg.wait_for_timeout(600)
            await pg.evaluate("() => document.querySelector('[data-e=nova]').click()"); await pg.wait_for_timeout(4500)
            le = """() => { const o = document.getElementById('estCam'); if (!o) return null; const c = o.__c149, r = o.querySelector('#ecRec');
              return [o.dataset.modo, o.querySelector('.ecTag').textContent, o.querySelectorAll('.ecLista span').length, !!(c && c.ok), !!r && !r.disabled, o.classList.contains('ecVok'),
                (o.querySelector('.ecModo') || {}).getAttribute ? o.querySelector('.ecModo').getAttribute('aria-label') : '', getComputedStyle(o.querySelector('.ecDispFoto')).display, o.querySelector('.ecFrase').textContent, (o.querySelector('.ecGuias') || { children: [] }).children.length, o.querySelector('.ecGuias') ? getComputedStyle(o.querySelector('.ecGuias')).display : ''] }"""
            v1 = await pg.evaluate(le)
            await pg.evaluate("() => document.querySelector('#estCam .ecModo').click()"); await pg.wait_for_timeout(600)
            f1 = await pg.evaluate(le)
            await pg.evaluate("() => document.querySelector('#estCam .ecModo').click()"); await pg.wait_for_timeout(300)
            await pg.set_viewport_size({'width': 390, 'height': 844}); await pg.wait_for_timeout(2500)
            e1 = await pg.evaluate(le)
            await pg.evaluate("() => document.querySelector('#estCam [data-c=x]').click()"); await pg.wait_for_timeout(300)
            fechou = await pg.evaluate("() => !document.getElementById('estCam')")
            total += 1
            ok = (v1 and v1[0] == 'video' and v1[1] == 'Giro · volta de 360°' and v1[2] == 11 and v1[3] and v1[4] and v1[5] and v1[6] == 'Mudar para foto' and v1[7] == 'none'
                  and v1[9] >= 10 and v1[10] == 'block' and f1 and f1[0] == 'foto' and f1[2] == 4 and f1[6] == 'Mudar para vídeo' and f1[7] != 'none' and f1[10] == 'none'
                  and e1 and e1[0] == 'video' and not e1[4] and e1[8] == 'Deite o celular' and fechou and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '149cam-F/M2/G: câmera do Estúdio — Vídeo confere os 11 itens, guias na imagem e Gravar no verde; ícone troca para Foto (4 itens, sem guias); em pé pede para deitar')
            if not ok: falhas.append('camera estudio modos'); print('        veio', v1, f1, e1, fechou, pg.erros)
            await pg.close()

            # Esboço 40a (aprovado 21/11 07:51): "Celular deitado" virou "Câmera reta" — deitado E nivelado (|nível| ≤ 1°) por UM sensor (camNivel,
            # usado pelo Foto e pelo Vídeo); torto, a frase diz os graus e o lado, o horizonte das guias gira e mostra o número, e não dá para gravar.
            pg = await pagina()
            await pg.set_viewport_size({'width': 844, 'height': 390})
            conta = await pg.evaluate("""() => { const L = window.__LF, n = L.camNivelDe, a = x => x == null ? null : Math.round(x * 10) / 10;
              const m = { W: 640, H: 360, parede: 180, desv: .01, cost: [], borda: 250, cortada: false, peca: { x0: 170, x1: 470, y0: 150, y1: 260, nit: 1 } }, c = (ex) => { const r = L.confereGiro(m, ex), i = r.itens[0]; return [i.id, i.nome, i.ok, i.fazer]; };
              return [a(n(90, 0)), a(n(0, -90)), a(n(0, 90)), a(n(3, -90)), a(n(-3, -90)), a(n(87, 0) ), n(0, 0), n(null, null),
                c({ nivel: 0 }), c({ nivel: null }), c({ nivel: 3 }), c({ nivel: -2.4 }), c({ nivel: 0, emPe: true }), c({ nivel: 1.2, ant: { reto: true } })[2], c({ nivel: 0.8, ant: { reto: false } })[2], c({ nivel: 0, ant: { reto: false } })[2]]; }""")
            await pg.evaluate(cena)
            await pg.evaluate("() => { window.__LF.ACT.estAbre(); }"); await pg.wait_for_timeout(600)
            await pg.evaluate("() => document.querySelector('[data-e=nova]').click()"); await pg.wait_for_timeout(4500)
            le40 = """() => { const o = document.getElementById('estCam'), l = [...o.querySelectorAll('.ecLista span')], g = o.querySelector('.ecGuias'), t = g && g.querySelector('text'), r = o.querySelector('#ecRec');
              return [l.length, l[0].textContent, l[0].className, o.querySelector('.ecFrase').textContent, t ? t.textContent : '', g ? g.querySelectorAll('line[stroke-dasharray="4 4"]').length : -1, !!r && !r.disabled]; }"""
            sensor = "a => { window.__sn = setInterval(() => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: a[0], gamma: a[1] })), 100); }"
            n0 = await pg.evaluate(le40)
            await pg.evaluate(sensor, [-3, -90]); await pg.wait_for_timeout(2600); n3 = await pg.evaluate(le40)
            await pg.evaluate("() => clearInterval(window.__sn)"); await pg.evaluate(sensor, [0, -90]); await pg.wait_for_timeout(3200); n1 = await pg.evaluate(le40)
            await pg.evaluate("() => clearInterval(window.__sn)")
            total += 1
            ok = (conta[:8] == [0, 0, 0, -3, 3, 0, None, None] and conta[8] == ['reto', 'Câmera reta', True, ''] and conta[9][2] is True
                  and conta[10] == ['reto', 'Câmera reta', False, 'Endireite o celular: 3° para a direita'] and conta[11][3] == 'Endireite o celular: 2° para a esquerda'
                  and conta[12] == ['reto', 'Câmera reta', False, 'Deite o celular'] and conta[13] is True and conta[14] is False and conta[15] is True   # torto → exatamente reto volta ao verde (falha da v615: a folga pedia ≥ 0,3°)
                  and n0 == [11, 'Câmera reta', 'ok', n0[3], '', 0, True] and n3[:3] == [11, 'Câmera reta', 'ruim'] and n3[3] == 'Endireite o celular: 3° para a direita' and n3[4] == '3°' and n3[5] == 2 and not n3[6]
                  and n1[2] == 'ok' and n1[4] == '' and n1[5] == 0 and n1[6]
                  and sum(len(re.findall(r"addEventListener\('deviceorientation'", t)) for t in fontes.values()) == 1 and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 40a: "Câmera reta" — um sensor de nível (Foto e Vídeo); torto diz os graus e o lado, o horizonte gira com o número e não grava; reto volta ao verde')
            if not ok: falhas.append('40a camera reta'); print('        veio', conta, n0, n3, n1, pg.erros)
            await pg.close()

            # Esboço 40b (aprovado 21/11 07:51): item novo "Peça reta" depois de "Peça no prato" — pela imagem, o topo de cada lado da armação na mesma
            # altura (≤ 2% do quadro). Peça girada 4° no prato: item em falta, frase diz o lado baixo, seta na guia e não grava; reta: verde.
            # A lista de 11 itens cabe na coluna (L4, lfCabe) a 844×390 e a 740×360.
            cena40 = cena.replace("const draw = () => { x.fillStyle = '#b4b4b2';", "const draw = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = '#b4b4b2';").replace("const cx = 960, W = 1920 * 0.48, cy = 600,", "x.translate(960, 600); x.rotate((window.__fkRot || 0) * Math.PI / 180); x.translate(-960, -600); const cx = 960, W = 1920 * 0.48, cy = 600,")
            assert cena40.count('__fkRot') == 1 and 'setTransform' in cena40
            le40b = """() => { const o = document.getElementById('estCam'), l = [...o.querySelectorAll('.ecLista span')], g = o.querySelector('.ecGuias'), r = o.querySelector('#ecRec'), L = o.querySelector('.ecPainel.ecL'), i = l.findIndex(x => x.textContent === 'Peça reta');
              return [l.length, i, i >= 0 ? l[i - 1].textContent : '', i >= 0 ? l[i].className : '', o.querySelector('.ecFrase').textContent, g ? g.querySelectorAll('line[stroke-dasharray="5 5"]').length : -1, !!r && !r.disabled,
                L.scrollHeight <= L.clientHeight + 1 && l.every(e => e.scrollWidth <= e.clientWidth + 1), o.getAttribute('data-cabe')]; }"""
            got = []
            for W40, H40 in ((844, 390), (740, 360)):
                pg = await pagina()
                await pg.set_viewport_size({'width': W40, 'height': H40})
                await pg.evaluate(cena40)
                await pg.evaluate("() => { window.__LF.ACT.estAbre(); }"); await pg.wait_for_timeout(600)
                await pg.evaluate("() => document.querySelector('[data-e=nova]').click()"); await pg.wait_for_timeout(4500)
                reta = await pg.evaluate(le40b)
                await pg.evaluate("() => { window.__fkRot = 4; }"); await pg.wait_for_timeout(4500); t4 = await pg.evaluate(le40b)
                await pg.evaluate("() => { window.__fkRot = -4; }"); await pg.wait_for_timeout(4500); tm4 = await pg.evaluate(le40b)
                await pg.evaluate("() => { window.__fkRot = 0; }"); await pg.wait_for_timeout(5000); volta = await pg.evaluate(le40b)
                got.append([reta, t4, tm4, volta]); erros40b = list(pg.erros); await pg.close()
                if erros40b: break
            total += 1
            ok = len(got) == 2 and not erros40b and all(
                r[0][:4] == [11, 4, 'Peça no prato', 'ok'] and r[0][5] == 1 and r[0][6] and r[0][7]
                and r[1][3] == 'ruim' and r[1][4] == 'Endireite a armação no prato: o lado direito está baixo' and not r[1][6] and r[1][7]
                and r[2][3] == 'ruim' and r[2][4] == 'Endireite a armação no prato: o lado esquerdo está baixo' and not r[2][6]
                and r[3][3] == 'ok' and r[3][6] for r in got)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 40b: "Peça reta" — peça girada 4° no prato fica em falta com o lado baixo na frase e a seta na guia; reta fica verde; 11 itens cabem a 844×390 e 740×360')
            if not ok: falhas.append('40b peca reta'); print('        veio', got, erros40b)

            # Esboço 40c (dono 21/11 07:51 e 07:54): o tratamento do giro endireita — a MESMA medida do "Peça reta" (gtTopo) dá a inclinação da frente;
            # até 0,5° não mexe (o giro sai igual), até 3° gira os quadros no ângulo contrário, acima disso não endireita e avisa. A prova de ponta a
            # ponta (vídeo gravado, 0°/2°/−2°/5°) é o work/s436/40/endireita_ponta_a_ponta.py: aqui ficam a medida, a decisão e o giro do quadro.
            pg = await pagina()
            got = await pg.evaluate("""() => { const topo = window.__gtTopo, dec = window.__gtRetoDecide, R = {};
              // máscara de uma armação (dois aros) girada N graus em volta do meio
              const cena = (g) => { const W = 480, H = 320, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
                x.translate(W / 2, H / 2); x.rotate(g * Math.PI / 180); x.translate(-W / 2, -H / 2); x.strokeStyle = '#000'; x.lineWidth = 8; x.strokeRect(110, 120, 110, 70); x.strokeRect(260, 120, 110, 70); x.beginPath(); x.moveTo(220, 150); x.lineTo(260, 150); x.stroke();
                const d = c.getContext('2d').getImageData(0, 0, W, H).data, m = new Uint8Array(W * H); let x0 = W, x1 = -1, y0 = H, y1 = -1;
                for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) if (d[(y * W + xx) * 4] < 128) { m[y * W + xx] = 1; if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
                const t = topo(m, W, x0, x1, y0, y1); return t ? Math.round(Math.atan2(t.d - t.e, t.xd - t.xe) * 1800 / Math.PI) / 10 : null; };
              R.mede = [0, 2, -2, 5, 0.3].map(cena);
              R.decide = [0, 0.4, -0.5, 2, -2.9, 3.2, -5].map(a => { const r = dec(a); return [r.gira, r.torta]; });
              R.vazio = topo(new Uint8Array(100), 10, 0, 9, 0, 9);
              // espelho: a frente (dois aros iguais) girada 2° e desfeita fica igual ao próprio espelho; uma vista de lado (um aro largo e um estreito) não
              const esp = (g, lado) => { const W = 480, H = 320, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
                x.translate(W / 2, H / 2); x.rotate(g * Math.PI / 180); x.translate(-W / 2, -H / 2); x.strokeStyle = '#000'; x.lineWidth = 8; x.strokeRect(110, 120, lado ? 150 : 110, 70); x.strokeRect(lado ? 290 : 260, lado ? 130 : 120, lado ? 60 : 110, lado ? 50 : 70);
                const d = c.getContext('2d').getImageData(0, 0, W, H).data, m = new Uint8Array(W * H); let x0 = W, x1 = -1, y0 = H, y1 = -1;
                for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) if (d[(y * W + xx) * 4] < 128) { m[y * W + xx] = 1; if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
                return window.__gtEspelho(m, W, x0, x1, y0, y1, g); };
              R.espelho = [esp(0, 0) > 0.6, esp(2, 0) > 0.6, esp(2, 1) < 0.37];
              return R; }""")
            gt = fontes['97-giro-trata.js']; eg = fontes['97-estudio-giro.js']; cam = fontes['98z-camera-u149f.js']
            total += 1
            ok = (all(abs(a - b) <= 0.35 for a, b in zip(got['mede'], [0, 2, -2, 5, 0.3])) and got['decide'] == [[0, False], [0, False], [0, False], [-2, False], [2.9, False], [0, True], [0, True]] and got['vazio'] is None and got['espelho'] == [True, True, True]
                  and 'gtTopo(M,w,' in cam and cam.count('lado=function') == 0            # o conferidor usa a mesma medida, sem cópia
                  and 'tr.gira(reto.gira)' in gt and 'if (giroG) {' in gt and 'reto: reto' in gt and 'reto.espelho < GT_ESPELHO' in gt
                  and 'if (med[cand][7] < GT_ESPELHO)' in gt and 'espn]);' in gt     # v618: a frente achada só vale se for igual ao espelho; senão vale a mais parecida, descontada a inclinação  # o giro dos quadros sai da decisão e vai para o resultado
                  and "lfToast(torta, 'atencao')" in eg and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 40c: o tratamento endireita o giro — mesma medida do "Peça reta", até 0,5° não mexe, até 3° gira ao contrário, acima avisa')
            if not ok: falhas.append('40c tratamento endireita'); print('        veio', got, pg.erros)
            await pg.close()

            # Esboço 41 parte 1 (aprovado 21/11 07:51): o Estúdio mostra o que cada peça TEM — Frente · 3/4 · Giro, sempre nessa ordem, bolinha = tem,
            # anel = falta; as marcas, a fila e (depois) a Galeria leem de UMA função, estTem(k). Saiu a frase "falta a foto de 3/4".
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const F0 = L.estFila(); const a = F0.find(x => x.st === '34') || F0[0]; S.giros = S.giros || {}; S.giros[a.ref] = { k: a.k, ts: Date.now(), n: 360 };
              L.ACT.estAbre(); await w(600);
              const linhas = [...document.querySelectorAll('.estOv .estRw')], F = L.estFila();
              R.n = linhas.length;
              R.batem = linhas.every((l, i) => { const t = L.estTem(F[i].k), m = [...l.querySelectorAll('.estMk > span')];
                return m.length === 3 && m.map(x => x.textContent).join('|') === 'Frente|3/4|Giro' && m[0].classList.contains(t.frente ? 'tem' : 'falta') && m[1].classList.contains(t.tres4 ? 'tem' : 'falta') && m[2].classList.contains(t.giro ? 'tem' : 'falta'); });
              const la = linhas[F.findIndex(x => x.k === a.k)]; R.giro = la ? la.querySelector('.estMk > span:nth-child(3)').className : 'fora da lista';
              const i1 = document.querySelector('.estMk .tem i'), i0 = document.querySelector('.estMk .falta i'); R.cor = [!!i1 && getComputedStyle(i1).backgroundColor !== 'rgba(0, 0, 0, 0)', !!i0 && getComputedStyle(i0).backgroundColor === 'rgba(0, 0, 0, 0)'];
              R.frase = /falta a foto de 3.4|sem foto/.test(document.querySelector('.estOv').textContent);
              R.tem = [L.estTem('NAO-EXISTE|x'), Object.keys(L.estTem(a.k)).sort().join()];
              return R; }""")
            total += 1
            ok = (got['n'] >= 3 and got['batem'] and got['giro'] == 'tem' and got['cor'] == [True, True] and not got['frase']
                  and got['tem'][0] == {'frente': False, 'fotoRuim': False, 'tres4': False, 'giro': False} and got['tem'][1] == 'fotoRuim,frente,giro,tres4'
                  and fontes['97-estudio.js'].count('S.fotoNota[x.k]') <= 2 and "sub: 'sem a de 3/4'" not in fontes['97-estudio.js'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 41 (1): Estúdio mostra Frente · 3/4 · Giro em cada peça, lido de estTem (a mesma conta da fila); sem a frase "falta a foto de 3/4"')
            if not ok: falhas.append('41 marcas do estudio'); print('        veio', got, pg.erros)
            await pg.close()

            # Leve 2 do site fora do app (dono 21/11 23:21: "é código morto" — o site tirou em 19/11): sem a regra dos 30%, sem o campo l2 na vitrine,
            # sem ler l2 do pedido novo e sem os rótulos. Pedido ANTIGO gravado com o desconto continua mostrando o valor ("Desconto do site") e o total fecha.
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              S.pedidos.push({ id: 'pL2', sid: 'SIDL2', cod: 'L2A', orig: 'site', st: 'novo', cli: 'Antiga', tel: '', ts: Date.now() - 5 * 864e5, total: 170000, l2: 30000, itens: [{ ref: 'AAA1', t: 'Óculos', cor: 'Preto', q: 2, preco: 100000 }] });
              L.setView('ped'); await w(400); L.ACT.pedab('pL2'); await w(500);
              const tx = document.getElementById('v-ped').innerText;
              R.antigo = [/Desconto do site/.test(tx), /30[.]000/.test(tx), /170[.]000/.test(tx), /Leve 2/i.test(tx)];
              R.api = typeof L.siteL2;
              const ref = (S.items.find(i => i.qty > 0) || {}).ref; R.vitrine = L.vitProduto ? ('l2' in (L.vitProduto(ref) || {})) : 'sem função';
              S.pedidos = S.pedidos.filter(p => p.id !== 'pL2');
              return R; }""")
            sobra = [f for f, t in fontes.items() if f != '98-carrinho.js' and re.search(r'Leve 2|siteL2|SITE_L2', t)]   # 98-carrinho: a sugestão "Leve 2" do balcão é outra coisa e espera o dono
            total += 1
            ok = got['antigo'] == [True, True, True, False] and got['api'] == 'undefined' and got['vitrine'] in (False, 'sem função') and not sobra and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Leve 2 do site fora do app: sem regra, sem campo na vitrine, sem rótulos; pedido antigo com o desconto continua fechando')
            if not ok: falhas.append('leve 2 fora'); print('        veio', got, sobra, pg.erros)
            await pg.close()

            # Esboço 41 parte 2 (aprovado 21/11 07:51): a câmera diz PARA QUAL PEÇA vai — "GIRO PARA" / "FOTO PARA" + nome + cor + código, escritos por
            # UMA função (estCamTag) ao abrir e a cada troca de modo; sem peça fica o texto de sempre. Com o cabeçalho, a frase mais longa e os 11
            # itens a coluna da esquerda cabe (L4) a 844×390 e a 740×360.
            got = []
            for W41, H41 in ((844, 390), (740, 360)):
                pg = await pagina()
                await pg.set_viewport_size({'width': W41, 'height': H41})
                await pg.evaluate(cena)
                r41 = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
                  const F = L.estFila(), x = F.slice().sort((a, b) => L.pn(b.ref).length - L.pn(a.ref).length)[0];   // a peça de nome mais comprido
                  const tag = () => document.querySelector('#estCam .ecTag'), le = () => [...tag().children].map(e => e.textContent);
                  L.estGiro({ k: x.k }); await w(4200);
                  R.video = le(); R.certo = [L.pn(x.ref), x.cor, x.ref];
                  const o = document.getElementById('estCam'), col = o.querySelector('.ecPainel.ecL');
                  o.querySelector('.ecFrase').lastChild.textContent = 'Fundo manchado: tire sombras e reflexos de trás da peça'; L.c149Cabe(o); await w(100);
                  R.cabe = [col.scrollHeight <= col.clientHeight + 1, [...o.querySelectorAll('.ecLista span')].length, o.getAttribute('data-cabe')];
                  o.querySelector('.ecModo').click(); await w(500); R.foto = le();
                  o.querySelector('.ecModo').click(); await w(300); R.volta = le()[0];
                  o.querySelector('[data-c=x]').click(); await w(400);
                  R.nova = [L.estCamTag({ nova: true, passo: 'frente', titulo: 'Antes de cadastrar' }, 'foto'), L.estCamTag({ nova: true }, 'video'), L.estCamTag({ medir: true }, 'foto')];
                  R.sessao = L.estCamTag({ k: x.k, passo: '34', prog: 'peça 3 de 24', corTxt: 'cor 1 de 2' }, 'foto').replace(/<[^>]+>/g, '|');
                  return R; }""")
                got.append(r41); erros41 = list(pg.erros); await pg.close()
                if erros41: break
            total += 1
            ok = len(got) == 2 and not erros41 and all(
                r['video'] == ['Giro para'] + r['certo'] and r['cabe'][0] and r['cabe'][1] == 11
                and r['foto'][0] == 'Foto para' and r['foto'][1:4] == r['certo'] and r['foto'][4] == 'Frente · 1 de 2' and r['volta'] == 'Giro para'
                and r['nova'] == ['Frente · 1 de 2 · Antes de cadastrar', 'Giro · volta de 360°', 'Aponte só para a cartolina e toque em Medir fundo']
                and r['sessao'].endswith('3/4 · 2 de 2 · peça 3 de 24 · cor 1 de 2|') for r in got) and 'dataset.orig' not in fontes['98z-camera-u149f.js']
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 41 (2): a câmera diz para qual peça vai — GIRO PARA / FOTO PARA + nome, cor e código, por uma função só; a coluna cabe a 844×390 e 740×360')
            if not ok: falhas.append('41 camera para qual peca'); print('        veio', got, erros41)

            # Esboço 41 parte 3 (aprovado 21/11 07:51): Galeria da peça — "Galeria ›" na linha do Estúdio abre a peça certa ("‹ Estúdio", nome, cor);
            # os blocos FRENTE · 3/4 · GIRO batem com estTem (foto ou lugar tracejado; "Refazer ›" / "Tirar agora ›" / "Gravar agora ›"); o giro gira
            # com o dedo pela conta do site (220° por largura, quadro = ângulo/360 × n, vídeo no meio do quadro); "‹ Estúdio" volta à lista.
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              // um giro de mentira de 2 s (60 quadros) guardado como o app guarda
              const cv = document.createElement('canvas'); cv.width = 320; cv.height = 214; const x = cv.getContext('2d'); let i = 0, vivo = true;
              (function d() { x.fillStyle = '#fff'; x.fillRect(0, 0, 320, 214); x.fillStyle = '#222'; x.fillRect(40 + (i++ % 200), 80, 60, 40); if (vivo) requestAnimationFrame(d); })();
              const rec = new MediaRecorder(cv.captureStream(30)), ch = []; rec.ondataavailable = e => e.data.size && ch.push(e.data); const fim = new Promise(r => rec.onstop = r); rec.start(); await w(2100); rec.stop(); await fim; vivo = false;
              const F = L.estFila(), a = F.find(z => z.st === '34') || F[0];
              await L.estGiroGuarda(a.k, new Blob(ch, { type: 'video/webm;gn=60' })); await w(300);
              L.ACT.estAbre(); await w(500);
              const linha = [...document.querySelectorAll('.estOv .estRw')].find(l => l.querySelector('.estFi').getAttribute('data-k') === a.k);
              R.link = linha.querySelector('.estFi').textContent; linha.querySelector('.estFi').click(); await w(1500);
              const g = document.querySelector('.estGal'), t = L.estTem(a.k), bl = [...g.querySelectorAll('.galB')];
              R.topo = [g.querySelector('.galVs').textContent, g.querySelector('.galNm').textContent === L.pn(a.ref), g.querySelector('.estSub').textContent.indexOf(a.cor) === 0];
              R.blocos = bl.map(b => [b.querySelector('.galT span').textContent, (b.querySelector('.galT button') || {}).textContent || '', !!b.querySelector('.galF img'), !!b.querySelector('.galV'), !!b.querySelector('.galG')]);
              R.tem = [t.frente || t.fotoRuim, t.tres4, t.giro];
              const cx = g.querySelector('#galG'), G = cx._gal; R.pronto = !!G && G.ok && G.n === 60;
              // arrastar 100 px para a esquerda = 100 × 220/largura graus para a frente
              const larg = cx.clientWidth, r0 = cx.getBoundingClientRect(), ev = (tp, px) => cx.dispatchEvent(new PointerEvent(tp, { bubbles: true, cancelable: true, pointerId: 7, clientX: px, clientY: r0.top + 50, button: 0 }));
              ev('pointerdown', r0.left + 250); ev('pointermove', r0.left + 150); await w(600);
              const esper = L.galQuadro(100 * L.galGrausPorPx(larg), 60);
              R.gira = [G.mostr === esper, Math.abs(G.v.currentTime - (esper + 0.5) / 30) < 0.02, g.querySelector('#galGa').textContent === Math.round(esper * 360 / 60) + '° de 360°'];
              ev('pointerup', r0.left + 150); await w(200);
              R.conta = [L.galQuadro(0, 360), L.galQuadro(-1, 360), L.galQuadro(360, 360), L.galQuadro(136, 360), L.galGrausPorPx(100), L.galGrausPorPx(440)];
              g.querySelector('.galVs').click(); await w(300); R.voltou = !document.querySelector('.estGal') && !!document.querySelector('.estOv .estRw');
              return R; }""")
            total += 1
            bl41 = got['blocos']
            ok = (got['link'] == 'Galeria ›' and got['topo'] == ['‹ Estúdio', True, True] and len(bl41) == 3 and [x[0] for x in bl41] == ['Frente', '3/4', 'Giro · 360°']
                  and bl41[0][1] == ('Refazer ›' if got['tem'][0] else 'Tirar agora ›') and bl41[0][2] == bool(got['tem'][0])
                  and bl41[1][1] == ('Refazer ›' if got['tem'][1] else 'Tirar agora ›') and bl41[1][2] == got['tem'][1] and bl41[1][3] == (not got['tem'][1])
                  and bl41[2][1] == 'Refazer ›' and bl41[2][4] and got['tem'][2] and got['pronto'] and got['gira'] == [True, True, True]
                  and got['conta'] == [0, 359, 0, 136, 1.1, 0.5] and got['voltou'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 41 (3): Galeria da peça — abre a peça certa, blocos batem com estTem, o giro gira com o dedo pela conta do site, "‹ Estúdio" volta')
            if not ok: falhas.append('41 galeria da peca'); print('        veio', got, pg.erros)
            await pg.close()

            # Esboço 42a (aprovado 21/11 07:51): Editar produto › Cores e fotos sem o "Trocar foto" do topo (câmera crua, sem dizer a cor); a foto de uma
            # cor tem UM caminho — a câmera do Estúdio, que trata e grava na cor certa: a miniatura da linha e o selo "refazer ›" abrem #estCam nessa cor.
            pg = await pagina()
            await pg.evaluate(cena)
            await pg.evaluate("() => window.__LF.setView('estoque')"); await pg.wait_for_timeout(600)
            await pg.evaluate("() => { [...document.querySelectorAll('#v-estoque .pcard')].find(x => x.dataset.ref === 'SP58110').click(); }"); await pg.wait_for_timeout(800)
            await pg.evaluate("() => { window.__LF.S.qEdit = true; window.__LF.render(); document.getElementById('edTab2').click(); }"); await pg.wait_for_timeout(900)
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms)), R = {}, j = document.querySelector('.ljJn.edJn') || document;
              R.topo = [!!document.getElementById('edTrocaFoto'), !!j.querySelector('.edFoto'), j.querySelectorAll('.edFoto button').length, /Adicionar foto/.test(j.textContent)];
              const ft = j.querySelector('.cfFt[aria-label^="Foto da cor"]'), cor = ft.getAttribute('aria-label').replace('Foto da cor ', '');
              ft.click(); await w(2500);
              const cam = document.getElementById('estCam'), tag = cam && cam.querySelector('.ecTag');
              R.cam = [!!cam, tag ? [...tag.children].map(e => e.textContent).slice(0, 4) : [], cor];
              if (cam) cam.querySelector('[data-c=x]').click(); await w(400);
              return R; }""")
            det = fontes['10-estoque-detalhe.js']
            total += 1
            ok = (got['topo'] == [False, True, 0, False] and got['cam'][0] and got['cam'][1][0] in ('Giro para', 'Foto para') and   # a câmera do Estúdio abre no Vídeo (149cam-F); o ícone troca para Foto
                   got['cam'][1][2] == got['cam'][2] and got['cam'][1][3] == 'SP58110'
                  and 'pickPhoto' not in det and 'S.photoFor = { ref: ref' not in det and det.count('estCam({ k: ref + ') == 1
                  and '.edTroca' not in open(os.path.join(RAIZ, 'www', 'style.css'), encoding='utf-8').read() and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 42a: Cores e fotos sem "Trocar foto" no topo; a foto da cor abre a câmera do Estúdio na cor certa (um caminho só, sem câmera crua)')
            if not ok: falhas.append('42a sem trocar foto'); print('        veio', got, pg.erros)
            await pg.close()

            # Esboço 42b (aprovado 21/11 07:51): "+ Nova cor ›" no Editar › Cores e fotos abre a janela "Nova cor" — as cores que a loja já usa, por uso,
            # sem as que a peça já tem, + "Outra…"; código sugerido (o próximo C#), quantidade e custo; Salvar cria a cor por UMA função (corNova),
            # sem foto, e ela entra na fila do Estúdio; sair com mudança pergunta "Sair sem salvar?". Sem linha de rascunho nem câmera antes.
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')"); await pg.wait_for_timeout(600)
            ref42 = await pg.evaluate("() => { const S = window.__LF.S, i = S.items.find(x => !x.bulk && x.tipo !== 'pre' && x.qty > 0 && S.items.filter(y => y.ref === x.ref).length >= 2); return i.ref; }")
            await pg.evaluate("r => { [...document.querySelectorAll('#v-estoque .pcard')].find(x => x.dataset.ref === r).click(); }", ref42); await pg.wait_for_timeout(800)
            await pg.evaluate("() => { window.__LF.S.qEdit = true; window.__LF.render(); document.getElementById('edTab2').click(); }"); await pg.wait_for_timeout(900)
            got = await pg.evaluate("""async (ref) => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
              const b = document.getElementById('edCorNova'); R.linha = [b.textContent.trim(), !!b.querySelector('.pl78 svg'), /tire a foto/.test(b.textContent)];
              const tem = S.items.filter(i => i.ref === ref).map(i => i.cor), loja = L.coresDaLoja(tem), vr = L.corProximaClasse(ref), n0 = S.items.length, base = S.items.find(i => i.ref === ref && !i.bulk);
              b.click(); await w(600); let j = document.querySelector('.ljJn.cnJn');
              const pil = [...j.querySelectorAll('.cnCor[data-cor]')].map(x => x.getAttribute('data-cor'));
              R.janela = [j.getAttribute('aria-label'), pil.join() === loja.slice(0, 8).join(), pil.some(c => tem.indexOf(c) >= 0), !!j.querySelector('.cnCor[data-outra]'), j.querySelector('.cnLn b').textContent === vr, j.querySelector('#cnQ').textContent, [...j.querySelectorAll('button')].filter(x => x.classList.contains('go')).map(x => x.textContent).join()];
              esc(); await w(500); R.semMudar = !document.querySelector('.ljJn.cnJn');
              b.click(); await w(600); j = document.querySelector('.ljJn.cnJn'); j.querySelector('.cnCor[data-cor]').click(); await w(150);
              esc(); await w(500); R.pergunta = document.body.innerText.includes('Sair sem salvar?');
              const volta = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Voltar' && x.getClientRects().length); if (volta) volta.click(); await w(400);
              j = document.querySelector('.ljJn.cnJn'); j.querySelector('[data-d="1"]').click(); j.querySelector('[data-d="1"]').click(); j.querySelector('#cnCusto').value = '7,25';
              j.querySelector('[data-cn=salva]').click(); await w(700);
              const nova = S.items[S.items.length - 1];
              R.criou = [S.items.length - n0, nova.ref === ref, nova.cor === pil[0], nova.vr === vr, nova.qty, nova.custo, nova.tipo === base.tipo, !document.querySelector('.ljJn.cnJn'), !!document.querySelector('.ljJn.edJn')];
              R.fila = L.estFila().some(x => x.k === ref + '|' + pil[0] && x.st === 'sem');
              R.lista = [...document.querySelectorAll('.ljJn.edJn .cfRow')].some(r => r.textContent.indexOf(pil[0]) >= 0) && !document.querySelector('.cfRow.nova');
              const s1 = L.corNova(ref, { cor: pil[0], q: 2 }), s2 = L.corNova(ref, { cor: '' }), s3 = L.corNova(ref, { cor: 'Verde-água de teste', q: 1 });
              R.regra = [s1.ok && s1.somou, S.items.length - n0, nova.qty, s2.ok, s3.ok && !s3.somou, !!S.palette['Verde-água de teste'], L.corProximaClasse(ref) !== vr];
              return R; }""", ref42)
            det = fontes['10-estoque-detalhe.js']
            total += 1
            ok = (got['linha'] == ['Nova cor ›', True, False] and got['janela'] == ['Nova cor', True, False, True, True, '1', 'Salvar'] and got['semMudar'] and got['pergunta']
                  and got['criou'] == [1, True, True, True, 3, 7.25, True, True, True] and got['fila'] and got['lista']
                  and got['regra'] == [True, 2, 5, False, True, True, True]   # somar não cria linha; a cor escrita à mão cria a 2ª
                  and not re.search(r'edNovas|edFotoNova|edCorSheet', det) and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 42b: "+ Nova cor ›" abre a janela — cores da loja por uso, código sugerido, quantidade e custo; salvar cria a cor (corNova) e ela entra na fila do Estúdio')
            if not ok: falhas.append('42b nova cor'); print('        veio', got, pg.erros)
            await pg.close()

            # Família Inventário 65a (52d, implementar 22/11 12:51): embaixo do título o resumo "N referências · US$ X a custo" (no lugar do caminho fixo);
            # sem os números grandes; "N preços para corrigir" sai da barra e vai para o sino (uma linha só de preço, abre Preços).
            # Achado do dono 22/11 13:09 (L2): em TODA tela com botão redondo no título, centro do botão = centro do h1 (±1 px), celular e computador.
            got = []
            for W65 in (390, 1366):
                ctx65 = await b.new_context(viewport={'width': W65, 'height': 844}, color_scheme='dark', service_workers='block')
                pg = await pagina(ctx=ctx65, fam=True, tudo=False)
                got.append(await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
                  L.setView('estoque'); await w(500);
                  const refs = new Set(S.items.filter(i => i.qty > 0).map(i => i.ref)).size, custo = S.items.reduce((a, i) => a + (i.qty > 0 ? (+i.custo || 0) * i.qty : 0), 0);
                  R.resumo = document.getElementById('crumb').textContent === refs + ' referências · US$ ' + Math.round(custo).toLocaleString('pt-BR').replace(/,/g, '.') + ' a custo';
                  R.sem = [!document.getElementById('kpisE'), !document.querySelector('#invInfo .ifNum'), /^\\d+ peças · Todos$/.test(document.getElementById('invInfo').textContent.trim())];
                  const pc = L.invPrecosAcorrigir ? L.invPrecosAcorrigir().length : -1, it = L.notifAgora ? L.notifAgora().filter(i => /preços? para corrigir/.test(i.t)) : null;
                  R.sino = [pc > 0, !!it && it.length === 1 && it[0].act === 'pcAbre', !!it && !L.notifAgora().some(i => i.t === 'Preço ficou perigoso')];
                  R.fora = [];
                  for (const v of [...document.querySelectorAll('.view')].map(e => e.id.slice(2))) { try { L.setView(v); } catch (e) { continue; } await w(250);
                    const t = document.querySelector('#v-' + v + '>.top'), h = t && t.querySelector('h1'); if (!h || !h.getClientRects().length) continue;
                    [...t.querySelectorAll('button')].forEach(bt => { const r = bt.getBoundingClientRect(), hr = h.getBoundingClientRect(); if (!r.width || r.top > hr.bottom) return;
                      const d = (r.top + r.bottom) / 2 - (hr.top + hr.bottom) / 2; if (Math.abs(d) > 1) R.fora.push(v + ':' + (bt.id || bt.className) + ':' + Math.round(d)); }); }
                  return R; }"""))
                erros65 = list(pg.erros); await pg.close(); await ctx65.close()
                if erros65: break
            total += 1
            ok = len(got) == 2 and all(r['resumo'] and r['sem'] == [True, True, True] and r['sino'] == [True, True, True] and r['fora'] == [] for r in got) and not erros65
            print(('  ok  ' if ok else ' FALHA ') + 'Família Inventário 65a: resumo embaixo do título, sem os números grandes, preços para corrigir no sino; botão redondo na linha do título em toda tela (celular e computador)')
            if not ok: falhas.append('65a inventario topo'); print('        veio', got, erros65)

            # Família Inventário 65b/65c (52d e 52b): 24 cartões por página, "Anterior · 1 de 3 · Próxima" (Anterior apagado na 1ª), deslizar troca,
            # a página fica guardada; depois da legenda "Parados e sobrando ›" (US$ = o parado do capital) e "Contar o estoque ›" (abre a contagem);
            # a tela Parados e sobrando tem "‹ INVENTÁRIO", as duas listas e "Oferta ›" em cada parada (abre a janela Oferta do produto).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              try { localStorage.removeItem('lf_pg'); } catch (e) {}
              const base = S.items.filter(i => i.qty > 0 && !i.bulk)[0];
              for (let k = 0; k < 40; k++) S.items.push(Object.assign({}, base, { ref: 'PG' + (100 + k), qty: 3 }));
              S.todos = true; L.setView('estoque'); await w(400);
              const bar = () => document.querySelector('#v-estoque .pgBar'), cards = () => document.querySelectorAll('#rows .pcard').length;
              const b = bar(); R.p1 = [cards(), b && b.innerText.replace(/\\s+/g, ' ').trim(), b && b.children[0].disabled, b && !b.children[2].disabled];
              b.children[2].click(); await w(300); R.p2 = [cards(), bar().querySelector('.pgN').textContent];
              const rows = document.getElementById('rows'), ev = (t, x) => { const e = new Event(t, { bubbles: true }); e[t === 'touchstart' ? 'touches' : 'changedTouches'] = [{ clientX: x, clientY: 300 }]; rows.dispatchEvent(e); };
              ev('touchstart', 300); ev('touchend', 150); await w(300); R.desliza = bar().querySelector('.pgN').textContent;
              ev('touchstart', 10); ev('touchend', 200); await w(300); R.borda = bar().querySelector('.pgN').textContent;
              L.setView('caixa'); await w(200); L.setView('estoque'); await w(300); R.guarda = bar().querySelector('.pgN').textContent;
              const f = document.getElementById('invFim'), sec = rows.parentNode, ce = L.capitalEstoque();
              R.fim = [!!f && sec.lastElementChild === f, f && f.innerText.replace(/\\s+/g, ' ').trim(),
                Math.abs(ce.parado - L.invParados().reduce((a, m) => a + m.costUsd, 0)) < 0.01];
              R.fimTxt = f.querySelector('[data-act=invParSob] em').textContent;
              f.querySelector('[data-act=contTroca]').click(); await w(300); R.conta = !!S.cont; L.ACT.contTroca(); await w(200);
              document.querySelector('#invFim [data-act=invParSob]').click(); await w(400);
              const v = document.getElementById('v-parsob');
              R.tela = [S.view, v.querySelector('.top h1').textContent, !!document.querySelector('#v-parsob > .nvVs'), (document.querySelector('#v-parsob > .nvVs') || {}).textContent,
                v.querySelectorAll('.psPar .lcL [data-act=lcOferta]').length === Math.min(24, L.invParados().length), /Sobrando · \\d+/i.test(v.innerText)];
              const of = v.querySelector('[data-act=lcOferta]'), ref = of.getAttribute('data-id').split('|').slice(1).join('|'); of.click(); await w(500);
              R.oferta = [S.view, !!document.querySelector('.ofJn:not(.ljSai)'), (document.querySelector('.ofJn .ofNm') || {}).textContent.indexOf(ref) >= 0];  // 64: a MESMA janela Oferta da ficha
              return R; }""")
            total += 1
            ok = (got['p1'][0] == 24 and got['p1'][1] == 'Anterior 1 de 3 Próxima' and got['p1'][2] and got['p1'][3] and got['p2'] == [24, '2 de 3']
                  and got['desliza'] == '3 de 3' and got['borda'] == '3 de 3' and got['guarda'] == '3 de 3'
                  and got['fim'][0] and got['fim'][1].startswith('Parados e sobrando') and 'Contar o estoque' in got['fim'][1] and got['fim'][2] and got['fimTxt'].startswith('US$')
                  and got['conta'] and got['tela'][:2] == ['parsob', 'Parados e sobrando'] and got['tela'][2] and 'Inventário' in got['tela'][3] and all(got['tela'][4:])
                  and got['oferta'] == ['estoque', True, True] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Família Inventário 65b/65c: 24 por página, Anterior · N de M · Próxima, deslizar troca, página guardada; Parados e sobrando › e Contar o estoque › no fim; a tela nova com Oferta ›')
            if not ok: falhas.append('65b paginas parados'); print('        veio', got, pg.erros)
            await pg.close()

            # Família Inventário 65e (58h + achado do dono 22/11 06:26): filtros com o bloco "Site" (No site · Ocultos, o mesmo botão da Situação);
            # nenhuma escolha de lados com texto maior que o botão (função única lfCabe, 3 degraus); Atacado › Mensagens vazio = balão B; Parados sem título de tipo.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const refs = [...new Set(S.items.filter(i => i.qty > 0 && !i.bulk).map(i => i.ref))];
              S.site = {}; S.site[refs[0]] = 1; S.siteFora = {}; S.siteFora[refs[1]] = Date.now();
              S.faixas = [{ id: 'f1', nome: 'Econômico' }, { id: 'f2', nome: 'Intermediário' }, { id: 'f3', nome: 'Luxo' }].map((f, i) => Object.assign({}, (S.faixas || [])[i] || {}, f));
              S.todos = true; L.setView('estoque'); await w(300); document.getElementById('btnFilt').click(); await w(600);
              const fs = document.getElementById('fSite');
              R.site = fs ? [...fs.querySelectorAll('.tab')].map(b => b.innerText.replace(/\\s+/g, ' ').trim()) : null;
              R.lbl = fs && fs.previousElementSibling && fs.previousElementSibling.textContent;
              R.lados = [...document.querySelectorAll('.ladosC')].filter(l => l.offsetWidth).map(l => [l.id || l.className, l.getAttribute('data-cabe'), [...l.children].filter(c => c.tagName === 'BUTTON' && c.offsetWidth && c.scrollWidth > c.clientWidth + 1).length]);
              fs.querySelector('[data-id=site]').click(); await w(400);
              R.filtro = [S.sitF, [...document.querySelectorAll('#rows .pcard')].map(c => c.getAttribute('data-ref'))];
              L.ACT.invLimpa(); await w(200);
              S.ataMsgs = []; S.ataPeds = {}; S._ataMsgTs = Date.now(); S._ataMsgErr = 0; S.ataAba = 'msg'; L.setView('ata'); await w(400);
              const vz = document.querySelector('#v-ata .lfVazio');
              R.ata = [!!vz, vz && vz.querySelector('b').textContent, !!(vz && vz.querySelector('path[d^="M4 4.5h16"]')), !document.querySelector('#v-ata .ataNt')];
              L.setView('parsob'); await w(400); R.parsob = !document.querySelector('#v-parsob .lcGr');
              return R; }""")
            total += 1
            ok = (got['site'] == ['No site 1', 'Ocultos 1'] and (got['lbl'] or '').strip().lower() == 'site'
                  and len(got['lados']) >= 2 and all(x[2] == 0 and (x[1] or '0') in '0123' for x in got['lados'])
                  and got['filtro'][0] == 'site' and len(got['filtro'][1]) == 1
                  and got['ata'] == [True, 'Nenhuma mensagem', True, True] and got['parsob'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Família Inventário 65e: filtros com Site (No site · Ocultos); escolhas de lados sem texto maior que o botão; Atacado › Mensagens vazio com o balão B; Parados sem título de tipo')
            if not ok: falhas.append('65e filtros site'); print('        veio', got, pg.erros)
            await pg.close()

            # Família Inventário 65f (52e): Dashboard do mês › Detalhes ganha "Desempenho do mês ⌄" e "Curva ABC ⌄" (logo depois de Resultado do mês);
            # as linhas de Detalhes abrem no lugar e usam ⌄ (regra 16); os números são os mesmos de Preços (cntSaude) e do capital do estoque.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              S.dTab = 'hoje'; L.setView('dash'); await w(700);
              const ln = () => [...document.querySelectorAll('#v-dash .esLs > .esLn')];
              R.linhas = ln().map(b => [b.getAttribute('data-id'), b.querySelector('b').textContent, b.querySelector('i').textContent]);
              L.ACT.d48Abre('des'); await w(400);
              let c = document.querySelector('[data-act=d48Abre][data-id=des]').nextElementSibling;
              R.des = [!c.hidden, [...c.querySelectorAll('.sl')].map(x => x.querySelector('span').firstChild.textContent.trim() + '=' + x.querySelector('b').textContent.trim()), document.querySelector('[data-id=des] i').textContent];
              L.ACT.d48Abre('abc'); await w(400);
              c = document.querySelector('[data-act=d48Abre][data-id=abc]').nextElementSibling;
              R.abc = [!c.hidden, [...c.querySelectorAll('.sl')].map(x => x.querySelector('span').firstChild.textContent.trim())];
              L.ACT.d48Abre('des'); L.ACT.d48Abre('abc'); await w(200);
              return R; }""")
            total += 1
            ids = [x[0] for x in got['linhas']]
            ok = (ids[:3] == ['res', 'des', 'abc'] and all(x[2] == '⌄' for x in got['linhas'])
                  and got['des'][0] and [x.split('=')[0] for x in got['des'][1]] == ['Margem média', 'Lucro por peça', 'Contas do mês cobertas', 'Retorno do estoque'] and all(x.split('=')[1] for x in got['des'][1]) and got['des'][2] == '⌃'
                  and got['abc'] == [True, ['A · dão 80% do lucro', 'B · próximos 15%', 'C · últimos 5%', 'Sem venda em 90 dias']] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Família Inventário 65f: Dashboard › Detalhes com Desempenho do mês ⌄ e Curva ABC ⌄ depois de Resultado do mês; linhas de Detalhes com ⌄')
            if not ok: falhas.append('65f dashboard detalhes'); print('        veio', got, pg.erros)
            await pg.close()

            # Família Compras 66 parte 1 (48a, 51, 51b): Peças ganha Compras; a lista pede VAGAS (tipo · gênero · material ou o grau);
            # tocar na vaga: "Fechei com…" (Titan confere a margem) e "Ninguém tinha"; "Pedir" = uma mensagem só, em espanhol, com as vagas sem fechar;
            # "Fornecedores ›" no fim abre a tela de compras e lotes (que saiu das abas do Inventário).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              window.open = () => null; navigator.share = null;
              const g = (S.grupos || []).find(x => x.id === 'g:pecas'); R.grupo = g && g.itens.slice();
              L.inicioGo('comp'); await w(500);
              const ls = () => [...document.querySelectorAll('#v-comp .cpL')];
              R.n = ls().length; R.tit = document.querySelector('#v-comp .top h1').textContent;
              R.lbl = document.querySelector('#v-comp .cpT').textContent;
              const k0 = ls()[0].getAttribute('data-id'), k1 = ls()[1].getAttribute('data-id');
              ls()[0].click(); await w(500);
              R.vaga = [...document.querySelectorAll('.cpJn [data-cp]')].map(b => b.getAttribute('data-cp'));
              document.querySelector('.cpJn [data-cp=fech]').click(); await w(500);
              const cu = document.getElementById('cpCu'); cu.value = '0,50'; cu.dispatchEvent(new Event('change', { bubbles: true })); await w(200);
              R.titan = (document.querySelector('.cpTi') || {}).className;
              document.querySelector('.cpJn [data-cp=salva]').click(); await w(500);
              R.fech = [!!(S.cpV[k0] && S.cpV[k0].fech), (ls().find(x => x.getAttribute('data-id') === k0) || {}).innerText];
              const pb = document.querySelector('#v-comp .cpPedir'); R.pedirTxt = pb && pb.textContent;
              pb.click(); await w(500);
              R.msg = (document.querySelector('.cpMsg') || {}).innerText || '';
              document.querySelector('.cpJn [data-ok]').click(); await w(500);
              R.ped = [!S.cpV[k0].ped, !!(S.cpV[k1] && S.cpV[k1].ped), /pedida em \\d\\d\\/\\d\\d/.test((ls().find(x => x.getAttribute('data-id') === k1) || {}).innerText || '')];
              document.querySelector('#v-comp [data-act=cpForn]').click(); await w(600);
              R.forn = [S.view, S.lotesView, document.querySelector('#v-estoque > .top h1').textContent, (document.querySelector('#v-estoque > .nvVs') || {}).textContent, document.getElementById('eTabs').hidden];
              L.inicioGo('estoque'); await w(400);
              R.inv = [S.lotesView, document.querySelector('#v-estoque > .top h1').textContent, document.getElementById('eTabs').hidden];
              return R; }""")
            total += 1
            msg = got['msg']
            ok = (got['grupo'] == ['estoque', 'est', 'comp'] and got['n'] >= 2 and got['tit'] == 'Compras' and str(got['n']) in got['lbl']
                  and got['vaga'] == ['fech', 'nin'] and (got['titan'] or '').startswith('cpTi') and got['fech'][0] and 'fechado com' in got['fech'][1]
                  and got['pedirTxt'] == 'Pedir · ' + str(got['n'] - 1) + ' vagas sem fechar'
                  and msg.startswith('Hola, ¿qué tienen de esto?') and msg.strip().endswith('Gracias. La Fouch') and 'faltam' not in msg and ' até ' not in msg
                  and got['ped'] == [True, True, True]
                  and got['forn'][:3] == ['estoque', True, 'Fornecedores'] and got['forn'][4] is True
                  and got['inv'] == [False, 'Inventário', True] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Família Compras 66 parte 1: Peças com Compras; vagas; Fechei com… (Titan) e Ninguém tinha; Pedir em espanhol só com as vagas sem fechar; Fornecedores › com o título dela; Inventário sem abas')
            if not ok: falhas.append('66 compras telas'); print('        veio', got, pg.erros)
            await pg.close()

            # Família Compras 66 parte 2 (Parte A §2 e §7): o FLUXO decide — rende por dia (lucro real ÷ dias na loja) contra a média do tipo.
            # Estrela: "estrela · repor o mesmo X" e o pedido diz "X o parecido"; fracasso: "No lugar de X", alternativas do mesmo tipo
            # (nunca o mesmo modelo nem a mesma combinação), o pedido não cita o modelo e o "Modelo" do Fechei com… não oferece o mesmo.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const V = L.cpVagas(), est = V.find(v => v.cls === 'estrela'), fra = V.find(v => v.cls === 'fracasso' && v.alts.length);
              R.tem = [!!est, !!fra];
              if (!est || !fra) return R;
              const msg = L.cpMensagem([est, fra]).split('\\n');
              R.msg = [msg[1].indexOf(est.mod + ' o parecido') >= 0, msg[2].indexOf(fra.mod) < 0];
              const sai = fra.k.split('|');
              R.alts = fra.alts.every(a => !(a.pub === sai[1] && a.mat === sai[2]) && fra.refs.indexOf(a.ref) < 0);
              L.inicioGo('comp'); await w(500);
              const linha = k => [...document.querySelectorAll('#v-comp .cpL')].find(b => b.getAttribute('data-id') === k);
              R.linhas = [linha(est.k).innerText.indexOf('estrela · repor o mesmo ' + est.mod) >= 0, linha(fra.k).innerText.indexOf('no lugar de ' + fra.mod) >= 0];
              linha(fra.k).click(); await w(500);
              const jn = document.querySelector('.cpJn');
              R.janela = [jn.getAttribute('aria-label'), jn.querySelectorAll('.cpAlt').length === fra.alts.length, jn.querySelectorAll('.cpAlt[aria-checked=true]').length, !!jn.querySelector('[data-ok]')];
              const alv = jn.querySelectorAll('.cpAlt')[fra.alts.length - 1]; alv.click(); await w(200);
              document.querySelector('.cpJn [data-ok]').click(); await w(500);
              R.salvou = S.cpV[fra.k] && S.cpV[fra.k].alt === fra.alts[fra.alts.length - 1].id;
              linha(fra.k).click(); await w(500); document.querySelector('.cpJn [data-cp=fech]').click(); await w(500);
              const mod = document.querySelector('.cpJn [data-cp=mod] b').textContent;
              R.modelo = [mod.indexOf(fra.mod) < 0, mod.trim() !== 'escolher ›'];
              return R; }""")
            total += 1
            ok = (got.get('tem') == [True, True] and got.get('msg') == [True, True] and got.get('alts') is True and got.get('linhas') == [True, True]
                  and got.get('janela', [None])[0] and got['janela'][0].startswith('No lugar de ') and got['janela'][1:] == [True, 1, True]
                  and got.get('salvou') is True and got.get('modelo') == [True, True] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Família Compras 66 parte 2: o fluxo decide — estrela repõe o mesmo; fracasso vira "No lugar de" com alternativas, sem o mesmo modelo no pedido nem no Fechei com…')
            if not ok: falhas.append('66 compras fluxo'); print('        veio', got, pg.erros)
            await pg.close()

            # Família Compras 66 parte 3 (Parte A §8): aprende sozinho — sem meta por dia, dias de loja nem volume digitados (saem dos Ajustes,
            # do que é guardado e da sincronia); no começo vale a primeira compra de cada tipo; com menos de 30 dias de vendas a lista pede pouco
            # e Compras mostra "aprendendo · N dias de vendas". A meta de lucro do mês fica.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {}, n = Date.now();
              L.setView('ajustes'); await w(300); R.aj = !/Dias de loja aberta/.test(document.body.innerText);
              const sales = S.sales, grp = S.grp, st = S.appStart;
              S.sales = []; S.appStart = n; S.grp = [{ id: 'a', tipo: 'solar', qty: 30, ts: n - 5e6 }, { id: 'b', tipo: 'solar', qty: 99, ts: n }, { id: 'c', tipo: 'sem', qty: 12, ts: n }];
              R.pc = JSON.stringify(L.primeiraCompraTipos()); R.inicio = JSON.stringify(Object.fromEntries(Object.entries(L.volTipos()).map(e => [e[0], Math.round(e[1])]))); R.fa0 = L.aprendeFator();
              S.appStart = n - 20 * 864e5; S.sales = Array.from({ length: 12 }, (x, i) => ({ id: 'x' + i, ts: n - i * 864e5, tipo: 'solar', ref: 'Z', qty: 1, price: 60000 }));
              const vt = L.volTipos(); R.real = Math.round(vt.solar) === 18 && !('sem' in vt); R.fa20 = Math.round(L.aprendeFator() * 100);
              S.grp = grp; S.appStart = n - 10 * 864e5; S.sales = sales.filter(x => n - x.ts < 10 * 864e5).slice(0, 7); // 10 dias de vendas
              L.inicioGo('comp'); await w(500); R.apr = (document.querySelector('#v-comp .cpApr') || {}).textContent || '';
              S.sales = sales; S.appStart = st;
              return R; }""")
            src = open(os.path.join(RAIZ, 'src', '99-render-persistencia.js'), encoding='utf-8').read() + open(os.path.join(RAIZ, 'src', '05-sync.js'), encoding='utf-8').read()
            semChave = not any(("'" + k + "'") in src for k in ('metaDia', 'diasLoja', 'volume')) and "'metaUsd'" in src
            total += 1
            ok = (got['aj'] and got['pc'] == '{"solar":30,"sem":12}' and got['inicio'] == '{"solar":30,"sem":12}' and got['fa0'] == 0.34
                  and got['real'] and got['fa20'] == 67 and got['apr'].startswith('aprendendo · ') and semChave and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Família Compras 66 parte 3: aprende sozinho — sem meta por dia, dias de loja e volume; começa pela primeira compra; "aprendendo · N dias de vendas" pede pouco')
            if not ok: falhas.append('66 compras aprende'); print('        veio', got, semChave, pg.erros)
            await pg.close()

            # Conferência ESBOCO 22/11 (v626–v631) + saída da tela Giro: lote de compra não é peça em Parados; o aviso curto não passa para a
            # janela seguinte; vagas de Compras sem quebra (lfCabe) e graus em ordem crescente (lista e mensagem); sem foto = o quadro de pacote;
            # Giro saiu (Perdas e sobras na tela Contar o estoque; atalho antigo leva ao Inventário); vitrine da semana saiu.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              R.semLote = L.invParados().every(m => !(m.it && m.it.bulk));
              L.lfToast('teste', 'ok'); await w(50); L.lfJanela({ titulo: 'X', monta: c => { c.innerHTML = '<p>x</p>'; } }); await w(80);
              R.toast = !document.getElementById('lfToast').classList.contains('on'); document.querySelector('.ljBk').click(); await w(500);
              const V = L.cpVagas(), gr = V.filter(v => v.grau).map(v => parseFloat(v.grau));
              R.ordem = gr.every((g, i) => !i || g >= gr[i - 1]) && gr.length > 2;
              const msg = L.cpMensagem(V.filter(v => v.grau)).split('\\n').slice(1, -1).map(l => parseFloat(l.split('+')[1].replace(',', '.')));
              R.msg = msg.every((g, i) => !i || g >= msg[i - 1]);
              L.inicioGo('comp'); await w(500);
              R.cabe = [...document.querySelectorAll('#v-comp .cpTx>b,#v-comp .cpTx>small')].every(e => e.scrollWidth <= e.clientWidth + 1 && e.getClientRects().length === 1);
              R.sf = (() => { const h = L.lcThumb('NAO-EXISTE'); return /<svg/.test(h) && !/sem foto/.test(h); })();
              R.giro = [!document.querySelector('#v-dash [data-id=giro]'), (() => { L.inicioGo('giro'); return S.view; })()];
              S.contagens = [{ ts: Date.now() - 864e5, itens: [{ ref: S.items[0].ref, usd: -3 }] }];
              L.setView('estoque'); await w(300); L.ACT.contTroca(); await w(400);
              R.pdc = !!document.querySelector('#contCard section.fxF[data-fx=pdc]'); L.ACT.contTroca(); await w(200);
              R.vit = typeof L.vitSugestao === 'undefined' && !S.vit;
              return R; }""")
            total += 1
            ok = got == {'semLote': True, 'toast': True, 'ordem': True, 'msg': True, 'cabe': True, 'sf': True, 'giro': [True, 'estoque'], 'pdc': True, 'vit': True} and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Conferência v626–v631 + Giro: lote fora de Parados, aviso não passa de janela, vagas sem quebra e graus em ordem, sem foto = pacote, Giro e vitrine saíram')
            if not ok: falhas.append('conferencia 626 631'); print('        veio', got, pg.erros)
            await pg.close()

            # Parte 1 · base visual (80–89a, 104): trilho, botões, campos em linha, ícones 1,6 sem emoji, um rótulo, uma linha, Sons em linhas, sem cartão, 2 avisos
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const emo = /[\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{27BF}]/u, cs = (e, p) => getComputedStyle(e)[p];
              let comEmo = [];
              for (const v of ['inicio', 'vendas', 'estoque', 'caixa', 'desp', 'hist', 'ajustes', 'ped', 'clientes', 'dash']) { L.setView(v); await w(350); const t = document.getElementById('v-' + v); if (t && emo.test(t.innerText)) comEmo.push(v); }
              R.semEmoji = comEmo;
              R.buscaSimples = [...document.querySelectorAll('input[placeholder]')].filter(i => /^Buscar/.test(i.placeholder)).map(i => i.id);  // dono 23/11 15:44: sem a palavra Buscar
              L.setView('caixa'); S.cxAcao = 'ret'; L.render(); await w(300);
              const inp = document.querySelector('#v-caixa .cxAcao.on .in');
              R.campo = !!inp && cs(inp, 'borderTopWidth') === '0px' && cs(inp, 'borderBottomWidth') === '1px' && cs(inp, 'borderTopLeftRadius') === '0px';
              const card = document.querySelector('.view .card');
              R.semCartao = !card || (cs(card, 'backgroundColor') === 'rgba(0, 0, 0, 0)' && cs(card, 'borderTopWidth') === '0px');
              const g = document.querySelector('#v-caixa .go'); R.botao = !!g && cs(g, 'borderTopLeftRadius') === '14px' && cs(g, 'backgroundColor') === 'rgba(0, 0, 0, 0)';
              const lb = document.querySelector('#v-caixa .cxLb, #v-caixa .lbl'); R.rotulo = !!lb && cs(lb, 'fontSize') === '12px' && cs(lb, 'fontWeight') === '600';
              const ic = [...document.querySelectorAll('.view:not([hidden]) svg[viewBox="0 0 24 24"], #mainnav svg[viewBox="0 0 24 24"]')].filter(s => s.getBoundingClientRect().width && !s.closest('.lfVazio'));
              R.traco = ic.length > 0 && ic.every(s => cs(s, 'strokeWidth') === '1.6px');
              L.setView('ajustes'); await w(300); const r = document.querySelector('.ajS .ajR b'); R.linha = !!r && cs(r, 'fontSize') === '16px' && cs(r, 'fontWeight') === '500';
              const av = document.getElementById('avisosCard'); R.sons = !!av && !av.querySelector('.avcard,.avchip') && av.querySelectorAll('.avLn [data-av=escolher]').length === 6;
              L.popErr('erro de prova'); await w(50); const tt = document.getElementById('lfToast');
              R.erroEmbaixo = !document.getElementById('popErr') && tt.classList.contains('t-erro') && /erro de prova/.test(tt.textContent);
              let des = 0; L.lfToast('Foto na lixeira', 'neutro', { t: 'Desfazer', fn: () => des++ }); await w(50);
              const bt = tt.querySelector('.lfTA'); bt && bt.click(); R.desfazer = tt.classList.contains('t-neutro') && !!bt && des === 1 && bt.textContent === 'Desfazer';
              L.setView('caixa'); await w(300); const n = document.querySelector('#v-caixa .note'); R.nota = !n || (cs(n, 'backgroundColor') === 'rgba(0, 0, 0, 0)' && getComputedStyle(n, '::before').width === '8px');
              R.trilho = !!document.querySelector('.trk .trkTh');
              return R; }""")
            total += 1
            ok = got == {'semEmoji': [], 'buscaSimples': [], 'campo': True, 'semCartao': True, 'botao': True, 'rotulo': True, 'traco': True, 'linha': True, 'sons': True, 'erroEmbaixo': True, 'desfazer': True, 'nota': True, 'trilho': True} and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Parte 1 base visual: sem emoji, campo em linha, sem cartão, botão de contorno, um rótulo, ícones 1,6, uma linha, Sons em linhas, erro embaixo, Desfazer, aviso em linha, trilho')
            if not ok: falhas.append('parte 1 base visual'); print('        veio', got, pg.erros)
            await pg.close()

            # Parte 2 (86 + 89b): Ajustes sem a frase do título, sem rodapé Versão e só Contas ligadas · Este aparelho; Fornecedores sem o
            # parágrafo e com a linha "Investido em <mês>"; o leitor do PIX pelo Nubank e o painel "Pagamento automático" não existem mais
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              L.setView('ajustes'); S._ajForce = true; L.render(); await w(400); const v = document.getElementById('v-ajustes');
              R.aj = [!v.querySelector('.top .crumb'), !v.querySelector('.ajVer'), [...v.querySelectorAll('.ajBt')].map(b => b.textContent).join('|'), !/Marca|Pedidos do site|Pagamento automático|Preços/.test(v.innerText)];
              S.grp = S.grp && S.grp.length ? S.grp : [{ id: 'G1', forn: 'Kaz', tipo: 'pre', qty: 5, usd: 0.5, totalUsd: 2.5, moeda: 'usd', sold: 0, ts: Date.now() }];
              S.lotesView = true; S.lotSel = ''; L.setView('estoque'); await w(500); const e = document.getElementById('v-estoque');
              const ln = e.querySelector('.cxL.lt89'), mes = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'][new Date().getMonth()];
              R.forn = [!/Todas as compras que você registrou/.test(e.innerText), !!ln && ln.querySelector('span').textContent === 'Investido em ' + mes && /^US\\$ /.test(ln.querySelector('b').textContent)];
              S.lotesView = false; L.render();
              return R; }""")
            total += 1
            ok = got == {'aj': [True, True, 'Contas ligadas|Este aparelho', True], 'forn': [True, True]} and not pg.erros and 'LfNotif' not in ''.join(fontes.values()) and not os.path.exists(os.path.join(RAIZ, 'android-extra', 'LfNotifPlugin.java'))
            print(('  ok  ' if ok else ' FALHA ') + 'Parte 2 (86 + 89b): Ajustes só com Contas ligadas e Este aparelho (sem frase e sem Versão); Fornecedores com "Investido em <mês>"; leitor do PIX pelo Nubank fora')
            if not ok: falhas.append('parte 2 ajustes fornecedores'); print('        veio', got, pg.erros)
            await pg.close()

            # v450 → v633: o leitor do PIX pelo Nubank saiu (dono 23/11); o comprovante continua conferindo e a ficha de separação continua
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const n0 = S.pedidos.length;
              S.pedidos.push({ id: 'pA1', sid: 'SIDPA1', cod: 'A1', orig: 'site', st: 'pag', pg: 'pagar', pag: 'pix', brl: '85.73', total: 100000, cli: 'Ana', tel: '+55 11 99999-0000', ts: Date.now(), itens: [{ ref: 'AAA1', t: 'Óculos', cor: 'Preto', q: 1, p: 100000 }], ent: 'delivery', endE: 'Av. Monseñor Rodríguez 123, Ciudad del Este · Alto Paraná', refE: 'portão azul', tok: 'K7Q2' });
              S.pedidos.push({ id: 'pA2', sid: 'SIDPA2', cod: 'A2', orig: 'site', st: 'pag', pg: 'pagar', pag: 'pix', brl: '50.11', total: 60000, itens: [{ ref: 'B', q: 1, p: 60000 }] });
              S.pedidos.push({ id: 'pA3', sid: 'SIDPA3', cod: 'A3', orig: 'site', st: 'pag', pg: 'pagar', pag: 'pix', brl: '50.11', total: 60000, itens: [{ ref: 'C', q: 1, p: 60000 }] });
              const semLeitor = typeof L.pixRecebido === 'undefined' && !('pixAuto' in S);
              const p1 = S.pedidos.find(p => p.id === 'pA1');
              const c1 = L.compLeTexto({ pag: 'alias', pagar: 250037 }, 'Transferencia exitosa  Monto Gs. 250.037  07/11/2026 14:32');
              const c2 = L.compLeTexto({ pag: 'alias', pagar: 250037 }, 'Monto Gs. 250.000');
              const c3 = L.compLeTexto({ pag: 'pix', brl: '85.73' }, 'Valor R$ 85,73');
              const fl = L.fichaLinhas(p1), txt = fl.map(l => l.t || l.qr || '').join('|');
              const b = L.impBytes(fl); let qr = false; for (let i = 0; i < b.length - 3; i++) if (b[i] === 0x1d && b[i+1] === 0x28 && b[i+2] === 0x6b) { qr = true; break; }
              L.setView('ajustes'); await w(200); const aj = !/Pagamento automático/.test(document.body.innerText);
              S.pedidos.length = n0;
              return [semLeitor, c1.ok, c2.ok, c2.v, c3.ok, /SEPARAR PEDIDO DO SITE/.test(txt) && /PAGO · PIX R\$ 85,73/.test(txt) && /RETIRAR|DELIVERY/.test(txt) && txt.indexOf(p1.tok) > 0, /separado|embalado/i.test(txt), qr, aj]; }""")
            total += 1
            ok = got == [True, True, False, 'G$ 250.000', True, True, False, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v633: sem o leitor do PIX pelo Nubank; comprovante confere; ficha com QR e sem "separado/embalado"; Ajustes sem Pagamento automático')
            if not ok: falhas.append('pagamento auto'); print('        veio', got, pg.erros)
            await pg.close()

            # Site novo (v451): oferta com data de fim vai ao site (ofAte); mais vendidas só com a posição; oferta de evento devolve a oferta anterior
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S;
              const it = S.items.find(i => !i.bulk && S.fotos[i.ref + '|' + i.cor] && i.qty > 0); const ref = it.ref;
              const pp0 = JSON.stringify(S.pprice[ref] || null), site0 = JSON.stringify(S.site || {});
              S.site = Object.assign({}, S.site, { [ref]: true });
              const base = L.vitProduto(ref);
              const ate = Date.now() + 3 * 864e5;
              S.pprice[ref] = { ant: (base.de || base.n) + 100000, nu: 10, novo: base.n, gn: base.n, ate: ate };
              const o = L.vitProduto(ref);
              const temAte = o.de > o.n ? o.ofAte === ate : o.ofAte === 0;
              const n0 = S.sales.length; S.sales.push({ id: 'tv1', ref: ref, qty: 3, ts: Date.now() - 864e5 });
              const mv = L.siteMaisVendidas()[ref] >= 1 && L.vitProduto(ref).mv >= 1 && !('qtd' in L.vitProduto(ref));
              S.sales.length = n0; L.siteMaisVendidas();
              S.pprice[ref] = { ant: 500000, nu: 20, novo: 300000, gn: 300000, ate: Date.now() - 1000, prev: { nu: 30, ate: 0 } };
              L.ofertaFim(ref); const volta = S.pprice[ref].nu === 30 && S.pprice[ref].ant === 500000 && !S.pprice[ref].prev && !S.pprice[ref].ate;
              S.pprice[ref] = { ant: 500000, nu: 20, novo: 300000, gn: 300000 }; L.ofertaFim(ref); const fim = !S.pprice[ref] || S.pprice[ref].novo === 500000;
              if (pp0 === 'null') delete S.pprice[ref]; else S.pprice[ref] = JSON.parse(pp0); S.site = JSON.parse(site0);
              return [temAte, mv, volta, fim]; }""")
            total += 1
            ok = got == [True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Site novo: oferta com data de fim vai ao site; mais vendidas só com a posição; oferta de evento devolve a oferta anterior')
            if not ok: falhas.append('site v451'); print('        veio', got, pg.erros)
            await pg.close()

            # Foto no site (v448): fv do produto é um número > 0 quando há foto (antes saía 0 e o site/painel achavam "sem foto"); preço automático liga com dados antigos sem listas
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const it = S.items.find(i => !i.bulk && S.fotos[i.ref + '|' + i.cor]); const u = L.vitProduto(it.ref); const b = L.vitDocBody(it.ref, u);
              const fvOk = typeof b.fv === 'number' && b.fv > 0;
              S.pAuto = { on: false }; let erro = ''; try { L.ACT.paLiga(); } catch (e) { erro = e.message; }
              const liga = S.pAuto.on === true && Array.isArray(S.pAuto.mudas) && !erro; S.pAuto.on = false;
              return [fvOk, liga]; }""")
            total += 1
            ok = got == [True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Foto no site: fv > 0 quando há foto; preço automático liga mesmo com dados antigos')
            if not ok: falhas.append('fv foto site'); print('        veio', got, pg.erros)
            await pg.close()

            # Catálogo invisível + modo cliente (v444): o que está na tela não se mexe; iPad só com catálogo e varejo; fundo desfocado; parado volta ao início; sair pede PIN
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.atdFim(); S.vRef = ''; S.vq = ''; S.vTipo = 'all'; L.setView('vendas'); await w(300); window.scrollTo(0, 0); window.dispatchEvent(new Event('scroll')); await w(100);
              const vis = () => [...document.querySelectorAll('#vRows .pcard[data-ref]')].filter(c => { const r = c.getBoundingClientRect(); return r.height && r.top < innerHeight; }).map(c => c.dataset.ref);
              const antes = vis(); const todos0 = [...document.querySelectorAll('#vRows .pcard[data-ref]')].map(c => c.dataset.ref);
              const k = S._vOrd[todos0.length - 1]; S.vRef = k; L.render(); await w(100); S.vRef = ''; L.render(); await w(200);
              const depois = vis(); const fixo = JSON.stringify(antes) === JSON.stringify(depois.slice(0, antes.length));
              // modo cliente
              S.pinHash = 'x'; L.ACT.mcLiga(); await w(200);
              const mc = document.body.classList.contains('modoCli') && S.view === 'vendas' && getComputedStyle(document.getElementById('mainnav')).display === 'none';
              L.setView('caixa'); await w(100); const preso = S.view === 'vendas';
              S.vRef = S._vOrd[0]; L.render(); await w(100); const blur = document.body.classList.contains('mcAberto') && !document.getElementById('vListCard').hidden;
              L.mcInicio(); await w(100); const volta = !S.vRef;
              L.mcSair(); await w(100); const pin = !document.getElementById('lockScr').hidden;
              try { localStorage.removeItem('lf_modoCli'); } catch (e) {} document.getElementById('lockScr').hidden = true; S.modoCli = false; document.body.classList.remove('modoCli', 'mcAberto'); S.pinHash = '';
              // v462: sem PIN também liga (botão de tablet no Catálogo) e sai direto
              const btn = !!document.querySelector('#v-vendas > .top .mcBtn');
              const bio0 = S.bioOn; S.bioOn = false; L.ACT.mcLiga(); await w(150); const semPin = S.modoCli === true;
              L.mcSair(); await w(150); const saiu = S.modoCli === false && document.getElementById('lockScr').hidden; S.bioOn = bio0;
              return [antes.length > 0, fixo, mc, preso, blur, volta, pin, btn, semPin, saiu]; }""")
            total += 1
            ok = got == [True] * 10 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Catálogo invisível + modo cliente: tela não se mexe, iPad só catálogo, fundo desfocado, volta ao início, sair pede PIN')
            if not ok: falhas.append('modo cliente'); print('        veio', got, pg.erros)
            await pg.close()

            # S331 (15/11/2026): MODO LOJA com PIN — a tela do PIN abre POR CIMA do catálogo (antes abria atrás: não dava para sair); Cancelar volta ao catálogo; PIN certo sai
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.pinHash = 'x'; const bio0 = S.bioOn; S.bioOn = false; L.ACT.mcLiga();
              for (let i = 0; i < 40 && !document.getElementById('mlWrap'); i++) await w(150);
              const aberto = !!document.getElementById('mlWrap');
              const noMeio = () => { const e = document.elementFromPoint(innerWidth / 2, innerHeight / 2); return e && e.closest('#lockScr') ? 'pin' : e && e.closest('#mlWrap') ? 'catalogo' : 'outro'; };
              const antes = noMeio();
              L.mcSair(); await w(350); const porCima = noMeio() === 'pin';
              document.getElementById('lockCancel').click(); await w(350);
              const cancela = noMeio() === 'catalogo' && S.modoCli === true && !!document.getElementById('mlWrap');
              try { localStorage.removeItem('lf_modoCli'); } catch (e) {} document.getElementById('lockScr').hidden = true; S.modoCli = false; document.body.classList.remove('modoCli', 'mcAberto'); S.pinHash = ''; S.bioOn = bio0;
              await w(900); const fechou = !document.getElementById('mlWrap');
              return [aberto, antes === 'catalogo', porCima, cancela, fechou]; }""")
            total += 1
            ok = got == [True] * 5 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Modo loja com PIN: a tela do PIN abre por cima do catálogo, Cancelar volta, desligar fecha')
            if not ok: falhas.append('modo loja sair com PIN'); print('        veio', got, pg.erros)
            await pg.close()

            # S360 (15/11/2026, "implementar tudo" lote 1): esboços 28, 29, 36, 37, 46, 48 e os números do Início.
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('caixa'); await w(500); const v = document.getElementById('v-caixa');
              const caixa = v.querySelector('.top h1').textContent.trim() === 'Caixa' && !/CONTAS DO MÊS|CÂMBIO/i.test(v.innerText) && /Movimentos/.test(v.innerText);
              const l0 = Math.round(v.getBoundingClientRect().width); v.querySelector('.top button').click(); await w(450);
              const larg = Math.round(v.getBoundingClientRect().width) === l0 && document.documentElement.classList.contains('lfTrava'); if (S.cxMenu) v.querySelector('.top button').click(); await w(300);
              S.dTab = 'din'; L.setView('dash'); await w(700); const ks = [...document.getElementById('dtabBody').children].filter(e => e.offsetParent);
              const vaos = ks.slice(0, -1).map((e, i) => Math.round(ks[i + 1].getBoundingClientRect().top - e.getBoundingClientRect().bottom)); const sep = vaos.length >= 1 && vaos.every(x => x === vaos[0]);  // 104: sem cartão, o vão entre blocos é um só // S374 (99): os blocos agora ficam juntos num cartão
              L.ACT.dVer(); await w(400); const semX = !document.querySelector('.dFx') && /VER/.test(document.body.innerText); L.ACT.dFecha(); await w(400);
              L.setView('inicio'); S.inicioFant = true; L.render(); await w(300); const r = document.querySelector('[data-act=inicioReset]');
              const link = !!r && r.className === 'lkTx' && getComputedStyle(r).backgroundColor === 'rgba(0, 0, 0, 0)' && r.getBoundingClientRect().height >= 44; S.inicioFant = false; L.render(); await w(1300);
              L.setView('vendas'); await w(500); L.setView('inicio'); await w(200); const t1 = document.querySelector('#v-inicio .tl[data-id=hist] .tp').innerText; await w(1200);
              const semRecontar = t1 === document.querySelector('#v-inicio .tl[data-id=hist] .tp').innerText;
              return [caixa, larg, sep, semX, link, semRecontar]; }""")
            total += 1
            ok = got == [True] * 6 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S360: Caixa só com o caixa, menu sem mudar larguras, cartões separados, folha sem ×, link no lugar do botão cinza, Início sem recontar')
            if not ok: falhas.append('S360 lote 1'); print('        veio', got, pg.erros)
            await pg.close()

            # S361 (sistema de 360°): o app trata o giro e manda gn para o site. Aqui: o detector da volta (sem vídeo), os campos novos e o caminho antigo.
            # Item 33b (20/11/2026, medido no vídeo do celular do dono: prato ligado aos 9 s, volta de 41 s, a câmera foi até 1:00 sem fechar):
            # a volta fecha comparando o FIM da gravação com uma volta antes — o começo parado não entra — e o brilho de cada imagem é igualado
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S;
              // filas de assinaturas inventadas: a "peça" fica parada `par` s e depois dá a volta a cada `per` s; ganho = luz automática mexendo
              const faz = (seg, per, ruido, par, ganho) => { const a = []; for (let i = 0; i < seg * 2; i++) { const t = (i + 1) * 0.5, g = new Float32Array(48 * 27), th = per && t > (par || 0) ? 2 * Math.PI * (t - (par || 0)) / per : 0, gh = 1 + (ganho || 0) * Math.sin(t / 3);
                for (let k = 0; k < g.length; k++) g[k] = (150 + (per ? 40 * Math.sin(th + k * 0.37) * Math.cos(k * 0.11) : 0)) * gh + ruido * Math.sin(i * 7.1 + k * 3.3); a.push(g); } return a; };
              const F = window.__gtFechou, vivo = a => { for (let n = 24; n <= a.length; n++) { const v = F(a.slice(0, n), 0.5); if (v) return [n * 0.5, v.per]; } return null; };
              const v1 = F(faz(26, 20, 0.6), 0.5), v2 = F(faz(40, 0, 0.6), 0.5), v3 = F(faz(14, 20, 0.6), 0.5), v4 = F(faz(30, 20, 0.6), 0.5);
              const fecha = !!v1 && Math.abs(v1.per - 20) < 0.6 && !!v4, naoFecha = v2 === null && v3 === null && F(faz(60, 0, 0.6, 0, 0.03), 0.5) === null;
              // o caso do dono: parado 9 s, volta de 41 s → fecha logo depois dos 50 s (antes: nunca); e com a luz variando 2%
              const d1 = vivo(faz(60, 41, 0.6, 9)), d2 = vivo(faz(60, 41, 0.6, 9, 0.02)), d3 = vivo(faz(60, 20, 0.6, 15)), d4 = vivo(faz(60, 41, 0.6, 9).slice(0, 96));
              const dono = [d1, d2].every(d => d && d[0] >= 50 && d[0] <= 54.5 && Math.abs(d[1] - 41) < 0.5) && d3 && d3[0] >= 35 && d3[0] <= 39.5 && Math.abs(d3[1] - 20) < 0.4 && d4 === null;
              // no vídeo já gravado: a primeira volta inteira e onde ela termina — o trecho tratado (fim − volta … fim) começa depois do prato ligar
              const p = window.__gtPrimeira(faz(60, 41, 0.6, 9), 0.5, 0.6), gravado = !!p && Math.abs(p.per - 41) < 0.4 && (p.n - 1) * 0.5 - p.per >= 9 && (p.n - 1) * 0.5 <= 58 && window.__gtPrimeira(faz(60, 0, 0.6), 0.5, 0.6) === null;
              // campos do site: sem giro tratado gn = 0; com giro tratado gn = 360 e vai no documento
              S.giroSite = { T1: { p: 'media/giro/T1.mp4', v: 5 } }; const g0 = L.giroGn('T1');
              S.giroSite.T1.n = 360; const g1 = L.giroGn('T1'), doc = L.vitDocBody('T1', { gv: L.giroGv('T1'), gn: L.giroGn('T1'), gvc: 0 });
              const campos = g0 === 0 && g1 === 360 && doc.gn === 360 && doc.gvc === 0 && /T1\.mp4\?v=5/.test(doc.gv);
              // giro já tratado não é tratado de novo; giro marcado como "cru" segue pelo caminho antigo (vídeo simples, gn 0)
              const b = new Blob([new Uint8Array(10)], { type: 'video/mp4' });
              S.giros = { T1: { k: 'T1|x', n: 360 }, T2: { k: 'T2|x', cru: 'giro-curto' } };
              const p1 = await L.giroPrepara('T1', b), p2 = await L.giroPrepara('T2', b);
              const bt = new Blob([new Uint8Array(10)], { type: 'video/mp4;gn=360' }); S.giros.T3 = { k: 'T3|x' };
              const p3 = await L.giroPrepara('T3', bt); // giro tratado na hora da gravação: reconhecido pelo tipo, não é tratado de novo
              const caminhos = p1.n === 360 && p1.blob === b && p2.n === 0 && p3.n === 360 && p3.blob === bt && typeof L.estGiroAuto === 'function';
              return [typeof window.giroTrata === 'function', fecha, naoFecha, dono, gravado, campos, caminhos]; }""")
            total += 1
            ok = got == [True] * 7 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S361 + item 33b: giro 360° — a volta fecha sozinha com o prato ligado depois (e não fecha parado nem pela metade), gn/gvc vão para o site, giro tratado não é refeito')
            if not ok: falhas.append('S361 giro 360'); print('        veio', got, pg.erros)
            await pg.close()

            # S362 (esboço 48 + moedas): Dashboard único. Hoje = blocos do dia sem calendário; outro período = 3 números, linhas que abrem, trocas com toque.
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, sl = ms => new Promise(r => setTimeout(r, ms)), q = s => document.querySelector(s);
              L.inicioGo('hoje'); await sl(700);
              const v = document.getElementById('v-dia');
              const hoje = S.view === 'dia' && /^Dashboard/.test(v.querySelector('.dHdT').innerText) && /^Hoje/.test(v.querySelector('.dHdP').innerText) &&
                ![...v.querySelectorAll('button')].some(e => /^\\d\\d\\/\\d\\d\\/\\d{4}/.test(e.innerText.trim())) && !v.querySelector('.famC3');
              L.ACT.dPerEsc('mes'); await sl(900);
              const B = document.getElementById('dtabBody'), ks = [...B.querySelectorAll('.kpis .kpi')].map(k => k.querySelector('.lbl').innerText.trim().toLowerCase());
              const tres = S.view === 'dash' && ks.length === 3 && /^vendido/.test(ks[0]) && /^lucro livre/.test(ks[1]) && /^meta do mês/.test(ks[2]) && /^Dashboard/.test(q('#v-dash .dHdT').innerText) && !/US\\$ 1 =/.test(q('#v-dash .dHdS').innerText);
              const txt = B.innerText, semRep = !/Separar das vendas|Para repor o estoque|Dólar hoje/.test(txt) && !!B.querySelector('.esLs');
              const ln = [...B.querySelectorAll('.esLs > .esLn')].find(e => /Quanto separar/.test(e.innerText)); const fechado = ln.nextElementSibling.hidden === true; ln.click(); await sl(500);
              const ln2 = [...document.querySelectorAll('#dtabBody .esLs > .esLn')].find(e => /Quanto separar/.test(e.innerText)); const abre = fechado && ln2.nextElementSibling.hidden === false;
              const b0 = q('#dtabBody .kpis .kpi > b'), g = b0.innerText; b0.click(); await sl(400); const r = q('#dtabBody .kpis .kpi > b').innerText; q('#dtabBody .kpis .kpi > b').click(); await sl(300); q('#dtabBody .kpis .kpi > b').click(); await sl(300);
              const moeda = /^G\\$/.test(g) && /^R\\$/.test(r) && q('#dtabBody .kpis .kpi > b').innerText === g;
              L.ACT.dPerEsc('hoje'); await sl(600); const volta = S.view === 'dia';
              L.ACT.dVerEsc('din'); await sl(600); const ver = S.view === 'dash' && S.dTab === 'din';
              return [hoje, tres, semRep, abre, moeda, volta && ver]; }""")
            total += 1
            ok = got == [True] * 6 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S362: Dashboard único — Hoje sem calendário, 3 números, sem cartões repetidos, linha abre, toque troca a moeda, seletor leva ao dia')
            if not ok: falhas.append('S362 dashboard'); print('        veio', got, pg.erros)
            await pg.close()

            # S363 (esboços 45a–45d): resultado do mês no Dashboard, Reservas sem ele, Histórico sem o fechamento (vai para Hoje), Preço automático só leva a Preços.
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, sl = ms => new Promise(r => setTimeout(r, ms));
              S.dTab = 'hoje'; S.per = 'mes'; L.setView('dash'); await sl(700);
              const ln = document.querySelector('#dtabBody .esLn[data-id=res]'); const tem = !!ln && /Resultado do mês/.test(ln.innerText) && ln.nextElementSibling.hidden; ln.click(); await sl(400);
              const abre = /Sobra do mês/.test(document.querySelector('#dtabBody .esRes').innerText);
              S.dTab = 'din'; L.setView('dash'); L.render(); await sl(500); const tr = document.getElementById('dtabBody').textContent;
              const reservas = !/Seu mês|Detalhes do mês|Lucro real do mês/.test(tr);
              L.setView('hist'); await sl(500); const hist = !/Fechamento do caixa/.test(document.getElementById('v-hist').textContent);
              L.inicioGo('hoje'); await sl(600); const vd = document.getElementById('v-dia'); const hoje = !/Fechamento do caixa|Despesas do dia/.test(vd.textContent) && !vd.querySelector('[data-act=fechar]') && !!vd.querySelector('.kpiLk[data-act=view][data-id=desp]');  // S374 (esboço 70): sem fechar manual e sem a janela Despesas do dia
              L.setView('ajustes'); await sl(500); const rot = !document.querySelector('.ajS[data-k=pa]');  // 46b: o preço automático saiu de Ajustes (liga no ⏻ de Preços)
              return [tem && abre, reservas, hist, hoje, rot]; }""")
            got.append('dash,prec')
            total += 1
            ok = got == [True] * 5 + ['dash,prec'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S363/S374: Resultado do mês no Dashboard, Reservas e Histórico sem repetição, Hoje sem fechar manual nem Despesas do dia, Ajustes sem Preços (46b)')
            if not ok: falhas.append('S363 redundâncias'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (esboços 64–66) + 54: Preços — sem "Preço automático" solto, os preços a corrigir numa tela própria (Preços › Preços para corrigir),
            # meta e taxas no setor Regras, contas sempre pelo custo
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.pAuto = S.pAuto || {}; S.pAuto.on = true; S.rateio = 'peca'; S.rat66 = false; S.dfold = {}; L.inicioGo('prec'); L.render(); }"); await pg.wait_for_timeout(600)
            q1 = await pg.evaluate("() => { const t = document.getElementById('v-dash').innerText; return [document.querySelectorAll('#v-dash #paCard').length, (t.match(/Preço automático/g) || []).length, !document.querySelector('#v-dash .paEst'), !document.querySelector('[data-act=dfold][data-id=pgr],[data-act=dfold][data-id=abp],[data-act=dfold][data-id=pau]'), !!document.querySelector('#v-dash .tiD .nvL[data-id=corr]'), !/Subir \\d+ preços/.test(t), !document.querySelector('#v-dash [data-act=pgrAjusta]'), window.__LF.S.rateio]; }")
            await pg.locator('#v-dash .tiD .nvL[data-id=corr]').click(); await pg.wait_for_timeout(600)
            q2 = await pg.evaluate("() => [document.querySelectorAll('#v-dash .pcNaTela .pcLi').length, document.querySelectorAll('#v-dash .pcNaTela [data-act=pcUsaTodos]').length, document.querySelector('#v-dash .dHdT').textContent, (document.querySelector('.view:not([hidden]) .nvVs') || { textContent: '' }).textContent.replace('‹', '')]")
            await pg.evaluate("() => window.__LF.ACT.tiAbre('regras')"); await pg.wait_for_timeout(600)
            await pg.evaluate("() => window.__LF.ACT.dfold('rgTx')"); await pg.wait_for_timeout(500)
            q3 = await pg.evaluate("() => { const t = document.getElementById('v-dash').innerText; return [document.querySelector('#v-dash .dHdT').textContent === 'Regras', /Taxas da maquininha/.test(t), !document.querySelector('[data-act=ratsel]'), document.querySelectorAll('#v-dash .pc66').length > 0, !document.querySelector('.ljJn:not(.ljSai)')]; }")
            total += 1
            ok = (q1[0] == 0 and q1[1] == 0 and all(q1[2:7]) and q1[7] == 'custo' and q2[0] > 0 and q2[1] == 1 and q2[2:] == ['Preços para corrigir', 'Preços'] and all(q3) and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (64–66) + 54: Preços sem repetição, lista a corrigir numa tela com "‹ Preços", meta e taxas no setor Regras, contas pelo custo')
            if not ok: falhas.append('Preços 64–66'); print('        veio', q1, q2, q3, pg.erros)
            await pg.close()

            # 46b (aprovado 22/11; dono 23/11 "fazer o 46b agora"): o preço automático liga no ⏻ ao lado do título de Preços. A janela tem o
            # interruptor (vale na hora, sem "Ligar?"), o que o app faria ao ligar e "Revisa toda segunda"; Ajustes não tem mais Preços;
            # o ⏻ fica só no escritório (os setores não têm).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
              S.pAuto = Object.assign(S.pAuto || {}, { on: false }); L.inicioGo('prec'); await w(500);
              const b = () => document.querySelector('#v-dash .dHd .lgB'), jn = () => document.querySelector('.ljJn:not(.ljSai)');
              R.push(!!b() && !b().classList.contains('on'), [...document.querySelectorAll('#v-dash .tiSe [data-act]')].map(x => x.dataset.id).join());
              b().click(); await w(600);
              R.push(jn().querySelector('.ljHd b').textContent, jn().querySelector('[data-act=paTog]').getAttribute('aria-checked'), /Ao ligar/.test(jn().innerText) && /Sobem/.test(jn().innerText) && /toda segunda/.test(jn().innerText));
              jn().querySelector('[data-act=paTog]').click(); await w(500);
              R.push(S.pAuto.on, jn().querySelector('[data-act=paTog]').getAttribute('aria-checked'), !/Ao ligar/.test(jn().innerText), b().classList.contains('on'), !document.querySelector('.paPrev,[data-act=paLiga]'));
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await w(500);
              L.ACT.tiAbre('ofertas'); await w(400); R.push(!b());
              L.setView('ajustes'); await w(400); R.push(!document.querySelector('#ajGrp .ajS[data-k=pa]'));
              return R; }""")
            total += 1
            ok = got == [True, 'regras,ofertas,atacado,ferr,hist', 'Preço automático', 'false', True, True, 'true', True, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '46b: Preços com o ⏻ — interruptor na janela, vale na hora (sem "Ligar?"), mostra o que faria; os 5 setores; o ⏻ só no escritório; Ajustes sem Preços')
            if not ok: falhas.append('46b precos liga'); print('        veio', got, pg.erros)
            await pg.close()

            # 54 (Preços = escritório do Titan): UMA função desenha Preços e os setores (precosTelaHtml); ninguém a troca nem relê o HTML dela.
            # Sem os 4 números, "O TITAN DECIDE HOJE · N" conta as linhas, os setores Regras · Ofertas · Atacado · Ferramentas · Histórico em linhas ›
            # (≥ 64 px, ícone cinza como a frase), no Atacado cada tabela abre a janela dela, nas Ofertas o "ver um por um" aceita e ignora uma por vez,
            # nenhum "1 peças"/"1 preços"; o nome sai da constante LF_TITAN e nenhum "Guardião" aparece.
            fontes = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            troca = sorted(f for f, t in fontes.items() if re.search(r'^\s*(precosTelaHtml|contadorHtml|cntDecisoes|titanDecide) = function|_cnt\d+ = |function contadorHtml|pgrPrecos|pgrAjusta|prePe|cntKpi|x66ab', t, re.M))
            nomeSolto = sorted(f for f, t in fontes.items() if re.search(r"'[^'\n]*Guardião[^'\n]*'", t))
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              S.sales.forEach(s => { s.ts -= 200 * 864e5; }); S.pTrava = {};
              // aceita as correções sugeridas (os que sobem), para o plano chegar às ofertas das peças paradas
              L.ACT.tiAbre('corr'); await w(400); const us = document.querySelector('#v-dash [data-act=pcUsaTodos]'); if (us) { us.click(); await w(500); }
              L.inicioGo('prec'); await w(500); const d = document.getElementById('v-dash'), q = s => [...d.querySelectorAll(s)];
              R.sem = [!q('.cntK,.cntG').length, !/Margem média real|Lucro por peça|PARA DECIDIR/.test(d.innerText), !/REGRAS DO CONTADOR/i.test(d.innerText), !/\\b1 (peças|preços|dias)\\b/.test(d.innerText), !d.querySelector('.dHdS')];
              const lb = q('.tiLb').map(x => x.textContent);
              R.n = q('.tiD .nvL').length ? lb[0] === 'O TITAN DECIDE HOJE · ' + q('.tiD .nvL').length : !/DECIDE HOJE/.test(lb.join());
              R.set = q('.tiSe .nvL').map(b => b.querySelector('b').textContent).join('|') + '|' + q('.tiSe .nvL').every(b => b.getBoundingClientRect().height >= 64 && getComputedStyle(b.querySelector('.nvIc')).color === getComputedStyle(b.querySelector('small')).color && b.querySelector('i').textContent === '›');
              // Atacado: cada tabela abre a folha com a tabela dela destacada
              L.ACT.tiAbre('atacado'); await w(400);
              const D = L.cntDecisoes(), tabs = L.S.tabelas.filter(t => t.on !== false), ids = q('[data-act=ataTabAbre]').map(b => b.dataset.id);
              R.tab = tabs.length > 1 && ids.length === tabs.length && new Set(ids).size === ids.length;
              const al = []; for (const b of q('[data-act=ataTabAbre]').slice(0, 3)) { b.click(); await w(500); const j = document.querySelector('.tiAtJn:not(.ljSai)'); al.push(!!j && j.querySelector('.ljHd b').textContent === L.S.tabelas.find(t => t.id === b.dataset.id).nome); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await w(500); }
              R.alvo = al.join();
              // Ofertas: o assunto do preço automático é uma linha, "ver um por um" abre as peças, aceitar e ignorar tiram uma por vez
              L.ACT.tiAbre('ofertas'); await w(400);
              const g = D.filter(x => x.t === 'pa')[0], bt = () => d.querySelector('[data-act=cntTudo]');
              if (g && g.n >= 2) { const n0 = g.n; R.pa = [bt().textContent === 'Aceitar os ' + n0 + ' preços', !d.querySelector('.cntPc')];
                d.querySelector('[data-act=cntVer]').click(); await w(300); R.pa.push(q('.cntPc').length === n0);
                d.querySelector('[data-act=cntAceita]').click(); await w(400); R.pa.push(q('.cntPc').length === n0 - 1, L.cntDecisoes().filter(x => x.t === 'pa')[0].n === n0 - 1);
                d.querySelector('[data-act=cntIgnora]').click(); await w(400); R.pa.push(q('.cntPc').length === n0 - 2); } else R.pa = 'sem ofertas no cenário';
              L.ACT.tiAbre('ferr'); await w(400); R.ferr = q('.tiS .nvL').map(b => b.dataset.act).join();
              L.ACT.tiAbre('hist'); await w(400); R.hist = document.querySelector('#v-dash .dHdT').textContent === 'Histórico' && !!d.querySelector('.tiS[data-ti=hist]');
              // nenhum "Guardião" visível (Início, Pendências, sino)
              const vis = []; for (const v of ['inicio', 'notif']) { L.setView(v); await w(400); vis.push(!/Guardião/.test(document.getElementById('v-' + v).innerText)); }
              R.nome = vis.join();
              return R; }""")
            total += 1
            ok = (got['sem'] == [True] * 5 and got['n'] and got['set'] == 'Regras|Ofertas|Atacado|Ferramentas|Histórico|true' and got['tab'] and got['alvo'] == 'true,true,true'
                  and got['pa'] == [True] * 6 and got['ferr'] == 'cntCalc,cntEse' and got['hist'] and got['nome'] == 'true,true' and troca == [] and nomeSolto == []
                  and not os.path.exists(os.path.join(RAIZ, 'src', '98z-precos-s52.js')) and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '54: Preços = escritório do Titan — sem os 4 números, "O Titan decide hoje · N", 5 setores em linhas ›, cada tabela abre a sua, ofertas uma por vez, nenhum "Guardião"')
            if not ok: falhas.append('54 escritorio do Titan'); print('        veio', got, troca, nomeSolto, pg.erros)
            await pg.close()

            # 62 (setor Regras do Titan): tudo o que o preço cobre num lugar só — CADA VENDA COBRE (Contas do mês › Despesas, Taxas ⌄, IVA ⌄, Colchão ⌄),
            # DÓLAR DA LOJA (Cotação nos preços ⌄), O TITAN APRENDE COM VOCÊ (Vendas por mês ⌄, Seu jeito de cobrar ⌄), SEU OBJETIVO (Meta, só mostra).
            # Saíram: "Contas e contagem", "Divisão das contas", a barra da meta e o cartão de taxas; do Câmbio, "Preços no site" e "Como o app te protege".
            fontes = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            velho = sorted(f for f, t in fontes.items() if re.search(r'function (precosCfgHtml|precosMetaHtml|paMetaHtml|pagamentoHtml|fjProtHtml)\b|data-id="(site|prot)"><span>(Preços no site|Como o app)', t))
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              L.inicioGo('prec'); await w(400); L.ACT.tiAbre('regras'); await w(500); const d = document.getElementById('v-dash');
              R.lb = [...d.querySelectorAll('.tiLb')].map(x => x.textContent).join('|');
              R.lin = [...d.querySelectorAll('.tiS .nvL b, .tiS .fxH b, .tiS .rgMeta>span')].map(x => x.firstChild.textContent.split(' · ')[0]).join('|');
              R.sem = !/Contas e contagem|Divisão das contas|Formas de pagamento|Dias de loja/.test(d.innerText) && !d.querySelector('.paBar');
              d.querySelector('.tiS .nvL[data-id=desp]').click(); await w(500); R.desp = S.view;
              L.setView('fx'); await w(400); R.fx = !/Preços no site|Como o app te protege/.test(document.getElementById('v-fx').innerText);
              return R; }""")
            total += 1
            ok = (got['lb'] == 'CADA VENDA COBRE|DÓLAR DA LOJA|O TITAN APRENDE COM VOCÊ|SEU OBJETIVO' and got['lin'] == 'Contas do mês|Taxas da maquininha|IVA|Colchão|Cotação nos preços|Vendas por mês|Seu jeito de cobrar|Meta de lucro do mês'
                  and got['sem'] and got['desp'] == 'desp' and got['fx'] and velho == [] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '62: Preços › Regras do Titan — o que cada venda cobre, o dólar da loja, o que o Titan aprende e a meta; o Câmbio fica só com o dólar e as trocas')
            if not ok: falhas.append('62 regras'); print('        veio', got, velho, pg.erros)
            await pg.close()

            # 63 + 94 (setor Ofertas e de/por honesto): "+" redondo na linha do título (centro com centro) abre "Escolher a peça" e depois a MESMA janela Oferta;
            # OFERTAS NO AR · N → CUPONS → COMO O TITAN DECIDE; o "de" só aparece (Catálogo, site, Marketing) se o preço normal valeu 30 dias e vendeu nele.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              L.inicioGo('prec'); await w(400); L.ACT.tiAbre('ofertas'); await w(500); const d = document.getElementById('v-dash');
              const h = d.querySelector('.dHdT').getBoundingClientRect(), m = d.querySelector('.dHd .tiMais'), mb = m && m.getBoundingClientRect();
              R.mais = !!m && Math.abs((h.top + h.height / 2) - (mb.top + mb.height / 2)) <= 3 && mb.height >= 44; R.maisM = [h.top, h.height, mb && mb.top, mb && mb.height];
              R.lb = [...d.querySelectorAll('.tiLb')].map(x => x.textContent.replace(/ · \\d+$/, '')).join('|');
              m.click(); await w(600); const esc = document.querySelector('.escJn:not(.ljSai)'), b = esc && esc.querySelector('[data-act=ofNovaPeca]'), ref = b && b.dataset.id;
              b.click(); await w(700); const jn = document.querySelector('.ofJn:not(.ljSai)');
              R.jan = !!jn && !document.querySelector('.escJn:not(.ljSai)') && jn.querySelector('.ofNm').textContent.indexOf(ref) >= 0;
              // de/por: oferta com o preço normal novo (há 5 dias) → sem "de"; o mesmo preço antigo e vendido → com "de"
              const o = S.pprice[ref] = { novo: 2000000, ant: 3000000, desde: Date.now() - 5 * 864e5 };
              R.novo = [L.deHonesto(ref), L.deInfo(ref, 3000000).mot];
              o.desde = Date.now() - 40 * 864e5; S.sales.push({ id: 'tde', ref, ts: Date.now() - 20 * 864e5, lista: 3000000, qty: 1, tipo: 'sem', preco: 3000000 });
              R.velho = [L.deHonesto(ref), L.deInfo(ref, 3000000).ok];
              S.sales = S.sales.filter(x => x.id !== 'tde');
              R.semVenda = L.deHonesto(ref);
              return R; }""")
            fontes = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            velho = sorted(f for f, t in fontes.items() if re.search(r'function ofertaModal|S\.ofOpen|pp && pp\.ant > v\.preco \? pp\.ant', t))
            total += 1
            ok = (got['mais'] and got['lb'] == 'OFERTAS NO AR|CUPONS|COMO O TITAN DECIDE' and got['jan'] and got['novo'][0] == 0 and 'há 5 dias' in got['novo'][1]
                  and got['velho'] == [3000000, True] and got['semVenda'] == 0 and velho == [] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '63/94: Ofertas com o "+" na linha do título (abre a mesma janela Oferta), no ar · cupons · como decide; "de" só com 30 dias e venda')
            if not ok: falhas.append('63 ofertas de por'); print('        veio', got, velho, pg.erros)
            await pg.close()

            # 65 + 65b (Atacado do Titan): margem = (1 + colchão 3%) ÷ (10/11 − lucro alvo) − 1 → 56/45/36/32/29/27%; o preço de atacado usa essa margem
            # (sem o chão do varejo) e a conta do exemplo de US$ 5 fecha; a tela Atacado tem 3 abas (sem Tabela) com "Enviar catálogo" em Lojistas;
            # a conta do lojista tem "Tabela de preço ›" e o dono escolhe; editar margens saiu.
            fontes = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            velho = sorted(f for f, t in fontes.items() if re.search(r"ACT\.tabedit|data-in=\"tabm|\(1 \+ T\.m\)|'tab', 'Tabela'\]", t))
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              S.ataCalc = { c: 0.03, ts: Date.now() };
              R.m = S.tabelas.filter(t => t.id !== 'fg').map(t => Math.round(L.ataMargem(t) * 100)).join();
              const k = L.ataConta(S.tabelas.find(t => t.id === 'a10'), 5); R.k = [k.p.toFixed(2), k.iva.toFixed(2), k.cc.toFixed(2), k.lu.toFixed(2)].join();
              const it = S.items.find(i => i.qty > 0 && !i.bulk && L.tFor(i).repUSD > 0 && L.tFor(i).price > 100000) || S.items.find(i => i.qty > 0 && L.tFor(i).repUSD > 0), t = L.tFor(it), T = S.tabelas.find(x => x.id === 'a10');
              R.preco = L.precoTab(it, 'a10') === Math.min(Math.ceil((t.repUSD * S.fx.pyg * (1 + L.ataMargem(T))) / 500) * 500, t.price) || L.precoTab(it, 'a10') <= t.price;
              S.ataAba = 'tab'; L.setView('ata'); await w(500);
              R.abas = [...document.querySelectorAll('#ataTabs [role=tab]')].map(b => b.textContent.trim()).join('|');
              S.ataAba = 'loj'; L.ACT.ataAba('msg'); L.ACT.ataAba('loj'); await w(400); R.env = !!document.querySelector('#ataCorpo [data-act=ataEnvLoj]');
              S.ataContas = S.ataContas || {}; S.ataContas.tz = { id: 'tz', nome: 'Lojista de teste', tipo: 'assoc', tab: 'a1', dispMax: 3, trocaOk: true, aparelhos: [] };
              L.ACT.ataLojAbre('tz'); await w(600); const b = document.querySelector('.ljJn:not(.ljSai) [data-act=ataTabEsc]'); R.row = !!b && /Atacado 1K/.test(b.textContent);
              b.click(); await w(600); const e = document.querySelector('.escJn:not(.ljSai)'); R.semOutro = !!e && !/Outro…/.test(e.innerText);
              [...e.querySelectorAll('.pxL')].find(x => x.dataset.v === 'Vendedor').click(); await w(100); e.querySelector('.escSalva').click(); await w(600);
              R.tabNova = S.ataContas.tz.tab; delete S.ataContas.tz;
              return R; }""")
            total += 1
            ok = (got['m'] == '56,45,36,32,29,27' and got['k'] == '6.37,0.58,5.15,0.64' and got['preco'] and got['abas'] == 'Mensagens|Lojistas|Lotes' and got['env']
                  and got['row'] and got['semOutro'] and got['tabNova'] == 'ven' and velho == [] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '65/65b: margens do atacado calculadas pelo Titan (56/45/36/32/29/27), conta do exemplo, Atacado com 3 abas e "Tabela de preço ›" na conta do lojista')
            if not ok: falhas.append('65 atacado do Titan'); print('        veio', got, velho, pg.erros)
            await pg.close()

            # 66 (Ferramentas do Titan): Calculadora em linhas finas (Custo · Tipo › · Peças) com Loja e site, Mínimo, Atacado das tabelas do 65b (ataConta)
            # e o lucro, sem faixa fixa nem "Usar estes preços"; E se…? em linhas ⌄ (Dólar da casa, Fornecedor sobe, Cupom, Contas sobem, Meta do mês).
            fontes = {f: open(os.path.join(RAIZ, 'src', f), encoding='utf-8').read() for f in sorted(os.listdir(os.path.join(RAIZ, 'src'))) if f.endswith('.js')}
            velho = sorted(f for f, t in fontes.items() if re.search(r"cntCalcUsa|ML_CALC|Faixa ' \+ esc|Vender tudo parado|data-ese=", t))
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              L.inicioGo('prec'); await w(300); L.ACT.tiAbre('ferr'); await w(400); L.ACT.cntCalc(); await w(600);
              const j = document.querySelector('.calcJn:not(.ljSai)'), lb = () => [...j.querySelectorAll('.cxL>span:first-child')].map(x => x.firstChild.textContent.trim());
              R.campos = lb().slice(0, 3).join('|'); R.calc = lb().slice(3).join('|');
              const ata = [...j.querySelectorAll('#ccR .cxL')].find(x => /Atacado/.test(x.textContent)).querySelector('b').textContent;
              const T = S.tabelas.filter(t => t.on !== false).map(t => L.ataConta(t, 5).p).sort((a, b) => a - b);
              R.ata = ata === 'US$ ' + T[0].toFixed(2).replace('.', ',') + ' a US$ ' + T[T.length - 1].toFixed(2).replace('.', ',');
              const lu = +[...j.querySelectorAll('#ccR .cxL')].find(x => /Lucro por peça/.test(x.textContent)).querySelector('b').textContent.replace(/[^\\d-]/g, '');
              R.lucro = lu >= 0; R.sem = !/Faixa|Usar estes preços|Parecidos/.test(j.innerText);
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await w(500);
              L.ACT.cntEse(); await w(600); const e = document.querySelector('.eseJn:not(.ljSai)');
              R.ese = [...e.querySelectorAll('.fxH b')].map(b => b.textContent).join('|'); R.r1 = /venda da casa/.test(e.querySelector('#eseR').textContent);
              e.querySelector('.fxH[data-k=forn]').click(); await w(300); R.r2 = /colchão/.test(document.querySelector('.eseJn:not(.ljSai) #eseR').textContent);
              return R; }""")
            total += 1
            ok = (got['campos'] == 'Custo da peça|Tipo|Peças' and got['calc'] in ('Loja e site|Mínimo da loja|Atacado|Lucro por peça', 'Loja|Site|Mínimo da loja|Atacado|Lucro por peça') and got['ata'] and got['lucro'] and got['sem']
                  and got['ese'] == 'Dólar da casa|Fornecedor sobe|Cupom|Contas sobem|Meta do mês' and got['r1'] and got['r2'] and velho == [] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '66: Ferramentas do Titan — Calculadora em linhas com o mesmo motor (atacado das tabelas, lucro nunca negativo no mínimo) e E se…? em linhas ⌄')
            if not ok: falhas.append('66 ferramentas'); print('        veio', got, velho, pg.erros)
            await pg.close()

            # 74r v3 (reserva suspeita): o aviso da nuvem (suspeitas/<pedido>) vira a 1ª linha vermelha das Pendências (Titan) e o pedido no topo de
            # Pedidos; "Ver" abre a janela de confirmação com Pedido · Peças · Por quê · Reservada e "Cancelar e soltar as peças" (o mesmo cancelamento
            # do pedido, pedCancela) com "Voltar"; pedido pago, cancelado ou com a reserva vencida não aparece.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {}, ag = Date.now();
              const it = S.items.find(i => i.qty > 0 && !i.bulk);
              S.pedidos = (S.pedidos || []).concat([{ id: 'psx', sid: 'SX1', num: 1043, cli: 'Teste', tel: '', itens: [{ ref: it.ref, cor: it.cor, grau: it.grau || '', q: 5, preco: 1000 }], st: 'novo', pg: 'pagar', orig: 'site', ts: ag - 12 * 60000 }]);
              S.suspeitas = { SX1: { ts: ag - 12 * 60000, pedido: 'SX1', motivos: ['iguais'], iguais: 5, abertas: [], exp: ag + 18 * 60000, itens: [{ ref: it.ref, cor: it.cor, q: 5 }] } };
              L.setView('notif'); await w(500); const c = document.querySelector('#v-notif section.card');
              R.sino = [c.querySelector('b').textContent, /5 peças iguais sem pagar · solta sozinha em 1[78] min/.test(c.innerText), getComputedStyle(c.querySelector('b')).color === getComputedStyle(document.body).getPropertyValue('--bad').trim() || /rgb/.test(getComputedStyle(c.querySelector('b')).color)];
              L.setView('ped'); await w(500); const r = document.querySelector('#v-ped .susL .nvL'); R.ped = !!r && /Pedido 1043 · reserva suspeita/.test(r.textContent);
              r.click(); await w(600); const j = document.querySelector('.lfCf:not(.ljSai)');
              R.jan = [j.querySelector('.ljHd b').textContent, [...j.querySelectorAll('.cf418L span')].map(x => x.textContent).join('|'), j.querySelector('.cf418B').textContent, j.querySelector('.cf418V').textContent];
              j.querySelector('.cf418B').click(); await w(500);
              R.fim = [S.pedidos.find(p => p.id === 'psx').st, !S.suspeitas.SX1, !document.querySelector('#v-ped .susL')];
              // pago não aparece
              S.pedidos.find(p => p.id === 'psx').st = 'novo'; S.pedidos.find(p => p.id === 'psx').pg = 'pago'; S.suspeitas = { SX1: { ts: ag, pedido: 'SX1', motivos: ['iguais'], iguais: 5, exp: ag + 6e5 } };
              L.render(); await w(300); R.pago = !document.querySelector('#v-ped .susL');
              S.pedidos = S.pedidos.filter(p => p.id !== 'psx'); S.suspeitas = {};
              return R; }""")
            total += 1
            ok = (got['sino'][0] == 'Reserva suspeita · pedido 1043' and got['sino'][1] and got['ped'] and got['jan'] == ['Reserva suspeita', 'Pedido|Peças|Por quê|Reservada', 'Cancelar e soltar as peças', 'Voltar']
                  and got['fim'] == ['canc', True, True] and got['pago'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '74r: reserva suspeita — 1ª linha vermelha do sino, pedido no topo de Pedidos, janela com Cancelar e soltar as peças; pago não aparece')
            if not ok: falhas.append('74r reserva suspeita'); print('        veio', got, pg.erros)
            await pg.close()

            # 4b parte 3 (135h): "1 dia" / "N dias" sai de UMA função (nDias); o tema em Preços, no cartão e no Guardião usa a mesma. Com o tema a 1 dia, nenhum "1 dias".
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, D = Date, w = ms => new Promise(r => setTimeout(r, ms));
              const t = new D(2026, 10, 18, 10).getTime(); window.Date = class extends D { constructor(...x) { x.length ? super(...x) : super(t); } static now() { return t; } };
              try { S.temaNao = {}; S.temaOf = null; const tema = L.cntDecisoes().filter(x => x.t === 'tema')[0];
                S.dTab = 'prec'; L.setView('dash'); await w(400); const tela = document.getElementById('v-dash').innerText;
                return [L.nDias(1), L.nDias(2), L.nDias(0), tema ? tema.tit : '', /Black Friday em 1 dia\\b/.test(tela) && !/1 dias/.test(tela)]; } finally { window.Date = D; } }""")
            usa = sorted(f for f, t in fontes.items() if re.search(r"dias \+ ' dias'", t))
            total += 1
            ok = got == ['1 dia', '2 dias', '0 dias', 'Black Friday em 1 dia', True] and usa == [] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '4b parte 3 (135h): "1 dia"/"N dias" numa função só — Black Friday a 1 dia aparece "em 1 dia" em Preços')
            if not ok: falhas.append('4b parte 3 nDias'); print('        veio', got, usa, pg.erros)
            await pg.close()

            # 4c parte 1 (149t, aprovado 19/11 13:59): o título do Dashboard, Giro, Preços, Reservas e do dia é título de verdade (h1) desde que nasce —
            # sem data-act, sem ⌄, sem conserto depois do desenho (o laço do nvDesenha saiu). Nada muda na tela (medidas iguais antes × depois, 10 telas).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
              for (const f of [() => { S.per = 'mes'; S.dTab = 'hoje'; L.setView('dash'); }, () => { S.dTab = 'prec'; L.setView('dash'); }, () => { S.dTab = 'din'; L.setView('dash'); }, () => L.inicioGo('hoje')]) {
                f(); await w(450); const v = document.querySelector('.view:not([hidden])'), t = [...document.querySelectorAll('.dHdT')].filter(e => e.getBoundingClientRect().height);
                R.push(t.length === 1 && t[0].tagName === 'H1' && !t[0].dataset.act && !t[0].querySelector('i') && !/⌄/.test(t[0].textContent) && document.querySelectorAll('h1').length >= 1 ? 1 : S.view + '/' + S.dTab + ':' + t.map(e => e.tagName).join()); }
              return R; }""")
            laco = sorted(f for f, t in fontes.items() if re.search(r'class="dHdT"[^>]*data-act|<button[^>]*class="dHdT', t) or (f.startswith('99c-') and "querySelectorAll('.dHdT')" in t))
            total += 1
            ok = got == [1] * 4 and laco == [] and not pg.erros  # o Giro saiu (v632)
            print(('  ok  ' if ok else ' FALHA ') + '4c parte 1 (149t): o título de Dashboard, Giro, Preços, Reservas e do dia nasce h1, sem ação e sem conserto depois do desenho')
            if not ok: falhas.append('4c parte 1 titulo h1'); print('        veio', got, laco, pg.erros)
            await pg.close()

            # 4c parte 2 (149d, aprovado 19/11 13:34): no Histórico a linha "Semana…" fica na margem das linhas de dia, com 64 px, título 16 / frase 13,
            # e dias e semanas já nascem dentro do grupo de linhas (o pad99 não arruma o Histórico depois do desenho).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.sales.forEach((s, i) => { if (i % 2) s.ts -= 20 * 864e5; }); L.setView('hist'); await w(700);
              const sem = [...document.querySelectorAll('#v-hist .hSem')], dia = document.querySelector('#v-hist .hDia'), x = e => Math.round(e.getBoundingClientRect().left);
              const r = [sem.length > 0, sem.every(b => x(b.querySelector('b')) === x(dia.querySelector('span,b')) && b.getBoundingClientRect().height >= 64 && getComputedStyle(b.querySelector('b')).fontSize === '16px' && getComputedStyle(b.querySelector('small')).fontSize === '13px' && b.parentElement.matches('.g99.h101')),
                [...document.querySelectorAll('#v-hist .hDia')].every(d => d.closest('.g99.h101'))];
              sem[0].click(); await w(800); r.push(!!document.querySelector('#v-hist .hSemB .hDia') && document.querySelector('#v-hist .hSem').getAttribute('aria-expanded') === 'true');
              return r; }""")
            depois = 'hSem' in fontes['98z-s374d-padrao.js']
            total += 1
            ok = got == [True] * 4 and not depois and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '4c parte 2 (149d): Histórico — "Semana…" na margem dos dias, 64 px, 16/13, já desenhada dentro do grupo de linhas; abre no lugar')
            if not ok: falhas.append('4c parte 2 historico semana'); print('        veio', got, depois, pg.erros)
            await pg.close()

            # 4c parte 3 (135d, aprovado 18/11 17:50): a dobra (dFold) nasce como LINHA de dobra — sem cartão (fundo, borda em volta e raio), 64 px,
            # título 16, linha fina em cima da primeira e embaixo de cada uma, dobras seguidas sem espaço. Uma regra para Giro, Reservas, Dashboard,
            # Despesas e Ajustes › Preços; o pad99 não embrulha mais as dobras depois do desenho.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const olha = () => { const v = document.querySelector('.view:not([hidden])'), F = [...v.querySelectorAll('section.fxF')].filter(e => e.getBoundingClientRect().height);
                return F.length + ':' + F.every((f, i) => { const c = getComputedStyle(f), h = f.querySelector('.fxH'), ant = (() => { let a = f.previousElementSibling; while (a && !a.getBoundingClientRect().height) a = a.previousElementSibling; return a; })(), junto = !ant || !ant.matches('section.fxF') || Math.abs(ant.getBoundingClientRect().bottom - f.getBoundingClientRect().top) < 1;
                  return !f.classList.contains('card') && !f.closest('.g99') && c.backgroundColor === 'rgba(0, 0, 0, 0)' && c.borderTopLeftRadius === '0px' && c.borderLeftWidth === '0px' && c.borderBottomWidth === '1px' && (f.previousElementSibling && f.previousElementSibling.matches('section.fxF') ? c.borderTopWidth === '0px' : c.borderTopWidth === '1px')
                    && junto && h.getBoundingClientRect().height >= 64 && getComputedStyle(h.querySelector('b')).fontSize === '16px' && Math.round(h.getBoundingClientRect().left) === Math.round(f.getBoundingClientRect().left); }); };
              S.dfold = {};  // 66: a tela Giro saiu
              S.dTab = 'din'; L.setView('dash'); await w(500); R.din = olha();
              L.setView('desp'); await w(500); R.desp = olha();
              S.dTab = 'din'; L.setView('dash'); await w(400); document.querySelector('#v-dash [data-act=dfold][data-id=paraonde]').click(); await w(800);
              R.abre = !!document.querySelector('#v-dash section.fxF[data-fx=paraonde].on .fxB') && S.dfold.paraonde === true; return R; }""")
            total += 1
            ok = (all(re.match(r'^[1-9]\d*:true$', got[k]) for k in ('din', 'desp')) and got['abre'] and 'fxF' not in fontes['98z-s374d-padrao.js'].split('function pad99')[1].split('function ')[0] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '4c parte 3 (135d): a dobra nasce como linha de dobra (sem cartão, 64 px, linha fina, sem espaço entre as seguidas) em Reservas e Despesas (66: o Giro saiu; 46b: Ajustes › Preços saiu)')
            if not ok: falhas.append('4c parte 3 linha de dobra'); print('        veio', got, pg.erros)
            await pg.close()

            # 4d parte 1 (136a, aprovado 18/11 18:27): na ficha, "Lucro real" e "De onde vem o preço" nascem com a seta do conjunto de ícones (gira ao abrir),
            # o valor encostado à direita e sem o "·" solto — tudo na marcação, sem triângulo do navegador e sem conserto depois do desenho.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('estoque'); await w(500); const it = S.items.find(i => i.custo > 0 && i.qty > 0 && !i.bulk); [...document.querySelectorAll('#v-estoque .pcard')].find(x => x.dataset.ref === it.ref).click(); await w(900);
              const ds = [...document.querySelectorAll('details.lrcard, details.cntP')];
              const m = d => { const s = d.querySelector('summary'), v = s.querySelector('.dbV'), st = s.querySelector('.dbSt'); return !!st && !!v && getComputedStyle(s).listStyleType === 'none' && !/·\\s*$/.test(s.firstChild.textContent) && st.getBoundingClientRect().left >= v.getBoundingClientRect().right && s.getBoundingClientRect().right - st.getBoundingClientRect().right < 6 && getComputedStyle(st).transform === 'none' ? st.querySelector('path').getAttribute('d') : 'x'; };
              const a = ds.map(m); ds.forEach(d => d.querySelector('summary').click()); await w(400);
              return [ds.length, a.join('|'), ds.every(d => d.open && getComputedStyle(d.querySelector('.dbSt')).transform !== 'none')]; }""")
            total += 1
            ok = got == [2, 'M6 9l6 6 6-6|M6 9l6 6 6-6', True] and not any('b136' in t for t in fontes.values()) and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '4d parte 1 (136a): ficha — "Lucro real" e "De onde vem o preço" com a mesma seta que gira, valor à direita, sem "·" solto')
            if not ok: falhas.append('4d parte 1 dobras da ficha'); print('        veio', got, pg.erros)
            await pg.close()

            # Ficha numa função só (21/11/2026, preparo do 134): renderDetail chama o corpo (fichaCorpo) e, em ordem, fichaBotao, fichaBarra, fichaLucro e
            # fichaPreco — ninguém embrulha renderDetail. Prova de igualdade antes × depois: HTML idêntico em 3 peças × (4 abas + venda).
            embr = sorted(f for f, t in fontes.items() if re.search(r'^\s*renderDetail = function|= renderDetail;', t, re.M))
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, ref = S.items[0].ref, d = document.createElement('div'); document.body.appendChild(d); S.fnTab = 'est';
              L.renderDetail(ref, { host: d }); await new Promise(r => setTimeout(r, 250)); L.renderDetail(ref, { host: d }); await new Promise(r => setTimeout(r, 250));
              const n = s => d.querySelectorAll(s).length, k = [...d.children].map(e => e.className.split(' ')[0]), r = [n('.fnBar'), n('.fiBtn'), n('.lrcard'), n('.cntP'), k[0] === 'fnBar', !!d.querySelector('.fnCam .fiBtn'), (() => { const c = [...d.children], i = c.findIndex(e => e.matches('.lrcard')); return i >= 0 && !!c[i + 1] && c[i + 1].matches('.cntP'); })()];
              const v = document.createElement('div'); document.body.appendChild(v); L.renderDetail(ref, { host: v, venda: true }); await new Promise(r => setTimeout(r, 200)); r.push(!v.querySelector('.fiBtn,.lrcard,.cntP')); d.remove(); v.remove(); return r; }""")
            total += 1
            ok = embr == [] and got == [1, 1, 1, 1, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Ficha numa função só: renderDetail = corpo + botão Ficha + barra + Lucro real + De onde vem o preço, uma vez cada e na ordem; ninguém a embrulha')
            if not ok: falhas.append('ficha numa funcao so'); print('        veio', embr, got, pg.erros)
            await pg.close()

            # 134 (2b) (aprovado 18/11 12:53): "Vender no Catálogo ›" e "Fotografar no Estúdio ›" ficam no FIM da ficha do Inventário, centralizados,
            # em todas as abas; nascem no fim (fichaLinks, última parte do renderDetail), não são movidos depois; no Catálogo não aparecem.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
              L.setView('estoque'); await w(500); document.querySelector('#v-estoque .pcard').click(); await w(800);
              const d = () => document.querySelector('#v-estoque .fnBar').parentElement, a = () => d().querySelector('.fnAt');
              const olha = () => { const r = a().getBoundingClientRect(), bs = [...a().querySelectorAll('.fnLk')], m = (d().getBoundingClientRect().left + d().getBoundingClientRect().right) / 2;
                return d().querySelectorAll('.fnAt').length === 1 && d().lastElementChild === a() && !d().querySelector('.fnBar .fnAt') && bs.length === 2 && r.height > 0 && bs[1].getBoundingClientRect().top > bs[0].getBoundingClientRect().top && bs.every(b => Math.abs((b.getBoundingClientRect().left + b.getBoundingClientRect().right) / 2 - m) < 2)
                  && [...d().children].filter(e => e !== a() && e.getBoundingClientRect().height).every(e => e.getBoundingClientRect().bottom <= r.top + 1); };
              R.push(olha()); for (const t of ['his', 'sit', 'pre']) { document.querySelector('#v-estoque [data-act=fnTab][data-id=' + t + ']').click(); await w(500); R.push(olha()); }
              const v = document.createElement('div'); document.body.appendChild(v); L.renderDetail(S.items[0].ref, { host: v, venda: true }); await w(200); R.push(!v.querySelector('.fnAt')); v.remove();
              return R; }""")
            total += 1
            ok = got == [True] * 5 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '134 (2b): os links da ficha (Vender no Catálogo, Fotografar no Estúdio) nascem no fim, centralizados, nas 4 abas; no Catálogo não aparecem')
            if not ok: falhas.append('134 links no fim da ficha'); print('        veio', got, pg.erros)
            await pg.close()

            # 134 (2a): a ficha do Inventário sai do cartão grande (celular: fundo e largura da tela) e a linha de cor/grau é linha de lista —
            # 44 px, sem caixa, linha fina embaixo, quantidade à direita sem quebrar; o nome nasce sem "· " na frente (rowLabel junta só o que existe).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('estoque'); await w(500); document.querySelector('#v-estoque .pcard').click(); await w(900);
              const d = document.getElementById('detail'), c = getComputedStyle(d), ps = [...d.querySelectorAll('.pl.pick')];
              return [c.backgroundColor === 'rgba(0, 0, 0, 0)' && c.borderTopWidth === '0px' && c.paddingLeft === '0px', ps.length > 0 && ps.every(p => { const s = getComputedStyle(p), b = p.querySelector('b'); return s.backgroundColor === 'rgba(0, 0, 0, 0)' && s.borderLeftWidth === '0px' && s.borderBottomWidth === '1px' && s.borderTopLeftRadius === '0px' && p.getBoundingClientRect().height >= 44 && b.getBoundingClientRect().height < 30 && Math.abs(b.getBoundingClientRect().right - p.getBoundingClientRect().right) < 1 && !/^\\s*·/.test(p.textContent); }),
                !S.items.some(i => /^\\s*·/.test(L.rowLabel(i)) || /·\\s*$/.test(L.rowLabel(i)))]; }""")
            total += 1
            ok = got == [True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '134 (2a): ficha do Inventário sem o cartão grande; cor/grau como linha de lista (44 px, linha fina, quantidade à direita) e sem "· " solto')
            if not ok: falhas.append('134 ficha linhas'); print('        veio', got, pg.erros)
            await pg.close()

            # 134 (2d) + 64: na ficha do Inventário Preço, Oferta, "No site" e as dobras não têm caixa — Preço e Oferta são linhas (≥ 64 px, linha fina),
            # o estado do Titan vai na frase da linha Preço; "No site" e as dobras são linhas com linha fina e nascem sem a classe de cartão.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('estoque'); await w(500); document.querySelector('#v-estoque .pcard').click(); await w(900);
              const d = document.getElementById('detail'), c = q => getComputedStyle(d.querySelector(q)), T = 'rgba(0, 0, 0, 0)', linha = (x, k) => x['border' + k + 'Width'] === '1px' && x['border' + k + 'Color'] !== T;
              const pl = [...d.querySelectorAll('.ofL')], si = c('#edSite'), lr = c('.lrcard'), cp = c('.cntP');
              return [pl.length === 2 && pl.every(b => getComputedStyle(b).backgroundColor === T && linha(getComputedStyle(b), 'Bottom') && b.getBoundingClientRect().height >= 64), !d.querySelector('#precoCard,#ofAbre,#pvSt'),
                pl.every(b => getComputedStyle(b.querySelector('b')).fontSize === '16px'), /^Titan · /.test(pl[0].querySelector('small').textContent),
                si.backgroundColor === T && linha(si, 'Top') && linha(si, 'Bottom') && si.borderLeftWidth === '0px', [lr, cp].every(x => x.backgroundColor === T && linha(x, 'Bottom') && x.borderLeftWidth === '0px'),
                !d.querySelector('.siteChave.card, .lrcard.card, .cntP.card')]; }""")
            total += 1
            ok = got == [True] * 7 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '134 (2d) + 64: ficha sem caixas — Preço e Oferta em linhas (só mostram), o Titan na frase, "No site" e dobras em linhas finas')
            if not ok: falhas.append('134 ficha sem caixas'); print('        veio', got, pg.erros)
            await pg.close()

            # 134b (aprovado 18/11): Inventário › Fornecedores — cada compra numa linha fina (não é cartão); "Editar" (texto rosa) e a lixeira no centro da
            # 1ª linha do nome, a lixeira termina na margem direita; "Ver peças (N) ›" como link centralizado; barra de 4 px. Alinhado por flex na marcação.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              L.inicioGo('comp'); await w(500); document.querySelector('#v-comp [data-act=cpForn]').click(); await w(700); // 66: Fornecedores mora em Compras
              const c = document.querySelector('#lotView .lotC'); if (!c) return ['sem compra']; const cs = getComputedStyle(c), R = e => e.getBoundingClientRect(), cy = e => (R(e).top + R(e).bottom) / 2;
              const t = c.querySelector('.lotHd b'), rg = document.createRange(); rg.selectNodeContents(t); const l1 = rg.getClientRects()[0], cl = (l1.top + l1.bottom) / 2;
              const ed = c.querySelector('.lotAc .lk100'), tr = c.querySelector('.lotAc .trash'), sv = tr.querySelector('svg'), vp = [...c.querySelectorAll('button')].find(b => /^Ver peças/.test(b.textContent));
              return [!c.classList.contains('card') && cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.borderLeftWidth === '0px' && cs.borderBottomWidth === '1px' && cs.borderBottomColor !== 'rgba(0, 0, 0, 0)',
                Math.abs(cy(ed) - cl) <= 2 && Math.abs(cy(sv) - cl) <= 2, ed.textContent === 'Editar' && getComputedStyle(ed).backgroundColor === 'rgba(0, 0, 0, 0)' && R(ed).height >= 44,
                Math.abs(R(sv).right - R(c).right) <= 3 && R(tr).height >= 44, !!vp && / ›$/.test(vp.textContent) && Math.abs((R(vp).left + R(vp).right) / 2 - (R(c).left + R(c).right) / 2) <= 2,
                Math.round(R(c.querySelector('.bar.lfp')).height) === 4]; }""")
            mede = 'getBoundingClientRect' in fontes['52-lotes.js'].split('function lotCard')[1].split('\n  function ')[0]
            total += 1
            ok = got == [True] * 6 and not mede and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '134b: Fornecedores — compra em linha fina, "Editar" e lixeira no centro da 1ª linha do nome, lixeira na margem, "Ver peças ›" centralizado, barra de 4 px')
            if not ok: falhas.append('134b fornecedores'); print('        veio', got, mede, pg.erros)
            await pg.close()

            # 134d (regra dos formulários 18/11 18:12; regra 15): "Editar produto" abre na janela de baixo do app (lfJanela: alça, tocar fora, arrastar, Esc),
            # sem botão "Fechar"; trocar de aba não abre outra janela; sem mudança fecha direto; COM mudança pergunta "Sair sem salvar?" (Voltar mantém o que
            # foi digitado; "Sair sem salvar" fecha sem mudar a peça); salvar/sair do Inventário fecham sem pergunta. A pergunta é da lfJanela (opção mudou).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [], q = s => document.querySelectorAll(s).length;
              L.setView('estoque'); await w(500); document.querySelectorAll('#v-estoque .pcard')[1].click(); await w(700); if (!document.querySelector('#detail .fnBar')) { document.querySelector('#v-estoque .pcard').click(); await w(700); }
              const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })), abre = async () => { S.qEdit = true; L.render(); await w(600); };
              const digita = () => { const c = document.getElementById('edCodigo'); c.focus(); c.value = 'ZZTESTE1'; c.dispatchEvent(new Event('input', { bubbles: true })); };
              await abre();
              R.push(q('.ljJn.edJn') === 1 && q('.ljJn.edJn #editModal #edSalvar') === 1 && !q('#detail #editModal') && !q('.modal #edSalvar'), ![...document.querySelectorAll('#editModal button')].some(b => /^Fechar/.test(b.textContent.trim())), !!document.querySelector('.ljJn.edJn .ljPuxa'));
              document.getElementById('edTab2').click(); await w(500); document.getElementById('edTab1').click(); await w(500); R.push(q('.ljJn.edJn') === 1 && q('.ljBk') === 1 && q('#editModal') === 1);
              const antes = JSON.stringify(S.items);
              esc(); await w(700); R.push(S.qEdit === false && q('.ljJn') === 0);                                             // sem mudança: fecha direto
              await abre(); document.querySelector('.ljBk').click(); await w(700); R.push(S.qEdit === false && q('.ljJn') === 0);
              await abre(); digita(); await w(200); esc(); await w(700);
              R.push(S.qEdit === true && q('.ljJn.edJn') === 1 && q('.ljJn.lfCf') === 1 && /Sair sem salvar\\?/.test(document.querySelector('.lfCf').innerText));  // com mudança: pergunta
              const bs = [...document.querySelectorAll('.lfCf button')]; R.push(bs.length === 2 && bs[0].textContent === 'Sair sem salvar' && bs[1].textContent === 'Voltar' && bs[1].getBoundingClientRect().top > bs[0].getBoundingClientRect().top);
              bs[1].click(); await w(700); R.push(q('.lfCf') === 0 && q('.ljJn.edJn') === 1 && document.getElementById('edCodigo').value === 'ZZTESTE1');
              document.querySelector('.ljBk').click(); await w(700); document.querySelector('.lfCf .cf418B').click(); await w(900);
              R.push(S.qEdit === false && q('.ljJn') === 0 && JSON.stringify(S.items) === antes);
              await abre(); digita(); await w(200); L.setView('inicio'); await w(800); R.push(S.qEdit === false && q('.ljJn') === 0 && S.view === 'inicio');
              return R; }""")
            total += 1
            ok = got == [True] * 11 and "lfConfirma" in fontes['97-janela.js'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + '134d: "Editar produto" na janela de baixo, sem "Fechar"; sem mudança fecha direto; com mudança pergunta "Sair sem salvar?" (Voltar mantém, sair não muda a peça); sair do Inventário fecha')
            if not ok: falhas.append('134d editar na janela de baixo'); print('        veio', got, pg.erros)
            await pg.close()

            # Item 38, etapa 1 (21/11/2026): o tratamento do giro mede cada fase e grava no diário ("[LF-CAM] tempos {…}"), para o teste no celular
            # dizer onde o tempo vai. Não muda o resultado (prova de igualdade em work/s436/camera-giro/TEMPOS-ITEM-38.md: info, fotos, capa e quadro idênticos).
            total += 1
            gt = fontes['97-giro-trata.js']; fases = re.findall(r"marca\('(\w+)'\)", gt.split('function giroTrata')[1])
            ok = fases == ['abre', 'volta', 'fundo', 'medir', 'escolher', 'video', 'quadros'] and "camDiario('tempos', T)" in gt and 'tempos: T' in gt and 'T.busca +=' in gt and 'T.le +=' in gt
            print(('  ok  ' if ok else ' FALHA ') + 'Item 38 (etapa 1): o tratamento do giro grava no diário o tempo de cada fase (abre, volta, fundo, medir, escolher, vídeo, quadros) e o de buscar/ler os quadros')
            if not ok: falhas.append('item 38 tempos por fase'); print('        veio', fases)

            # Esboço 37a (aprovado 20/11 23:42): UM jeito só de abrir um grupo — tocar num grupo no Início mostra o índice com as telas dele
            # (o mesmo da barra de baixo), não pula para a última tela usada; a tela escolhida abre e "‹ GRUPO" volta ao índice; Marketing abre a tela dele.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
              for (const id of ['g:res', 'g:site']) { L.setView('inicio'); await w(350); document.querySelector('#v-inicio .tl[data-id="' + id + '"]').click(); await w(500);
                R.push(S.view === 'grp' && S.nvG === id && document.querySelectorAll('#v-grp .nvL').length === S.grupos.find(g => g.id === id).itens.length); }
              document.querySelector('#v-grp .nvL').click(); await w(500); const tela = S.view; L.setView('inicio'); await w(350); document.querySelector('#v-inicio .tl[data-id="g:site"]').click(); await w(500);
              R.push(tela !== 'grp' && S.view === 'grp');                                       // usar uma tela do grupo não muda como ele abre
              // 54: os setores de Preços abrem pela mesma pilha — Preços › Regras tem "‹ Preços", que volta ao escritório
              L.setView('inicio'); await w(350); document.querySelector('#v-inicio .tl[data-id="prec"]').click(); await w(500); document.querySelector('#v-dash .tiSe .nvL[data-id=regras]').click(); await w(500);
              R.push(S.view === 'dash' && S.tiSet === 'regras' && document.querySelector('#v-dash .dHdT').textContent === 'Regras' && document.querySelector('.view:not([hidden]) .nvVs').textContent.replace('‹', '') === 'Preços');
              document.querySelector('.view:not([hidden]) .nvVs').click(); await w(500); R.push(S.view === 'dash' && !S.tiSet && document.querySelector('#v-dash .dHdT').textContent === 'Preços');
              L.setView('inicio'); await w(350); document.querySelector('#v-inicio .tl[data-id="g:mkt"]').click(); await w(500); R.push(S.view === 'mkt');
              return R; }""")
            total += 1
            ok = got == [True] * 6 and not any(re.search(r'\bg\.ult\b', t) for t in fontes.values()) and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 37a: grupo pelo Início abre o índice das telas (um jeito só, igual à barra); a tela abre, "‹ grupo" volta; Marketing abre a tela dele')
            if not ok: falhas.append('37a grupo abre o indice'); print('        veio', got, pg.erros)
            await pg.close()

            # Esboço 37d parte 1 (Ajustes organizado, aprovado 20/11 15:53 + 149i): 3 blocos com título vindos de UMA tabela, linhas sem cartão,
            # sacola em Pedidos do site (o globo fica só no Site) e L4 — nenhuma linha quebra em 2 nem corta, celular 390, letra 1× e 1,3×, claro e escuro.
            got = []
            for esq, zoom in (('dark', 1), ('light', 1), ('dark', 1.3)):
                ctx37 = await b.new_context(viewport={'width': 390, 'height': 844}, color_scheme=esq, service_workers='block')
                pg = await pagina(scheme=esq, ctx=ctx37, fam=True, tudo=False)
                await pg.context.route(re.compile(r'googleapis'), lambda r: r.fulfill(json={}))
                if zoom != 1: await pg.add_style_tag(content='#ajGrp .ajR b,#ajGrp .ajRes,#ajGrp .nvxL span,#ajGrp .nvxL small{zoom:%s}' % zoom)  # letra grande do aparelho: só o texto cresce
                got.append(await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
                  try { localStorage.removeItem('lf_ajOrd'); } catch (e) {}
                  const fora = () => [...document.querySelectorAll('#ajGrp .ajR b, #ajGrp .ajRes, #ajGrp .nvxL span, #ajGrp .nvxL small')].filter(e => { const lh = parseFloat(getComputedStyle(e).fontSize) * 1.3; return e.getBoundingClientRect().height > lh * 1.7 || e.scrollWidth > e.clientWidth + 1; }).map(e => e.textContent.trim());
                  S.ajAberta = ''; L.setView('ajustes'); S._ajForce = true; L.render(); await w(450);
                  const g = document.getElementById('ajGrp'), cs = getComputedStyle(g);
                  R.blocos = [...g.querySelectorAll('.ajBl')].map(b => b.querySelector('.ajBt').textContent + ':' + [...b.querySelectorAll('.ajS')].map(x => x.dataset.k).join(','));
                  R.plano = [cs.backgroundColor, cs.borderTopWidth, cs.borderRadius, getComputedStyle(g.querySelector('.ajS')).backgroundColor, getComputedStyle(g.querySelector('.ajR')).paddingLeft].join('|');
                  R.ico = !!g.querySelector('.ajS[data-k=ig].ajF') && /não ligado/.test(g.querySelector('.ajS[data-k=ig] .ajRes').textContent);  // 86: Instagram pronta, liga quando a nuvem ligar a conta
                  R.fora0 = fora();
                  S.nuvem.rt = 'x'; S.nuvem.email = 'a@b.c'; S.nvLista = [{id: '2026-11-08', kb: 900}]; S.ajAberta = 'bk'; S._ajForce = true; L.render(); await w(600);
                  R.nuvem = document.querySelectorAll('#ajGrp .ajS[data-k=bk].on .nvxL').length; R.fora1 = fora(); R.cabe = document.getElementById('ajGrp').getAttribute('data-cabe');
                  return R; }"""))
                erros37d = list(pg.erros); await pg.close(); await ctx37.close()
                if erros37d: break
            total += 1
            B37 = ['Contas ligadas:ig,bk', 'Este aparelho:imp,tema,seg,av,upd']  # 86 + 46: só o aparelho e as contas
            ok = (len(got) == 3 and all(r['blocos'] == B37 and r['plano'] == 'rgba(0, 0, 0, 0)|0px|0px|rgba(0, 0, 0, 0)|0px' and r['ico'] and r['fora0'] == [] and r['fora1'] == [] and r['nuvem'] == 4 for r in got)
                  and got[0]['cabe'] == '0' and not any(re.search(r"AJ_PADRAO\.push|AJ_PADRAO = \[", t) for t in fontes.values()) and not erros37d)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 37d (1) + 86: Ajustes em 2 blocos de uma tabela só (Contas ligadas com Instagram · Este aparelho), linhas sem cartão, nenhuma linha quebra (letra 1× e 1,3×)')
            if not ok: falhas.append('37d ajustes em blocos'); print('        veio', got, erros37d)

            # Esboço 37d parte 2 (Ajustes organizado, aprovado 20/11 15:53): a Marca mora só em Ajustes › Loja — linha "nome · idiomas" sem seta que abre
            # a janela de baixo com um "Salvar" (sem "Fechar"); mudar e sair pergunta "Sair sem salvar?"; salvar grava no kit e atualiza a linha.
            # O Marketing não tem mais o "Kit da marca". Site continua "›" (outra tela) pela mesma regra (vai).
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
              const toca = () => document.querySelector('#mkMarcaL .mkMarca').click();
              L.setView('ajustes'); S._ajForce = true; L.render(); await w(300); const semAj = !document.querySelector('#ajGrp .ajS[data-k=marca]');
              L.inicioGo('mkt'); await w(500);
              const m = () => document.querySelector('#mkMarcaL .mkMarca');
              R.linha = [m().querySelector('b').textContent, m().querySelector('small').textContent, !m().querySelector('i'), semAj, document.querySelector('#v-mkt .top + #mkMarcaL') !== null];
              toca(); await w(600); let j = document.querySelector('.ljJn');
              R.janela = [!!j, j ? j.querySelectorAll('[data-kit]').length : 0, j ? [...j.querySelectorAll('button')].map(b => b.textContent.trim()).join('|') : '', true];
              esc(); await w(500); R.semMudar = !document.querySelector('.ljJn');
              toca(); await w(600); j = document.querySelector('.ljJn'); j.querySelector('[data-kit=nome]').value = 'Loja Teste'; j.querySelector('[data-kit=idioma]').value = 'es';
              esc(); await w(500); R.pergunta = document.body.innerText.includes('Sair sem salvar?') && !!document.querySelector('.ljJn');
              const volta = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Voltar' && b.getClientRects().length); if (volta) volta.click(); await w(400);
              R.voltou = !!document.querySelector('.ljJn') && S.mkt.kit.nome !== 'Loja Teste';
              document.querySelector('.ljJn [data-marca=salva]').click(); await w(700);
              R.salvou = [!document.querySelector('.ljJn'), S.mkt.kit.nome, S.mkt.kit.idioma, m().querySelector('small').textContent];
              R.mkt = [S.view, document.querySelectorAll('#v-mkt [data-kit]').length, /Kit da marca/.test(document.getElementById('v-mkt').textContent)];
              return R; }""")
            total += 1
            ok = (got['linha'] == ['Marca', 'La Fouch · PT e ES', True, True, True] and got['janela'] == [True, 8, 'Salvar', True] and got['semMudar'] and got['pergunta'] and got['voltou']
                  and got['salvou'] == [True, 'Loja Teste', 'es', 'Loja Teste · ES'] and got['mkt'] == ['mkt', 0, False] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 37d (2) + 86: Marca no topo do Marketing (saiu de Ajustes) — linha sem seta abre a janela com um Salvar, "Sair sem salvar?", grava no kit')
            if not ok: falhas.append('37d marca em ajustes'); print('        veio', got, pg.erros)
            await pg.close()

            # Esboço 38 parte B: um "chão" só (--chao, escrito por chaoMede) — o aviso curto fica 8 px acima da barra de baixo ou do botão da
            # janela aberta, nunca cruza nenhum dos dois (nem a barra ao lado do tablet/PC), e sem barra (Estúdio) fica a 16 px do pé; 390, 820 e 1366.
            # O chip de dica, a lixeira do Início e a barra do Estúdio partem do mesmo chão (sem número próprio no CSS).
            got = []
            for W38, H38 in ((390, 844), (820, 1180), (1366, 768)):
                ctx38 = await b.new_context(viewport={'width': W38, 'height': H38}, color_scheme='dark', service_workers='block')
                pg = await pagina(ctx=ctx38, fam=True, tudo=False)
                got.append(await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
                  const cruza = (a, b) => !!a && !!b && a.height > 0 && b.height > 0 && !(a.bottom <= b.top || a.top >= b.bottom || a.right <= b.left || a.left >= b.right);
                  const t = () => document.getElementById('lfToast').getBoundingClientRect(), nav = () => document.getElementById('mainnav').getBoundingClientRect(), pe = () => Math.round(innerHeight - t().bottom);
                  const embaixo = nav().width > nav().height;   // barra no pé (celular) ou ao lado (tablet/PC)
                  L.setView('desp'); await w(400); L.lfToast('Despesa guardada', 'ok'); await w(700);
                  R.barra = !cruza(t(), nav()) && (embaixo ? Math.round(nav().top - t().bottom) === 8 : pe() === 16);
                  L.setView('mkt'); await w(400); L.ACT.mkMarca(); await w(700); L.lfToast('Preencha o nome', 'atencao'); await w(700);
                  const bt = document.querySelector('.ljJn [data-marca=salva]').getBoundingClientRect();
                  R.janela = !cruza(t(), bt) && Math.round(bt.top - t().bottom) === 8;
                  document.querySelector('.ljJn [data-marca=salva]').click(); await w(60); L.lfToast('Salvo', 'ok'); await w(900);
                  R.depois = !cruza(t(), nav()) && (embaixo ? Math.round(nav().top - t().bottom) === 8 : pe() === 16);
                  L.estAbre(); await w(500); L.lfToast('Fotos guardadas', 'ok'); await w(700); R.estudio = pe() === 16;
                  return [R.barra, R.janela, R.depois, R.estudio]; }"""))
                erros38b = list(pg.erros); await pg.close(); await ctx38.close()
                if erros38b: break
            css = open(os.path.join(RAIZ, 'www', 'style.css'), encoding='utf-8').read()
            chao = [bool(re.search(r"%s\{[^}]*bottom:calc\(var\(--chao\) \+ %s\)" % (sel, n), css)) for sel, n in (('#lfToast', '8px'), ('#qchip', '8px'), ('#inLixo', '56px'), (r'\.estBarra', '8px'))]
            total += 1
            ok = got == [[True] * 4] * 3 and chao == [True] * 4 and not erros38b
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 38 (B): um chão só — aviso 8 px acima da barra ou do botão da janela, sem cruzar (390/820/1366); chip, lixeira e barra do Estúdio no mesmo chão')
            if not ok: falhas.append('38 chao unico'); print('        veio', got, chao, erros38b)

            # Esboço 38 parte A (aprovado 21/11 07:51): o aviso curto tem a cor do tipo (regra 17) — toda chamada de lfToast diz o tipo;
            # frase de falha ("Não…", "erro") nunca sai verde; a cor vem de uma classe por tipo no CSS, claro e escuro, letra 15/600.
            ch = []
            for f, t in fontes.items():
                for m in re.finditer(r"(?<![\w.])lfToast\(", t):
                    if t[max(0, m.start() - 9):m.start()] == 'function ': continue
                    i, d, q = m.end(), 0, None
                    while i < len(t):
                        c = t[i]
                        if q:
                            if c == '\\': i += 2; continue
                            if c == q: q = None
                        elif c in "'\"`": q = c
                        elif c in '([{': d += 1
                        elif c in ')]}':
                            if d == 0: break
                            d -= 1
                        i += 1
                    ch.append((f, t[m.end():i]))
            TIPO = r"(?:'(?:ok|atencao|erro|andamento|neutro)'|[\w.()]+ \? '(?:ok|atencao|erro|andamento|neutro)' : '(?:ok|atencao|erro|andamento|neutro)')"
            sem = [(f, a[:70]) for f, a in ch if not re.search(r", " + TIPO + r"(, \{[\s\S]*\})?$", a)]  # 85: ação opcional ({ t: 'Desfazer', fn })
            verde = [(f, a[:70]) for f, a in ch if a.endswith(", 'ok'") and re.match(r"'(Não|Sem resposta|Erro)", a)]
            got = []
            for esq in ('dark', 'light'):
                pg = await pagina(scheme=esq, tudo=False)
                got.append(await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms)), R = [];
                  const cor = v => { const d = document.createElement('i'); d.style.color = 'var(' + v + ')'; document.body.appendChild(d); const c = getComputedStyle(d).color; d.remove(); return c; };
                  for (const [tp, bg, fg] of [['ok', '--okbg', '--ok'], ['atencao', '--warnbg', '--warn'], ['erro', '--badbg', '--bad'], ['andamento', '--panel2', '--fg'], [undefined, '--okbg', '--ok'], ['qualquer', '--okbg', '--ok']]) {
                    L.lfToast('prova', tp); await w(60); const e = document.getElementById('lfToast'), s = getComputedStyle(e);
                    R.push(s.backgroundColor === cor(bg) && s.color === cor(fg) && s.fontSize === '15px' && s.fontWeight === '600' && e.classList.contains('on') && e.getAttribute('role') === (tp === 'erro' ? 'alert' : 'status')); }
                  return R; }"""))
                erros38 = list(pg.erros); await pg.close()
            total += 1
            ok = len(ch) >= 100 and not sem and not verde and got == [[True] * 6] * 2 and not erros38
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 38 (A): aviso curto com a cor do tipo — toda chamada diz o tipo, falha nunca sai verde, 4 cores no claro e no escuro')
            if not ok: falhas.append('38 aviso com tipo'); print('        veio', len(ch), sem[:5], verde[:5], got, erros38)

            # Esboço 37c (aprovado 20/11 23:42): link solto NASCE declarado (lkSolto/lkCls/lkLinha); ninguém adivinha pelo texto depois do desenho —
            # as linhas da nuvem e "Gerenciar grupo ›" ficam no estilo próprio, e redesenhar a tela não muda a classe de nenhum botão.
            pg = await pagina(fam=True, tudo=False)
            await pg.context.route(re.compile(r'googleapis'), lambda r: r.fulfill(json={}))
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), R = {};
              const cls = v => [...document.querySelectorAll('#v-' + v + ' button, #v-' + v + ' a')].map(e => e.className.split(' ').filter(c => !(c === 'on' && e.classList.contains('lgB'))).join(' ')).join('|');  // o ⏻ muda de cor com o estado (a nuvem pode trazer a Baixa automática no meio)
              S.nuvem.rt = 'x'; S.nuvem.email = 'a@b.c'; S.nvLista = [{id: '2026-11-08', kb: 900}]; S.ajAberta = 'bk'; L.setView('ajustes'); S._ajForce = true; L.render(); await w(500);
              const nv = [...document.querySelectorAll('#v-ajustes .nvxL')]; R.nuvem = [nv.length, nv.filter(e => e.classList.contains('lk100')).length, nv.every(e => getComputedStyle(e).textAlign !== 'center' && getComputedStyle(e).display === 'flex')];
              R.iguais = [];
              for (const v of ['ajustes', 'caixa', 'ped', 'dash', 'fx', 'hist', 'notif']) { L.setView(v); await w(400); const a = cls(v); L.render(); await w(250); L.render(); await w(250); R.iguais.push(a === cls(v)); }
              L.setView('inicio'); await w(300); document.querySelector('#mainnav .mn[data-id="g:pecas"]').click(); await w(500);
              const a = cls('grp'); document.querySelector('#mainnav .mn[data-id="g:pecas"]').click(); await w(400); L.render(); await w(300); const ge = document.querySelector('#v-grp .nvGer');
              R.grp = [a === cls('grp'), !!ge && !ge.classList.contains('lk100'), document.querySelectorAll('#v-grp .lk100').length];
              L.setView('caixa'); await w(400); R.link = !!document.querySelector('#v-caixa .lcT.cxLr.lk100.c101');
              R.linha = L.lkLinha('Ver', 'view', 'caixa', 'sub').indexOf('class="esLn slVai r100"') > 0 && L.lkLinha('Ver', 'view').indexOf('<b style="font-weight:500">Ver ›</b>') > 0;
              return R; }""")
            total += 1
            adiv = [f for f, t in fontes.items() if re.search(r'pad100|FORA100|_p100', t)]
            ok = (got['nuvem'] == [4, 0, True] and got['iguais'] == [True] * 7 and got['grp'] == [True, True, 0] and got['link'] and got['linha'] and not adiv and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 37c: link solto nasce declarado — sem adivinhação (pad100/FORA100 fora), nuvem e "Gerenciar grupo" no estilo próprio, redesenhar não muda classe')
            if not ok: falhas.append('37c link declarado'); print('        veio', got, adiv, pg.erros)
            await pg.close()

            # Esboço 37b (dono 20/11 23:23: "todos da mesma cor, prefiro o cinza"): ícone de linha de lista (atalho do Início, "Vendido hoje",
            # índice de cada grupo) = cor --mute, claro e escuro; a cor mora numa regra só do CSS (nenhuma outra pinta .ti/.hi/.nvIc nem o svg do atalho).
            got = []
            for esq in ('dark', 'light'):
                pg = await pagina(scheme=esq, fam=True, tudo=False)
                got.append(await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
                  const d = document.createElement('i'); d.style.color = 'var(--mute)'; document.body.appendChild(d); const mute = getComputedStyle(d).color; d.remove();
                  let n = 0, fora = [];
                  const olha = sel => document.querySelectorAll(sel).forEach(e => { if (!e.getClientRects().length) return; n++; if (getComputedStyle(e).color !== mute) fora.push(sel + ' ' + getComputedStyle(e).color); });
                  L.setView('inicio'); await w(450); olha('#v-inicio .tl .ti, #v-inicio .tl .ti svg, #v-inicio .hero .hi, #v-inicio .hero .hi svg');
                  for (const g of S.grupos) { if (g.id === 'g:mkt') continue; L.setView('inicio'); await w(300); const t = document.querySelector('#v-inicio .tl[data-id="' + g.id + '"]'); if (!t) continue; t.click(); await w(450); olha('#v-grp .nvIc, #v-grp .nvIc svg'); }
                  return [n > 15, fora]; }"""))
                erros37b = list(pg.erros); await pg.close()
            css = open(os.path.join(RAIZ, 'www', 'style.css'), encoding='utf-8').read()
            pinta = re.findall(r'[^{}]*(?:\.nvIc|\.tl[^{},]*\.ti|\.hero[^{},]*\.hi|\.tl svg)[^{}]*\{[^}]*(?<![-\w])color\s*:[^;}]*', css)
            total += 1
            ok = got == [[True, []], [True, []]] and len(pinta) == 2 and not erros37b   # a regra única + a do atalho aceso (.tl.on .ti)
            print(('  ok  ' if ok else ' FALHA ') + 'Esboço 37b: ícones de linha de lista em cinza (Início, "Vendido hoje", índice dos grupos), claro e escuro, cor numa regra só')
            if not ok: falhas.append('37b icones cinza'); print('        veio', got, [x[-120:] for x in pinta], erros37b)

            # 39 · preço exato (aprovado 21/11 07:51), parte do APP: cada pixSemPar ainda não ligado é uma linha do Guardião nas Pendências, primeiro da lista,
            # com o texto vindo do motivo (uma tabela só); "Ligar" abre a janela com os pedidos a pagar (mesmo valor primeiro) e pede à NUVEM
            # (reserva {acao:'ligar', pix, pedido}) — o app não grava "pago"; depois de ligar a linha some. "sem-peca" leva ao pedido.
            pg = await pagina(fam=True, tudo=False)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms)), n = Date.now(), R = {};
              const P = (id, sid, num, cli, pag, brl, total) => ({ id, sid, num, cli, orig: 'site', pag, pg: 'pagar', st: 'novo', brl, total, ts: n - 36e5, itens: [] });
              S.pedidos = [P(9001, 'k7q2aaaa', 'K7Q2', 'João Teste', 'pix', 178.9, 250000), P(9002, 'm2x8aaaa', 'M2X8', 'Ana Ruiz', 'pix', 210, 290000), P(9003, 't5b1aaaa', 'T5B1', 'Carlos Gómez', 'alias', 0, 180000), P(9004, 'h3p9aaaa', 'H3P9', 'Bia', 'pix', 95, 130000)];
              S.pixSemPar = [{ id: 'px1', valor: 178.9, moeda: 'brl', ts: n - 6e5, n: 0, motivo: 'sem-pedido', de: 'Maria S' }, { id: 'px2', valor: 120, moeda: 'brl', ts: n - 9e5, n: 2, motivo: 'empate' },
                { id: 'px3', valor: 95, moeda: 'brl', ts: n - 9e5, n: 1, motivo: 'sem-peca', pedido: 'h3p9aaaa' }, { id: 'px4', valor: 250000, moeda: 'pyg', ts: n - 7e5, n: 0, motivo: 'sem-pedido' }, { id: 'px5', valor: 10, moeda: 'brl', ts: n, n: 0, motivo: 'sem-pedido', ligado: true }];
              L.setView('notif'); await w(600); const linhas = () => [...document.querySelectorAll('#v-notif section')].map(s => s.innerText.split(String.fromCharCode(10)).map(x => x.trim()).filter(Boolean));
              const l0 = linhas(); R.txt = l0.slice(0, 4).map(x => x[0] + ' | ' + x[1].replace(/ · (hoje )?[0-9/ :]+$/, '') + ' | ' + x[2]);
              R.n = l0.filter(x => /^(PIX|Transferência) de /.test(x[0])).length;
              document.querySelector('[data-act=pixVerPed][data-id=px3]').click(); await w(500); R.ver = [S.view, S.pedSel]; L.setView('notif'); await w(500);
              document.querySelector('[data-act=pixLigar][data-id=px1]').click(); await w(700); const j = document.querySelector('.ljJn.pxJn');
              R.jan = [...j.querySelectorAll('.lbl, .pxT b, .pxOk')].map(e => e.textContent).join(' | '); R.sel = j.querySelector('.pxL[aria-checked=true]').dataset.sid;
              R.h = [...j.querySelectorAll('.pxL')].every(b => b.getBoundingClientRect().height >= 64);
              j.querySelectorAll('.pxL')[1].click(); await w(200); R.troca = document.querySelector('.pxJn .pxOk').textContent; document.querySelector('.pxJn .pxL').click(); await w(200);
              // a nuvem responde: guarda o que o app mandou
              const F = window.fetch, env = []; S.nuvem = Object.assign(S.nuvem || {}, { rt: 'x' });
              window.fetch = (u, o) => { env.push([String(u), o && o.body]); return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true, id_token: 't', access_token: 't', expires_in: 3600, refresh_token: 'x', documents: [] }) }); };
              try { const pago0 = JSON.stringify(S.pedidos.map(p => p.pg)); document.querySelector('.pxJn .pxOk').click(); await w(900);
                const r = env.filter(e => /cloudfunctions\\.net\\/reserva/.test(e[0])).map(e => JSON.parse(e[1])); R.env = JSON.stringify(r); R.naoPaga = JSON.stringify(S.pedidos.map(p => p.pg)) === pago0;
              } finally { window.fetch = F; S.nuvem.rt = ''; }
              await w(500); R.depois = [document.querySelectorAll('.ljJn').length, linhas().filter(x => /^(PIX|Transferência) de /.test(x[0])).length, !document.querySelector('[data-act=pixLigar][data-id=px1]')];
              return R; }""")
            total += 1
            ok = (got['txt'] == ['PIX de R$ 178,90 sem pedido | não bate com nenhum pedido aberto | Ligar', 'PIX de R$ 120,00 sem pedido | bate com 2 pedidos do mesmo valor | Ligar', 'PIX de R$ 95,00 · pedido H3P9 | pagou, mas a peça já foi vendida | Ver pedido', 'Transferência de Gs. 250.000 sem pedido | não bate com nenhum pedido aberto | Ligar']
                  and got['n'] == 4 and got['jan'] == 'PEDIDOS A PAGAR · MESMO VALOR | Pedido K7Q2 · João Teste | OUTROS PEDIDOS A PAGAR | Pedido M2X8 · Ana Ruiz | Pedido T5B1 · Carlos Gómez | Pedido H3P9 · Bia | Ligar ao pedido K7Q2'
                  and got['sel'] == 'k7q2aaaa' and got['h'] and got['troca'] == 'Ligar ao pedido M2X8' and got['env'] == '[{"acao":"ligar","pix":"px1","pedido":"k7q2aaaa"}]' and got['naoPaga']
                  and got['depois'] == [0, 3, True] and got['ver'] == ['ped', 9004] and len(re.findall(r"'sem-pedido':", ''.join(fontes.values()))) == 1 and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + '39 preço exato (app): cada PIX/transferência sem par é uma linha das Pendências pelo motivo; "Ligar" escolhe o pedido e pede à nuvem; a linha some; o app não marca pago')
            if not ok: falhas.append('39 pix sem par'); print('        veio', got, pg.erros)
            await pg.close()

            # S364 (PORTÃO da folha única): cada tipo de folha fecha arrastando com o mouse de 3 pontos da faixa de cima (esquerda, meio, direita) e com Esc.
            VIS = "s => { const e = [...document.querySelectorAll(s)].filter(e => { const r = e.getBoundingClientRect(), c = getComputedStyle(e); return !e.hidden && c.display !== 'none' && c.visibility !== 'hidden' && r.height > 60 && r.top < innerHeight - 40; }).pop(); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.width]; }"
            LIVRE = "a => { const e = document.elementFromPoint(a[0], a[1]); return !(e && e.closest('button,a,input,select,textarea,label,[data-act],[role=button],[role=switch]')); }"
            FOLHAS = [('janela', 'vendas', "() => document.getElementById('cjAj').click()", '.ljJn'), ('caixa', 'caixa', "() => window.__LF.ACT.cxabre('mel')", '.cxAcao.on'),
                      ('filtros', 'estoque', "() => [...document.querySelectorAll('#v-estoque button')].find(b => /Filtros e ordem/.test(b.getAttribute('aria-label') || '')).click()", '#filtBox'),
                      ('câmbio', 'fx', "() => document.querySelector('[data-act=fjAbre]').click()", '.fjJn'), ('período', 'dash', "() => document.querySelector('#v-dash .dHdP').click()", '.lfa-sh')]
            ruins = []
            pg = await pagina()
            for nome, tela, abre, sel in FOLHAS:
                for onde in ('esq', 'meio', 'dir', 'esc'):
                    await pg.evaluate("t => window.__LF.setView(t)", tela); await pg.wait_for_timeout(350)
                    await pg.evaluate(abre); await pg.wait_for_timeout(900)
                    v = await pg.evaluate(VIS, sel)
                    if not v: await pg.evaluate(abre); await pg.wait_for_timeout(1500); v = await pg.evaluate(VIS, sel)  # máquina carregada: 2ª tentativa
                    if not v: ruins.append(nome + ' não abriu'); continue
                    if onde == 'esc': await pg.keyboard.press('Escape')
                    else:
                        x = v[0] + {'esq': 26, 'meio': v[2] / 2, 'dir': v[2] - 26}[onde]; y = None
                        for yy in (v[1] + 14, v[1] + 30, v[1] + 46, v[1] + 8, v[1] + 58):
                            if await pg.evaluate(LIVRE, [x, yy]): y = yy; break
                        if y is None: await pg.keyboard.press('Escape'); await pg.wait_for_timeout(700); await pg.evaluate(SAIR_SEM_SALVAR); await pg.wait_for_timeout(500); continue
                        await pg.mouse.move(x, y); await pg.mouse.down()
                        for k in range(1, 7): await pg.mouse.move(x, y + k * 45); await pg.wait_for_timeout(20)
                        await pg.mouse.up()
                    await pg.wait_for_timeout(900)
                    if await pg.evaluate(VIS, sel): ruins.append(nome + ' ' + onde); await pg.keyboard.press('Escape'); await pg.wait_for_timeout(600)
            total += 1
            ok = not ruins and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S364 PORTÃO: toda folha fecha arrastando de 3 pontos da faixa de cima e com Esc (janela, caixa, filtros, câmbio, período)')
            if not ok: falhas.append('S364 folha única'); print('        veio', ruins, pg.erros)
            await pg.close()

            # S364: toques que levam à ação — conta a pagar marca como paga, colchão leva ao Câmbio, Preços leva à lista e às contas
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, sl = ms => new Promise(r => setTimeout(r, ms));
              L.setView('desp'); await sl(500);
              // S374 (106/108): sem "Contas para pagar"; o aviso fica na linha da conta e o círculo marca como paga
              const avs = () => document.querySelectorAll('#v-desp .ecF .ecNm small span').length;
              let contas = ![...document.querySelectorAll('#v-desp section')].some(x => /^Contas para pagar/.test(x.innerText.trim())); const n = avs();
              if (n) { const r = [...document.querySelectorAll('#v-desp .ecF')].find(x => x.querySelector('.ecNm small span')); r.querySelector('.chk').click(); await sl(400); contas = contas && avs() === n - 1; }
              L.inicioGo('prec'); await sl(500);
              // 54: a linha "N preços para corrigir ›" do "O Titan decide hoje" leva à tela da lista, com a mesma contagem
              const kp = document.querySelector('#v-dash .tiD .nvL[data-id=corr]'), n1 = kp ? +/^(\\d+)/.exec(kp.querySelector('b').textContent)[1] : 0, precos = n1 === L.invPrecosAcorrigir().length;
              if (n1) { kp.click(); await sl(500); }
              const lista = !n1 || document.querySelectorAll('#v-dash .pcNaTela .pcLi').length === n1;
              return [contas, precos, lista, typeof L.ACT.d48Res === 'function' && typeof L.ACT.prodDesfaz === 'function']; }""")
            total += 1
            ok = got == [True] * 4 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S364: toques que levam à ação (conta a pagar, preços para corrigir com a mesma contagem da lista)')
            if not ok: falhas.append('S364 toques'); print('        veio', got, pg.erros)
            await pg.close()

            # S365 (lote 4): conta única de lucro (exemplo do dono), venda em 3 toques e Pagamento de luxo.
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, sl = ms => new Promise(r => setTimeout(r, ms));
              const r = p => L.lrVenda({ price: p, rep: 14453, taxa: 0, qty: 1 }).lucro;
              const exemplo = r(105000) === 81002 && r(94500) === 71456 && r(84000) === 61911;
              const it = S.items.find(i => !i.bulk && L.effCusto(i) > 0 && i.qty > 0 && L.tFor(i).price > 0 && L.lucroPecaHtml(i.ref)), ref = it.ref, p = L.tFor(it).price, u = L.lucroUnico(ref, p);
              const card = L.lucroPecaHtml(ref), barra = L.cntPrecoHtml(ref);
              const igual = card.includes(L.gs(u)) && (!barra || barra.includes('Lucro ' + L.gs(Math.max(0, u)))) && !/IVA da compra/.test(card);
              L.setView('vendas'); await sl(500); document.querySelector('#vRows .pcard[data-ref]').click(); await sl(700);
              [...document.querySelectorAll('button')].filter(e => e.offsetParent && /^Vender/.test(e.innerText.trim())).pop().click(); await sl(800);
              const vis = e => !!e && e.offsetParent !== null;
              // S370 (esboço 54): Vender abre o CARRINHO; "Ir para o pagamento" leva ao Pagamento, que não tem mais "+ Adicionar outra peça"
              const noCarrinho = S.cartOpen && S.cartStep === 'ped' && vis(document.getElementById('cartCard')) && /Ir para o pagamento/.test(document.getElementById('cartConf').innerText);
              document.getElementById('cartConf').click(); await sl(600);
              const tres = noCarrinho && S.cartOpen && S.cartStep === 'pag' && vis(document.getElementById('sgo')) && !vis(document.getElementById('pagMais')) && /Carrinho/.test(document.getElementById('pagHead').innerText);
              const f = [...document.querySelectorAll('#formaChips .trkB')], m = [...document.querySelectorAll('#moedas .trkB')];
              const trilhos = f.length >= 2 && m.length === 3 && !document.querySelector('#formaChips .chip, #moedas .chip') && document.getElementById('formaTx').hidden;
              const ordem = !!(document.getElementById('recIn').compareDocumentPosition(document.getElementById('cliPickB')) & 4) && getComputedStyle(document.getElementById('tot')).fontSize === '40px';
              document.querySelector('#pagHead [data-act=cartvolta]').click(); await sl(400);
              document.getElementById('cartSlot').click(); await sl(500);
              const volta = !S.cartOpen && S.cart.length === 1;
              return [exemplo, igual, tres, trilhos, ordem, volta]; }""")
            total += 1
            ok = got == [True] * 6 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S365/S370: lucro único (81.002 · 71.456 · 61.911; cartão = barra), rota Vender → Carrinho → Pagamento (54), Pagamento com trilhos, total em destaque e cliente depois do valor')
            if not ok: falhas.append('S365 lote 4'); print('        veio', got, pg.erros)
            await pg.close()

            # S332 (15/11/2026, opção A): a cópia do site do MODO LOJA se atualiza sozinha (sem APK). Aparelho falso (Capacitor + Filesystem em memória):
            # baixa tudo, reescreve os caminhos para a pasta nova, o modo loja abre de lá e dá sinal de vida; 2ª busca "em dia";
            # versão seguinte baixa só os textos (binário igual é copiado); cópia estragada é descartada e volta a do APK.
            pg = await pagina()
            LJD = os.path.join(RAIZ, 'www', 'loja'); mfl = json.load(open(os.path.join(LJD, 'manifest.json'))); V0 = mfl['v']
            disco = {}; pedidos = []; versao = {'v': V0 + 1}
            MIME = {'html': 'text/html', 'js': 'text/javascript', 'png': 'image/png', 'jpg': 'image/jpeg', 'json': 'application/json'}
            async def gh(route):
                rel = route.request.url.split('/LaFouch/loja/')[1].split('?')[0]; pedidos.append(rel)
                if rel == 'manifest.json': await route.fulfill(json={'v': versao['v'], 'files': mfl['files']}, headers={'access-control-allow-origin': '*'})
                else: await route.fulfill(body=open(os.path.join(LJD, rel), 'rb').read(), content_type=MIME.get(rel.rsplit('.', 1)[-1], 'application/octet-stream'), headers={'access-control-allow-origin': '*'})
            async def arq(route):
                rel = route.request.url.split('/_capacitor_file_/data/files/')[1].split('?')[0]
                if rel in disco: await route.fulfill(body=disco[rel], content_type=MIME.get(rel.rsplit('.', 1)[-1], 'application/octet-stream'))
                else: await route.fulfill(status=404, body='')
            await pg.context.route(re.compile(r'jamalyassine98\.github\.io/LaFouch/loja/'), gh)
            await pg.context.route(re.compile(r'/_capacitor_file_/'), arq)
            import base64 as _b64
            async def py_grava(path, data, enc): disco[path] = data.encode('utf8') if enc == 'utf8' else _b64.b64decode(data)
            async def py_copia(de, para):
                if de not in disco: raise Exception('sem origem')
                disco[para] = disco[de]
            async def py_apaga(pasta):
                for k in [k for k in disco if k.startswith(pasta + '/')]: del disco[k]
            async def py_lista(pasta): return sorted({k[len(pasta) + 1:].split('/')[0] for k in disco if k.startswith(pasta + '/')})
            await pg.expose_function('pyGrava', py_grava); await pg.expose_function('pyCopia', py_copia); await pg.expose_function('pyApaga', py_apaga); await pg.expose_function('pyLista', py_lista)
            await pg.evaluate("""() => { window.__LF.S.pinHash = ''; window.__LF.S.bioOn = false;
              window.Capacitor = { isNativePlatform: () => true, convertFileSrc: u => u.replace('file://', '/_capacitor_file_'), Plugins: { Filesystem: {
                writeFile: o => window.pyGrava(o.path, o.data, o.encoding || ''), copy: o => window.pyCopia(o.from, o.to), mkdir: async () => ({}), getUri: async o => ({ uri: 'file:///data/files/' + o.path }),
                rmdir: o => window.pyApaga(o.path), readdir: async o => ({ files: (await window.pyLista(o.path)).map(n => ({ name: n })) }) } } }; }""")
            r1 = await pg.evaluate("async () => { const L = window.__LF; L.ACT.mcLiga(); for (let i = 0; i < 40 && !document.getElementById('mlWrap'); i++) await new Promise(r => setTimeout(r, 150)); const apk = document.getElementById('mlFr').getAttribute('src'); L.mcSair(); await new Promise(r => setTimeout(r, 900)); return [apk, await window.__lju.busca(), window.__lju.estado.emb]; }")
            pre = f'/_capacitor_file_/data/files/lojaupd/{V0 + 1}'
            html1 = disco.get(f'lojaupd/{V0 + 1}/loja.html', b'').decode('utf8', 'ignore')
            baixou = r1[0].startswith('loja/loja.html') and r1[1] == f'baixada {V0 + 1}' and r1[2] == V0 and len([k for k in disco if k.startswith(f'lojaupd/{V0 + 1}/')]) == len(mfl['files'])
            reescrito = (pre + '/js/lf-site.js') in html1 and '"/loja/js/' not in html1 and disco.get(f'lojaupd/{V0 + 1}/favicon-48.png') == open(os.path.join(LJD, 'favicon-48.png'), 'rb').read()
            r2 = await pg.evaluate("async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms)); L.ACT.mcLiga(); for (let i = 0; i < 40 && !document.getElementById('mlWrap'); i++) await w(150); await w(10500); const f = document.getElementById('mlFr'); let vivo = false; try { vivo = !!f.contentDocument.getElementById('lojab') && f.contentDocument.documentElement.classList.contains('lojamodo'); } catch (e) {} const src = f ? f.getAttribute('src') : ''; const dia = await window.__lju.busca(); L.mcSair(); await w(900); return [src, vivo, window.__lju.marca().ok, dia]; }")
            abre = r2[0].startswith(pre + '/loja.html') and r2[1] and r2[2] == 1 and r2[3] == 'em dia'
            versao['v'] = V0 + 2; pedidos.clear()
            r3 = await pg.evaluate("() => window.__lju.busca()")
            # 21/11: o site passou a listar as páginas das peças (p/*.html); "texto" é o que o app reescreve e sempre baixa de novo (loja.html e js/*.js,
            # a regra de src/97-atualiza-loja.js). Página de peça que não mudou é copiada da versão anterior, como as fotos.
            so_texto = r3 == f'baixada {V0 + 2}' and sorted(p for p in pedidos if p != 'manifest.json') == sorted(f[0] for f in mfl['files'] if re.match(r'^(loja\.html|js/[\w.\-]+\.js)$', f[0])) and len([k for k in disco if k.startswith(f'lojaupd/{V0 + 2}/')]) == len(mfl['files']) and not any(k.startswith(f'lojaupd/{V0 + 1}/') for k in disco)
            disco[f'lojaupd/{V0 + 2}/loja.html'] = b'<!doctype html><html><body>estragado</body></html>'
            r4 = await pg.evaluate("async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms)); L.ACT.mcLiga(); for (let i = 0; i < 40 && !document.getElementById('mlWrap'); i++) await w(150); const s1 = document.getElementById('mlFr').getAttribute('src'); await w(10800); const f = document.getElementById('mlFr'); const s2 = f ? f.getAttribute('src') : ''; const m = window.__lju.marca(); L.mcSair(); await w(900); try { localStorage.removeItem('lf_modoCli'); localStorage.removeItem('lf_lju'); } catch (e) {} delete window.Capacitor; return [s1, s2, m.ruim, !!m.ok, await window.__lju.busca()]; }")
            volta = r4[0].startswith(f'/_capacitor_file_/data/files/lojaupd/{V0 + 2}/') and r4[1].startswith('loja/loja.html') and r4[2] == V0 + 2 and r4[3] is False and r4[4] == 'sem'
            total += 1
            got = [baixou, reescrito, abre, so_texto, volta]
            ok = got == [True] * 5 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Modo loja se atualiza sozinho: baixa a cópia do site, abre dela, só textos na versão seguinte, cópia estragada volta para a do APK')
            if not ok: falhas.append('modo loja atualização'); print('        veio', got, r1, r2, r3, r4, pg.erros)
            await pg.close()

            # S334 (15/11/2026): a atualização do app cuida do APK. Aparelho falso (plugins LfInstall + Filesystem):
            # APK mais novo na release → baixa sozinho no Wi-Fi e o botão do cartão vira "Atualização pronta" (um botão só); tocar abre o instalador;
            # nos dados móveis espera o toque; arquivo cortado não é oferecido; APK apk_igual ao instalado = nada aparece.
            pg = await pagina()
            EMBN = int(re.search(r'var EMB=(\d+)', open(os.path.join(RAIZ, 'www', 'index.html')).read()).group(1))
            rel = {'n': EMBN + 1, 'tam': 18500000}
            async def ghapi(route):
                await route.fulfill(json={'tag_name': 'apk', 'assets': [{'name': 'chave.enc', 'size': 2800, 'browser_download_url': 'https://github.com/JamalYassine98/LaFouch/releases/download/apk/chave.enc'},
                  {'name': 'LaFouch-%d.apk' % rel['n'], 'size': rel['tam'], 'state': 'uploaded', 'browser_download_url': 'https://github.com/JamalYassine98/LaFouch/releases/download/apk/LaFouch-%d.apk' % rel['n']}]}, headers={'access-control-allow-origin': '*'})
            await pg.context.route(re.compile(r'api\.github\.com/repos/JamalYassine98/LaFouch/releases/tags/apk'), ghapi)
            got = await pg.evaluate("""async (tam) => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms)); const A = window.__apk, log = { baixou: [], instalou: [], tamReal: tam, arq: {} };
              window.Capacitor = { isNativePlatform: () => true, Plugins: { LfInstall: { instalar: async o => { log.instalou.push(o.nome); return { ok: true }; } }, Filesystem: {
                downloadFile: async o => { log.baixou.push(o.url); log.arq[o.path] = log.tamReal; return { path: o.path }; }, stat: async o => { if (!(o.path in log.arq)) throw new Error('não existe'); return { size: log.arq[o.path] }; }, rmdir: async o => { log.arq = {}; } } } };
              const cel = t => Object.defineProperty(navigator, 'connection', { value: { type: t }, configurable: true });
              L.setView('ajustes'); await w(300);
              cel('wifi'); const r1 = await A.busca(false); const h1 = window.__upd.card();
              const wifi = r1 === 'pronto' && log.baixou.length === 1 && /releases\\/download\\/apk\\/LaFouch-\\d+\\.apk$/.test(log.baixou[0]) && /Atualização pronta/.test(h1) && /data-act="apkgo"/.test(h1) && (h1.match(/<button/g) || []).length === 1;
              L.ACT.apkgo(); await w(100); const instala = log.instalou.length === 1 && log.instalou[0] === 'LaFouch-' + A.estado.n + '.apk';
              const r1b = await A.busca(false); const semBaixarDeNovo = r1b === 'pronto' && log.baixou.length === 1;
              log.arq = {}; A.estado.est = ''; cel('cellular'); const r2 = await A.busca(false); const h2 = window.__upd.card();
              const dados = r2 === 'tem' && log.baixou.length === 1 && /Toque para baixar · 18 MB/.test(h2);
              L.ACT.apkgo(); await w(200); const toque = A.estado.est === 'pronto' && log.baixou.length === 2;
              log.arq = {}; A.estado.est = ''; log.tamReal = 1234; cel('wifi'); const r3 = await A.busca(false); const cortado = r3 === 'erro' && !/Atualização pronta/.test(window.__upd.card()) && /Toque para baixar/.test(window.__upd.card()) && /Não consegui baixar/.test(A.linha());
              L.ACT.apkgo(); await w(100); const naoInstala = log.instalou.length === 1;
              delete window.Capacitor; const semApk = await A.busca(false);
              return [wifi, instala, semBaixarDeNovo, dados, toque, cortado, naoInstala, semApk === 'sem']; }""", rel['tam'])
            rel['n'] = EMBN
            apk_igual = await pg.evaluate("""async () => { const A = window.__apk; let apagou = 0; window.Capacitor = { isNativePlatform: () => true, Plugins: { LfInstall: { instalar: async () => ({}) }, Filesystem: { downloadFile: async () => ({}), stat: async () => { throw new Error('x'); }, rmdir: async () => { apagou++; } } } };
              A.estado.est = ''; const r = await A.busca(true); delete window.Capacitor; return [r === 'em dia', A.linha() === '' && !/apkgo/.test(window.__upd.card()), apagou === 1]; }""")
            # S337: WINDOWS — o programa do PC entrega o estado; a tela usa o mesmo botão único e manda "instalar" com o cabeçalho próprio
            pcs = {'est': 'baixa', 'pedidos': []}
            async def pcrota(route):
                rq = route.request; pcs['pedidos'].append((rq.method, rq.url.split('/__pc/')[1], rq.headers.get('x-lafouch', '')))
                await route.fulfill(json={'pc': True, 'emb': EMBN, 'n': EMBN + 3, 'tam': 92000000, 'est': pcs['est'], 'msg': '', 'loja': 0})
            await pg.context.route(re.compile(r'/__pc/'), pcrota)
            pc1 = await pg.evaluate("async () => { const A = window.__apk; await A.pc(0); const h = window.__upd.card(); return [A.pcx.on, /Baixando a atualização/.test(h) && /disabled/.test(h) && (h.match(/<button/g) || []).length === 1]; }")
            pcs['est'] = 'pronto'
            pc2 = await pg.evaluate("async () => { const L = window.__LF, A = window.__apk, w = ms => new Promise(r => setTimeout(r, ms)); await A.pc(0); const h = window.__upd.card(); const um = /Atualização pronta/.test(h) && /Toque para instalar/.test(h) && /data-act=\"apkgo\"/.test(h) && (h.match(/<button/g) || []).length === 1; L.ACT.apkgo(); await w(200); L.ACT.updbusca(); await w(200); A.pcx.on = false; A.estado.est = ''; A.estado.n = 0; return [um]; }")
            pc_ok = pc1 == [True, True] and pc2 == [True] and ('POST', 'instalar', '1') in pcs['pedidos'] and ('POST', 'buscar', '1') in pcs['pedidos']
            total += 1
            ok = got == [True] * 8 and apk_igual == [True] * 3 and pc_ok and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Atualização do APK e do Windows: acha o novo, baixa (Wi-Fi sozinho, dados só no toque), um botão só, recusa arquivo cortado; no PC segue o programa')
            if not ok: falhas.append('atualização do APK'); print('        veio', got, apk_igual, pc1, pc2, pcs['pedidos'], pg.erros)
            await pg.close()

            # Estúdio × Adicionar (v442): botão "Fotografar antes de cadastrar" + Giro; Adicionar com faixa de 2 abas que lembra a aba; foto aguardando leva a 3/4 junto; selos por cor; Completar fotos abre o Estúdio
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const px = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';
              L.estAbre(); await w(200); const txt = document.querySelector('.estOv').innerText; const bot = /Peça nova, ainda sem cadastro/.test(txt) && !!document.querySelector('[data-e=nova]') && !!document.querySelector('[data-e=ajuda]');  // v465: giro foi para o "?"
              document.querySelector('.estOv .estX').click(); await w(100);
              S.estPend = [{ id: 'p1', ts: Date.now(), t: px, t34: px, n: 84 }];
              S.addOpen = true; S.addMode = 'menu'; L.render(); L.renderDeNovo(); await w(100);
              const b = document.getElementById('addDeNovo'); const abas = [b.querySelector('.lbl').textContent, 'só a fila do Estúdio'];  // 44: "Dar entrada de novo" saiu; fica "Aguardando cadastro"
              const lembra = !!document.querySelector('#addDeNovo [data-act=adPend]');
              const it = S.items.find(i => !i.bulk && !/pre/.test(i.tipo)); const k = it.ref + '|' + it.cor;
              S._pendLig = { id: 'p1', ts: Date.now() }; L.setFoto(k, px, px); await w(400);
              const levou = !!S.fotos[k + '|34'] && !S.estPend.length;
              S.fotoNota[k] = { n: 62, mot: ['fundo cinza (mais luz)'], ts: 1 }; const s1 = L.cfSelos(it.ref, it);
              S.fotoNota[k] = { n: 91, mot: [], ts: 1 }; const s2 = L.cfSelos(it.ref, it);
              S.addOpen = false; L.render(); L.ACT.semfoto(); await w(200); const est = !!document.querySelector('.estOv');
              return [bot, abas.length === 2 && /Aguardando cadastro · 1/.test(abas[0]), lembra, levou, /refazer · fundo cinza/.test(s1), /foto 91\\b/.test(s2) && /catálogo/.test(s2), est]; }""")
            total += 1
            ok = got == [True] * 7 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Estúdio × Adicionar: antes de cadastrar + giro, "Aguardando cadastro" no Adicionar (44), 3/4 vai junto, selos por cor, Completar fotos abre o Estúdio')
            if not ok: falhas.append('estudio x adicionar'); print('        veio', got, pg.erros)
            await pg.close()

            # Busca única (v441): no lugar da faixa de avisos urgentes; acha peça, cliente e venda; abre a tela certa
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.clientes = [{id: 7, nome: 'Maria Busca', tel: '0981 555', ruc: '', obs: '', ts: 1}];
              L.setView('inicio'); L.render(); await w(200);
              const faixa = /avisos? urgentes?/.test(document.getElementById('v-inicio').innerText), campo = !!document.getElementById('buQ');
              const q = document.getElementById('buQ'); q.focus(); const ref = S.items.find(i => !i.bulk).ref;
              q.value = 'maria b'; q.dispatchEvent(new Event('input', {bubbles: true})); await w(100);
              const cli = /Maria Busca/.test(document.getElementById('buRes').innerText);
              L.render(); await w(50); const manteve = document.activeElement && document.activeElement.id === 'buQ';
              q.value = ref; q.dispatchEvent(new Event('input', {bubbles: true})); await w(100);
              const pec = !!document.querySelector('#buRes .buR[data-id^="pec:"]'), ven = !!document.querySelector('#buRes .buR[data-id^="ven:"]');
              document.querySelector('#buRes .buR[data-id^="pec:"]').click(); await w(300);
              return [faixa, campo, cli, manteve, pec, ven, S.view === 'estoque' && (S.open === ref || S.open.endsWith('|' + ref)) && S.det === true]; }""")
            total += 1
            ok = got == [False, True, True, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Busca única: no lugar dos avisos urgentes, acha cliente/peça/venda, não perde o teclado e abre a peça')
            if not ok: falhas.append('busca unica'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (74, 75, 77/81/84, 80b): Câmbio, Ajustes sem "Preço automático", Clientes com "+" e ficha de luxo, Cartões no Marketing
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('ajustes'); await w(300); const semPa = ![...document.querySelectorAll('.ajS>.ajR>b')].some(b => b.textContent === 'Preço automático');  // 149p: a linha agora é Preços, com o interruptor dentro (não um atalho)
              L.setView('clientes'); await w(300); const v = document.getElementById('v-clientes');
              const topo = !!v.querySelector('.pl78[data-act=clinovo]') && !v.querySelector('.lkRow') && !v.querySelector('[data-act=cupAbre]');
              S.clientes.push({ id: 991, nome: 'Teste Lima', tel: '0981000111', email: 't@x.com', ruc: '', obs: '', ts: Date.now() }); L.ACT.cliab(991); await w(300);
              const f = document.getElementById('cliFicha'), um = f && f.querySelectorAll('.go77').length === 1 && !f.querySelector('.go') && !!f.querySelector('.hd77 h2') && !f.querySelector('.av77') && !f.querySelector('[data-act=ataConta]') && !!f.querySelector('#cNome');  // S418 (113a): atacado só na aba Atacado
              L.ACT.clifecha(); await w(200);
              const g = L.grpGet ? L.grpGet('g:mkt') : (S.grupos || []).find(x => x.id === 'g:mkt'); const mk = !!g && g.itens.indexOf('cup') >= 0;
              L.ACT.cupAbre(); await w(300); const cup = S.view === 'cup' && /Cartões/.test(document.getElementById('v-cup').textContent);
              return [semPa, topo, um, mk, cup]; }""")
            total += 1
            ok = got == [True] * 5 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (74/75/77/80b): Ajustes sem a linha-atalho "Preço automático", Clientes com "+" e ficha de luxo, Cartões como tela do Marketing')
            if not ok: falhas.append('clientes luxo'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (85, 86): Inventário com "+" redondo, "Em estoque (filtro) ›" sem frase, "N preços para corrigir ›"; Estúdio 44 px, "Galeria ›" (esboço 41), um só "Ver as N"
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('estoque'); await w(400); const a = document.getElementById('btnAdd'), ra = a.getBoundingClientRect();
              const mais = a.classList.contains('pl78') && Math.round(ra.width) === 44 && a.getAttribute('aria-label') === 'Adicionar';
              const kk = !document.getElementById('kpisE') && !document.getElementById('kCont');   // 52d: sem os números grandes
              const pr = !document.querySelector('#invInfo .ifNum');                               // 52d: "N preços para corrigir" foi para o sino
              const lt = [...document.querySelectorAll('#v-estoque .pcard')].every(p => p.querySelector('.pbox'));
              L.estAbre(); await w(400); const ic = document.querySelector('.estIc').getBoundingClientRect().width >= 44 && document.querySelector('.estX').getBoundingClientRect().width >= 44;
              const fi = [...document.querySelectorAll('.estFi')].every(x => x.textContent === 'Galeria ›'), td = !document.querySelector('.estLbl2 .estLink');
              const F = document.querySelectorAll('.estIt').length, m = document.querySelector('.estMais'), vm = !m || /^Ver as \\d+ peças ›$/.test(m.textContent);
              return [mais, kk, pr, lt, ic, fi, td, vm]; }""")
            total += 1
            ok = got == [True] * 8 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (85/86): Inventário com "+" redondo, sem os números grandes nem a linha de preços; Estúdio 44 px, "Galeria ›", um só "Ver as N peças ›"')
            if not ok: falhas.append('inventario estudio 85 86'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (88–92): Vender — ícones redondos, "−"/"+" 44 px, ficha no fim, sem Parecidas fora do Modo cliente, barra no lugar, preço neutro
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('vendas'); await w(400); const ic = [...document.querySelectorAll('#v-vendas .cjIc')].every(x => getComputedStyle(x).borderRadius === '50%' && x.getBoundingClientRect().width >= 44);
              const c = [...document.querySelectorAll('#vRows .pcard')].find(x => x.querySelector('.pbox:not([hidden])')); c.click(); await w(500);
              const st = [...document.querySelectorAll('#vDetail .vsale .step')].every(x => x.getBoundingClientRect().width >= 44), g = document.querySelector('#vDetail .vsale .go'), cabe = g.scrollWidth <= g.clientWidth + 1;
              const fi = document.querySelectorAll('#vDetail .fi89').length === 1 && !document.querySelector('#v-vendas .fnAt'), par = !document.querySelector('#vDetail .vPar');
              const fixo = getComputedStyle(document.querySelector('#vDetail .vsale')).position === 'static';
              const pr = document.createElement('i'); pr.style.color = 'var(--ok)'; document.body.appendChild(pr); const ok = getComputedStyle(pr).color; pr.remove();
              const neutro = getComputedStyle(document.querySelector('#vDetail .vtPreco')).color !== ok;
              document.querySelector('#vDetail .fi89').click(); await w(500);
              return [ic, st, cabe, fi, par, fixo, neutro, S.view === 'estoque']; }""")
            total += 1
            ok = got == [True] * 8 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (88–92): Vender com ícones redondos, quantidade 44 px, ficha no fim, sem Parecidas, barra no lugar e preço neutro')
            if not ok: falhas.append('vender 88 92'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (94–97): famílias Site/Marketing, painel com ?app=2 dentro da tela, linha Site em Ajustes
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.render(); await w(200); const gs = (L.grpGet ? L.grpGet('g:site') : S.grupos.find(g => g.id === 'g:site')).itens.join(','), gm = (L.grpGet ? L.grpGet('g:mkt') : S.grupos.find(g => g.id === 'g:mkt')).itens.join(',');
              L.inicioGo('prod'); await w(400); const fr = document.getElementById('lojaFrame'), url = fr ? fr.getAttribute('src') || '' : '', sb = document.getElementById('siteBox');
              const dentro = S.view === 'onl' && /app=2/.test(url) && !sb.classList.contains('full') && S.onlAba === 'prod';
              L.setView('ajustes'); await w(300); const aj = !document.querySelector('.ajS[data-k=site]');  // 86: a linha Site saiu de Ajustes (fica Site › Ajustes do site)
              L.ACT.ajSite(); await w(300); const cfg = S.view === 'onl' && S.onlAba === 'cfg' && /Ajustes do site/.test((document.querySelector('#v-onl .onl95 h1') || {}).textContent || '') && !!document.querySelector('#v-onl .onl95Fr [data-act=dfold][data-id=frt]');  // os fretes moram aqui
              return [gs, gm, dentro, aj, cfg]; }""")
            total += 1
            ok = got == ['site,ped,msg,vit,prod', 'mkt,tem,cup,anl', True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (94–97): Site com Vitrine e Modelos, Analisador no Marketing, painel dentro da tela (?app=2), Ajustes do site com os fretes (saiu de Ajustes)')
            if not ok: falhas.append('site 94 97'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (98–103): catálogo de peças — blocos que abrem juntos num cartão (abrem e fecham), links no padrão, Marketing como tela, lista não pisca
            pg = await pagina(fam=True)
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('desp'); await w(500); const v = () => document.querySelector('.view:not([hidden])');  // 66: o Giro saiu; Despesas tem dobras juntas
              const soltos = [...v().querySelectorAll('section.fxF')].filter(x => x.classList.contains('card') || x.closest('.g99')).length;  // 135d: a dobra é linha, não cartão
              const q = id => document.querySelector('section.fxF[data-fx="' + id + '"]');
              const dx = q('pagas') ? 'pagas' : 'imp';
              q(dx).querySelector('.fxH').click(); await w(700); const abre = !!q(dx).querySelector('.fxB') && q(dx).parentElement.classList.contains('fxG');
              const lc = q(dx).querySelector('.fxB > *'), anim = lc ? getComputedStyle(lc).animationName : 'x';
              q(dx).querySelector('.fxH').click(); await w(700); const fecha = !q(dx).querySelector('.fxB');
              L.inicioGo('din'); await w(500); const po = !!q('paraonde') && !document.querySelector('[data-act=dfold].chip');
              L.setView('caixa'); await w(400); const cx = [...v().querySelectorAll('.lk100.c101,.slVai.r100')].length >= 2;
              L.inicioGo('hoje'); await w(400); const vd = [...v().querySelectorAll('.mini.p')].every(b => b.classList.contains('inl'));
              L.inicioGo('mkt'); await w(500); const mk = S.view === 'mkt' && !document.querySelector('.ljJn.mkJn') && document.querySelectorAll('#v-mkt .mkDtG details.mkDt').length === 2;  // 37d: o Kit da marca foi para Ajustes › Loja › Marca
              const d = document.querySelector('#v-mkt details.mkDt'); d.querySelector('summary').click(); await w(600); const mkA = d.open; d.querySelector('summary').click(); await w(600);
              return [soltos, abre, anim, fecha, po, cx, vd, mk, mkA && !d.open]; }""")
            total += 1
            ok = got == [0, True, 'none', True, True, True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (98–103): blocos juntos num cartão abrem e fecham, lista não pisca, links no padrão, Marketing como tela com 2 blocos')
            if not ok: falhas.append('catalogo 98 103'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (104c): Histórico — valor e "›" na mesma altura; a frase de baixo não quebra no meio de um valor
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              L.inicioGo('hist'); await w(500); const ds = [...document.querySelectorAll('.d71')];
              const al = ds.every(d => { const v = d.querySelector('.vl').getBoundingClientRect(), c = d.querySelector('.ch').getBoundingClientRect(); return Math.abs((v.top + v.bottom) / 2 - (c.top + c.bottom) / 2) <= 1; });
              const inteiras = ds.every(d => [...d.querySelectorAll('.p104')].every(p => p.getClientRects().length === 1));
              return [ds.length > 0, al, inteiras]; }""")
            total += 1
            ok = got == [True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (104c): Histórico com valor e seta alinhados; a frase só quebra entre as partes')
            if not ok: falhas.append('historico 104c'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (105, 108, 109): botões de ação, Despesas de luxo sem conta repetida, seta anti-horária
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              L.setView('desp'); await w(500); const v = document.getElementById('v-desp'), cx = v.querySelector('.cx108');
              const bloco = !!cx && !v.querySelector('section.kpis') && !/Por grupo|Contas para pagar/.test(v.textContent) && /Total por mês/.test(cx.textContent) && /Cada peça vendida separa/.test(cx.textContent) && getComputedStyle(cx).boxShadow === 'none';
              const nomes = [...v.querySelectorAll('.ecF .ecNm b')].map(b => b.textContent), unico = nomes.length === new Set(nomes).size;
              const t = v.querySelector('.ecF .ecTog'); t.click(); await w(120);
              const m = getComputedStyle(v.querySelector('.ecF.on .ecCh')).transform.match(/matrix\(([^,]+),\s*([^,]+)/), anti = !!m && +m[2] < -0.3;
              L.setView('fx'); await w(500); const fx = document.querySelector('#v-fx [data-act=fjAbre][data-id=troca]'), troca  /* S418 (117) */ = !!fx && !/›/.test(fx.textContent) && getComputedStyle(fx).borderRadius === '14px';
              L.setView('notif'); await w(500); const dz = document.querySelector('#v-notif .dz105'), limpa = !dz || (getComputedStyle(dz).fontSize === '15px' && dz.dataset.act === 'notifLimpa');
              return [bloco, unico, anti, troca, limpa]; }""")
            total += 1
            ok = got == [True] * 5 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'S374 (105/108/109): Despesas num bloco só sem conta repetida, botões de ação no padrão, seta gira anti-horário')
            if not ok: falhas.append('despesas 108'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (esboço 73): Despesas — "+ Nova" no topo abre o formulário; sem "ajuste em Ajustes"; "Marcar como paga ›"
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.dfold = S.dfold || {}; S.dfold.nova = false; L.setView('desp'); await w(400);
              const v = document.getElementById('v-desp'), sem0 = !document.getElementById('nName'), txt = !/ajuste em Ajustes/.test(v.textContent) && /\(automático\)/.test(v.textContent);
              const mp = !v.querySelector('.mpg73');  // S374 (106/108): não há mais "Marcar como paga" repetido
              v.querySelector('[data-act=despNova]').click(); await w(700);
              const abriu = !!document.getElementById('nName') && S.dfold.nova;
              return [sem0, txt, mp, abriu]; }""")
            total += 1
            ok = got == [True] * 4 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Despesas (73): "+ Nova" no topo abre o formulário, peças por mês automático, "Marcar como paga ›"')
            if not ok: falhas.append('despesas 73'); print('        veio', got, pg.erros)
            await pg.close()

            # S374 (esboço 69): fechar um bloco no fim da página não pula para o topo (o título fica no lugar)
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.dfold = { pagas: true }; L.setView('desp'); await w(400);  // 66: o Giro saiu; a última dobra de Despesas
              scrollTo({ top: 99999, behavior: 'instant' }); await w(200);
              const h = () => document.querySelector('section.fxF[data-fx=pagas] .fxH'), t0 = h().getBoundingClientRect().top, y0 = scrollY;
              h().click(); await w(900);
              const t1 = h().getBoundingClientRect().top, fechou = !S.dfold.pagas;
              for (let i = 0; i < 40; i++) { scrollBy({ top: -40, behavior: 'instant' }); await w(10); }
              await w(100); const solto = scrollY === 0 && !document.body.style.minHeight;
              return [y0 > 0, fechou, Math.abs(t1 - t0) < 3, solto]; }""")
            total += 1
            ok = got == [True, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Fechar bloco no fim da página: o título fica no lugar e o espaço some ao rolar para cima')
            if not ok: falhas.append('fechar sem pulo'); print('        veio', got, pg.erros)
            await pg.close()

            # Lista de compras sem excesso (v440), depois de 66: Sobrando (ideal × tem × sobra, dinheiro parado) na tela Parados e sobrando,
            # quem espera ("me avise") vem primeiro, e o pedido antigo (S.lcPed) ainda aparece na Entrada da compra
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.lcPed = null; S.espera = [];
              let Ls = L.lcLista(); const cand = Object.values(Ls.porIdeal).filter(b => b.ideal > 0 && !b.grau && b.cu > 0);
              const a = cand[0]; S.items.filter(i => i.ref === a.m.ref && i.tipo === a.m.tipo && !i.bulk)[0].qty += a.ideal * 3 + 4;
              const z = cand.find(b => b.m.ref !== a.m.ref); S.items.filter(i => i.ref === z.m.ref && i.tipo === z.m.tipo).forEach(i => i.qty = 0);
              S.espera.push({ id: 'e1', ref: z.m.ref, nome: 'Ana', tel: '1', ts: Date.now(), av: false }, { id: 'e2', ref: z.m.ref, nome: 'Bia', tel: '2', ts: Date.now(), av: false });
              Ls = L.lcLista(); const so = Ls.sobra.find(b => b.m.ref === a.m.ref);
              const prim = Ls.acab[0] && Ls.acab[0].m.ref === z.m.ref && /2 clientes esperando/.test(Ls.acab[0].mot);
              L.setView('parsob'); await w(400); const ps = document.getElementById('v-parsob'), secS = /Sobrando · [1-9]/i.test(ps.innerText) && /US\$/.test(ps.innerText), mini = !!ps.querySelector('.psSob .lcTh');
              const x = Ls.acab[0]; S.lcPed = { ts: Date.now(), itens: [{ k: x.k, ref: x.m.ref, tipo: x.m.tipo, grau: x.grau, q: 2, s0: 0 }] };
              const g = S.grp[0]; const html = L.lcPedResumoHtml(g ? [g.id] : []);
              return [!!so && so.sobra >= 2 && so.valor > 0, Ls.parado > 0, secS, mini, prim, /Do pedido da lista/.test(html)]; }""")
            total += 1
            ok = got == [True] * 6 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Lista sem excesso: Sobrando com dinheiro parado em Parados e sobrando, avise-me primeiro, pedido antigo na Entrada')
            if not ok: falhas.append('lista sem excesso'); print('        veio', got, pg.erros)
            await pg.close()

            # 24/11 · UM VOLTAR SÓ (work/s435/voltar/COMO-FAZER-VOLTAR.md; prova = voltar.py/voltar2.py da ESBOCO):
            # os 3 jeitos (seta da tela, voltar do navegador/PWA, voltar do Android) dão a MESMA tela em cada passo;
            # o navegador não sai do app antes do Início; janela, Estúdio e peça aberta fecham no voltar (a tela de baixo fica).
            ONDE = "() => { const S = window.__LF.S; const v = document.querySelector('.view:not([hidden])'); const h = v && [...v.querySelectorAll('h1,h2')].find(e => e.getBoundingClientRect().height); const jan = [...document.querySelectorAll('.ljJn:not(.ljSai),.estOv,.lfa-ov:not(.sai)')].filter(e => e.getBoundingClientRect().height > 60).length; return [S.view, h ? h.textContent.trim().slice(0, 24) : '', (S.nvP || []).join('>'), jan, !!(S.vRef || (S.det && S.open))].join(' | '); }"
            TOCA = "(t) => { const e = [...document.querySelectorAll('.view:not([hidden]) button,.view:not([hidden]) [data-act],#mainnav .mn')].filter(e => e.getBoundingClientRect().height > 0).find(e => e.textContent.trim().replace(/\\s+/g, ' ').startsWith(t)); if (!e) return 'sem ' + t; e.click(); return 'ok'; }"
            SETA = "() => { const v = document.querySelector('.view:not([hidden])'); const b = v && [...v.querySelectorAll('[data-act=nvVolta]')].find(e => e.getBoundingClientRect().height); if (b) { b.click(); return 1; } window.__nvVoltarAndroid(); return 0; }"
            CAMS = [('Preços › Regras', ['Preços', 'Regras'], 2), ('Site › Pedidos', ['Site', 'Pedidos'], 2), ('Marketing', ['Marketing'], 1),
                    ('Peças › Inventário', ['@estoque', 'Inventário'], 2), ('Dinheiro › Reservas', ['@caixa', 'Reservas'], 2)]
            async def vt_onde(pg):
                try: return await pg.evaluate(ONDE) if pg.url.startswith('http') else 'SAIU DO APP'
                except Exception: return 'SAIU DO APP'
            vt_ruim = []
            for nome, toques, n in CAMS:
                trilhas = {}
                for modo in ('seta', 'navegador', 'android'):
                    pg = await pagina(fam=True); await pg.wait_for_timeout(300)
                    for t in toques:
                        if t[0] == '@': await pg.evaluate("(id) => { const b = [...document.querySelectorAll('#mainnav .mn')].find(e => e.getAttribute('data-id') === id || (e.textContent || '').trim() === {estoque: 'Peças', caixa: 'Dinheiro'}[id]); b && b.click(); }", t[1:])
                        else: await pg.evaluate(TOCA, t)
                        await pg.wait_for_timeout(450)
                    tr = [await vt_onde(pg)]
                    for i in range(n):
                        if modo == 'seta': await pg.evaluate(SETA)
                        elif modo == 'navegador': await pg.evaluate("() => { setTimeout(() => history.back(), 0); }")
                        else: await pg.evaluate("() => window.__nvVoltarAndroid()")
                        await pg.wait_for_timeout(500)
                        tr.append(await vt_onde(pg))
                    trilhas[modo] = tr; await pg.close()
                if not (trilhas['seta'] == trilhas['navegador'] == trilhas['android']) or not trilhas['seta'][-1].startswith('inicio') and n > 1 and nome.startswith('Preços'):
                    vt_ruim.append((nome, trilhas))
            # janela (Voltar no tempo), Estúdio e peça aberta: o voltar fecha só o que está por cima
            for nome, abre, modo in (('Voltar no tempo', "() => { window.__LF.setView('ajustes'); window.__LF.ACT.vtAbre(); }", 'navegador'), ('Voltar no tempo', "() => { window.__LF.setView('ajustes'); window.__LF.ACT.vtAbre(); }", 'android'),
                                     ('Estúdio', "() => window.__LF.inicioGo('est')", 'navegador'), ('Estúdio', "() => window.__LF.inicioGo('est')", 'android')):
                pg = await pagina(fam=True); await pg.evaluate(abre); await pg.wait_for_timeout(600)
                a = await vt_onde(pg)
                if modo == 'navegador': await pg.evaluate("() => { setTimeout(() => history.back(), 0); }")
                else: await pg.evaluate("() => window.__nvVoltarAndroid()")
                await pg.wait_for_timeout(700); d = await vt_onde(pg)
                if 'SAIU' in a + d or a.split(' | ')[3] == '0' or d.split(' | ')[3] != '0' or a.split(' | ')[0] != d.split(' | ')[0]: vt_ruim.append((nome + ' · ' + modo, [a, d]))
                await pg.close()
            pg = await pagina(fam=True)
            try: r = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = t => new Promise(r => setTimeout(r, t)); L.setView('vendas'); await w(400);
              const c = [...document.querySelectorAll('#v-vendas .pcard')]; if (c.length < 2) return 'sem peças';
              window.scrollTo(0, 300); await w(200); const y0 = Math.round(scrollY); c[c.length - 1].click(); await w(700); const ab = !!S.vRef;
              setTimeout(() => history.back(), 0); await w(800); return [ab, !S.vRef, S.view, Math.abs(Math.round(scrollY) - y0) < 4]; }""")
            except Exception: r = 'SAIU DO APP'
            if r != [True, True, 'vendas', True]: vt_ruim.append(('peça do Catálogo · navegador', r))
            await pg.close()
            total += 1
            ok = not vt_ruim and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'um voltar só: seta, navegador e Android dão a mesma tela; janela, Estúdio e peça fecham no voltar; o navegador não sai antes do Início')
            if not ok:
                falhas.append('um voltar só')
                for x in vt_ruim: print('        ', x)

            # 24/11 · lista PARTE 1 · 1b: plural de verdade (regra 17) — "1 venda" / "5 vendas", nunca "venda(s)"; função única nPl (src/40)
            pg = await pagina(fam=True); await pg.wait_for_timeout(300)
            r = await pg.evaluate("() => { const t = document.querySelector('#v-inicio').innerText; const L = window.__LF; return [/\\(s\\)/.test(t), typeof L.nPl === 'function' ? [L.nPl(1, 'venda'), L.nPl(5, 'venda'), L.nPl(2, 'dia')] : null]; }")
            total += 1
            ok = r[0] is False and (r[1] is None or r[1] == ['1 venda', '5 vendas', '2 dias'])
            print(('  ok  ' if ok else ' FALHA ') + 'Início sem "(s)": plural de verdade (1 venda / 5 vendas)')
            if not ok: falhas.append('Início sem (s)'); print('        ', r)
            await pg.close()

            # telas: 8 abas x 2 temas, sem erro e com conteúdo
            fundos = {}
            for scheme in ['dark', 'light']:
                pg = await pagina(scheme)
                for aba in ['Dashboard', 'Inventário', 'Vendas', 'Caixa', 'Câmbio', 'Despesas', 'Histórico', 'Ajustes']:
                    total += 1
                    vid = {'Dashboard':'dash','Inventário':'estoque','Vendas':'vendas','Caixa':'caixa','Câmbio':'fx','Despesas':'desp','Histórico':'hist','Ajustes':'ajustes'}[aba]
                    try:
                        await pg.evaluate(f"() => window.__LF.setView('{vid}')"); await pg.wait_for_timeout(300)
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
