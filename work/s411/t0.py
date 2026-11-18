exec(open('base.py').read())
s=serve('/home/claude/catalogo',8901);time.sleep(1)
try:
  with sync_playwright() as pw:
    b,pg,er=abre(pw,'http://localhost:8901/')
    print(pg.evaluate("()=>[document.querySelectorAll('#home .hc').length,document.querySelectorAll('#grid .card').length,(document.querySelector('#home')||{innerText:''}).innerText.slice(0,200)]"),er[:3])
    pg.screenshot(path=T+'0.png');b.close()
finally: s.terminate()
