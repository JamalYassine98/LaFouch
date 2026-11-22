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
  # 3 abas: a 'Tabela' sai (vira o setor do Titan); 'Enviar catálogo a um lojista' vai para o começo de Lojistas
  pg.evaluate(r"""()=>{const f=()=>{const v=document.getElementById('v-ata');if(!v)return;v.querySelectorAll('[data-act=ataAba][data-id=tab]').forEach(b=>b.remove());
     if(!v.querySelector('.e65env')){const ab=v.querySelector('[role=tablist]')||v.querySelector('[data-act=ataAba]')?.parentElement;if(ab){ab.insertAdjacentHTML('afterend','<button type="button" class="e65env" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);color:var(--fg);font:inherit;text-align:left;margin-top:8px"><span style="flex:1"><b style="display:block;font-size:16px;font-weight:500">Enviar catálogo a um lojista</b><small style="font-size:13px;color:var(--mute)">catálogo PDF ou planilha, com a tabela dele</small></span><i style="font-style:normal;color:var(--mute);font-size:18px">›</i></button>')}}};
     f();new MutationObserver(f).observe(document.body,{childList:true,subtree:true})}""");w(500)
  if conta:
    pg.click('[data-act=ataLojAbre][data-id=t65]');w(1500)
    pg.evaluate(r"""()=>{const f=()=>{const lb=[...document.querySelectorAll('.lb77')].find(x=>/^Moeda/.test(x.textContent));if(!lb||document.querySelector('.e65tab'))return;
       lb.insertAdjacentHTML('beforebegin','<div class="lb77 e65tab">Tabela de preço</div><div class="gp77"><div class="rw77"><span class="tx"><b>Atacado 1K</b><small>40% · mín. US$ 1.000</small></span><span class="vl" style="color:var(--mute)">›</span></div></div>')};
       f();new MutationObserver(f).observe(document.body,{childList:true,subtree:true})}""");w(500)
  pg.add_style_tag(content='#mainnav,#nvBar{display:none!important}')
  confere(pg,'Atacado '+('conta' if conta else 'lojistas'));f='/tmp/a65_%d.png'%conta;pg.screenshot(path=f,full_page=not conta);x=Image.open(f).copy();b.close();return x
if __name__=='__main__':
 with sync_playwright() as pw:
  h=Image.open(O+'h65_tabela.png')
  quadro('esboco_65_atacado_titan.jpg',[('HOJE · Atacado › Tabela','enviar catálogo · ver a tabela · editar margens',h.crop((0,0,780,min(h.height,1688)))),
    ('PROPOSTA · Preços › Atacado','o Titan: só as margens das 7 tabelas',titan(pw)),
    ('PROPOSTA · Atacado (3 abas)','sem a aba Tabela · enviar catálogo em Lojistas',atacado(pw,False)),
    ('PROPOSTA · conta do lojista','você escolhe a tabela dele (lojista de teste)',atacado(pw,True))])
 for n,f in REL: print(n,len(f),f[:4])
