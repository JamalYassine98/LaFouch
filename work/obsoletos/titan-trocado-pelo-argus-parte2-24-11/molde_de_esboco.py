# TITAN · molde a partir do esboço APROVADO (parte 1b, ESBOCO 24/11; dono 11:48: "testar o gabarito e ajustar sem remendo")
# Roda de novo o script do esboço aprovado só para MEDIR: a cada foto que o script tira, guarda as peças da tela (compara.PECAS)
# e a foto crua. As imagens aprovadas do esboço são restauradas do git no fim (nada do aprovado muda).
# uso: python3 molde_de_esboco.py <script do esboço> <id do molde>
import sys,os,json,shutil,subprocess,runpy
ARGV=sys.argv[:]
sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit')
import importlib.util as _iu
_sp=_iu.spec_from_file_location('titan_compara',os.path.join(os.path.dirname(os.path.abspath(__file__)),'compara.py'));compara=_iu.module_from_spec(_sp);_sp.loader.exec_module(compara)  # nome próprio: os esboços têm um 'compara' deles
from playwright.sync_api._generated import Page
scr,mid=ARGV[1],ARGV[2]
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'moldes',mid);os.makedirs(D,exist_ok=True)
SHOTS=[];orig=Page.screenshot
def shot(self,*a,**k):
  try:p=compara.pecas(self)
  except Exception as e:p={'erro':str(e)[:80]}
  r=orig(self,*a,**k);n=len(SHOTS);f=os.path.join(D,'cru_%02d.png'%n)
  dst=k.get('path') or (a[0] if a else None)
  if dst and os.path.exists(dst):shutil.copy(dst,f)
  elif isinstance(r,(bytes,bytearray)):open(f,'wb').write(r)
  SHOTS.append({'n':n,'para':dst,'url':self.url[-30:],'pecas':list(p.values()) if isinstance(p,dict) else p})
  return r
Page.screenshot=shot
pasta=os.path.dirname(os.path.abspath(scr));sys.argv=[scr];os.chdir(pasta)
try:runpy.run_path(scr,run_name='__main__')
except SystemExit:pass
except Exception as e:print('script parou:',str(e)[:160],'| compara =',getattr(sys.modules.get('compara'),'__file__',None))
finally:
  json.dump(SHOTS,open(os.path.join(D,'medidas.json'),'w'),ensure_ascii=False)
  subprocess.run(['git','-C','/home/claude/lafouch','checkout','--',pasta],capture_output=True)
  subprocess.run(['git','-C','/home/claude/lafouch','clean','-fdq',pasta],capture_output=True)
  print('molde',mid,':',len(SHOTS),'fotos medidas')
