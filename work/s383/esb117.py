# S383 · esboço 117 (dono 17/11 23:10 "Câmbio"): Câmbio no padrão de luxo (o do Caixa/Despesas/116).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s383/';T='/tmp/s383/';os.makedirs(T,exist_ok=True)
P=r"""()=>{const v=document.getElementById('v-fx');
 const lin=(a,b,sub,dir,ult,cor)=>'<button type="button" class="cxL" style="width:100%;background:none;border:0;'+(ult?'':'border-bottom:1px solid var(--line2);')+'color:var(--fg);text-align:left;font-family:inherit;padding:13px 0;align-items:center"><span>'+a+(sub?'<small>'+sub+'</small>':'')+'</span><span style="display:flex;align-items:center;gap:10px"><span style="text-align:right"><b style="font-size:21px;font-weight:700;white-space:nowrap;display:block'+(cor?';color:'+cor:'')+'">'+b+'</b>'+(dir?'<small style="display:block;font-size:12.5px;color:'+dir[1]+';margin-top:2px">'+dir[0]+'</small>':'')+'</span><span style="color:var(--mute);font-size:20px;width:10px;text-align:right">›</span></span></button>';
 const blk=(t,c,x)=>'<section class="cxSaldo" style="margin:0 0 22px"><div class="cxLb" style="display:flex;justify-content:space-between;align-items:center">'+t+(x||'')+'</div>'+c+'</section>';
 const cot=[...v.querySelectorAll('.fxTop .fxLin')].map(b=>{const l0=b.querySelector('.lbl').textContent.trim(),l=l0.charAt(0).toUpperCase()+l0.slice(1).toLowerCase(),val=b.querySelector('b').innerText,va=b.querySelector('.fxVar');const up=va.classList.contains('up'),dn=/▼/.test(va.innerText);return [l,val,[va.innerText.replace(/\s+/g,' ').trim(),up?'var(--bad)':dn?'var(--ok)':'var(--mute)']]});
 const rp=v.querySelector('.fxRepo');const falta=rp.querySelector('.fxFal').innerText,sel=rp.querySelector('.fxSelo').innerText.replace('›','').trim(),bar=rp.querySelector('.fxBar').outerHTML,hint=rp.querySelector('.hint').innerText;
 const rows=[...v.querySelectorAll('.fxRows .fxRow')].map(b=>{const sp=b.querySelector('span');const sm=sp.querySelector('small');const t=sp.childNodes[0].textContent;return [t,sm?sm.innerText:'',b.querySelector('.hint').innerText.replace('›','').trim()]});
 let h='';
 h+=blk('Cotação de hoje',cot.map((c,i)=>lin(c[0],c[1],'',c[2],i==cot.length-1)).join(''));
 h+=blk('Reposição','<button type="button" class="cxL" style="width:100%;background:none;border:0;color:var(--fg);text-align:left;font-family:inherit;padding:10px 0 6px;align-items:center;border-bottom:0"><span style="font:600 26px var(--display,Fraunces),Georgia,serif">'+falta+'</span><span style="display:flex;align-items:center;gap:10px"><small style="font-size:12.5px;color:var(--ok);font-weight:600">'+sel+'</small><span style="color:var(--mute);font-size:20px;width:10px;text-align:right">›</span></span></button><div style="margin:4px 0 6px">'+bar+'</div><div style="font-size:12.5px;color:var(--mute)">'+hint+'</div><button type="button" class="fxLk" style="display:flex;align-items:center;justify-content:center;margin:16px 0 0;width:100%;box-sizing:border-box">Registrar troca</button>');
 h+=blk('Mais',rows.map((r,i)=>'<button type="button" class="cxL" style="width:100%;background:none;border:0;'+(i==rows.length-1?'':'border-bottom:1px solid var(--line2);')+'color:var(--fg);text-align:left;font-family:inherit;padding:13px 0;align-items:center"><span>'+r[0]+(r[1]?'<small>'+r[1]+'</small>':'')+'</span><span style="display:flex;align-items:center;gap:10px"><b style="font-size:16px;font-weight:600;white-space:nowrap">'+r[2]+'</b><span style="color:var(--mute);font-size:20px;width:10px;text-align:right">›</span></span></button>').join(''));
 [...v.querySelectorAll('section.card')].forEach(s=>s.remove());v.insertAdjacentHTML('beforeend',h);return 1}"""
CSS="#v-fx .cxSaldo .fxLk{margin-left:0!important;margin-right:0!important;}#v-fx .fxLk{border-radius:14px!important;min-height:52px!important;font-size:16px!important;font-weight:600!important;width:100%}"
with sync_playwright() as pw:
  for esc,tema in ((True,'escuro'),(False,'claro')):
    for k,nome,rola in (('a','topo',"()=>scrollTo(0,0)"),('b','fim',"()=>scrollTo(0,99999)")):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate("()=>window.__LF.setView('fx')");w(1500)
        if prop: pg.add_style_tag(content=CSS);pg.evaluate(P);w(400)
        pg.evaluate(rola);w(300)
        oo.append(olho(pg));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      prancha('117%s-app-cambio-%s-%s.jpg'%(k,nome,tema),'App · Câmbio · %s · tema %s'%('topo' if k=='a' else 'fim da tela',tema),
        ['Hoje: 3 caixas — cotações, Reposição (com selo e botão) e a lista de baixo.',
         'Proposta (igual ao Caixa/Despesas/Resumo): "COTAÇÃO DE HOJE" em linhas finas com o valor e a variação embaixo (subiu em vermelho, caiu em verde) e "›"; "REPOSIÇÃO" com o que falta em letra de título, o estado e a barra fina, e "Registrar troca" como o botão principal; "MAIS" com Últimas trocas, Preços no site e Como o app te protege. Cada linha leva para o mesmo lugar de hoje.'],*fs)
