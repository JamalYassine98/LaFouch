# S167: frases novas da descida (transição, confirmação e o tipo E com grau) em PORTUGUÊS e ESPANHOL,
# com a mesma receita e as mesmas conferências da S166. Uso: XI=<chave> python3 gera2.py   (chave só por variável de ambiente)
import json, os, sys, re, subprocess, tempfile, glob, numpy as np
sys.path.insert(0, '/home/claude/lafouch/work/voz'); sys.path.insert(0, '/home/claude/lafouch/work/s165'); sys.path.insert(0, '/home/claude/lafouch/work/s164')
import bloco
from bloco import frases, pcm, ponto_calmo
from voz import emb, sim
from mede import mede
W = '/home/claude/lafouch/work/s167'; D = W + '/g'; os.makedirs(D, exist_ok=True)
TETO = 2214; gf = D + '/gasto.txt'; gasto = int(open(gf).read()) if os.path.exists(gf) else 0
COMP = "acompressor=threshold=-22dB:ratio=3:attack=5:release=120:makeup=1,loudnorm=I=-18:TP=-3:LRA=7,alimiter=limit=0.6:level=0"
FILT = ('silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,'
        'silenceremove=stop_periods=-1:stop_duration=0.42:stop_threshold=-50dB:stop_silence=0.4,' + COMP +
        ',silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.08,afade=t=in:d=0.02,areverse,afade=t=in:d=0.012,apad=pad_dur=0.06')
GR = [x / 100 for x in range(25, 401, 25)]; gfm = lambda g: '+%.2f' % g
PT_N = {0: 'zero', 1: 'um', 2: 'dois', 3: 'três', 4: 'quatro'}; PT_D = {0: '', 25: ' e vinte e cinco', 50: ' e meio', 75: ' e setenta e cinco'}
ES_N = {0: 'cero', 1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro'}; ES_D = {0: '', 25: ' veinticinco', 50: ' y medio', 75: ' setenta y cinco'}
def fala_g(g, es):  # igual ao que já foi gravado (S93 no PT, S166 no ES)
    i = int(g); d = round((g - i) * 100)
    if i == 0: return ({25: 'cero veinticinco', 50: 'cero cincuenta', 75: 'cero setenta y cinco'} if es else {25: 'zero vinte e cinco', 50: 'zero cinquenta', 75: 'zero setenta e cinco'})[d]
    return (ES_N[i] + ES_D[d]) if es else (PT_N[i] + PT_D[d])
TRANS = [('Vou tirar mais um pouquinho.', 'Voy a sacar un poquito más.'), ('Mais leve agora.', 'Más suave ahora.'), ('Vamos para uma mais suave.', 'Vamos con una más suave.'), ('Mais um passinho para baixo.', 'Un pasito más para abajo.')]
CONF = [('Mais uma, para ter certeza.', 'Una más, para estar seguros.'), ('E esta outra aqui?', '¿Y esta otra?'), ('Confirma para mim: e esta?', 'Confirmame: ¿y esta?'), ('Agora esta, para conferir.', 'Ahora esta, para comprobar.')]
def cenas(es):
    i = 1 if es else 0; ctx = 'Muy bien.' if es else 'Muito bem.'
    E = [((('Ahora con ' if es else 'Agora com ') + gfm(g) + '. ' + ('¿Todavía podés leer?' if es else 'Ainda consegue ler?')),
          (('Ahora con ' if es else 'Agora com ') + fala_g(g, es) + '. ' + ('¿Todavía podés leer?' if es else 'Ainda consegue ler?'))) for g in GR]
    return [dict(nome='sT', ctx=ctx, itens=[(x[i], x[i]) for x in TRANS], ref='/home/claude/voz_final/pt/c08.json'),
            dict(nome='sC', ctx=ctx, itens=[(x[i], x[i]) for x in CONF], ref='/home/claude/voz_final/s93/tN.json'),
            dict(nome='tE', ctx=ctx, itens=E, ref='/home/claude/voz_final/s93/tA.json', grau=1)]
LG = {'pt': dict(voz='SvXoJJzLNRI3wECTYrmU', f0=302.0, pre='pt7', out='/home/claude/catalogo/media/voz/pt', lista='/home/claude/catalogo/media/voz/pt/lista.json'),
      'es': dict(voz='3vRJJjv6BIKZYw2NzOER', f0=279.0, pre='es8', out='/home/claude/catalogo/media/voz/es', lista='/home/claude/catalogo/media/voz/es/lista.json')}
REFS = {'pt': np.mean([emb(f) for f in sorted(glob.glob('/home/claude/voz_final/pt/c0[0-9].mp3'))], axis=0),
        'es': (emb('/home/claude/Mochi_voz_nova_ES_3.mp3') + emb('/home/claude/voz_final/b1_es.mp3')) / 2}
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
def msil(a): return a['character_end_times_seconds'][-1] * 1000 / max(1, len(re.findall(r'[aeiouáéíóúâêôãõàü]+', ''.join(a['characters']).lower())))
def trecho(base, a, b, o, filt=True):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', base + '.mp3'] + (['-af', FILT, '-ar', '44100', '-ac', '1', '-b:a', '128k'] if filt else []) + [o], check=True)
def grava(lang, txt, base):
    bloco.VOZ[lang] = LG[lang]['voz']; return bloco.grava(lang, txt, base)
def analisa(j, base, lang, refj):
    al = json.load(open(base + '.json')); F = frases(al); x = pcm(base + '.mp3'); dur = len(x) / 16000; F0 = LG[lang]['f0']; REF = REFS[lang]
    nctx = nfr(j['ctx']); ns = [nfr(it[1]) for it in j['itens']]
    if len(F) != nctx + sum(ns): return f'esperava {nctx + sum(ns)} frases, veio {len(F)}', None
    r = msil(al) / msil(json.load(open(refj))); gp = None if 0.90 <= r <= 1.20 else f'ritmo {r:.2f}× da referência (por sílaba)'
    k = nctx; lim = []
    for n in ns: lim.append((k, k + n - 1)); k += n
    R = []
    for (a, b) in lim:
        ini = ponto_calmo(x, max(F[a - 1][2] - 0.05, F[a - 1][1]), min(F[a][1] + 0.15, F[a][2]))
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
TOT = {}
SO = os.environ.get('SO', '')
TOT['pt_tE'] = 'pt_tE_t3'; TOT['pt_sT'] = TOT.get('pt_sT', ''); TOT['pt_sC'] = TOT.get('pt_sC', '')
for lang in ('pt', 'es'):
    C = LG[lang]; MAPA = json.load(open(C['lista'])); usados = [int(m.group(1)) for v in MAPA.values() for m in [re.match(C['pre'] + r'_(\d+)', v)] if m]; n_arq = max(usados) + 1 if usados else 0
    ptmed = 130
    for j in cenas(lang == 'es'):
        nome = lang + '_' + j['nome']
        if SO and nome != SO: continue
        txt = j['ctx'] + ' ' + ' '.join(it[1] for it in j['itens'])
        refj = j['ref'] if lang == 'pt' else f"{D}/{TOT['pt_' + j['nome']]}.json"  # o espanhol segue o ritmo do português novo
        melhor = [None] * len(j['itens'])
        for t in range(1, 4):
            base = f'{D}/{nome}_t{t}'
            if not os.path.exists(base + '.mp3'):
                if gasto + int(len(txt) * 0.41) > TETO: log('PARADO no teto de créditos', gasto); break  # teto: 1.314 + 900 autorizados; custo real ≈ 0,41/letra
                try: c = grava(lang, txt, base)
                except Exception as e: log(nome, 'erro', e); break
                gasto += int(c or len(txt)); open(gf, 'w').write(str(gasto))
            gp, R = analisa(j, base, lang, refj)
            if R is None: log(nome, f't{t}', gp); continue
            for i, (ini, fim, pr, s, p) in enumerate(R):
                prs = ([gp] if gp else []) + pr; cand = (len(prs), -(s or 0.9), base, ini, fim, p, prs)
                if melhor[i] is None or cand[:2] < melhor[i][:2]: melhor[i] = cand
            ok = sum(1 for m in melhor if m and m[0] == 0); log(nome, f't{t}', gp or 'ritmo ok', f'{ok}/{len(melhor)} perfeitas', 'créditos', gasto)
            if ok == len(melhor): break
        if j.get('grau'):
            md = float(np.median([m[5] for m in melhor if m and m[5]]))
            for m in melhor:
                if m and m[5] and abs(m[5] - md) / md > 0.08: m[6].append(f'tom {m[5]:.0f} Hz fora do tipo ({md:.0f})')
        # referência de ritmo para o espanhol = a gravação do português usada na maioria das frases
        if lang == 'pt':
            bs = [os.path.basename(m[2]) for m in melhor if m]; TOT[nome] = max(set(bs), key=bs.count)
        for k, (it, m) in enumerate(zip(j['itens'], melhor)):
            if m is None: log('  SEM GRAVAÇÃO', it[0]); continue
            o = f"{C['pre']}_{n_arq:03d}.mp3"; n_arq += 1; trecho(m[2], m[3], m[4], f"{C['out']}/{o}")
            # pausa depois = a do português (no PT: a mediana do PT aprovado; no ES: a da mesma frase em PT)
            alvo = ptmed if lang == 'pt' else mede(f"{LG['pt']['out']}/{json.load(open(LG['pt']['lista']))[cenas(False)[[x['nome'] for x in cenas(False)].index(j['nome'])]['itens'][k][0]]}")['sil_fim']
            falta = max(0, alvo - mede(f"{C['out']}/{o}")['sil_fim']) / 1000
            if falta > 0.005:
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f"{C['out']}/{o}", '-af', f'apad=pad_dur={falta:.3f}', '-ar', '44100', '-ac', '1', '-b:a', '128k', W + '/x.mp3'], check=True); os.replace(W + '/x.mp3', f"{C['out']}/{o}")
            MAPA[it[0]] = o; log('  ', o, it[0], m[6] or 'ok')
        json.dump(MAPA, open(C['lista'], 'w'), ensure_ascii=False, indent=0)
log('FIM créditos', gasto)
