# Esboço 72b (S435, 22/11 16:05) — a AGENDA na prática (dono 15:53 'posso ver uma interação?'): tocar em 'Seg · Post · 20h' → a janela
# do Post (a REAL do app, a de 'Criar com um toque', src mkCria) com o acabamento aprovado das janelas do Semp (20/11 13:28/13:56, 142d):
# título = o item da agenda, 'Por que esta peça ⌄' em linha, legenda em LINHA FINA com rótulo, UM botão 'Postar agora' (sai 'Me lembra
# às 20h': o lembrete vem da Agenda pelo sino), fundo desfocado. Conserto junto (L4): o nome no cartão do post saía cortado ('…de ace');
# a letra diminui até caber. Depois de postar: a bolinha marca e 'Esta semana · 1 de 6 feitos'.
exec(open('/home/claude/lafouch/work/s435/semp/esboco_72.py').read().split("def agenda(pw")[0])
def agenda2(pw,feito,toque):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}#mainnav{display:none!important}')
  html=pg.evaluate("(f)=>{"+H+JS+AG+r"""const OK='<span style="flex:none;width:24px;height:24px;border-radius:50%;background:var(--ok,#4fbf7f);display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></span>';
   let seg=BOL('Seg · Post · 20h','Leitura Kazwini de acetato · a que mais vende');if(f)seg=seg.replace(/<span style="flex:none;width:24px;height:24px;border-radius:50%;border:1.5px solid var\(--mute\)"><\/span>/,OK).replace('Leitura Kazwini de acetato · a que mais vende','postado às 20:04 · Instagram');
   return '<div class="e49">'+TOP('Marketing','Agenda','',1)+
   T('Esta semana · '+(f?1:0)+' de 6 feitos',1)+'<div class="segrow">'+seg+'</div>'+BOL('Ter · Status · 12h','Leitura de acetato unissex · status do dia')+
   BOL('Qua · Carrossel · 20h','4 peças · Solar Ray-Ban, Solar Kazwini tr90…')+BOL('Qui · Story · 20h','Leitura de plástico feminino · chegou')+
   BOL('Sex · Vídeo · 20h','comercial de 15 s · Solar #14 e mais 2')+BOL('Sáb · Post · 20h','Armação #11 · oferta ou mais vendido')+'</div>'}""",feito)
  pagina(pg,html);w(600)
  if toque: pg.evaluate("()=>{const r=document.querySelector('.segrow');r.style.background='color-mix(in srgb,var(--fg) 8%,transparent)';r.style.borderRadius='12px';r.style.margin='0 -8px';r.style.padding='0 8px';const d=document.createElement('div');d.style.cssText='position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.7);pointer-events:none';const b=r.getBoundingClientRect();d.style.left=(b.left+b.width*.55)+'px';d.style.top=(b.top+b.height/2-22+scrollY)+'px';document.body.appendChild(d)}")
  confere(pg,'Agenda '+('feito' if feito else 'toque'));pg.screenshot(path='/tmp/a2.png');b.close();im=Image.open('/tmp/a2.png');im.load();return im.copy()
def janela(pw):
  b,pg,w=ap.abre(pw,'mkt',True,'celular',base=True);w(1200)
  [x for x in pg.query_selector_all('#v-mkt button') if (x.inner_text() or '').strip()=='Post'][0].click(); w(1500)
  pg.evaluate(r"""()=>{const j=document.querySelector('.ljJn');j.querySelector('.ljHd b').textContent='Seg · Post · 20h';
   const bk=document.querySelector('.ljBk');if(bk){bk.style.backdropFilter='blur(12px)';bk.style.webkitBackdropFilter='blur(12px)'}
   const wy=j.querySelector('.mkWhy');wy.outerHTML='<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2);margin-bottom:16px"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">Por que esta peça</b><small style="display:block;font-size:13px;color:var(--mute)">Leitura Kazwini de acetato · 27 no mês</small></span><span style="color:var(--mute);font-size:18px">⌄</span></div>';
   const tx=j.querySelector('#mkTx');tx.style.cssText='width:100%;background:none!important;border:0!important;border-bottom:1px solid var(--line2)!important;border-radius:0!important;padding:4px 0 12px!important;color:var(--fg);font:inherit;font-size:16px;line-height:1.5;resize:none;box-shadow:none!important';tx.rows=4;
   const lb=document.createElement('div');lb.textContent='Legenda';lb.style.cssText='color:var(--mute);font-size:13px;margin:24px 0 4px';tx.before(lb);
   const lm=j.querySelector('#mkLemb');if(lm)lm.remove();
   // L4 no cartão do post: a letra do nome diminui até caber (o canvas cortava '…de ace')
   const cv=j.querySelector('canvas.mkCv'),c=cv.getContext('2d');const bg=c.getImageData(60,985,1,1).data;
   c.fillStyle='rgb('+bg[0]+','+bg[1]+','+bg[2]+')';c.fillRect(40,960,1000,90);
   let fz=64;const nm='Óculos de leitura Kazwini de acetato masculino';do{c.font=fz+'px Georgia, serif';fz-=2}while(c.measureText(nm).width>960&&fz>30);
   c.fillStyle='#1d1a1c';c.textAlign='center';c.textBaseline='middle';c.fillText(nm,540,1008);
   j.querySelector('.ljCorpo').scrollTop=0}""")
  w(600);confere(pg,'Janela Post');pg.screenshot(path='/tmp/j1.png')
  pg.evaluate("()=>{document.querySelector('.ljJn .ljCorpo').scrollTop=99999}");w(400);pg.screenshot(path='/tmp/j2.png');b.close()
  return Image.open('/tmp/j1.png').copy(),Image.open('/tmp/j2.png').copy()
if __name__=='__main__':
 with sync_playwright() as pw:
  a1=agenda2(pw,0,1);j1,j2=janela(pw);a3=agenda2(pw,1,0)
  quadro('esboco_72b_agenda_na_pratica.jpg',[('1 · tocar no post do dia','o sino avisou às 20h · ou você abre a Agenda',a1),('2 · a janela do Post','peça, foto e texto prontos · dá para trocar',j1),('2 · rolando','legenda em linha fina · um botão só',j2),('3 · depois de postar','a bolinha marca · 1 de 6 feitos',a3)])
 for n,f in REL: print(n,len(f),f[:5])
