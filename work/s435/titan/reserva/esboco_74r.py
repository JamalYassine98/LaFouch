# Esboço 74r v3 (23/11 08:05: dono 07:53 — mora em Pedidos, não em Preços) · v2 (23/11 08:00: sobre o app de hoje + aprovados 80–87 via aprovados.py) — v1 22/11 20:10 — aviso de RESERVA SUSPEITA no Titan (recado NUVEM 15:20, decidido com o dono):
# o site NÃO limita peças por pedido; a nuvem avisa quando uma reserva parece abuso (5+ peças iguais sem pagar, ou 3+ reservas abertas
# sem pagar da mesma rede na mesma hora); o dono cancela e solta pelo app (mesma família do PIX sem pedido, 97z-pix-email.js);
# sem olhar, a peça fica presa até os 30 min e solta sozinha.
# Base: app real (Pendências: linha vermelha do Titan no topo, botão de texto 'Ver ›') + aprovados: Titan (ex-Guardião), 54/70 (escritório:
# 'O Titan decide hoje · N'), regra 15 (confirmação: botão vermelho com 'Voltar' embaixo; janela de baixo), regra 17 (vermelho = perigo).
# Cenário (não existe reserva suspeita nos dados de teste): pedido 1043 do site, 5 × Solar Kazwini de TR90 feminino (peça real do catálogo de teste).
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
O='/home/claude/lafouch/work/s435/titan/reserva/'
def confere(pg,n):
  a,_=compara.M.percorre(pg,None);REL.append((n,[(k[0],a[k].get('d','')) for k in a]))
def fecha(pg,b,n,full=False):
  import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/varredura');import aprovados as A;A.aplica(pg);pg.wait_for_timeout(300)
  pg.add_style_tag(content='#mainnav .mn,#mainnav .mn *{color:var(--mute)!important}#mainnav .mn svg,#mainnav .mn svg *{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  confere(pg,n);pg.evaluate("()=>{document.querySelectorAll('*').forEach(e=>{if(e.scrollTop)e.scrollTop=0});scrollTo(0,0)}");pg.wait_for_timeout(300);pg.screenshot(path='/tmp/r.png');b.close();im=Image.open('/tmp/r.png');im.load();return im.copy()
def pend(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(600);pg.evaluate("()=>window.__LF.inicioGo('notif')");w(1200)
  pg.evaluate("""()=>{const v=document.getElementById('v-notif');const l=v.querySelector('.lbl');l.textContent='Titan · precisa de você agora · 8';
   const s=v.querySelector('section.card');const n=s.cloneNode(true);n.querySelector('b').textContent='Reserva suspeita · pedido 1043';
   n.querySelector('b').style.color='var(--bad)';n.querySelector('.hint').textContent='5 peças iguais sem pagar · solta sozinha em 18 min';
   n.querySelector('button').textContent='Ver ›';s.parentNode.insertBefore(n,s);scrollTo(0,0);document.scrollingElement.scrollTop=0;}""");w(300)
  return fecha(pg,b,'Pendências')
def precos(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("()=>{"+H+JS+r"""const L=(t,s,c)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500'+(c?';color:'+c:'')+'">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap">'+s+'</small></span><span style="color:var(--mute);font-size:18px">›</span></div>';
   return '<div class="e49">'+TOP('Início','Preços','',0)+T('O Titan decide hoje · 3',1)+L('Reserva suspeita · pedido 1043','5 peças iguais sem pagar · solta em 18 min','var(--bad)')+L('15 preços para corrigir','10 com sugestão · 5 sem custo')+L('Black Friday CDE','acaba hoje · nenhuma peça entra pela regra')+T('Setores')+L('Regras','contas, taxas, meta e cotação da loja')+L('Ofertas','cupons e ofertas no ar')+L('Atacado','tabelas do lojista')+'</div>'}""")
  pagina(pg,html);w(500);return fecha(pg,b,'Preços')
def janela(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(600);pg.evaluate("()=>window.__LF.inicioGo('notif')");w(900)
  pg.evaluate("""()=>{const R=(a,v,c)=>'<div style="display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)"><span style="flex:1;color:var(--mute);font-size:15px">'+a+'</span><span style="font-size:15px;text-align:right;font-variant-numeric:tabular-nums'+(c?';color:'+c:'')+'">'+v+'</span></div>';
   window.__LF.ACT.__r=1;
   const lfJ=window.lfJanela||null;
   const d=document.createElement('div');d.innerHTML='';
  }""")
  # usa a janela de baixo REAL do app (lfJanela) com o conteúdo da proposta
  pg.evaluate("""()=>{const R=(a,v,c)=>'<div style="display:flex;align-items:center;gap:16px;min-height:56px;border-bottom:1px solid var(--line2)"><span style="flex:1;color:var(--mute);font-size:15px">'+a+'</span><span style="font-size:15px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap'+(c?';color:'+c:'')+'">'+v+'</span></div>';
    const b=[...document.querySelectorAll('#v-notif button')].find(x=>/Ver/.test(x.textContent));
    window.__LF.ACT.pixLigar && 0;
    const html=R('Pedido','1043 · site')+R('Peças','5 × Solar Kazwini de TR90 feminino')+R('Por quê','5 iguais, sem pagar','var(--bad)')+R('Reservada','há 12 min · solta em 18 min')+
     '<button type="button" class="btn lfa-pr" style="margin-top:24px;width:100%;min-height:52px;background:#c0392b!important;border:1.5px solid #c0392b!important;color:#fff!important;font-weight:600">Cancelar e soltar as peças</button>'+
     '<button type="button" class="btn-sc" style="width:100%;min-height:48px;margin-top:8px;background:none!important;border:0!important;color:var(--fg)!important;font-weight:600">Voltar</button>';
    window.__esb=html;}""")
  ok=pg.evaluate("()=>{try{const f=window.__LF.ACT;return typeof window.lfJanela}catch(e){return e.message}}")
  pg.evaluate("""()=>{const J=(window.lfJanela)||null;}""")
  # lfJanela não é global: abre a janela do PIX (mesma família) e troca o título e o corpo
  pg.evaluate("""()=>{const S=window.__LF.S;S.pixSemPar=[{id:'x',moeda:'brl',valor:1,ts:Date.now(),motivo:'sem-pedido'}];window.__LF.ACT.pixLigar('x')}""");w(900)
  pg.evaluate("""()=>{const j=[...document.querySelectorAll('.ljJn')].pop();
    const h=j.querySelector('.ljHd b,h2,h3,b');if(h)h.textContent='Reserva suspeita';
    const c=j.querySelector('.ljCorpo')||j;c.innerHTML=window.__esb;const l=document.querySelector('#v-notif .lbl');if(l)l.textContent='Titan · precisa de você agora · 8';}""");w(600)
  return fecha(pg,b,'Janela')
def pedidos(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=False);w(600);pg.evaluate("()=>window.__LF.inicioGo('ped')");w(1500)
  pg.evaluate(r"""()=>{const v=document.getElementById('v-ped');const vz=v.querySelector('.lfVazio');
   const L=(t,s,c)=>'<button type="button" class="nvL" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);padding:0;color:var(--fg);font:inherit;text-align:left"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500;color:'+(c||'var(--fg)')+'">'+t+'</b><small style="display:block;margin-top:2px;font-size:13px;color:var(--mute)">'+s+'</small></span><i style="font-style:normal;color:var(--mute);font-size:20px">›</i></button>';
   const h=L('Pedido 1043 · reserva suspeita','5 peças iguais sem pagar · solta em 18 min','var(--bad)')+L('Pedido 1042 · Ana Benítez','comprovante chegou · conferir');
   const d=document.createElement('section');d.className='nvLista';d.innerHTML=h;vz?vz.replaceWith(d):v.appendChild(d);
   const c=v.querySelector('.crumb');if(c)c.innerHTML='2 para agir agora'}""");w(400)
  return fecha(pg,b,'Pedidos')
if __name__=='__main__':
 with sync_playwright() as pw:
  for esc in (True,False):
   n='escuro' if esc else 'claro'
   quadro('esboco_74r_reserva_suspeita_%s.jpg'%n,[('PROPOSTA · Pendências (sino)',n+' · 1ª linha, vermelha',pend(pw,esc)),('PROPOSTA · Pedidos',n+' · o pedido no topo, em vermelho',pedidos(pw,esc)),('PROPOSTA · janela Reserva suspeita',n+' · Ver › abre a janela',janela(pw,esc))])
 for n,f in REL: print(n,len(f),f[:4])
