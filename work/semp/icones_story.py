# Opções de ícone para Story e Status (dono 20/11 15:37: "não estão bons"). Mesmo traço dos outros ícones do app (24×24, linha 2).
import sys;sys.path.insert(0,'/home/claude/lafouch/work/kit')
import kit
from playwright.sync_api import sync_playwright
SV=lambda p:'<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'
OP=[('Story · escolhido',[('A · anel do story','<circle cx="12" cy="12" r="9" stroke-dasharray="5 2.6"></circle><circle cx="12" cy="12" r="4.5"></circle>')]),
    ('Status',[('D · celular com balão','<rect x="3.5" y="5" width="10" height="16" rx="2"></rect><path d="M14 3.5h6.5v5H17l-2 1.8V8.5h-1z"></path>'),
             ('E · dois balões','<path d="M14 9.5a6 6 0 0 1-8.7 5.3L2.5 16l.8-3A6 6 0 1 1 14 9.5z"></path><path d="M16.2 8.6A6 6 0 0 1 20.7 17l.8 3-2.8-1.2a6 6 0 0 1-7.4-1.7"></path>'),
             ('F · balão com foto','<path d="M20.5 12a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1-4.4A8.5 8.5 0 1 1 20.5 12z"></path><path d="M7.5 15l2.8-3 2 2 1.5-1.5 2.7 2.5"></path><circle cx="14.5" cy="8.8" r="1"></circle>')])]
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
