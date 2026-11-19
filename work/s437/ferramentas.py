# Preços: Calculadora, E se…? e Preço automático no mesmo desenho (linhas de lista) + ícone do Contador sem a bola "C" — dono 19/11 16:40
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
PREC="()=>__LF.inicioGo('prec')"
MK="()=>{const a=document.querySelector('.cntB');a&&a.setAttribute('data-anc','1')}"
MK2="()=>{const a=document.querySelector('.cntHd');a&&a.setAttribute('data-anc','1')}"
ICO={'calc':'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h4"/>',
 'ese':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
 'auto':'<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4"/><path d="M12 8v4l3 2"/>',
 'cont':'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M9 9h6M9 13h6"/>'}
import json
ROWS=r"""(ICO)=>{const cb=document.querySelector('.cntB');if(!cb||document.getElementById('ferr'))return;const S=__LF.S;
 const svg=k=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICO[k]+'</svg>';
 const on=S.pAuto&&S.pAuto.on;
 const L=[['calc','Calculadora de preço','quanto cobrar pelo custo e pelo lote','cntCalc',''],['ese','E se…?','dólar, contas, desconto ou meta: o que muda','cntEse',''],['auto','Preço automático',(on?'ligado':'desligado')+' · fica em Ajustes','view','ajustes']];
 const w=document.createElement('section');w.id='ferr';w.innerHTML='<div class="lbl" style="margin:24px 0 8px">FERRAMENTAS</div>'+L.map(x=>'<button type="button" class="nvL" data-act="'+x[3]+'"'+(x[4]?' data-id="'+x[4]+'"':'')+' style="display:flex;align-items:center;gap:16px;width:100%;height:64px;padding:0;background:none;border:0;border-bottom:1px solid var(--line2);text-align:left;color:var(--fg)"><span style="color:var(--accent);flex:0 0 24px;display:flex">'+svg(x[0])+'</span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:600">'+x[1]+'</b><small style="font-size:13px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+x[2]+'</small></span><i style="font-style:normal;font-size:22px;color:var(--mute)">›</i></button>').join('');
 w.querySelector('.nvL').style.setProperty('border-top','1px solid var(--line2)');
 cb.parentNode.insertBefore(w,cb);cb.style.setProperty('display','none','important');const pr=document.getElementById('paRow');if(pr)pr.style.setProperty('display','none','important')}"""
AV=r"""(ICO)=>{const a=document.querySelector('.cntAv');if(!a||a.dataset.ic)return;a.dataset.ic=1;a.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICO.cont+'</svg>';
 [['background','none'],['color','var(--accent)'],['width','24px'],['height','24px'],['border-radius','0'],['box-shadow','none'],['font-size','0']].forEach(q=>a.style.setProperty(q[0],q[1],'important'))}"""
def J(f): return "()=>("+f+")("+json.dumps(ICO)+")"
so=os.environ.get('SO')
if not so or 'ferr' in so:
  caso('ferramentas','Preços',[LM,PREC,MK],'#ferr,[data-anc]',J(ROWS),'Ajustes (linhas iguais)',[LM,"()=>__LF.setView('ajustes')"],'.ajS','2 links soltos + linha "Preço automático"','as 3 numa lista "FERRAMENTAS" (linhas de 64 px)','mesmo desenho das linhas de lista')
if not so or 'cont' in so:
  caso('contador_icone','Preços',[LM,PREC,MK2],'[data-anc]',J(AV),'Ajustes (ícones de linha)',[LM,"()=>__LF.setView('ajustes')"],'.ajS','bola rosa com "C"','ícone de traço rosa (livro de contas)','o mesmo conjunto de ícones')
