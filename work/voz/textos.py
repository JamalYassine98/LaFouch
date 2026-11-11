# monta as cenas em espanhol iguais às do português (mesmas frases, mesma ordem), com o texto que o SITE mostra em espanhol
import json,re,sys
sys.path.insert(0,'/home/claude/lafouch/work/voz')
from cenas import CENAS
from playwright.sync_api import sync_playwright
NOV=[['Antes, um aviso importante: este teste é só para óculos de leitura.','Não serve para miopia, astigmatismo nem multifocal, e não substitui o oftalmologista.'],
 ['Posso usar a câmera?','É só para medir a distância do celular até o seu rosto.','Nada é gravado.','Se preferir, a gente faz sem.'],
 ['É só tocar em "Permitir" na janelinha.','Obrigado!'],['Tudo bem, sem problema!','Vamos sem a câmera: segure o celular a uns 30 centímetros, um palmo.'],
 ['Está um pouquinho escuro.','Vá para um lugar mais iluminado: com pouca luz a gente lê pior.'],
 ['Agora uma última coisa: aproxime o celular devagar e toque quando as letras começarem a embaçar.','Segure aí um instante…'],
 ['Ficou um pouco diferente.','Vamos repetir uma vez.','As duas medidas combinam.']]
S93N=['Só para confirmar: e esta outra?','Vamos tentar com outra frase.','Você afastou o celular para conseguir ler — isso é sinal de vista cansada.','Segure a um palmo e me diga de novo.',
 'Mais uma vez: afaste um pouco e aproxime de novo, devagar.','Uma última vez, para ter certeza.','As medidas ficaram um pouco diferentes.','Na dúvida, fique com o menor.']
GR=[x/100 for x in range(25,401,25)];gf=lambda g:'+%.2f'%g
ES_N={0:'cero',1:'uno',2:'dos',3:'tres',4:'cuatro'};ES_D={0:'',25:' veinticinco',50:' y medio',75:' setenta y cinco'}
def gfala(g):
  i=int(g);d=round((g-i)*100)
  if i==0:return {25:'cero veinticinco',50:'cero cincuenta',75:'cero setenta y cinco'}[d]
  return ES_N[i]+ES_D[d]
pt=set();cen=[]
for i,c in enumerate(CENAS):cen.append(('c%02d'%i,[(it if isinstance(it,str) else it[0]) for it in c]))
for i,c in enumerate(NOV):cen.append(('n%02d'%i,c))
todos=sorted({k for _,l in cen for k in l}|set(S93N)|{'Com a lente','Esta é','Pronto! O grau que mais combina com você é','Consegue ler a última frase?','E esta?','E agora?','Muito bem.'})
with sync_playwright() as p:
  b=p.chromium.launch();c=b.new_context();c.add_init_script("localStorage.setItem('lf_lang','es')");pg=c.new_page()
  pg.route('**/*',lambda r:r.continue_() if 'localhost' in r.request.url else r.abort())
  pg.goto('http://localhost:8160/');pg.wait_for_timeout(2500)
  TR=dict(zip(todos,pg.evaluate("L=>L.map(k=>LFI.tr(k))",todos)));b.close()
ESJ=json.load(open('/home/claude/voz_final/es.json'))
for k in todos:
  if TR[k]==k and k in ESJ:TR[k]=ESJ[k]
falta=[k for k in todos if TR[k]==k]
def fal(t):return t.replace('"','').replace('30 centímetros','treinta centímetros').lstrip('…')
J=[]  # cenas: nome, ctx, [(chave_es, falado)]
for nome,l in cen:J.append(dict(nome=nome,ctx='',itens=[(TR[k],fal(TR[k]),k) for k in l],pt=('/home/claude/voz_final/pt/' if nome[0]=='c' else '/home/claude/voz_final/novas/')+nome+'.json'))
D=TR['Pronto! O grau que mais combina com você é'].split(' ',1)[1]
TIP={'A':lambda g:(TR['Com a lente']+' '+gf(g)+'. '+TR['Consegue ler a última frase?'],TR['Com a lente']+' '+gfala(g)+'. '+TR['Consegue ler a última frase?'],'Com a lente '+gf(g)+'. Consegue ler a última frase?'),
     'B':lambda g:(TR['Com a lente']+' '+gf(g)+'. '+TR['E esta?'],TR['Com a lente']+' '+gfala(g)+'. '+TR['E esta?'],'Com a lente '+gf(g)+'. E esta?'),
     'C':lambda g:(TR['Esta é']+' '+gf(g)+'. '+TR['E agora?'],TR['Esta é']+' '+gfala(g)+'. '+TR['E agora?'],'Esta é '+gf(g)+'. E agora?'),
     'D':lambda g:(D[0].upper()+D[1:]+' '+gf(g)+'.',D[0].upper()+D[1:]+' '+gfala(g)+'.','O grau que mais combina com você é '+gf(g)+'.')}
for t,fn in TIP.items():J.append(dict(nome='t'+t,ctx=TR['Muito bem.'],itens=[fn(g) for g in GR],pt='/home/claude/voz_final/s93/t%s.json'%t,grau=1))
J.append(dict(nome='tN',ctx=TR['Muito bem.'],itens=[(TR[k],fal(TR[k]),k) for k in S93N],pt='/home/claude/voz_final/s93/tN.json'))
json.dump(J,open('/home/claude/lafouch/work/s166/cenas_es.json','w'),ensure_ascii=False,indent=1)
print('sem tradução:',falta);print('cenas',len(J),'frases',sum(len(j['itens']) for j in J),'caracteres',sum(len(j['ctx'])+sum(len(x[1]) for x in j["itens"]) for j in J))
