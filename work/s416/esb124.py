# S416 · esboço 124 (item 2 da lista S384): Dashboard em semana/mês/datas e o dia aberto do Histórico no padrão de luxo (mesmo desenho do 116 Hoje).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s416/';T='/tmp/s416/'
H=r"""
const L={
 lin:(a,b,sub,cor,chev,big,ult,tag)=>'<'+(tag||'div')+' class="cxL" style="width:100%;background:none;border:0;'+(ult?'border-bottom:0;':'border-bottom:1px solid var(--line2);')+'color:var(--fg);text-align:left;font-family:inherit;padding:13px 0;align-items:center"><span>'+a+(sub?'<small>'+sub+'</small>':'')+'</span><span style="display:flex;align-items:center;gap:10px"><b style="font-size:'+(big?21:16)+'px;font-weight:'+(big?700:600)+';white-space:nowrap'+(cor?';color:'+cor:'')+'">'+b+'</b>'+(chev?'<span style="color:var(--mute);font-size:20px;width:12px;line-height:1;display:inline-block;text-align:right">'+(chev===2?'<span style="display:inline-block;transform:translateY(-4px)">⌄</span>':'›')+'</span>':'<span style="width:12px"></span>')+'</span></'+(tag||'div')+'>',
 blk:(t,c,m)=>'<section class="cxSaldo" style="margin:'+(m||'0 0 22px')+'"><div class="cxLb">'+t+'</div>'+c+'</section>'};
const cap=s=>s.charAt(0)+s.slice(1).toLowerCase();
const kpis=(k,tit)=>{const ks=[...k.querySelectorAll(':scope > .kpi')];k.outerHTML=L.blk(tit,ks.map((x,i)=>{const lb=x.querySelector('.lbl').innerText,ch=/›/.test(lb)||/›/.test(getComputedStyle(x.querySelector('.lbl'),'::after').content),b=x.querySelector('b'),hs=[...x.querySelectorAll('.hint')].map(h=>h.innerText);let r=L.lin(cap(lb.replace('›','').trim()),b.innerText,hs[0]||'',getComputedStyle(b).color,ch,true,i==ks.length-1&&!x.querySelector('.mtBar'));const bar=x.querySelector('.mtBar');if(bar){r=r.replace('border-bottom:1px solid var(--line2);','border-bottom:0;');r+='<div style="padding:0 0 13px;'+(i==ks.length-1?'':'border-bottom:1px solid var(--line2)')+'">'+bar.outerHTML+'</div>'}return r}).join(''))};
const vendas=(sv)=>{const cards=[...sv.querySelectorAll(':scope > .card')];const vaz=sv.querySelector('.note');
 const rows=cards.map((c,i)=>{const t=c.querySelector('b').innerText,s=c.querySelector('.hint').innerText,val=c.querySelector('div[style*="text-align:right"] b').innerText;return L.lin(t,val,s,'',2,false,i==cards.length-1)}).join('');
 sv.outerHTML=L.blk('Vendas do dia'+(cards.length?' · '+cards.length:''),rows||'<div style="color:var(--mute);font-size:14.5px;padding:8px 0 4px">Nenhuma venda neste dia.</div>')};
"""
PER=H+r"""const v=document.getElementById('v-dash');const tit=v.querySelector('.dHdP').innerText.replace('⌄','').trim();
const d=v.querySelector('.dHdD');if(d){const f=x=>x.split('-').reverse().join('/');const de=d.querySelector('[data-pdat=de]').value,ate=d.querySelector('[data-pdat=ate]').value;
 d.outerHTML=L.blk('Período',L.lin('De',f(de)+' <span style="display:inline-block;transform:translateY(-3px);color:var(--mute);font-weight:400">⌄</span>','','',false,false,false,'button')+L.lin('Até',f(ate)+' <span style="display:inline-block;transform:translateY(-3px);color:var(--mute);font-weight:400">⌄</span>','','',false,false,true,'button'),'14px 0 22px')}
kpis(v.querySelector('section.kpis'),tit=='Datas'?'No período':tit);
const n=v.querySelector('.note.n-ok');if(n){n.outerHTML='<div style="display:flex;gap:10px;font-size:14.5px;line-height:1.5;color:var(--fg);padding:6px 0 14px"><span style="color:var(--ok);font-weight:700">✓</span><span>'+n.innerHTML.replace(/<b>/g,'<b style="color:var(--ok)">')+'</span></div>'}
const st=document.createElement('style');st.textContent='#v-dash .esTit{font-size:11.5px!important;letter-spacing:.14em!important;font-weight:600!important;color:var(--mute)!important;margin:6px 0 2px!important;padding:0!important}#v-dash .esLs{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;border-radius:0!important}#v-dash .esLn{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;box-shadow:none!important;padding:13px 0!important;text-align:left!important;justify-content:space-between!important;width:100%!important;display:flex!important;align-items:center!important;min-height:0!important}#v-dash .esLn .g{text-align:left!important;align-items:flex-start!important}#v-dash .esLn b{color:var(--fg)!important;font-weight:500!important;font-size:16px!important}#v-dash .esLn small{color:var(--mute)!important;font-weight:400!important;font-size:13px!important;text-align:left!important}#v-dash .esLn i{color:var(--mute)!important;font-size:20px!important}';document.head.appendChild(st);
return 1"""
DIA=H+r"""const v=document.getElementById('v-dia');const top=v.querySelector('[data-act=daytoday]').closest('.top');const c1=v.querySelector('.famC1');
const card=c1.querySelector(':scope > section.card');const h2=c1.querySelector(':scope > div > h2');const dt=h2.innerText.replace(/ de 20\d\d$/,'').replace('-feira','').replace(/ de (\w+)$/,' de $1');
card.outerHTML='<div style="display:flex;align-items:center;gap:10px;margin:6px 0 4px"><button type="button" class="ic71" aria-label="Dia anterior" style="flex:0 0 auto"><span style="font-size:22px;line-height:1">‹</span></button><button type="button" style="flex:1;background:none;border:0;color:var(--fg);font:500 19px var(--display,Fraunces),Georgia,serif;white-space:nowrap;min-height:44px">'+dt+' <span style="font:400 16px inherit;color:var(--mute);display:inline-block;transform:translateY(-3px)">⌄</span></button><button type="button" class="ic71" aria-label="Próximo dia" style="flex:0 0 auto"><span style="font-size:22px;line-height:1">›</span></button></div><div style="text-align:center;margin:0 0 18px"><button type="button" style="background:none;border:0;color:var(--accent-fg);font:600 15px inherit;min-height:44px;font-family:inherit">Voltar para hoje ›</button></div>';
h2.parentElement.remove();top.remove();
kpis(c1.querySelector('section.kpis'),'O dia');
const cx=c1.querySelector('section.famRec');if(cx){const ks=[...cx.querySelectorAll('.kpi')];cx.outerHTML=L.blk('Câmbio do dia',ks.map((x,i)=>L.lin(['Dólar em guaranis','Dólar em reais','Real em guaranis'][i],x.querySelector('b').innerText,(x.querySelector('.hint')||{}).innerText||'','',i==0,false,i==ks.length-1)).join(''))}
const sv=[...c1.querySelectorAll('section.col')].find(x=>/Vendas do dia/i.test(x.innerText));vendas(sv);return 1"""
def p_sem(pg,w): pg.evaluate("()=>{__LF.S.per='semana';__LF.S.dTab='hoje';__LF.setView('dash')}");w(1500)
def p_dat(pg,w): pg.evaluate("()=>{__LF.S.per='custom';__LF.S.perDe='2026-11-01';__LF.S.perAte='2026-11-10';__LF.S.dTab='hoje';__LF.setView('dash')}");w(1500)
def p_dia(d): 
  def f(pg,w): pg.evaluate("()=>__LF.setView('hist')");w(900);pg.click('[data-act=opendia][data-id="%s"]'%d);w(1500)
  return f
CASOS=[('a','periodo','Dashboard · Esta semana (igual em Este mês e Últimos 30 dias)',p_sem,PER,
  'Hoje: os números em 3 caixas; "O que fazer agora" numa caixa verde; "Detalhes" como hoje.',
  'Proposta (igual ao Dashboard Hoje do esboço 116): bloco "ESTA SEMANA" em linhas finas, valores na mesma coluna, a barra da meta fina embaixo da linha dela; "O que fazer agora" vira uma frase com ✓ verde, sem a caixa; "DETALHES" em linhas finas à esquerda com › (hoje são cartões com texto centralizado).'),
 ('b','datas','Dashboard · Escolher datas',p_dat,PER,
  'Hoje: dois campos de data do navegador soltos no alto.',
  'Proposta: bloco "PERÍODO" com duas linhas "De" e "Até" (o toque abre o calendário, como hoje); depois o mesmo desenho do item a.'),
 ('c','dia','Dia aberto do Histórico (16/11)',p_dia('2026-11-16'),DIA,
  'Hoje: "Voltar para hoje" sublinhado no alto; a data numa caixa com ‹ ›; a data por extenso de novo embaixo; os números em 4 caixas; o câmbio em 3 caixinhas dentro de uma caixa; cada venda num cartão.',
  'Proposta: ‹ "Segunda, 16 de novembro ⌄" › numa linha só (o toque na data abre o calendário), "Voltar para hoje ›" em rosa embaixo; "O DIA" em linhas finas (igual ao 116); "CÂMBIO DO DIA" em linhas; "VENDAS DO DIA" uma linha por venda com ⌄ (abre o detalhe e "Estornar venda", como no 116).'),
 ('d','dia-sem-venda','Dia sem venda (15/11)',p_dia('2026-11-15'),DIA,
  'Hoje: "Nenhuma venda neste dia." numa caixa azul.',
  'Proposta: o mesmo desenho do item c; embaixo de "VENDAS DO DIA" a frase em cinza, sem caixa.')]
with sync_playwright() as pw:
  for k,nome,tit,abre,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abcd')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);abre(pg,w)
        if prop: pg.evaluate("()=>{"+js+"}");w(500)
        oo.append(olho(pg));fp=T+'q%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp)
        pg.evaluate("()=>scrollTo(0,520)");w(400);oo.append(olho(pg))
        fp2=T+'q%s2_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp2);fs.append(fp2);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[2]),novos(oo[1],oo[3]))
      prancha('124%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],fs[0],fs[2])
      prancha('124%s2-app-%s-rolado-%s.jpg'%(k,nome,tema),'App · %s · depois de rolar · tema %s'%(tit,tema),[h,p],fs[1],fs[3])
