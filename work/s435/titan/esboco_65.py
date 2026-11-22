# Esboço 65 (S435, 22/11 13:10) — ATACADO: o Titan trabalha só nas MARGENS das tabelas; no Atacado o dono só ESCOLHE a tabela
# de cada atacadista (dono 22/11 13:01). Base: app real + aprovados (54 escritório; Atacado MANTÉM as abas — 49a reprovado —, agora
# 3: Mensagens · Lojistas · Lotes, porque a aba Tabela vira o setor do Titan; 77d/113 conta atacadista; 37b cinza).
# Dados reais (src/96-tabelas-preco.js): 7 tabelas, todas com 15 peças batendo no chão (o preço normal de teste está abaixo do mínimo).
# HOJE a conta do lojista NÃO deixa escolher a tabela (o app põe sozinho a 1ª 'Atacado'); o lojista do quadro é de TESTE.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
IC2.update(tab='<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>')
JS4='const I='+json.dumps(IC2)+JS[JS.index(';const R='):]
TABS=[('Óptica','70% · sem mínimo'),('Vendedor','55% · sem mínimo'),('Atacado 1K','40% · mín. US$ 1.000'),
      ('Atacado 2K','32% · mín. US$ 2.000'),('Atacado 5K','25% · mín. US$ 5.000'),
      ('Atacado 10K','18% · mín. US$ 10.000'),('Óptica frete grátis','70% · frete embutido')]
def titan(pw):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}')
  html=pg.evaluate("(T_)=>{"+H+JS4+r"""const AV='var(--warn,#e0b44c)';
   return '<div class="e49">'+TOP('Preços','Atacado','margens das tabelas · o Titan confere',0)+T('Tabelas · 7',1)+
    T_.map(t=>R('tab',t[0],t[1],'<span style="color:'+AV+'">15 no chão</span>','')).join('')+
    '<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:16px 0 32px">No chão = a tabela não consegue a margem e fica no mínimo da peça. Quem escolhe a tabela de cada lojista é você, no Atacado.</div></div>'}""",TABS)
  pagina(pg,html);w(600);pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  confere(pg,'Titan Atacado');pg.screenshot(path='/tmp/t65.png',full_page=True);x=Image.open('/tmp/t65.png').copy();b.close();return x
def atacado(pw,conta):
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(600)
  if conta: pg.evaluate("()=>{__LF.S.ataContas['t65']={id:'t65',nome:'Lojista de teste',email:'',tel:'',tipo:'assoc',tab:'a1',dispMax:3,trocaOk:true,moeda:'usd',aparelhos:[],ts:Date.now()}}")
  pg.evaluate("()=>{__LF.S.ataAba='loj';__LF.setView('ata')}");w(1400)
  # L2: o + redondo centro com centro na linha do título (hoje fica 4 px abaixo) — regra única para todos os títulos com +
  pg.evaluate(r"""()=>{const f=()=>{const v=document.getElementById('v-ata');if(!v)return;const h=[...v.querySelectorAll('h1')].find(x=>x.offsetParent);const p=[...v.querySelectorAll('button')].find(b=>b.offsetParent&&b.textContent.trim()==='+');if(!h||!p||p.dataset.e65)return;p.dataset.e65=1;const a=h.getBoundingClientRect(),b=p.getBoundingClientRect();p.style.transform='translateY('+((a.top+a.bottom)/2-(b.top+b.bottom)/2)+'px)'};f();new MutationObserver(f).observe(document.body,{childList:true,subtree:true})}""");w(300)
  # 3 abas: a 'Tabela' sai (vira o setor do Titan); 'Enviar catálogo a um lojista' vai para o começo de Lojistas
  pg.evaluate(r"""()=>{const f=()=>{const v=document.getElementById('v-ata');if(!v)return;v.querySelectorAll('[data-act=ataAba][data-id=tab]').forEach(b=>b.remove());
     if(!v.querySelector('.e65env')){const ab=v.querySelector('[role=tablist]')||v.querySelector('[data-act=ataAba]')?.parentElement;if(ab){ab.insertAdjacentHTML('afterend','<button type="button" class="e65env" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;margin-top:8px"><span style="flex:1"><b style="display:block;font-size:16px;font-weight:500">Enviar catálogo a um lojista</b><small style="font-size:13px;color:var(--mute)">catálogo PDF ou planilha, com a tabela dele</small></span><i style="font-style:normal;color:var(--mute);font-size:18px">›</i></button>')}}};
     f();new MutationObserver(f).observe(document.body,{childList:true,subtree:true})}""");w(500)
  if conta:
    pg.click('[data-act=ataLojAbre][data-id=t65]');w(1500)
    # conta do lojista no padrão de luxo atual (dono 22/11 13:06): um título (o nome), um eixo à esquerda, linhas finas, sem caixas
    pg.evaluate(r"""()=>{const box=document.querySelector('.ata77');if(!box)return;const host=box.parentElement;
      [...document.querySelectorAll('h1,h2,h3,b,div')].filter(x=>x.children.length==0&&x.textContent.trim()==='Conta atacadista').forEach(x=>x.style.display='none');
      const L=t=>'<div style="font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:24px 0 4px">'+t+'</div>';
      const R=(t,s,v)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b>'+(s?'<small style="font-size:13px;color:var(--mute)">'+s+'</small>':'')+'</span>'+v+'</div>';
      const CH='<i style="font-style:normal;color:var(--mute);font-size:18px">›</i>';
      const ST='<span style="display:flex;align-items:center;gap:16px;border:1px solid var(--line2);border-radius:22px;height:44px;padding:0 16px"><b style="font-weight:400;color:var(--mute)">−</b><b>3</b><b style="font-weight:400;color:var(--mute)">+</b></span>';
      host.innerHTML='<div style="padding:0 4px 24px;text-align:left">'+
        '<h2 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:28px">Lojista de teste</h2>'+
        '<div style="color:var(--mute);font-size:14px;margin-top:4px">Lojista fixo · <span style="color:var(--ok,#4fbf7f)">Ativa</span> · não vence</div>'+
        L('Tabela de preço')+R('Atacado 1K','40% · mín. US$ 1.000',CH)+
        L('Aparelhos')+R('Em uso','ainda não entrou de nenhum aparelho','<span style="color:var(--mute)">0 de 3</span>')+R('Limite','',ST)+
        L('Acesso')+R('Pode trocar de aparelho','ele troca sozinho, até o limite','<button type="button" class="nfTg on" role="switch" aria-checked="true"><i></i></button>')+
        L('Moeda que ele vê primeiro')+'<div class="sg77" style="margin-top:8px"><button type="button" class="on">US$</button><button type="button">Gs.</button><button type="button">R$</button></div>'+
        '<div style="margin-top:8px">'+R('Lotes de atacado','preços congelados até uma data',CH)+'</div>'+
        '<button type="button" class="go77" style="margin-top:24px">Enviar convite pelo WhatsApp</button>'+
        '<div style="text-align:center;margin-top:16px"><button type="button" style="display:block;margin:16px auto 0;background:none;border:0;color:var(--fg);font:600 17px system-ui;min-height:44px;line-height:44px;padding:0 16px">Pausar conta</button><small style="display:block;color:var(--mute);font-size:14px">o catálogo some; nada é apagado</small><button type="button" style="display:block;margin:16px auto 0;background:none;border:0;color:var(--bad,#e5484d);font:600 17px system-ui;min-height:44px;line-height:44px;padding:0 16px">Cancelar conta</button><small style="display:block;color:var(--mute);font-size:14px">apaga o acesso; para voltar, novo convite</small></div></div>'}""");w(500)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  confere(pg,'Atacado '+('conta' if conta else 'lojistas'));f='/tmp/a65_%d.png'%conta
  if not conta:
    pg.screenshot(path=f,full_page=True);x=Image.open(f).copy();b.close();return x
  # a janela inteira cabe: a tela do simulador fica mais alta só nesta foto
  pg.set_viewport_size({'width':390,'height':1120});w(700);pg.screenshot(path=f);x=Image.open(f).copy();b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  h=Image.open(O+'h65_tabela.png')
  quadro('esboco_65_atacado_titan.jpg',[('HOJE · Atacado › Tabela','enviar catálogo · ver a tabela · editar margens',h.crop((0,0,780,min(h.height,1688)))),
    ('PROPOSTA · Preços › Atacado','o Titan: só as margens das 7 tabelas',titan(pw)),
    ('PROPOSTA · Atacado (3 abas)','sem a aba Tabela · enviar catálogo em Lojistas',atacado(pw,False)),
    ('PROPOSTA · conta do lojista','padrão de luxo · você escolhe a tabela (lojista de teste)',atacado(pw,True))])
 for n,f in REL: print(n,len(f),f[:4])
