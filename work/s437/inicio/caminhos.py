# Início · parte 2: caminhos A (quadrados limpos) e B (lista como os índices), por cima da base inteira
exec(open('/home/claude/lafouch/work/s437/cartao.py').read().split('def SEM')[0])
COM=r"""()=>{const P=(e,k,v)=>e&&e.style.setProperty(k,v,'important');
 const g=document.querySelector('#v-inicio .guardC');if(g)P(g,'display','none');
 const h=document.querySelector('#v-inicio .hero');if(h&&!h.dataset.cm){h.dataset.cm=1;[['background','none'],['border','0'],['box-shadow','none'],['border-radius','0'],['padding-left','0'],['padding-right','0'],['border-bottom','1px solid var(--line2)']].forEach(q=>P(h,q[0],q[1]));const i=h.querySelector('.hi');P(i,'background','none');P(i,'color','var(--accent)');P(i,'width','24px');P(i,'margin-right','8px')}}"""
A=r"""()=>{const P=(e,k,v)=>e&&e.style.setProperty(k,v,'important');
 document.querySelectorAll('#v-inicio .tgrid .tl').forEach(t=>{const p=t.querySelector('.tp');P(p,'display','none');P(t,'height','112px');P(t,'min-height','0');P(t,'justify-content','center');P(t,'gap','8px')})}"""
B=r"""()=>{const P=(e,k,v)=>e&&e.style.setProperty(k,v,'important');const gr=document.querySelector('#v-inicio .tgrid');if(!gr||gr.dataset.cm)return;gr.dataset.cm=1;
 P(gr,'display','block');P(gr,'border-top','0');P(gr,'margin-top','0');
 gr.querySelectorAll('.tl').forEach(t=>{const al=t.getAttribute('aria-label')||'';const nm=(t.querySelector('.tn')||{}).textContent.trim();let fr=al.includes(':')?al.split(':')[1].trim():(t.querySelector('.tp')||{}).textContent;fr=fr.split(' · ').filter(x=>x.trim()!=nm).join(' · ');
  [['display','flex'],['flex-direction','row'],['align-items','center'],['gap','16px'],['width','100%'],['height','64px'],['min-height','0'],['padding','0'],['background','none'],['border','0'],['border-bottom','1px solid var(--line2)'],['border-radius','0'],['box-shadow','none'],['text-align','left']].forEach(q=>P(t,q[0],q[1]));
  const ti=t.querySelector('.ti'),tn=t.querySelector('.tn'),tp=t.querySelector('.tp');P(ti,'margin','0');P(ti,'flex','0 0 24px');ti.querySelector('svg')&&(ti.querySelector('svg').setAttribute('width','22'),ti.querySelector('svg').setAttribute('height','22'));
  const box=document.createElement('span');box.style.cssText='display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;text-align:left';tn.parentNode.insertBefore(box,tn);box.appendChild(tn);box.appendChild(tp);tp.textContent=fr;
  [['font-size','16px'],['margin','0'],['text-align','left']].forEach(q=>P(tn,q[0],q[1]));[['font-size','13px'],['margin','0'],['padding','0'],['border','0'],['text-align','left'],['white-space','nowrap'],['overflow','hidden'],['text-overflow','ellipsis'],['color','var(--mute)']].forEach(q=>P(tp,q[0],q[1]));
  const s=document.createElement('span');s.textContent='›';s.style.cssText='font-size:22px;color:var(--mute);line-height:1';t.appendChild(s)})}"""
TOG=r"""(modo)=>{const gr=document.querySelector('#v-inicio .tgrid');if(!gr||document.getElementById('iniTog'))return;
 const h=document.createElement('div');h.id='iniTog';h.style.cssText='display:flex;align-items:center;justify-content:space-between;margin:24px 0 8px;height:44px';
 const ic={g:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',l:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>'};
 const b=(k,lab)=>`<button type="button" aria-label="${lab}" aria-pressed="${modo==k}" style="width:44px;height:32px;display:flex;align-items:center;justify-content:center;border:0;border-radius:9px;background:${modo==k?'var(--bg)':'none'};box-shadow:${modo==k?'0 1px 2px rgba(0,0,0,.25)':'none'};color:${modo==k?'var(--fg)':'var(--mute)'}">${ic[k]}</button>`;
 h.innerHTML='<span style="font-size:12px;letter-spacing:.12em;font-weight:700;color:var(--mute)">GRUPOS</span><span style="display:flex;padding:2px;border-radius:11px;background:color-mix(in srgb,var(--fg) 7%,transparent)">'+b('g','Ver em quadrados')+b('l','Ver em lista')+'</span>';
 gr.parentNode.insertBefore(h,gr);gr.style.setProperty('margin-top','0','important')}"""
TOG2=r"""(modo)=>{const si=document.getElementById('sino');if(!si||document.getElementById('iniTog2'))return;
 const ic={g:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',l:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>'};
 const b=document.createElement('button');b.type='button';b.id='iniTog2';b.className='sino';const outro=modo=='g'?'l':'g';b.setAttribute('aria-label',outro=='l'?'Ver em lista':'Ver em quadrados');b.innerHTML=ic[outro];
 const sr=si.getBoundingClientRect(),pr=si.offsetParent.getBoundingClientRect();
 b.style.cssText=`position:absolute;left:${(window.innerWidth-sr.right)-pr.left}px;top:${sr.top-pr.top}px;width:${sr.width}px;height:${sr.height}px;margin:0;border-radius:50%;border:${getComputedStyle(si).border};background:none;color:${getComputedStyle(si).color};display:flex;align-items:center;justify-content:center;padding:0`;
 si.offsetParent.appendChild(b);const gr=document.querySelector('#v-inicio .tgrid');gr&&gr.style.setProperty('margin-top','24px','important')}"""
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
def tira(pg,nome):
  pg.add_style_tag(content='#nvBar{display:none!important}');pg.evaluate("()=>window.scrollTo(0,0)");pg.wait_for_timeout(300)
  f=T+nome+'.png';pg.screenshot(path=f);return f
def quadro2(arq,esc,q):
  ims=[Image.open(p).convert('RGB') for _,_,p in q];w,h=ims[0].size
  g=40;W=g+len(ims)*(w+g);S=Image.new('RGB',(W,h+150),(17,20,26) if esc else (244,241,244));d=ImageDraw.Draw(S)
  fg=(235,235,240) if esc else (30,22,28);mu=(140,150,165)
  for i,((t,s,_),im) in enumerate(zip(q,ims)):
    x=g+i*(w+g);d.text((x,24),t,font=F(36),fill=fg);d.text((x,72),s,font=F(24),fill=mu);S.paste(im,(x,120));d.rectangle([x-1,119,x+w,120+h],outline=(90,90,100))
  S.save(O+arq,quality=90);print('ok',arq)
CAM=[('A','quadrados limpos','quadrados só com ícone e nome',[COM,A]),
     ('B','lista como os índices','grupos em linhas, com o que tem dentro',[COM,B])]
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    b,pg,w=abre(pw,esc,[LM]+C['inicio']);k0=set((x['r'],x['ex'][0][:20]) for x in pg.evaluate(A2));fh=tira(pg,'ini_hoje_'+n);b.close()
    for L,tit,sub,js in CAM:
      b,pg,w=abre(pw,esc,[LM]+C['inicio'])
      for x in js: pg.evaluate(x)
      if os.environ.get('TOG')=='1': pg.evaluate(TOG,'g' if L=='A' else 'l')
      if os.environ.get('TOG')=='2': pg.evaluate(TOG2,'g' if L=='A' else 'l')
      w(400);k=set((x['r'],x['ex'][0][:20]) for x in pg.evaluate(A2))
      print(L,n,'alinhamento novo:',sorted(k-k0) or 'nenhum','| sumiram:',len(k0-k))
      fp=tira(pg,'ini_%s_%s'%(L,n));b.close()
      quadro2(('esboco_inicio_alterna%s_%%s_%%s.jpg'%('' if os.environ.get('TOG')=='1' else '2') if os.environ.get('TOG') else 'esboco_inicio_%s_%s.jpg')%(L,n),esc,[('HOJE · Início','como está (com a base)',fh),(('CAMINHO %s · %s'%(L,tit),sub,fp) if os.environ.get('TOG')!='2' else ('PROPOSTA · '+('quadrados' if L=='A' else 'lista'),'toque no ícone à esquerda para trocar',fp))])
