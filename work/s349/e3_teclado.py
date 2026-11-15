# S349 · esboço 33: COMPUTADOR — teclado e leitor de código no Catálogo. App real; a proposta só acrescenta a tecla na busca e a janela "Atalhos". Nada implementado.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');from comum import *
from playwright.sync_api import sync_playwright
CSS=""".esK{display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 7px;border-radius:7px;border:1px solid var(--line);background:var(--panel);color:var(--mute);font:600 12px/1 inherit}
.esKs{position:absolute;right:54px;top:50%;transform:translateY(-50%);pointer-events:none}
.esAt{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:400px;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:18px 20px 14px;box-shadow:0 18px 50px rgba(0,0,0,.28);z-index:901;color:var(--fg)}
.esAt h2{margin:0 0 10px;font:400 19px/1.2 var(--display)}.esAt .l{display:flex;align-items:center;gap:12px;min-height:38px;border-top:1px solid var(--line);font-size:14px}.esAt .l:first-of-type{border-top:0}
.esAt .l span:first-child{flex:none;min-width:64px;display:flex;gap:4px}.esAt p{margin:10px 0 0;padding-top:10px;border-top:1px solid var(--line);font-size:13px;line-height:1.5;color:var(--mute)}"""
L=lambda k,t:'<div class="l"><span>'+''.join('<i class="esK" style="font-style:normal">%s</i>'%x for x in k)+'</span><span>'+t+'</span></div>'
AT='<aside class="esAt" id="esAt" aria-label="Atalhos do teclado"><h2>Atalhos</h2>'+L(['/'],'Buscar peça, código ou cor')+L(['Enter'],'Abrir a primeira peça da busca')+L(['V'],'Vender a peça aberta')+L(['Esc'],'Fechar a janela ou voltar')+L(['?'],'Mostrar ou esconder esta lista')+'<p>Leitor de código: leia a etiqueta em qualquer tela; a peça abre sozinha, pronta para vender.</p></aside>'
POE="""h=>{const i=[...document.querySelectorAll('#v-vendas input')].find(e=>e.offsetParent&&/Buscar/.test(e.placeholder||''));if(!i)return 'sem busca';const p=i.parentElement;if(getComputedStyle(p).position==='static')p.style.position='relative';
 p.insertAdjacentHTML('beforeend','<span class="esK esKs" aria-hidden="true">/</span>');[...document.body.children].forEach(c=>c.setAttribute('inert',''));document.body.insertAdjacentHTML('beforeend','<div class="ljBk" style="opacity:.5;z-index:59"></div>'+h);return 'ok'}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        fs=[];oo=[]
        for prop in (0,1):
            b,pg,w=ap.abre(pw,'vendas',esc,'pc');w(1500)
            if prop: oo.append(olho(pg));pg.add_style_tag(content=CSS);print('  ',pg.evaluate(POE,AT));w(400)
            p=T+'tc_%d_%d.png'%(esc,prop);pg.screenshot(path=p);fs.append(p)
            oo.append(olho(pg))
            b.close()
        print('teclado',tema,'achados novos:',novos(oo[0]|oo[1],oo[2]),'| fileira antes:',[x[:90] for x in (oo[0]|oo[1]) if 'fileira' in x])
        prancha('33-pc-teclado-e-leitor-%s.jpg'%tema,'App · Computador · Catálogo · tema '+tema,
          ['Hoje: no computador quase tudo é com o mouse (Esc só fecha 3 janelas); o leitor de código só escreve onde o cursor estiver.','Proposta: atalhos de teclado (a tecla "/" aparece na busca; "?" abre esta lista) e o leitor de código abre a peça em qualquer tela.'],*fs,pc=True)
