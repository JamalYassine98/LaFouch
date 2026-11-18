# S381 · esboço 115 v2 (dono 17/11 22:48 "115a e 115b não estão nos padrões de luxo"): Pedidos online no padrão de luxo (o do Caixa/Despesas 108).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s381/';T='/tmp/s381/'
src=open('esb115.py').read();exec(src[src.index('PED='):src.index('BTNFIX=')])
LISTA_P=r"""()=>{const v=document.getElementById('v-ped');const cards=[...v.querySelectorAll('.pdCard')];if(!cards.length)return 0;
 const row=(n,sub,val,st,cor)=>'<button type="button" class="cxL" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);text-align:left;font-family:inherit;padding:14px 0;align-items:center"><span>'+n+'<small>'+sub+'</small></span><span style="display:flex;align-items:center;gap:10px"><span style="text-align:right"><b style="font-size:16px;font-weight:600;display:block">'+val+'</b><small style="display:block;font-size:12.5px;color:'+cor+';margin-top:2px">'+st+'</small></span><span style="color:var(--mute);font-size:20px">›</span></span></button>';
 const h='<section class="cxSaldo" style="margin-top:6px"><div class="cxLb">Feitos · 1</div>'+row('Hilda Teste','Pedido 7 · 16/11 18:42 · 1 peça','G$ 5.000','Cancelado','var(--bad)')+'</section>';
 cards[0].insertAdjacentHTML('beforebegin',h);cards.forEach(c=>c.remove());return 1}"""
DET_P=r"""()=>{const L=window.__LF;const v=document.getElementById('v-ped');const nm=L.pubNome?L.pubNome(window.__ref):'Peça';const img=(v.querySelector('.pdRow img')||{}).src||'';
 const top=v.querySelector('.top');const keep=top?top.outerHTML:'';
 const lin=(a,b,sub,ext)=>'<div class="cxL" style="padding:13px 0'+(ext||'')+'"><span>'+a+(sub?'<small>'+sub+'</small>':'')+'</span><b style="font-size:16px;font-weight:600;white-space:nowrap">'+b+'</b></div>';
 const chev=(a,sub)=>'<button type="button" class="cxL" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);text-align:left;font-family:inherit;padding:13px 0;align-items:center"><span>'+a+(sub?'<small>'+sub+'</small>':'')+'</span><span style="color:var(--mute);font-size:20px">›</span></button>';
 const blk=(t,c)=>'<section class="cxSaldo" style="margin:0 0 22px"><div class="cxLb">'+t+'</div>'+c+'</section>';
 let h=keep.replace(/<\/h1>/,'</h1>')+'<div style="font-size:14px;color:var(--bad);font-weight:600;margin:-4px 0 18px">Cancelado · 16/11 às 18:42</div>';
 h+='<div style="margin:0 0 18px"><button type="button" class="chip" style="display:inline-flex;width:auto">‹ Pedidos</button></div>';
 h+=blk('Cliente',chev('Hilda Teste','+595981000007 · 1º pedido · nova')+lin('Entrega','Retirada na loja','',';border-bottom:0'));
 h+=blk('Pagamento',lin('Forma','Banco Familiar')+lin('Valor do pedido','G$ 5.000')+lin('Valor exato da transferência','G$ 4.961','final único para achar o pagamento',';border-bottom:0'));
 h+=blk('Peças · 1','<div class="cxL" style="padding:12px 0;align-items:center"><span style="display:flex;gap:12px;align-items:center"><img src="'+img+'" style="width:52px;height:52px;border-radius:12px;background:#fff;object-fit:contain"><span>'+nm+'<small>'+window.__ref+' · 1×</small></span></span><b style="font-size:16px;font-weight:600;white-space:nowrap">G$ 5.000</b></div>'+lin('<span style="font-weight:600">Total</span>','G$ 5.000','',';border-bottom:0'));
 h+='<button type="button" class="btn-sc" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:44px;border-radius:99px;font-size:15px;font-weight:600">Falar no WhatsApp</button>';
 h+='<div style="text-align:center;margin-top:10px"><button type="button" class="dz105">Remover pedido</button></div>';
 v.innerHTML=h;scrollTo(0,0);return 1}"""
CASOS=[('a2','pedidos-lista-luxo','Pedidos online › Feitos (luxo)',PED,None,LISTA_P,
  'Hoje: cartão grande por pedido, com selo, foto, botões "Remover" e WhatsApp — fora do padrão de luxo.',
  'Proposta (igual ao Caixa e às Despesas): "FEITOS · 1" em versalete e uma linha fina por pedido — nome, "Pedido 7 · data · 1 peça", valor e o estado em cor (Cancelado em vermelho) com "›". Tocar abre o pedido; Remover e WhatsApp ficam lá dentro.'),
 ('b2','pedido-luxo','Pedido cancelado (luxo)',PED,ABRE,DET_P,
  'Hoje: caixas com bordas para cada parte, selos, "Remover" vazando, nome da peça em espanhol.',
  'Proposta: estado embaixo do título (Cancelado · data), blocos em versalete com linhas finas (Cliente com "›" para a ficha · Pagamento com os dois valores · Peças com o nome do app e o total); "Falar no WhatsApp" secundária e "Remover pedido" em vermelho (com Desfazer).'),
 ('b3','pedido-luxo-fim','Pedido cancelado (luxo) · fim da tela',PED,ABRE,DET_P,
  'Hoje (fim da tela): "Remover" vazando ao lado do WhatsApp.',
  'Proposta (fim da tela): Peças com o total, "Falar no WhatsApp" (secundária, largura toda) e "Remover pedido" em vermelho, centralizado; ao tocar, sai com "Desfazer".')]
with sync_playwright() as pw:
  for k,nome,tit,js,depois,prop_js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'a2,b2,b3').split(',')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.evaluate(js);w(1200)
        if depois: pg.evaluate(depois);w(1100)
        if prop: pg.evaluate(prop_js);w(500)
        if k=='b3': pg.evaluate("()=>scrollTo(0,99999)");w(400)
        oo.append(olho(pg));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      prancha('115%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
