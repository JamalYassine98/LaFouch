import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
exec(open('/home/claude/lafouch/work/s422/t_trilho.py').read().split('GRAVA=')[0].split('porta=')[1].split('\n',1)[1])
from playwright.sync_api import sync_playwright
from PIL import Image
def costura(path,box):
  im=Image.open(path).convert('RGB');x0,y0,x1,y1=box;x0=max(0,x0);x1=min(im.size[0]-1,x1);y=(y0+y1)//2;row=[im.getpixel((x,y)) for x in range(x0,x1)]
  base_=max(set(row),key=row.count);dif=[x0+i for i,c in enumerate(row) if sum(abs(a-b) for a,b in zip(c,base_))>40]
  return dif
for porta,nome in [(8996,'hoje'),(8997,'prop')]:
 for W,zi in [(386,'2'),(386,'0'),(320,'2'),(820,'2')]:
  with sync_playwright() as p:
    b,pg,er=base.abre(p,lang='pt-BR',W=W,H=800,ls={'lf_conta':CONTA,'lf_auth':AUTH,'lf_zoom':zi,'lf_lang':'pt'})
    pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:%d/'%porta);pg.wait_for_timeout(3000);pg.click('#contabtn');pg.wait_for_timeout(1400)
    tag='%s_%d_z%s'%(nome,W,zi);out=[]
    for k in [1,4,2]:
      pg.click('#layer .mct>button >> nth=%d'%(k-1));pg.wait_for_timeout(900)
      f='/tmp/%s_t%d.png'%(tag,k);pg.screenshot(path=f)
      r=pg.evaluate("""()=>{const T=document.querySelector('#layer .mct').__tk,e=T.el,b=e.querySelectorAll(':scope>button')[T.sel],er=e.getBoundingClientRect(),br=b.getBoundingClientRect(),P=T.p.getBoundingClientRect(),c=T.c,dpr=devicePixelRatio;
       const h=document.querySelector('.top').getBoundingClientRect().bottom,s=document.querySelector('#layer .scrim').getBoundingClientRect().top;
       return {fora:Math.round(Math.max(0,br.right-er.right,er.left-br.left)),faixa:Math.round(s-h),pil:[Math.round((er.left+(c.x-e.scrollLeft)*(er.width/e.offsetWidth))*dpr),Math.round((er.top+c.y*(er.height/e.offsetHeight))*dpr),Math.round((er.left+(c.x+c.w-e.scrollLeft)*(er.width/e.offsetWidth))*dpr),Math.round((er.top+(c.y+c.h)*(er.height/e.offsetHeight))*dpr)]}}""")
      bx=r['pil'];cs=costura(f,(bx[0]+20,bx[1],bx[2]-20,bx[3]))
      out.append('aba%d fora %dpx faixa %dpx costura %s'%(k,r['fora'],r['faixa'],cs[:4]))
    print(tag,'|',' ; '.join(out),'| erros',er[:2],flush=True)
    b.close()
