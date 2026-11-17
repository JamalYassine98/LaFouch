# S374 · esboço 95 (dono 17/11 10:23 "Sim" à divisão): família Site enxuta, Analisador no Marketing, ajustes do site em Ajustes.
# Site = Site (resumo) · Pedidos · Mensagens · Vitrine (destaque e ordem) · Modelos (o que aparece no site).
# Marketing = Marketing · Temática · Cartões · Analisador. Ajustes do app ganha a linha "Site" (no ar, frete, PIX, idioma, avaliações, inscritos…).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
SITE_SH=r"""()=>{const d=document.getElementById('dFolha');const rs=[...d.querySelectorAll('.dOp[data-act=grpVerEsc]')];const mod=rs[1];
 rs[0].querySelector('small').textContent='Resumo da loja online';rs[3].remove();
 [['Vitrine','Destaque da semana e ordem do catálogo'],['Modelos','O que aparece no site']].forEach(x=>{const c=mod.cloneNode(true);c.classList.remove('on');c.querySelector('b').textContent=x[0];c.querySelector('small').textContent=x[1];d.querySelector('.dOp[data-act=grpGerirV]').before(c)});return 1}"""
MKT_SH=r"""()=>{const d=document.getElementById('dFolha');const rs=[...d.querySelectorAll('.dOp[data-act=grpVerEsc]')];const c=rs[rs.length-1].cloneNode(true);c.classList.remove('on');c.querySelector('b').textContent='Analisador';c.querySelector('small').textContent='Visitas do site e o que trouxe cliente';c.querySelector('i').textContent='›';d.querySelector('.dOp[data-act=grpGerirV]').before(c);
 rs[0].querySelector('small').textContent='Posts, vídeos, temática, cartões e visitas';return 1}"""
SITE_TELA=r"""()=>{const v=document.getElementById('v-site');const ns=[...v.querySelectorAll('.stN')];
 ns[2].querySelector('small').textContent='Modelos';ns[2].querySelector('b').textContent='16';ns[2].querySelector('span').textContent='no ar · 2 ocultos';
 ns[3].querySelector('small').textContent='Vitrine';ns[3].querySelector('b').textContent='—';ns[3].querySelector('span').textContent='sem destaque';
 const ls=[...v.querySelectorAll('.stL')];ls.forEach((l,i)=>{if(i<4)l.remove()});
 v.querySelector('.crumb').textContent='O que o cliente vê e faz na loja online.';return 1}"""
AJ=r"""()=>{const p=document.querySelector('#ajGrp .ajS[data-k=ped]');const c=p.cloneNode(true);c.dataset.k='site';c.querySelector('.ajR b').textContent='Site';c.querySelector('.ajRes').textContent='No ar';
 c.querySelector('.ajIc').innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>';const b=c.querySelector('.ajB');if(b)b.remove();p.before(c);return 1}"""
CEN=[('a','familia-site','Família Site (flecha do título)',"()=>{const L=window.__LF;L.setView('site');L.S._gAt='g:site';L.ACT.grpVer()}",SITE_SH,
      'Hoje: Site · Pedidos · Mensagens · Analisador — e Vitrine, Modelos, Temática, Marketing e Ajustes do site escondidos dentro da tela Site.',
      'Proposta: Site · Pedidos · Mensagens · Vitrine · Modelos — só o que o cliente vê e faz. Analisador vai para o Marketing; Ajustes do site vai para Ajustes.'),
     ('b','familia-marketing','Família Marketing (flecha do título)',"()=>{const L=window.__LF;L.setView('mkt');L.S._gAt='g:mkt';L.ACT.grpVer()}",MKT_SH,
      'Hoje: Marketing · Temática · Cartões.',
      'Proposta: + Analisador (visitas do site) — tudo o que traz cliente e mostra se deu certo fica junto.'),
     ('c','tela-site','Tela Site (resumo)',"()=>window.__LF.setView('site')",SITE_TELA,
      'Hoje: 4 números (Pedidos, Mensagens, Avisos do site, Vitrine) + 5 linhas (Destaque, Temática, Marketing, Ajustes do site, Abrir a loja).',
      'Proposta: 4 números — Pedidos, Mensagens, Modelos (no ar), Vitrine (destaque) — e só "Abrir a loja como o cliente vê ›". O resto mora na flecha do título.'),
     ('d','ajustes','Ajustes do app',"()=>window.__LF.setView('ajustes')",AJ,
      'Hoje: os ajustes do site (no ar, frete, PIX, idioma, avaliações, inscritos, GitHub, conta) ficam no painel, dentro da família Site.',
      'Proposta: linha "Site · No ar" em Ajustes, junto de "Pedidos do site"; abre os mesmos ajustes do painel, já no padrão do app.')]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for k,nm,tit,abre,js,h,pp in CEN:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(700);pg.evaluate(abre);w(1000)
                if prop: pg.evaluate(js);w(300)
                oo.append(olho(pg));p=T+'f95_%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(k,tema,'novos:',novos(oo[0],oo[1]))
            prancha('95%s-app-%s-%s.jpg'%(k,nm,tema),'App · %s · tema %s'%(tit,tema),[h,pp],*fs)
