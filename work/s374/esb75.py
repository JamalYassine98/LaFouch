# S374 · esboço 75 (dono 16/11 18:12 "Vamos ver ajustes") — aba 8 da padronização dos botões, Ajustes.
# Proposta: ícones da lista sem a caixa em volta · sai a linha "Preço automático › em Preços" (só leva para outra tela; mora em Preços)
# · "Procurar impressora" = principal em contorno rosa, sem fundo · chaves como hoje (dono 18:26 prefere as originais) · Sons: sem os emojis,
# "Caixa registradora ▾" em contorno neutro e ▶ com 44 px · "Buscar atualização", "Exportar", "Importar", "Conectar à nuvem" e
# "Enviar aviso de teste" = secundárias neutras numa linha · títulos internos na mesma letra · Pagamento automático com espaço entre os blocos.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS75="""
#v-ajustes .ajIc{background:none!important}
#v-ajustes h2,#v-ajustes h3{font-family:inherit!important;font-size:16px!important;font-weight:600!important;letter-spacing:0}
#v-ajustes .impBp{background:none!important;color:var(--accent-fg)!important;border-radius:999px;font-weight:600}
#v-ajustes .avico{display:none!important}
#v-ajustes .avbot .avchip{background:none!important;border:1px solid var(--line)!important;border-radius:999px!important;font-weight:600;min-height:44px}
#v-ajustes .avbot .avplay{width:44px!important;height:44px!important;border:1px solid var(--line)!important;color:var(--fg)!important}
#v-ajustes .bsolid{background:none!important;box-shadow:none!important;border:1px solid var(--line)!important;border-radius:999px!important;color:var(--fg)!important;justify-content:center;min-height:48px;padding:0 16px!important}
#v-ajustes .bsolid>*:not(.t75){display:none!important}
#v-ajustes .bsolid .t75{font-weight:600}
#v-ajustes [data-act=bkexp],#v-ajustes [data-act=bkimp]{white-space:nowrap}
#v-ajustes .paCard .hint{margin:0 0 12px!important}#v-ajustes .paCard .paSw+.paSw,#v-ajustes .paCard .hint+.paSw{margin-top:6px}
#v-ajustes .tr75{margin-top:14px!important;display:block}
"""
JS75=r"""()=>{const v=document.getElementById('v-ajustes');const pa=v.querySelector('.ajS[data-k=pa]');if(pa)pa.remove();
 v.querySelectorAll('.avbot .avchip').forEach(c=>{const n=c.firstChild;if(n&&n.nodeType==3)n.textContent=n.textContent.replace(/^[^\wÀ-ú]+/,'')});
 v.querySelectorAll('.bsolid').forEach(b=>{const t=(b.querySelector('b')||b).textContent.trim();if(!b.querySelector('.t75')){const s=document.createElement('span');s.className='t75';s.textContent=t;b.appendChild(s)}});
 const e=v.querySelector('[data-act=bkexp]');if(e)e.textContent='Exportar';const i=v.querySelector('[data-act=bkimp]');if(i)i.textContent='Importar';
 [...v.querySelectorAll('b')].filter(b=>/^Transportadoras do Delivery$/.test(b.textContent.trim())).forEach(b=>b.classList.add('tr75'));
 return 1}"""
def tela(pg,w,k):
    pg.evaluate("()=>window.__LF.setView('ajustes')");w(900)
    if k: pg.click('.ajS[data-k=%s] .ajR'%k);w(800)
PARTES=[('a-lista','imp','#v-ajustes',0,'Lista e Impressora'),('b-pedidos','ped','.ajS[data-k=ped]',-120,'Pedidos do site'),('c-sons','av','.ajS[data-k=av]',-60,'Sons e avisos'),('d-sons-fim','av','.ajS[data-k=av] .avbot:last-of-type',-300,'Sons e avisos · fim'),('d2-atualizacao','upd','.ajS[data-k=upd]',-200,'Atualização'),('e-copias','bk','.ajS[data-k=upd]',-120,'Atualização e Cópias'),('f-pagamento','pauto','.ajS[data-k=pauto]',-300,'Pagamento automático')]
import os
if os.environ.get('SO'): PARTES=[x for x in PARTES if x[0] in os.environ['SO'].split(',')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,k,sel,off,tit in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(800);tela(pg,w,k)
                if prop: pg.add_style_tag(content=CSS75);pg.evaluate(JS75);w(300)
                if nome=='d-sons-fim': sel2="[...document.querySelectorAll('#v-ajustes .avcard')].pop()"
                else: sel2="document.querySelector('%s')"%sel
                pg.evaluate("o=>{const e=%s;scrollTo({top:Math.max(0,e.getBoundingClientRect().top+scrollY+o),behavior:'instant'})}"%sel2,off);w(350)
                oo.append(olho(pg));p=T+'a75_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('75%s-app-ajustes-botoes-%s.jpg'%(nome,tema),'App · Ajustes › botões (aba 8) · %s · tema %s'%(tit,tema),
              ['Hoje: ícones em caixa; "Preço automático" só leva a Preços; "Procurar impressora" com fundo; chaves de 28 px; sons com emojis e ▶ de 38 px; "Buscar atualização" em bloco rosa cheio; "Exportar backup" quebra em 2 linhas; títulos em duas letras.',
               'Proposta: ícones sem caixa · sai "Preço automático" (mora em Preços) · "Procurar impressora" em contorno rosa · chaves como hoje (dono 18:26) · sons sem emoji, ▶ 44 px · "Buscar atualização", "Exportar", "Importar" em contorno neutro · títulos na mesma letra · Pagamento com espaço.'],*fs)
