# S401: acha o formulário de cadastro no site real (cópia do kit), deslogado
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s395');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import comum2
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=comum2.site(pw,extra="localStorage.removeItem('lf_auth');localStorage.removeItem('lf_conta')")
    pg.evaluate("document.querySelector('#contabtn').click()");w(1200)
    print(pg.evaluate("()=>[...document.querySelectorAll('#layer button,#layer a')].map(e=>(e.innerText||'').trim().slice(0,30)+'|'+(e.getAttribute('data-cta')||''))"))
    pg.evaluate("()=>{const x=[...document.querySelectorAll('#layer button,#layer a')].find(e=>/Criar|Cadastr/i.test(e.innerText||''));x&&x.click()}");w(1500)
    print(pg.evaluate("()=>[...document.querySelectorAll('#layer input,#layer label,#layer button')].map(e=>e.tagName+':'+(e.id||'')+':'+((e.innerText||e.placeholder||'').trim().slice(0,28)))"))
    b.close()
