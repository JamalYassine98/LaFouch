# Esboço 58c/58d (S435, 22/11 02:00) — família Site sem nada repetido (estudo 47b) · c: índice da família · d: Destaque.
# Base: app real + aprovados (37b ícones cinza, rótulos cinza, 53 Destaque da semana do Semp, 58a Resumo, 58b Ajustes do site, 149s).
exec(open('/home/claude/lafouch/work/s435/painelsite/esboco_58b.py').read().split("def ajustes(pw):")[0])
src=open('/home/claude/lafouch/work/s435/selo/esboco_49.py').read();a=src.index('def quadro(arq,q):');b=src.index("if __name__=='__main__':");exec(src[a:b])
def indice(pw,prop):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(600)
  pg.evaluate("()=>{__LF.S.nvP=['grp:g:site'];__LF.S.nvG='g:site';__LF.setView('grp')}");w(1200)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}#v-grp .nvIc{color:var(--mute)!important}#v-grp .nvL svg{stroke:var(--mute)!important;color:var(--mute)!important}')
  if prop: pg.evaluate(r"""()=>{const f=()=>{const v=document.getElementById('v-grp');if(v.dataset.p58)return;const L=[...v.querySelectorAll('.nvL')];if(L.length<5)return;v.dataset.p58=1;
     const set=(e,t,s)=>{e.querySelector('b').textContent=t;const sm=e.querySelector('small');if(sm)sm.textContent=s};
     const by=id=>L.find(e=>e.dataset.id===id);
     set(by('site'),'Resumo','no ar · prévia · o que há de novo');set(by('ped'),'Pedidos','pedidos do site');set(by('msg'),'Mensagens','contato dos clientes');
     set(by('vit'),'Destaque','formato e efeitos · peças do Semp');by('vit').querySelector('svg').innerHTML='<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 9"/>';
     const av=by('prod');set(av,'Avaliações','para revisar e as últimas');av.querySelector('svg').innerHTML='<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>';
     const aj=av.cloneNode(true);set(aj,'Ajustes do site','frete, estojo, inscritos');aj.querySelector('svg').innerHTML='<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>';av.after(aj);
     [...v.querySelectorAll('*')].filter(x=>x.children.length==0&&/Pedidos, mensagens, vitrine e modelos/.test(x.textContent)).forEach(x=>x.textContent='O site da loja')};f();new MutationObserver(f).observe(document.getElementById('v-grp'),{childList:true,subtree:true})}""");w(500)
  confere(pg,'Site índice '+('proposta' if prop else 'hoje'));x=shot(pg,'ix%d'%prop);b.close();return x
def destaque(pw):
  b,pg,w=nova(pw);I=pg.evaluate("()=>[...document.querySelectorAll('img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s)).slice(0,4)")
  pg.evaluate("()=>__LF.setView('estoque')");w(900)
  I=pg.evaluate("()=>[...document.querySelectorAll('.pcard img')].map(i=>i.src).filter(s=>/^data:image\\/svg/.test(s)).slice(1,5)")
  pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  html=pg.evaluate("(I)=>{"+H+r"""const T=(t,first)=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:'+(first?'24px':'32px')+' 0 4px">'+t+'</div>';
   const RAD=(t,s,on)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><span style="width:22px;height:22px;border-radius:50%;flex:none;'+(on?'border:7px solid var(--accent)':'border:1.5px solid var(--mute)')+'"></span></div>';
   const SW=(t,s,on)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><span class="sw" style="pointer-events:none;flex:none"><input type="checkbox" '+(on?'checked':'')+' tabindex="-1"><i></i></span></div>';
   return '<div class="e49">'+TOP('Site','Destaque','o cartão grande no topo do site',0)+
    T('As peças',1)+'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Destaque da semana</b><small style="font-size:13px;color:var(--mute)">4 peças escolhidas pelo Semp</small></span><i style="font-style:normal;color:var(--mute);font-size:20px">›</i></div>'+
    T('Formato')+RAD('Slide de fotos','as 4 peças passando sozinhas',1)+RAD('Vídeo','o comercial da semana, sem som',0)+RAD('Nada','só o título e os botões',0)+
    T('Ordem do catálogo')+'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Pelo Semp</b><small style="font-size:13px;color:var(--mute)">destaque e as mais vendidas · igual ao Vender</small></span><i style="font-style:normal;color:var(--mute);font-size:20px">⌄</i></div>'+
    '<div style="color:var(--mute);font-size:13px;margin:16px 0 32px">Para fixar uma peça no topo: na ficha dela, aba Site.</div></div>'}""",I)
  pagina(pg,html);w(500);pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  confere(pg,'Destaque proposta');pg.screenshot(path='/tmp/d58.png',full_page=True);x=Image.open('/tmp/d58.png').copy();b.close();return x
with sync_playwright() as pw:
  quadro('esboco_58c_familia_site.jpg',[('HOJE · Site','Resumo · Pedidos · Mensagens · Vitrine · Modelos',indice(pw,0)),('PROPOSTA · Site','sem repetir: Modelos e Analisador saem · Avaliações juntas',indice(pw,1))])
  quadro('esboco_58d_destaque.jpg',[('HOJE · Vitrine (painel)','destaque "Automático" · ordem · precisa de atenção · opiniões',Image.open(O+'h4_vitrine.jpg').crop((0,0,780,1688))),('PROPOSTA · Destaque','peças do Semp · formato · ordem única (movimento: sessão de ideias do site)',destaque(pw))])
for n,f in REL: print(n,len(f),f[:4])
