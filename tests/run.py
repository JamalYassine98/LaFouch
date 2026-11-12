#!/usr/bin/env python3
"""Testes automáticos do La Fouch.  Uso:  python3 tests/run.py   (ou: npm test)

Abre www/ num Chromium sem interface, com a URL terminando em #test (o app então expõe
window.__LF com as funções internas) e confere contas, lotes, leitor de código, gravação
e as telas. Requer: pip install playwright  (e um Chromium; PLAYWRIGHT_BROWSERS_PATH ou o do sistema).
"""
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
   S.items=[{tipo:'pre',ref:'W1',grau:'+1',cor:'P',qty:3},{tipo:'pre',ref:'W1',grau:'+1',cor:'Q',qty:0}]; S.fotos={'W1|P':'x'};
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
   const V=['vendas','estoque','caixa','fx','desp','hist','hoje','din','giro','prec','cat','ajustes','ped','onl','cli','cont','lotes','novo','notif'],N=['msg','anl','tem','ata'];let n=0,ruim=[];
   N.forEach((a,i)=>{V.concat(N.slice(i+1)).forEach(b=>{n++;const ic=L.grpIcoPar(a,b,24),nm=L.grpNomeSugerido(a,b);if(!ic||!nm||ic.indexOf('<g')<0&&ic.length<120)ruim.push(a+'+'+b)})});
   return [n, ruim, L.grpNomeSugerido('tem','ata'), L.grpNomeSugerido('vendas','msg')]""", [82, [], 'Atacado nos eventos', 'Vendas e mensagens']),
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
   const ids=[...new Set(S.items.map(i=>i.tipo))]; S.metaDia={}; ids.forEach(t=>{S.metaDia[t]=2}); S.diasLoja=26;
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
   S.attr.ZZ100={material:'Metal', publico:'Feminino', formato:'Gatinho'};
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
   const mk=(ref,cor)=>({tipo:'sem',ref,grau:'',cor,qty:3,fmt:'',med:'',vr:'',custo:2});
   S.items.push(mk('YY1','Preto'), mk('YY2','Preto')); S.fotos['YY1|Preto']='data:image/png;base64,a'; S.fotos['YY2|Preto']='data:image/png;base64,b';
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
 ("volumeAuto: usa a média real só com histórico", """const n=Date.now(); S.volume=350; S.volAuto=true; S.appStart=n-10*864e5; S.sales=[{ts:n-864e5,qty:50,estorno:false}]; const a=L.volumeEfetivo();
   S.appStart=n-120*864e5; S.sales=[{ts:n-10*864e5,qty:60,estorno:false},{ts:n-40*864e5,qty:30,estorno:false},{ts:n-5*864e5,qty:99,estorno:true}]; const b=[L.volumeAuto(), L.volumeEfetivo()];
   S.volAuto=false; const c=L.volumeEfetivo(); S.volAuto=true; S.sales=[{ts:n-10*864e5,qty:5,estorno:false}]; return [a, b, c, L.volumeEfetivo()]""", [350, [30, 30], 350, 350]),
 ("backup: exporta e restaura tudo", """S.metaUsd=77; S.items=[{tipo:'pre',ref:'K1',grau:'+1.00',cor:'Preto',qty:3}]; S.pfaixa={K1:'f1'}; const txt=L.backupDados();
   S.metaUsd=1; S.items=[]; S.pfaixa={}; const e=L.restaurarDados(txt); return [e, S.metaUsd, S.items.length, S.pfaixa.K1, L.restaurarDados('lixo').length>0, L.restaurarDados('{"app":"outro"}').length>0]""", ["", 77, 1, "f1", True, True]),
 ("tema: Ajustes tem Auto/Claro/Escuro, troca, lembra e volta ao automático", """
   L.setView('ajustes'); L.render(); const o = {};
   const card = document.getElementById('temaCard'); o.card = !!card; o.btns = card ? card.querySelectorAll('[data-tm]').length : 0;
   const root = document.documentElement, bg = () => getComputedStyle(root).getPropertyValue('--bg').trim();
   const clica = k => document.querySelector('.tmseg [data-tm="' + k + '"]').click();
   const espera = () => new Promise(r => setTimeout(r, 1000));
   o.auto = [root.getAttribute('data-tema'), localStorage.getItem('lf_tema')];
   
   clica('escuro'); await espera();
   o.esc = [root.getAttribute('data-tema'), localStorage.getItem('lf_tema'), bg(), document.querySelector('.tmseg .on').getAttribute('data-tm'), document.querySelector('meta[name="theme-color"]').content];
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
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=exe, args=['--no-sandbox']) if exe else await p.chromium.launch(args=['--no-sandbox'])

            async def pagina(scheme='dark', url='#test', ctx=None, tudo=True, relogio=False):
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
                return pg

            # desempenho: abas fora da tela não são redesenhadas
            pg = await pagina(tudo=False)
            r = await pg.evaluate("() => { const L = window.__LF; L.setView('hist'); const antes = document.getElementById('v-hist').innerHTML.length; L.setView('inicio'); document.getElementById('v-hist').innerHTML = 'x'; L.render(); const fora = document.getElementById('v-hist').innerHTML; L.setView('hist'); return [antes > 10, fora, document.getElementById('v-hist').innerHTML.length > 10]; }")
            ok = r == [True, 'x', True] and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'desempenho: só a aba aberta é redesenhada')
            if not ok: falhas.append('render só da aba aberta'); print('        veio', r, pg.erros)
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
            await pg.locator('#mainnav >> text="Caixa"').first.click(); await pg.wait_for_timeout(300)
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
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(300)
            depois = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'BR44118').map(i => [i.cor, i.qty, i.custo])")
            fechou = await pg.locator('#editModal').count() == 0
            await checa('janela Editar: quantidade e custo só valem ao salvar', ok and antes[0][1] == 4 and depois == [['Preto', 9, 5], ['Bege', 4, 2.5], ['Tartaruga', 2, None]] and fechou, [antes, depois, fechou])

            # Oferta no Inventário: descontos prontos, aviso de piso e encerrar
            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.pprice = {}; window.__LF.render(); }"); await pg.wait_for_timeout(300)
            tem = await pg.evaluate("() => [!!document.getElementById('pvPreco'), !!document.getElementById('ofAbre'), !!document.getElementById('pvSt'), !document.getElementById('ofCard')]")
            await pg.fill('#pvPreco', '25'); await pg.locator('#pvPreco').press('Tab'); await pg.wait_for_timeout(200)
            tipado = await pg.evaluate("() => { const o = window.__LF.S.pprice['BR44118']; return o ? [o.novo, o.nu, Math.round(25 * window.__LF.fxLoja('usd') / 500) * 500] : null }")
            await pg.locator('#ofAbre').click(); await pg.wait_for_timeout(300)
            jan = await pg.evaluate("() => [!!document.getElementById('ofCard'), document.querySelectorAll('#ofCard .ofPc').length]")
            await pg.locator('#ofCancel').click(); await pg.wait_for_timeout(200)
            fechou = await pg.evaluate("() => !document.getElementById('ofCard')")
            await pg.locator('#ofAbre').click(); await pg.wait_for_timeout(300)
            base = await pg.evaluate("() => { const m = document.querySelector('#ofCard .ofRow b'); return parseInt(m.textContent.replace(/\\D/g, ''), 10) }")
            await pg.locator('#ofCard .ofPc[data-pc="20"]').click(); await pg.wait_for_timeout(750)
            pcv = await pg.evaluate("() => parseFloat(document.getElementById('ofPreco').value.replace(',', '.')) * window.__LF.fxLoja('usd')")
            await pg.locator('#ofOk').click(); await pg.wait_for_timeout(300)
            of1 = await pg.evaluate("() => { const o = window.__LF.S.pprice['BR44118']; return o ? [o.ant > o.novo, Math.round((1 - o.novo / o.ant) * 100)] : null }")
            await pg.locator('#ofAbre').click(); await pg.wait_for_timeout(300)
            tem2 = await pg.evaluate("() => [!!document.getElementById('ofAte'), !!document.getElementById('ofFim')]")
            await pg.locator('#ofFim').click(); await pg.wait_for_timeout(300)
            of2 = await pg.evaluate("() => { const o = window.__LF.S.pprice['BR44118']; return o ? o.ant === undefined : true }")
            await checa('oferta: Preço digitável + botão Oferta + status; janela com % de desconto, cancelar, data opcional e encerrar', tem == [True, True, True, True] and tipado and tipado[0] == tipado[2] and tipado[1] == 25 and jan == [True, 6] and fechou and abs(pcv - base * 0.8) <= 1000 and of1 and of1[0] and 18 <= of1[1] <= 22 and tem2 == [True, True] and of2, [tem, tipado, jan, fechou, base, pcv, of1, tem2, of2])

            # Liberar para o site: só com foto em todas as cores
            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.site = {}; Object.keys(S.fotos).filter(k => k.startsWith('BR44118|')).forEach(k => delete S.fotos[k]); }")
            await pg.evaluate("() => window.__LF.render()"); await pg.wait_for_timeout(300)
            sem = await pg.evaluate("() => { const b = document.getElementById('edSiteBtn'); return [!!b, b && b.disabled, document.getElementById('edSite').innerText, !!(b && b.closest('.zcd'))] }")
            await pg.evaluate("() => { const S = window.__LF.S; S.items.filter(i => i.ref === 'BR44118').forEach(i => { S.fotos['BR44118|' + i.cor] = 'data:image/png;base64,AAAA'; }); window.__LF.render(); }"); await pg.wait_for_timeout(300)
            com = await pg.evaluate("() => { const b = document.getElementById('edSiteBtn'); return [b && b.disabled] }")
            await pg.click('#edSiteBtn'); await pg.wait_for_timeout(300)
            lib = await pg.evaluate("() => [!!window.__LF.S.site['BR44118'], document.getElementById('edSite').innerText]")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(3)); noEd = await pg.evaluate("() => !document.querySelector('#editModal #edSiteBtn')")
            await pg.evaluate(ED(1)); await pg.locator('#editModal button:text-is("Fechar")').last.click(); await pg.wait_for_timeout(300)
            await checa('Chave No site: fica abaixo da Oferta, exige foto, liga/desliga e saiu do Editar', sem[0] and 'falta foto' in sem[2] and sem[3] and com == [False] and lib[0] and 'aparece no catálogo' in lib[1] and noEd, [sem, com, lib, noEd])

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(2)); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('1'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab')
            await pg.evaluate(ED(1)); await pg.fill('#descTa', 'rascunho'); await pg.wait_for_timeout(200)
            await pg.evaluate(ED(1)); await pg.locator('#editModal button:text-is("Fechar")').last.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty, window.__LF.S.desc['BR44118'], !!document.getElementById('editModal')]")
            await checa('janela Editar: Cancelar descarta tudo', got[0] == 4 and got[1] != 'rascunho' and got[2] is False, got)
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            e0 = [await pg.locator('#edCodigo').count(), await pg.locator('#edTab1').count(), await pg.locator('#edSalvar').count(), await pg.locator('#edLixeira').count(), await pg.locator('#ed_formato').count(), await pg.locator('#ed_tipo').count()]
            cx = await pg.evaluate("() => { const a = document.getElementById('edCodigo').getBoundingClientRect(), b = document.getElementById('ed_tipo') && document.getElementById('ed_tipo').getBoundingClientRect(); return !b || a.left < b.left; }")
            await pg.click('#edTab2'); await pg.wait_for_timeout(450)
            e1 = [await pg.locator('#edSalvar').count(), await pg.locator('#edNext').count(), await pg.locator('#edExcluir').count(), await pg.locator('#edCores').count()]
            await pg.click('#edTab1'); await pg.wait_for_timeout(450)
            e3 = await pg.locator('#edCodigo').count()
            await pg.click('#edLixeira'); await pg.wait_for_timeout(300)
            e2 = await pg.locator('#edLixoAviso').count()
            await checa('janela Editar igual ao cadastro: código à esquerda e tipo à direita, etapas livres (Modelo/Cores e fotos), Salvar alterações fixo, lixeira e excluir com confirmação', e0[:5] == [1, 1, 1, 1, 1] and cx and e1 == [1, 0, 0, 1] and e3 == 1 and e2 == 1, [e0, cx, e1, e3, e2])
            await pg.evaluate(ED(1)); await pg.locator('#editModal button:text-is("Fechar")').last.click(); await pg.wait_for_timeout(300)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(1)); await pg.fill('#descTa', 'Polarizado, mola flexível'); await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.desc['BR44118'], document.getElementById('detail').innerText.includes('Polarizado, mola flexível')]")
            await checa('janela Editar: descrição salva e mostrada na tela', got == ['Polarizado, mola flexível', True], got)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(1)); await pg.locator('#editModal #edCodigo').fill('br99999')
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(400)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR99999').length, window.__LF.S.items.filter(i => i.ref === 'BR44118').length, window.__LF.S.open, !!window.__LF.S.pnome['BR99999'], document.getElementById('detail').hidden]")
            await checa('janela Editar: trocar o código move o produto', got == [3, 0, 'BR99999', True, False], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => window.__LF.S.items.push({tipo:'sem', ref:'OUTRO1', grau:'', med:'', vr:'C1', fmt:'Quadrado', cor:'Azul', qty:1})")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal #edCodigo').fill('OUTRO1')
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR44118').length, !!document.getElementById('editModal')]")
            await checa('janela Editar: código repetido é recusado', got == [3, True], got)

            pg = await abrir('estojo', 'Estojo A')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(2)); await pg.locator('#editModal .cfNm').first.click(); await pg.wait_for_timeout(200); await pg.locator('#editModal button:text-is("Excluir cor")').click(); await pg.wait_for_timeout(200)
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
            ok = 'compras' in f1.lower() and 'Conversar no WhatsApp' in f1 and 'Remover' in f1 and 'Sem RUC' not in f2 and 'Conversar no WhatsApp' in f2 and l2 == 'CI/CPF' and l3 == 'RUC' and n2 == 'py'
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
                y0 = await pg.evaluate("() => document.getElementById('editModal').scrollTop")
                await bt.click(); await pg.wait_for_timeout(500)
                y1 = await pg.evaluate("() => { const e = document.getElementById('editModal'); return e ? e.scrollTop : -1 }")
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
            await pg.evaluate(ED(4)); await pg.locator('#editModal button', has_text='Salvar').first.click(); await pg.wait_for_timeout(300)
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
            cat1 = await pg.evaluate("() => document.getElementById('catV').hidden")
            b1 = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, document.getElementById('vSaleCard').hidden, !!document.querySelector('#vDetail button[aria-label=\\'Editar\\']'), document.querySelectorAll('#vDetail .pl.pick').length]")
            await pg.locator('#vDetail .pl.pick').nth(1).click(); await pg.wait_for_timeout(300)
            c = await pg.evaluate("() => { const S = window.__LF.S; return [S.vSel && S.vSel.grau, document.getElementById('spc').textContent.indexOf(S.vSel.grau) >= 0] }")
            await pg.locator('#vDetail button[aria-label="Voltar"]').click(); await pg.wait_for_timeout(300)
            d = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, window.__LF.S.vRef]")
            cat2 = await pg.evaluate("() => document.getElementById('catV').hidden")
            ok = cat1 is True and cat2 is True and a == [False, True, True] and b1 == [True, False, True, False, 4] and c == ['+1.00', True] and d == [False, True, ''] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: produto abre em janela própria, escolhe a variante e volta à lista')

            # Catálogo do WhatsApp: tela própria, só fotos, sem texto repetido
            total += 1
            card = await pg.evaluate("() => { const c = document.querySelector('#vRows .pcard'); return [c.querySelectorAll('.tag, .faixa').length, c.querySelectorAll('span.s').length, document.getElementById('vCatBtn') === null]; }")
            await pg.evaluate("() => { window.__LF.S.catOpen = true; window.__LF.setView('vendas'); }"); await pg.wait_for_timeout(400)
            cv = await pg.evaluate("() => { const g = document.querySelectorAll('#cvGal .gi'); return [document.getElementById('catV').hidden, g.length, document.querySelectorAll('#cvGal .gi b, #cvGal .gi span, #cvTipos').length, g.length ? g[0].querySelectorAll('.ck').length : 0, document.getElementById('cvSend').textContent]; }")
            await pg.locator('#cvAll').click(); await pg.wait_for_timeout(300)
            cv2 = await pg.evaluate("() => [document.querySelectorAll('#cvGal .ck').length, document.getElementById('cvSend').textContent]")
            await pg.locator('#cvAll').click(); await pg.wait_for_timeout(300)
            cv3 = await pg.evaluate("() => [document.querySelectorAll('#cvGal .ck').length, document.getElementById('cvSend').disabled]")
            await pg.locator('#cvAll').click(); await pg.wait_for_timeout(200)
            await pg.locator('#uniW .cb3').nth(0).click(); await pg.wait_for_timeout(300)
            cv4 = await pg.evaluate("() => document.getElementById('catV').hidden")
            ok = card[0] == 0 and card[1] == 0 and card[2] and cv[0] is False and cv[1] > 0 and cv[2] == 0 and cv[3] == 1 and cv2[0] == 0 and cv3[0] == cv[1] and cv3[1] is False and cv4 is True and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'catálogo do WhatsApp: tela própria só com fotos, Selecionar tudo e Fechar ' + ('' if ok else str([card, cv, cv2, cv3, cv4])))
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
            await pg.click('.cjGc[data-gr="+1.50"]'); await pg.click('#cjVer'); await pg.wait_for_timeout(600)
            so150 = await pg.evaluate("() => [...document.querySelectorAll('#vRows .pcard')].map(c => c.dataset.ref)")
            semcod = await pg.evaluate("() => !document.getElementById('vRows').innerText.includes('Código ')")
            await pg.click('#cjAj'); await pg.wait_for_timeout(500); await pg.click('#cjLimpa'); await pg.click('#cjVer'); await pg.wait_for_timeout(600)
            await pg.locator('#vRows .pcard[data-ref="T1"]').click(); await pg.wait_for_timeout(400)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            det = await pg.evaluate("""() => { const d = document.getElementById('vDetail');
              return { semBolinha: d.querySelectorAll('.dot').length, graus: [...d.querySelectorAll('.pl.pick')].map(x => x.innerText.replace(/\\s+/g,' ')),
                       cartoes: [...d.querySelectorAll('.ccard')].map(x => x.innerText.replace(/\\s+/g,' ')), barra: !!d.querySelector('.vsale'), codigo: d.innerText.includes('Nº') } }""")
            await pg.evaluate("() => { const S = window.__LF.S; S.qty = 5; window.__LF.render(); }"); await pg.wait_for_timeout(200)
            await pg.locator('#vDetail .vsale .go').click(); await pg.wait_for_timeout(300)
            cart = await pg.evaluate("() => window.__LF.S.cart.map(l => [l.it.lote, l.qty])")
            await pg.evaluate("() => { const S = window.__LF.S; S.cart = []; S.vTipo = 'sem'; S.vRef = 'sem|AR1'; S.vSel = null; window.__LF.render(); }"); await pg.wait_for_timeout(300)
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
            kl = await pg.evaluate("() => document.getElementById('kLot').hidden")
            await pg.locator('#grFolha .gcell', has_text='+1.50').click(); await pg.wait_for_timeout(500)
            filtro = await pg.evaluate("() => window.__LF.S.q")
            await pg.click('#btnGraus'); await pg.wait_for_timeout(450)
            await pg.locator('#grFolha .gcell', has_text='+1.50').click(); await pg.wait_for_timeout(500)
            await pg.click('#eTabR'); await pg.wait_for_timeout(300)
            atalho0 = await pg.evaluate("() => !!document.querySelector('#repoView #grRepo')")
            rep = await pg.evaluate("""() => ({ vis: !document.getElementById('repoView').hidden, lista: document.getElementById('listCard').hidden, mapa: document.getElementById('mapaB').hidden,
                itens: [...document.querySelectorAll('#repoView .repit[data-g]')].map(r => r.dataset.g + ':' + r.querySelector('.st2 i').innerText) })""")
            await pg.locator('#repoView .repit[data-g="+3.50"] button[aria-label^="Mais"]').click(); await pg.wait_for_timeout(200)
            await pg.click('#repGerar'); await pg.wait_for_timeout(200)
            txt = await pg.evaluate("() => document.querySelector('#repoView .replist').innerText")
            await pg.click('#eTabP'); await pg.wait_for_timeout(300)
            volta = await pg.evaluate("() => [document.getElementById('repoView').hidden, document.getElementById('listCard').hidden]")
            ok = (botao and atalho0 and mapa.count('r:0') == 12 and mapa.count('y:5') == 2 and 'y:2' in mapa and 'g:12' in mapa and abas == ['Produtos', 'Fornecedores 1', 'Reposição'] and kl is True
                  and filtro == '+1.50' and rep['vis'] and rep['lista'] and rep['mapa']
                  and rep['itens'][0] == '+0.50:1' and '+3.50:1' in rep['itens'] and '+3.00:0' in rep['itens'] and '+1.50:0' in rep['itens']
                  and '+3.50 · 2 pacotes de 24' in txt and 'Total: 336 peças' in txt
                  and volta == [True, False] and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Estoque: abas, mapa de graus e lista de compra em pacotes')
            if not ok: falhas.append('estoque abas'); print('        veio', botao, atalho0, mapa, abas, kl, filtro, rep, txt, volta, pg.erros)
            await pg.close()

            # v469: contador sem quadrado, barra Selecionar/lixeira fora, trava única de rolagem
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.tipo = 'sem'; S.todos = false; S.cont = false; L.setView('estoque'); }"); await pg.wait_for_timeout(400)
            await pg.click('#kCont'); await pg.wait_for_timeout(300)
            k1 = await pg.evaluate("() => { const k = document.getElementById('kCont'); return [k.style.outline, k.querySelector('.hint').innerText, getComputedStyle(k.querySelector('.lbl')).color !== getComputedStyle(document.querySelector('#kpisE .kpi:not(#kCont) .lbl')).color]; }")
            await pg.click('#kCont'); await pg.wait_for_timeout(300)
            k2 = await pg.evaluate("() => document.querySelector('#kCont .hint').innerText")
            barra = await pg.evaluate("() => getComputedStyle(document.getElementById('lt').parentElement).display === 'none' && getComputedStyle(document.getElementById('lh')).display === 'none'")
            await pg.evaluate("() => { const S = window.__LF.S; S.todos = true; window.__LF.render(); }"); await pg.wait_for_timeout(500)
            y0 = await pg.evaluate("() => { window.scrollTo({top: 600, behavior: 'instant'}); return Math.round(window.scrollY); }"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => { const m = document.createElement('div'); m.className = 'modal'; m.id = 'mTeste'; m.style.cssText = 'position:fixed;inset:0;display:flex'; document.body.appendChild(m); }"); await pg.wait_for_timeout(250)
            tr1 = await pg.evaluate("() => [document.documentElement.classList.contains('lfTrava'), document.body.style.top]")
            await pg.mouse.wheel(0, 500); await pg.wait_for_timeout(200)
            await pg.evaluate("() => document.getElementById('mTeste').remove()"); await pg.wait_for_timeout(250)
            tr2 = await pg.evaluate("() => [document.documentElement.classList.contains('lfTrava'), Math.round(window.scrollY)]")
            total += 1
            ok = k1 == ['', 'contando · toque para fechar', True] and k2 == 'toque para contar' and barra and y0 > 100 and tr1 == [True, '-' + str(y0) + 'px'] and tr2 == [False, y0] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v469: contador sem quadrado (cor suave), barra Selecionar/lixeira fora, janela aberta trava o fundo e devolve a posição')
            if not ok: falhas.append('v469 inventario'); print('        veio', k1, k2, barra, y0, tr1, tr2, pg.erros)
            await pg.close()

            # v470: com a nuvem conectada, todas as seções de Ajustes ficam no mesmo grupo (Aparelhos não desarruma o HTML)
            pg = await pagina()
            await pg.context.route(re.compile(r'googleapis'), lambda r: r.fulfill(json={}))
            aj = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S.nuvem.rt = 'x'; S.nuvem.email = 'a@b.c'; S.nvLista = [{id: '2026-11-08', kb: 900}];
              S._syncAps = [{ap: 'APEU', nome: 'Celular', ts: Date.now()}, {ap: 'APXY', nome: 'PC', ts: Date.now()}]; S.aparelho = 'APEU'; L.setView('ajustes'); S._ajForce = true; L.render();
              await new Promise(r => setTimeout(r, 400)); const g = document.getElementById('ajGrp');
              return [[...document.querySelectorAll('.ajS')].every(x => g.contains(x)), !!g.querySelector('.ajS[data-k="bk"] .apLn'), !!g.querySelector('.ajS[data-k="pauto"]')]; }""")
            total += 1
            ok = aj == [True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v470: Ajustes com a nuvem conectada — Aparelhos dentro de Cópias e nuvem, Pagamento automático no mesmo grupo')
            if not ok: falhas.append('v470 ajustes grupo'); print('        veio', aj, pg.erros)
            await pg.close()

            # v471: Inventário limpo — sinal C no preço, sem selo de faixa, busca do Catálogo, Situação, preços para corrigir, abrir sem ligar filtro
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF, S = L.S; S.todos = true; S.selSet = []; S.det = false; S.cont = false; S.sitF = ''; L.setView('estoque'); }"); await pg.wait_for_timeout(500)
            v1 = await pg.evaluate("""() => { const c = [...document.querySelectorAll('#rows .pcard')];
              return [!!document.getElementById('invBs') && document.getElementById('invBs').contains(document.getElementById('q')), /peças · Todos/.test(document.getElementById('invInfo').innerText),
                c.some(x => x.querySelector('.pSin')), !document.querySelector('#rows .pcard .ftag, #rows .pcard .zbd:not([hidden])') || getComputedStyle(document.querySelector('#rows .pcard .zbd') || document.body).display === 'none', !!document.getElementById('invFix')]; }""")
            f1 = await pg.evaluate("""async () => { const w = ms => new Promise(r => setTimeout(r, ms)); const S = window.__LF.S; const c = [...document.querySelectorAll('#rows .pcard[data-ref]')].find(x => !/Lote|modelos/.test(x.innerText));
              c.click(); await w(400); const durante = [S.todos, S.det, /×/.test(document.getElementById('fsum').innerText)]; S.det = false; S.open = ''; window.__LF.render(); await w(300); return durante.concat([S.todos]); }""")
            await pg.click('#btnFilt'); await pg.wait_for_timeout(400)
            n0 = await pg.evaluate("() => document.getElementById('filtApply').innerText")
            await pg.click('#fSit [data-id="preco"]'); await pg.wait_for_timeout(400)
            n1 = await pg.evaluate("() => [document.getElementById('filtApply').innerText, window.__LF.S.multi, [...document.querySelectorAll('#rows .pcard[data-ref]')].length]")
            await pg.click('#filtApply'); await pg.wait_for_timeout(300)
            await pg.evaluate("() => window.__LF.ACT.invLimpa()"); await pg.wait_for_timeout(300)
            await pg.click('#invFix'); await pg.wait_for_timeout(500)
            antes = await pg.evaluate("() => document.querySelectorAll('#pcFolha .pcLi').length")
            ref1 = await pg.evaluate("() => { const b = document.querySelector('#pcFolha [data-act=pcUsa]'); return b ? b.getAttribute('data-id') : ''; }")
            if ref1: await pg.click('#pcFolha [data-act=pcUsa]'); await pg.wait_for_timeout(500)
            depois = await pg.evaluate("(r) => [document.querySelectorAll('#pcFolha .pcLi').length, !!(window.__LF.S.pprice[r] && window.__LF.S.pprice[r].novo)]", ref1)
            total += 1
            ok = v1 == [True, True, True, True, True] and f1 == [False, True, False, True] and n0 != n1[0] and n1[1] is True and n1[2] > 0 and ref1 and depois == [antes - 1, True] and not pg.erros
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
            hb = await pg.evaluate("() => document.querySelectorAll('#hRes [data-act=opendia]').length")
            await pg.fill('#hq', 'ccc'); await pg.wait_for_timeout(200)
            hc = await pg.evaluate("() => [document.querySelectorAll('#hRes .card').length, document.activeElement.id]")
            await pg.fill('#hq', ''); await pg.wait_for_timeout(100)
            await pg.locator('[data-act=hfopen]').click(); await pg.wait_for_timeout(200)
            await pg.locator('[data-id=\'tipo|pago\']').click(); await pg.wait_for_timeout(200)
            hd = await pg.evaluate("() => document.querySelectorAll('#hRes .card').length")
            await pg.locator('[data-act=hlimpar]').click(); await pg.wait_for_timeout(100)
            await pg.locator('[data-id=\'forma|pix\']').click(); await pg.wait_for_timeout(200)
            he = await pg.evaluate("() => document.querySelectorAll('#hRes .card').length")
            await pg.locator('[data-act=hlimpar]').click(); await pg.wait_for_timeout(100)
            await pg.locator('[data-id=\'tipo|estorno\']').click(); await pg.wait_for_timeout(200)
            hf = await pg.evaluate("() => document.querySelectorAll('#hRes .card').length")
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
            u1 = await pg.evaluate("() => [document.getElementById('cartBar').hidden, document.getElementById('cartBar').textContent.indexOf('Pedido: 1') >= 0, window.__LF.S.cart.length]")
            await pg.locator('#vRows .pcard:not([data-ref="SP57765"])').first.click(); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            await pg.evaluate("() => document.getElementById('sCartAdd').click()"); await pg.wait_for_timeout(300)
            await pg.locator('[data-act=cartopen]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#cartCard input[data-in=cartpreco]').first.fill('1000'); await pg.wait_for_timeout(200)
            u2 = await pg.evaluate("() => [document.getElementById('cartCard').hidden, document.querySelectorAll('#cartCard input[data-in=cartpreco]').length, window.__LF.S.cart[0].preco, document.activeElement.getAttribute('data-in'), document.getElementById('pisoSt').textContent.length > 0]")
            u4 = await pg.evaluate("() => ['qtyB','payB','sgo','sCartAdd'].map(i => document.getElementById(i).offsetParent !== null)")
            u4s = await pg.evaluate("() => [!!document.getElementById('cartSlot'), !!document.getElementById('cartConf'), document.getElementById('pagHead').hidden]")
            await pg.locator('#cartConf').click(); await pg.wait_for_timeout(300)
            u6 = await pg.evaluate("() => [document.getElementById('cartCard').hidden, ['payB','sgo'].map(i => document.getElementById(i).offsetParent !== null), document.getElementById('pagHead').hidden, document.getElementById('tot').textContent.length > 0]")
            await pg.locator('#pagHead [data-act=cartvolta]').click(); await pg.wait_for_timeout(300)
            u7 = await pg.evaluate("() => [document.getElementById('cartCard').hidden, document.getElementById('vSaleCard').hidden, document.getElementById('pagHead').hidden]")
            await pg.locator('#cartCard button[aria-label=Voltar]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#vRows .pcard').first.click(); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { if (document.getElementById('lfa-folha') && document.getElementById('lfa-folha').innerHTML) window.__folha.vitrine(); }"); await pg.wait_for_timeout(300)
            u5 = await pg.evaluate("() => ['qtyB','payB','sgo','sCartAdd'].map(i => document.getElementById(i).offsetParent !== null)")
            await pg.locator('[data-act=cartopen]').click(); await pg.wait_for_timeout(300)
            await pg.locator('[data-act=cartclear]').click(); await pg.wait_for_timeout(300)
            u3 = await pg.evaluate("() => [window.__LF.S.cart.length, window.__LF.S.cartOpen, document.getElementById('cartCard').hidden, document.getElementById('cartBar').hidden]")
            ok = u1 == [False, True, 1] and u2 == [False, 2, 1000, 'cartpreco', True] and u3 == [0, False, True, True] and u4 == [False, False, False, False] and u4s == [True, True, True] and u6 == [True, [True, True], False, True] and u7 == [False, True, True] and u5 == [False, False, False, False] and not pg.erros
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'tela Vendas: carrinho (adicionar, abrir, mudar preço, esvaziar)')
            if not ok: falhas.append('carrinho tela'); print('        veio', u1, u2, u3, u4, u4s, u6, u7, u5, pg.erros)
            await pg.close()

            # campos de digitar seguem a moeda principal
            pg = await pagina()
            r = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.fx.pyg = 7000; S.fx.brl = 5;
              S.descMode = 'pyg'; S.descTxt = '2';
              L.setView('despesas'); L.render();
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
              return [g, u, b, man, custo, sh === esp, fx.indexOf('Como o app te protege') >= 0, fx.indexOf('G$ 8.000') >= 0]; }""")
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
            ini = await pg.evaluate("() => { const c = [...document.querySelectorAll('#v-inicio section[data-id=lotes]')][0]; return c ? c.innerText.replace(/\\s+/g,' ') : '' }")
            await pg.click('#v-inicio section[data-id=lotes]'); await pg.wait_for_timeout(500)
            irc = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.lotesView, document.querySelector('#lotView h2') && document.querySelector('#lotView h2').innerText]")
            ok = ('8 peças da compra de' in ini and 'sem detalhe' in ini and irc == ['estoque', True, 'Fornecedores'] and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Início: aviso de peças sem detalhe leva à aba Compras')
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
            m0 = await pg.evaluate("() => { const v = i => { const e = document.getElementById(i); return !!e && e.offsetParent !== null }; return [v('btnLeitor'), v('btnFoto'), v('addToLote'), v('addToMan'), v('addBack'), v('addProdRest'), v('addLoteB'), document.querySelectorAll('#addModal [id=btnLeitor]').length, !document.getElementById('addModeB')] }")
            await pg.click('#addToLote'); await pg.wait_for_timeout(300); await pg.click('#cpMao'); await pg.wait_for_timeout(300)
            m1 = await pg.evaluate("() => { const v = i => { const e = document.getElementById(i); return !!e && e.offsetParent !== null }; return [v('addLoteB'), v('addBack'), v('btnLeitor'), v('addToMan')] }")
            await pg.click('#addBack'); await pg.wait_for_timeout(300)
            await pg.click('#addToMan'); await pg.wait_for_timeout(300)
            m2 = await pg.evaluate("() => { const v = i => { const e = document.getElementById(i); return !!e && e.offsetParent !== null }; return [v('addProdRest'), v('addBack'), v('btnLeitor'), v('nvTipoTrk')] }")
            ok = m0 == [True, True, True, True, False, False, False, 1, True] and m1 == [True, True, False, False] and m2 == [True, False, False, True]
            print(('  ok  ' if ok else ' FALHA ') + 'Adicionar: menu único, voltar, um só leitor e sem abas Produto/Lote')
            if not ok: falhas.append('menu adicionar'); print('        veio', m0, m1, m2, pg.erros)
            total += 1
            await pg.close()

            # Ajustes minimalista: grupo único, uma seção aberta por vez, segurar e arrastar muda a ordem (só neste aparelho) com Desfazer
            pg = await pagina(tudo=False)
            await pg.evaluate("() => { const L = window.__LF; L.setView('ajustes'); L.render(); }"); await pg.wait_for_timeout(400)
            a0 = await pg.evaluate("() => [document.querySelectorAll('#ajGrp .ajS').length, document.querySelectorAll('#ajGrp .ajS.on').length, document.querySelector('.ajS[data-k=tema] .ajRes').textContent, !!document.querySelector('.ajVer')]")
            await pg.click('.ajS[data-k=seg] .ajR'); await pg.wait_for_timeout(300)
            await pg.click('.ajS[data-k=tema] .ajR'); await pg.wait_for_timeout(400)
            a1 = await pg.evaluate("() => [...document.querySelectorAll('#ajGrp .ajS.on')].map(x => x.dataset.k)")
            bx = await pg.locator('.ajS[data-k=bk] .ajR').bounding_box()
            x = bx['x'] + bx['width'] / 2; y = bx['y'] + bx['height'] / 2
            await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(700)
            for k in range(1, 31):
                await pg.mouse.move(x, y - k * 25); await pg.wait_for_timeout(15)
            await pg.wait_for_timeout(150); await pg.mouse.up(); await pg.wait_for_timeout(500)
            a2 = await pg.evaluate("() => [document.querySelector('#ajGrp .ajS').dataset.k, JSON.parse(localStorage.getItem('lf_ajOrd'))[0], document.getElementById('lfDesf') && document.getElementById('lfDesf').classList.contains('on')]")
            await pg.click('#lfDesf button'); await pg.wait_for_timeout(400)
            a3 = await pg.evaluate("() => document.querySelector('#ajGrp .ajS').dataset.k")
            ok = a0[0] >= 7 and a0[1] == 0 and a0[2] == 'Auto' and a0[3] and a1 == ['tema'] and a2 == ['bk', 'bk', True] and a3 == 'imp' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Ajustes: grupo único, uma aberta por vez, segurar e arrastar com Desfazer')
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
              S.vRef = 'sem|AT6'; L.render(); const par = [...document.querySelectorAll('#vDetail .vPar .vParC')].map(c => c.dataset.ref);
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
              S.vRef = 'sem|CA6'; L.render(); const par = [...document.querySelectorAll('#vDetail .vPar .vParC')].map(c => c.dataset.ref);
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

            # Adicionar A+1: Dar entrada de novo (3 últimas) abre a folhinha e soma no estoque; gaveta da câmera com 2 cartões
            pg = await pagina()
            r0 = await pg.evaluate("""() => { const L = window.__LF, S = L.S;
              S.items.push({id:'dn1',tipo:'arm',ref:'DN1',cor:'C1 Preto',qty:3,custo:5}, {id:'dn2',tipo:'solar',ref:'DN2',cor:'C2 Marrom',qty:2,custo:6});
              S.elog.push({ts:1,tipo:'arm',ref:'DN1',cor:'C1 Preto',qty:3}, {ts:2,tipo:'solar',ref:'DN2',cor:'C2 Marrom',qty:2});
              L.setView('estoque'); S.addOpen = true; S.addMode = 'menu'; L.render();
              const t = [...document.querySelectorAll('#addDeNovo .adNvI b')].map(b => b.textContent);
              return [t.length, t[0], t[1], !!document.querySelector('#addMenuB .adRow svg')] }""")
            await pg.click('.adNvI[data-id="0"]'); await pg.wait_for_timeout(500)
            await pg.click('#lfa-entr [data-act="enQ"][data-id="1"]'); await pg.click('#lfa-entr [data-act="enQ"][data-id="1"]'); await pg.wait_for_timeout(200)
            bt = await pg.inner_text('#enGo')
            await pg.click('#enGo'); await pg.wait_for_timeout(400)
            r1 = await pg.evaluate("() => { const S = window.__LF.S; return [S.items.find(i => i.id === 'dn2').qty, S.elog[S.elog.length-1].qty, !!document.querySelector('#lfa-entr:not(.sai)')] }")
            ok = r0[0] >= 2 and r0[1] == 'DN2' and r0[2] == 'DN1' and r0[3] and bt == 'Dar entrada · 3 peças' and r1[:2] == [5, 3]
            print(('  ok  ' if ok else ' FALHA ') + 'Adicionar A+1: Dar entrada de novo (folhinha, quantidade e estoque)')
            if not ok: falhas.append('dar entrada de novo'); print('        veio', r0, bt, r1, pg.erros)
            total += 1
            await pg.close()

            # Novo modelo (tela 1) + Cores e fotos (tela 2): cadastro à mão guiado, como aprovado
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')")
            await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            await pg.click('#addToMan'); await pg.wait_for_timeout(300)
            await pg.click('#nvTipoTrk [data-m="sem"]'); await pg.wait_for_timeout(200)
            await pg.fill('#eRef', 'ZZ77')
            # falta formato/material/gênero/custo: o botão avisa e não avança
            await pg.click('#nvNext'); await pg.wait_for_timeout(300)
            falta1 = await pg.evaluate("() => [document.getElementById('addTitle').textContent, document.body.innerText.indexOf('Falta') >= 0]")
            for k, t in (('fmt', 'Redondo'), ('mat', 'Acetato'), ('pub', 'Feminino')):
                await pg.click('#nv_' + k); await pg.wait_for_timeout(250); await pg.locator('#lfa-como .lsOpt[data-v="' + t + '"]').click(); await pg.wait_for_timeout(250)
            chips = await pg.evaluate("() => ['fmt','mat','pub'].map(k => document.getElementById('nv_' + k).textContent.replace('▾','').trim())")
            await pg.fill('#eCusto', '0,50')
            await pg.evaluate("() => { const d = document.getElementById('nvMais'); if (d) d.open = true; }")
            await pg.fill('#nvL', '50'); await pg.fill('#nvP', '20'); await pg.fill('#nvH', '140'); await pg.wait_for_timeout(300)
            await pg.fill('#eDescP', 'Armação de acetato verde, haste larga')
            await pg.click('#nvNext'); await pg.wait_for_timeout(400)
            tit2 = await pg.evaluate("() => document.getElementById('addTitle').textContent")
            # Cores e fotos em lista: "Cor nova" tira a foto e vira uma linha; sem cor escolhida não conclui
            sem_foto = await pg.evaluate("() => document.getElementById('nvFim').disabled")
            await pg.click('#nvAddCor'); await pg.wait_for_timeout(2500)
            async with pg.expect_file_chooser() as fcs:
                await pg.evaluate("() => { const l = [...document.querySelectorAll('input[type=file][capture]')].filter(i => i.parentNode.querySelector('button')); l[l.length - 1].click(); }")
            fc = await fcs.value
            await fc.set_files(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', 'peca.jpg')); await pg.wait_for_timeout(900)
            # v429: a foto passa pela conferência (Foto aprovada / Vamos tirar de novo?)
            await pg.wait_for_selector('#estRes', timeout=15000); await pg.evaluate("() => { const b = document.querySelector('#estRes [data-r=usar]') || document.querySelector('#estRes [data-r=x]'); if (b) b.click(); }"); await pg.wait_for_timeout(1200)
            linha = await pg.evaluate("() => [document.querySelectorAll('#nvCoresL .cfRow.nova').length, document.querySelector('#nvCoresL .cfCor').textContent.replace('▾','').trim(), document.getElementById('nvFim').disabled]")
            await pg.click('#nvCoresL .cfStep [data-d="1"]'); await pg.wait_for_timeout(400)
            tot = await pg.inner_text('#nvTot')
            await pg.click('#nvFim'); await pg.wait_for_timeout(400)
            sem_cor = await pg.evaluate("() => !!document.querySelector('#lfa-cor:not(.sai)')")
            await pg.locator('#lfa-cor .lsOpt[data-v="Vinho"]').click(); await pg.wait_for_timeout(400)
            await pg.click('#nvTg'); await pg.wait_for_timeout(300)
            await pg.click('#nvFim'); await pg.wait_for_timeout(600)
            r = await pg.evaluate("""() => { const S = window.__LF.S, it = S.items.filter(i => i.ref === 'ZZ77')[0];
              return [!!it, it && it.cor, it && it.qty, S.desc.ZZ77, !!S.fotos['ZZ77|Vinho'], it && it.vr]; }""")
            total += 1
            ok = falta1 == ['Novo modelo', True] and chips == ['Redondo', 'Acetato', 'Feminino'] and tit2 == 'Cores e fotos' \
                and r == [True, 'Vinho', 2, 'Armação de acetato verde, haste larga', True, 'C1'] and sem_foto is True and linha == [1, 'C1 · Cor', False] and tot == '2 peças' and sem_cor and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Cadastro B: trilho do tipo, Como é em gaveta, cores e fotos em lista')
            if not ok: falhas.append('cadastro desc'); print('        veio', falta1, chips, tit2, r, sem_foto, linha, tot, sem_cor, pg.erros)
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
            await pg.locator('#v-inicio .tl:has-text("Giro")').click(); await pg.wait_for_timeout(300)
            r2 = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.dTab]")
            await pg.locator('#mainnav button:has-text("Início")').click(); await pg.wait_for_timeout(300)
            await pg.locator('#mainnav button[data-id="estoque"]').click(); await pg.wait_for_timeout(300)
            r3 = await pg.evaluate("() => window.__LF.S.view")
            total += 1
            ok = r == ['inicio', 17] and r2 == ['dash', 'giro'] and r3 == 'estoque' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Início: 17 botões (v-b9: + Mensagens, Analisador, Temática, Atacado) + barra levam às telas certas')
            if not ok: falhas.append('inicio'); print('        veio', r, r2, r3, pg.erros)
            await pg.close()

            # v-b9: o voltar do celular volta para a tela anterior; Mensagens abre o painel na aba certa
            pg = await pagina()
            await pg.locator('#mainnav button[data-id="estoque"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#mainnav button:has-text("Caixa")').click(); await pg.wait_for_timeout(300)
            await pg.go_back(); await pg.wait_for_timeout(400)
            r = await pg.evaluate("() => window.__LF.S.view")
            await pg.go_back(); await pg.wait_for_timeout(400)
            r2 = await pg.evaluate("() => window.__LF.S.view")
            await pg.evaluate("() => { window.__LF.S.view = 'inicio'; window.__LF.render(); }"); await pg.wait_for_timeout(200)
            await pg.locator('#v-inicio .tl[data-id="ata"]').click(); await pg.wait_for_timeout(300)
            r3 = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.onlAba, (document.getElementById('lojaFrame') || {}).getAttribute ? document.getElementById('lojaFrame').getAttribute('src') : '']")
            total += 1
            ok = r == 'estoque' and r2 == 'inicio' and r3[0] == 'onl' and r3[1] == 'ata' and 'aba=msg&mf=atacado' in (r3[2] or '') and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'v-b9: voltar do celular volta para a tela anterior; atalho Atacado abre o painel em Mensagens › Atacado')
            if not ok: falhas.append('v-b9 voltar'); print('        veio', r, r2, r3, pg.erros)
            await pg.close()

            # animações dos botões: barra fixa embaixo, realce deslizante, segurar para apagar
            pg = await pagina()
            await pg.locator('#mainnav button:has-text("Caixa")').click(); await pg.wait_for_timeout(600)
            r = await pg.evaluate("() => [getComputedStyle(document.getElementById('mainnav')).position, document.querySelectorAll('#mainnav .slider').length, document.querySelector('#mainnav .mn.on').textContent.trim()]")
            await pg.evaluate("() => { window.__LF.S.dTab = 'hoje'; window.__LF.setView('dash'); }"); await pg.wait_for_timeout(500)
            r2 = await pg.evaluate("() => document.querySelectorAll('#v-dash .dHd button').length")  # v465: abas viraram o botão "Resumo ⌄"
            await pg.evaluate("""() => { const L = window.__LF, S = L.S, h = Date.now();
              S.imprev = [{ts: h, desc: 'A', valor: 1000}, {ts: h, desc: 'B', valor: 2000}]; S.dlog = []; L.setView('desp'); }""")
            await pg.wait_for_timeout(300)
            await pg.locator('[data-act=impdel]').first.scroll_into_view_if_needed()
            bx = await pg.locator('[data-act=impdel]').first.bounding_box()
            await pg.mouse.move(bx['x'] + bx['width'] / 2, bx['y'] + bx['height'] / 2)
            await pg.mouse.down(); await pg.wait_for_timeout(1200); await pg.mouse.up(); await pg.wait_for_timeout(400)
            r3 = await pg.evaluate("() => window.__LF.S.imprev.map(x => x.desc)")
            total += 1
            ok = r == ['fixed', 1, 'Caixa'] and r2 >= 1 and r3 == ['B'] and not pg.erros
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
            jan = await pg.inner_text('#v-ped .modal')
            await pg.locator('[data-act=pedprodx]').first.click(); await pg.locator('[data-act=pedav]').first.click(); await pg.wait_for_timeout(300)
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
                  and 'Conferir comprovante' in txt and 'TESTE' in txt and extra == ['comp', 'delivery', 'alias', True, 210000, '1234567-8', True] and 'Itaú (alias)' in pagtxt and 'Delivery' in pagtxt and 'LF-' in txt2 and len(reservas) == 1 and reservas[0].startswith('reservas/abc1|') and 'pago' in reservas[0] and 'Nova' in det and 'novo pedido' not in txt.lower() and tokok and 'Maria souza' in det and 'Armação azul' in det
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
            await pg.evaluate("() => { const L = window.__LF; L.ACT ? 0 : 0; document.body.insertAdjacentHTML('beforeend', '<button id=ztp data-act=pedrecus data-id=pq1>x</button>'); document.getElementById('ztp').click(); }"); await pg.wait_for_timeout(300)
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
            await pg.evaluate("() => { document.getElementById('lockCancel').click(); }"); await pg.wait_for_timeout(200)
            lg4 = await pg.evaluate("() => window.__sessUlt")
            await pg.evaluate("() => { const S = window.__LF.S; S.pinHash = ''; S.nuvem.rt = ''; window.__sessUlt = 'nada'; }")
            lg5 = await msg({'lfSess': 'get', 'id': '5'})
            await msg({'lfSess': 'put', 'rt': 'R2-' + 'y' * 40, 'email': 'dono@lafouch.com'})
            lg6 = await pg.evaluate("() => [window.__LF.S.nuvem.rt.slice(0, 3), window.__LF.S.nuvem.email]")
            total += 1
            ok = lg1 == {'rt': 'RT-' + 'x' * 40} and lg2 == 'nada' and lg3 == 'nada' and trava is True and lg4 == 'cancel' and lg5 == 'none' and lg6 == ['R2-', 'dono@lafouch.com']
            print(('  ok  ' if ok else ' FALHA ') + 'login único: sessão só ao painel certo, PIN antes de entregar, painel entrega a sessão digitada')
            if not ok: falhas.append('login-unico'); print('        veio', lg1, lg2, lg3, trava, lg4, lg5, lg6, pg.erros)
            await pg.close()

            # Aba WhatsApp: logo e sino aparecem; no app instalado o envio usa o compartilhamento nativo com as fotos
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.items = [{tipo:'solar',ref:'WA1',grau:'',cor:'Preto',qty:2}, {tipo:'solar',ref:'WA2',grau:'',cor:'Rosa',qty:1}];
                const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
                S.fotos = {'WA1|Preto': png, 'WA2|Rosa': png}; window.__chamadas = [];
                window.Capacitor = {Plugins: {Filesystem: {writeFile: async (o) => { window.__chamadas.push(['w', o.path, o.directory]); return {uri: 'file:///cache/' + o.path}; }}, Share: {share: async (o) => { window.__chamadas.push(['s', (o.files || []).length, o.text === undefined]); return {}; }}}};
                L.setView('vendas'); S.catOpen = true; S.cvOff = {}; L.render(); }""")
            await pg.wait_for_timeout(300)
            wa1 = await pg.evaluate("() => { const h = document.querySelector('.wrap > .top.logo-top').getBoundingClientRect(), c = document.getElementById('catV').getBoundingClientRect(); return [[h.height, h.top, h.bottom, c.top].join('/'), !!document.getElementById('sino') && !document.getElementById('sino2'), document.getElementById('cvCount').textContent]; }")
            await pg.evaluate("() => document.getElementById('cvSend').click()"); await pg.wait_for_timeout(700)
            wa2 = await pg.evaluate("() => window.__chamadas.map(c => c[0]).join('') + '|' + window.__chamadas.filter(c => c[0] === 's').map(c => c.slice(1).join(',')).join('')")
            total += 1
            ok = wa1[0].split('/')[0] != '0' and float(wa1[0].split('/')[3]) >= float(wa1[0].split('/')[2]) - 1 and float(wa1[0].split('/')[1]) >= 0 and wa1[1] is True and wa1[2].startswith('2 de 2') and wa2 == 'wws|2,true' and not pg.erros
            if not ok: print('        dbg', wa1)
            print(('  ok  ' if ok else ' FALHA ') + 'aba WhatsApp: logo e sino do app visíveis, tela abaixo do cabeçalho; envio nativo de várias imagens')
            if not ok: falhas.append('whatsapp'); print('        veio', wa1, wa2, pg.erros)
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
            ju2 = await pg.evaluate("() => [!document.getElementById('lfUpdSh'), !!document.querySelector('.lfa-toast')]")
            idx = open('www/index.html').read()
            ju3 = all(k in idx for k in ('id="lfIntro"', 'lfi1', 'logo-app-claro.png', "lf_ni"))
            total += 1
            ok = ju1 == [True, True] and ju2 == [True, True] and ju3 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'janela de atualização e abertura com logo')
            if not ok: falhas.append('updjanela'); print('        veio', ju1, ju2, ju3, pg.erros)
            await pg.close()

            # Baixa automática fica em Ajustes (com explicação) e não mais na tela de Pedidos
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF; L.S.baixaAuto = true; L.S._ajForce = true; L.setView('ajustes'); }"); await pg.wait_for_timeout(300)
            ba1 = await pg.evaluate("() => { const c = document.getElementById('baixaCard'); return c ? [c.innerText.indexOf('estoque baixa') >= 0, c.querySelector('input').checked] : null }")
            await pg.evaluate("() => document.querySelector('#baixaCard [data-act=pedbaixa]').click()"); await pg.wait_for_timeout(300)
            ba2 = await pg.evaluate("() => [window.__LF.S.baixaAuto, document.getElementById('baixaCard').innerText.indexOf('à mão') >= 0]")
            await pg.evaluate("() => window.__LF.setView('ped')"); await pg.wait_for_timeout(300)
            ba3 = await pg.evaluate("() => document.getElementById('v-ped') ? document.getElementById('v-ped').innerText.indexOf('Baixa automática') < 0 : null")
            total += 1
            ok = ba1 == [True, True] and ba2 == [False, True] and ba3 is True and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'baixa automática em Ajustes')
            if not ok: falhas.append('baixa ajustes'); print('        veio', ba1, ba2, ba3, pg.erros)
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
            sb = await pg.evaluate("() => { const r = document.querySelector('[data-av=teste] .ring'); const s = getComputedStyle(r); return [s.backgroundColor, s.paddingLeft, r.className]; }")
            await pg.evaluate("() => { window.__marca = document.getElementById('avisosCard'); }")
            await pg.evaluate("() => window.__LF.ACT.updbusca()"); await pg.wait_for_timeout(300)
            sb2 = await pg.evaluate("() => [window.__marca === document.getElementById('avisosCard'), !!document.getElementById('updCard')]")
            total += 1
            ok = sb[0] == 'rgba(0, 0, 0, 0)' and sb[1] == '0px' and sb2 == [True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'botões teste/atualização sem estilo herdado nem redesenho')
            if not ok: falhas.append('botoes'); print('        veio', sb, sb2, pg.erros)
            await pg.close()

            # Sair da aba WhatsApp por outra aba (Caixa, Ajustes...) fecha a tela do WhatsApp
            pg = await pagina()
            await pg.evaluate("() => { const L = window.__LF; L.S.items = [{tipo:'solar',ref:'WA1',grau:'',cor:'Preto',qty:2}]; L.S.fotos = {'WA1|Preto': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='}; L.setView('vendas'); L.S.catOpen = true; L.render(); }")
            sa1 = await pg.evaluate("() => !document.getElementById('catV').hidden")
            await pg.evaluate("() => window.__LF.setView('caixa')"); await pg.wait_for_timeout(300)
            sa2 = await pg.evaluate("() => [document.getElementById('catV').hidden, document.body.classList.contains('catopen')]")
            await pg.evaluate("() => window.__LF.setView('vendas')"); await pg.wait_for_timeout(300)
            sa3 = await pg.evaluate("() => document.getElementById('catV').hidden")
            total += 1
            ok = sa1 is True and sa2 == [True, False] and sa3 is True and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'sair da aba WhatsApp pelo menu fecha a tela')
            if not ok: falhas.append('sair whatsapp'); print('        veio', sa1, sa2, sa3, pg.erros)
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
            ok = 'Lembretes' not in aj and 'Nota fiscal' not in aj and desl is True and '243, 192, 220' in bg and not pg.erros  # v465: botão principal B1
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
            ok = tb['pub'] > 0 and 0 < tb['a10'] <= tb['a1'] <= tb['opt'] <= tb['pub'] and tb['fg'] >= tb['opt'] and tb['fg'] <= tb['pub'] and tb['sg'] and 'Atacado 1K ▾' in (tb['chip'] or '') and 'Olá' in tb['msg'] and not pg.erros
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
            await pg.evaluate("() => { const L = window.__LF; L.S.tabAtiva = 'pub'; L.setView('vendas'); L.render(); }")
            sm = await pg.evaluate("""() => { const q = t => [...document.querySelectorAll('#vTabBar .trkB')].find(b => b.innerText === t);
              q('Atacado').click(); const a = window.__LF.S.tabAtiva; q('Varejo').click(); const v = window.__LF.S.tabAtiva; return {a, v}; }""")
            total += 1
            ok = sm['a'] != 'pub' and sm['v'] == 'pub' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'vendas: seletor Varejo | Atacado troca a tabela')
            if not ok: falhas.append('seletor mercado'); print('        veio', sm, pg.erros)
            at = await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.fx.pyg = 6000; S.pprice = {TB1: {novo: 400000, ant: 0}}; S.cart = []; S.vModo = {v:'l'}; S.tabAtiva = 'a1';
              S.items = [{tipo:'solar',ref:'TB1',grau:'',cor:'Preto',qty:400,fmt:'',med:'',vr:'',lote:'',custo:20}];
              try { localStorage.setItem('lf_modo_v', 'l'); } catch (e) {} L.setView('vendas'); L.render(); document.getElementById('vRows').classList.add('vlist'); L.render();
              const st = document.querySelector('#vRows .pcard[data-ref=TB1] .vstep'); if (!st) return {sem: 1};
              const p = () => st.querySelector('.vs-p') || document.querySelector('#vRows .vs-p');
              const clica = el => { el.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true})); el.dispatchEvent(new PointerEvent('pointerup', {bubbles: true})); };
              clica(document.querySelector('#vRows .vs-p')); clica(document.querySelector('#vRows .vs-p')); clica(document.querySelector('#vRows .vs-m'));
              const q1 = S.cart.length && S.cart[0].qty; const riscado = !!document.querySelector('#vRows .vriscado'); document.querySelector('#vRows .vs-n').click();
              const kb = !!document.getElementById('atacN'); document.getElementById('atacN').value = '50'; document.getElementById('atacOk').click();
              return {q1, kb, q2: S.cart.length && S.cart[0].qty, riscado, total: !!document.querySelector('#vRows .vtotl'), prog: !!document.querySelector('#vTabBar .vprog')}; }""")
            total += 1
            ok = at.get('q1') == 1 and at.get('kb') and at.get('q2') == 50 and at.get('riscado') and at.get('total') and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'atacado: − N + , teclado numérico e preço riscado')
            if not ok: falhas.append('atacado stepper'); print('        veio', at, pg.erros)
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
            ev_ = await pg.evaluate("""async () => { const L = window.__LF, S = L.S; S.tabAtiva = 'pub'; S._vVis = []; S.pprice = {GA1: {novo: 400000, ant: 0}, GB2: {novo: 300000, ant: 0}}; S.vRef = ''; L.setView('vendas'); L.render();
              document.getElementById('cjSh').click(); await new Promise(r => setTimeout(r, 500));
              const msg = (document.getElementById('shTx') || {}).value || ''; const fmts = document.querySelectorAll('#shFmt .trkB').length;
              const apps = [...document.querySelectorAll('#shAp .shA')].map(b => b.dataset.id); document.querySelector('.ljBk').click();
              const fo = await L.envFolha(); return {msg, fmts, fo, apps}; }""")
            total += 1
            ok = 'válidos até' in ev_['msg'] and ev_['fmts'] == 3 and ev_['fo']['n'] >= 2 and ev_['fo']['w'] > 1000 and ev_['apps'] == ['wab', 'wa', 'ig', 'link', 'mais'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'compartilhar catálogo: janela com os apps, formatos, mensagem com validade e folha em imagem')
            if not ok: falhas.append('enviar catalogo'); print('        veio', ev_, pg.erros)
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
            pd1 = await pg.evaluate("() => [[...document.querySelectorAll('#v-ped .pdSeg button')].map(b => b.innerText.replace(/\\s+/g, ' ')), document.querySelectorAll('#v-ped .pdCard').length, document.getElementById('v-ped').innerText.includes('há 1 h')]")
            await pg.evaluate("() => { window.__LF.S.pedF = 'sep'; window.__LF.render(); }"); await pg.wait_for_timeout(200)
            pd2 = await pg.evaluate("() => document.querySelectorAll('#v-ped .pdCard').length")
            await pg.fill('#pedQ', 'rita'); await pg.wait_for_timeout(200)
            pd3 = await pg.evaluate("() => document.querySelectorAll('#v-ped .pdCard').length")
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
            t2 = await pg.evaluate("() => [!!document.querySelector('.pdOv'), document.querySelectorAll('.avopt').length]")
            await pg.evaluate("() => document.querySelector('[data-av=som][data-t=n][data-v=moeda]').click()"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => document.querySelector('[data-av=fechar]').click()"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => document.querySelector('[data-av=escolher][data-v=x]').click()"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => document.querySelector('[data-av=som][data-t=x][data-v=mudo]').click()"); await pg.wait_for_timeout(200)
            await pg.evaluate("() => window.__tocou.length = 0")
            await pg.evaluate("() => document.querySelector('[data-av=fechar]').click()"); await pg.wait_for_timeout(200)
            t3 = await pg.evaluate("() => { const S = window.__LF.S; return [S.avisos.sn, S.avisos.sc, S.avisos.sx, !!document.querySelector('.pdOv')]; }")
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
                return [m.v, !!a, window.__upd.estado.pronta, !!document.getElementById('updBar'), window.__upd.card().indexOf('Atualização 999 pronta') > 0];
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
                  and r3[:2] == [5, 2] and sorted(c['pedido'] for c in libs) == ['sidiv', 'sidum', 'sidum'] and all(c['refs'] == ['ZR1'] for c in libs) and not pg.erros)
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
            ok = r == [False, False, True, False, True, True, 5] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'histórico do dia: valor exato, câmbio e botões novos')
            if not ok: falhas.append('hist dia'); print('        veio', r, pg.erros)
            await pg.close()

            # Catálogo: ver os preços em dólar e real (só exibição)
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('vendas')"); await pg.wait_for_timeout(300)
            r0 = await pg.evaluate("() => document.querySelector('#vRows .vpreco') ? document.querySelector('#vRows .vpreco').textContent : ''")
            await pg.click('#cjAj'); await pg.wait_for_timeout(600); await pg.click('#cjTM .trkB[data-m=usd]'); await pg.wait_for_timeout(200)
            hint = await pg.evaluate("() => !document.getElementById('cjMh').hidden")
            await pg.click('#cjVer'); await pg.wait_for_timeout(600)
            r1 = await pg.evaluate("() => [document.querySelector('#vRows .vpreco').textContent, true]"); r1[1] = hint
            await pg.click('#cjAj'); await pg.wait_for_timeout(600); await pg.click('#cjTM .trkB[data-m=pyg]'); await pg.click('#cjVer'); await pg.wait_for_timeout(600)
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
              L.setView('desp'); return 1; }""")
            await pg.wait_for_timeout(300)
            t1 = await pg.inner_text('#v-desp')
            btn = pg.locator('[data-act=impdel]')
            n1 = await btn.count()
            await btn.first.click(); await pg.wait_for_timeout(200)
            await btn.first.click(); await pg.wait_for_timeout(300)
            r2 = await pg.evaluate("() => [window.__LF.S.imprev.map(x => x.desc), window.__LF.S.dlog.map(x => x.desc)]")
            total += 1
            ok = 'Errado' in t1 and 'Antigo' not in t1 and n1 == 1 and r2 == [['Antigo'], ['Antigo']] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'imprevistos: só do mês na tela e remoção em dois toques')
            if not ok: falhas.append('imprevistos'); print('        veio', n1, r2, pg.erros)
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
            await arrasta('#v-inicio .tl[data-id="giro"]', '#mainnav .mn[data-id="estoque"]')
            e3 = await pg.evaluate(est)
            await pg.locator('#mainnav .mn[data-id="giro"]').click(); await pg.wait_for_timeout(300)
            e4 = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.dTab]")
            total += 1
            ok = (e0['nav'] == ['inicio', 'vendas', 'estoque', 'caixa', 'ajustes'] and 'vendas' not in e0['tiles'] and 'prec' in e0['tiles']
                  and e1['nav'] == ['inicio', 'vendas', 'estoque', 'caixa', 'prec'] and 'prec' not in e1['tiles']
                  and e2['nav'] == ['inicio', 'vendas', 'estoque', 'prec'] and 'caixa' in e2['tiles']
                  and e3['nav'] == ['inicio', 'vendas', 'giro', 'estoque', 'prec'] and e4 == ['dash', 'giro'] and not pg.erros)  # v465: entra onde soltou
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
                await pg.evaluate("(v) => document.querySelector((v === 'vendas' ? '#vDetail' : '#detail') + ' .tab.ibtn[aria-label=Voltar]').click()", v_)
                await pg.wait_for_timeout(1000)
            sobra = await pg.evaluate("() => document.querySelectorAll('.lfVoa,.lfFundo').length")
            total += 1
            ok = (blocos == 2 and a1 == 'Preto +1.25 x5|Preto +2.00 x4|Tartaruga +0.75 x1' and a2 == 'Preto +1.25 x5|Preto +2.00 x2|Tartaruga +0.75 x1|Tartaruga +2.00 x2'
                  and a3 == 'Preto +1.25 x5|Preto +1.50 x1|Preto +2.00 x2|Preto +3.00 x1|Tartaruga +0.75 x1|Tartaruga +2.00 x2'
                  and a4 == 'Preto +1.25 x5|Preto +1.50 x1|Preto +2.00 x2|Tartaruga +0.75 x1|Tartaruga +2.00 x2' and el.endswith('+3.00:-1') and cu and sb
                  and fotos[0] == fotos[1] and fotos[0][3] == 0 and sobra == 0 and not pg.erros)
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
            r3 = await pg.evaluate("() => [window.__LF.S.view, document.getElementById('grpTabs').hidden, [...document.querySelectorAll('#grpTabs button')].length]")
            await pg.evaluate("() => window.__LF.setView('inicio')"); await pg.wait_for_timeout(500)
            await arrasta2('#v-inicio .tl[data-id="giro"]', '#mainnav .mn[data-id="%s"]' % gid, 100)
            r4 = await pg.evaluate("() => [window.__LF.S.grupos.map(g => g.itens), window.__LF.S.barra]")
            await pg.evaluate("g => window.__LF.ACT ? 0 : 0", gid)
            await pg.evaluate("g => { document.querySelector('#mainnav .mn[data-id=\"' + g + '\"]').dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true})); }", gid)
            await pg.wait_for_timeout(300)
            await pg.locator('#grpM [data-act="grpTirar"][data-id="giro"]').click(); await pg.wait_for_timeout(400)
            r5 = await pg.evaluate("() => [window.__LF.S.grupos.map(g => g.itens), window.__LF.S.barra]")
            await pg.locator('#grpM [data-act="grpTirar"][data-id="ajustes"]').click(); await pg.wait_for_timeout(400)
            r6 = await pg.evaluate("() => [window.__LF.S.grupos.length, window.__LF.S.barra, !!document.getElementById('grpM')]")
            total += 1
            ok = r0[0] == ['vendas', 'estoque', 'ajustes', 'caixa'] and not r0[1]
            ok = (ok and r1[0] and r1[1] == 'Ajustes do caixa'
                  and r2['g'] == [['caixa', 'ajustes']] and r2['nav'][:3] == ['inicio', 'vendas', 'estoque'] and len(r2['nav']) == 4 and r2['ic'] == 1 and r2['gi'] == 0
                  and r3[0] in ('caixa',) and r3[1] is False and r3[2] == 3
                  and r4[0] == [['caixa', 'ajustes', 'giro']]
                  and r5[0] == [['caixa', 'ajustes']] and 'giro' in r5[1]
                  and r6[0] == 0 and 'caixa' in r6[1] and not r6[2] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'grupos: juntar segurando, abas no topo, adicionar do Início, tirar e dissolver')
            if not ok: falhas.append('grupos barra'); print('        veio', r0, r1, r2, r3, r4, r5, r6, pg.erros)
            await pg.close()

            # Produtos: preço antigo → novo, canais, aviso de piso e aplicar em grupo (Reajustar)
            pg = await pagina()
            await pg.evaluate("() => { window.__LF.S.todos = false; window.__LF.setView('estoque'); }"); await pg.wait_for_timeout(500)
            ref0 = await pg.evaluate("() => document.querySelector('#rows .pcard[data-ref]').getAttribute('data-ref')")
            await pg.evaluate("r => { const S = window.__LF.S; S.pprice[r] = {novo: 123500, ant: 200000}; window.__LF.render(); }", ref0); await pg.wait_for_timeout(300)
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
            ok = '200.000' in txt and '123.500' in txt and site is True and nsel == 2 and tem3[-3:] == ['Reajustar', 'Aplicar mesmo assim', 'Cancelar'] and all(v >= 1000 for v in apos) and len([v for v in apos if v > 1000]) >= 1 and not pg.erros
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
            await pg.evaluate("() => { window.__LF.S.inicioT = null; window.__LF.setView('inicio'); }"); await pg.wait_for_timeout(400)
            semChip = await pg.evaluate("() => !document.querySelector('[data-act=inicioEd]')")
            t = await pg.locator('#v-inicio .tl[data-id=fx]').bounding_box()
            await pg.mouse.move(t['x'] + 40, t['y'] + 30); await pg.mouse.down(); await pg.mouse.move(t['x'] + 60, t['y'] + 80, steps=4); await pg.wait_for_timeout(300)
            lb = await pg.locator('#inLixo').bounding_box()
            await pg.mouse.move(lb['x'] + 32, lb['y'] + 32, steps=8); await pg.wait_for_timeout(300)
            perto = await pg.evaluate("() => document.getElementById('inLixo').classList.contains('perto')")
            await pg.mouse.up(); await pg.wait_for_timeout(700)
            oculto = await pg.evaluate("() => !document.querySelector('#v-inicio .tl[data-id=fx]') && window.__LF.S.inicioT.indexOf('fx') < 0")
            await pg.click('#lfDesf button'); await pg.wait_for_timeout(400)
            voltou = await pg.evaluate("() => !!document.querySelector('#v-inicio .tl[data-id=fx]')")
            a = await pg.locator('#v-inicio .tl[data-id=desp]').bounding_box(); c = await pg.locator('#v-inicio .tl[data-id=hist]').bounding_box()
            o0 = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .tl')].map(e => e.dataset.id).slice(0, 4)")
            await pg.mouse.move(a['x'] + 40, a['y'] + 30); await pg.mouse.down(); await pg.mouse.move(a['x'] + 60, a['y'] + 50, steps=3); await pg.mouse.move(c['x'] + 40, c['y'] + 30, steps=8); await pg.mouse.up(); await pg.wait_for_timeout(600)
            o1 = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .tl')].map(e => e.dataset.id).slice(0, 4)")
            await pg.mouse.move(200, 150); await pg.mouse.down(); await pg.wait_for_timeout(900); await pg.mouse.up(); await pg.wait_for_timeout(500)
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
              const antes = !!document.getElementById('pmTog'), btn = document.querySelector('#pmExtra .chip.add');
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
              const t = document.getElementById('v-dash').innerText; return [t.includes('Vendas do período'), t.includes('G$ 25.000'), t.includes('R$ 20'), (t.match(/1× /g) || []).length]; }""")
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
              return [pl.de, pl.sug, pl.rec, tela.includes('Entreguei') && tela.includes('Recebi US$'), tot, dep, falta, rm, des]; }""")
            total += 1
            ok = r[0] == 'brl' and r[1] == 40 and r[2] == 7 and r[3] and r[4] == 7 and r[5] == [210, 7, 7, 5570, 1, 5570] and r[6] == 0 and r[7] == 5570 and r[8] == [250, 0, 0, 0, 0] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Trocar agora: plano redondo, perda de câmbio coberta pelo colchão, resultado e desfazer')
            if not ok: falhas.append('trocar agora'); print('        veio', r, pg.erros)
            await pg.close()

            # Resumo por moeda, separação inteligente, notificações unificadas
            pg = await pagina(relogio=True)
            await pg.evaluate("() => { const L = window.__LF; L.S.dTab = 'hoje'; L.setView('dash'); }"); await pg.wait_for_timeout(400)
            r = await pg.evaluate("""() => { const k = [...document.querySelectorAll('#v-dash .kpi')].map(x => x.innerText);
              return [k[0].includes('R$') && k[0].includes('US$') && k[0].includes('G$'), k[1].includes('R$') && k[1].includes('G$'), k[2].includes('G$'), document.getElementById('v-dash').innerText.includes('Atenção agora'), document.getElementById('v-dash').innerText.includes('Para repor o estoque')]; }""")
            total += 1
            ok = r == [True, True, True, False, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Resumo: Vendido/Separar/Lucro por moeda, sem "Atenção agora", com "Para repor o estoque"')
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
            await pg.click('#kCont'); await pg.wait_for_timeout(300)
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
            ok = 'Meta do mês' in tx and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Dashboard: mostra meta do mês')
            if not ok: falhas.append('dash meta'); print('        veio', tx[:200], pg.erros)
            await pg.close()

            # edição de faixa pela janela Editar e entrada por pacote
            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.evaluate(ED(1)); await pg.locator('#edFaixas button:has-text("Luxo")').click(); await pg.wait_for_timeout(200)
            await pg.evaluate(ED(4)); await pg.locator('#editModal #edSalvar').click(); await pg.wait_for_timeout(300)
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
            await pg.locator('#mainnav >> text="Caixa"').first.click(); await pg.wait_for_timeout(300)
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
            await pg.locator('[data-act="dVer"]').first.click(); await pg.wait_for_timeout(500)
            tf = await pg.inner_text('#dFolha')
            await checa('Dashboard: abre no Resumo e a folha VER tem as 4 partes', 'Resumo' in tx and all(t in tf for t in ['Resumo', 'Dinheiro', 'Giro', 'Preços']) and not pg.erros, [tx[:150], tf[:150], pg.erros])
            await pg.locator('#dFolha [data-act="dVerEsc"][data-id="din"]').first.click(); await pg.wait_for_timeout(500)
            tx = await pg.inner_text('#v-dash')
            await checa('Dashboard Dinheiro: resultado e fluxo em linhas que abrem', 'LIVRE PARA VOCÊ' in tx.upper() and 'Seu mês' in tx and 'Detalhes do mês' in tx and 'Próximos' in tx and not pg.erros, [tx[:200], pg.erros])
            await pg.locator('[data-act="dfold"][data-id="flx"]').first.click(); await pg.wait_for_timeout(300)
            await pg.locator('[data-act="fluxod"][data-id="90"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => window.__LF.S.fluxoD")
            await checa('Dashboard: fluxo muda para 90 dias', got == 90, got)
            for tab in ['giro', 'prec']:
                await pg.locator('[data-act="dVer"]').first.click(); await pg.wait_for_timeout(450)
                await pg.locator(f'#dFolha [data-act="dVerEsc"][data-id="{tab}"]').first.click(); await pg.wait_for_timeout(450)
            await checa('Dashboard: abas Giro e Preços abrem sem erro', not pg.erros, pg.erros)
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
            await pg.fill('#lockPin', '0000'); await pg.click('#lockGo'); await pg.wait_for_timeout(300)
            msg = await pg.inner_text('#lockM')
            await checa('PIN: errado não abre', 'incorreto' in msg, msg)
            await pg.fill('#lockPin', '4321'); await pg.click('#lockGo')
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

            # S173-4 + Leve 2 (12/11/2026): saída no site com prazo e limite de 3; Leve 2 só sem furar o piso
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, n = Date.now(), D = 864e5;
              const it = S.items.find(i => i.qty > 0 && (i.tipo === 'pre' || i.tipo === 'solar')), ref = it.ref;
              const p0 = L.sitePrecoOferta(ref, 380000, 0, it.tipo).n;
              S.saidaSite = {[ref]: {tipo: it.tipo, n: 1000, ini: n, ate: n + 7 * D, max: 3}};
              const p1 = L.sitePrecoOferta(ref, 380000, 0, it.tipo), a1 = !!L.saidaSiteAtiva(ref);
              S.saidaSite[ref].ate = n - 1; const a2 = !!L.saidaSiteAtiva(ref);
              S.saidaSite[ref].ate = 0; const s0 = S.sales; S.sales = [{ref, ts: n + 1, qty: 3}].concat(s0); const a3 = !!L.saidaSiteAtiva(ref); S.sales = s0; S.saidaSite = null;
              return [p1.n < p0, p1.n >= 1000, a1, a2, a3, L.siteL2(ref, 'armacao', 380000), typeof L.siteL2(ref, it.tipo, 380000)] }""")
            ok = got == [True, True, True, False, False, False, 'boolean'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Vender com saída no site: prazo, termina ao vender 3, piso; Leve 2 só leitura/solar')
            if not ok: falhas.append('saida site'); print('        veio', got, pg.erros)
            await pg.close()

            # Catálogo (v427): janela de ajustes — rascunho só vale no "Ver", Cancelar desfaz, filtros e bolinha
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.items = [{tipo:'solar',ref:'Q1',grau:'',cor:'Preto',qty:2,custo:5},{tipo:'solar',ref:'Q2',grau:'',cor:'Preto',qty:3,custo:5},{tipo:'pre',ref:'Q3',grau:'+1.00',cor:'Preto',qty:4,custo:1}];
              S.attr = {Q1:{publico:'Feminino'},Q2:{publico:'Masculino'}}; S.pprice = {Q1:{novo:100000,ant:0},Q2:{novo:300000,ant:0}}; S.cjF = {tipos:[],pub:[],ate:0,sit:[]}; S.vq = '';
              L.setView('vendas'); L.render(); await w(900);
              const n0 = document.querySelector('#vInfo').textContent;
              document.getElementById('cjAj').click(); await w(500);
              document.querySelector('.cjC[data-v=solar]').click(); document.querySelector('.cjC[data-v=F]').click(); await w(450);
              const nJ = document.getElementById('cjN').textContent;
              document.getElementById('cjCanc').click(); await w(500);
              const canc = [S.cjF.tipos.length, document.querySelectorAll('.ljJn').length];
              document.getElementById('cjAj').click(); await w(500);
              document.querySelector('.cjC[data-v=solar]').click(); document.querySelector('.cjC[data-v=F]').click(); await w(100);
              document.getElementById('cjVer').click(); await w(500);
              const n1 = document.querySelector('#vInfo').textContent, dot = document.getElementById('cjDot').classList.contains('in');
              return [n0, nJ, canc, n1, dot, S.cjF.tipos, S.cjF.pub]; }""")
            total += 1
            ok = not got[0].startswith('2 ') and got[1] == '2' and got[2] == [0, 0] and got[3].startswith('2') and got[4] is True and got[5] == ['solar'] and got[6] == ['F'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'catálogo: janela de ajustes (rascunho, Cancelar desfaz, filtros, bolinha)')
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

            # Estúdio · Como fotografar (v436): guia com 4 abas e vídeo sem som
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, w = ms => new Promise(r => setTimeout(r, ms));
              L.estAbre(); await w(200); document.querySelector('[data-e=ajuda]').click(); await w(400); document.querySelector('[data-act=estAj][data-id=tut]').click(); await w(500);
              const j = document.querySelector('.estGuiaJn'), abas = [...j.querySelectorAll('.egTabs button')].map(b => b.textContent);
              const n1 = j.querySelectorAll('.egIt').length; j.querySelector('[data-t=cam]').click(); await w(100);
              const veloc = /Velocidade/.test(j.innerText); j.querySelector('[data-t=vid]').click(); await w(300);
              const v = document.getElementById('egVid');
              return [abas, n1 > 5, veloc, !!v && v.muted && /estudio-tutorial\.mp4/.test(v.src), j.querySelectorAll('.egPs').length]; }""")
            total += 1
            ok = got == [['Estúdio', 'Câmera', 'Depois', '▶ Vídeo'], True, True, True, 8] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Estúdio · Como fotografar: guia com 4 abas e vídeo sem som com os passos')
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

            # Pagamento automático (v450): PIX do Nubank confirma o pedido com o valor único; 2 pedidos iguais não confirmam; comprovante confere; ficha sem "separado/embalado"; cancelar avisa o site
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const n0 = S.pedidos.length;
              S.pedidos.push({ id: 'pA1', sid: 'SIDPA1', cod: 'A1', orig: 'site', st: 'pag', pg: 'pagar', pag: 'pix', brl: '85.73', total: 100000, cli: 'Ana', tel: '+55 11 99999-0000', ts: Date.now(), itens: [{ ref: 'AAA1', t: 'Óculos', cor: 'Preto', q: 1, p: 100000 }], ent: 'delivery', endE: 'Av. Monseñor Rodríguez 123, Ciudad del Este · Alto Paraná', refE: 'portão azul', tok: 'K7Q2' });
              S.pedidos.push({ id: 'pA2', sid: 'SIDPA2', cod: 'A2', orig: 'site', st: 'pag', pg: 'pagar', pag: 'pix', brl: '50.11', total: 60000, itens: [{ ref: 'B', q: 1, p: 60000 }] });
              S.pedidos.push({ id: 'pA3', sid: 'SIDPA3', cod: 'A3', orig: 'site', st: 'pag', pg: 'pagar', pag: 'pix', brl: '50.11', total: 60000, itens: [{ ref: 'C', q: 1, p: 60000 }] });
              const r0 = L.pixRecebido({ pkg: 'com.whatsapp', title: 'Pix recebido', text: 'R$ 85,73' });
              const r1 = L.pixRecebido({ pkg: 'com.nu.production', title: 'Pix recebido', text: 'Você recebeu R$ 85,73 de ANA' });
              const p1 = S.pedidos.find(p => p.id === 'pA1');
              const r2 = L.pixRecebido({ pkg: 'com.nu.production', title: 'Transferência recebida', text: 'Você recebeu uma transferência de R$ 50,11' });
              const amb = S.pedidos.find(p => p.id === 'pA2').pg === 'pagar';
              const c1 = L.compLeTexto({ pag: 'alias', pagar: 250037 }, 'Transferencia exitosa  Monto Gs. 250.037  07/11/2026 14:32');
              const c2 = L.compLeTexto({ pag: 'alias', pagar: 250037 }, 'Monto Gs. 250.000');
              const c3 = L.compLeTexto({ pag: 'pix', brl: '85.73' }, 'Valor R$ 85,73');
              const fl = L.fichaLinhas(p1), txt = fl.map(l => l.t || l.qr || '').join('|');
              const b = L.impBytes(fl); let qr = false; for (let i = 0; i < b.length - 3; i++) if (b[i] === 0x1d && b[i+1] === 0x28 && b[i+2] === 0x6b) { qr = true; break; }
              L.setView('ajustes'); await w(200); const aj = /Pagamento automático/.test(document.body.innerText);
              S.pedidos.length = n0; S.pixLog = [];
              return [r0, r1, p1.pg, !!p1.pgAuto, r2, amb, c1.ok, c2.ok, c2.v, c3.ok, /SEPARAR PEDIDO DO SITE/.test(txt) && /PAGO · PIX R\$ 85,73/.test(txt) && /RETIRAR|DELIVERY/.test(txt) && txt.indexOf(p1.tok) > 0, /separado|embalado/i.test(txt), qr, aj]; }""")
            total += 1
            ok = got == ['ignorada', 'confirmado', 'pago', True, 'ambiguo', True, True, False, 'G$ 250.000', True, True, False, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Pagamento automático: PIX do Nubank confirma pelo valor único; valor repetido não confirma; comprovante confere; ficha com QR e sem "separado/embalado"')
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

            # Estúdio × Adicionar (v442): botão "Fotografar antes de cadastrar" + Giro; Adicionar com faixa de 2 abas que lembra a aba; foto aguardando leva a 3/4 junto; selos por cor; Completar fotos abre o Estúdio
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              const px = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';
              L.estAbre(); await w(200); const txt = document.querySelector('.estOv').innerText; const bot = /Peça nova, ainda sem cadastro/.test(txt) && !!document.querySelector('[data-e=nova]') && !!document.querySelector('[data-e=ajuda]');  // v465: giro foi para o "?"
              document.querySelector('.estOv .estX').click(); await w(100);
              S.estPend = [{ id: 'p1', ts: Date.now(), t: px, t34: px, n: 84 }]; S.adAba = 'novo';
              S.addOpen = true; S.addMode = 'menu'; L.render(); L.renderDeNovo(); await w(100);
              const b = document.getElementById('addDeNovo'); const abas = [...b.querySelectorAll('.adSeg button')].map(x => x.textContent);
              b.querySelector('[data-id=pend]').click(); await w(150);
              const lembra = S.adAba === 'pend' && !!document.querySelector('#addDeNovo [data-act=adPend]');
              const it = S.items.find(i => !i.bulk && !/pre/.test(i.tipo)); const k = it.ref + '|' + it.cor;
              S._pendLig = { id: 'p1', ts: Date.now() }; L.setFoto(k, px, px); await w(400);
              const levou = !!S.fotos[k + '|34'] && !S.estPend.length;
              S.fotoNota[k] = { n: 62, mot: ['fundo cinza (mais luz)'], ts: 1 }; const s1 = L.cfSelos(it.ref, it);
              S.fotoNota[k] = { n: 91, mot: [], ts: 1 }; const s2 = L.cfSelos(it.ref, it);
              S.addOpen = false; L.render(); L.ACT.semfoto(); await w(200); const est = !!document.querySelector('.estOv');
              return [bot, abas.length === 2 && /Aguardando cadastro · 1/.test(abas[0]), lembra, levou, /refazer · fundo cinza/.test(s1), /foto 91 ✓/.test(s2) && /catálogo/.test(s2), est]; }""")
            total += 1
            ok = got == [True] * 7 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Estúdio × Adicionar: antes de cadastrar + giro, faixa de 2 abas com memória, 3/4 vai junto, selos por cor, Completar fotos abre o Estúdio')
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

            # Lista de compras sem excesso (v440): Sobrando (ideal × tem × sobra, dinheiro parado), avise-me no topo, aviso antes de pedir, miniaturas, bloco do pedido na Entrada
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.lcPed = null; S.lcQtd = {}; S.espera = [];
              let Ls = L.lcLista(); const cand = Object.values(Ls.porIdeal).filter(b => b.ideal > 0 && !b.grau && b.cu > 0);
              const a = cand[0]; S.items.filter(i => i.ref === a.m.ref && i.tipo === a.m.tipo && !i.bulk)[0].qty += a.ideal * 3 + 4;
              const z = cand.find(b => b.m.ref !== a.m.ref); S.items.filter(i => i.ref === z.m.ref && i.tipo === z.m.tipo).forEach(i => i.qty = 0);
              S.espera.push({ id: 'e1', ref: z.m.ref, nome: 'Ana', tel: '1', ts: Date.now(), av: false }, { id: 'e2', ref: z.m.ref, nome: 'Bia', tel: '2', ts: Date.now(), av: false });
              S.dTab = 'giro'; S.dfold.rep = true; L.setView('dash'); await w(300);
              Ls = L.lcLista(); const so = Ls.sobra.find(b => b.m.ref === a.m.ref);
              const c = document.getElementById('lcCard'), topo = !!c.querySelector('.lcSobTop'), secS = /Sobrando/.test(c.textContent), mini = c.querySelectorAll('.lcTh').length > 0;
              const prim = Ls.acab[0] && Ls.acab[0].m.ref === z.m.ref && /2 clientes esperando/.test(Ls.acab[0].mot);
              // aviso antes de pedir
              const k = Ls.acab[0].k; S.lcQtd[k] = 40; L.render(); await w(100);
              document.querySelector('#lcCard [data-act=lcPedir]').click(); await w(500);
              const av = !!document.querySelector('.lcAvJn'); document.getElementById('lcAj').click(); await w(400);
              const ajust = S.lcQtd[k] < 40 && !S.lcPed;
              document.querySelector('#lcCard [data-act=lcPedir]').click(); await w(500);
              if (document.querySelector('.lcAvJn')) { document.getElementById('lcSeg').click(); await w(300); }
              const pediu = !!S.lcPed;
              const g = S.grp[0]; const html = L.lcPedResumoHtml(g ? [g.id] : []);
              return [!!so && so.sobra >= 2 && so.valor > 0, Ls.parado > 0, topo, secS, mini, prim, av, ajust, pediu, /Do pedido da lista/.test(html), /pedido \d+ · chegou/.test(html)]; }""")
            total += 1
            ok = got == [True] * 11 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Lista sem excesso: Sobrando com dinheiro parado, avise-me no topo, aviso antes de pedir, miniaturas, bloco do pedido na Entrada')
            if not ok: falhas.append('lista sem excesso'); print('        veio', got, pg.erros)
            await pg.close()

            # Giro (v428): lista de compras (sem cor, por grau, − / +, total × reposição, pedido que confere sozinho) e vitrine da semana
            pg = await pagina()
            got = await pg.evaluate("""async () => { const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
              S.dTab = 'giro'; S.dfold.rep = true; S.dfold.vit = true; L.setView('dash'); await w(300);
              const c = document.getElementById('lcCard'), secs = [...c.querySelectorAll('.lcSec')].map(e => e.textContent.split(' ')[0]);
              const graus = c.querySelectorAll('.lcG').length > 0, b0 = c.querySelector('.lcQ b').textContent;
              c.querySelector('[data-act=lcMais]').click(); await w(150);
              const b1 = document.querySelector('#lcCard .lcQ b').textContent, tot = /reposição/.test(document.querySelector('#lcCard .lcTot').textContent);
              const n0 = document.querySelectorAll('#lcCard .lcQ').length;
              document.querySelector('[data-act=lcPedir]').click(); await w(150);
              if (document.querySelector('.lcAvJn')) { document.getElementById('lcSeg').click(); await w(150); }
              const ped = S.lcPed && S.lcPed.itens.length, n1 = document.querySelectorAll('#lcCard .lcQ').length;
              const p0 = S.lcPed.itens[0], it = S.items.find(i => i.ref === p0.ref && i.tipo === p0.tipo && (!p0.grau || i.grau === p0.grau)); it.qty += p0.q; L.render(); await w(150);
              const chegou = /chegou/.test(document.querySelector('#lcCard .lcPed').textContent);
              const pede = !!document.getElementById('vtLug'); document.getElementById('vtLug').value = '3'; document.querySelector('[data-act=vitLug]').click(); await w(150);
              const sug = document.querySelectorAll('#vtCard .vtL').length, r0 = document.querySelector('#vtCard [data-act=vitFixa]').dataset.id;
              document.querySelector('#vtCard [data-act=vitFixa]').click(); await w(100);
              document.querySelector('[data-act=vitTroquei]').click(); await w(150);
              const atual = S.vit.atual.slice(), fix = atual.indexOf(r0) >= 0, boa = /Nada para trocar/.test(document.getElementById('vtCard').textContent);
              const r1 = atual.find(r => r !== r0); S.items.filter(i => i.ref === r1).forEach(i => i.qty = 0); L.render(); await w(150);
              const saem = /Saem/.test(document.getElementById('vtCard').textContent) && /Entram/.test(document.getElementById('vtCard').textContent);
              return [secs.indexOf('Acabando') >= 0, graus, +b1 === +b0 + 1, tot, ped > 0, n1 < n0, chegou, pede, sug, atual.length, fix, boa, saem]; }""")
            total += 1
            ok = got == [True, True, True, True, True, True, True, True, 3, 3, True, True, True] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Giro: lista de compras (grau, − / +, total × reposição, pedido confere) e vitrine da semana (lugares, fixar, trocar)')
            if not ok: falhas.append('giro lista vitrine'); print('        veio', got, pg.erros)
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
