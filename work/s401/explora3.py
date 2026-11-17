import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum2
from playwright.sync_api import sync_playwright
L=lambda h:"()=>{const e=document.querySelector('%s');return e?e.outerHTML.replace(/<svg.*?<\\/svg>/gs,'<svg/>').replace(/src=\"[^\"]*\"/g,'').replace(/srcset=\"[^\"]*\"/g,'').slice(0,%d):null}"
with sync_playwright() as pw:
    b,pg,w=comum2.site(pw)
    print('CARD',pg.evaluate(L('')%('#grid .card',1300)))
    print('GRIDPAI',pg.evaluate("()=>{const g=document.getElementById('grid');let s=[],e=g;while(e&&e!==document.body){s.push(e.tagName+'#'+e.id+'.'+e.className);e=e.parentElement}return s}"))
    print('TOP',pg.evaluate(L('')%('.top',900)))
    print('BV',pg.evaluate("()=>[...document.querySelectorAll('body *')].filter(e=>e.children.length<3&&/5%|novidades|Novidades/.test(e.textContent||'')&&(e.textContent||'').length<160).map(e=>e.tagName+'.'+e.className+':'+e.textContent.trim().slice(0,120)).slice(0,10)"))
    pg.evaluate("()=>{const m=document.querySelector('.top .ib, #menubtn, [aria-label*=Menu], [aria-label*=menu]');m&&m.click()}");w(1000)
    print('MENU',pg.evaluate("()=>{const e=[...document.querySelectorAll('nav,aside,#menu,.menu,.mn,#layer .panel')].filter(x=>x.getBoundingClientRect().width>100&&x.getBoundingClientRect().height>300)[0];return e?e.tagName+'#'+e.id+'.'+e.className+' :: '+e.innerHTML.replace(/<svg.*?<\\/svg>/gs,'<svg/>').slice(0,1500):null}"))
    pg.screenshot(path='/tmp/s401/menu.png');b.close()
