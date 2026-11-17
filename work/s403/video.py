# S403 · vídeo do 70e (pedido do dono 17/11 11:05): a reserva cancelada abrindo e fechando, quadro a quadro, 60 qps → MP4. Nada implementado.
E=open('esb6.py').read();exec(E[:E.index('def par2(')])
import subprocess,os
SET="""(k)=>{const e=document.querySelector('[data-id=kitped1]');if(!window.__d){
 const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n,pl=null;while(n=w.nextNode()){if(/Pedido cancelado/.test(n.nodeValue)){n.nodeValue=n.nodeValue.replace('Pedido cancelado','Reserva cancelada');pl=n.parentNode}}
 e.style.flexWrap='wrap';const d=document.createElement('div');d.style.cssText='flex-basis:100%;overflow:hidden';
 d.innerHTML='<div style="border-top:1px solid #eee6ea;margin-top:12px;padding-top:10px;font:13.5px/1.55 Inter,system-ui,sans-serif;color:#6b5f66">A reserva terminou antes do pagamento. Nada foi cobrado e as peças voltaram para o site.<div style="margin-top:8px"><a href="#" style="display:inline-flex;align-items:center;min-height:44px;color:#8d3a69;font-weight:600;text-decoration:underline">Ver as peças ›</a></div></div>';e.appendChild(d);window.__H=d.scrollHeight;window.__d=d;
 const wr=document.createElement('span');wr.style.cssText='display:inline-flex;align-items:center;gap:8px;flex:none';pl.parentNode.insertBefore(wr,pl);wr.appendChild(pl);
 const ch=document.createElement('span');ch.textContent='›';ch.style.cssText='display:inline-block;width:14px;text-align:center;font:22px/1 Inter,system-ui,sans-serif;color:#8a7d84';wr.appendChild(ch);window.__c=ch;
 const t=document.createElement('div');t.style.cssText='position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(29,20,24,.18);pointer-events:none;opacity:0;z-index:99';document.body.appendChild(t);window.__t=t;const r=pl.getBoundingClientRect();t.style.left=(r.left+r.width/2)+'px';t.style.top=(r.top+r.height/2)+'px'}
 const ez=x=>1-Math.pow(1-x,3),d=window.__d;d.style.height=(window.__H*ez(k[0]))+'px';d.firstChild.style.opacity=Math.max(0,(k[0]-.25)/.75);d.firstChild.style.transform='translateY('+(-8*(1-ez(k[0])))+'px)';window.__c.style.transform='rotate('+(90*ez(k[0]))+'deg)';window.__t.style.opacity=k[1]}"""
F='/tmp/s403/vid/';os.makedirs(F,exist_ok=True);[os.remove(F+x) for x in os.listdir(F)]
fps=60;seq=[]
seq+=[(0,0)]*int(.8*fps)
seq+=[(0,a) for a in (.4,.8,1,1,.8,.5,.2)]          # toque
n=int(.35*fps);seq+=[(i/n,0) for i in range(1,n+1)]  # abre
seq+=[(1,0)]*int(1.6*fps)
seq+=[(1,a) for a in (.4,.8,1,1,.8,.5,.2)]           # toque de novo
seq+=[(1-i/n,0) for i in range(1,n+1)]               # fecha
seq+=[(0,0)]*int(.9*fps)
with sync_playwright() as pw:
    b,pg,w=pago.abre(pw,'pedidos','cancelado');pg.add_style_tag(content=NOAN+CSS);w(400);pg.evaluate(SET,[0,0])
    y=pg.evaluate("()=>document.querySelector('[data-id=kitped1]').getBoundingClientRect().top")
    for i,k in enumerate(seq): pg.evaluate(SET,list(k));pg.screenshot(path=F+'%04d.png'%i,clip={'x':0,'y':max(0,y-120),'width':390,'height':390})
    b.close()
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate',str(fps),'-i',F+'%04d.png','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-vf','scale=780:780','-movflags','+faststart','70e-site-pedidos-reserva-cancelada-animacao.mp4'],check=True)
print(len(seq),'quadros',os.path.getsize('70e-site-pedidos-reserva-cancelada-animacao.mp4'))
