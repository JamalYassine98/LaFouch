import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True)
  pg.evaluate("()=>__LF.inicioGo('hoje')");w(1500)
  print(pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-dia *')].find(x=>/^Fechamento do dia/.test((x.textContent||'').trim())&&x.tagName=='SECTION');return e?e.outerHTML.slice(0,600):'-'}"))
  pg.evaluate("()=>{__LF.setView('hist');setTimeout(()=>document.querySelector('[data-act=opendia][data-id=\"2026-11-16\"]').click(),700)}");w(1600)
  print(pg.evaluate("()=>{const v=document.getElementById('v-dia');return [...v.querySelectorAll('.famRec,.famC2,.famC3')].map(e=>e.className+': '+e.outerHTML.slice(0,400)).join('\\n##')}"))
  b.close()
