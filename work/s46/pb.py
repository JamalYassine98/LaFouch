from playwright.sync_api import sync_playwright
import sys
exec(open('s46/peca.py').read().split("    pg.goto(")[0])
pg.goto('http://localhost:8768/');pg.wait_for_timeout(2300)
S2="location.href+' '+"+S
pg.evaluate("document.querySelector(\"[data-open='GR3340']\").click()");pg.wait_for_timeout(1300);print(pg.evaluate(S2))
pg.go_back();pg.wait_for_timeout(1200);print(pg.evaluate(S2))
