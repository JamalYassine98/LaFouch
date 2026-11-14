# S253 · inventário COMPLETO do movimento (site e app): cada animação desenhada, onde é usada, quanto dura, e o que foge do padrão de luxo. Só leitura.  python3 inv.py
import re, json, glob, os, collections
A = os.path.dirname(os.path.abspath(__file__)) + '/'
ALVOS = {'site': ['/home/claude/catalogo/index.html', '/home/claude/catalogo/js/lf-site.js'] + sorted(glob.glob('/home/claude/catalogo/lfx/*.js')) + sorted(glob.glob('/home/claude/catalogo/js/lf-*.js')),
         'app': ['/home/claude/lafouch/www/style.css', '/home/claude/lafouch/www/index.html'] + sorted(glob.glob('/home/claude/lafouch/src/*.js'))}
def blocos_kf(s):
    out = {}
    for m in re.finditer(r'@keyframes\s+([\w-]+)\s*\{', s):
        i = m.end(); n = 1
        while n and i < len(s):
            n += (s[i] == '{') - (s[i] == '}'); i += 1
        out[m.group(1)] = s[m.end():i - 1]
    return out
def seg(t):
    m = re.search(r'(?<![\w.-])(\d*\.?\d+)(ms|s)\b', t)
    return round(float(m.group(1)) * (1 if m.group(2) == 's' else .001), 3) if m else None
def analisa(corpo):
    f = []; passos = re.findall(r'([\d.,%\sfromto]+)\{([^}]*)\}', corpo)
    esc = [float(x) for x in re.findall(r'scale[XY]?\(\s*(-?[\d.]+)', corpo)]; rot = [float(x) for x in re.findall(r'rotate[XYZ]?\(\s*(-?[\d.]+)', corpo)]
    tx = [float(x) for x in re.findall(r'translate(?:X|Y|3d)?\(\s*(-?[\d.]+)', corpo)]
    props = set(re.findall(r'(?:^|[;{\s])([a-z-]+)\s*:', corpo))
    if esc and max(esc) > 1.08 and len(passos) >= 3: f.append('QUICA (cresce até %.2g× e volta)' % max(esc))
    if len(rot) >= 3 and any(a * b < 0 for a, b in zip(rot, rot[1:])): f.append('BALANÇA (gira para os dois lados)')
    if len(tx) >= 4 and sum(1 for a, b in zip(tx, tx[1:]) if a * b < 0) >= 2: f.append('TREME (vai e volta)')
    lay = sorted(p for p in props if re.match(r'^(width|height|top|left|right|bottom|margin|padding|max-height|max-width|font-size|flex|grid|inset|border-width|letter-spacing|gap)', p))
    if lay: f.append('MEXE NO TAMANHO/POSIÇÃO (%s)' % ','.join(lay[:3]))
    if props & {'filter', 'backdrop-filter', 'box-shadow', 'clip-path'}: f.append('EFEITO PESADO (%s)' % ','.join(sorted(props & {'filter', 'backdrop-filter', 'box-shadow', 'clip-path'})))
    return f, sorted(props - {'offset'})
CARREGA = re.compile(r'spin|rot|gira|load|carreg|shm|skel|sk[A-Z]|prog|varre|busy|wait|ring|tspin|ptr|lfpl', re.I)
REL = {}
for nome, fs in ALVOS.items():
    txt = {f: open(f, encoding='utf8', errors='ignore').read() for f in fs}; s = '\n'.join(txt.values())
    kf = blocos_kf(s); usos = collections.defaultdict(list)
    # usos: cada vez que o nome aparece numa declaração animation (CSS ou texto de JS)
    CUR = re.compile(r'var\(--e[\w-]*\)|cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|linear|steps\([^)]*\)|\bease\b')
    for f, t in txt.items():
        for m in re.finditer(r'animation(?:-name)?\s*[:=]\s*', t):
            fim = m.end(); j = fim
            while j < len(t) and j < fim + 400 and t[j] not in ';}\n': j += 1
            decl = t[fim:j]
            for parte in re.split(r',(?![^(]*\))', decl):
                for w in re.findall(r'[\w-]+', parte):
                    if w in kf:
                        if f.endswith('.js'): onde = os.path.basename(f) + ':' + str(t.count('\n', 0, m.start()) + 1)
                        else:
                            k = t.rfind('{', 0, m.start()); k0 = max(t.rfind('}', 0, k), t.rfind(';', 0, k), t.rfind('{', 0, k)) + 1; onde = t[k0:k].strip()[-70:]
                        usos[w].append({'onde': onde, 'dur': seg(parte), 'sf': 'infinite' in parte, 'curva': (CUR.search(parte) or [None])[0], 'tipo': 'js' if f.endswith('.js') else 'css'})
                        break
    linhas = []
    for n, corpo in sorted(kf.items()):
        f, props = analisa(corpo); u = usos.get(n, []); durs = sorted({x['dur'] for x in u if x['dur']}); sf = any(x['sf'] for x in u); curvas = sorted({x['curva'] for x in u if x['curva']})
        carga = bool(CARREGA.search(n))
        if not u: f.append('SEM USO (apagar)')
        if sf and not carga: f.append('SEM FIM fora de "carregando"')
        if durs and max(durs) > .6 and not sf: f.append('LONGA (%.2gs)' % max(durs))
        for c in curvas:
            m = re.match(r'cubic-bezier\(([^)]*)\)', c)
            if m:
                v = [float(x) for x in m.group(1).split(',')]
                if v[1] > 1.02 or v[3] > 1.02: f.append('CURVA COM MOLA (%s)' % c)
        if not sf and u and not any(c.startswith(('cubic-bezier','var(')) for c in curvas): f.append('CURVA PADRÃO (%s)' % (','.join(curvas) or 'ease'))
        linhas.append({'nome': n, 'props': props, 'usos': u[:6], 'nusos': len(u), 'durs': durs, 'semfim': sf, 'carga': carga, 'falhas': f})
    # transições
    tr = []
    for m in re.finditer(r'(?<![\w-])transition\s*:\s*', s):
        fim = m.end(); j = fim
        while j < len(s) and j < fim + 300 and s[j] not in ';}\n': j += 1
        k = s.rfind('{', 0, m.start()); k0 = max(s.rfind('}', 0, k), s.rfind(';', 0, k), s.rfind('{', 0, k)) + 1; onde = s[k0:k].strip()[-60:]
        for parte in re.split(r',(?![^(]*\))', s[fim:j]):
            p = parte.strip().split()
            if not p or not re.match(r'^[a-z-]+$', p[0]): continue
            tr.append({'onde': onde, 'prop': p[0], 'dur': seg(parte), 'curva': (CUR.search(parte) or [None])[0]})
    js = {'animate(': len(re.findall(r'\.animate\(', s)), 'requestAnimationFrame': len(re.findall(r'requestAnimationFrame', s)), 'setInterval': len(re.findall(r'setInterval\(', s)), 'style.transition=': len(re.findall(r'\.style\.transition\s*=', s)), 'style.animation=': len(re.findall(r'\.style\.animation\s*=', s))}
    REL[nome] = {'kf': linhas, 'tr': tr, 'js': js}
    cf = collections.Counter(x.split(' (')[0] for l in linhas for x in l['falhas'])
    print(nome, len(linhas), 'animações ·', sum(1 for l in linhas if not l['falhas']), 'sem falha ·', dict(cf))
    td = collections.Counter(t['dur'] for t in tr); tp = collections.Counter(t['prop'] for t in tr); tc = collections.Counter(t['curva'] or '(padrão)' for t in tr)
    print('   transições', len(tr), '· tempos', len(td), sorted(td.items(), key=lambda x: -x[1])[:8], '· "all":', tp['all'], '· tamanho/posição:', sum(v for k, v in tp.items() if re.match(r'^(width|height|top|left|right|bottom|margin|padding|max-)', k)), '· curvas', dict(tc.most_common(5)), '· js', js)
json.dump(REL, open(A + 'inventario.json', 'w'), ensure_ascii=False, indent=1)
