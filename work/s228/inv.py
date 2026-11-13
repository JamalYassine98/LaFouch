# S228: inventário das animações (site e app) lendo o CSS/JS de verdade. Só leitura.
import re, json, collections, glob
def le(fs): return '\n'.join(open(f,encoding='utf8',errors='ignore').read() for f in fs)
ALVOS={'site':['/home/claude/catalogo/index.html','/home/claude/catalogo/js/lf-site.js']+glob.glob('/home/claude/catalogo/lfx/*.js'),'app':['/home/claude/lafouch/www/style.css','/home/claude/lafouch/www/app.js','/home/claude/lafouch/www/index.html']}
LAYOUT=re.compile(r'\b(width|height|top|left|right|bottom|margin|padding|max-height|max-width|font-size|grid-template|flex-basis|all)\b')
out={}
for nome,fs in ALVOS.items():
    s=le(fs); r={}
    kf=set(re.findall(r'@keyframes\s+([\w-]+)',s)); r['keyframes']=len(kf)
    an=re.findall(r'animation\s*:\s*([^;}"\']+)',s); r['usosAnimation']=len(an)
    usados=set(); dur=collections.Counter(); eas=collections.Counter(); inf=collections.Counter()
    for a in an:
        for parte in a.split(','):
            n=[w for w in parte.split() if w in kf]
            if n: usados.add(n[0])
            for d in re.findall(r'(?<![\w.-])(\d*\.?\d+)(ms|s)\b',parte)[:1]: dur[round(float(d[0])*(1 if d[1]=='s' else .001),2)]+=1
            e=re.search(r'cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|linear|ease|steps\([^)]*\)',parte); eas[e.group(0) if e else '(padrão ease)']+=1
            if 'infinite' in parte and n: inf[n[0]]+=1
    r['keyframesSemUso']=sorted(kf-usados)[:40]; r['nSemUso']=len(kf-usados)
    tr=re.findall(r'transition\s*:\s*([^;}"\']+)',s); r['usosTransition']=len(tr); tdur=collections.Counter(); teas=collections.Counter(); lay=0; allp=0
    for t in tr:
        for parte in t.split(','):
            for d in re.findall(r'(?<![\w.-])(\d*\.?\d+)(ms|s)\b',parte)[:1]: tdur[round(float(d[0])*(1 if d[1]=='s' else .001),2)]+=1
            e=re.search(r'cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|linear|ease|steps\([^)]*\)',parte); teas[e.group(0) if e else '(padrão ease)']+=1
            p=parte.strip().split()[0] if parte.strip() else ''
            if p=='all' or re.match(r'^[\d.]',p): allp+=1
            elif LAYOUT.search(p): lay+=1
    r.update(durAnim=dur.most_common(40),nDurAnim=len(dur),easAnim=eas.most_common(12),nEasAnim=len(eas),infinitas=inf.most_common(40),nInf=len(inf),durTrans=tdur.most_common(40),nDurTrans=len(tdur),easTrans=teas.most_common(12),nEasTrans=len(teas),transLayout=lay,transAll=allp)
    r['reducedMotion']=len(re.findall(r'prefers-reduced-motion',s)); r['willChange']=len(re.findall(r'will-change',s)); r['jsAnimate']=len(re.findall(r'\.animate\(',s)); r['raf']=len(re.findall(r'requestAnimationFrame',s)); r['setInterval']=len(re.findall(r'setInterval\(',s))
    # animações que mexem em layout dentro dos keyframes
    kl=0
    for m in re.finditer(r'@keyframes\s+([\w-]+)\s*\{((?:[^{}]|\{[^{}]*\})*)\}',s):
        if re.search(r'(?<![-\w])(width|height|top|left|right|bottom|margin[\w-]*|padding[\w-]*|max-height|font-size)\s*:',m.group(2)): kl+=1
    r['keyframesQueMexemLayout']=kl
    out[nome]=r
    print('=====',nome); 
    for k,v in r.items(): print(' ',k,':',json.dumps(v,ensure_ascii=False)[:420])
json.dump(out,open('inventario.json','w'),ensure_ascii=False,indent=1)
