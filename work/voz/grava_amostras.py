# S165: amostras ES com a MESMA receita do PT + conferências novas (ritmo igual ao PT, mesma voz da amostra aprovada,
# sem estouro, tom dentro da faixa). Uso: XI=<chave> python3 grava_amostras.py   (chave só por variável de ambiente)
import json, os, sys, re, subprocess, numpy as np
sys.path.insert(0, '/home/claude/lafouch/work/voz'); sys.path.insert(0, '/home/claude/lafouch/work/s165')
from cenas import CENAS
from bloco import grava, frases, pcm, ponto_calmo
from voz import emb, sim
D = '/home/claude/lafouch/work/s165/g'; os.makedirs(D, exist_ok=True)
TETO = 450; gf = D + '/gasto.txt'; gasto = int(open(gf).read()) if os.path.exists(gf) else 0
ES = json.load(open('/home/claude/voz_final/es.json'))
COMP = "acompressor=threshold=-22dB:ratio=3:attack=5:release=120:makeup=1,loudnorm=I=-18:TP=-3:LRA=7,alimiter=limit=0.6:level=0"
FILT = ('silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,'
        'silenceremove=stop_periods=-1:stop_duration=0.42:stop_threshold=-50dB:stop_silence=0.4,' + COMP +
        ',silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-55dB:start_silence=0.08,afade=t=in:d=0.02,areverse,afade=t=in:d=0.012,apad=pad_dur=0.06')
REF = (emb('/home/claude/Mochi_voz_nova_ES_3.mp3') + emb('/home/claude/voz_final/b1_es.mp3')) / 2
F0_REF = 279.0
def dur_pt(n):  # duração da mesma cena no PT aprovado (ritmo de referência)
    a = json.load(open(f'/home/claude/voz_final/pt/c{n:02d}.json')); return a['character_end_times_seconds'][-1]
def falado(k):
    t = ES[k]
    return t.replace('30 centímetros', 'treinta centímetros').lstrip('…')
def f0(x):
    P = []; w = 640
    for i in range(0, len(x) - w, 320):
        s = x[i:i + w]
        if np.sqrt(np.mean(s * s)) < .03: continue
        s = s - s.mean(); c = np.correlate(s, s, 'full')[w - 1:]; lo, hi = 16000 // 500, 16000 // 120; k = lo + int(np.argmax(c[lo:hi]))
        if c[k] > .5 * c[0]: P.append(16000 / k)
    return float(np.median(P)) if P else 0
def db(x): return 20 * np.log10(max(1e-6, float(np.sqrt(np.mean(x * x)))))
def confere(base, n, chaves):
    al = json.load(open(base + '.json')); F = frases(al); x = pcm(base + '.mp3'); prob = []
    if len(F) != len(chaves): return [f'esperava {len(chaves)} frases, veio {len(F)}'], None
    dur = al['character_end_times_seconds'][-1]; r = dur / dur_pt(n)
    if not (0.93 <= r <= 1.18): prob.append(f'ritmo {r:.2f}× do PT (aceito 0,93–1,18)')
    if float(np.abs(x).max()) > 0.97: prob.append('estouro na gravação')
    L = [db(x[int(a * 16000):int(b * 16000)]) for _, a, b in F]; med = float(np.median(L))
    for (t, a, b), l in zip(F, L):
        if l - med > 3.0: prob.append(f'"{t}" {l - med:.1f} dB mais alto que as outras')
    s = sim(emb(base + '.mp3'), REF)
    if s < 0.93: prob.append(f'voz diferente da aprovada (semelhança {s:.3f}, mínimo 0,93)')
    import tempfile
    for t, a, b in F:
        if b - a < 1.5: continue
        tf = tempfile.mktemp(suffix='.wav'); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', base + '.mp3', tf], check=True)
        sf = sim(emb(tf), REF); os.remove(tf)
        if sf < 0.85: prob.append(f'"{t}" com voz diferente (semelhança {sf:.3f}, mínimo 0,85)')
    for t, a, b in F:
        if b - a < 0.35: continue
        p = f0(x[int(a * 16000):int(b * 16000)])
        if p and not (0.85 * F0_REF <= p <= 1.30 * F0_REF): prob.append(f'tom de "{t}" {p:.0f} Hz (faixa {0.85*F0_REF:.0f}–{1.30*F0_REF:.0f})')
    return prob, dict(ritmo=round(r, 2), sem=round(s, 3))
def corta(base, saida_pref):
    F = frases(json.load(open(base + '.json'))); x = pcm(base + '.mp3'); dur = len(x) / 16000; c = [0.0]
    for i in range(len(F) - 1): c.append(ponto_calmo(x, max(F[i][2] - 0.05, F[i][1]), min(F[i + 1][1] + 0.15, F[i + 1][2])))
    c.append(dur); L = []
    for i in range(len(F)):
        o = f'{saida_pref}_{i:02d}.mp3'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{c[i]:.3f}', '-to', f'{c[i + 1]:.3f}', '-i', base + '.mp3', '-af', FILT, '-ar', '44100', '-ac', '1', '-b:a', '128k', o], check=True); L.append(o)
    return L
CEN = [(0, '1_entrada'), (1, '2_preparo'), (3, '3_teste')]
REL = {}
for n, nome in CEN:
    chaves = [(it if isinstance(it, str) else it[0]) for it in CENAS[n]]
    txt = ' '.join(falado(k) for k in chaves)
    tent = []
    for t in range(1, 4):
        base = f'{D}/{nome}_t{t}'
        if not os.path.exists(base + '.mp3'):
            if gasto + len(txt) > TETO: tent.append((base, ['parado: teto de créditos'], None)); break
            c = grava('es', txt, base); gasto += int(c or len(txt)); open(gf, 'w').write(str(gasto))
        p, m = confere(base, n, chaves); tent.append((base, p, m)); print(nome, 't%d' % t, m, p or 'PASSOU', flush=True)
        if not p: break
    ok = [x for x in tent if not x[1]]
    esc = ok[0] if ok else min([x for x in tent if x[2]], key=lambda x: len(x[1]))
    L = corta(esc[0], f'{D}/f_{nome}')
    open(D + '/l.txt', 'w').write(''.join(f"file '{o}'\n" for o in L))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', D + '/l.txt', '-ar', '44100', '-ac', '1', '-b:a', '128k', f'/home/claude/lafouch/work/s165/Mochi_ES_{nome}.mp3'], check=True)
    REL[nome] = dict(escolhida=os.path.basename(esc[0]), problemas=esc[1], medidas=esc[2], tentativas=len(tent))
print(json.dumps(REL, ensure_ascii=False, indent=1)); print('créditos gastos nesta rodada:', gasto)
json.dump(REL, open('/home/claude/lafouch/work/s165/relatorio.json', 'w'), ensure_ascii=False, indent=1)
