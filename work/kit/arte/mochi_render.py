import sys,json
from playwright.sync_api import sync_playwright
code=open('/tmp/k/mochi_code.js').read()
ARMJS="""(a)=>{const M=window.__M,m=document.getElementById('m');m.innerHTML=M.svg;const q=s=>m.querySelector(s);
function armSet(lado,ang,L){const c=lado<0?'e':'d',B=q('.aB'+c),F=q('.aF'+c),T=M.armT(lado,ang),p=M.ARMP(L);let op=M.cl((1.02-M.dentro(lado,ang,L))/.14,0,1);if(a.frente)op=1;
 B.firstChild.setAttribute('d',p);B.lastChild.setAttribute('d',M.ARMH(L));const t=F.firstChild;t.children[0].setAttribute('d',p);t.children[1].setAttribute('d',p);t.children[2].setAttribute('d',M.ARMHF(L));q('.mk'+c).firstChild.setAttribute('d',p);
 B.setAttribute('transform',T);B.style.display=op<1?'':'none';F.firstChild.setAttribute('transform',T);q('.mk'+c).setAttribute('transform',T);F.style.display=op>0?'':'none';F.setAttribute('opacity',op.toFixed(3))}
armSet(-1,a.e,a.L||30);armSet(1,a.d,a.L||30);
m.querySelectorAll('.esp').forEach(e=>e.style.display='none');
if(a.face==='feliz'){m.querySelectorAll('.olhos').forEach(e=>e.setAttribute('opacity','0'));m.querySelectorAll('.olhosF').forEach(e=>e.setAttribute('opacity','1'));m.querySelectorAll('.bW').forEach(e=>e.setAttribute('opacity','0'));m.querySelectorAll('.bF').forEach(e=>e.setAttribute('opacity','1'))}
if(a.face==='surpresa'){m.querySelectorAll('.bW').forEach(e=>e.setAttribute('opacity','0'));m.querySelectorAll('.bO').forEach(e=>e.setAttribute('opacity','1'))}}"""
def render(out,face,e,d,extra='',left=10,W=380,H=260,frente=False):
    with sync_playwright() as pw:
        b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox']);pg=b.new_page(viewport={'width':W,'height':H},device_scale_factor=3)
        pg.set_content(f'<body style="margin:0;background:transparent"><div style="position:relative;width:{W}px;height:{H}px"><div id=m style="position:absolute;left:{left}px;top:10px;width:250px;height:230px"></div>{extra}</div></body>')
        pg.add_script_tag(content=code);pg.evaluate(ARMJS,{'face':face,'e':e,'d':d,'frente':frente});pg.wait_for_timeout(200);pg.screenshot(path=out,omit_background=True);b.close()
if __name__=='__main__':
    for i,(e,d) in enumerate([(35,40),(35,-30),(-40,-40),(60,10)]): render(f'/tmp/k/mt{i}.png','feliz',e,d)
