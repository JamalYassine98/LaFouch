from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
import io
LENS="""<svg width="W" height="H" viewBox="-14 -10 128 140" style="overflow:visible"><defs><linearGradient id="za" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c46a9c"/><stop offset=".45" stop-color="#8d3a69"/><stop offset=".75" stop-color="#5e2347"/><stop offset="1" stop-color="#e7a6c7"/></linearGradient></defs>
<path d="M2 26 C-8 27 -12 33 -12 44" stroke="url(#za)" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M98 26 C108 27 112 33 112 44" stroke="url(#za)" stroke-width="5" stroke-linecap="round" fill="none"/>
<rect x="0" y="0" width="100" height="120" rx="32" fill="#fff" fill-opacity=".35" stroke="url(#za)" stroke-width="8"/><path d="M16 30 q6 -16 26 -18" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85" fill="none"/>
<rect x="30" y="-9" width="40" height="15" rx="5" fill="#8d3a69" stroke="#e7a6c7"/><text x="50" y="2" font-family="Inter" font-size="10" font-weight="800" fill="#fff" text-anchor="middle">+1.50</text></svg>"""
def lens(w,h):return LENS.replace('width="W"',f'width="{w}"').replace('height="H"',f'height="{h}"')
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
  c=b.new_context(locale='pt-BR',viewport={'width':390,'height':844},device_scale_factor=2);pg=c.new_page()
  pg.goto('http://localhost:8771/');pg.evaluate("localStorage.setItem('lf_gzmudo','1')");pg.wait_for_timeout(2000)
  pg.evaluate("document.querySelector('[data-gzopen]').click()");pg.wait_for_timeout(1500);pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(7000)
  pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(3500);pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(3500)
  # congela o fluxo e monta as poses
  pg.evaluate("""(()=>{const Z=__LFGZ.Z;Z.fase='esboco';Z.m.ocioso=false;document.querySelector('#gzbd').classList.add('on');document.querySelector('#gznt').classList.add('on');
   const b=document.querySelector('#gzbal');b.classList.add('on');window.__fr=document.querySelector('#gzfr');window.__st=document.querySelector('#gzstg')})()""")
  frames=[]
  def pose(js,txt):
    pg.evaluate("document.querySelectorAll('.eslz').forEach(e=>e.remove())");pg.evaluate(js);pg.wait_for_timeout(900)
    pg.evaluate(f"document.querySelector('#gzbal').textContent={txt!r}")
    frames.append(Image.open(io.BytesIO(pg.screenshot())).convert('RGB'))
  add=lambda x,y,w,h,extra='':f"(()=>{{const d=document.createElement('div');d.className='eslz';d.style.cssText='position:absolute;left:{x}px;top:{y}px;z-index:7;{extra}';d.innerHTML={lens(w,h)!r};__st.appendChild(d)}})()"
  mini="document.querySelector('#gzbd .gzmi[data-g=\"1.5\"]')"
  # 1: olha a bandeja, a lente da vez sobe; braço desce até ela
  pose(f"__LFGZ.Z.m.olha(.8,1);__LFGZ.Z.m.bracos(-80,null);{mini}.classList.add('vez')","Hmm… vou pegar uma lente.")
  r=pg.evaluate(f"(()=>{{const s=__st.getBoundingClientRect(),m={mini}.getBoundingClientRect();return [m.left-s.left,m.top-s.top]}})()")
  m=pg.evaluate("(()=>{const s=__st.getBoundingClientRect(),e=document.querySelector('#gw .mochi').getBoundingClientRect();return [e.left-s.left,e.top-s.top,e.width,e.height]})()")
  # 2: a lente pequena na mão (segura pela haste)
  k=m[2]/132;hx=m[0]+(17.7+6)*k;hy=m[1]+(67.4-24)*k
  pose(f"__LFGZ.Z.m.bracos(80,null);__LFGZ.Z.m.olha(-.3,-1);{mini}.classList.remove('vez');{mini}.classList.add('us');"+add(hx-4,hy-44,34,40,'transform:rotate(-10deg)'),"Peguei a +1.50!")
  # 3: levanta o braço e a lente cresce indo para o quadro
  fr=pg.evaluate("(()=>{const s=__st.getBoundingClientRect(),f=__fr.getBoundingClientRect();return [f.left-s.left,f.top-s.top,f.width,f.height]})()")
  pose("__LFGZ.Z.m.bracos(50,null);__LFGZ.Z.m.olha(1,-.4);"+add(fr[0]-fr[2]*.18,fr[1]-6,fr[2]*.6,fr[3]*.6,'transform:rotate(-6deg)'),"Vou colocar no quadro…")
  # 4: encaixada
  pose("__LFGZ.Z.m.bracos(-35,null);__LFGZ.Z.m.cara('f');__fr.classList.add('on','br');document.getElementById('gztag').textContent='+1.50'","Clic! Consegue ler a última frase?")
  W,H=frames[0].size;sc=.5;tw,th=int(W*sc),int(H*sc)
  sh=Image.new('RGB',(tw*4+50,th+70),'#efe8ed');d=ImageDraw.Draw(sh)
  try:F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',18)
  except:F=None
  cap=['1 · olha a bandeja e desce a mão','2 · pega a lente pela haste','3 · leva até o quadro (ela cresce)','4 · encaixa: clic + brilho']
  for i,f in enumerate(frames):
    sh.paste(f.resize((tw,th)),(10+i*(tw+10),50));d.text((14+i*(tw+10),18),cap[i],fill='#8d3a69',font=F)
  sh.save('/home/claude/E1_mochi_pega_lente.png');print(sh.size)
