# S420 · esboço 134 (item 8 da lista S384): Inventário — ficha da peça (preço), Fornecedores, Adicionar e Editar produto.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos,alin
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s420/r/';T='/tmp/s420/'
CA="""#v-estoque .card.fnAlt,#v-estoque section.card[aria-label='Catálogo do produto'],#v-estoque [aria-label='Catálogo do produto'].card{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}
#v-estoque .pl.pick{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;padding:0!important;min-height:44px!important;display:flex!important;justify-content:space-between!important;align-items:center!important;box-shadow:none!important;color:var(--fg)!important}
#v-estoque .pl.pick .cell{background:none!important;border:0!important;padding:0!important;margin-left:10px!important;color:var(--mute)!important;font-size:13px!important}
#precoCard.zcd,#v-estoque .zcd{background:none!important;border:0!important;border-radius:0!important;padding:0!important}
#precoCard .lbl{font-size:11px!important;letter-spacing:.14em!important;color:var(--mute)!important}
#ofAbre.ofAbreBtn{background:none!important;border:1px solid var(--line)!important;color:var(--fg)!important;border-radius:999px!important;min-height:44px!important;font-weight:600}
#pvSt.ofSt{border:0!important;padding:4px 0 0!important}#pvSt.ofSt.r .ofHd{color:var(--bad)!important;text-transform:none!important;letter-spacing:0!important;font-size:14px!important;font-weight:600}
#edSite.card{background:none!important;border:0!important;border-top:1px solid var(--line2)!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;padding:12px 0!important;box-shadow:none!important}
#v-estoque details.card>summary{min-height:44px}#edSite .scLin{min-height:44px}#edSiteBtn{border:8px solid transparent!important;background-clip:padding-box!important;box-sizing:content-box!important;margin:-8px!important}
#v-estoque details.card.lrcard,#v-estoque details.card.cntP{background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;padding:13px 0!important;box-shadow:none!important}"""
PN='''#v-estoque .card.fnAlt,#v-estoque section.card[aria-label='Catálogo do produto'],#v-estoque [aria-label='Catálogo do produto'].card{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}
#v-estoque section.fnPn.card{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important}
#v-estoque .fnPn .lbl{font-size:11px!important;letter-spacing:.14em!important;color:var(--mute)!important;margin:0 0 2px!important}
#v-estoque .fnPn .sl{min-height:44px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line2);margin:0!important;padding:0!important}
#v-estoque .fnPn .hint{margin:10px 0 0!important}
#v-estoque .fnPn .gBtn{align-self:center!important;background:none!important;border:0!important;color:var(--accent-fg)!important;font-weight:600;font-size:15px!important;min-height:44px;margin:14px auto 0!important;padding:0 8px!important}'''
CB="""#lotView>section.card{background:none!important;border:0!important;border-left:0!important;border-radius:0!important;box-shadow:none!important;padding:14px 0 26px!important;border-bottom:1px solid var(--line2)!important}
#lotView>section.card .tab{background:none!important;border:0!important;color:var(--accent-fg)!important;font-weight:600;min-height:44px!important;height:44px!important;padding:0 8px!important}
#lotView>section.card .mini{background:none!important;border:0!important;color:var(--accent-fg)!important;font-weight:600;font-size:15px!important;padding:0!important;min-height:44px}
#lotView>section.card .mini{display:block;margin:6px auto 0!important}#lotView>section.card div:has(>.mini){justify-content:center!important}
#lotView>section.card .bar.lfp{height:4px!important}
#lotView>section.card .trash{background:none!important;border:0!important;width:44px!important;height:44px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;color:var(--sub)!important}
#lotView>section.card .trash svg{width:18px!important;height:18px!important}
#lotView>section.card div:has(>.trash){gap:6px!important;margin-right:-1.5px}"""
JB="""()=>{const U=el=>{let L=1e9,R=-1e9,T=1e9,B=-1e9;el.querySelectorAll('path').forEach(p=>{const q=p.getBoundingClientRect();L=Math.min(L,q.left);R=Math.max(R,q.right);T=Math.min(T,q.top);B=Math.max(B,q.bottom)});return {r:R,c:(T+B)/2}};
 document.querySelectorAll('#lotView>section.card').forEach(c=>{const g=c.querySelector('div:has(>.trash)');const t=c.querySelector('b');if(!g||!t)return;g.style.marginRight='0';g.style.marginTop='0';
  const cs=getComputedStyle(c);const cR=c.getBoundingClientRect().right-parseFloat(cs.paddingRight)-parseFloat(cs.borderRightWidth);
  const r=document.createRange();r.selectNodeContents(t);const q=r.getClientRects()[0];const ic=U(c.querySelector('.trash'));
  g.style.marginRight=(ic.r-cR)+'px';g.style.marginTop=((q.top+q.bottom)/2-ic.c)+'px'});document.querySelectorAll('#lotView>section.card .mini').forEach(m=>{if(!/›/.test(m.textContent))m.textContent+=' ›'});return [...document.querySelectorAll('#lotView>section.card')].map(c=>{const cs=getComputedStyle(c);const g=c.querySelector('div:has(>.trash)');return [c.getBoundingClientRect().right-parseFloat(cs.paddingRight),U(c.querySelector('.trash')).r,g.style.marginRight,getComputedStyle(g).marginRight]})}"""
JC="""()=>{const m=document.getElementById('addModal');m.style.setProperty('z-index','900','important');const b=m.querySelector('.modal-box');b.style.cssText+=';position:fixed;left:0;right:0;bottom:0;top:auto;margin:0 auto;max-width:640px;border-radius:22px 22px 0 0;transform:none;z-index:901;max-height:90vh;overflow:auto';
 b.insertAdjacentHTML('afterbegin','<div style="width:44px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 10px"></div>');
 [...b.querySelectorAll('button')].filter(x=>/^Fechar$/.test(x.textContent.trim())).forEach(x=>x.remove());
 [...b.querySelectorAll('.adTile')].forEach(x=>{[['flex-direction','row'],['min-height','52px'],['border-radius','999px'],['background','none'],['padding','0 12px'],['gap','8px']].forEach(q=>x.style.setProperty(q[0],q[1],'important'));x.querySelectorAll('svg').forEach(v=>{v.style.setProperty('width','20px','important');v.style.setProperty('height','20px','important')})});
 return 1}"""
JD="""()=>{const m=document.getElementById('editModal');m.style.setProperty('z-index','900','important');const b=m.querySelector('.modal-box');b.style.cssText+=';position:fixed;left:0;right:0;bottom:0;top:auto;margin:0 auto;max-width:640px;border-radius:22px 22px 0 0;z-index:901;max-height:90vh;overflow:auto';
 b.insertAdjacentHTML('afterbegin','<div style="width:44px;height:5px;border-radius:3px;background:var(--line);margin:0 auto 10px"></div>');
 const f=[...b.querySelectorAll('button')].find(x=>/^Fechar$/.test(x.textContent.trim()));if(f){f.remove()}
 b.querySelector('#edSalvar').style.cssText+=';background:none;border:1.5px solid var(--accent);border-radius:14px;min-height:52px';
 const ft=b.querySelector('.edFoot');ft.style.flexDirection='column';ft.insertAdjacentHTML('beforeend','<button type="button" style="display:block;margin:6px auto 0;background:none;border:0;color:var(--sub);font-weight:600;font-size:15px;min-height:44px;font-family:inherit">Fechar sem salvar</button>');return 1}"""
FICHA=D['inventario-ficha']
def editar(pg,w):
  for p in FICHA: pg.evaluate(p);w(1100)
  pg.evaluate("()=>{const e=[...document.querySelectorAll('[aria-label=Editar]')].find(x=>x.getBoundingClientRect().height);e&&e.click()}");w(1200)
JA="""()=>{document.querySelectorAll('#v-estoque .pl.pick>span').forEach(sp=>{const t=sp.firstChild;if(t&&t.nodeType==3)t.textContent=t.textContent.replace(/^\\s*·\\s*/,'')});const a=document.querySelector('#v-estoque .fnAt');if(!a)return 0;const fim=[...document.querySelectorAll('#v-estoque details.card')].pop();(fim||a.parentElement).after(a);a.style.cssText+=';display:flex;flex-direction:column;align-items:center;gap:0;margin:18px 0 8px';return 1}"""
def aba(t):
  def f(pg,w):
    for p in FICHA: pg.evaluate(p);w(1100)
    pg.evaluate("t=>{const b=[...document.querySelectorAll('#v-estoque .fnTab button,#v-estoque [data-act=fnTab]')].find(x=>x.textContent.trim()==t);b&&b.click()}",t);w(1100)
  return f
JT="""()=>{const a=document.querySelector('#v-estoque .fnAt');const p=document.querySelector('#v-estoque .fnPane');if(!a||!p)return 0;p.after(a);[['display','flex'],['flex-direction','column'],['align-items','center'],['gap','0'],['margin','18px 0 8px']].forEach(q=>a.style.setProperty(q[0],q[1],'important'));return 1}"""
CASOS=[('a','ficha-preco','Inventário · ficha da peça (preço)',lambda pg,w:[ (pg.evaluate(p),w(1100)) for p in FICHA],CA,JA,
  'Hoje: o preço e "No site" dentro de caixas; "% Oferta" rosa cheio; o aviso "PREJUÍZO · ABAIXO DA TRAVA" numa caixa vermelha; "Lucro real" e "De onde vem o preço" em cartões.',
  'Proposta: a ficha sai do cartão grande (fundo e largura iguais ao Dashboard); sem as caixas; "% Oferta" vira botão secundário (pílula neutra); o aviso vira frase vermelha; "No site", "Lucro real" e "De onde vem o preço" em linhas finas (abrem como hoje). Pela regra dos links, "Vender no Catálogo ›" e "Fotografar no Estúdio ›" saem do alto e vão para o FIM da ficha, centralizados.'),
 ('e','ficha-historico','Inventário · ficha da peça › Histórico',aba('Histórico'),PN,JT,
  'Hoje: "Vender no Catálogo ›" e "Fotografar no Estúdio ›" no alto; "Vendas" numa caixa dentro da ficha, com o texto mais para dentro que o resto.',
  'Proposta: ficha sem o cartão grande (igual ao Dashboard); sem a caixa — "VENDAS" em versalete e as linhas finas começam na mesma margem da ficha; valor na coluna da direita. Os dois links vão para o fim, centralizados (igual à aba Estoque).'),
 ('f','ficha-site','Inventário · ficha da peça › Site',aba('Site'),PN,JT,
  'Hoje: "No site" numa caixa; "Ver no painel online ›" encostado à esquerda; os dois links no alto.',
  'Proposta: ficha sem o cartão grande (igual ao Dashboard); sem a caixa, linhas finas na margem da ficha; "Ver no painel online ›" em texto rosa centralizado no fim do bloco (link sozinho); os dois links no fim, centralizados.'),
 ('g','ficha-preco-aba','Inventário · ficha da peça › Preço',aba('Preço'),PN,JT,
  'Hoje: "Preço" numa caixa, mais para dentro que o resto; os dois links no alto.',
  'Proposta: ficha sem o cartão grande (igual ao Dashboard); sem a caixa, linhas finas na margem da ficha, valores na coluna da direita; os dois links no fim, centralizados.'),
 ('b','fornecedores','Inventário · Fornecedores',lambda pg,w:[(pg.evaluate(p),w(1100)) for p in D['inventario-fornecedores']],CB,JB,
  'Hoje: cada compra num cartão com faixa colorida, "Editar" em caixa, lixeira e "Ver peças (57)" em pílula.',
  'Proposta: cada compra em linha fina; "Editar" em texto rosa e a lixeira sem caixa — os dois no MESMO centro da 1ª linha do nome, e o traço da lixeira termina na margem da direita (regra de alinhamento); "Ver peças (57) ›" em texto rosa, centralizado no fim da compra.'),
 ('c','adicionar','Inventário · "+" Adicionar',lambda pg,w:[(pg.evaluate(p),w(1100)) for p in D['inventario-novo']],'#addModal .adTiles .adTile{flex-direction:row!important;min-height:52px!important;border-radius:999px!important;background:none!important;padding:0 12px!important;gap:8px!important}#addModal .adTiles .adTile svg{width:20px!important;height:20px!important}',JC,
  'Hoje: caixa presa no alto, com "Fechar" e dois quadrados grandes ("Ler haste", "Foto").',
  'Proposta: a janela de baixo de sempre (arrasta ou toca fora para fechar, sem "Fechar"); "Ler haste" e "Foto" viram dois botões lado a lado com ícone; o resto igual.'),
 ('d','editar-produto','Inventário · Editar produto',editar,CA,JD,
  'Hoje: caixa presa no alto, com "Fechar" em caixa.',
  'Proposta: a janela de baixo de sempre; "Salvar alterações" é o principal (contorno rosa) e "Fechar sem salvar" fica em texto embaixo. As abas Modelo / Cores e fotos ficam iguais.')]
BL=[['#v-estoque .fnPn','.sl,.lbl,.hint,.gBtn','aba'],['#v-estoque .detgrid>.col:last-child','.pl.pick,.lbl','graus'],['#lotView>section.card',':scope>div','compra']]
with sync_playwright() as pw:
  for k,nome,tit,abre,css,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abcdefg')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);abre(pg,w)
        if prop:
          if css: pg.add_style_tag(content=css)
          if js: print('   js',str(pg.evaluate(js))[:300])
          w(500)
        oo.append(olho(pg));al=alin(pg,BL);print('  alin',k,tema,'prop' if prop else 'hoje',len(al),[ (x['r'],x['ex']) for x in al][:6]);fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp)
        if k=='a':
          pg.evaluate("()=>scrollTo(0,99999)");w(500);oo.append(olho(pg));fp=T+'%s2_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp)
        b.close()
      if k=='a':
        print(k,tema,'novos:',novos(oo[0],oo[2]),novos(oo[1],oo[3]))
        prancha('134a-app-inventario-%s-%s.jpg'%(nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],fs[0],fs[2])
        prancha('134a2-app-inventario-%s-fim-%s.jpg'%(nome,tema),'App · %s · fim da ficha · tema %s'%(tit,tema),[h,p],fs[1],fs[3])
      else:
        print(k,tema,'novos:',novos(oo[0],oo[1]))
        prancha('134%s-app-inventario-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
