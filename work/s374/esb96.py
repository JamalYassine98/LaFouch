# S374 · esboço 96 (dono 17/11 10:29): "não consigo saber se o site está no ar ou desligado" + "não quero 'ver o que o cliente vê'
# (desligado o cliente não vê nada); quero uma PRÉVIA do site para ver se está tudo em ordem: descontos, preços…". Em cima do 95c.
# Proposta: no topo da tela Site, a linha do estado — "● No ar · os clientes veem o catálogo" (verde) ou "● Desligado · ninguém vê o site"
# (cinza) — que abre Ajustes › Site; e "Abrir a loja como o cliente vê" vira "Prévia do site ›" (abre o site mesmo desligado, com preços,
# descontos, vitrine e temática como vão aparecer — só para você).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
s95=open('/home/claude/lafouch/work/s374/esb95.py').read()
TELA=s95.split('SITE_TELA=r"""')[1].split('"""')[0]
CSS="""
#v-site .st96{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;margin:0 0 14px;padding:12px 16px;border-radius:16px;border:1px solid var(--line);background:var(--panel);color:var(--fg);font:inherit;text-align:left}
#v-site .st96 i.d{flex:none;width:10px;height:10px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 4px color-mix(in srgb,var(--ok) 18%,transparent)}
#v-site .st96.off i.d{background:var(--mute);box-shadow:0 0 0 4px color-mix(in srgb,var(--mute) 18%,transparent)}
#v-site .st96 span{flex:1;min-width:0}#v-site .st96 b{display:block;font-size:16px;font-weight:600}#v-site .st96 small{display:block;color:var(--mute);font-size:13px;margin-top:2px}
#v-site .st96 em{font-style:normal;color:var(--mute);font-size:18px}
"""
JS=r"""(off)=>{const v=document.getElementById('v-site');const b=document.createElement('button');b.type='button';b.className='st96'+(off?' off':'');
 b.innerHTML='<i class="d"></i><span><b>'+(off?'Site desligado':'Site no ar')+'</b><small>'+(off?'Ninguém vê o catálogo agora':'Os clientes veem o catálogo agora')+'</small></span><em>›</em>';
 v.querySelector('.stG').before(b);const l=[...v.querySelectorAll('.stL')].pop();l.querySelector('b').textContent='Prévia do site';
 const s=document.createElement('small');s.className='stV';s.textContent='preços e descontos';l.querySelector('i').before(s);return 1}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,off in (('a',0),('b',1)):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(700);pg.evaluate("()=>window.__LF.setView('site')");w(900);pg.evaluate(TELA)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS,off)
                w(300);oo.append(olho(pg));p=T+'s96_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('96%s-app-tela-site-%s-%s.jpg'%(k,'desligado' if off else 'no-ar',tema),'App · Tela Site · site %s · tema %s'%('desligado' if off else 'no ar',tema),
              ['Esquerda = 95c: não dá para saber se o site está no ar ou desligado; "Abrir a loja como o cliente vê" (desligado, o cliente não vê nada).',
               'Proposta: no topo, "%s" (%s) — toque abre Ajustes › Site. Embaixo, "Prévia do site ›": abre o site mesmo desligado, com preços, descontos, vitrine e temática como vão aparecer — só para você.'%('Site desligado · Ninguém vê o catálogo agora' if off else 'Site no ar · Os clientes veem o catálogo agora','ponto cinza' if off else 'ponto verde')],*fs)
