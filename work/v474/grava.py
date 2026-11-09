from playwright.sync_api import sync_playwright
import glob,shutil,sys
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    for nm,view,sel in [('cat','vendas','#v-vendas .pcard[data-ref]'),('inv','estoque','#v-estoque .pcard[data-ref]')]:
        ctx=b.new_context(viewport={'width':400,'height':860},device_scale_factor=1,color_scheme='dark',service_workers='block',record_video_dir='vt_'+nm,record_video_size={'width':400,'height':860})
        pg=ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('http://localhost:8799/index.html#test'); pg.wait_for_timeout(3000)
        pg.evaluate(f"()=>window.__LF.setView('{view}')"); pg.wait_for_timeout(1200)
        idx=pg.evaluate("(s)=>[...document.querySelectorAll(s)].findIndex((c,i)=>i>1&&c.querySelector('.pbox img'))",sel)
        pg.evaluate("([s,i])=>{const c=document.querySelectorAll(s)[i];const y=c.getBoundingClientRect().top+scrollY;scrollTo({top:y-250,behavior:'instant'})}",[sel,idx]); pg.wait_for_timeout(800)
        pg.evaluate("()=>{window.__T0=performance.now()}")
        pg.locator(sel).nth(idx).locator('.pbox').click(); pg.wait_for_timeout(1400)
        pg.locator(('#vDetail' if view=='vendas' else '#detail')+' .tab.ibtn[aria-label="Voltar"]').click(); pg.wait_for_timeout(1400)
        print(nm,'sobras',pg.evaluate("()=>document.querySelectorAll('.lfVoa,.lfFundo').length"),'erros',errs[:2])
        ctx.close(); v=glob.glob('vt_'+nm+'/*.webm')[0]; shutil.move(v,f'real_{nm}.webm'); shutil.rmtree('vt_'+nm)
