# Esboço 64 (S435, 22/11 12:45) — ficha da peça com PREÇO e OFERTA do Titan + janela "Oferta" (uma janela, duas entradas;
# aprovado 22/11 12:30). Base: app real + aprovados (Titan dono do preço 21/11 18:03: a ficha só MOSTRA e o toque abre a janela
# do Titan · regra 15: janela de baixo com 'Salvar', sem 'Cancelar' · regra 17: datas 18/11, G$ 25.000 · valores fáceis ·
# mola: folga de hoje · de/por honesto). HOJE: campo 'Preço (US$)' editável + botão '% Oferta' + atalhos fixos −5%…−30% +
# 'Cancelar' + data mm/dd/yyyy (src/55-produtos-catalogo.js:245).
# Dados reais do app de teste: SP57765 · G$ 25.000 (US$ 3,79) · mínimo G$ 25.947 (já está abaixo) · folga de hoje 0%.
# A oferta de G$ 23.000 até 30/11 é a AÇÃO simulada do dono no esboço (o que ele digitaria), não um dado inventado do app.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
IC2.update(preco='<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  of='<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>')
JS3='const I='+json.dumps(IC2)+JS[JS.index(';const R='):]
VERM='var(--bad,#e5484d)'
def ficha(pg,w,emOf):
  RED=VERM
  L=lambda t,sub,v,last: '<div style="display:flex;align-items:center;gap:16px;min-height:72px;'+('' if last else 'border-bottom:1px solid var(--line2)')+'"><span style="flex:1;min-width:0"><b style="display:block;font-size:17px">'+t+'</b><small style="font-size:14px;color:var(--mute)">'+sub+'</small></span><b style="font-size:17px">'+v+'</b></div>'
  html=L('Preço','Titan · <span style="color:'+RED+'">abaixo do mínimo</span>','G$ 25.000',False)+(L('Em oferta','de G$ 25.000 · até 30/11','G$ 23.000',True) if emOf else L('Oferta','nenhuma','',True))
  pg.evaluate("h=>{const c=document.getElementById('precoCard');c.innerHTML=h;c.style.cssText='padding:0;background:none;border:0'}",html);w(400)
def abre(pw):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(900)
  cs=pg.query_selector_all('.pcard');cs[1].click();w(1500);cs=pg.query_selector_all('.pcard');cs[0].click();w(1800)
  pg.add_style_tag(content='summary .dbSt{display:none!important}')  # kit: o aprovado 136 põe a seta nova e o simulador deixava a velha
  return b,pg,w
def tela(pw,qual):
  b,pg,w=abre(pw);ficha(pg,w,qual=='depois')
  pg.evaluate("()=>document.getElementById('precoCard').scrollIntoView({block:'center'})");w(300)
  if qual=='janela':
    pg.evaluate(r"""()=>{const L=(r,v,c)=>'<div style="display:flex;align-items:center;justify-content:space-between;min-height:52px;border-bottom:1px solid var(--line2);font-size:16px"><span>'+r+'</span><span style="color:'+(c||'var(--fg)')+'">'+v+'</span></div>';
      const d=document.createElement('div');d.id='e64';d.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:flex-end';
      d.innerHTML='<div style="width:100%;background:var(--panel,#1b1f27);border-radius:24px 24px 0 0;padding:12px 24px 32px;color:var(--fg)">'+
       '<div style="width:44px;height:4px;border-radius:2px;background:var(--line2);margin:0 auto 16px"></div>'+
       '<h2 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:28px">Oferta</h2>'+
       '<div style="color:var(--mute);font-size:14px;margin:4px 0 16px">Óculos de leitura de acetato unissex · SP57765</div>'+
       L('Preço normal','G$ 25.000')+
       '<div style="display:flex;align-items:center;justify-content:space-between;min-height:56px;border-bottom:1px solid var(--line2);font-size:16px"><span>Preço da oferta</span><span style="border:1px solid var(--line2);border-radius:12px;padding:8px 14px;font-weight:600">G$ 23.000</span></div>'+
       L('Desconto','8%')+L('Até','30/11','var(--fg)')+
       '<div style="margin:16px 0 0;font-size:14px;line-height:1.45;color:var(--bad,#e5484d)">Titan: abaixo do mínimo (G$ 25.947). Cada peça vendida assim dá G$ 2.947 de prejuízo.</div>'+
       '<div style="margin:6px 0 0;font-size:14px;color:var(--mute)">Folga de hoje: 0% · o preço normal já está abaixo do mínimo.</div>'+
       '<button type="button" style="width:100%;margin-top:24px;min-height:52px;border-radius:16px;border:1px solid var(--accent,#c06);background:none;color:var(--accent-fg,#f6b);font:600 17px system-ui">Salvar</button></div>';
      document.body.appendChild(d)}""");w(400)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}' if qual!='janela' else '#x{}')
  confere(pg,'Ficha '+qual);f='/tmp/e64_%s.png'%qual;pg.screenshot(path=f);x=Image.open(f);x.load();x=x.copy();b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  h=Image.open(O+'hoje_inventario_ficha.jpg')
  quadro('esboco_64_ficha_oferta.jpg',[
    ('PROPOSTA · ficha da peça','preço e oferta do Titan: só mostram, o toque abre a janela',tela(pw,'antes')),
    ('PROPOSTA · tocar em Oferta','janela do Titan · Salvar · sem atalhos fixos nem Cancelar',tela(pw,'janela')),
    ('PROPOSTA · depois de salvar','a ficha mostra a oferta',tela(pw,'depois'))])
 for n,f in REL: print(n,len(f),f[:4])
