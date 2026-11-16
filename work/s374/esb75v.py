# S374 · esboço 75v (dono 16/11 18:26: "a animação buscar atualização? para que fique no padrão de luxo") — vídeo da proposta.
# O botão é um só e troca de estado no lugar: "Buscar atualização" → toque (aperta 2%) → contorno fica rosa, o texto troca para
# "Procurando…" com um anel fino girando → "Você está na versão mais nova" com o ✓ se desenhando; o contorno volta ao neutro.
# Se houver versão nova: "Atualizar para 5.38 ›" fica rosa (principal). Troca de texto = some subindo 4 px / entra subindo 4 px, 180–220 ms.
import sys,os,glob,subprocess;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
T='/tmp/s374/v75/'
CSS=open('/home/claude/lafouch/work/s374/esb75.py').read().split('CSS75="""')[1].split('"""')[0]+"""
#up75{position:relative;width:100%;height:48px;border:1px solid var(--line);border-radius:999px;background:none;color:var(--fg);font:inherit;font-weight:600;overflow:hidden}
#up75 .l{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px}
#up75 .rg{width:15px;height:15px;border-radius:50%;border:1.6px solid color-mix(in srgb,var(--accent) 25%,transparent);border-top-color:var(--accent)}
#up75 svg{width:17px;height:17px;stroke:var(--ok);fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
#up75 .c{color:var(--fg)}
.v75s{font-size:12.5px;color:var(--mute);text-align:center;margin-top:-2px}
"""
JS=r"""()=>{const c=document.getElementById('updCard');const b=c.querySelector('.bsolid');const n=document.createElement('button');n.id='up75';n.type='button';
 n.innerHTML='<span class="l a">Buscar atualização</span><span class="l b"><i class="rg"></i>Procurando…</span><span class="l c"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>Você está na versão mais nova</span>';
 b.replaceWith(n);const s=document.createElement('div');s.className='v75s';s.textContent='agora mesmo';s.style.opacity=0;n.after(s);
 const E='cubic-bezier(.45,0,.2,1)',A=[],an=(el,k,o)=>{const a=el.animate(k,Object.assign({fill:'forwards',easing:E},o));a.pause();A.push(a)};
 const q=x=>n.querySelector(x),cs=getComputedStyle(document.body),acc=cs.getPropertyValue('--accent'),ln=cs.getPropertyValue('--line');
 q('.b').style.opacity=0;q('.c').style.opacity=0;
 an(n,[{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{delay:700,duration:220});
 an(n,[{borderColor:ln},{borderColor:acc}],{delay:700,duration:260});
 an(q('.a'),[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-4px)'}],{delay:720,duration:180});
 an(q('.b'),[{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{delay:820,duration:220});
 const r=q('.rg').animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:900,iterations:Infinity,easing:'linear'});r.pause();A.push(r);
 an(q('.b'),[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-4px)'}],{delay:2500,duration:180});
 an(q('.c'),[{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{delay:2600,duration:220});
 an(n,[{borderColor:acc},{borderColor:ln}],{delay:2600,duration:400});
 an(q('.c path'),[{strokeDashoffset:1},{strokeDashoffset:0}],{delay:2700,duration:320});
 an(s,[{opacity:0},{opacity:1}],{delay:2800,duration:300});
 window.__A75=A;return A.length}"""
with sync_playwright() as pw:
    for esc,tema in ((True,'escuro'),(False,'claro')):
        for f in glob.glob(T+'f*.png'): os.remove(f)
        b,pg,w=ap.abre(pw,'inicio',esc);w(800);pg.evaluate("()=>window.__LF.setView('ajustes')");w(700);pg.click('.ajS[data-k=upd] .ajR');w(900)
        pg.add_style_tag(content=CSS);print(pg.evaluate(JS));w(200)
        pg.evaluate("()=>{const e=document.getElementById('updCard');scrollTo({top:e.getBoundingClientRect().top+scrollY-250,behavior:'instant'})}");w(300)
        r=pg.evaluate("()=>{const e=document.getElementById('updCard').getBoundingClientRect();return [e.left,e.top,e.width,e.height]}")
        clip={'x':0,'y':max(0,r[1]-30),'width':390,'height':min(844-max(0,r[1]-30),r[3]+60)}
        N=int(4200/1000*60)
        for i in range(N):
            t=i*1000/60;pg.evaluate("t=>window.__A75.forEach(a=>a.currentTime=t)",t);pg.screenshot(path=T+'f%04d.png'%i,clip=clip)
        b.close()
        out='/home/claude/lafouch/work/s374/75v-app-ajustes-buscar-atualizacao-60fps-%s.mp4'%tema
        subprocess.run(['ffmpeg','-v','error','-y','-framerate','60','-i',T+'f%04d.png','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-c:v','libx264','-pix_fmt','yuv420p',out]);print(out)
        if esc:
            from PIL import Image
            ts=[300,740,900,1600,2560,3400];ims=[Image.open(T+'f%04d.png'%int(t*60/1000)) for t in ts]
            W,H=ims[0].size;S=Image.new('RGB',(W*3+40,H*2+150),'#f1eef0')
            from PIL import ImageDraw,ImageFont;d=ImageDraw.Draw(S);F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30);R=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',24)
            d.text((20,14),'App · Ajustes › Buscar atualização (proposta) · tema escuro',font=F,fill='#1d1418')
            lb=['1. parado','2. toque (aperta 2%)','3. Procurando… (anel fino)','4. procurando','5. ✓ se desenha','6. pronto · agora mesmo']
            for k,(im,l) in enumerate(zip(ims,lb)):
                x=20+(k%3)*(W+0);y=70+(k//3)*(H+40);d.text((x,y),l,font=R,fill='#55484f');S.paste(im,(x,y+32))
            S.save('/home/claude/lafouch/work/s374/75v-app-ajustes-buscar-atualizacao-quadros-escuro.jpg',quality=88);print(S.size)
