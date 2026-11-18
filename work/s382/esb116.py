# S382 · esboço 116 (dono 17/11 22:59 "Sim"): Dashboard › Resumo, Giro e Reservas no padrão de luxo (o do Caixa e das Despesas 108).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s382/';T='/tmp/s382/'
H=r"""
window.__lux={
 lin:(a,b,sub,cor,chev,big,ult)=>'<div class="cxL" style="padding:13px 0;align-items:center'+(ult?';border-bottom:0':'')+'"><span>'+a+(sub?'<small>'+sub+'</small>':'')+'</span><span style="display:flex;align-items:center;gap:10px"><b style="font-size:'+(big?21:16)+'px;font-weight:'+(big?700:600)+';white-space:nowrap'+(cor?';color:'+cor:'')+'">'+b+'</b>'+(chev?'<span style="color:var(--mute);font-size:20px;width:10px;text-align:right">›</span>':(window.__luxAlinha?'<span style="width:10px"></span>':''))+'</span></div>',
 blk:(t,c,m)=>'<section class="cxSaldo" style="margin:'+(m||'0 0 22px')+'"><div class="cxLb">'+t+'</div>'+c+'</section>'};"""
RESUMO=H+r"""
window.__luxAlinha=1;const v=document.getElementById('v-dia'),L=window.__lux;const k=v.querySelector('section.kpis');
const ks=[...k.querySelectorAll('.kpi')].map(x=>({l:x.querySelector('.lbl').innerText.replace('›','').trim(),ch:/›/.test(x.querySelector('.lbl').innerText),b:x.querySelector('b').innerText,h:((x.querySelector('.hint')||{}).innerText||'').split('\n')[0],c:getComputedStyle(x.querySelector('b')).color}));
const cap=s=>s.charAt(0)+s.slice(1).toLowerCase();
k.outerHTML=L.blk('Hoje',ks.map((x,i)=>L.lin(cap(x.l),x.b,x.h,x.c,x.ch,true,i==ks.length-1)).join(''));
const sv=[...v.querySelectorAll('section.col')].find(x=>/Vendas do dia/i.test(x.innerText));
const cards=[...sv.querySelectorAll(':scope > .card:not(.famOc)')];const link=sv.querySelector('.gBtn');
const rows=cards.map((c,i)=>{const t=c.querySelector('b').innerText,s=c.querySelector('.hint').innerText.replace(/ · 17\/11 às/,' ·'),val=(c.innerText.match(/G\$ [\d.]+/)||[''])[0];let r=L.lin(t,val,s,'',true,false,i==cards.length-1&&i>0).replace('›','<span style="display:inline-block;'+(i==0?'transform:rotate(-180deg)':'')+'">⌄</span>');
 if(i==0){r=r.replace('border-bottom:1px','border-bottom:0');r+='<div style="padding:0 0 12px;border-bottom:1px solid var(--line2)">'+[['Recebido','G$ 58.000'],['Forma de pagamento','Dinheiro'],['Câmbio no dia','G$ 6.487 por US$'],['Custo pago','US$ 2,10'],['Lucro real','G$ 31.540']].map(x=>'<div style="display:flex;justify-content:space-between;font-size:13.5px;color:var(--sub);padding:5px 0"><span>'+x[0]+'</span><span style="color:var(--fg)">'+x[1]+'</span></div>').join('')+'<div style="text-align:center;margin-top:8px"><button type="button" class="dz105">Estornar venda</button></div></div>'}
 return r}).join('');
sv.outerHTML=L.blk('Vendas do dia · '+cards.length,rows+(link?'<button type="button" class="lk100 c101" style="display:block;margin:6px auto 0;background:none;border:0;color:var(--accent-fg);font-size:15px;font-weight:600;min-height:44px;font-family:inherit">'+link.innerText+'</button>':''));
const fc=[...v.querySelectorAll('section.card')].find(x=>/Fechamento do dia/.test(x.innerText));
const sl=[...fc.querySelectorAll('.sl')].map(x=>[x.querySelector('span').innerText,x.querySelector('b').innerText.replace(/\s*\(US\$[^)]*\)/,'')]);
fc.outerHTML=L.blk('Fechamento do dia',sl.map((x,i)=>i==sl.length-1?'<div class="cxL" style="padding:13px 0;border-bottom:0;align-items:center"><span style="font-weight:600">'+x[0]+'</span><span style="display:flex;align-items:center;gap:10px"><b style="font-size:21px;font-weight:700;white-space:nowrap">'+x[1]+'</b><span style="width:10px"></span></span></div>':L.lin(x[0],x[1],'','',false,false,false)).join(''));
return 1"""
GIRO=H+r"""
const v=document.querySelector('.view:not([hidden])'),L=window.__lux;const k=v.querySelector('section.kpis');
const ks=[...k.querySelectorAll('.kpi')].map(x=>({l:x.querySelector('.lbl').innerText.replace('›','').trim(),b:x.querySelector('b').innerText,h:((x.querySelector('.hint')||{}).innerText||''),c:getComputedStyle(x.querySelector('b')).color}));
const cap=s=>s.charAt(0)+s.slice(1).toLowerCase();
k.outerHTML=L.blk('Estoque',ks.map((x,i)=>L.lin(cap(x.l),x.b,x.h,x.c,true,true,i==ks.length-1)).join(''));return 1"""
RES=H+r"""
const v=document.querySelector('.view:not([hidden])'),L=window.__lux;const c=v.querySelector('section.card');
const tot=[...c.querySelectorAll('b')].find(b=>/34px/.test(b.getAttribute('style')||''));const falta=c.querySelector('.note');const sl=[...c.querySelectorAll('.sl')].map(x=>[x.querySelector('span').innerText,x.querySelector('b').innerText]);
const bar=c.querySelector('.bar').outerHTML;const hints=[...c.querySelectorAll('.hint')].map(h=>h.innerText);const cam=hints.find(h=>/Câmbio de hoje/.test(h))||'';const dono=hints.find(h=>/na carteira/.test(h))||'';
const seg='<span style="display:inline-flex;border:1px solid var(--line);border-radius:99px;padding:2px">'+['G$','R$','US$'].map((m,i)=>'<button type="button" style="border:0;border-radius:99px;min-height:40px;padding:0 14px;font-size:13px;font-weight:600;font-family:inherit;background:'+(i?'none':'var(--accent-soft)')+';color:'+(i?'var(--sub)':'var(--accent-fg)')+'">'+m+'</button>').join('')+'</span>';
const h='<section class="cxSaldo" style="margin:0 0 22px"><div class="cxLb" style="display:flex;justify-content:space-between;align-items:center">Livre para você'+seg+'</div>'+
 '<div style="font:600 40px var(--display,Fraunces),Georgia,serif;color:var(--bad);margin:10px 0 2px">'+tot.innerText+'</div>'+
 '<div style="font-size:14.5px;color:var(--bad);margin:0 0 10px">'+falta.innerText+'</div>'+
 sl.map(x=>L.lin(x[0],x[1],'','',false,false,false)).join('')+
 '<div style="margin:14px 0 6px">'+bar+'</div><div style="font-size:12.5px;color:var(--mute);line-height:1.5">'+dono+'<br>'+cam+'</div></section>';
c.outerHTML=h;return 1"""
CASOS=[('a','dashboard-resumo','Dashboard › Resumo (Hoje)',"()=>window.__LF.inicioGo('hoje')",RESUMO,
  'Hoje: 4 caixas empilhadas para os números, um cartão por venda (com Ver detalhes e Estornar) e o fechamento numa caixa com título dentro.',
  'Proposta (igual ao Caixa/Despesas; todos os valores na mesma coluna à direita; reposição só em guaranis): bloco "HOJE" em linhas finas com os 4 números; "VENDAS DO DIA" uma linha por venda com ⌄: o toque abre o detalhe ali mesmo (como "Ver detalhes" hoje) e embaixo vem "Estornar venda" em vermelho, que pede confirmação (111b2); "FECHAMENTO DO DIA" em linhas finas com o total em destaque.'),
 ('b','giro','Giro',"()=>window.__LF.inicioGo('giro')",GIRO,
  'Hoje: "No estoque" e "Parado 60+ dias" em duas caixas.',
  'Proposta: bloco "ESTOQUE" com duas linhas finas e "›" (cada uma leva para o mesmo lugar de hoje). As linhas que abrem embaixo já estão no padrão.'),
 ('c','reservas','Reservas',"()=>window.__LF.inicioGo('din')",RES,
  'Hoje: uma caixa grande com aviso vermelho em caixa, "G$ 0" enorme, botões de moeda soltos, texto do câmbio, barra e explicação.',
  'Proposta: "LIVRE PARA VOCÊ" com a escolha da moeda no canto (G$ · R$ · US$), o número em letra de título, o aviso como frase vermelha (sem caixa), a linha de cada moeda, a barra fina e a explicação pequena embaixo.')]
with sync_playwright() as pw:
  for k,nome,tit,abre,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abc')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate(abre);w(1800)
        if prop: pg.evaluate("()=>{"+js+"}");w(500)
        oo.append(olho(pg));fp=T+'e%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp)
        if k=='a':
          pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-dia .cxLb,#v-dia .lbl')].find(x=>/Vendas do dia/i.test(x.textContent));e&&scrollTo({top:e.getBoundingClientRect().top+scrollY-120,behavior:'instant'})}");w(300)
          fp2=T+'e%s2_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp2);fs.append(fp2)
        b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      if k=='a':
        prancha('116a-app-%s-%s.jpg'%(nome,tema),'App · %s · topo · tema %s'%(tit,tema),[h,p],fs[0],fs[2])
        prancha('116a2-app-%s-vendas-%s.jpg'%(nome,tema),'App · %s · vendas e fechamento · tema %s'%(tit,tema),[h,p],fs[1],fs[3])
      else: prancha('116%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
