# S93: frases com grau gravadas INTEIRAS; todos os graus de um tipo numa gravação só (mesmo fôlego e tom), com uma frase normal do Mochi antes para pegar a entonação.
# Uso: XI=<chave> python3 grava_s93.py   (chave só por variável de ambiente)
import json,os,sys,subprocess,numpy as np
sys.path.insert(0,'/home/claude/voz_final');from bloco import grava,frases,pcm,ponto_calmo,TRAT
D='/home/claude/voz_final/s93';os.makedirs(D,exist_ok=True);LIMITE=3400;gf_=f'{D}/gasto.txt'
gasto=int(open(gf_).read()) if os.path.exists(gf_) else 0
N={0:'zero',1:'um',2:'dois',3:'três',4:'quatro'};DEC={0:'',25:' e vinte e cinco',50:' e meio',75:' e setenta e cinco'}
def fala_g(g):
  i=int(g);d=round((g-i)*100)
  if i==0:return {25:'zero vinte e cinco',50:'zero cinquenta',75:'zero setenta e cinco'}[d]  # pedido do dono
  return N[i]+DEC[d]
GR=[x/100 for x in range(25,401,25)];gf=lambda g:'+%.2f'%g
TIPOS=[('A',lambda g:('Com a lente '+gf(g)+'. Consegue ler a última frase?','Com a lente '+fala_g(g)+'. Consegue ler a última frase?'),2),
 ('B',lambda g:('Com a lente '+gf(g)+'. E esta?','Com a lente '+fala_g(g)+'. E esta?'),2),
 ('C',lambda g:('Esta é '+gf(g)+'. E agora?','Esta é '+fala_g(g)+'. E agora?'),2),
 ('D',lambda g:('O grau que mais combina com você é '+gf(g)+'.','O grau que mais combina com você é '+fala_g(g)+'.'),1)]
NOVAS=['Só para confirmar: e esta outra?','Vamos tentar com outra frase.','Você afastou o celular para conseguir ler — isso é sinal de vista cansada.','Segure a um palmo e me diga de novo.',
 'Mais uma vez: afaste um pouco e aproxime de novo, devagar.','Uma última vez, para ter certeza.','As medidas ficaram um pouco diferentes.','Na dúvida, fique com o menor.']
CTX='Muito bem.'
def f0(arq):
  x=pcm(arq);P=[];w=640
  for i in range(0,len(x)-w,320):
    s=x[i:i+w]
    if np.sqrt(np.mean(s*s))<.03:continue
    s=s-s.mean();c=np.correlate(s,s,'full')[w-1:];lo,hi=16000//500,16000//120;k=lo+int(np.argmax(c[lo:hi]))
    if c[k]>.5*c[0]:P.append(16000/k)
  return float(np.median(P)) if P else 0
def take(nome,itens):  # itens: [(chave,falado,nfrases)]
  global gasto
  base=f'{D}/{nome}';txt=CTX+' '+' '.join(f for _,f,_ in itens)
  if not os.path.exists(base+'.mp3'):
    if gasto+len(txt)>LIMITE:raise SystemExit(f'PARADO: passaria de {LIMITE} créditos ({gasto})')
    c=grava('pt',txt,base);gasto+=int(c or len(txt));open(gf_,'w').write(str(gasto))
  F=frases(json.load(open(base+'.json')));esp=1+sum(n for *_,n in itens)
  if len(F)!=esp:return None,f'{nome}: esperava {esp} frases, veio {len(F)}'
  x=pcm(base+'.mp3');dur=len(x)/16000;lim=[];k=1
  for _,_,n in itens:lim.append((k,k+n-1));k+=n
  out=[]
  for j,(a,b) in enumerate(lim):
    ini=ponto_calmo(x,max(F[a-1][2]-0.05,F[a-1][1]),min(F[a][1]+0.15,F[a][2]))
    fim=ponto_calmo(x,max(F[b][2]-0.05,F[b][1]),min(F[b+1][1]+0.15,F[b+1][2])) if b+1<len(F) else dur
    out.append((ini,fim))
  return out,None
MAPA={};PROB=[];n=0
def corta(nome,itens,cortes):
  global n
  for (ch,_,_),(a,b) in zip(itens,cortes):
    o=f'pt6_{n:03d}.mp3';n+=1
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{a:.3f}','-to',f'{b:.3f}','-i',f'{D}/{nome}.mp3','-af','silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,afade=t=in:d=0.012,areverse,afade=t=in:d=0.02,areverse,'+TRAT,'-ar','44100','-ac','1','-b:a','128k',f'{D}/{o}'],check=True)
    MAPA[ch]=o
for t,fn,nf in TIPOS:
  itens=[(*fn(g),nf) for g in GR];c,e=take('t'+t,itens)
  if e:PROB.append(e);continue
  corta('t'+t,itens,c)
itens=[(f,f,1) for f in NOVAS];c,e=take('tN',itens)
if e:PROB.append(e)
else:corta('tN',itens,c)
# tom: referência = frases do roteiro já aprovado
ref=float(np.median([f0('/home/claude/catalogo/media/voz/pt/'+f) for f in ['pt4_004.mp3','pt4_005.mp3','pt4_006.mp3','pt4_010.mp3','pt4_014.mp3','pt4_020.mp3','pt4_032.mp3']]))
fora=[]
for ch,o in MAPA.items():
  p=f0(f'{D}/{o}')
  if not p or abs(p-ref)/ref>.05:fora.append((ch,round(p),o))
json.dump(MAPA,open(f'{D}/lista.json','w'),ensure_ascii=False,indent=0)
print('frases',len(MAPA),'créditos',gasto,'tom de referência',round(ref),'Hz');print('problemas',PROB or 'nenhum');print('fora do tom (±5%):',len(fora));[print('  ',x) for x in fora]
