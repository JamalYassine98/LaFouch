# Troca quadrados|lista também nas telas de grupo (dono 19/11 16:14: "dar essa mesma função para todos que estão dentro do grupo")
exec(open('/home/claude/lafouch/work/s437/reservas.py').read().split('so=os.environ')[0])
cm=open('/home/claude/lafouch/work/s437/inicio/caminhos.py').read()
exec(cm[cm.index('TOG2=r"""'):cm.index('A2=open(')])
exec(cm[cm.index('def tira'):cm.index('CAM=[')])
LE=r"""()=>{const t=document.querySelector('#v-inicio .tgrid .tl');if(!t)return;const c=getComputedStyle(t);window.__tlSt={bg:c.backgroundColor,rad:c.borderRadius,bd:c.border,sh:c.boxShadow}}"""
GRADE=r"""()=>{const l=document.querySelector('#v-grp .nvLista');if(!l||l.dataset.gd)return;l.dataset.gd=1;const s=window.__tlSt||{bg:'rgba(255,255,255,.04)',rad:'20px',bd:'0',sh:'none'};const P=(e,k,v)=>e&&e.style.setProperty(k,v,'important');
 [['display','grid'],['grid-template-columns','1fr 1fr'],['gap','16px'],['border-top','0'],['margin-top','24px']].forEach(q=>P(l,q[0],q[1]));
 l.querySelectorAll('.nvL').forEach(b=>{[['display','flex'],['flex-direction','column'],['align-items','center'],['justify-content','center'],['gap','8px'],['height','112px'],['min-height','0'],['padding','0 8px'],['background',s.bg],['border',s.bd],['border-radius',s.rad],['box-shadow',s.sh]].forEach(q=>P(b,q[0],q[1]));
  const sm=b.querySelector('small');P(sm,'display','none');const i=b.querySelector(':scope > i');P(i,'display','none');const ic=b.querySelector('.nvIc');P(ic,'color','var(--accent)');P(ic,'margin','0');
  const tx=b.querySelector('.nvTx');P(tx,'text-align','center');P(tx,'flex','0 0 auto');const bb=b.querySelector('b');P(bb,'font-size','14px')})}"""
TOGG=TOG2.replace("const gr=document.querySelector('#v-inicio .tgrid');gr&&gr.style.setProperty('margin-top','24px','important')","")
GRUPO={'din':[MOVE,INI,DIN],'gp':[MOVE,INI,GP,CR],'pecas':[MOVE,INI,"()=>{const b=document.querySelector(\"#mainnav .mn[data-id='g:pecas']\");b&&b.click()}"]}
NOME={'din':'Dinheiro','gp':'Giro e preços','pecas':'Peças'}
def roda(pg,w,ps):
  for x in ps: pg.evaluate(x);w(800)
with sync_playwright() as pw:
  for esc in (True,False):
    n='escuro' if esc else 'claro'
    for k,ps in GRUPO.items():
      b,pg,w=abre(pw,esc,[LM]);pg.evaluate(LE);roda(pg,w,ps);k0=set((x['r'],x['ex'][0][:20]) for x in pg.evaluate(A2));fh=tira(pg,'g_%s_hoje_%s'%(k,n));b.close()
      b,pg,w=abre(pw,esc,[LM]);pg.evaluate(LE);roda(pg,w,ps);pg.evaluate(GRADE);pg.evaluate(TOGG,'g');w(400)
      kq=set((x['r'],x['ex'][0][:20]) for x in pg.evaluate(A2));fq=tira(pg,'g_%s_q_%s'%(k,n));b.close()
      b,pg,w=abre(pw,esc,[LM]);roda(pg,w,ps);pg.evaluate(TOGG,'l');w(400);fl=tira(pg,'g_%s_l_%s'%(k,n));b.close()
      print(k,n,'alinhamento novo (quadrados):',sorted(kq-k0) or 'nenhum')
      quadro2('esboco_grupo_troca_%s_%s.jpg'%(k,n),esc,[('HOJE · '+NOME[k],'em lista, sem troca',fh),('PROPOSTA · quadrados','ícone e nome, como o Início',fq),('PROPOSTA · lista','toque no canto para trocar',fl)])
