# S434 — esboços das alternativas de NAVEGAÇÃO (A abas · B pilha · C título › · R recomendada A+B)
# Base = app real + todos os aprovados (ap.abre base=True). Um arquivo por tela/alternativa.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
C=dict(C);O='/home/claude/lafouch/work/s434/';T='/tmp/s434/';os.makedirs(T,exist_ok=True)
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
LM="()=>{const S=__LF.S;S.lm={usd:{v:6487,c:6420},brl:{v:1196,c:1180},eur:{v:7100,c:7000},arb:{v:5.43,c:5.38},ts:Date.now(),hora:'15:00'};return 1}"
F=lambda s,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),s)
# ---- peças genéricas (valem para qualquer tela de grupo) ----
J_HELP=r"""window.__nv={
 tit:()=>[...document.querySelectorAll('h1,.dHdT')].find(h=>h.offsetHeight),
 alinhaIc:(h)=>{const top=h.closest('.top');if(!top)return;top.querySelectorAll('.ic').forEach(ic=>{if(!ic.offsetHeight)return;ic.style.transform='none';const r=document.createRange();r.selectNodeContents(h);const L=r.getClientRects()[0]||h.getBoundingClientRect();const a=L.top+L.height/2,b=ic.getBoundingClientRect();ic.style.setProperty('transform','translateY('+(a-(b.top+b.height/2)).toFixed(1)+'px)','important')})},
 anc:(h)=>{const t=h.closest('.top');if(t)return t;const d=h.closest('.dHd');const n=d.nextElementSibling;return n&&n.classList.contains('dHdS')?n:d},
 semChv:()=>{const h=__nv.tit();if(!document.getElementById('nvSt')){const st=document.createElement('style');st.id='nvSt';st.textContent='.grpH .grpChv,.grpH::after,.grpH::before,.dHdT i,.dHdT::after{display:none!important}';document.head.appendChild(st)}h.querySelectorAll('.grpChv,i').forEach(i=>i.remove());h.removeAttribute('data-act');h.removeAttribute('role');h.style.cursor='default';__nv.alinhaIc(h);return h},
 abas:(nomes,on)=>{const h=__nv.semChv();const top=__nv.anc(h);const d=document.createElement('div');d.className='trk nvAbas';d.style.cssText='display:flex;position:relative;margin:16px 0 8px;width:100%';
   d.innerHTML='<span class="trkTh" style="position:absolute;top:3px;bottom:3px;transition:left .25s cubic-bezier(.2,.8,.2,1),width .25s cubic-bezier(.2,.8,.2,1)"></span>'+nomes.map((n,i)=>'<button type="button" class="trkB'+(i==on?' on':'')+'" style="flex:1;min-height:42px;height:42px;position:relative;z-index:1;background:none;border:0;font:inherit;font-size:14px;color:'+(i==on?'var(--fg)':'var(--mute)')+'">'+n+'</button>').join('');
   top.after(d);const b=d.querySelectorAll('.trkB')[on],th=d.querySelector('.trkTh');th.style.left=b.offsetLeft+'px';th.style.width=b.offsetWidth+'px';return d},
 voltar:(txt)=>{const h=__nv.semChv();const bk=document.createElement('button');bk.className='nvBk';bk.style.cssText='display:block;background:none;border:0;padding:0;margin:-8px 0 -2px;min-height:44px;text-align:left;color:var(--mute);font:inherit;font-size:15px';bk.textContent='‹ '+txt;const a=h.closest('.top')||h.closest('.dHd');a.before(bk)},
 trocaSimb:(re,novo)=>{const e=[...document.querySelectorAll('button,[data-act]')].find(x=>re.test(x.innerText.trim())&&x.offsetHeight);if(!e)return 0;e.querySelectorAll('svg,i').forEach(s=>s.remove());e.childNodes.forEach(n=>{if(n.nodeType==3)n.nodeValue=n.nodeValue.replace(/[⌄›]\s*$/,'')});e.insertAdjacentHTML('beforeend','<span style="margin-left:4px">'+novo+'</span>');return e},
 indice:(titulo,sub,itens)=>{const h=__nv.semChv();h.textContent=titulo;const top=__nv.anc(h);const cr=top.querySelector('.crumb')||(top.classList.contains('dHdS')?top:null);if(cr){cr.textContent=sub;cr.style.setProperty('display','block','important')};(h.closest('.top')||h.closest('.dHd')).querySelectorAll('.ic,#cxIc,.dHdP').forEach(x=>x.style.display='none');let s=top.nextElementSibling;while(s){const n=s.nextElementSibling;s.style.display='none';s=n}
   const L=document.createElement('section');L.style.cssText='margin-top:16px';L.innerHTML=itens.map((it,i)=>'<div class="cxL" style="display:flex;justify-content:space-between;align-items:center;min-height:64px;padding:12px 0;border-bottom:'+(i<itens.length-1?'1px solid var(--line2)':'0')+'"><span>'+it[0]+'<small style="display:block;color:var(--mute);font-size:13px;margin-top:2px">'+it[1]+'</small></span><span style="color:var(--mute);font-size:20px">›</span></div>').join('');top.after(L)}
};1"""
def abre(pw,tela,steps=None):
  b,pg,w=ap.abre(pw,'inicio',True);w(300);pg.evaluate(LM)
  for x in (steps if steps is not None else C[tela]):
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  pg.evaluate(J_HELP);return b,pg,w
def foto(pg,nome):
  f=T+nome+'.png';pg.screenshot(path=f);return f
def alin(pg): return set((x['r'],x['ex'][0]) for x in pg.evaluate(A2))
def quadro(arq,titulo,sub,itens):
  ims=[(l,Image.open(f).convert('RGB')) for l,f in itens];w,h=ims[0][1].size;g=40
  W=g+len(ims)*(w+g);linhas=[]
  for s in sub:
    a=''
    for q in s.split(' '):
      if ImageDraw.Draw(Image.new('RGB',(4,4))).textlength((a+' '+q).strip(),font=F(30))>W-2*g and a: linhas.append(a);a=q
      else: a=(a+' '+q).strip()
    linhas.append(a)
  cab=60+50+len(linhas)*42+20;S=Image.new('RGB',(W,cab+70+h+g),'#f1eef0');d=ImageDraw.Draw(S)
  d.text((g,40),titulo,font=F(44,True),fill='#1d1418');y=110
  for l in linhas: d.text((g,y),l,font=F(30),fill='#4a3f45');y+=42
  for i,(l,im) in enumerate(ims):
    x=g+i*(w+g);d.text((x,cab+10),l,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,cab+64));d.rectangle([x-1,cab+63,x+w,cab+64+h],outline='#cfc6cb')
  S.save(O+arq,quality=90);print('ok',arq)

IC={'caixa':'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/>',
 'desp':'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 'fx':'<path d="M7 10h14l-4-4M17 14H3l4 4"/>',
 'hoje':'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
 'hist':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'}
import json as _j
_P={x[1]:x[2] for x in _j.load(open('/home/claude/lafouch/work/s434/pcnav.json')) if x[2]}
_M={'caixa':'Dinheiro','desp':'Despesas','fx':'Câmbio','hoje':'Dashboard','hist':'Histórico'}
SV0=lambda k:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+IC[k]+'</svg>'
J_B=r"""window.__nb={
 vers:(txt)=>{const h=__nv.semChv();const a=h.closest('.top')||h.closest('.dHd');const bk=document.createElement('button');bk.className='nbVs';bk.style.cssText='display:flex;align-items:center;gap:6px;background:none;border:0;padding:0;margin:0 0 4px;min-height:32px;color:var(--mute);font:inherit;font-size:12px;font-weight:600;letter-spacing:1.68px;text-transform:uppercase';bk.innerHTML='<span style="font-size:16px;letter-spacing:0;font-weight:400;transform:translateY(-1px)">‹</span>'+txt;a.before(bk);const r=document.createRange();r.selectNodeContents(h);const L=r.getClientRects()[0];const d=L.top-bk.getBoundingClientRect().bottom;bk.style.marginBottom=(4+8-d).toFixed(1)+'px'},
 indice:(titulo,sub,itens)=>{__nv.indice(titulo,sub,itens.map(x=>[x[0],x[1]]));const sec=[...document.querySelectorAll('section')].filter(x=>x.querySelector('.cxL')&&x.offsetHeight).pop();sec.querySelectorAll('.cxL').forEach((r,i)=>{const sp=r.firstElementChild;const ic=document.createElement('span');ic.innerHTML=itens[i][2];ic.style.cssText='color:var(--mute);display:flex;flex:none;width:22px;margin-right:16px';const box=document.createElement('span');box.style.cssText='display:flex;align-items:center;flex:1;min-width:0';r.prepend(box);box.append(ic,sp)})},
 rolar:(titulo)=>{window.scrollTo(0,0);const sc=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+50&&/(auto|scroll)/.test(getComputedStyle(e).overflowY));(sc[0]||document.scrollingElement).scrollTop=260;window.scrollTo(0,260);
   const hd=[...document.querySelectorAll('header,.hdr,#hdr,.appHd')].find(x=>x.offsetHeight)||document.querySelector('#sino').closest('div');const r=hd.getBoundingClientRect();
   const bar=document.createElement('div');bar.style.cssText='position:fixed;left:0;right:0;top:0;height:'+Math.max(r.bottom,72)+'px;z-index:50;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(12px);border-bottom:1px solid var(--line2);display:flex;align-items:flex-end;justify-content:center;padding-bottom:14px;font-size:16px;font-weight:600;color:var(--fg)';bar.innerHTML='<span style="position:absolute;left:24px;bottom:12px;color:var(--mute);font-size:22px;font-weight:400">‹</span>'+titulo;document.body.appendChild(bar)}
};1"""
SV=lambda k:(_P.get(_M.get(k,''),'') .replace('<svg','<svg width="22" height="22"',1)) or SV0(k)
# voltar arrastando: a tela sai para a direita e o índice aparece por trás (ilustração)
def arrasta(fr,bk,out):
  A=Image.open(bk).convert('RGB');B=Image.open(fr).convert('RGB');W,H=A.size;S=Image.new('RGB',(W,H),'black')
  a=A.crop((0,0,W,H));S.paste(a.point(lambda p:int(p*.55)),(-int(W*.12),0))
  dx=int(W*.48);sh=Image.new('L',(40,H),0)
  for x in range(40): sh.paste(int(90*(x/40)),(x,0,x+1,H))
  S.paste(Image.new('RGB',(40,H),'black'),(dx-40,0),sh);S.paste(B.crop((0,0,W-dx,H)),(dx,0));nv=int(H*0.921);S.paste(B.crop((0,nv,W,H)),(0,nv));S.save(out)
