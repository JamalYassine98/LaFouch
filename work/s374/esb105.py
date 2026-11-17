# S374 · esboço 105 (dono 17/11 16:09 "Sim"): padrão ÚNICO dos BOTÕES DE AÇÃO (mesma função = mesma aparência).
#  PRINCIPAL (1 por tela): contorno rosa, cantos 14 px, 52 px de altura, letra 16 negrito, largura toda — como "Vender · G$" e "Começar".
#  SECUNDÁRIA: contorno neutro, pílula, 44 px, letra 15 negrito ("+ Novo objetivo", "Marcar como paga", "Ver conta"…).
#  AÇÃO EM TEXTO dentro de uma linha: rosa 14 px negrito, 44 px de toque ("Desfazer").
#  PERIGO: texto vermelho 15 px negrito, sem caixa ("Estornar", "Limpar histórico", "Remover cliente").
#  Abrir uma janela/ferramenta = levar a outro lugar → link rosa com "›" (Calculadora de preço, E se…?).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
#v-notif .gBtn.ntGd.lk100,#v-notif .gBtn.ntGd.lk100 *{color:var(--accent-fg)!important}
#v-fx .fxLk{border-radius:14px!important;min-height:52px!important;font-size:16px!important;font-weight:600!important}
.obNovo,.mpg73.b100,.btn-sc.p:not(.lk100){font-size:15px!important;font-weight:600!important}
.mpg73.b100 b,.view .mpg73.b100 .g b{font-weight:600!important}
.cxDes{font-size:14px!important;font-weight:600!important;min-height:44px}
.btn-pe.p,.dz105{font-size:15px!important;font-weight:600!important;background:none!important;border:0!important;color:var(--bad)!important;min-height:44px;padding:0 4px!important;box-shadow:none!important}
#v-dash .cnt.lx .lxT.m{color:var(--accent-fg)!important}
"""
JS=r"""()=>{document.querySelectorAll('.fxLk').forEach(e=>{e.childNodes.forEach(n=>{if(n.nodeType===3)n.textContent=n.textContent.replace(/\s*›\s*$/,'')});if(/›\s*$/.test(e.textContent))e.innerHTML=e.innerHTML.replace(/\s*›\s*$/,'')});
 [...document.querySelectorAll('.view:not([hidden]) .chip')].filter(e=>/Limpar histórico/.test(e.textContent)).forEach(e=>{e.classList.add('dz105');e.classList.remove('chip')});return 1}"""
CEN=[('a','cambio','Câmbio',"()=>window.__LF.setView('fx')","()=>{const e=document.querySelector('.view:not([hidden]) .fxLk');scrollTo({top:e.getBoundingClientRect().top+scrollY-400,behavior:'instant'})}",
      'Hoje: o principal "Registrar troca ›" é pílula, 15 px e com "›" — "Vender" e "Começar" (os outros principais) são cantos 14 px, 16 px, sem "›".',
      'Proposta: "Registrar troca" igual aos outros principais (cantos 14 px, 52 px, 16 px negrito, sem "›" — é ação, não caminho).'),
     ('b','caixa','Caixa',"()=>window.__LF.setView('caixa')","()=>{const e=document.querySelector('.view:not([hidden]) .obNovo');scrollTo({top:e.getBoundingClientRect().top+scrollY-300,behavior:'instant'})}",
      'Hoje: "+ Novo objetivo" com letra 14 px; "Desfazer" com 12 px (pequeno demais).',
      'Proposta: secundária com 15 px negrito; "Desfazer" (ação em texto) rosa 14 px negrito, 44 px de toque.'),
     ('c','despesas','Despesas',"()=>window.__LF.setView('desp')","()=>{const e=document.querySelector('.view:not([hidden]) .mpg73');scrollTo({top:e.getBoundingClientRect().top+scrollY-260,behavior:'instant'})}",
      'Hoje: "Marcar como paga" (secundária) com letra normal; as outras secundárias são negrito.',
      'Proposta: 15 px negrito, igual a todas as secundárias.'),
     ('d','pendencias','Pendências',"()=>window.__LF.setView('notif')","()=>{const e=[...document.querySelectorAll('.view:not([hidden]) .chip,.view:not([hidden]) .dz105')].find(x=>/Limpar/.test(x.textContent));if(e)scrollTo({top:e.getBoundingClientRect().top+scrollY-520,behavior:'instant'})}",
      'Hoje: "Ver conta", "Fazer"… com 13,5 px; "Limpar histórico" é uma pílula cinza cheia (apaga o histórico).',
      'Proposta: secundárias com 15 px negrito; "Limpar histórico" no padrão de perigo (vermelho 15 px, sem caixa); e "Ver todas as conferências do Guardião ›" em rosa — na v557 ficou branco, fora do padrão de link (erro meu).'),
     ('e','precos','Preços',"()=>window.__LF.inicioGo('prec')","()=>{const e=document.querySelector('.view:not([hidden]) .lxT.m');scrollTo({top:e.getBoundingClientRect().top+scrollY-380,behavior:'instant'})}",
      'Hoje: "Calculadora de preço ›" e "E se…? ›" em cinza — abrem uma ferramenta (levam a outro lugar), mas não têm a cor dos links.',
      'Proposta: link rosa com "›", como todo "ir para outro lugar".'),
     ('f','resultados','Resultados › Dia',"()=>window.__LF.inicioGo('hoje')","()=>{const e=document.querySelector('.view:not([hidden]) .btn-pe.p');scrollTo({top:e.getBoundingClientRect().top+scrollY-300,behavior:'instant'})}",
      'Hoje: "Estornar" com 13,5 px; "Ver detalhes ›" (ao lado) com 15 px.',
      'Proposta: "Estornar" no padrão de perigo — vermelho 15 px negrito, sem caixa, alinhado com "Ver detalhes ›".')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,nm,tit,abre,rola,h,p_ in CEN:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(600);pg.evaluate(abre);w(1300)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS);w(200)
                pg.evaluate(rola);w(300)
                oo.append(olho(pg));p=T+'b105_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('105%s-app-botoes-de-acao-%s-%s.jpg'%(k,nm,tema),'App · botões de ação · %s · tema %s'%(tit,tema),[h,p_],*fs)
