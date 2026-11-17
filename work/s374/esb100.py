# S374 · esboço 100 (dono 17/11 13:18 "Sim"): padrão ÚNICO de "IR PARA OUTRA TELA" (hoje 14 desenhos).
# Dois jeitos, um para cada lugar (mesma função = mesma cara):
#  1 LINHA DE LISTA que leva: igual à linha do "abrir no lugar" (título 16 px, frase, valor à direita), só que com "›" parado.
#  2 LINK SOLTO que leva: texto rosa 15 px negrito com "›" colado, 44 px de toque; sozinho = centralizado no fim do bloco; ao lado de outra ação = no lugar dele.
# "Marcar como paga ›" não leva a outra tela (é ação) → perde o "›" e vira botão secundário (contorno neutro).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
.lk100{display:block!important;width:auto!important;margin:6px auto 0!important;min-height:44px!important;padding:0 6px!important;background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;color:var(--accent-fg)!important;font:inherit;font-size:15px!important;font-weight:600!important;text-align:center!important;text-transform:none!important;letter-spacing:0!important}
.lk100.inl{display:inline-flex!important;align-items:center;margin:0!important}
.fxRows .fxRow{min-height:60px!important;padding:12px 16px!important}.fxRows .fxRow>span:first-child{font-size:16px!important;font-weight:600!important}
.fxRows .fxRow .hint{color:var(--mute)!important;font-size:14px!important;font-weight:400!important}.fxRows .fxRow span span,.fxRows .fxRow small{font-weight:400!important}
.slVai.r100{display:flex!important;align-items:center;justify-content:center;gap:0;width:100%;min-height:44px;background:none!important;border:0!important;color:var(--accent-fg)!important;font-weight:600;font-size:15px}
.slVai.r100 b{font-weight:600!important}.slVai.r100 i{display:none}
.mpg73.b100{display:flex!important;width:fit-content!important;max-width:fit-content!important;align-self:flex-start;align-items:center;justify-content:center;min-height:44px!important;padding:0 18px!important;border:1px solid var(--line)!important;border-radius:999px!important;background:none!important;color:var(--fg)!important;width:auto!important}
.view .mpg73.b100 .g b,.view .mpg73.b100 b{color:var(--fg)!important;font-weight:600!important;font-size:15px!important}
"""
JS=r"""()=>{const v=document.querySelector('.view:not([hidden])');let n=0;
 v.querySelectorAll('.lcT.cxLr,.gBtn.famV,.gBtn.ntGd').forEach(e=>{e.classList.add('lk100');n++});
 v.querySelectorAll('.btn-sc.p').forEach(e=>{e.classList.add('lk100','inl');n++});
 v.querySelectorAll('.slVai:not(.mpg73)').forEach(e=>{e.classList.add('r100');const b=e.querySelector('b');if(b&&!/›/.test(b.textContent))b.textContent=b.textContent.trim()+' ›';n++});
 v.querySelectorAll('.mpg73').forEach(e=>{e.classList.add('b100');const b=e.querySelector('b');if(b)b.textContent=b.textContent.replace(/\s*›\s*$/,'');n++});return n}"""
CEN=[('a','caixa','Caixa',"()=>window.__LF.setView('caixa')","()=>{const e=document.querySelector('.view:not([hidden]) .slVai');scrollTo({top:e.getBoundingClientRect().top+scrollY-560,behavior:'instant'})}",
      'Hoje: "Livre e reservado ›" à esquerda; "Ver o que falta repor" com a seta solta na ponta direita; "Ver todos os movimentos ›" em pílula.',
      'Proposta: os três no link solto único — rosa, 15 px, "›" colado, centralizados no fim do bloco.'),
     ('b','cambio','Câmbio',"()=>window.__LF.setView('fx')","()=>{const e=document.querySelector('.view:not([hidden]) .fxRows');scrollTo({top:e.getBoundingClientRect().top+scrollY-300,behavior:'instant'})}",
      'Hoje: "Últimas trocas", "Preços no site" e "Como o app te protege" em letra 15 px normal, cada uma de um jeito.',
      'Proposta: a linha de lista única — título 16 px negrito, frase, valor à direita e "›" parado (igual às linhas que abrem, só que com "›").'),
     ('c','resultados','Resultados › Dia',"()=>window.__LF.inicioGo('hoje')","()=>{const e=document.querySelector('.view:not([hidden]) .famV');scrollTo({top:e.getBoundingClientRect().top+scrollY-560,behavior:'instant'})}",
      'Hoje: "Ver detalhes ›" 13 px; "Ver todas as vendas do dia ›" e "Dias anteriores no Histórico ›" em pílula com fundo.',
      'Proposta: todos no link solto único (15 px, rosa); "Ver detalhes ›" fica no lugar dele, ao lado de "Estornar".'),
     ('d','despesas','Despesas',"()=>window.__LF.setView('desp')","()=>{const e=document.querySelector('.view:not([hidden]) .mpg73');scrollTo({top:e.getBoundingClientRect().top+scrollY-300,behavior:'instant'})}",
      'Hoje: "Marcar como paga ›" tem a seta de "ir para outra tela", mas não leva a lugar nenhum — marca a conta como paga.',
      'Proposta: "Marcar como paga" vira botão secundário (contorno neutro, 44 px), sem "›" — é ação, não caminho.')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,nm,tit,abre,rola,h,p_ in CEN:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate(abre);w(1300)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS);w(200)
                pg.evaluate(rola);w(300)
                oo.append(olho(pg));p=T+'n100_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('100%s-app-ir-para-outra-tela-%s-%s.jpg'%(k,nm,tema),'App · padrão "ir para outra tela" · %s · tema %s'%(tit,tema),[h,p_],*fs)
