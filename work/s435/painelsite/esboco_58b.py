# Esboço 58b (S435, 22/11 01:40) — Site › Ajustes do site como tela do app (estrutura aprovada 01:23).
# Sai: "O site está no ar" (vira o botão do Resumo, 58a) e "Se você desligar" (vai para a janela do botão). Ajustes › Site do app sai (fica só aqui).
# Base: Ajustes organizado (aprovado 20/11: blocos com título, ícone por linha, valor à direita) + rótulos/ícones cinza (21/11 17:54) + 149s.
exec(open('/home/claude/lafouch/work/s435/selo/esboco_49.py').read().split("def atacado(pw):")[0].replace("O='/home/claude/lafouch/work/s435/selo/'","O='/home/claude/lafouch/work/s435/painelsite/'"))
sys.path.insert(0,'/home/claude/lafouch/work/s430/comparador');import compara
REL=[]
def confere(pg,n):
  r=pg.evaluate(compara.COLETA);T={'L':r['L'],'sob':{tuple(sorted(x)) for x in r['sob']}};f=compara.falhas(T);REL.append((n,[(k[0],' / '.join(e['nome'] for e in v)) for k,v in f.items()]))
def ajustes(pw):
  b,pg,w=nova(pw)
  html=pg.evaluate("()=>{"+H+r"""const I={fr:'<path d="M1 7h13v9H1zM14 10h4l3 3v3h-7"/><circle cx="5" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
   ac:'<rect x="3" y="8" width="18" height="9" rx="4.5"/><path d="M7 8V6h10v2"/>',
   av:'<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
   nw:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
   fo:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 9"/>',
   sg:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/>',
   co:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'};
   const R=(ic,t,v,ch)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)">'+SV(I[ic])+'<b style="flex:1;font-size:16px;font-weight:500">'+t+'</b><span style="color:var(--mute);font-size:14px;white-space:nowrap">'+v+'</span><i style="font-style:normal;color:var(--mute);font-size:20px;width:14px;text-align:center">'+(ch||'⌄')+'</i></div>';
   const T=(t,first)=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:'+(first?'24px':'32px')+' 0 4px">'+t+'</div>';
   return '<div class="e49">'+TOP('Site','Ajustes do site','lafouch.com',0)+
    T('Entrega',1)+R('fr','Frete e transportadoras','por cidade')+R('ac','Estojo e flanela','vão junto')+
    T('Clientes')+R('av','Avaliações','para revisar','›')+R('nw','Inscritos em novidades','e-mail','›')+
    T('Arquivos e acesso')+R('fo','Fotos e vídeos','do destaque')+R('sg','Segurança','2 etapas')+R('co','Conta','')+'</div>'}""")
  pagina(pg,html);w(500);confere(pg,'Ajustes do site proposta')
  pg.add_style_tag(content='#mainnav .mn{color:var(--mute)!important}#mainnav .mn svg{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  x=shot(pg,'aj58');b.close();return x
def quadro(arq,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    if im.width!=w: im=im.resize((w,int(im.height*w/im.width)))
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
with sync_playwright() as pw:
  quadro('esboco_58b_ajustes_site.jpg',[('HOJE · Ajustes do site','página do site dentro do app · cartões',Image.open(O+'h7_cfg.jpg').crop((0,0,780,1688))),('PROPOSTA · Ajustes do site','tela do app · 3 blocos · sem "no ar" e "se desligar"',ajustes(pw))])
for n,f in REL: print(n,len(f),f[:4])
