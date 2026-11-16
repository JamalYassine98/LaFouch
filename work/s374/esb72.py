# S374 · esboço 72 (dono 16/11 17:02 "Sim" → Dinheiro) — aba 5 da padronização dos botões, tela Caixa (1ª da família Dinheiro).
# Proposta: link "Dashboard" sublinhado no meio da frase → linha "Livre e reservado ›" (texto rosa) · aviso vermelho sem o fundo
# cheio (cartão discreto, frase em vermelho, "Ver o que falta repor ›" texto rosa) · "desfazer" sublinhado e pequeno → "Desfazer"
# em texto, sem sublinhado, 44 px · "Ver todos os movimentos ›" rosa à esquerda · títulos dos cartões na mesma letra.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS72="""
#v-caixa h2{font-family:inherit!important;font-size:16px!important;font-weight:600!important;letter-spacing:0}
#v-caixa .note.n-bad{background:var(--panel)!important;border:1px solid var(--line)!important;color:var(--bad,#e07a7a)!important}
#v-caixa .note.n-bad .slVai{color:var(--accent-fg)!important}#v-caixa .note.n-bad .slVai b{font-weight:600!important}
#v-caixa [data-act=rtdes]{text-decoration:none!important;font-weight:600;display:inline-flex;align-items:center;min-height:44px;margin:-14px 0;padding:0 2px}
#v-caixa .famV{justify-content:flex-start!important;text-align:left!important;color:var(--accent-fg)!important;font-weight:600;padding-left:2px}
#v-caixa .lr72{background:none;border:0;padding:10px 0;min-height:44px;font:inherit;font-weight:600;color:var(--accent-fg);text-align:left}
"""
JS72=r"""()=>{const v=document.getElementById('v-caixa');const a=v.querySelector('a[data-act=view][data-id=dash]');if(a){const p=a.parentElement;const b=document.createElement('button');b.type='button';b.className='lr72';b.textContent='Livre e reservado ›';p.replaceWith(b)}
 v.querySelectorAll('[data-act=rtdes]').forEach(x=>x.textContent='Desfazer');return !!a}"""
def tela(pg,w): pg.evaluate("()=>window.__LF.setView('caixa')");w(1500)
PARTES=[('a-topo','#v-caixa','Caixa · topo e aviso',0),('b-movimentos','#v-caixa .famV','Caixa · movimentos',-640)]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,sel,tit,off in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(900);tela(pg,w)
                if prop: pg.add_style_tag(content=CSS72);pg.evaluate(JS72);w(300)
                pg.evaluate("([s,o])=>{const e=document.querySelector(s);scrollTo({top:Math.max(0,e.getBoundingClientRect().top+scrollY+o),behavior:'instant'})}",[sel,off]);w(350)
                oo.append(olho(pg));p=T+'c72_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]),'| hoje:',sorted(oo[0])[:3])
            prancha('72%s-app-caixa-botoes-%s.jpg'%(nome,tema),'App · Dinheiro › Caixa › botões (aba 5) · %s · tema %s'%(tit,tema),
              ['Hoje: "Dashboard" sublinhado no meio da frase (e encostado no total), aviso com fundo vermelho cheio, "desfazer" pequeno e sublinhado em cada movimento, "Ver todos" branco no centro, títulos em duas letras.',
               'Proposta: linha "Livre e reservado ›" · aviso discreto (frase vermelha, "Ver o que falta repor ›" rosa) · "Desfazer" em texto sem sublinhado, 44 px · "Ver todos os movimentos ›" rosa à esquerda · títulos na mesma letra.'],*fs)
