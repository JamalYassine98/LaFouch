# S419 · esboço 132 (item 5 da lista S384): janela do Guardião no padrão de luxo.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s419/';T='/tmp/s419/'
JS=r"""()=>{const j=[...document.querySelectorAll('.ljJn')].pop();const c=j.querySelector('.ljCorpo');const col=c.firstElementChild;const hint=col.querySelector(':scope>.hint').outerHTML;
const secs=[...col.querySelectorAll(':scope>section')].map(s=>{const t=s.querySelector('.lbl').textContent;const rows=[...s.querySelectorAll('.guardI')].map((r,i,a)=>{const sp=r.querySelector('span');const nm=sp.childNodes[0].textContent;const sm=sp.querySelector('small');const st=r.querySelector('b');const btn=r.querySelector('.gBtn');const mudo=r.querySelector('.gMudo,.mu');
 const ult=i==a.length-1;
 if(!btn)return '<div class="cxL" style="padding:11px 0;align-items:center'+(ult?';border-bottom:0':'')+'"><span>'+nm+'</span><b style="font-size:14px;font-weight:600;color:var(--ok)">'+st.textContent+'</b></div>';
 return '<div class="cxL" style="padding:12px 0;align-items:center'+(ult?';border-bottom:0':'')+'"><span>'+nm+'<small>'+(sm?sm.textContent+' · ':'')+(mudo&&mudo.classList.contains('mu')?'silenciado':'<button type="button" style="background:none;border:0;padding:0;color:var(--mute);font:inherit;font-size:12.5px;min-height:44px;min-width:44px;display:inline-flex;align-items:center;vertical-align:middle;margin:-14px 0">Silenciar 7 dias</button>')+'</small></span><span style="display:flex;align-items:center;gap:12px;flex:none"><b style="font-size:15px;font-weight:700;color:'+getComputedStyle(st).color+'">'+st.textContent+'</b><button type="button" style="background:none;border:0;color:var(--accent-fg);font-weight:600;font-size:15px;font-family:inherit;min-height:44px;min-width:44px;padding:0 2px;white-space:nowrap">'+btn.textContent+' ›</button></span></div>'}).join('');
 return '<section class="cxSaldo" style="margin:18px 0 0"><div class="cxLb">'+t+'</div>'+rows+'</section>'}).join('');
col.innerHTML=hint+secs;col.style.gap='0';return 1}"""
with sync_playwright() as pw:
  for esc,tema in ((True,'escuro'),(False,'claro')):
    fs=[];oo=[]
    for prop in (0,1):
      b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate("()=>__LF.setView('notif')");w(900);pg.evaluate("()=>__LF.ACT.guardAbre()");w(1300)
      if prop: pg.evaluate(JS);w(500)
      oo.append(olho(pg));fp=T+'g_%d_%d.png'%(esc,prop);pg.screenshot(path=fp);fs.append(fp)
      pg.evaluate("()=>{const j=[...document.querySelectorAll('.ljJn')].pop();j.querySelector('.ljCorpo').scrollTop=9999;j.scrollTop=9999}");w(400);oo.append(olho(pg))
      fp2=T+'g2_%d_%d.png'%(esc,prop);pg.screenshot(path=fp2);fs.append(fp2);b.close()
    print(tema,'novos:',novos(oo[0],oo[2]),novos(oo[1],oo[3]))
    h='Hoje: cada grupo numa caixa; botões rosa cheios ("Conferir", "Ver"); "silenciar" sublinhado ao lado.'
    p='Proposta: grupos em versalete com linhas finas, sem caixa; o que está certo = ✓ verde à direita; o que pede você = número (ou !) e "Ver ›"/"Conferir ›" em texto rosa; "Silenciar 7 dias" em texto cinza na linha de baixo, sem sublinhado.'
    prancha('132a-app-guardiao-%s.jpg'%tema,'App · Guardião · tema %s'%tema,[h,p],fs[0],fs[2])
    prancha('132b-app-guardiao-fim-%s.jpg'%tema,'App · Guardião · fim da janela · tema %s'%tema,[h,p],fs[1],fs[3])
