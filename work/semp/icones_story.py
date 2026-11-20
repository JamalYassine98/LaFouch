# Opções de ícone para Story e Status (dono 20/11 15:37: "não estão bons"). Mesmo traço dos outros ícones do app (24×24, linha 2).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/kit')
import kit
from playwright.sync_api import sync_playwright
SV=lambda p:'<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'
OP=[('Story',[('A · anel do story','<circle cx="12" cy="12" r="9" stroke-dasharray="5 2.6"></circle><circle cx="12" cy="12" r="4.5"></circle>'),
             ('B · tela em pé com a barrinha','<rect x="6" y="2.5" width="12" height="19" rx="2.5"></rect><path d="M8.5 5.5h3M13 5.5h2.5"></path>'),
             ('C · anel com +','<circle cx="12" cy="12" r="9" stroke-dasharray="5 2.6"></circle><path d="M12 8.5v7M8.5 12h7"></path>')]),
    ('Status',[('A · balão com anel','<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.5 12z"></path><circle cx="12" cy="12" r="3.2"></circle>'),
             ('B · balão com relógio','<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.5 12z"></path><path d="M12 8.5V12l2.3 1.4"></path>'),
             ('C · círculo em partes','<path d="M12 3a9 9 0 0 1 7.8 4.5M20.8 10.5a9 9 0 0 1-2.4 7.6M15.5 20.3a9 9 0 0 1-7 0M5.6 18.1a9 9 0 0 1-2.4-7.6M4.2 7.5A9 9 0 0 1 12 3"></path><circle cx="12" cy="12" r="4"></circle>')])]
def html(esc):
  bg,fg,mu,ac=('#0f1216','#e7edf5','#8b9bb0','#f3c0dc') if esc else ('#f4f1f4','#1e161c','#6b7280','#8a2d5c')
  h='<body style="margin:0;background:%s;color:%s;font-family:Roboto,Arial;padding:24px">'%(bg,fg)
  for nome,ops in OP:
    h+='<div style="font:700 13px Roboto;letter-spacing:.12em;text-transform:uppercase;color:%s;margin:16px 0 8px">%s</div><div style="display:flex;gap:16px">'%(ac,nome)
    for t,p in ops: h+='<div style="flex:1;border-bottom:1px solid #2a3038;padding:16px 0;text-align:center"><div style="color:%s">%s</div><div style="font-size:14px;color:%s;margin-top:8px">%s</div></div>'%(ac,SV(p),mu,t)
    h+='</div>'
  return h+'</body>'
with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  for esc in (True,False):
    pg=b.new_page(viewport={'width':390,'height':420},device_scale_factor=2);pg.set_content(html(esc));pg.wait_for_timeout(200)
    pg.screenshot(path='/home/claude/lafouch/work/semp/esboco_icones_story_status_%s.jpg'%('escuro' if esc else 'claro'),type='jpeg',quality=90);pg.close()
  b.close();print('ok')
