exec(open('s24/voltar.py').read().split('CEN=[')[0])
from playwright.sync_api import sync_playwright
def js(pg,code,t=1200): r=pg.evaluate(code); pg.wait_for_timeout(t); return r
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    def run(nome,acts,pre=None):
        pg=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='pt-BR')
        if pre: pg.add_init_script(pre)
        pg.goto('http://localhost:8768/'+acts[0]); pg.wait_for_timeout(2500); h=[pg.evaluate(WHERE)]
        for a in acts[1:]: h.append(str(js(pg,a))+' '+pg.evaluate(WHERE))
        try: pg.go_back(timeout=3000)
        except: h.append('sem histórico')
        pg.wait_for_timeout(1200); h.append('VOLTAR ANDROID → '+pg.evaluate(WHERE))
        print('###',nome); [print('   ',x) for x in h]; pg.close()
    FAV="localStorage.setItem('lf_fav',JSON.stringify({GR3340:1,SL2255:1}))"
    run('Peça → folha Meus favoritos',["","document.querySelector(\"[data-open='GR3340']\").click()","(document.querySelector('[data-pgfav]')||{click(){}}).click(),document.querySelector('[data-pgfav]')&&!document.querySelector('[data-pgfav]').hidden"],FAV)
    run('Peça → Comparar (2 peças)',["","document.querySelector(\"[data-open='GR3340']\").click()","document.querySelector('.pgacts [data-cmp]').click()","document.querySelector('.pgm [data-open]').click()","document.querySelector('.pgacts [data-cmp]').click()","document.querySelector('#cmpbar .go').click()"])
    run('Busca → peça',["","document.querySelector('#sbtn,[aria-label=Buscar]').click()","(()=>{var i=document.querySelector('#sov input');i.value='leitura';i.dispatchEvent(new Event('input',{bubbles:true}))})()","(document.querySelector('#sov [data-open]')||{}).getAttribute&&document.querySelector('#sov [data-open]').click()"])
    run('Link direto da peça',["?r=/p/GR3340"])
    run('Foto ampliada (zoom)',["","document.querySelector(\"[data-open='GR3340']\").click()","(()=>{var b=document.querySelector('#layer .big[data-zoom]');b._s=2;b.classList.add('zm');return b.classList.contains('zm')})()"])
    run('Início → Ver todos Novidades',["","document.querySelector('[data-hsec] [data-mf], [data-mf]').click()"])
