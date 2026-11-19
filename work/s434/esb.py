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
 indice:(titulo,sub,itens)=>{const h=__nv.semChv();h.textContent=titulo;const top=h.closest('.top');const cr=top.querySelector('.crumb');if(cr)cr.textContent=sub;top.querySelectorAll('.ic,#cxIc').forEach(x=>x.style.display='none');let s=top.nextElementSibling;while(s){const n=s.nextElementSibling;s.style.display='none';s=n}
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
CX=C['caixa-acoes'][:1];DS=C['dash-mes']
with sync_playwright() as pw:
  R={}
  # HOJE
  b,pg,w=abre(pw,'cx',CX);R['cx0']=foto(pg,'cx0');a0=alin(pg);b.close()
  b,pg,w=abre(pw,'ds',DS);R['ds0']=foto(pg,'ds0');d0=alin(pg);b.close()
  # A — abas no alto
  b,pg,w=abre(pw,'cx',CX);pg.evaluate("()=>__nv.abas(['Caixa','Despesas','Câmbio'],0)");w(400);R['cxA']=foto(pg,'cxA');print('A cx alin novos',alin(pg)-a0);b.close()
  b,pg,w=abre(pw,'ds',DS);pg.evaluate("()=>__nv.abas(['Dashboard','Histórico'],0)");w(400);R['dsA']=foto(pg,'dsA');print('A ds alin novos',alin(pg)-d0);b.close()
  # B — pilha
  b,pg,w=abre(pw,'cx',CX);pg.evaluate("()=>__nv.indice('Dinheiro','O dinheiro da loja',[['Caixa','O dinheiro da loja, por moeda'],['Despesas','Contas do mês e quanto cada venda separa'],['Câmbio','Cotação do dia e trocas de moeda']])");w(400);R['cxB1']=foto(pg,'cxB1');b.close()
  b,pg,w=abre(pw,'cx',CX);pg.evaluate("()=>__nv.voltar('Dinheiro')");w(400);R['cxB2']=foto(pg,'cxB2');print('B cx alin novos',alin(pg)-a0);b.close()
  # C — título com ›, abre a janela de baixo
  b,pg,w=abre(pw,'cx',CX);pg.evaluate("()=>{const h=__nv.semChv();h.setAttribute('data-act','grpVer');h.insertAdjacentHTML('beforeend','<span style=\"color:var(--mute);margin-left:8px;font-size:.8em\">›</span>')}");w(300);R['cxC1']=foto(pg,'cxC1')
  pg.evaluate("()=>__LF.ACT.grpVer()");w(900);R['cxC2']=foto(pg,'cxC2');b.close()
  # R — recomendada: abas (lado) + pilha (frente) + período › na janela de baixo
  b,pg,w=abre(pw,'ds',DS);pg.evaluate("()=>{__nv.abas(['Dashboard','Histórico'],0);__nv.trocaSimb(/^Este mês/,'›')}");w(400);R['dsR1']=foto(pg,'dsR1');print('R ds alin novos',alin(pg)-d0)
  pg.evaluate("()=>{const e=[...document.querySelectorAll('button,[data-act]')].find(x=>/^Este mês/.test(x.innerText.trim())&&x.offsetHeight);e&&e.click()}");w(900);R['dsR2']=foto(pg,'dsR2');b.close()
  b,pg,w=abre(pw,'cx',CX);pg.evaluate("()=>__nv.abas(['Caixa','Despesas','Câmbio'],0)");w(300);R['cxR1']=foto(pg,'cxR1');b.close()
  b,pg,w=abre(pw,'caixa-reservado');pg.evaluate("()=>__nv.voltar('Caixa')");w(400);R['cxR2']=foto(pg,'cxR2');b.close()
BASE='Base: app real + todos os aprovados.'
quadro('145A-caixa.jpg','Navegação A · abas no alto · Caixa',[BASE,'O título fica só "Caixa" (sem ⌄). As telas irmãs do grupo Dinheiro viram abas logo abaixo; a linha desliza (0,25 s).'],[('HOJE',R['cx0']),('PROPOSTA A',R['cxA'])])
quadro('145A-dashboard.jpg','Navegação A · abas no alto · Dashboard',[BASE,'Grupo Resultados: Dashboard · Histórico em abas. O período continua como hoje (só muda o grupo).'],[('HOJE',R['ds0']),('PROPOSTA A',R['dsA'])])
quadro('145B-caixa.jpg','Navegação B · pilha (estilo iPhone) · Dinheiro › Caixa',[BASE,'Tocar "Dinheiro" na barra de baixo abre o índice com as telas (linhas ›). Tocar uma linha empurra a tela da direita; "‹ Dinheiro" no alto volta.'],[('HOJE',R['cx0']),('B · ÍNDICE',R['cxB1']),('B · CAIXA',R['cxB2'])])
quadro('145C-caixa.jpg','Navegação C · atual corrigida · Caixa',[BASE,'O título troca de tela como hoje, mas com "›" (sai daqui) e abre a janela de baixo VER.'],[('HOJE',R['cx0']),('C · TÍTULO ›',R['cxC1']),('C · AO TOCAR',R['cxC2'])])
quadro('145R-dashboard.jpg','Recomendada (A+B) · Dashboard',[BASE,'Lado = irmãs em abas. Baixo = escolher: "Este mês ›" abre a janela de baixo do período (o "⌄" fica só para abrir no lugar).'],[('HOJE',R['ds0']),('R · ABAS + PERÍODO ›',R['dsR1']),('R · AO TOCAR NO PERÍODO',R['dsR2'])])
quadro('145R-caixa.jpg','Recomendada (A+B) · Caixa › Livre e reservado',[BASE,'Lado = abas Caixa · Despesas · Câmbio. Frente = detalhe entra da direita com um título só e "‹ Caixa" para voltar.'],[('HOJE',R['cx0']),('R · ABAS',R['cxR1']),('R · DETALHE',R['cxR2'])])
