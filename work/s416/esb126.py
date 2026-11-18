# S416 · esboço 126 (item 4 da lista S384): janelas do Câmbio — Últimas trocas e Registrar troca — no padrão de luxo.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s416/';T='/tmp/s416/'
H=r"""const J=()=>[...document.querySelectorAll('.fjJn.in')].pop().querySelector('.fjCorpo');
const LB=(t,m)=>'<div class="cxLb" style="margin:'+(m||'16px 0 4px')+'">'+t+'</div>';
const seg=(ops,on)=>'<div style="display:flex;gap:8px;flex:1">'+ops.map((o,i)=>'<button type="button" style="flex:1;min-height:44px;border-radius:999px;font-weight:600;font-size:15px;font-family:inherit;background:none;'+(i==on?'border:1.5px solid var(--accent);color:var(--accent-fg)':'border:1px solid var(--line2);color:var(--sub)')+'">'+o+'</button>').join('')+'</div>';
const lin=(a,sub,v,ult,ph)=>'<div class="cxL" style="padding:10px 0;align-items:center'+(ult?';border-bottom:0':'')+'"><span>'+a+(sub?'<small>'+sub+'</small>':'')+'</span><input class="in" value="'+v+'" placeholder="'+(ph||'')+'" inputmode="decimal" style="width:150px;text-align:right;font-weight:600"></div>';
const HI=t=>'<div style="font-size:13px;color:var(--mute);line-height:1.5;margin:6px 0 0">'+t+'</div>';"""
TROCAS=H+r"""const c=J();const sl=[...c.querySelectorAll('.sl')];c.innerHTML=sl.map((x,i)=>{const sp=x.querySelector('span');return '<div class="cxL" style="padding:11px 0;align-items:center'+(i==sl.length-1?';border-bottom:0':'')+'"><span>'+sp.childNodes[0].textContent+'<small>'+sp.querySelector('small').innerText+'</small></span><button type="button" style="background:none;border:0;color:var(--sub);font-weight:600;font-size:15px;font-family:inherit;min-height:44px;padding:0 0 0 12px;white-space:nowrap">Desfazer</button></div>'}).join('');return 1"""
TROCA=H+r"""const c=J();const h=c.querySelector('.hint').innerText,h0=c.querySelector('#trh0').innerText,pv=c.querySelector('#trPrev').innerText;
c.innerHTML=LB('Sugestão de hoje','0 0 2px')+HI(h)+LB('Reposição (necessário)','18px 0 2px')+lin('Entreguei','em reais','1400')+lin('Recebi','em dólares','258',1)+HI(h0)
+LB('Outra troca','22px 0 8px')+'<div style="display:flex;align-items:center;gap:10px;margin:0 0 8px"><span style="width:44px;color:var(--sub);font-size:14px">De</span>'+seg(['G$','US$','R$'],0)+'</div><div style="display:flex;align-items:center;gap:10px"><span style="width:44px;color:var(--sub);font-size:14px">Para</span>'+seg(['G$','US$','R$'],1)+'</div><div style="text-align:center"><button type="button" style="background:none;border:0;color:var(--accent-fg);font-weight:600;font-size:15px;font-family:inherit;min-height:44px">⇄ Inverter</button></div>'
+lin('Você troca','em guaranis','300000')+lin('Você recebe','em dólares','46,25',1)+HI(pv)
+'<button type="button" style="display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font-weight:600;font-size:16px;font-family:inherit;margin:16px 0 6px">Registrar troca</button>';return 1"""
CASOS=[('a','ultimas-trocas','Câmbio · janela Últimas trocas','trocas',TROCAS,
  'Hoje: um botão "Desfazer" com fundo em cada linha (a janela vira uma coluna de botões).',
  'Proposta: cada troca numa linha fina; "Desfazer" em texto à direita, sem fundo (igual ao Desfazer do Caixa, esboço 72), com a mesma área de toque.'),
 ('b','registrar-troca','Câmbio · janela Registrar troca','troca',TROCA,
  'Hoje: a reposição numa caixa com campos espremidos; as moedas em listas do navegador com "⇄ Inverter" no meio; os campos lado a lado.',
  'Proposta: "REPOSIÇÃO (NECESSÁRIO)" em linhas (Entreguei / Recebi, campo à direita) e a cotação embaixo; "OUTRA TROCA" com De e Para em G$ · US$ · R$ (toque, sem lista), "⇄ Inverter" em rosa; Você troca / Você recebe em linhas; "Registrar troca" é o botão principal.')]
with sync_playwright() as pw:
  for k,nome,tit,ab,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'ab')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate("()=>__LF.setView('fx')");w(1000);pg.evaluate("k=>__LF.ACT.fjAbre(k)",ab);w(1300)
        if prop: pg.evaluate("()=>{"+js+"}");w(600)
        oo.append(olho(pg));fp=T+'s%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp)
        pg.evaluate("()=>{const c=[...document.querySelectorAll('.fjJn.in')].pop();[c,c.querySelector('.fjCorpo')].forEach(e=>{if(e)e.scrollTop=9999})}");w(400);oo.append(olho(pg))
        fp2=T+'s%s2_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp2);fs.append(fp2);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[2]),novos(oo[1],oo[3]))
      prancha('126%s-app-cambio-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],fs[0],fs[2])
      if k=='b': prancha('126%s2-app-cambio-%s-fim-%s.jpg'%(k,nome,tema),'App · %s · fim da janela · tema %s'%(tit,tema),[h,p],fs[1],fs[3])
