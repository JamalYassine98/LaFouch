exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
with sync_playwright() as pw:
  b,pg,w=abre(pw,True,[LM]+C['inicio'])
  r=pg.evaluate(r"""()=>{const v=document.querySelector('#v-inicio')||document.querySelector('.view.on');const o={blocos:[],barra:[],grupos:{}};
   [...v.children].forEach(e=>{const r=e.getBoundingClientRect();if(!r.height)return;o.blocos.push({cls:e.tagName+'.'+[...e.classList].join('.'),y:Math.round(r.top+scrollY),h:Math.round(r.height),t:(e.innerText||'').replace(/\s+/g,' ').slice(0,160),acts:[...e.querySelectorAll('[data-act]')].map(x=>x.dataset.act+':'+(x.dataset.id||x.dataset.k||x.dataset.v||'')+':'+(x.innerText||x.getAttribute('aria-label')||'').replace(/\s+/g,' ').slice(0,24)).slice(0,30)})});
   document.querySelectorAll('#mainnav .mn,#mainnav button').forEach(x=>o.barra.push((x.dataset.id||'')+':'+(x.innerText||x.getAttribute('aria-label')||'').trim()));
   return o}""")
  print(json.dumps(r,ensure_ascii=False,indent=1)[:6000])
  pg.add_style_tag(content='#nvBar{display:none!important}');pg.screenshot(path='/home/claude/lafouch/work/s437/inicio/hoje_full_escuro.png',full_page=True)
  b.close()
