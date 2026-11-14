# S244 · computador: Inventário usando a largura toda (números na linha das abas, busca inteira) e botões alinhados ao título SEM mudar nome nem desenho do botão.
import os, subprocess, sys, time, textwrap
A = os.path.dirname(os.path.abspath(__file__)) + '/'
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)
s41 = open(A + '../s241/gera.py').read(); j = s41.index('CSS = """') + 9; C241 = s41[j: s41.index('"""', j)]
CSS = C241 + """
.view #btnAdd,.view .mini:not(.ghost){color:#fff!important;-webkit-text-fill-color:#fff}
@media (min-width:1100px){
 /* botão da tela ao lado do título, na mesma altura do título (o botão em si não muda) */
 .view>.top{justify-content:flex-start!important;gap:18px!important;align-items:flex-start!important}
 .view>.top>div:first-child{flex:0 1 auto!important}
 .view>.top>.tabs,.view>.top>div:last-child:not(:first-child){margin-top:-3px}
 /* Inventário: os dois números sobem para a linha das abas e a busca ocupa a largura toda */
 #v-estoque{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:36px}
 #v-estoque>*{grid-column:1 / -1}
 #v-estoque>#eTabs{grid-column:1;grid-row:3}
 #v-estoque>#kpisE{grid-column:2;grid-row:3;display:flex!important;gap:34px;align-items:center;margin:0!important;align-self:center}
 #v-estoque>#kpisE .kpi[hidden],#v-estoque>#kpisE .kpi[style*="none"]{display:none!important}
 #v-estoque>#kpisE .kpi{display:flex;flex-direction:row;align-items:baseline;gap:10px;padding:0!important;min-height:0!important;background:none!important;box-shadow:none!important;border:0!important;width:auto!important}
 #v-estoque>#kpisE .kpi>*:nth-child(n+3){display:none}
 #v-estoque>#kpisE .kpi .lbl{margin:0;order:2}
 #v-estoque>.main{grid-row:6}
 #v-estoque #listCard .LFBUSCA{max-width:none!important;width:100%!important}
}
"""
PROBE = "()=>{const l=document.querySelector('#listCard');return [...l.children].slice(0,6).map(k=>k.tagName+'.'+String(k.className).split(' ').slice(0,3).join('.')+'#'+k.id+' ['+Math.round(k.getBoundingClientRect().width)+'] mw:'+getComputedStyle(k).maxWidth+' filhos:'+[...k.children].slice(0,4).map(c=>c.tagName+'.'+String(c.className).split(' ')[0]+'['+Math.round(c.getBoundingClientRect().width)+' mw:'+getComputedStyle(c).maxWidth+']').join(','))}"
def folha(nome, tit, sub, pecas, larg=100):
    lin = textwrap.wrap(sub, larg); Wt = max(p[2].width for p in pecas) + 80; Ht = 130 + 36 * len(lin) + sum(p[2].height + 70 for p in pecas)
    B = Image.new('RGB', (Wt, Ht), '#ece6ea'); d = ImageDraw.Draw(B); d.text((40, 30), tit, font=F(36, 1), fill='#2a1a28')
    for m, ln in enumerate(lin): d.text((40, 86 + m * 36), ln, font=F(25), fill='#5b4a56')
    x, y = 40, 106 + 36 * len(lin)
    for rot, cor, im in pecas: d.text((x, y), rot, font=F(26, 1), fill=cor); B.paste(im, (x, y + 44)); d.rectangle((x - 1, y + 43, x + im.width, y + 44 + im.height), outline='#c9bcc5'); y += im.height + 70
    B.save(A + 's244_%s.jpg' % nome, quality=86); print('ok', nome, flush=True)
BUSCA = sys.argv[1] if len(sys.argv) > 1 else ''
srv=subprocess.Popen([sys.executable,'-m','http.server','8830','-d',A+'../../www'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);time.sleep(1)
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for arq,W,H in (('pc1366',1366,768),('pc2560',2560,1440)):
        im={};med={}
        for modo in ('hoje','prop'):
            c=b.new_context(viewport={'width':W,'height':H},service_workers='block');c.add_init_script("try{sessionStorage.setItem('lf_ni','1')}catch(e){}");c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
            pg=c.new_page();pg.goto('http://localhost:8830/index.html#test');pg.wait_for_function('window.__LF');pg.wait_for_timeout(700)
            if modo=='prop': pg.add_style_tag(content=CSS.replace('#v-estoque #listCard .LFBUSCA', BUSCA or '#v-estoque #listCard .LFBUSCA'))
            for v in ('estoque','caixa'):
                pg.evaluate("v=>window.__LF.setView(v)",v);pg.wait_for_timeout(1100)
                if v=='estoque':
                    pass
                    med[modo]=pg.evaluate("()=>{const g=document.querySelector('#rows');const i=document.querySelector('#listCard input');const y=g?Math.round(g.getBoundingClientRect().top):0;return {primeiroProdutoEm:y,busca:i?Math.round(i.closest('label,div').getBoundingClientRect().width):0,estoura:document.documentElement.scrollWidth>innerWidth+1}}")
                p='/tmp/s244_%s_%s_%s.png'%(arq,v,modo);pg.screenshot(path=p,clip={'x':0,'y':0,'width':W,'height':int(H*(.78 if v=='estoque' else .4))});x=Image.open(p).convert('RGB');im[v,modo]=x.resize((1300,int(x.height*1300/x.width)))
            c.close()
        print(arq,med)
        folha('%s_inventario'%arq,'App · Inventário · computador %d · usando a largura toda'%W,'Os dois números sobem para a linha das abas, a busca ocupa a largura inteira e os produtos começam mais acima (de %d para %d px). O botão + Adicionar é o mesmo, só alinhado ao título.'%(med['hoje']['primeiroProdutoEm'],med['prop']['primeiroProdutoEm']),[('HOJE','#b42318',im['estoque','hoje']),('PROPOSTA','#1f8a4c',im['estoque','prop'])])
        if arq=='pc1366': folha('pc1366_caixa','App · Caixa · computador 1366 · botão alinhado ao título','O mesmo botão de sempre (ícone, sem nome novo), agora ao lado do título e na altura dele.',[('HOJE','#b42318',im['caixa','hoje']),('PROPOSTA','#1f8a4c',im['caixa','prop'])])
finally: srv.terminate()
