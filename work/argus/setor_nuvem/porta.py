# ARGUS · setor NUVEM · a porta: a segurança de verdade (a nuvem recusar o que é proibido), sem tocar na nuvem publicada.
#   aqui:      os testes das funções (functions/teste-*.js) com o Node daqui — o que precisa de pacote que não há aqui fica para o GitHub
#   no GitHub: o emulador do Firebase (.github/workflows/argus-nuvem.yml) — as regras do banco × a planta da nuvem, os 4 estragos
#              de propósito e de novo todos os testes das funções, com os pacotes instalados.
# Fecha por padrão: o que não rodou é "não conferido" e trava a publicação da nuvem como uma falha.
# Uso: python3 porta.py            (aqui + GitHub)
#      python3 porta.py --aqui     (só os testes das funções, aqui)
import os, sys, json, glob, subprocess
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor'))
import github
FUNCOES = os.path.join(github.R, 'functions')
def funcoes_aqui():
    """[(teste, estado, detalhe)] — estado ok / FALHA / não conferido (falta um pacote aqui: o GitHub confere)."""
    out = []
    for f in sorted(glob.glob(os.path.join(FUNCOES, 'teste-*.js'))):
        n = os.path.basename(f)
        try: r = subprocess.run(['node', n], cwd=FUNCOES, capture_output=True, text=True, timeout=120)
        except subprocess.TimeoutExpired: out.append((n, 'FALHA', 'passou de 2 min')); continue
        t = r.stdout + r.stderr
        if 'Cannot find module' in t:
            out.append((n, 'não conferido', 'falta o pacote %s aqui — o GitHub confere' % (t.split("Cannot find module '")[1].split("'")[0]))); continue
        fal = [l.strip() for l in t.splitlines() if 'FALHA' in l]
        out.append((n, 'FALHA' if r.returncode or fal else 'ok', '; '.join(fal)[:200]))
    return out
def no_github(destino='/tmp/argus_nuvem'):
    """Roda o workflow na versão de agora e lê o resultado. {'regras': [...], 'estragos': [...], 'funcoes': [(teste, código)], 'concl': ...}"""
    ref, c = github.sobe_versao(); rid = github.dispara('argus-nuvem.yml', ref); concl = github.espera(rid, 30)
    out = {'commit': c, 'run': rid, 'concl': concl, 'regras': None, 'estragos': None, 'funcoes': []}
    if not github.baixa(rid, 'argus-nuvem', destino): return out
    p = glob.glob(os.path.join(destino, '**', 'regras.json'), recursive=True)
    if p: j = json.load(open(p[0])); out['regras'], out['estragos'] = j['regras'], j['estragos']
    for p in glob.glob(os.path.join(destino, '**', 'funcoes.txt'), recursive=True):
        out['funcoes'] = [tuple(l.split()) for l in open(p) if l.strip()]
    return out
def resumo(aqui, gh=None):
    """(falhas, avisos) — linhas para o relatório. Não conferido conta como falha (fecha por padrão)."""
    F, AV = [], []
    if gh is None:
        F += ['funções · %s · %s' % (n, d) for n, e, d in aqui if e == 'FALHA']
        AV += ['funções · %s · %s' % (n, d) for n, e, d in aqui if e != 'ok' and e != 'FALHA']
        return F, AV
    if gh['regras'] is None: F.append('nuvem: o emulador do Firebase não devolveu resultado (workflow %s: %s) — não conferido' % (gh['run'], gh['concl']))
    else:
        F += ['regras: %s · %s · %s — a planta diz %s%s' % (x[0], x[1], x[2], 'PODE' if x[3] else 'NÃO PODE', (' · ' + x[5]) if x[5] else '') for x in gh['regras'] if not x[4]]
        F += ['regras: o conferidor ficou cego para o estrago "%s" · %s' % (n, d) for n, v, d in gh['estragos'] if not v]
    gf = dict(gh['funcoes'])
    for n, e, d in aqui:   # o GitHub tem os pacotes: lá a palavra é final
        c = gf.get(n)
        if c is None: F.append('funções · %s · não rodou no GitHub' % n)
        elif c != '0': F.append('funções · %s · falhou no GitHub' % n)
        elif e == 'FALHA': F.append('funções · %s · passou no GitHub mas falhou aqui: %s' % (n, d))
    return F, AV
if __name__ == '__main__':
    aqui = funcoes_aqui()
    for n, e, d in aqui: print(e.ljust(14), n, ('· ' + d) if d else '')
    gh = None if '--aqui' in sys.argv else no_github()
    F, AV = resumo(aqui, gh)
    if gh and gh['regras'] is not None: print('regras: %d/%d iguais à planta · estragos vistos %d/%d' % (sum(1 for x in gh['regras'] if x[4]), len(gh['regras']), sum(1 for x in gh['estragos'] if x[1]), len(gh['estragos'])))
    for l in F: print('FALHA ', l)
    for l in AV: print('aviso ', l)
    sys.exit(1 if F else 0)
