# grava em vídeo: abrir sacola, abrir conta, abrir/fechar busca, abrir/fechar menu — para ver o movimento de verdade
exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
import glob,shutil,re
try:
  with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    d='/tmp/s411v';shutil.rmtree(d,ignore_errors=True)
    c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR',service_workers='block',record_video_dir=d,record_video_size={'width':390,'height':844})
    c.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg=c.new_page();pg.goto('http://localhost:8901/');pg.wait_for_timeout(3000);M={}
    t0=pg.evaluate("()=>performance.now()")
    def mk(n):M[n]=pg.evaluate("()=>performance.now()")
    mk('sacola');pg.tap('#bagbtn');pg.wait_for_timeout(1500)
    mk('sacola_fecha');pg.keyboard.press('Escape');pg.wait_for_timeout(300)
    if pg.evaluate("()=>{const L=document.getElementById('layer');return !!(L&&L.offsetParent)}"):
        pg.evaluate("()=>{const x=document.querySelector('#layer [data-close],#layer .close,#layer .x');x&&x.click()}")
    pg.wait_for_timeout(1500)
    mk('conta');pg.tap('#contabtn');pg.wait_for_timeout(1500)
    pg.evaluate("()=>{const x=document.querySelector('#layer [data-close],#layer .close,#layer .x');x&&x.click()}");pg.wait_for_timeout(1500)
    mk('busca');pg.tap('#sbtn');pg.wait_for_timeout(1300)
    mk('busca_fecha');pg.keyboard.press('Escape');pg.wait_for_timeout(1300)
    mk('menu');pg.tap('#mnb');pg.wait_for_timeout(1300)
    mk('menu_fecha');pg.keyboard.press('Escape');pg.wait_for_timeout(1500)
    M={k:(v-t0)/1000 for k,v in M.items()};c.close();b.close()
  v=glob.glob(d+'/*.webm')[0];json.dump({'v':v,'M':M},open(T+'v.json','w'));print(M)
finally: s.terminate()
