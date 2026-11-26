# ARGUS · setor SITE · os estragos de propósito (a autoprova do site): antes de conferir o site, o Argus prova que ainda enxerga — estragos postos só
# na aba de teste (o site não muda) TÊM de ser vistos. Um lugar só para os estragos: a porta do site e a prova da Parte 7c usam estes.
import os, sys
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import etapas
PT_NO_ES = "document.addEventListener('DOMContentLoaded',()=>{const d=document.createElement('div');d.textContent='Você ganhou um presente';d.style.cssText='position:fixed;top:0;left:0;z-index:2147483647;background:#fff;color:#000;font-size:16px';document.body.appendChild(d)})"
FOTO_QUEBRADA = "document.addEventListener('DOMContentLoaded',()=>{const i=document.createElement('img');i.src='/argus-nao-existe.png';i.style.cssText='position:fixed;top:0;right:0;width:60px;height:60px;z-index:2147483647';document.body.appendChild(i)})"
SEM_SELO = "(()=>{const f=window.fetch;window.fetch=function(u,o){if(String(u).includes('cloudfunctions.net')&&o&&o.headers){o=Object.assign({},o,{headers:Object.assign({},o.headers)});delete o.headers['X-Firebase-AppCheck']}return f.call(this,u,o)}})()"
# os consertos (setor_site/consertos.py): cada um tem de ser visto quando o defeito é plantado
SEM_FOTO_PECA = "document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='#layer .modal img{visibility:hidden!important}';document.head.appendChild(s)})"
CARTAO_VAZIO = "document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='#home button .gt~* svg,#home button svg{visibility:hidden!important}';document.head.appendChild(s)})"
ESC_SURDO = "window.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopImmediatePropagation()},true)"
JANELA_SOLTA = "document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='.scrim{position:static!important}';document.head.appendChild(s)})"
DESTAQUE_PISCA = "addEventListener('load',()=>setTimeout(()=>{const s=document.createElement('style');s.textContent='#hdst img{opacity:0!important;transition:none!important}';document.head.appendChild(s);setTimeout(()=>s.remove(),250)},1500))"
# (estrago, conferência, pedaço do nome do resultado que tem de sair ACHADO)
ESTRAGOS = [('português no site em espanhol', 'idioma e fotos', PT_NO_ES, 'espanhol sem português'),
            ('foto que não carrega', 'idioma e fotos', FOTO_QUEBRADA, 'fotos carregam'),
            ('chamada à nuvem sem o selo do App Check', 'compra pela nuvem', SEM_SELO, 'selo do App Check'),
            ('peça por link direto sem foto', 'conserto: peça por link direto', SEM_FOTO_PECA, 'link direto'),
            ('cartão do Comece por aqui vazio', 'conserto: cartões do Comece por aqui', CARTAO_VAZIO, 'Comece por aqui'),
            ('Esc que não volta', 'conserto: Esc = voltar', ESC_SURDO, 'Esc '),
            ('janela solta fora da tela', 'conserto: janela solta', JANELA_SOLTA, 'janela da câmera'),
            ('Destaque que pisca ao abrir', 'conserto: Destaque sem piscar', DESTAQUE_PISCA, 'Destaque não pisca')]
def roda(pw, nav, **kw):
    """(ok, [(estrago, visto?)])"""
    R = []
    for nome, conf, js, pedaco in ESTRAGOS:
        r = etapas.roda(pw, nav, so=[conf], scripts=(js,), **kw)
        R.append((nome, any(pedaco in x[0] and x[1] == etapas.ACH for v in r.values() for x in v)))
    return all(v for _, v in R), R
