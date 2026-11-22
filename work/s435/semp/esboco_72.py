# Esboço 72 (S435, 22/11 15:55) — Marketing › AGENDA na base nova (dono 15:49 'Sim' ao implementar do 70: os setores precisam de esboço
# antes, para o APP não inventar telas). Refaz o esboço-ideia de 20/11 15:30 (work/semp/esboco_semp_agenda_*).
# Base: app real (o Plano da semana e as Datas que vêm aí de hoje, dados de teste) + aprovados: 70 (Marketing), '+' na linha do título
# (L2, 22/11 13:09), rótulos e ícones cinza (37b, 21/11 17:54), sem descrição inútil (dono 14:46), Titan, nome curto (Leitura…/Solar…).
# Sai do Marketing: Plano da semana e Datas (vêm para cá). Dados REAIS: 0 de 6 feitos; os 6 itens do plano de hoje; Natal em 33 d; Ano Novo em 40 d.
exec(open('/home/claude/lafouch/work/s435/titan/esboco_62.py').read().split("def regras(pw")[0])
O='/home/claude/lafouch/work/s435/semp/'
AG=r"""const BOL=(t,s)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:none;width:24px;height:24px;border-radius:50%;border:1.5px solid var(--mute)"></span><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+s+'</small></span></div>';
 const DT=(t,s,v)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute)">'+s+'</small></span><span style="font-size:15px;font-variant-numeric:tabular-nums">'+v+'</span></div>';
 const DOB=(t,s)=>'<div style="display:flex;align-items:center;gap:16px;min-height:64px;border-bottom:1px solid var(--line2)"><span style="flex:1;min-width:0"><b style="display:block;font-size:16px;font-weight:500">'+t+'</b><small style="display:block;font-size:13px;color:var(--mute)">'+s+'</small></span><span style="color:var(--mute);font-size:18px">⌄</span></div>';"""
def agenda(pw,esc):
  b,pg,w=ap.abre(pw,'inicio',esc,'celular',base=True);w(500);pg.click('#mainnav .mn[data-id="g:pecas"]');w(900)
  pg.add_style_tag(content='#nvBar{display:none!important}#grTog,#iniTog2{visibility:hidden!important}#mainnav .mn,#mainnav .mn *{color:var(--mute)!important}#mainnav .mn svg,#mainnav .mn svg *{stroke:var(--mute)!important}#mainnav .mn::after,#mainnav .mn i{display:none!important}')
  html=pg.evaluate("()=>{"+H+JS+AG+r"""return '<div class="e49">'+TOP('Marketing','Agenda','',1)+
   T('Esta semana · 0 de 6 feitos',1)+BOL('Seg · Post · 20h','Leitura Kazwini de acetato · a que mais vende')+BOL('Ter · Status · 12h','Leitura de acetato unissex · status do dia')+
   BOL('Qua · Carrossel · 20h','4 peças · Solar Ray-Ban, Solar Kazwini tr90…')+BOL('Qui · Story · 20h','Leitura de plástico feminino · chegou')+
   BOL('Sex · Vídeo · 20h','comercial de 15 s · Solar #14 e mais 2')+BOL('Sáb · Post · 20h','Armação #11 · oferta ou mais vendido')+
   T('Datas que vêm aí')+DT('Natal','BR/PY · presente: embalagem e combo','em 33 d')+DT('Ano Novo','BR/PY · solar para o verão','em 40 d')+
   '<div style="margin-top:32px">'+DOB('Próxima semana','o Semp monta na segunda, 23/11')+'</div></div>'}""")
  pagina(pg,html);w(600)
  pg.evaluate("()=>{const B=[...document.querySelectorAll('.e49 small')].filter(e=>e.scrollWidth>e.clientWidth+1);return B.map(b=>b.textContent)}")
  pg.add_style_tag(content='#mainnav{display:none!important}')
  confere(pg,'Agenda '+('escuro' if esc else 'claro'));x=pg.screenshot(path='/tmp/ag%d.png'%esc,full_page=True);b.close()
  im=Image.open('/tmp/ag%d.png'%esc);im.load();return im.copy()
if __name__=='__main__':
 with sync_playwright() as pw:
  quadro('esboco_72_agenda.jpg',[('PROPOSTA · Marketing › Agenda','escuro',agenda(pw,True)),('PROPOSTA · Marketing › Agenda','claro',agenda(pw,False))])
 for n,f in REL: print(n,len(f),f[:5])
