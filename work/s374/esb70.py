# S374 · esboço 70 (dono 16/11 16:43 "Hoje") — aba 3 da padronização dos botões (padrão de controles 15/11), tela Hoje.
# Proposta: sai o "Fechar o dia agora" com o cartão Fechamento do caixa (dono 16:54: inútil, o dia fecha sozinho) · "Ver detalhes ›" texto rosa · "Estornar" = perigo em texto
# (vermelho, sem caixa, 44 px) · sai o selo "Venda" (a seção já diz Vendas do dia) · "Ver todas as vendas ›" e "Dias anteriores ›"
# texto rosa à esquerda · sai a janela "Despesas do dia" (dono 16:48: fora do padrão; repete "Contas do dia") — o cartão Contas do dia › leva a Despesas · títulos na mesma letra.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s374/';T='/tmp/s349/'
CSS70="""
#v-dia .card .cell{display:none}
#v-dia .card>.nav:has([data-act=estorno]){display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:2px}
#v-dia [data-act=hopen]{border:0!important;background:none!important;color:var(--accent-fg)!important;font-weight:600;padding:10px 0!important;min-height:44px}
#v-dia [data-act=hopen]::after{content:' ›'}
#v-dia [data-act=estorno]{border:0!important;background:none!important;color:var(--bad,#e07a7a)!important;font-weight:600;padding:10px 0!important;min-height:44px}
#v-dia .famV{justify-content:flex-start!important;text-align:left!important;color:var(--accent-fg)!important;font-weight:600;padding-left:2px}
#v-dia h2,#v-dia .card>b:first-child{font-family:inherit!important;font-size:16px!important;font-weight:600!important;letter-spacing:0}
#v-dia [data-act=fechar]{border-color:var(--accent)!important;color:var(--accent-fg)!important;background:none!important;font-weight:600}
#v-dia .dsp70{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:56px}
#v-dia .dsp70 span{font-size:16px;font-weight:600}#v-dia .dsp70 b{margin-left:auto;font-weight:600}#v-dia .dsp70 i{font-style:normal;color:var(--mute);font-size:18px}
"""
JS70=r"""()=>{const d=document.querySelector('#v-dia .famRec[data-id=desp]');if(d)d.remove();
 const l=[...document.querySelectorAll('#v-dia .lbl')].find(x=>/^Contas do dia/i.test(x.textContent.trim()));if(l){l.textContent=l.textContent.trim()+' ›';l.closest('.kpi,section,div').style.cursor='pointer'}const fc=document.querySelector('#v-dia [data-act=fechar]');if(fc)fc.closest('.card').remove();return !!l}"""
def tela(pg,w): pg.evaluate("()=>window.__LF.inicioGo('hoje')");w(1500)
PARTES=[('a-vendas','[data-act=estorno]','Vendas do dia',-330),('b-despesas','[data-act=famAbre]','Contas do dia e Fechamento do dia',-1150),('c-caixa','.famV[data-act=view]','Fim da tela (sem o Fechamento do caixa)',-600)]
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for nome,sel,tit,off in PARTES:
            fs=[];oo=[]
            for prop in (0,1):
                b,pg,w=ap.abre(pw,'inicio',esc);w(900);tela(pg,w)
                if prop: pg.add_style_tag(content=CSS70);pg.evaluate(JS70);w(300)
                pg.evaluate("([s,o])=>{const e=document.querySelector('#v-dia '+s);scrollTo({top:e.getBoundingClientRect().top+scrollY+o,behavior:'instant'})}",[sel,off]);w(350)
                oo.append(olho(pg));p=T+'h70_%s_%d_%d.png'%(nome,esc,prop);pg.screenshot(path=p);fs.append(p);b.close()
            print(nome,tema,'novos:',novos(oo[0],oo[1]))
            prancha('70%s-app-hoje-botoes-%s.jpg'%(nome,tema),'App · Hoje › botões (aba 3) · %s · tema %s'%(tit,tema),
              ['Hoje: "Ver detalhes" e "Estornar" com formas diferentes (Estornar com 36 px), selo "Venda" solto, links brancos no centro, Despesas do dia com a tabela escondida e a seta em cima do texto, títulos em duas letras.',
               'Proposta: sai o "Fechar o dia agora" e o cartão Fechamento do caixa (o dia fecha sozinho) · "Ver detalhes ›" texto rosa · "Estornar" perigo em texto · sem selo · links rosa à esquerda · sai a janela Despesas do dia (o cartão Contas do dia › leva a Despesas) · títulos na mesma letra.'],*fs)
