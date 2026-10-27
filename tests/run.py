#!/usr/bin/env python3
"""Testes automáticos do La Fouch.  Uso:  python3 tests/run.py   (ou: npm test)

Abre www/ num Chromium sem interface, com a URL terminando em #test (o app então expõe
window.__LF com as funções internas) e confere contas, lotes, leitor de código, gravação
e as telas. Requer: pip install playwright  (e um Chromium; PLAYWRIGHT_BROWSERS_PATH ou o do sistema).
"""
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
 ("primeira abertura: app limpo com os 20 modelos do catálogo", """
   L.primeiroUso();
   return [S.items.length>0, S.items.length<=40, S.sales.length, S.exp.length, S.cash.pyg, S.ini.rep, Object.keys(S.fotos).length>0, S.view]""", [True, True, 0, 0, 0, 0, True, 'dash']),
 ("piso: sem faixa só cobre o custo; com faixa entra a margem", """
   L.primeiroUso(); const it=S.items[0], a=L.pisoPeca(it).piso; S.pfaixa[it.ref]='f3'; const b=L.pisoPeca(it);
   return [a>0, b.piso>a, b.margem]""", [True, True, 0.5]),
 ("rateio das contas: proporcional ao custo soma as contas do mês e peça cara carrega mais", """
   L.primeiroUso(); S.exp=[{id:1,nome:'Aluguel',cat:'loja',tipo:'fixa',moeda:'pyg',orig:1800000,valor:1800000,rate0:1,hist:[],dia:10}];
   const ids=[...new Set(S.items.map(i=>i.tipo))]; S.metaDia={}; ids.forEach(t=>{S.metaDia[t]=2}); S.diasLoja=26;
   S.rateio='peca'; const flat=L.contasPeca();
   S.items[0].custo=1; S.items[S.items.length-1].custo=6; S.rateio='custo'; const its=S.items.slice().sort((a,b)=>L.tFor(a).repUSD-L.tFor(b).repUSD);
   const lo=L.contasPeca(its[0]), hi=L.contasPeca(its[its.length-1]);
   return [flat>0, hi>lo, lo>0]""", [True, True, True]),
 ("faixa automática pelo custo: escolha manual vale mais e desligada não muda nada", """
   L.primeiroUso(); const it=S.items[0]; S.pfaixa={}; S.faixaAuto={on:false,lim:[4,10]};
   const off=L.faixaOf(it.ref); S.faixaAuto={on:true,lim:[0.0001,0.0002]}; const auto=L.faixaOf(it.ref);
   S.pfaixa[it.ref]='f1'; const man=L.faixaOf(it.ref);
   return [off===null, auto&&auto.id===S.faixas[S.faixas.length-1].id, man.id==='f1']""", [True, True, True]),
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
     const f=pr.length?JSON.parse(pr[0][2]).fields:{}; const cn=((f.cn||{}).arrayValue||{}).values||[];
     return [ok0, p.cn.join(','), p.qs.join(','), p.med.join(','), p.rosto.join(','), av, av2, av3, pr.length, fo, cn.length, !!(f.lib||{}).booleanValue]})""", [True, 'Preto,Rosa,Azul', '2,0,0', '53,18,140', 'oval,coracao', 'Últimas 2 unidades', '', 'Chegou esta semana', 1, 3, 3, True]),
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

            async def pagina(scheme='dark', url='#test', ctx=None, tudo=True):
                ctx = ctx or await b.new_context(viewport={'width': 420, 'height': 900}, color_scheme=scheme, service_workers='block')
                await ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
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
            got = await pg.evaluate("() => [document.querySelectorAll('#detail .ccard').length, document.querySelectorAll('#detail .vbar button').length, document.querySelectorAll('#detail .pl.pick, #detail .detgrid button.nav, #detail .gal button').length, document.querySelector('#detail .vbar button').innerText]")
            await checa('produto: 3 cores em cartões (como em Vendas) e um só botão Vender', got == [3, 1, 0, 'Vender C1 · Preto'], got)
            await pg.locator('#detail .ccard').nth(1).click(); await pg.wait_for_timeout(200)
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

            # Oferta no Inventário: descontos prontos, aviso de piso e encerrar
            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.pprice = {}; window.__LF.render(); }"); await pg.wait_for_timeout(300)
            tem = await pg.evaluate("() => !!document.getElementById('ofCard')")
            await pg.locator('#ofCard button:has-text("−20%")').click(); await pg.wait_for_timeout(300)
            of1 = await pg.evaluate("() => { const o = window.__LF.S.pprice['BR44118']; return o ? [o.ant > o.novo, Math.round((1 - o.novo / o.ant) * 100)] : null }")
            tem2 = await pg.evaluate("() => [!!document.getElementById('ofAte'), !!document.getElementById('ofFim')]")
            await pg.locator('#ofFim').click(); await pg.wait_for_timeout(300)
            of2 = await pg.evaluate("() => { const o = window.__LF.S.pprice['BR44118']; return o ? o.ant === undefined : true }")
            await checa('oferta: descontos prontos, data opcional e encerrar volta ao preço anterior', tem and of1 and of1[0] and 19 <= of1[1] <= 21 and tem2 == [True, True] and of2, [tem, of1, tem2, of2])

            # Liberar para o site: só com foto em todas as cores
            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.site = {}; Object.keys(S.fotos).filter(k => k.startsWith('BR44118|')).forEach(k => delete S.fotos[k]); }")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            sem = await pg.evaluate("() => { const b = document.getElementById('edSiteBtn'); return [!!b, b && b.disabled, document.getElementById('edSite').innerText] }")
            await pg.locator('#editModal button:text-is("Cancelar")').last.click(); await pg.wait_for_timeout(300)
            await pg.evaluate("() => { const S = window.__LF.S; S.items.filter(i => i.ref === 'BR44118').forEach(i => { S.fotos['BR44118|' + i.cor] = 'data:image/png;base64,AAAA'; }); }")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            com = await pg.evaluate("() => { const b = document.getElementById('edSiteBtn'); return [b && b.disabled] }")
            await pg.click('#edSiteBtn'); await pg.wait_for_timeout(300)
            lib = await pg.evaluate("() => [!!window.__LF.S.site['BR44118'], document.getElementById('edSite').innerText]")
            await checa('Liberar para o site: exige foto em todas as cores e liga/desliga', sem[0] and sem[1] and 'Falta foto' in sem[2] and com == [False] and lib[0] and 'Liberado' in lib[1], [sem, com, lib])

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('1'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab')
            await pg.fill('#descTa', 'rascunho'); await pg.wait_for_timeout(200)
            await pg.locator('#editModal button:text-is("Cancelar")').last.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty, window.__LF.S.desc['BR44118'], !!document.getElementById('editModal')]")
            await checa('janela Editar: Cancelar descarta tudo', got[0] == 4 and got[1] != 'rascunho' and got[2] is False, got)

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
            await pg.evaluate("""() => { const S = window.__LF.S; S.clientes = [{id:1,nome:'Maria Silva',tel:'0981 123 456',ruc:'80012345-6',obs:'',ts:1},{id:2,nome:'João Souza',tel:'+55 45 999',ruc:'',obs:'',ts:2}]; S.cliNext = 3; S.vCli = 0; window.print = () => { window.__imp = document.getElementById('notaPrint').innerText; }; }""")
            total += 1
            await vender()
            tx = await pg.inner_text('#notaOv')
            a = [await pg.locator('#notaOv').is_visible(), 'Sin nombre' in tx, 'RUC: X' in tx, 'Ciudad: CDE' in tx, 'Armazón' in tx, '50.000' in tx, '4.545' in tx, await pg.locator('[data-act=notaImp]').count()]
            await pg.click('[data-act=notaX]'); b1 = await pg.locator('#notaCf').is_visible()
            await pg.click('[data-act=notaVolta]'); b2 = await pg.locator('#notaCf').is_hidden() and await pg.locator('#notaOv').is_visible()
            await pg.click('[data-act=notaImp]'); await pg.wait_for_timeout(2200); b3 = await pg.locator('#notaCf').is_hidden()
            c1 = [await pg.locator('#notaOv').is_hidden(), 'Sin nombre' in await pg.evaluate('() => window.__imp || ""')]
            ok = a == [True, True, True, True, True, True, True, 1] and b1 and b2 and b3 and c1 == [True, True]
            print(('  ok  ' if ok else ' FALHA ') + 'venda sem cliente: nota Sin nombre / X / CDE, imprime direto e confirma ao fechar sem imprimir')
            if not ok: falhas.append('nota sem cliente'); print('        veio', a, b1, b2, b3, c1, pg.erros)
            total += 1
            await vender('mar')
            tx = await pg.inner_text('#notaOv')
            got = await pg.evaluate("() => [window.__LF.S.sales[0].cliId, window.__LF.S.vCli]")
            ok = 'Maria Silva' in tx and 'RUC: 80012345-6' in tx and got == [1, 0] and await pg.locator('[data-act=notaImp]').count() == 1
            await pg.click('[data-act=notaX]'); await pg.click('[data-act=notaSair]'); await pg.wait_for_timeout(500)
            print(('  ok  ' if ok else ' FALHA ') + 'venda com cliente com RUC: nota com nome e RUC, venda ligada ao cliente')
            if not ok: falhas.append('nota com RUC'); print('        veio', tx, got)
            total += 1
            await vender('Joã')
            tx = await pg.inner_text('#notaOv')
            got = await pg.evaluate("() => window.__LF.S.sales[0].cliId")
            ok = 'Cliente sem RUC' in tx and await pg.locator('[data-act=notaImp]').count() == 0 and 'DADOS PARA NOTA' not in tx and got == 2
            await pg.wait_for_timeout(7000)
            ok = ok and await pg.locator('#notaOv').is_hidden()
            print(('  ok  ' if ok else ' FALHA ') + 'cliente sem RUC: sem opção de nota, fecha sozinha em 3 s, compra no histórico dele')
            if not ok: falhas.append('nota sem RUC'); print('        veio', tx, got)
            total += 1
            await pg.evaluate("() => { const L = window.__LF; L.S.cliSel = 1; L.setView('clientes'); L.render(); }"); await pg.wait_for_timeout(300)
            f1 = await pg.inner_text('#v-clientes')
            await pg.evaluate("() => { const L = window.__LF; L.S.cliSel = 2; L.render(); }"); await pg.wait_for_timeout(200)
            f2 = await pg.inner_text('#v-clientes')
            ok = 'compras' in f1.lower() and 'Conversar no WhatsApp' in f1 and 'Remover' in f1 and 'Sem RUC' not in f1 and 'Sem RUC' in f2 and 'Conversar no WhatsApp' in f2
            print(('  ok  ' if ok else ' FALHA ') + 'ficha do cliente: compras, WhatsApp, Remover, aviso Sem RUC só sem RUC')
            if not ok: falhas.append('ficha cliente'); print('        veio', f1, '|', f2)
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
                S.tr.de = 'pyg'; S.tr.para = 'usd'; L.setView('fx'); L.render(); o.n1 = (document.getElementById('v-fx').innerText.match(/(dólar|real) hoje/gi) || []).length;
                S.tr.de = 'brl'; L.render(); o.n2 = (document.getElementById('v-fx').innerText.match(/(dólar|real) hoje/gi) || []).length;
                return o }""")
            ok = r['brl'] == ['reais'] and r['ambos'] == ['guaranis', 'reais'] and r['nenhum'] == 0 and r['n1'] == 1 and r['n2'] == 1
            print(('  ok  ' if ok else ' FALHA ') + 'Câmbio: um só medidor "hoje" e aviso de bom momento também para o real')
            if not ok: falhas.append('câmbio medidor'); print('        veio', r, pg.erros)
            await pg.close()

            # Editar produto: apertar botões não faz a janela voltar ao topo
            pg = await pagina()
            total += 1
            await pg.evaluate("() => { window.__LF.setView('estoque'); }"); await pg.wait_for_timeout(400)
            await pg.locator('#rows .pcard').nth(2).click(); await pg.wait_for_timeout(700)
            await pg.click('#detail button[aria-label=Editar]'); await pg.wait_for_timeout(700)
            res = []
            for t in ['Liberar para o site', 'Sem faixa', '+']:
                bt = pg.locator('#editModal button', has_text=t).first
                if not await bt.count(): res.append((t, 'sem botão')); continue
                await bt.evaluate("e => e.scrollIntoView({block: 'center'})"); await pg.wait_for_timeout(150)
                y0 = await pg.evaluate("() => document.getElementById('editModal').scrollTop")
                await bt.click(); await pg.wait_for_timeout(500)
                y1 = await pg.evaluate("() => { const e = document.getElementById('editModal'); return e ? e.scrollTop : -1 }")
                res.append((t, y0, y1))
            ok = all(r[1] != 'sem botão' and r[1] > 50 and abs(r[1] - r[2]) < 3 for r in res)
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
            await pg.locator('#editModal button', has_text='Salvar').first.click(); await pg.wait_for_timeout(300)
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
            await pg.click('[data-act=notaImp]'); await pg.wait_for_timeout(150); a3 = await pg.evaluate("() => [document.querySelector('[data-act=notaImp]').textContent, !document.getElementById('notaCf').hidden]")
            await pg.wait_for_timeout(1500); a4 = await pg.evaluate("() => [document.getElementById('notaOv').hidden, window.__imp.indexOf('María') >= 0 || window.__imp.indexOf('Maria') >= 0, document.getElementById('lfToast').textContent]")
            ok = a0 == [False, 0] and a1[0] and 0 < a1[1] < a2[1] and a2[0] == a2[1] and a2[2] and '50.000' in a2[3] and 'Enviando' in a3[0] and not a3[1] and a4[0] and a4[1] and 'Venda registrada' in a4[2]
            print(('  ok  ' if ok else ' FALHA ') + 'venda confirmada: círculo gira, ✓, itens entram um a um, Imprimir direto sem pergunta e volta ao balcão')
            if not ok: falhas.append('venda confirmada anim'); print('        veio', a0, a1, a2, a3, a4, pg.erros)
            await pg.close()

            # aba Vendas: tocar no produto abre a mesma tela do catálogo em modo venda
            pg = await pagina()
            await pg.evaluate("""() => { const L = window.__LF, S = L.S; S.vRef = ''; S.vSel = null; S.vq = ''; S.vTipo = 'all'; S.vFaixa = ''; S.qty = 1; L.setView('vendas'); }""")
            await pg.wait_for_timeout(300)
            total += 1
            a = await pg.evaluate("() => [document.getElementById('vListCard').hidden, document.getElementById('vDetail').hidden, document.getElementById('vSaleCard').hidden]")
            await pg.locator('#vRows .pcard[data-ref="SP57765"]').click(); await pg.wait_for_timeout(400)
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
            await pg.locator('#uniV .cb3').nth(1).click(); await pg.wait_for_timeout(400)
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
            tabs = await pg.evaluate("() => [...document.querySelectorAll('#vTabs .chip')].map(b => b.innerText)")
            await pg.locator('#vTabs .chip', has_text='Pré-graduados').click(); await pg.wait_for_timeout(300)
            graus = await pg.evaluate("() => [...document.querySelectorAll('#vGrades .chip')].map(b => [b.firstChild.textContent, b.querySelector('small').textContent, b.classList.contains('off')])")
            await pg.locator('#vGrades .chip', has_text='+1.50').click(); await pg.wait_for_timeout(300)
            so150 = await pg.evaluate("() => [...document.querySelectorAll('#vRows .pcard')].map(c => c.dataset.ref)")
            semcod = await pg.evaluate("() => !document.getElementById('vRows').innerText.includes('Código ')")
            await pg.locator('#vGrades .chip', has_text='+1.50').click(); await pg.wait_for_timeout(200)
            await pg.locator('#vRows .pcard[data-ref="T1"]').click(); await pg.wait_for_timeout(400)
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
            ok = (tabs == ['Todos', 'Mais vendidos', 'Armações', 'Solares', 'Pré-graduados'] and graus == [['+1.00', '1', False], ['+1.50', '1', False], ['+2.00', 'esgotado', True]]
                  and so150 == ['T2'] and semcod
                  and det['semBolinha'] == 0 and det['graus'] == ['+1.00 9 un.', '+1.50 Esgotado'] and len(det['cartoes']) == 2 and det['barra'] and not det['codigo']
                  and sorted(cart) == [['A', 3], ['B', 2]]
                  and len(arm) == 2 and selcor == 'Bege' and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Vendas: abas, grau, cores em cartões, sem código/bolinha, lotes iguais somados')
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
            mapa = await pg.evaluate("""() => [...document.querySelectorAll('#mapaB .gcell')].map(c => c.className.replace('gcell','').replace('on','').trim() + ':' + c.querySelector('b').innerText)""")
            abas = await pg.evaluate("() => [...document.querySelectorAll('#eTabs .chip')].map(b => b.innerText.replace(/\\s+/g,' '))")
            kl = await pg.evaluate("() => document.getElementById('kLot').hidden")
            await pg.locator('#mapaB .gcell', has_text='+1.50').click(); await pg.wait_for_timeout(300)
            filtro = await pg.evaluate("() => window.__LF.S.q")
            await pg.locator('#mapaB .gcell', has_text='+1.50').click(); await pg.wait_for_timeout(200)
            await pg.click('#eTabR'); await pg.wait_for_timeout(300)
            rep = await pg.evaluate("""() => ({ vis: !document.getElementById('repoView').hidden, lista: document.getElementById('listCard').hidden, mapa: document.getElementById('mapaB').hidden,
                itens: [...document.querySelectorAll('#repoView .repit[data-g]')].map(r => r.dataset.g + ':' + r.querySelector('.st2 i').innerText) })""")
            await pg.locator('#repoView .repit[data-g="+3.50"] button[aria-label^="Mais"]').click(); await pg.wait_for_timeout(200)
            await pg.click('#repGerar'); await pg.wait_for_timeout(200)
            txt = await pg.evaluate("() => document.querySelector('#repoView .replist').innerText")
            await pg.click('#eTabP'); await pg.wait_for_timeout(300)
            volta = await pg.evaluate("() => [document.getElementById('repoView').hidden, document.getElementById('listCard').hidden]")
            ok = (mapa.count('r:0') == 12 and mapa.count('y:5') == 2 and 'y:2' in mapa and 'g:12' in mapa and abas == ['Produtos', 'Compras 1', 'Reposição'] and kl is True
                  and filtro == '+1.50' and rep['vis'] and rep['lista'] and rep['mapa']
                  and rep['itens'][0] == '+0.50:1' and '+3.50:1' in rep['itens'] and '+3.00:0' in rep['itens'] and '+1.50:0' in rep['itens']
                  and '+3.50 · 2 pacotes de 24' in txt and 'Total: 336 peças' in txt
                  and volta == [True, False] and not pg.erros)
            total += 1
            print(('  ok  ' if ok else ' FALHA ') + 'Estoque: abas, mapa de graus e lista de compra em pacotes')
            if not ok: falhas.append('estoque abas'); print('        veio', mapa, abas, kl, filtro, rep, txt, volta, pg.erros)
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
            await pg.evaluate("() => document.getElementById('sCartAdd').click()"); await pg.wait_for_timeout(300)
            u1 = await pg.evaluate("() => [document.getElementById('cartBar').hidden, document.getElementById('cartBar').textContent.indexOf('Pedido: 1') >= 0, window.__LF.S.cart.length]")
            await pg.locator('#vRows .pcard:not([data-ref="SP57765"])').first.click(); await pg.wait_for_timeout(300)
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
              S.melhPeca = 14000; S.descMode = 'pyg'; S.descTxt = '2';
              L.setView('despesas'); L.render();
              const a = document.getElementById('melhIn').value;
              document.getElementById('impV').value = '3'; document.getElementById('melhIn').value = '10500';
              document.getElementById('melhIn').dispatchEvent(new Event('input', {bubbles: true}));
              const b = S.melhPeca;
              document.querySelector('[data-act=impadd]').click(); document.getElementById('impD') ;
              L.render(); const c = document.getElementById('melhIn').value;
              return [a, b, c, document.getElementById('nMoeda').value, L.S.imprev.length]; }""")
            ok = r[0] == '14.000' and r[1] == 10500 and r[2] == '10.500' and r[3] == 'pyg' and not pg.erros
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
              return [g, u, b, man, custo, sh === esp, document.getElementById('v-fx').textContent.indexOf('Cotação da loja') >= 0, fx.indexOf('G$ 8.000') >= 0]; }""")
            ok = r[0] == 'US$ 74' and r[1] == 8000 and r[2] == 1600 and r[3] == 1300 and r[4] == 8000 and r[5] and r[6] and r[7] and not pg.erros
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
            ok = ('8 peças da compra de' in ini and 'sem detalhe' in ini and irc == ['estoque', True, 'Compras'] and not pg.erros)
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
            m2 = await pg.evaluate("() => { const v = i => { const e = document.getElementById(i); return !!e && e.offsetParent !== null }; return [v('addProdRest'), v('addBack'), v('btnLeitor'), v('nv_tipo')] }")
            ok = m0 == [True, True, True, True, False, False, False, 1, True] and m1 == [True, True, False, False] and m2 == [True, False, False, True]
            print(('  ok  ' if ok else ' FALHA ') + 'Adicionar: menu único, voltar, um só leitor e sem abas Produto/Lote')
            if not ok: falhas.append('menu adicionar'); print('        veio', m0, m1, m2, pg.erros)
            total += 1
            await pg.close()

            # Novo modelo (tela 1) + Cores e fotos (tela 2): cadastro à mão guiado, como aprovado
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('estoque')")
            await pg.click('#btnAdd'); await pg.wait_for_timeout(300)
            await pg.click('#addToMan'); await pg.wait_for_timeout(300)
            await pg.click('#nv_tipo'); await pg.locator('#nvp_tipo >> text=Armações').click(); await pg.wait_for_timeout(200)
            await pg.fill('#eRef', 'ZZ77')
            # falta formato/material/gênero/custo: o botão avisa e não avança
            await pg.click('#nvNext'); await pg.wait_for_timeout(300)
            falta1 = await pg.evaluate("() => [document.getElementById('addTitle').textContent, document.body.innerText.indexOf('Falta') >= 0]")
            for k, t in (('fmt', 'Redondo'), ('mat', 'Acetato'), ('pub', 'Feminino')):
                await pg.click('#nv_' + k); await pg.locator('#nvp_' + k + ' >> text="' + t + '"').click()
            await pg.fill('#eCusto', '0,50')
            await pg.fill('#nvL', '50'); await pg.fill('#nvP', '20'); await pg.fill('#nvH', '140'); await pg.wait_for_timeout(300)
            auto = await pg.evaluate("() => [document.getElementById('nvAuto').hidden, document.getElementById('nvAuto').innerText]")
            await pg.evaluate("() => { const d = document.getElementById('nvMais'); if (d) d.open = true; }")
            await pg.fill('#eDescP', 'Armação de acetato verde, haste larga')
            await pg.click('#nvNext'); await pg.wait_for_timeout(400)
            tit2 = await pg.evaluate("() => document.getElementById('addTitle').textContent")
            # modelo sem nenhuma cor: o site não libera
            await pg.locator('text=+ Adicionar cor').click(); await pg.wait_for_timeout(200)
            await pg.locator('#nvBox >> text="Vinho"').click(); await pg.wait_for_timeout(200)
            sem_foto = await pg.evaluate("() => document.getElementById('nvCorOk').disabled")
            async with pg.expect_file_chooser() as fcs:
                await pg.click('#nvFotoCor')
            fc = await fcs.value
            await fc.set_files(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', 'peca.jpg')); await pg.wait_for_timeout(900)
            com_foto = await pg.evaluate("() => document.getElementById('nvCorOk').disabled")
            await pg.click('#nvCorOk'); await pg.wait_for_timeout(600)
            await pg.click('#nvTg'); await pg.wait_for_timeout(300)
            r = await pg.evaluate("""() => { const S = window.__LF.S, it = S.items.filter(i => i.ref === 'ZZ77')[0];
              return [!!it, it && it.cor, it && it.qty, S.desc.ZZ77, !!(S.site && S.site.ZZ77), !!S.fotos['ZZ77|Vinho']]; }""")
            total += 1
            ok = falta1 == ['Novo modelo', True] and auto[0] is False and 'Armação redondo acetato' in auto[1] and tit2 == 'Cores e fotos' \
                and r == [True, 'Vinho', 1, 'Armação de acetato verde, haste larga', True, True] and sem_foto is True and com_foto is False and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'novo modelo: duas telas, avisos, cor só entra com foto')
            if not ok: falhas.append('cadastro desc'); print('        veio', falta1, auto, tit2, r, sem_foto, com_foto, pg.erros)
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
            ok = r == ['inicio', 11] and r2 == ['dash', 'giro'] and r3 == 'estoque' and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'tela Início: 13 botões + barra levam às telas certas')
            if not ok: falhas.append('inicio'); print('        veio', r, r2, r3, pg.erros)
            await pg.close()

            # animações dos botões: barra fixa embaixo, realce deslizante, segurar para apagar
            pg = await pagina()
            await pg.locator('#mainnav button:has-text("Caixa")').click(); await pg.wait_for_timeout(600)
            r = await pg.evaluate("() => [getComputedStyle(document.getElementById('mainnav')).position, document.querySelectorAll('#mainnav .slider').length, document.querySelector('#mainnav .mn.on').textContent.trim()]")
            await pg.evaluate("() => { window.__LF.S.dTab = 'hoje'; window.__LF.setView('dash'); }"); await pg.wait_for_timeout(500)
            r2 = await pg.evaluate("() => document.querySelectorAll('#v-dash .tgrid .slider').length")
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
              {'name': 'projects/p/databases/(default)/documents/pedidos/abc1', 'fields': {'ts': {'integerValue': str(int(time.time()*1000))}, 'nome': {'stringValue': 'maria souza'}, 'tel': {'stringValue': '0981123456'}, 'total': {'integerValue': '210000'}, 'itens': {'arrayValue': {'values': [{'mapValue': {'fields': {'ref': {'stringValue': 'AC1'}, 'nome': {'stringValue': 'Armação azul'}, 'q': {'integerValue': '2'}, 'cor': {'stringValue': ''}, 'preco': {'integerValue': '105000'}}}}]}}}},
              {'name': 'projects/p/databases/(default)/documents/pedidos/abc2', 'fields': {'nome': {'stringValue': ''}, 'itens': {'arrayValue': {}}}}]}
            apagados = []
            async def falso(route):
                u, m = route.request.url, route.request.method
                if 'securetoken' in u: await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
                elif m == 'DELETE': apagados.append(u.rsplit('/', 1)[1]); await route.fulfill(json={})
                else: await route.fulfill(json=docs)
            await pg.context.route(re.compile(r'(securetoken|firestore)\.googleapis\.com'), falso)
            await pg.evaluate("() => { const S = window.__LF.S; S.pedidos = []; S.clientes = []; S.items = [{tipo:'pre',ref:'AC1',grau:'+1',cor:'P',qty:3}]; S.nuvem.rt = 'x'; }")
            n1 = await pg.evaluate("() => window.__pedSync()")
            n2 = await pg.evaluate("() => window.__pedSync()")
            await pg.wait_for_timeout(5600)
            r = await pg.evaluate("() => { const S = window.__LF.S, p = S.pedidos[0]; return [S.pedidos.length, p.cli, p.itens[0].q, p.st, p.orig, S.clientes.length, S.clientes[0].tel, p.cliId === S.clientes[0].id, p.cliNovo]; }")
            await pg.evaluate("() => { window.__LF.S.pedF = 'novo'; window.__LF.setView('ped'); }"); await pg.wait_for_timeout(300)
            txt = await pg.inner_text('#v-ped')
            await pg.locator('[data-act=pedab]').first.click(); await pg.wait_for_timeout(300)
            det = await pg.inner_text('#v-ped')
            await pg.locator('[data-act=pedprod]').first.click(); await pg.wait_for_timeout(300)
            jan = await pg.inner_text('#v-ped .modal')
            await pg.locator('[data-act=pedprodx]').first.click(); await pg.locator('[data-act=pedav]').first.click(); await pg.wait_for_timeout(300)
            r2 = await pg.evaluate("() => [window.__LF.S.pedidos[0].st, window.__LF.S.pedF]")
            total += 1
            ok = (n1 == 1 and n2 == 0 and r == [1, 'Maria souza', 2, 'novo', 'site', 1, '0981123456', True, True] and sorted(set(apagados)) == ['abc1', 'abc2']
                  and 'Cliente novo, cadastrado automaticamente' in txt and 'novo pedido' not in txt.lower() and 'Maria souza' in det and 'Cadastrado agora' in det and 'Armação azul' in det
                  and '3 peças' in jan and 'neste pedido' in jan.lower() and r2 == ['sep', 'sep'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'pedidos do site: chegam sozinhos, cadastram o cliente, detalhe e janela da peça')
            if not ok: falhas.append('pedidos'); print('        veio', n1, n2, r, apagados, txt[:200], det[:200], jan[:200], r2, pg.erros)
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
            ok = r == [False, False, True, True, True, True, 5] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'histórico do dia: valor exato, câmbio e botões novos')
            if not ok: falhas.append('hist dia'); print('        veio', r, pg.erros)
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
            await pg.locator('.sw').first.click(); await pg.wait_for_timeout(500)
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
                await pg.wait_for_timeout(150)
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
            e1 = await pg.evaluate(est)
            if 'prec' in e1['tiles']:
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
                  and e3['nav'] == ['inicio', 'vendas', 'estoque', 'prec', 'giro'] and e4 == ['dash', 'giro'] and not pg.erros)
            print(('  ok  ' if ok else ' FALHA ') + 'acesso rápido: arrastar para a barra, trocar, tirar e abrir (máx. 5)')
            if not ok: falhas.append('acesso rapido'); print('        veio', e0, e1, e2, e3, e4, pg.erros)
            await pg.close()

            # Produtos: preço antigo → novo, canais, aviso de piso e aplicar em grupo (Reajustar)
            pg = await pagina()
            await pg.evaluate("() => { window.__LF.S.todos = false; window.__LF.setView('estoque'); }"); await pg.wait_for_timeout(500)
            ref0 = await pg.evaluate("() => document.querySelector('#rows .pcard[data-ref]').getAttribute('data-ref')")
            await pg.evaluate("r => { const S = window.__LF.S; S.pprice[r] = {novo: 123500, ant: 200000}; window.__LF.render(); }", ref0); await pg.wait_for_timeout(300)
            txt = await pg.evaluate("r => document.querySelector('#rows .pcard[data-ref=\"' + r + '\"] .zp').innerText", ref0)
            site = await pg.evaluate("r => document.querySelectorAll('#rows .zch').length === 0", ref0)
            await pg.click('#btnSelP'); await pg.wait_for_timeout(300)
            cs = pg.locator('#rows .pcard[data-ref]')
            await cs.nth(0).click(); await pg.wait_for_timeout(200); await cs.nth(1).click(); await pg.wait_for_timeout(300)
            nsel = await pg.evaluate("() => window.__LF.S.selP.length")
            await pg.locator('#selBar button:has-text("Preço…")').click(); await pg.wait_for_timeout(300)
            await pg.locator('.modal-box:has(.zlb) input').nth(1).fill('1000'); await pg.locator('.modal-box:has(.zlb) button:has-text("Aplicar")').first.click(); await pg.wait_for_timeout(300)
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

            # Início: arrastar um botão para qualquer posição (os outros abrem espaço e a ordem é gravada ao soltar)
            pg = await pagina()
            await pg.evaluate("() => { window.__LF.S.inicioT = null; window.__LF.setView('inicio'); }")
            await pg.click('[data-act=inicioEd]'); await pg.wait_for_timeout(400)
            antes = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .twrap')].map(w => w.getAttribute('data-k'))")
            bb = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .twrap')].map(w => { const r = w.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })")
            T = max(k for k in range(1, 6) if bb[k][1] < 560)  # alvo longe das bordas (a tela rola sozinha perto delas)
            await pg.mouse.move(bb[0][0], bb[0][1]); await pg.mouse.down()
            for k in range(1, 21):
                await pg.mouse.move(bb[0][0] + (bb[T][0] - bb[0][0]) * k / 20, bb[0][1] + (bb[T][1] - bb[0][1]) * k / 20); await pg.wait_for_timeout(40)
            await pg.mouse.move(bb[T][0], bb[T][1]); await pg.wait_for_timeout(400)
            meio = await pg.evaluate("() => [document.body.classList.contains('arrastando'), window.__LF.S.inicioT && window.__LF.S.inicioT.join()]")
            await pg.mouse.up(); await pg.wait_for_timeout(700)
            depois = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .twrap')].map(w => w.getAttribute('data-k'))")
            salvo = await pg.evaluate("() => window.__LF.S.inicioT.slice(0, 7)")
            total += 1
            esperado = antes[1:T + 1] + [antes[0]] + antes[T + 1:]
            ok = meio[0] is True and depois == esperado and salvo == esperado[:7] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Início: arrastar o botão para outra posição e gravar a ordem')
            if not ok: falhas.append('arrastar inicio'); print('        veio', antes, meio, depois, salvo, pg.erros)
            await pg.close()

            # Início: personalizar botões (remover, mover, adicionar, restaurar)
            pg = await pagina()
            await pg.evaluate("() => { window.__LF.S.inicioT = null; window.__LF.setView('inicio'); }")
            await pg.click('[data-act=inicioEd]'); await pg.wait_for_timeout(300)
            await pg.click('[data-act=inicioRm][data-id=ped]'); await pg.wait_for_timeout(200)
            tx = await pg.evaluate("() => [document.querySelectorAll('.tedit button').length, document.querySelectorAll('.tedit button.x').length, document.querySelectorAll('[data-act=inicioMv]').length]")
            await pg.click('[data-act=inicioAdd][data-id=novo]'); await pg.wait_for_timeout(200)
            l1 = await pg.evaluate("() => window.__LF.S.inicioT.slice()")
            await pg.click('[data-act=inicioEd]'); await pg.wait_for_timeout(200)
            await pg.evaluate("() => { window.__LF.setView('caixa'); window.__LF.setView('inicio'); }"); await pg.wait_for_timeout(200)
            nomes = await pg.evaluate("() => [...document.querySelectorAll('#v-inicio .tl .tn')].map(e => e.textContent)")
            await pg.click('[data-act=inicioEd]'); await pg.wait_for_timeout(600); await pg.click('[data-act=inicioReset]'); await pg.wait_for_timeout(300)
            l2 = await pg.evaluate("() => window.__LF.S.inicioT")
            total += 1
            ok = tx[0] == tx[1] and tx[2] == 0 and 'ped' not in l1 and l1[-1] == 'novo' and l1.index('ajustes') < l1.index('prec') + 3 and 'Novo produto' in nomes and 'Pedidos' not in nomes and l2 is None and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Início: personalizar botões')
            if not ok: falhas.append('personalizar inicio'); print('        veio', l1, nomes, l2, pg.erros)
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
            ok = r[0] is False and r[1] == 1 and r[2] == 1 and 'US$ 1 = R$' in r[3] and 'US$ 1' in r[4] and r[5] == 5800 and 'US$ 1 = R$' in r[6] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'pagamento: Outra moeda direto, câmbio em dólar e dólar da loja de 100 em 100')
            if not ok: falhas.append('pagamento outra moeda'); print('        veio', r, pg.erros)
            await pg.close()

            # cotação da loja: margem dinâmica (base 0,5%, teto 2%, 2 semanas; sobe com a alta e desce quando a moeda cai; dólar e real)
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
            ok = abs(r[0][0] - 0.0057) < 0.0002 and r[0][1] == 5700 and abs(r[1][0] - 0.02) < 1e-9 and r[1][1] == 5900 and abs(r[2][0] - 0.02) < 1e-9 and r[2][1] == 6000 and abs(r[3] - 0.005) < 1e-9 and abs(r[4][0] - 0.02) < 1e-9 and r[4][1] < 0.0056 and abs(r[5] - 0.005) < 0.002 and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'cotação da loja: margem dinâmica de 0,5% a 2%, sobe com a alta, desce na queda, dólar e real')
            if not ok: falhas.append('margem dinamica'); print('        veio', r, pg.erros)
            await pg.close()

            # aba Câmbio: período dos gráficos e gráfico do dólar em reais
            pg = await pagina()
            await pg.evaluate("() => window.__LF.setView('fx')"); await pg.wait_for_timeout(400)
            n1 = await pg.evaluate("() => document.querySelectorAll('#v-fx svg[role=img]').length")
            t1 = await pg.inner_text('#v-fx')
            await pg.locator('[data-act=fxper][data-id="14"]').click(); await pg.wait_for_timeout(300)
            on = await pg.evaluate("() => [window.__LF.S.fxPer, document.querySelector('[data-act=fxper].on').getAttribute('data-id')]")
            total += 1
            ok = n1 == 2 and 'Dólar em reais' in t1 and 'Dólar em guaranis' in t1 and 'Variação no período' in t1 and on == [14, '14'] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'aba Câmbio: dois gráficos e período escolhido')
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
              L.setView('fx'); L.render();
              const tela = document.getElementById('v-fx').innerText;
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
            pg = await pagina()
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
            await pg.fill('[data-aj="meta"]', '600'); await pg.press('[data-aj="meta"]', 'Tab'); await pg.wait_for_timeout(300)
            await pg.fill('#fnew', 'Premium'); await pg.locator('[data-act="fadd"]').click(); await pg.wait_for_timeout(300)
            await pg.fill('[data-aj="vol"]', '500'); await pg.press('[data-aj="vol"]', 'Tab'); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.metaUsd, S.faixas.map(f => f.nome).pop(), S.volume] }")
            ok = got == [600, 'Premium', 500] and not pg.erros
            print(('  ok  ' if ok else ' FALHA ') + 'Dashboard › Preços: meta, nova faixa e peças por mês (saíram de Ajustes)')
            if not ok: falhas.append('tela ajustes'); print('        veio', got, pg.erros)
            total += 1
            await pg.evaluate("() => { window.__LF.S.dTab = 'hoje'; window.__LF.setView('dash'); }"); await pg.wait_for_timeout(300)
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
            await pg.evaluate("() => window.__LF.setView('dash')"); await pg.wait_for_timeout(300)
            tx = await pg.inner_text('#v-dash')
            await checa('Dashboard: abre no Resumo e as 4 partes', all(t in tx for t in ['Resumo', 'Dinheiro', 'Giro', 'Preços']) and not pg.erros, [tx[:150], pg.erros])
            await pg.locator('[data-act="dtab"][data-id="din"]').first.click(); await pg.wait_for_timeout(300)
            tx = await pg.inner_text('#v-dash')
            await checa('Dashboard Dinheiro: resultado e fluxo em linhas que abrem', 'LIVRE PARA VOCÊ' in tx.upper() and 'Seu mês' in tx and 'Detalhes do mês' in tx and 'Próximos' in tx and not pg.erros, [tx[:200], pg.erros])
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
            await pg.evaluate("""() => { window.Capacitor = { Plugins: { BiometricAuthNative: { checkBiometry: () => Promise.resolve({isAvailable: true}), internalAuthenticate: () => Promise.resolve() } } }; const L = window.__LF; L.S._bioOk = undefined; L.S._ajForce = true; L.render(); }""")
            await pg.wait_for_timeout(500)
            await pg.locator('.sw').first.click(); await pg.wait_for_timeout(400)
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
            await pg.fill('#lockPin', '4321'); await pg.click('#lockGo'); await pg.wait_for_timeout(300)
            vis = await pg.evaluate("() => !document.getElementById('lockScr').hidden")
            await checa('PIN: certo abre', vis is False, vis)
            await ctx.close()

            # venda: formas de pagamento aparecem
            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail .vbar button').click(); await pg.wait_for_timeout(500)
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
