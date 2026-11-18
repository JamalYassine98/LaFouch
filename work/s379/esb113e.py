# S379 · esboço 113e (dono 17/11 22:28 "Sim"): apagar de vez uma conta de atacado já cancelada.
#  e1) janela da conta cancelada com "Apagar a conta" (texto vermelho) · e2) janela de confirmação (padrão 111/110c)
import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from comum import prancha,olho,novos
from playwright.sync_api import sync_playwright
comum.OUT='/home/claude/lafouch/work/s379/';T='/tmp/s379/'
src=open('esb113.py').read();exec(src[src.index('BASE='):src.index('CASOS=')])
APAGA=r"""()=>{const j=[...document.querySelectorAll('.ljJn')].pop();const a=j.querySelector('.ata77');a.insertAdjacentHTML('beforeend','<div style="text-align:center;margin-top:14px"><button type="button" class="dz105" style="display:inline-block">Apagar a conta</button><div style="font-size:12.5px;color:var(--mute)">some da lista; os pedidos dele continuam no histórico</div></div>');return 1}"""
JAN=r"""()=>{const bk=document.createElement('div'),jn=document.createElement('div');bk.className='ljBk';jn.className='ljJn';jn.innerHTML='<div class="ljPuxa"></div><div class="ljHd"><b>Apagar a conta de atacado?</b></div><div class="ljCorpo"></div>';document.body.append(bk,jn);bk.style.zIndex=5000;jn.style.zIndex=5001;bk.style.opacity='.5';jn.style.transform='translateY(0)';
 jn.querySelector('.ljCorpo').innerHTML='<div style="padding:2px 0 4px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 0;border-bottom:1px solid var(--line2)"><span style="font-size:15px">Óptica Central<small style="display:block;font-size:12.5px;color:var(--mute);margin-top:2px">Lojista fixo · cancelada em 17/11</small></span></div><p style="font-size:14.5px;line-height:1.5;color:var(--sub);margin:14px 0 18px"><b style="color:var(--fg)">Não tem volta.</b> A conta some da lista, deste aparelho e da nuvem. Os pedidos que ele já fez continuam no histórico.</p><button type="button" style="width:100%;min-height:52px;border-radius:14px;border:1px solid var(--bad);background:transparent;color:var(--bad);font-size:16px;font-weight:600;font-family:inherit">Apagar a conta</button><button type="button" style="display:block;margin:6px auto 0;min-height:44px;background:none;border:0;color:var(--fg);font-size:15px;font-weight:600;font-family:inherit">Voltar</button></div>';return 1}"""
with sync_playwright() as pw:
  for esc,tema in ((True,'escuro'),(False,'claro')):
    for k,nome,tit,h,p in (('e1','conta-cancelada-apagar','Atacado › Lojistas › Canceladas › conta','Hoje: a conta cancelada não pode ser apagada; fica guardada para sempre.','Proposta: embaixo de "Criar novo acesso", "Apagar a conta" em texto vermelho (perigo), com a frase do que acontece.'),
                           ('e2','apagar-confirmar','Atacado › conta cancelada · tocar em "Apagar a conta"','Hoje: não existe.','Proposta: a janela de confirmação do padrão (111): "Não tem volta", quem é, o que some e o que fica; botão vermelho "Apagar a conta" e "Voltar". Depois de apagar, volta para Lojistas com o aviso "Conta apagada".')):
      fs=[];oo=[]
      for prop in (0,1):
        b,pg,w=ap.abre(pw,'inicio',esc);w(400)
        pg.evaluate(BASE);pg.evaluate(CANC_P0);w(2600);pg.evaluate(CANC_P);w(400)
        if prop or k=='e2': pg.evaluate(APAGA);w(300)
        if prop and k=='e2': pg.evaluate(JAN);w(500)
        oo.append(olho(pg));fp=T+'%s_%d_%d.png'%(k,esc,prop);pg.screenshot(path=fp);fs.append(fp);b.close()
      print(k,tema,'novos:',novos(oo[0],oo[1]))
      prancha('113%s-app-%s-%s.jpg'%(k,nome,tema),'App · %s · tema %s'%(tit,tema),[h,p],*fs)
