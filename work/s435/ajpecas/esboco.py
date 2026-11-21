# Esboço 20/11 23:12 (dono): Ajustes padronizado (nuvem por dentro), Peças alinhado, grupo pelo Início abre a escolha.
# Causa única das linhas tortas: pad100 (98z-s374d-padrao.js) adivinha "link solto" por "›" no fim do texto.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/semp')
import ap,importlib.util
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/ajpecas/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
src=open('/home/claude/lafouch/work/semp/ajustes.py').read();JS3=src[src.index('JS=r"""')+7:src.index('"""',src.index('JS=r"""')+7)]
NUV=r"""(lk)=>{const s=document.querySelector('#ajGrp .ajS[data-k="bk"]');s.querySelector('.ajR').click();
 setTimeout(()=>{[...s.children].forEach(c=>{if(!c.classList.contains('ajR'))c.remove()});
 const L=(t,v)=>'<button type="button" class="nvxL'+(lk?' lk100 c101':'')+'"><span>'+t+'</span><small>'+v+'</small><i aria-hidden="true">›</i></button>';
 const d=document.createElement('div');d.innerHTML='<section class="card col nvx"><button type="button" class="nvxE"><i class="ok"></i><span><b>Tudo salvo</b><small>há 50 min · 5 aparelhos</small></span></button>'+L('Voltar no tempo','15/11/2026, 14:20')+L('Lixeira','0 itens')+L('Aparelhos','5')+L('Arquivo de backup','exportar ou importar')+'</section>';
 s.appendChild(d);const r=s.querySelector('.ajRes');if(r){r.textContent='Tudo salvo';r.style.color='';r.classList.remove('al')}
s.scrollIntoView({block:'center'})},500)}"""
def tira(pg,nome,full=False,clip=None):
  pg.add_style_tag(content='#nvBar{display:none!important}');pg.wait_for_timeout(300)
  f='/tmp/e_%s.png'%nome;pg.screenshot(path=f,full_page=full);im=Image.open(f);return im.crop(clip) if clip else im
def quadro(arq,esc,q):
  H=max(im.height for _,_,im in q);g=40;W=g+len(q)*(780+g);S=Image.new('RGB',(W,H+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,24),t,font=F(34),fill=fg);d.text((x,72),s,font=F(23),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+780,120+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq,S.size)
def pecas_torto(pg,w):
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(700);pg.click('.nvL[data-id="estoque"]');w(900);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    # 1 Ajustes · Cópias e nuvem aberta
    b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=False);pg.evaluate(NUV,True);w(1200);h=tira(pg,'ajh');b.close()
    b,pg,w=ap.abre(pw,'ajustes',esc,'celular',base=True);pg.evaluate(JS3);w(300);pg.evaluate(NUV,False);w(1200);p=tira(pg,'ajp');b.close()
    quadro('esboco_ajustes_nuvem_%s.jpg'%n,esc,[('HOJE · Ajustes','nuvem: linhas viram link rosa no meio',h),('PROPOSTA · Ajustes','3 blocos (aprovado) · nuvem em linhas',p)])
    # 2 Peças
    b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);pecas_torto(pg,w);h=tira(pg,'ph');b.close()
    b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);pecas_torto(pg,w)
    pg.evaluate("()=>{document.querySelectorAll('#v-grp .lk100').forEach(e=>e.classList.remove('lk100','c101','inl'))}");w(300);p=tira(pg,'pp');b.close()
    quadro('esboco_pecas_%s.jpg'%n,esc,[('HOJE · Peças','depois de voltar do Inventário',h),('PROPOSTA · Peças','igual a Giro e preços, sempre',p)])
    # 3 grupo pelo Início
    b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);i0=tira(pg,'g0')
    pg.click('#v-inicio [data-act="inicio"][data-id="g:gp"]');w(1000);h=tira(pg,'gh')
    pg.evaluate("()=>window.__LF.setView('inicio')");w(600)
    pg.evaluate("()=>{const S=window.__LF.S;S.nvP=['grp:g:gp'];S._nvModo=1;S.nvG='g:gp';window.__LF.setView('grp')}");w(1000);p=tira(pg,'gp');b.close()
    quadro('esboco_grupo_inicio_%s.jpg'%n,esc,[('INÍCIO','toque em "Giro e preços"',i0),('HOJE · abre','pula direto para o Giro',h),('PROPOSTA · abre','a escolha do grupo',p)])
