# S323: 2º lote de esboços do padrão de controles do app (telas reais, escuro e claro): Clientes, Dinheiro e Dashboard. Ajustes e Despesas já estão no padrão (sem mudança).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s321');import base
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
OUT='/home/claude/lafouch/work/s323/';T='/tmp/s323/'
F=lambda s,bd=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if bd else ''),s)
APELIDOS=":root{--card:var(--panel2);--card2:var(--panel);--mu:var(--mute);--mut:var(--mute);--muted:var(--mute);--ac:var(--accent-fg);--acc:var(--accent-fg);--tx:var(--fg);--text:var(--fg);--soft:var(--accent-soft)}"
# ação de página = pílula de contorno ao lado do título (igual ao "+ Adicionar" do Inventário); ações terciárias = links com "›" (iguais a "Vender no Catálogo ›" da ficha)
CLI="""()=>{const s=document.createElement('style');s.textContent=%r+'#v-clientes .top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}#v-clientes .top>div:first-child{flex:1 1 0!important;min-width:0;width:auto!important}#v-clientes .top .s23n{flex:none!important;min-height:44px;padding:0 16px;border:1px solid color-mix(in srgb,var(--fg) 28%%,transparent)!important;border-radius:999px!important;background:none!important;box-shadow:none!important;color:var(--fg)!important;font-weight:600;font-size:15px}#v-clientes .s23l{flex:1 0 100%%;display:flex;gap:20px;margin:2px 0 6px}#v-clientes .s23l button{flex:none!important;min-height:44px;padding:0!important;border:0!important;background:none!important;box-shadow:none!important;color:var(--fg)!important;font-weight:500;font-size:15px}';document.head.appendChild(s);
  const t=document.querySelector('#v-clientes .top'),tabs=t.querySelector('.tabs'),n=tabs.querySelector('[data-act=clinovo]');n.className='s23n';t.insertBefore(n,tabs);tabs.className='s23l';[...tabs.querySelectorAll('button')].forEach(b=>{b.className='';b.textContent=b.textContent.trim()+' ›'});return 'ok'}"""%APELIDOS
# Dinheiro: botão de ícone no mesmo formato dos outros (quadrado arredondado); "+ Novo objetivo" como ação secundária de contorno (sem tracejado)
DIN="""()=>{const s=document.createElement('style');s.textContent=%r+'#v-caixa .top .ic{border-radius:14px!important}.obNovo{border:1px solid color-mix(in srgb,var(--fg) 28%%,transparent)!important;border-radius:999px!important;min-height:44px!important;font-weight:600}';document.head.appendChild(s);return 'ok'}"""%APELIDOS
# Dashboard: título na mesma letra serifada das outras telas
DASH="""()=>{const s=document.createElement('style');s.textContent=%r+'#v-dash .dHdT{font:500 28px/1.15 Fraunces,Georgia,"Times New Roman",serif!important;letter-spacing:-.01em!important}#v-dash .dHdT i{font-family:"Segoe UI",system-ui,sans-serif;font-size:18px}';document.head.appendChild(s);return 'ok'}"""%APELIDOS
INJ={'clientes':CLI,'caixa':DIN,'dash':DASH}
def tela(pw,v,escuro,prop):
    b,pg,w=base.abre(pw,v,escuro)
    if prop: print('  inj:',pg.evaluate(INJ[v]));w(500)
    p=T+'%s_%d_%d.png'%(v,escuro,prop);pg.screenshot(path=p)
    cen=pg.evaluate(open('/home/claude/lafouch/work/kit/centro.js').read());sob=pg.evaluate(open('/home/claude/lafouch/work/kit/sobre.js').read())
    olho=[(f['r'],tuple(f.get('ex') or [])) for f in (pg.evaluate(open('/home/claude/lafouch/work/kit/olho.js').read()) or [])]
    b.close();return p,set(map(str,cen))|set(map(str,sob))|set(map(str,olho))
def prancha(nome,titulo,sub,cols):
    ims=[Image.open(p) for p,_ in cols];w,h=ims[0].size;g=40;top=250;W=g+len(ims)*(w+g);H=top+h+g
    S=Image.new('RGB',(W,H),'#f1eef0');d=ImageDraw.Draw(S)
    d.text((g,34),titulo,font=F(44,True),fill='#1d1418');d.text((g,98),sub,font=F(27),fill='#55484f')
    for i,(im,(p,r)) in enumerate(zip(ims,cols)):
        x=g+i*(w+g);d.text((x,170),r,font=F(34,True),fill='#8d3a69' if i else '#1d1418');S.paste(im,(x,top));d.rectangle([x-1,top-1,x+w,top+h],outline='#cfc6cb')
    S.save(OUT+nome,quality=88);print(' ',nome)
with sync_playwright() as pw:
    for v,arq,tit,sub in (('clientes','4-clientes','Clientes','"+ Novo cliente" vira a ação da página (igual ao "+ Adicionar"); os outros três viram links com "›".'),
                          ('caixa','5-dinheiro','Dinheiro','Botão de ícone no formato dos outros; "+ Novo objetivo" em contorno, sem tracejado.'),
                          ('dash','6-dashboard','Dashboard','O título passa para a letra serifada das outras telas.')):
        for esc,tema in ((True,'escuro'),(False,'claro')):
            a,fa=tela(pw,v,esc,0);b,fb=tela(pw,v,esc,1);print(v,tema,'achados novos x hoje:',sorted(fb-fa) or 'nenhum')
            prancha('%s-%s.jpg'%(arq,tema),tit+' · tema '+tema,sub,[(a,'HOJE'),(b,'PROPOSTA')])
