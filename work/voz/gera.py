# S166: voz do Mochi em ESPANHOL inteira, com a MESMA receita do português (aprovado) + conferências S165.
# Uso: XI=<chave> python3 gera.py   (chave só por variável de ambiente; teto de créditos TETO)
import json, os, sys, re, subprocess, tempfile, numpy as np
sys.path.insert(0, '/home/claude/lafouch/work/voz'); sys.path.insert(0, '/home/claude/lafouch/work/s165'); sys.path.insert(0, '/home/claude/lafouch/work/s164')
from bloco import grava, frases, pcm, ponto_calmo
from voz import emb, sim
from mede import mede
W = '/home/claude/lafouch/work/s166'; D = W + '/g'; OUT = W + '/es'; os.makedirs(D, exist_ok=True); os.makedirs(OUT, exist_ok=True)
TETO = 7000; gf = D + '/gasto.txt'; gasto = int(open(gf).read()) if os.path.exists(gf) else 0
J = json.load(open(W + '/cenas_es.json')); PTL = json.load(open('/home/claude/catalogo/media/voz/pt/lista.json')); PTD = '/home/claude/catalogo/media/voz/pt/'
COMP = "acompressor=threshold=-22dB:ratio=3:attack=5:release=120:makeup=1,loudnorm=I=-18:TP=-3:LRA=7,alimiter=limit=0.6:level=0"
FILT = ('silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,'
        'silenceremove=stop_periods=-1:stop_duration=0.42:stop_threshold=-50dB:stop_silence=0.4,' + COMP +
        ',silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.08,afade=t=in:d=0.02,areverse,afade=t=in:d=0.012,apad=pad_dur=0.06')
REF = (emb('/home/claude/Mochi_voz_nova_ES_3.mp3') + emb('/home/claude/voz_final/b1_es.mp3')) / 2; F0 = 279.0
def log(*a):
    print(*a, flush=True); open(W + '/log.txt', 'a').write(' '.join(str(x) for x in a) + '\n')
def f0(x):
    P = []; w = 640
    for i in range(0, len(x) - w, 320):
        s = x[i:i + w]
        if np.sqrt(np.mean(s * s)) < .03: continue
        s = s - s.mean(); c = np.correlate(s, s, 'full')[w - 1:]; lo, hi = 16000 // 500, 16000 // 120; k = lo + int(np.argmax(c[lo:hi]))
        if c[k] > .5 * c[0]: P.append(16000 / k)
    return float(np.median(P)) if P else 0
def db(x): return 20 * np.log10(max(1e-6, float(np.sqrt(np.mean(x * x)))))
def nfr(t): return len(re.findall(r'[.!?…](?=\s|$)', t))
def trecho(base, a, b, o, filt=True):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', base + '.mp3'] + (['-af', FILT, '-ar', '44100', '-ac', '1', '-b:a', '128k'] if filt else []) + [o], check=True)
def analisa(j, base):
    """divide a gravação em itens (frases do site) e confere cada um; devolve (problema da gravação, [(ini,fim,problemas,semelhança)])"""
    al = json.load(open(base + '.json')); F = frases(al); x = pcm(base + '.mp3'); dur = len(x) / 16000
    nctx = nfr(j['ctx']) if j['ctx'] else 0; ns = [nfr(it[1]) for it in j['itens']]
    if len(F) != nctx + sum(ns): return f'esperava {nctx + sum(ns)} frases, veio {len(F)}', None
    pt = json.load(open(j['pt']))
    sil = lambda a: a['character_end_times_seconds'][-1] * 1000 / max(1, len(re.findall(r'[aeiouáéíóúâêôãõàü]+', ''.join(a['characters']).lower())))
    r = sil(al) / sil(pt)  # ritmo por sílaba (ms por sílaba) comparado com a mesma cena do português aprovado
    gp = None if 0.90 <= r <= 1.20 else f'ritmo {r:.2f}× do português (por sílaba)'
    k = nctx; lim = []
    for n in ns: lim.append((k, k + n - 1)); k += n
    R = []
    for (a, b) in lim:
        ini = 0.0 if a == 0 else ponto_calmo(x, max(F[a - 1][2] - 0.05, F[a - 1][1]), min(F[a][1] + 0.15, F[a][2]))
        fim = dur if b + 1 >= len(F) else ponto_calmo(x, max(F[b][2] - 0.05, F[b][1]), min(F[b + 1][1] + 0.15, F[b + 1][2]))
        seg = x[int(ini * 16000):int(fim * 16000)]; pr = []
        if float(np.abs(seg).max()) > 0.97: pr.append('estouro')
        L = [db(x[int(F[q][1] * 16000):int(F[q][2] * 16000)]) for q in range(a, b + 1)]
        if len(L) > 1 and max(L) - min(L) > 4: pr.append('volume desigual dentro da frase')
        s = None
        if fim - ini >= 1.5:
            tf = tempfile.mktemp(suffix='.wav'); trecho(base, ini, fim, tf, False); s = sim(emb(tf), REF); os.remove(tf)
            if s < 0.85: pr.append(f'voz diferente ({s:.3f})')
        for q in range(a, b + 1):
            t, qa, qb = F[q]
            if qb - qa < 0.35 or (t.endswith('!') and len(t.split()) <= 2): continue
            p = f0(x[int(qa * 16000):int(qb * 16000)])
            if p and not (0.85 * F0 <= p <= 1.30 * F0): pr.append(f'tom {p:.0f} Hz em "{t}"')
        R.append((ini, fim, pr, s, f0(seg)))
    return gp, R
RES = {}; MAPA = {}; n_arq = 0; PROB = []
for j in J:
    nome = j['nome']; txt = (j['ctx'] + ' ' if j['ctx'] else '') + ' '.join(it[1] for it in j['itens'])
    melhor = [None] * len(j['itens'])  # (prob, -sem, base, ini, fim, f0)
    for t in range(1, 4):
        base = f'{D}/{nome}_t{t}'
        if not os.path.exists(base + '.mp3'):
            if gasto + len(txt) > TETO: log('PARADO no teto de créditos', gasto); break
            try: c = grava('es', txt, base)
            except Exception as e: log(nome, 'erro na gravação', e); break
            gasto += int(c or len(txt)); open(gf, 'w').write(str(gasto))
        gp, R = analisa(j, base)
        if R is None: log(nome, f't{t}', gp); continue
        for i, (ini, fim, pr, s, p) in enumerate(R):
            prs = ([gp] if gp else []) + pr; cand = (len(prs), -(s or 0.9), base, ini, fim, p, prs)
            if melhor[i] is None or cand[:2] < melhor[i][:2]: melhor[i] = cand
        ok = sum(1 for m in melhor if m and m[0] == 0)
        log(nome, f't{t}', 'ritmo ok' if not gp else gp, f'{ok}/{len(melhor)} frases perfeitas', 'créditos', gasto)
        if ok == len(melhor): break
    # grau: o tom de todas as frases do mesmo tipo fica parecido (como no PT, ±5% era a regra; aqui ±8% da mediana do tipo)
    if j.get('grau'):
        md = float(np.median([m[5] for m in melhor if m and m[5]]))
        for m in melhor:
            if m and m[5] and abs(m[5] - md) / md > 0.08: m[6].append(f'tom {m[5]:.0f} Hz fora do tipo ({md:.0f})')
    for it, m in zip(j['itens'], melhor):
        if m is None: PROB.append((it[0], 'sem gravação')); continue
        o = f'es7_{n_arq:03d}.mp3'; n_arq += 1; trecho(m[2], m[3], m[4], f'{OUT}/{o}')
        # pausa depois da frase = a do português correspondente
        pf = PTL.get(it[2]); pf = pf if isinstance(pf, str) or pf is None else pf[0]
        if pf:
            falta = max(0, mede(PTD + pf)['sil_fim'] - mede(f'{OUT}/{o}')['sil_fim']) / 1000
            if falta > 0.005:
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{OUT}/{o}', '-af', f'apad=pad_dur={falta:.3f}', '-ar', '44100', '-ac', '1', '-b:a', '128k', f'{OUT}/x.mp3'], check=True); os.replace(f'{OUT}/x.mp3', f'{OUT}/{o}')
        MAPA[it[0]] = o; RES[it[0]] = dict(arq=o, de=os.path.basename(m[2]), problemas=m[6])
        if m[6]: PROB.append((it[0], m[6]))
    # extras: "¡Hola! Soy Mochi." inteiro (sem emenda) e as frases curtas de grau ("Con la lente +X.", "Esta es +X.")
    if nome == 'c00' and melhor[0] and melhor[1] and melhor[0][2] == melhor[1][2]:
        o = f'es7_{n_arq:03d}.mp3'; n_arq += 1; trecho(melhor[0][2], melhor[0][3], melhor[1][4], f'{OUT}/{o}'); MAPA[j['itens'][0][0] + ' ' + j['itens'][1][0]] = o
    if nome in ('tA', 'tC'):
        for it, m in zip(j['itens'], melhor):
            if not m: continue
            al = json.load(open(m[2] + '.json')); F = frases(al); x = pcm(m[2] + '.mp3')
            dentro = [f for f in F if f[1] >= m[3] - 0.01 and f[2] <= m[4] + 0.01]
            if len(dentro) < 2: continue
            cut = ponto_calmo(x, max(dentro[0][2] - 0.05, dentro[0][1]), min(dentro[1][1] + 0.15, dentro[1][2]))
            k1 = it[0].split('. ')[0] + '.'; o = f'es7_{n_arq:03d}.mp3'; n_arq += 1; trecho(m[2], m[3], cut, f'{OUT}/{o}'); MAPA[k1] = o
json.dump(MAPA, open(OUT + '/lista.json', 'w'), ensure_ascii=False, indent=0)
json.dump(RES, open(W + '/relatorio.json', 'w'), ensure_ascii=False, indent=1)
log('FIM: arquivos', len(MAPA), 'créditos', gasto, 'frases com algum aviso', len(PROB))
for p in PROB: log('  ', p)
