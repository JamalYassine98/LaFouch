# S416 · esboço 125 (item 3 da lista S384): janelas do Caixa — Conferir, Novo objetivo, Retirada do dono — no padrão de luxo.
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
comum.OUT='/home/claude/lafouch/work/s416/';T='/tmp/s416/'
H=r"""const PR='<button type="button" style="display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font-weight:600;font-size:16px;font-family:inherit;margin:16px 0 0">';
const LB=t=>'<div class="cxLb" style="margin:16px 0 4px">'+t+'</div>';
const IN=(ph,v,al)=>'<input class="in" placeholder="'+ph+'" value="'+(v||'')+'" style="'+(al?'text-align:right;':'')+'width:100%">';
const seg=(ops,on)=>'<div style="display:flex;gap:8px">'+ops.map((o,i)=>'<button type="button" style="flex:1;min-height:44px;border-radius:999px;font-weight:600;font-size:15px;font-family:inherit;background:none;'+(i==on?'border:1.5px solid var(--accent);color:var(--accent-fg)':'border:1px solid var(--line2);color:var(--sub)')+'">'+o+'</button>').join('')+'</div>';
const J=k=>[...document.querySelectorAll('.cxAcao')].find(x=>x.dataset.k==k).querySelector('section.card');"""
CONF=H+r"""const s=J('cc');const lin=(n,app,v,ult)=>'<div class="cxL" style="padding:10px 0;align-items:center'+(ult?';border-bottom:0':'')+'"><span>'+n+'<small>no app '+app+'</small></span><input class="in" value="'+v+'" inputmode="decimal" style="width:150px;text-align:right;font-weight:600"></div>';
const det=s.querySelector('details');det.querySelector('summary').style.cssText='cursor:pointer;font-size:15px;color:var(--accent-fg);font-weight:600;min-height:44px;display:flex;align-items:center;list-style:none';det.querySelector('summary').innerHTML='Reservas iniciais (só na primeira vez) <span style="display:inline-block;margin-left:6px;transform:translateY(-3px)">⌄</span>';
s.innerHTML=s.children[0].outerHTML+LB('O que você contou')+lin('Guaranis','G$ 1.850.000','1.850.000')+lin('Dólares','US$ 320,00','320,00')+lin('Reais','R$ 1.400,00','1.400,00',1)+det.outerHTML+PR+'Conferir</button><button type="button" style="display:block;margin:6px auto 0;background:none;border:0;color:var(--sub);font-weight:600;font-size:15px;font-family:inherit;min-height:44px">Fechar</button>';return 1"""
OBJ=H+r"""const s=J('mel');const sel=s.querySelector('select').outerHTML;
s.innerHTML=s.querySelector('h2').outerHTML+LB('O que quer para a loja')+IN('Ex.: Reforma da vitrine')+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+'<div>'+LB('Quanto custa')+IN('G$')+'</div><div>'+LB('Quero até')+sel.replace('class="in selAl"','class="in selAl" style="width:100%"')+'</div></div>'+PR+'Guardar objetivo</button>';return 1"""
RET=H+r"""const s=J('ret');const hd=s.children[0].outerHTML,n=s.querySelector('.note.n-bad').innerHTML;const sl=[...s.querySelectorAll('.sl')];
s.innerHTML=hd+'<div style="color:var(--bad);font-size:14px;line-height:1.5;margin:10px 0 0">'+n.replace(/<b>/g,'<b style="color:var(--bad)">')+'</div>'+LB('Moeda')+seg(['G$','US$','R$'],0)+LB('Valor')+IN('0')+LB('Para quê (opcional)')+IN('Ex.: mercado')+PR+'Retirar</button>'+LB('Últimas retiradas')+sl.map((x,i)=>{const sp=x.querySelector('span'),t=sp.childNodes[0].textContent,sm=sp.querySelector('small').innerHTML;return '<div class="cxL" style="padding:11px 0;align-items:center'+(i==sl.length-1?';border-bottom:0':'')+'"><span>'+t+'<small>'+sm+'</small></span><b style="font-size:16px;font-weight:600">'+x.querySelector('b').innerText+'</b></div>'}).join('');return 1"""
CASOS=[('a','conferir','Caixa · janela Conferir o caixa',D['caixa-conferir'],CONF,
  'Hoje: as 3 moedas em campos lado a lado com o valor do app no título em maiúsculas; "Conferir" e "Fechar" iguais e pequenos.',
  'Proposta: "O QUE VOCÊ CONTOU" com uma linha por moeda (nome, "no app G$ …" embaixo, o campo à direita); "Reservas iniciais ⌄" em rosa (abre ali mesmo); "Conferir" é o botão principal (rosa, largo) e "Fechar" fica em texto embaixo.'),
 ('b','novo-objetivo','Caixa · janela Novo objetivo',D['caixa-novo-objetivo'],OBJ,
  'Hoje: "Guardar objetivo" num botão cinza.',
  'Proposta: os mesmos campos com os títulos em versalete; "Guardar objetivo" é o botão principal (rosa, largo), como nas outras janelas.'),
 ('c','retirar','Caixa · janela Retirada do dono',D['caixa-retirar'],RET,
  'Hoje: aviso numa caixa vermelha; moeda, valor e "para quê" espremidos numa linha com um "Retirar" pequeno; a lista de retiradas sem título.',
  'Proposta: o aviso como frase vermelha (sem caixa); "MOEDA" com G$ · US$ · R$; "VALOR" e "PARA QUÊ" um embaixo do outro; "Retirar" é o botão principal (rosa, largo); "ÚLTIMAS RETIRADAS" em linhas finas, cada uma com "Desfazer" como hoje.')]
with sync_playwright() as pw:
  for k,nome,tit,passos,js,h,p in [c for c in CASOS if c[0] in (os.environ.get('SO') or 'abc')]:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400)
        for x in passos: pg.evaluate(x);w(1100)
        if prop: pg.evaluate("()=>{"+js+"}");w(600)
        oo.append(olho(pg));fp=T+'r%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp)
        pg.evaluate("()=>{const a=[...document.querySelectorAll('.cxAcao.on')].pop();if(a)a.scrollTop=9999}");w(400);oo.append(olho(pg))
        fp2=T+'r%s2_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp2);fs.append(fp2);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[2]),novos(oo[1],oo[3]))
      prancha('125%s-app-caixa-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],fs[0],fs[2])
      if k=='c': prancha('125%s2-app-caixa-%s-rolado-%s.jpg'%(k,nome,tema),'App · %s · fim da janela · tema %s'%(tit,tema),[h,p],fs[1],fs[3])
