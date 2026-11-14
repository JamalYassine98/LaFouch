# S255 · lê mochi.json e tira os números: piscar, inclinação, pulo, achatar, braços, olhar, rostos, fala, quanto tempo fica em movimento.  python3 analisa.py
import json, os, statistics as st
A = os.path.dirname(os.path.abspath(__file__)) + '/'
D = json.load(open(A + 'mochi.json'))
def eventos(serie, lim, junta=250):
    ev = []; ini = None; ult = None
    for t, v in serie:
        if abs(v) > lim:
            if ini is None: ini = t; pico = v
            elif abs(v) > abs(pico): pico = v
            ult = t
        elif ini is not None and t - ult > junta: ev.append((ini, ult, pico)); ini = None
    if ini is not None: ev.append((ini, ult, pico))
    return ev
for nome, d in D.items():
    T = d[-1]['t'] / 1000; fps = len(d) / T; print('\n=====', nome, '%.1f s · %d quadros · %.0f qps' % (T, len(d), fps))
    if nome == 'intro': print('exemplo', {k: d[300][k] for k in ('hop', 'rot', 'sx', 'sy', 'fx', 'sq', 'ti', 'aBe', 'aBd', 'aFe', 'aFd', 'pup')})
    # piscar
    pb = [d[i]['t'] for i in range(1, len(d)) if d[i]['pis'] and not d[i - 1]['pis']]; iv = [b - a for a, b in zip(pb, pb[1:])]
    # a classe .p fica; conta re-disparos pela ausência momentânea
    print('piscadas (classe ligada de novo):', len(pb), 'em', [round(x / 1000, 1) for x in pb][:20])
    # inclinação (mola ti) e rot do gesto
    ti = [(x['t'], x['ti']) for x in d]; ev = eventos(ti, .6); print('INCLINAÇÃO (.tilt): %d vezes · picos %s · duração média %.2f s' % (len(ev), [round(e[2], 1) for e in ev][:14], st.mean([(e[1] - e[0]) / 1000 for e in ev]) if ev else 0))
    # ultrapassagem da mola: depois do pico, cruza para o outro lado?
    ov = []
    for a, b_, p in ev:
        seg = [v for t, v in ti if a <= t <= b_ + 900]; outro = min(seg) if p > 0 else max(seg)
        if outro * p < 0: ov.append(round(abs(outro / p) * 100))
    print('   volta passando do zero (quique): em %d de %d · quanto (%% do pico): %s' % (len(ov), len(ev), ov[:12]))
    hop = [(x['t'], x['hop']) for x in d]; ev = eventos(hop, .8); print('PULO (hop): %d vezes · alturas px %s · duração %s s' % (len(ev), [round(e[2], 1) for e in ev][:12], [round((e[1] - e[0]) / 1000, 2) for e in ev][:12]))
    rot = [(x['t'], x['rot']) for x in d]; ev = eventos(rot, .8); print('GIRO DO CORPO no gesto (rot): %d vezes · picos %s' % (len(ev), [round(e[2], 1) for e in ev][:12]))
    sx = [x['sx'] for x in d]; sy = [x['sy'] for x in d]; sq = [x['sq'] for x in d if len(x['sq']) >= 2]
    print('ESTICA/ACHATA no gesto: sx %.3f–%.3f · sy %.3f–%.3f | mola .sq: x %.3f–%.3f · y %.3f–%.3f' % (min(sx), max(sx), min(sy), max(sy), min(s[0] for s in sq), max(s[0] for s in sq), min(s[1] for s in sq), max(s[1] for s in sq)))
    fx = [x['fx'] for x in d]; print('VIRAR DE LADO (fx): %.2f–%.2f · trocas de lado: %d' % (min(fx), max(fx), sum(1 for a, b_ in zip(fx, fx[1:]) if a * b_ < 0)))
    for c in ('aBe', 'aBd', 'aFe', 'aFd'):
        s = [(x['t'], x[c]) for x in d if x[c]];
        if not s: continue
        n = len(s[0][1]); cols = [[v[i] if i < len(v) else 0 for _, v in s] for i in range(n)]; var = [max(c_) - min(c_) for c_ in cols]; k = var.index(max(var)); ang = [(t, v[k] if k < len(v) else 0) for t, v in s]
        vel = [abs(b_[1] - a[1]) / max(1, b_[0] - a[0]) * 1000 for a, b_ in zip(ang, ang[1:])]; mov = sum(1 for v in vel if v > 8) / len(vel)
        print('BRAÇO %s: valor %d varia %.1f (de %.1f a %.1f) · velocidade máx %.0f/s · em movimento %.0f%% do tempo' % (c, k, var[k], min(cols[k]), max(cols[k]), max(vel), mov * 100))
    pup = [(x['t'], tuple(x['pup'][:2]) if x['pup'] else (0, 0)) for x in d]; tr = [pup[i][0] for i in range(1, len(pup)) if pup[i][1] != pup[i - 1][1]]; print('OLHAR (pupilas): %d mudanças de alvo em' % len(tr), [round(t / 1000, 1) for t in tr][:16])
    for c, rot_ in (('oF', 'olhos felizes'), ('oZ', 'olhos fechados'), ('bO', 'boca O'), ('bF', 'boca feliz'), ('bH', 'boca H'), ('bY', 'boca bocejo'), ('pon', 'ponteiro')):
        s = [(x['t'], x[c]) for x in d]; on = [s[i][0] for i in range(1, len(s)) if s[i][1] > .5 and s[i - 1][1] <= .5]
        if on: print('ROSTO %s: aparece %d vezes em' % (rot_, len(on)), [round(t / 1000, 1) for t in on][:12])
    bal = [(x['t'], x['bal']) for x in d if x['bal']]; print('BALÃO: %d trocas de texto:' % len(bal), [(round(t / 1000, 1), b_[:38]) for t, b_ in bal][:10])
    xs = [x['x'] for x in d]; ys = [x['y'] for x in d]; print('POSIÇÃO na tela: x %d–%d · y %d–%d' % (min(xs), max(xs), min(ys), max(ys)))
    # quanto tempo algo se mexe além de respirar
    def mexe(a, b_): return abs(a['ti'] - b_['ti']) > .05 or abs(a['hop'] - b_['hop']) > .1 or abs(a['rot'] - b_['rot']) > .1 or any(abs(p - q) > .3 for c in ('aBe', 'aBd', 'aFe', 'aFd') for p, q in zip(a[c], b_[c])) or abs(a['sx'] - b_['sx']) > .002
    m = [mexe(a, b_) for a, b_ in zip(d, d[1:])]; print('EM MOVIMENTO (fora respirar e piscar): %.0f%% do tempo' % (100 * sum(m) / len(m)))
    par = []; i = 0
    while i < len(m):
        if not m[i]:
            j = i
            while j < len(m) and not m[j]: j += 1
            if d[j]['t'] - d[i]['t'] > 400: par.append(round((d[j]['t'] - d[i]['t']) / 1000, 1))
            i = j
        else: i += 1
    print('   pausas paradas (>0,4 s):', par[:30], '· maior %.1f s' % (max(par) if par else 0))
# resposta das molas (do código): quanto passam do ponto
def passo(k, d, n=200):
    v = 0; w = 0; mx = 0; t95 = None
    for i in range(n):
        w += (1 - v) * k; w *= d; v += w; mx = max(mx, v)
        if t95 is None and abs(1 - v) < .02 and abs(w) < .004: t95 = i
    return round((mx - 1) * 100, 1), round((t95 or n) / 60, 2)
print('\nMOLAS (do código, resposta a um degrau; quadros de 1/60 s):')
for n, k, dd in (('braços', .09, .74), ('achatar sx/sy', .2, .7), ('inclinar', .09, .8), ('espelho', .13, .86), ('óculos', .12, .8), ('virar', .1, .76)): print('  %-14s passa do ponto %5.1f%% · assenta em %.2f s' % ((n,) + passo(k, dd)))
