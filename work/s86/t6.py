from playwright.sync_api import sync_playwright
import sys
with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
  c=b.new_context(locale='pt-BR',viewport={'width':320,'height':568},device_scale_factor=2);pg=c.new_page()
  pg.goto('http://localhost:8771/');pg.evaluate("localStorage.setItem('lf_zoom',2);localStorage.setItem('lf_gzmudo','1')");pg.reload();pg.wait_for_timeout(2500)
  pg.evaluate("document.querySelector('[data-gzopen]').click()");pg.wait_for_timeout(7500);pg.screenshot(path='/tmp/p_intro.png',full_page=False)
  pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(7000);pg.screenshot(path='/tmp/p_teste.png')
  pg.click('#gw [data-gz=sim]');pg.wait_for_timeout(3500);pg.click('#gw [data-gz=nao]');pg.wait_for_timeout(5000);pg.screenshot(path='/tmp/p_lente.png')
  # sobreposição: Mochi x texto/botões
  r=pg.evaluate("""(()=>{const m=document.querySelector('#gw .mochi svg g.resp').getBoundingClientRect();const o=[];document.querySelectorAll('#gw button,#gw .gzbal,#gw .gzjan,#gw .gzbd').forEach(e=>{const r=e.getBoundingClientRect();if(e.offsetParent===null)return;const x=Math.min(m.right,r.right)-Math.max(m.left,r.left),y=Math.min(m.bottom,r.bottom)-Math.max(m.top,r.top);if(x>2&&y>2)o.push((e.id||e.className)+' '+Math.round(x)+'x'+Math.round(y))});return o})()""")
  print('Mochi encostando em:',r)
