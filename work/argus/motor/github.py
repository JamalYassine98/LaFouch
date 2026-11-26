# ARGUS · motor · o GitHub (um lugar só para todo setor que roda lá: o Android emulado do app, o emulador do Firebase da nuvem).
# Sobe a versão que está sendo conferida num ramo só do Argus, dispara o workflow, espera e busca o resultado.
import os, json, time, subprocess
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
REPO = 'JamalYassine98/LaFouch'
def gh(*a): return subprocess.run(['gh', 'api'] + list(a), capture_output=True, text=True)
def sobe_versao():
    """O GitHub testa a MESMA versão que o Argus está conferindo: sobe o commit de agora num ramo só do Argus."""
    c = subprocess.run(['git', '-C', R, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
    r = subprocess.run(['git', '-C', R, 'push', '-qf', 'origin', 'HEAD:refs/heads/argus-confere'], capture_output=True, text=True)
    if r.returncode: raise SystemExit('não consegui subir a versão para o GitHub: ' + r.stderr[:200])
    return 'argus-confere', c
def dispara(workflow, ref='main', **entradas):
    antes = time.time()
    r = gh('-X', 'POST', 'repos/%s/actions/workflows/%s/dispatches' % (REPO, workflow), '-f', 'ref=%s' % ref, *sum((['-f', 'inputs[%s]=%s' % kv] for kv in entradas.items()), []))
    if r.returncode: raise SystemExit('não consegui disparar %s: %s' % (workflow, r.stderr[:200]))
    for i in range(30):
        time.sleep(10); j = json.loads(gh('repos/%s/actions/workflows/%s/runs?per_page=1' % (REPO, workflow)).stdout or '{}')
        run = (j.get('workflow_runs') or [None])[0]
        if run and time.mktime(time.strptime(run['created_at'], '%Y-%m-%dT%H:%M:%SZ')) - time.timezone >= antes - 60: return run['id']
    raise SystemExit('o workflow %s não começou' % workflow)
def espera(run_id, max_min=80):
    for i in range(max_min * 2):
        j = json.loads(gh('repos/%s/actions/runs/%d' % (REPO, run_id)).stdout or '{}')
        if j.get('status') == 'completed': return j.get('conclusion')
        time.sleep(30)
    return 'demorou demais'
def baixa(run_id, nome, destino):
    """O pacote de resultado (artifact) do workflow; False se não veio."""
    subprocess.run(['rm', '-rf', destino]); os.makedirs(destino, exist_ok=True)
    r = subprocess.run(['gh', 'run', 'download', str(run_id), '-R', REPO, '-n', nome, '-D', destino], capture_output=True, text=True)
    return r.returncode == 0
