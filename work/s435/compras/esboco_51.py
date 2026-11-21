# Esboço 51 (S435, 21/11 13:05) — Compras parte A em imagem: a lista por VAGA (dono 12:51/12:58). Só a ideia do caminho, celular escuro.
import os
# Base: app real (peças e imagens de teste) + aprovados (48 direção Compras, janela de baixo com "Salvar" contornado, selo vermelho, linhas finas).
exec(open('/home/claude/lafouch/work/s435/selo/esboco_49.py').read().split("def atacado(pw):")[0].replace("O='/home/claude/lafouch/work/s435/selo/'","O='/home/claude/lafouch/work/s435/compras/'"))
J=r"""const JAN=(tit,sub,inner,bot)=>{const bk=document.createElement('div');bk.className='ljBk';bk.style.opacity='.5';const j=document.createElement('div');j.className='ljJn';j.style.transform='none';j.innerHTML='<div class="ljPuxa"></div><div class="ljHd" style="display:block"><b>'+tit+'</b>'+(sub?'<div style="color:var(--mute);font-size:14px;font-weight:400;margin-top:2px">'+sub+'</div>':'')+'</div><div class="ljCorpo">'+inner+(bot?'<button type="button" style="display:block;width:100%;min-height:52px;margin:24px 0 8px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">'+bot+'</button>':'')+'</div>';document.body.appendChild(bk);document.body.appendChild(j)};
const EST=(t,c)=>'<span style="flex:none;font-size:13px;font-weight:600;color:'+c+'">'+t+'</span>';
const OK='var(--ok,#4fbf7f)',AV='var(--warn,#e0b44c)',AC='var(--accent-fg)';
const VAGA=(img,t,s,e)=>'<button type="button" style="display:flex;align-items:center;gap:16px;width:100%;min-height:80px;background:none;border:0;border-bottom:1px solid var(--line2);padding:10px 0;color:var(--fg);font:inherit;text-align:left"><span style="flex:0 0 56px;height:42px;border-radius:8px;overflow:hidden;background:#fff"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small>'+e+'</span><i style="font-style:normal;font-size:20px;color:var(--mute)">›</i></button>';
const LIN=(r,v,ch,c)=>'<div style="display:flex;align-items:center;gap:12px;min-height:52px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:16px">'+r+'</span><span style="color:'+(c||'var(--mute)')+';font-size:15px;font-variant-numeric:tabular-nums">'+v+'</span>'+(ch?'<i style="font-style:normal;color:var(--mute);font-size:20px;width:14px;text-align:center">'+ch+'</i>':'')+'</div>';
const CK=(t,s,on)=>'<div style="display:flex;align-items:center;gap:14px;min-height:60px;border-bottom:1px solid var(--line2)"><span style="width:22px;height:22px;border-radius:6px;flex:none;'+(on?'background:var(--accent);display:grid;place-items:center;color:#fff;font-size:14px':'border:1.5px solid var(--mute)')+'">'+(on?'✓':'')+'</span><span style="flex:1"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="color:var(--mute);font-size:13px">'+s+'</small></span></div>';"""
def imgs(pg):
  return pg.evaluate("()=>{const S=__LF.S;return 1}") and pg.evaluate("""async()=>{__LF.setView('estoque');await new Promise(r=>setTimeout(r,900));const m={};document.querySelectorAll('.pcard').forEach(c=>{const i=c.querySelector('img');const t=c.textContent;if(i&&/^data:image\\/svg/.test(i.src))m[Object.keys(m).length]=i.src});return Object.values(m)}""")
def frame(pw,qual):
  b,pg,w=nova(pw);I=imgs(pg);pg.evaluate("()=>{__LF.S.nvP=['grp:g:pecas'];__LF.S.nvG='g:pecas';__LF.setView('grp')}");w(900)
  html=pg.evaluate("(I)=>{"+H+J+r"""return TOP('Peças','Compras','O que comprar e de quem',0)+LBL('Para comprar · 4 vagas')+
    VAGA(I[3]||I[0],'Solar · feminino · metal','faltam 3 · até US$ 4','<small style="font-size:13px;color:'+AV+'">★ estrela · repor o mesmo SL2201</small>')+
    VAGA(I[2]||I[0],'Armação · feminina · nylon','faltam 2 · até US$ 3','<small style="font-size:13px;color:'+AC+'">no lugar de BR44133, que não vendeu</small>')+
    VAGA(I[1]||I[0],'Armação · unissex · acetato','faltam 5 · até US$ 3,50','<small style="font-size:13px;color:var(--mute)">pedida em 21/11 · esperando resposta</small>')+
    VAGA(I[0],'Pré-graduado · +1,50','faltam 24 · 1 pacote','<small style="font-size:13px;color:'+OK+'">fechado com Kazwini · esperando chegar</small>')+
    '<button type="button" style="display:block;width:100%;min-height:52px;margin:24px 0 8px;border-radius:14px;border:1.5px solid var(--accent);background:none;color:var(--accent-fg);font:inherit;font-size:16px;font-weight:700">Pedir · 3 vagas sem fechar</button>'}""",I)
  pagina(pg,'<div class="e49">'+html+'</div>');w(500)
  if qual=='vaga': pg.evaluate("(I)=>{"+H+J+r"""const ALT=(img,t,s,on)=>'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)"><span style="flex:0 0 64px;height:48px;border-radius:10px;overflow:hidden;background:#fff"><img src="'+img+'" style="width:100%;height:100%;object-fit:contain"></span><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute)">'+s+'</small></span><span style="width:22px;height:22px;border-radius:50%;flex:none;'+(on?'border:7px solid var(--accent)':'border:1.5px solid var(--mute)')+'"></span></div>';
     JAN('No lugar de BR44133','armação · feminina · acetato · parada há 60+ dias',
     '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:0 0 8px">Não repõe o que não vendeu. Alternativas que estão saindo na sua loja, no mesmo tipo e gênero:</div>'+
     ALT(I[2]||I[0],'Feminina · nylon','vende 3× mais · até US$ 3',1)+ALT(I[1]||I[0],'Feminina · acetato redonda','formato da foto que mais vende · até US$ 3,50',0)+
     ROW('','Fechei com…','a compra combinada: com quem, modelo, peças e preço')+ROW('','Ninguém tinha','a vaga sai da lista por um tempo'),'Salvar')}""",I);w(500)
  if qual=='pedir': pg.evaluate("(I)=>{"+H+J+r"""JAN('Pedir','3 vagas sem fechar · em espanhol',
     '<div style="background:var(--panel2);border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.55;color:var(--fg)">Hola, ¿qué tienen de esto?<br>· 3 lentes de sol de mujer, metal (SL2201 o parecido), hasta US$ 4<br>· 2 armazones de mujer, nylon, hasta US$ 3<br>· 5 armazones unisex, acetato, hasta US$ 3,50<br>Gracias. La Fouch</div>'+
     '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 0">Você escolhe para quem mandar no próprio WhatsApp: uma distribuidora ou várias. As vagas ficam "pedida · esperando resposta".</div>','Mandar')}""",I);w(500)
  if qual=='ninguem': pg.evaluate("(I)=>{"+H+J+r"""const OP=(t,s,on)=>'<div style="display:flex;align-items:center;gap:16px;min-height:72px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="font-size:13px;color:var(--mute);line-height:1.4">'+s+'</small></span><span style="width:22px;height:22px;border-radius:50%;flex:none;'+(on?'border:7px solid var(--accent)':'border:1.5px solid var(--mute)')+'"></span></div>';
     JAN('Ninguém tinha','Solar · feminino · metal · faltam 5',
     '<div style="display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:15px">5 clientes esperam esta peça</span><span style="color:var(--mute);font-size:14px">me avise ⌄</span></div>'+
     OP('Procurar equivalente','pela foto da SL2201: mesmo formato, material e faixa de preço. Entra no próximo Pedir. Quando chegar, aviso os 5 clientes.',1)+
     OP('Avisar quando aparecer','espera a própria SL2201. O Semp confere as distribuidoras e avisa no sino.',0)+
     '<div style="color:var(--mute);font-size:13px;line-height:1.45;margin:16px 0 0">"Deixar sem" só aparece quando ninguém está esperando.</div>','Salvar')}""",I);w(500)
  if qual=='fechei': pg.evaluate("(I)=>{"+H+J+r"""const QT='<span style="display:inline-flex;align-items:center;gap:16px"><b style="color:var(--mute);font-size:20px">−</b><b style="font-size:16px">3</b><b style="font-size:20px">+</b></span>';
     JAN('Fechei com…','Solar · feminino · metal · faltam 3',LIN('Distribuidora','Kazwini','›')+LIN('Modelo','SL2201 · o mesmo','›')+'<div style="display:flex;align-items:center;min-height:52px;border-bottom:1px solid var(--line2)"><span style="flex:1;font-size:16px">Peças</span>'+QT+'</div>'+LIN('Custo por peça','US$ 3,80')+
     '<div style="color:'+OK+';font-size:14px;margin:16px 0 0">Guardião: margem boa a G$ 60.000 · pode fechar</div>','Salvar')}""",I);w(500)
  x=shot(pg,'v'+qual);b.close();return x
def quadro(arq,q):
  g=40;w=max(i.width for _,_,i in q);h=max(i.height for _,_,i in q);S=Image.new('RGB',(g+len(q)*(w+g),h+150),(17,20,26));d=ImageDraw.Draw(S)
  for i,(t,s,im) in enumerate(q):
    if im.width!=w: im=im.resize((w,int(im.height*w/im.width)))
    x=g+i*(w+g);d.text((x,24),t,font=F(32),fill=(235,235,240));d.text((x,68),s,font=F(20),fill=(140,150,165));S.paste(im,(x,112));d.rectangle([x-1,111,x+im.width,112+im.height],outline=(90,90,100))
  S.save(O+arq,quality=88);print('ok',arq)
if __name__=='__main__' and not os.environ.get('SO_B'):
 with sync_playwright() as pw:
  quadro('esboco_51_compras_por_vaga.jpg',[('1 · Compras','a lista pede vagas, não modelos',frame(pw,'lista')),('2 · vaga no lugar de um fracasso','alternativas para comprar já',frame(pw,'vaga')),('3 · Pedir','uma mensagem com todas as vagas · você escolhe no WhatsApp',frame(pw,'pedir')),('4 · Fechei com…','a vaga fecha · chega pelo Chegou mercadoria',frame(pw,'fechei'))])

if __name__=='__main__' and os.environ.get('SO_B'):
 with sync_playwright() as pw:
  quadro('esboco_51b_ninguem_tinha.jpg',[('5 · Ninguém tinha','a lista de espera guia o equivalente',frame(pw,'ninguem'))])
