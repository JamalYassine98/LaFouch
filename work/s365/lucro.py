import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    b,pg,w=ap.abre(pw,'estoque',True);er=[];pg.on('pageerror',lambda e:er.append(str(e)));w(800)
    print(pg.evaluate("""()=>{const L=window.__LF,S=L.S;const r=p=>L.lrVenda({price:p,rep:14453,taxa:0,qty:1}).lucro;
      const it=S.items.find(i=>!i.bulk&&L.effCusto(i)>0)||S.items.find(i=>!i.bulk&&i.tipo==='sem');const ref=it.ref;const p=L.tFor(it).price;const ps=L.pisoDoRef(ref,it.tipo);
      const strip=h=>h.replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ');
      const selo=strip((L.ofertaTexto(ref,p,ps)||{}).html||''),card=strip(L.lucroPecaHtml(ref)).slice(0,170),barra=strip(L.cntPrecoHtml(ref));
      return {exemplo:[r(105000),r(94500),r(84000)],ref,preco:p,custo:L.lucroCustoGs(ref),unico:L.lucroUnico(ref,p),desce:L.lucroDesceAte(ref,p),selo,card,barra:barra.slice(0,160)+' … '+barra.slice(-150)}}"""),er)
    b.close()
