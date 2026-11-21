# Esboço 39 (S435, 21/11) — pagamento parte 3, preço exato (pedido da NUVEM, ideia do dono 20/11 12:30). Celular.
import sys,json,time;sys.path.insert(0,'/home/claude/lafouch/work/kit');sys.path.insert(0,'/home/claude/lafouch/work/s349')
import kit,ap
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw,ImageFont
O='/home/claude/lafouch/work/s435/precoexato/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
AG=int(time.time()*1000)
def site(pw,pag,prop):
  b=pw.chromium.launch(executable_path=kit.EXE,args=['--no-sandbox'])
  c=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,reduced_motion='reduce')
  ped=[{'id':'P1','cod':'K7Q2','est':'pagar','ts':AG,'tel':'+595981000000','total':250000,'brl':178.53 if pag=='pix' else 0,'pagar':249963 if pag=='alias' else 0,'uq':37,'ent':'loja','pag':pag,'rx':AG+30*60000,'rd':0,'itens':[{'ref':'BR44118','nome':'Óculos solar redondo','q':1}]}]
  ini="localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_auth',JSON.stringify({uid:'u2',idToken:'tk',refreshToken:'rf',exp:%d,email:'joao@teste.com'}));localStorage.setItem('lf_conta',JSON.stringify({nome:'João Teste',email:'joao@teste.com',tel:'+595981000000',doc:'1234567'}));localStorage.setItem('lf_ped',JSON.stringify(%s))"%(AG+36e5*5,json.dumps(ped))
  c.add_init_script("try{sessionStorage.setItem('lf_ni','1');%s}catch(e){}"%ini)
  c.route('**/*',lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.fulfill(status=200,content_type='application/json',body='{}'))
  pg=c.new_page();pg.goto('http://localhost:8861/?cliente=1',wait_until='load');pg.wait_for_timeout(4000)
  pg.evaluate("()=>{const x=document.createElement('button');x.dataset.cta='minha';document.body.appendChild(x);x.click()}");pg.wait_for_timeout(1500)
  pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer [role=tab]')].find(x=>/pedidos/i.test(x.textContent));t&&t.click()}");pg.wait_for_timeout(2500)
  pg.evaluate("()=>{const t=[...document.querySelectorAll('#layer button,#layer a')].find(x=>/^Pedido K7Q2/.test(x.textContent.trim()));t&&t.click()}");pg.wait_for_timeout(2500)
  if prop:
    pg.evaluate("""(pag)=>{const r=[...document.querySelectorAll('.zr')].find(x=>/^Valor/.test(x.textContent.trim()));const b=r.querySelector('b');
      if(pag==='pix'){b.textContent='R$ 178,90'}else{b.textContent='Gs. 250.000';const c=r.querySelector('[data-pgc2]');if(c)c.dataset.pgc2='250000'}}""",pag)
  pg.wait_for_timeout(300);f='/tmp/pe.png';pg.screenshot(path=f);b.close();im=Image.open(f);im.load();return im.copy()
def app(pw,modo):
  b,pg,w=ap.abre(pw,'notif',True,'celular',base=True);w(800)
  pg.add_style_tag(content='#nvBar{display:none!important}')
  if modo!='hoje':
    pg.evaluate(r"""()=>{const v=document.getElementById('v-notif');const lb=v.querySelector('.lbl');const mod=v.querySelector('section.card');
     const L=[['PIX de R$ 178,90 sem pedido','não bate com nenhum pedido aberto · hoje 02:14'],['PIX de R$ 120,00 sem pedido','bate com 2 pedidos do mesmo valor · hoje 01:40'],['PIX de R$ 95,00 · pedido H3P9','pagou, mas a peça já foi vendida · 22:05']];
     let at=lb;L.forEach((x,i)=>{const n=mod.cloneNode(true);n.querySelector('b').textContent=x[0];n.querySelector('.hint').textContent=x[1];const bt=n.querySelector('button');bt.textContent=i==2?'Ver pedido ›':'Ligar ›';at.after(n);at=n});
     lb.textContent=lb.textContent.replace(/· \d+/,'· 10')}""")
    w(300)
  if modo=='janela':
    pg.evaluate("()=>window.__LF.ACT.nvxAps()");w(900)
    pg.evaluate(r"""()=>{const j=[...document.querySelectorAll('.ljJn')].pop();j.querySelector('.ljHd b').textContent='Ligar a um pedido';
     const c=j.querySelector('.ljCorpo');
     const row=(cod,nome,hora,val,on)=>'<label style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2);cursor:pointer"><span style="flex:0 0 22px;height:22px;border-radius:50%;border:2px solid '+(on?'var(--accent)':'var(--line)')+';display:grid;place-items:center">'+(on?'<i style="width:10px;height:10px;border-radius:50%;background:var(--accent)"></i>':'')+'</span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">Pedido '+cod+' · '+nome+'</b><small style="font-size:13px;color:var(--mute)">'+hora+'</small></span><b style="font-size:15px;font-weight:600;font-variant-numeric:tabular-nums">'+val+'</b></label>';
     c.innerHTML='<div style="color:var(--mute);font-size:14px;margin:0 0 8px">PIX de <b style="color:var(--fg)">R$ 178,90</b> · hoje 02:14 · Nubank</div>'+
      '<div class="lbl" style="margin:16px 0 0;font-size:11px;letter-spacing:.14em;color:var(--mute)">PEDIDOS A PAGAR · MESMO VALOR</div>'+row('K7Q2','João Teste','reserva até 02:28','R$ 178,90',true)+
      '<div class="lbl" style="margin:24px 0 0;font-size:11px;letter-spacing:.14em;color:var(--mute)">OUTROS PEDIDOS A PAGAR</div>'+row('M2X8','Ana Ruiz','reserva até 03:05','R$ 210,00',false)+row('T5B1','Carlos Gómez','reserva até 02:50','Gs. 180.000',false)+
      '<button type="button" style="display:block;width:100%;min-height:52px;margin:24px 0 8px;border-radius:14px;border:0;background:var(--accent);color:#fff;font:inherit;font-size:16px;font-weight:700">Ligar ao pedido K7Q2</button>'}""")
    w(500)
  f='/tmp/pa.png';pg.screenshot(path=f);b.close();im=Image.open(f);im.load();return im.copy()
def quadro(arq,q,bg=(17,20,26),fg=(235,235,240)):
  g=36;W=g+len(q)*(780+g);H=1688+140;S=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(S);mu=(140,150,165)
  for i,(t,s,im) in enumerate(q):
    x=g+i*(780+g);d.text((x,22),t,font=F(32),fill=fg);d.text((x,66),s,font=F(22),fill=mu);S.paste(im,(x,112));d.rectangle([x-1,111,x+780,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  quadro('esboco_39a_site_pix.jpg',[('HOJE · Pague com PIX','R$ 178,53 = preço − 37 centavos (final único)',site(pw,'pix',False)),('PROPOSTA · Pague com PIX','R$ 178,90 = o preço do carrinho',site(pw,'pix',True))],bg=(244,241,244),fg=(30,22,28))
  quadro('esboco_39b_site_banco.jpg',[('HOJE · Banco Familiar','Gs. 249.963 = preço − 37 (final único)',site(pw,'alias',False)),('PROPOSTA · Banco Familiar','Gs. 250.000 = o preço do carrinho',site(pw,'alias',True))],bg=(244,241,244),fg=(30,22,28))
  quadro('esboco_39c_app_pix_sem_par_escuro.jpg',[('HOJE · Pendências','PIX sem par não aparece em lugar nenhum',app(pw,'hoje')),('PROPOSTA · Pendências','cada PIX sem par com o motivo',app(pw,'lista')),('PROPOSTA · Ligar ›','janela de baixo: escolher o pedido',app(pw,'janela'))])
