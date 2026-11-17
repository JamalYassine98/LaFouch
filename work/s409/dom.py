exec(open('ver.py').read().split("if __name__")[0])
with sync_playwright() as pw:
    b,pg,log=abre(pw)
    pg.evaluate("()=>document.querySelector('#home .exs [data-exc]').click()");pg.wait_for_timeout(1500)
    print(pg.evaluate("""()=>{const g=document.getElementById('grid');let s=[];let e=g;while(e&&e!==document.body){s.push(e.tagName+'#'+e.id+'.'+String(e.className).slice(0,30));e=e.parentElement}
      const ex=[...document.querySelectorAll('.exh')].map(x=>x.parentElement.tagName+'#'+x.parentElement.id+'.'+String(x.parentElement.className).slice(0,30));
      const v=document.getElementById('vitrine');return {cad:s,exh:ex,vitKids:[...v.children].map(c=>c.tagName+'#'+c.id+'.'+String(c.className).slice(0,25)+(c.style.display==='none'?'[oculto]':''))}}"""))
    b.close()
