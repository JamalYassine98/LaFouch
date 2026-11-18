import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
X=['reservas-para-onde','giro-abc','cambio-dolar','cambio-troca','cambio-trocas','hist-lista','hist-busca','hist-filtros','caixa-conferir','caixa-retirar','caixa-novo-objetivo']
X+=['ata-novo','ata-loj']
D['ata-novo']=["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataNovo()","()=>{const q=document.getElementById('ataQ');q.value='Ma';q.dispatchEvent(new Event('input'));return 1}"]
D['ata-loj']=["()=>{const S=__LF.S;S.ataContas={A1:{id:'A1',nome:'Óptica Central',email:'a@b.com',tipo:'assoc',tab:'opt',dispMax:3,cancelada:false,ts:1,aparelhos:[]},A2:{id:'A2',nome:'Óptica Sol',email:'c@d.com',tipo:'assoc',tab:'opt',cancelada:true,cancEm:Date.now()-5e8,ts:1}};S._ataCanc=true;__LF.inicioGo('ata')}","()=>__LF.ACT.ataAba('loj')","()=>__LF.ACT.ataLojAbre('A2')"]
esc=os.environ.get('T','1')=='1'
with sync_playwright() as pw:
  for n in X:
    b,pg,w=ap.abre(pw,'inicio',esc);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    for p in D[n]:
      try: pg.evaluate(p)
      except Exception as e: er.append('passo:'+str(e)[:80])
      w(1100)
    pg.screenshot(path='/tmp/s418/v_%s.png'%n)
    if er: print(n,er)
    b.close()
