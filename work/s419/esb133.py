# S419 · esboço 133 (dono 18/11 09:25 "Posso ver?"): Novo cliente e Atacado › Tabela no padrão do Caixa (só para comparar).
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s419/';T='/tmp/s419/'
CA="""#cliFicha.cf77{background:none!important;border:0!important;box-shadow:none!important;padding:6px 0 20px!important}
#cliFicha .hd77{align-items:flex-start!important;text-align:left!important;padding:4px 0 4px!important}
#cliFicha .hd77 h2{font-family:inherit!important;font-weight:700!important;font-size:20px!important}
#cliFicha .gp77{background:none!important;border:0!important;border-radius:0!important}
#cliFicha .rw77{padding:6px 0!important;border-top:0!important;border-bottom:1px solid var(--line2)!important}
#cliFicha .lb77{margin:18px 0 4px!important;font-size:11px!important;letter-spacing:.14em!important;color:var(--mute)!important}
#cliFicha .x77{top:2px!important;right:0!important}"""
CB="""#v-ata section.card.ataLs{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;border-radius:0!important}
#v-ata section.card.ataLs .ataL:last-child{border-bottom:0}"""
CASOS=[('a','novo-cliente','Clientes · Novo cliente',["()=>__LF.setView('clientes')","()=>document.querySelector('[data-act=clinovo]').click()"],CA,
  'Hoje (esboço 77): título "Novo cliente" centralizado na letra de título; os campos num grupo com fundo arredondado.',
  'Como seria no padrão do Caixa: título à esquerda na letra das janelas; "DADOS" em versalete e os campos em linhas finas, sem o fundo. Conteúdo e botões iguais.'),
 ('b','atacado-tabela','Atacado › Tabela',["()=>__LF.inicioGo('ata')","()=>__LF.ACT.ataAba('tab')"],CB,
  'Hoje: as 3 linhas dentro de um grupo com fundo arredondado.',
  'Como seria no padrão do Caixa: as mesmas 3 linhas finas, sem o fundo (igual ao "MAIS" do Câmbio). Valeria também para Lojistas, Lotes e Mensagens.')]
with sync_playwright() as pw:
  for k,nome,tit,ps,css,h,p in CASOS:
    for esc,tema in ((True,'escuro'),(False,'claro')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400)
        for x in ps: pg.evaluate(x);w(1100)
        if prop: pg.add_style_tag(content=css);w(400)
        oo.append(olho(pg));fp=T+'c%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      prancha('133%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
