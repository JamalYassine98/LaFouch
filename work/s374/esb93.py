# S374 · esboço 93 (dono 17/11 09:38: "Sim [aba Site], e ... vamos trabalhar também no painel do site").
# Painel do site (catalogo/admin.html) no mesmo padrão do app, nas 6 telas, claro e escuro:
# 1 topo "‹ Sair · No ar · Cliente" com 44 px · 2 filtros de lista (Modelos, Mensagens) = ABA de linha (como no app) em vez de pílula rosa cheia ·
# 3 escolha (Analisador 7/30/3 meses) = seletor neutro (como a moeda do app) · 4 botão principal em CONTORNO rosa (hoje rosa cheio: Ativar,
# Salvar evento, Nenhum…) · 5 "Ver calendário completo ›" = texto rosa, sem caixa · 6 linhas da Vitrine e dos Ajustes num só cartão (como no app)
# · 7 ícones de linha no lugar dos emojis 📊 📷 · 8 nomes da barra de baixo 11 px (hoje 10,5).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import comum,painel
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS="""
#pnx,#st,#cl{min-height:44px!important}
nav.bn button{font-size:11px!important;letter-spacing:-.1px}
#flt,#mflt{background:none!important;border-radius:0!important;padding:0!important;border-bottom:1px solid var(--ln)!important;gap:20px!important;min-height:44px}
#flt button,#mflt button{background:none!important;border:0!important;border-radius:0!important;color:var(--mu)!important;padding:0 2px!important;min-height:44px;box-shadow:none!important;position:relative;font-weight:500!important;flex:none!important}
#flt button.on,#mflt button.on{color:var(--ac)!important;font-weight:600!important}
#flt button.on::after,#mflt button.on::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;border-radius:2px;background:var(--ac)}
#aper{background:var(--s2)!important;border:1px solid var(--ln)!important;border-radius:999px!important;padding:3px!important}
#aper button{border-radius:999px!important;color:var(--mu)!important;background:none!important;box-shadow:none!important}
#aper button.on{background:color-mix(in srgb,var(--tx) 12%,var(--s1))!important;color:var(--tx)!important;box-shadow:0 1px 3px rgba(0,0,0,.25)!important;font-weight:600}
.btn:not(.o){background:none!important;border:1px solid color-mix(in srgb,var(--ac) 55%,transparent)!important;color:var(--ac)!important;box-shadow:none!important}
.vt{background:none!important;border:0!important;color:var(--ac)!important;font-weight:600;min-height:44px}
.p207l:has(>.lin){gap:0!important;background:var(--s1);border:1px solid var(--ln);border-radius:16px;padding:0 14px!important}
.p207l>.lin{background:none!important;border:0!important;border-radius:0!important;margin:0!important;box-shadow:none!important;border-bottom:1px solid var(--ln)!important}
.p207l>.lin:last-child{border-bottom:0!important}
.ic93{width:28px;height:28px;stroke:var(--mu);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.th .ic93{width:24px;height:24px}
"""
JS=r"""()=>{const ch='<svg class="ic93" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',ca='<svg class="ic93" viewBox="0 0 24 24"><path d="M3 8h3l2-3h8l2 3h3v12H3z"/><circle cx="12" cy="13.5" r="3.5"/></svg>';
 [...document.querySelectorAll('*')].forEach(e=>{if(e.children.length)return;const t=e.textContent.trim();if(t==='📊')e.innerHTML=ch;else if(t==='📷')e.innerHTML=ca});return 1}"""
NOMES={'vit':'Vitrine','prod':'Modelos','msg':'Mensagens','tem':'Temática','anl':'Analisador','cfg':'Ajustes'}
MUDA={'vit':'topo 44 px · as 3 linhas (Ordem, Atenção, Opiniões) num só cartão · barra de baixo 11 px',
 'prod':'topo 44 px · filtros "Todos · No ar · Ocultos…" viram aba de linha (rosa só no escolhido) · ícone de foto em linha no lugar do emoji de câmera',
 'msg':'topo 44 px · "Todas · Contato · Atacado" vira aba de linha',
 'tem':'topo 44 px · "Ativar", "Salvar evento" e o evento escolhido em contorno rosa (hoje rosa cheio) · "Ver calendário completo ›" só texto rosa',
 'anl':'topo 44 px · "7 dias · 30 dias · 3 meses" vira seletor neutro (como a moeda do app) · gráfico em linha no lugar do emoji de gráfico',
 'cfg':'topo 44 px · as linhas de Ajustes num só cartão (como no app)'}
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for i,v in enumerate(painel.TELAS):
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w,log=painel.abre(pw,esc);painel.vai(pg,v);w(500)
                if prop: pg.add_style_tag(content=CSS);pg.evaluate(JS);w(300)
                if v=='tem': pg.evaluate("()=>scrollTo({top:300,behavior:'instant'})");w(200)
                oo.append(olho(pg));p=T+'p93_%s_%d_%d.png'%(v,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(v,tema,'novos:',novos(oo[0],oo[1]))
            prancha('93%s-painel-%s-%s.jpg'%('abcdef'[i],NOMES[v].lower().replace('á','a').replace('ê','e'),tema),'Painel do site · %s · tema %s'%(NOMES[v],tema),
              ['Hoje: pílulas e botões em rosa cheio, topo com 38–40 px, emojis, cartões soltos, letra 10,5 px na barra de baixo.',
               'Proposta: '+MUDA[v]+'.'],*fs)
