import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum2
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=comum2.site(pw)
    print(pg.evaluate("()=>{const h=document.querySelector('.hsh.hsh1');const p=h.parentElement;return [p.tagName+'#'+p.id+'.'+p.className,[...p.children].map(e=>e.tagName+'#'+e.id+'.'+e.className+':'+e.children.length).slice(0,14),h.outerHTML.slice(0,400),h.nextElementSibling.outerHTML.replace(/<svg.*?<\\/svg>/gs,'').replace(/src=\"[^\"]*\"/g,'').slice(0,900)]}"))
    b.close()
