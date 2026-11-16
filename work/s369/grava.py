# S369 (16/11/2026): grava as falas da Mochi no COMPUTADOR (roteiro aprovado em 13/11, work/voz/roteiro-computador.md) pela receita de docs/MOCHI-VOZ.md.
# Uso: XI=<chave> python3 grava.py [tentativa]   — a chave só vem por variável de ambiente. Teto do dono: 6.000 créditos (16/11 01:37).
import json,os,sys,re,subprocess,urllib.request,urllib.error,base64,glob
sys.path.insert(0,'/home/claude/lafouch/work/voz');sys.path.insert(0,'/home/claude/lafouch/work/s164')
import numpy as np
os.environ.setdefault('XI','x');from bloco import frases,pcm,ponto_calmo,TRAT
from mede import mede
import voz
K=os.environ['XI'];VOZ={'pt':'SvXoJJzLNRI3wECTYrmU','es':'3vRJJjv6BIKZYw2NzOER'};TETO=6000;D='/home/claude/voz_s369/';gf=D+'gasto.txt';SITE='/home/claude/catalogo/media/voz/'
I18=open('/home/claude/catalogo/js/lf-i18n.js',encoding='utf-8').read()
def es(k):
    m=re.search(re.escape(json.dumps(k,ensure_ascii=False))+r':("(?:[^"\\]|\\.)*")',I18);assert m,k;return json.loads(m.group(1))
# cada cena = conversa com as falas vizinhas; * = fala nova (as outras já estão gravadas e só dão o tom)
CENAS=[['*Este teste fica melhor no celular.','*Aponte a câmera para este código…','*…ou seguimos aqui, como preferir.','Quando quiser, é só tocar em Começar.'],
 ['Posso usar a câmera?','*É só para medir a distância da tela até o seu rosto.','Nada é gravado.','Se preferir, a gente faz sem.'],
 ['Tudo bem, sem problema!','*Vamos sem a câmera: fique a um braço da tela, uns 60 centímetros.'],
 ['Faz como eu: tire os óculos…','*…e fique a 60 centímetros da tela, um braço.'],
 ['*Você se afastou da tela para conseguir ler — isso é sinal de vista cansada.','*Chegue um pouquinho mais perto da tela.','*Afaste-se um pouquinho da tela.'],
 ['Pronto!','*No computador este resultado é uma estimativa.','*Para confirmar, faça o teste no celular.']]
def falado(t,lang):
    t=t.replace('"','').replace('…e ','… e ').replace('…y ','… y ').replace('…ou ','… ou ').replace('…o ','… o ')
    t=re.sub(r'^… ','',t);return t.replace('60 centímetros','sessenta centímetros' if lang=='pt' else 'sesenta centímetros')
def gasto(): return int(open(gf).read()) if os.path.exists(gf) else 0
def grava(lang,txt,nome):
    g=gasto()
    if g+len(txt)>TETO: raise SystemExit('PARADO: passaria do teto (%d + %d)'%(g,len(txt)))
    body=json.dumps({'text':txt,'model_id':'eleven_v3','language_code':lang,'voice_settings':{'stability':0.5}}).encode()
    rq=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/%s/with-timestamps?output_format=mp3_44100_128'%VOZ[lang],data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(rq,timeout=300) as r: d=json.loads(r.read());cc=int(r.headers.get('character-cost') or len(txt))
    except urllib.error.HTTPError as e: raise SystemExit('PARADO: o serviço recusou (%s): %s'%(e.code,e.read().decode('utf-8','replace')[:400]))
    open(nome+'.mp3','wb').write(base64.b64decode(d['audio_base64']));json.dump(d['alignment'],open(nome+'.json','w'));open(gf,'w').write(str(g+cc));return cc
REF={}
def ref(lang):
    if lang not in REF:
        L=json.load(open(SITE+lang+'/lista.json'));fs=[];[fs.extend([v] if isinstance(v,str) else v) for v in L.values()];fs=sorted(set(fs))[::6][:26]
        E=[voz.emb(SITE+lang+'/'+f) for f in fs];M=[mede(SITE+lang+'/'+f) for f in fs];REF[lang]=(np.mean(E,0),float(np.median([m['f0'] for m in M if m and m['f0']])))
    return REF[lang]
def sil(t): return len(re.findall(r'[aeiouáéíóúâêôãõàü]+',t.lower()))
def corta(lang,c,tent):
    base=D+'%s_c%d_t%d'%(lang,c,tent);lst=[k.lstrip('*') if lang=='pt' else es(k.lstrip('*')) for k in CENAS[c]];nov=[k[0]=='*' for k in CENAS[c]]
    if not os.path.exists(base+'.mp3'): print('  gravou',lang,c,tent,'custo',grava(lang,' '.join(falado(k,lang) for k in lst),base),flush=True)
    F=frases(json.load(open(base+'.json')))
    if len(F)!=len(lst): return [dict(k=k,pt=CENAS[c][i].lstrip('*'),ok=False,por='cena com %d frases (esperava %d)'%(len(F),len(lst))) for i,k in enumerate(lst) if nov[i]]
    x=pcm(base+'.mp3');cortes=[0.0]
    for i in range(len(F)-1): cortes.append(ponto_calmo(x,max(F[i][2]-0.05,F[i][1]),min(F[i+1][1]+0.15,F[i+1][2])))
    cortes.append(len(x)/16000);E0,f0r=ref(lang);simc=voz.sim(voz.emb(base+'.mp3'),E0);out=[];f0s=[]
    for i,k in enumerate(lst):
        o=base+'_%d.mp3'%i
        subprocess.run(['ffmpeg','-v','error','-y','-ss','%.3f'%cortes[i],'-to','%.3f'%cortes[i+1],'-i',base+'.mp3','-af','silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,afade=t=in:d=0.012,areverse,afade=t=in:d=0.02,areverse,'+TRAT,'-ar','44100','-ac','1','-b:a','128k',o],check=True)
        m=mede(o,k);m['sim']=round(voz.sim(voz.emb(o),E0),3);m['simc']=round(simc,3);m['arq']=o;m['k']=k;m['pt']=CENAS[c][i].lstrip('*');m['nova']=nov[i];m['spb']=round(m['dur']/max(1,sil(k)),3);f0s.append(m['f0']);out.append(m)
    fm=float(np.median([f for f in f0s if f]))
    for m in out:
        P=[]
        if m['pico']>=.62: P.append('pico %.2f'%m['pico'])
        if m['pausa']>400: P.append('pausa %d ms'%m['pausa'])
        if m['sil_ini']>60: P.append('silêncio no começo %d ms'%m['sil_ini'])
        if m['sil_fim']>230: P.append('silêncio no fim %d ms'%m['sil_fim'])
        if not(-20<=m['lufs']<=-17): P.append('volume %.1f'%m['lufs'])
        if m['f0'] and abs(m['f0']/f0r-1)>.15: P.append('tom %d (padrão %d)'%(m['f0'],f0r))
        if m['f0'] and abs(m['f0']/fm-1)>.08: P.append('tom fora da cena %d×%d'%(m['f0'],fm))
        if m['sim']<.85: P.append('semelhança %.2f'%m['sim'])
        if simc<.90: P.append('semelhança da cena %.2f'%simc)
        m['ok']=not P;m['por']='; '.join(P)
    return [m for m in out if m['nova']]
if __name__=='__main__':
    tent=int((sys.argv[1:] or ['1'])[0]);so=sys.argv[2:]  # cenas a regravar: "pt:0 es:3"
    R=json.load(open(D+'medidas.json')) if os.path.exists(D+'medidas.json') else {}
    for lang in ('pt','es'):
        for c in range(len(CENAS)):
            if tent>1 and '%s:%d'%(lang,c) not in so: continue
            for m in corta(lang,c,tent): R.setdefault(lang+'|'+m['pt'],{})[str(tent)]=m
    json.dump(R,open(D+'medidas.json','w'),ensure_ascii=False,indent=0)
    for k,v in R.items():
        m=v.get(str(tent))
        if m: print(('ok  ' if m['ok'] else 'RUIM'),k[:2],m.get('dur'),'s sim',m.get('sim'),'f0',m.get('f0'),'pico',m.get('pico'),'lufs',m.get('lufs'),'|',m['k'][:44],'|',m['por'])
    print('créditos gastos até agora:',gasto())
