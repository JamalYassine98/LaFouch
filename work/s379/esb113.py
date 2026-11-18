# S379 · esboço 113 (dono 17/11 22:09/22:11 "Perfeito"): conta atacadista só na aba Atacado.
#  a) ficha do cliente sem a parte Atacado · b) Atacado › "+ Novo acesso" com Lojista fixo | Visitante · c) Lojistas com "Canceladas" que abre embaixo · d) conta cancelada (112a no Atacado)
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s379/';T='/tmp/s379/';os.makedirs(T,exist_ok=True)
BASE="""()=>{const L=window.__LF,S=L.S;S.clientes=S.clientes||[];S.clientes.push({id:77,nome:'Óptica Central',email:'compras@exemplo.com',tel:'0981777777'},{id:78,nome:'Óptica Sol',email:'sol@exemplo.com',tel:'0981888888'});
 S.ataContas=S.ataContas||{};S.ataContas.A77={id:'A77',nome:'Óptica Central',email:'compras@exemplo.com',tel:'0981777777',tipo:'assoc',tab:'opt',dispMax:3,trocaOk:true,pausada:false,cancelada:false,cliId:'77',ts:Date.now()-20*864e5,aparelhos:[{id:'d1',nome:'iPhone de Pedro',ult:Date.now()-3600e3}]};
 S.ataContas.A90={id:'A90',nome:'Ótica Visão Norte',email:'vn@exemplo.com',tipo:'visita',tab:'opt',dispMax:3,trocaOk:false,pausada:false,cancelada:false,fim:Date.now()+2*864e5,ts:Date.now()-864e5,aparelhos:[]};
 S.ataContas.A55={id:'A55',nome:'Óptica Sol',email:'sol@exemplo.com',tipo:'assoc',tab:'opt',dispMax:3,cancelada:true,cancEm:Date.now()-5*864e5,cliId:'78',ts:Date.now()-60*864e5,aparelhos:[]};}"""
FICHA="()=>{const L=window.__LF;L.setView('clientes');setTimeout(()=>{const e=[...document.querySelectorAll('#v-clientes [data-act=cliab]')].find(x=>/Central/.test(x.innerText));e&&e.click();setTimeout(()=>{const r=[...document.querySelectorAll('#v-clientes .lb77')].find(x=>/Atacado/i.test(x.textContent));r&&scrollTo({top:r.getBoundingClientRect().top+scrollY-480,behavior:'instant'})},700)},500)}"
FICHA_P="()=>{const r=[...document.querySelectorAll('#v-clientes .lb77')].find(x=>/Atacado/i.test(x.textContent));if(!r)return 0;const g=r.nextElementSibling;r.remove();g&&g.remove();return 1}"
NOVO="()=>{const L=window.__LF;L.setView('ata');setTimeout(()=>L.ACT.ataNovo(),600)}"
NOVO_P=r"""()=>{const j=[...document.querySelectorAll('.ljJn')].pop();j.querySelector('.ljHd b').textContent='Novo acesso ao atacado';const c=j.querySelector('.ljCorpo .col');
 const op=(t,s,on)=>'<button type="button" style="flex:1;text-align:left;padding:12px 14px;border-radius:14px;border:1px solid '+(on?'var(--accent)':'var(--line)')+';background:'+(on?'var(--accent-soft)':'var(--panel2)')+';color:var(--fg);font-family:inherit"><b style="display:block;font-size:15px;font-weight:600">'+t+'</b><small style="color:var(--mute);font-size:12.5px">'+s+'</small></button>';
 c.querySelector('.lbl').outerHTML='<div style="display:flex;gap:8px">'+op('Lojista fixo','não vence',1)+op('Visitante','vence em 3 dias',0)+'</div>';
 const nm=c.querySelector('#ataNm');nm.insertAdjacentHTML('beforebegin','<div class="lbl" style="margin:4px 0 -2px">CLIENTE</div><input class="in" placeholder="Buscar um cliente ou digitar um nome novo" value="Ópt"><div style="border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:-4px"><div style="padding:10px 14px;border-bottom:1px solid var(--line2)"><b style="font-size:15px">Óptica Central</b><small style="display:block;color:var(--mute);font-size:12.5px">0981777777 · compras@exemplo.com</small></div><div style="padding:10px 14px"><b style="font-size:15px">+ Novo cliente “Ópt…”</b></div></div>');
 nm.remove();c.querySelector('#ataTel').remove();c.querySelector('#ataEm').remove();
 [...c.querySelectorAll('.sl')].forEach(s=>{if(/Dura/.test(s.textContent))s.innerHTML='<span>Dura</span><b>não vence</b>';if(/remove/.test(s.textContent))s.innerHTML='<span>Pode trocar de aparelho</span><b>Sim, até o limite</b>'});
 const h=[...c.querySelectorAll('.hint')].find(x=>/Convites ativos/.test(x.textContent));h&&h.remove();return 1}"""
LOJ="()=>{const L=window.__LF;L.setView('ata');setTimeout(()=>{L.ACT.ataAba('loj')},500)}"
LOJ_P=r"""()=>{const s=document.querySelector('#v-ata .ataLs');s.insertAdjacentHTML('afterend','<section class="card ataLs" style="margin-top:12px"><button type="button" class="ataL" aria-expanded="true"><span><b>Canceladas</b><small>1 conta · não entram mais</small></span><i aria-hidden="true" style="transform:rotate(-180deg);display:inline-block">⌄</i></button><button type="button" class="ataL"><span><b>Óptica Sol</b><small>cancelada em 12/11 · ver a conta</small></span><i aria-hidden="true">›</i></button></section>');return 1}"""
CANC="()=>{const L=window.__LF;L.setView('ata');setTimeout(()=>{L.ACT.ataAba('loj');setTimeout(()=>{window.confirm=()=>true;L.ACT.ataLojAbre?L.ACT.ataLojAbre('A77'):0;setTimeout(()=>{L.ACT.ataCanc('A77');L.ACT.ataCanc('A77')},600)},400)},500)}"
CANC_P0="()=>{const L=window.__LF;L.setView('ata');setTimeout(()=>{L.ACT.ataAba('loj');setTimeout(()=>{L.ACT.ataLojAbre?L.ACT.ataLojAbre('A77'):0},400)},500)}"
CANC_P=r"""()=>{const j=[...document.querySelectorAll('.ljJn')].pop();const a=j.querySelector('.ata77');const hd=a.querySelector('.hd77');hd.querySelector('small').innerHTML='Lojista fixo · <span class="w77">Cancelada em 17/11</span>';[...a.children].forEach(c=>{if(c!==hd)c.remove()});
 a.insertAdjacentHTML('beforeend','<p style="font-size:14.5px;line-height:1.5;color:var(--sub);margin:16px 0 18px;text-align:center">O acesso ao catálogo de atacado foi apagado. Ele não entra mais por nenhum aparelho.</p><button type="button" class="go77">Criar novo acesso</button><div style="text-align:center;font-size:12.5px;color:var(--mute);margin-top:8px">manda um convite novo pelo WhatsApp</div>');return 1}"""
CASOS=[('a','cliente-sem-atacado','Clientes › ficha do cliente',FICHA,None,FICHA_P,
  'Hoje: a ficha do cliente tem a parte "Atacado" com "Conta atacadista" (cria e mexe na conta por aqui).',
  'Proposta: a ficha fica só com os dados do cliente. Conta de atacado só na aba Atacado.'),
 ('b','atacado-novo-acesso','Atacado › "+ Novo acesso"',NOVO,None,NOVO_P,
  'Hoje: "+ Novo acesso" só cria visitante (vence em 3 dias); o lojista fixo só nascia pela ficha do cliente.',
  'Proposta: primeiro escolhe "Lojista fixo (não vence)" ou "Visitante (3 dias)". No fixo, busca um cliente que já existe ou cria um novo ali mesmo. O resto (tabela, o que vê, "Enviar convite") continua igual.'),
 ('c','atacado-lojistas','Atacado › Lojistas',LOJ,None,LOJ_P,
  'Hoje: a conta cancelada some da lista (só reaparecia pela ficha do cliente, criando outra conta).',
  'Proposta: embaixo da lista, "Canceladas" abre no lugar e mostra as contas canceladas; tocar abre a conta (só leitura + "Criar novo acesso").'),
 ('d','atacado-cancelar','Atacado › Lojistas › conta · tocar em Cancelar conta',CANC,CANC_P0,CANC_P,
  'Hoje: cada toque abre outra janela por cima e a conta cancelada continua com Cancelar, Pausar e Enviar convite.',
  'Proposta: depois de confirmar (janela do 111b7), a MESMA janela muda no lugar: "Cancelada em 17/11" e só "Criar novo acesso". Pausar, moeda e limite também mudam no lugar, sem abrir outra janela.')]
with sync_playwright() as pw:
  only=os.environ.get('SO','').split(',') if os.environ.get('SO') else None
  for k,nome,tit,hj,p0,pr,h,p in CASOS:
    if only and k not in only: continue
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400);pg.on('dialog',lambda d:d.accept())
        pg.evaluate(BASE);pg.evaluate(p0 if (prop and p0) else hj);w(2600)
        if prop: pg.evaluate(pr);w(500)
        oo.append(olho(pg));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      prancha('113%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
