# S352: confere com TOQUE DE VERDADE (dedo) os suspeitos da varredura — a varredura usa clique por programa, que pode não acionar quem ouve o dedo.
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
S="()=>{const t=document.body.innerText;const fx=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return s.position==='fixed'&&s.display!=='none'&&+s.opacity>.3&&e.getBoundingClientRect().height>30&&(+s.zIndex||0)>40}).length;return [t.length,fx,document.querySelectorAll('body *').length,(window.__LF.S.view||'')]}"
CASOS=[('Ajustes','ajustes','','Impressora'),('Ajustes','ajustes','','Tema'),('Despesas','desp','','Contas pagas neste mês'),('Dinheiro','caixa','','DÓLAR'),('Dinheiro','caixa','','Registrar troca'),('Pedidos','ped','','Verificar agora'),('Histórico','hist','','Fechar o dia agora'),('Reservas','dash','din','Próximos 30 dias')]
with sync_playwright() as pw:
    for nome,tela,aba,rx in CASOS:
        b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("a=>{const L=window.__LF;if(a[1])L.S.dTab=a[1];L.setView(a[0])}",[tela,aba]);w(1200)
        pg.evaluate("rx=>{document.querySelectorAll('[data-cf]').forEach(e=>e.removeAttribute('data-cf'));const v=[...document.querySelectorAll('.view')].find(e=>e.offsetParent);const e=[...v.querySelectorAll('button,[data-act],summary,[role=button]')].filter(e=>e.offsetParent&&(e.innerText||'').replace(/\\s+/g,' ').trim().startsWith(rx))[0];if(e){e.setAttribute('data-cf','1');e.scrollIntoView({block:'center',behavior:'instant'})}return !!e}",rx);w(400)
        e=pg.query_selector('[data-cf]')
        if not e: print('%-10s %-26s não achei'%(nome,rx));b.close();continue
        a=pg.evaluate(S)
        try: e.tap(timeout=2500);r='tocou'
        except Exception as x: r='não deu para tocar: '+str(x).split('\n')[0][:60]
        w(1100);d=pg.evaluate(S);print('%-10s %-26s %s · %s'%(nome,rx,r,'MUDOU' if a!=d else 'nada mudou'),a,d);b.close()
