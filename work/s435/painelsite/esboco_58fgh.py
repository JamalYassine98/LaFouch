# Esboço 58f/58g/58h (S435, 22/11 06:20) — fecha a família Site (aprovada 58c):
#  58f Site › Mensagens: só CONTATO (atacado fica em Atacado › Mensagens), abas Novas · Respondidas (2 estados da mesma lista).
#  58g Site › Avaliações: uma tela só — "Para revisar" em cima, "Publicadas" embaixo (junta "Opiniões para revisar" da Vitrine e
#      "Avaliações dos clientes" dos Ajustes do painel).
#  58h Inventário: Modelos sai (58c) → a folha de filtros ganha o bloco "Site": No site · Ocultos (números reais do painel: 16 · 2).
# Vazio = o padrão REAL do app (lfVazioHtml, src/98-anim-novas.js:72), não um desenho do esboço (ajuste do dono 06:19: o balão).
# Base: app real + aprovados (37b ícones/rótulos cinza, 58a Resumo, 58b, 58c, 52b/52d Inventário, 149s). Dados reais: sem mensagens
# e sem avaliações hoje → a tela mostra o vazio padrão (ícone + frase + explicação, regra 15).
exec(open('/home/claude/lafouch/work/s435/painelsite/esboco_58b.py').read().split("def ajustes(pw):")[0])
src=open('/home/claude/lafouch/work/s435/selo/esboco_49.py').read();a=src.index('def quadro(arq,q):');b=src.index("if __name__=='__main__':");exec(src[a:b])
STAR='<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>'
def tela(pw,html,nome):
  b,pg,w=nova(pw);pagina(pg,pg.evaluate("()=>{"+H+";return "+html+"}"));w(3000)
  pg.add_style_tag(content='#mainnav .mn{color:var(--mute)!important}#mainnav .mn svg{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  confere(pg,nome);x=shot(pg,nome);b.close();return x
BAL={'A':'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
     'B':'<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8 9.5h8M8 12.5h5"/>'}
def mensagens(pw,q='A'):
  return tela(pw,r"""'<div class="e49">'+TOP('Site','Mensagens','contato dos clientes pelo site',0)+ABAS(['Novas · 0','Respondidas · 0'],0)+
    lfVazioHtml('"""+BAL[q]+r"""','Nenhuma mensagem nova','Quando um cliente escrever pelo formulário de contato do site, aparece aqui. Pedidos de atacado ficam em Atacado › Mensagens.').replace('<svg ','<svg data-i142="1" ')+'</div>'""",'Mensagens proposta '+q)
def avaliacoes(pw):
  return tela(pw,r"""'<div class="e49">'+TOP('Site','Avaliações','opiniões dos clientes no site',0)+
    LBL('Para revisar · 0')+'<div style="color:var(--mute);font-size:14px;line-height:1.45;margin:8px 0 0">As que parecem suspeitas esperam você aprovar. As normais publicam sozinhas.</div>'+
    LBL('Publicadas · 0')+lfVazioHtml('"""+STAR+r"""','Nenhuma avaliação ainda','Quando um cliente avaliar uma peça no site, ela aparece aqui.')+'</div>'""",'Avaliações proposta')
def filtros(pw,prop):
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(800)
  pg.evaluate("()=>{const f=()=>{const c=document.getElementById('crumb');if(c&&c.textContent!=='16 referências · US$ 420 a custo')c.textContent='16 referências · US$ 420 a custo';const pb=[...document.querySelectorAll('#v-estoque button')].find(x=>x.textContent.trim()==='+'||x.getAttribute('aria-label')==='Adicionar');if(pb&&!pb.querySelector('.e58sel')){pb.style.position='relative';pb.insertAdjacentHTML('beforeend','<i class=\"e58sel\" style=\"position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center\">2</i>')}};f();new MutationObserver(f).observe(document.body,{childList:true,subtree:true,characterData:true})}") if prop else None  # 52b/52d aprovados: resumo no lugar do caminho fixo
  pg.click('#btnFilt');w(900)
  if prop:
    pg.evaluate(r"""()=>{const f=()=>{if(document.querySelector('.e58site'))return;const s=document.getElementById('fSitB');if(!s||!s.querySelector('#fSit .tab'))return;
      const d=s.cloneNode(true);d.classList.add('e58site');d.removeAttribute('id');d.querySelector('.lbl').textContent='Site';
      const bs=[...d.querySelectorAll('.tab')];bs.forEach((x,i)=>{if(i>1){x.remove();return}x.classList.remove('on');x.setAttribute('aria-pressed','false');x.innerHTML='<span>'+(i?'Ocultos':'No site')+'</span><em>'+(i?2:16)+'</em>'});
      s.parentNode.insertBefore(d,s.nextSibling)};f();new MutationObserver(f).observe(document.body,{childList:true,subtree:true})}""");w(600)
  confere(pg,'Filtros '+('proposta' if prop else 'hoje'))
  f='/tmp/e58h_%d.png'%prop;pg.screenshot(path=f);x=Image.open(f);x.load();b.close();return x.copy()
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_58f_mensagens.jpg',[('HOJE · Mensagens (painel)','Todas · Contato · Atacado (atacado repetido)',Image.open(O+'h3_mensagens.jpg').crop((0,0,780,1688))),
    ('A · balão redondo (o do 142c), inteiro','só contato · Novas · Respondidas',mensagens(pw,'A')),('B · balão de conversa com linhas','mesma tela, outro desenho',mensagens(pw,'B'))])
  quadro('esboco_58g_avaliacoes.jpg',[('HOJE · Opiniões (Vitrine)','as suspeitas numa janela da Vitrine',Image.open(O+'estudo/s_vit_Opiniões.png').crop((0,0,780,1688))),
    ('HOJE · Avaliações (Ajustes)','as publicadas num botão dos Ajustes',Image.open(O+'estudo/s_cfg_Avaliações.png').crop((0,0,780,1688))),
    ('PROPOSTA · Site › Avaliações','uma tela: para revisar em cima, publicadas embaixo',avaliacoes(pw))])
  quadro('esboco_58h_filtro_site.jpg',[('HOJE · filtros do Inventário','tipo e situação',filtros(pw,0)),('PROPOSTA · filtros do Inventário','+ Site: No site · Ocultos (Modelos sai)',filtros(pw,1))])
 for n,f in REL: print(n,len(f),f[:4])
