from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844})
    pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
    pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500)
    st=lambda:pg.evaluate("[document.getElementById('como').classList.contains('pop'),(document.querySelector('#como .ajw')||{}).getAttribute?document.querySelector('#como .ajw').getAttribute('data-ajpg'):'']")
    pg.click('#mnb');pg.wait_for_timeout(700);pg.click('#drw [data-ajp="comprar"]');pg.wait_for_timeout(1200);print('aberto',st());pg.go_back();pg.wait_for_timeout(900);print('volta direto',st())
    pg.click('#mnb');pg.wait_for_timeout(700);pg.click('#drw [data-ajp="dicas"]');pg.wait_for_timeout(1200);print('menu ajuda',st())
    pg.locator('#como [data-ajp]:visible').first.click();pg.wait_for_timeout(800);print('sub',st())
    pg.go_back();pg.wait_for_timeout(900);print('volta1',st())
    pg.go_back();pg.wait_for_timeout(900);print('volta2',st())
    b.close()
