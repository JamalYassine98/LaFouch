# ARGUS · o resultado da porta entra SOZINHO no docs/STATUS.md (Parte 8) — pelo comando do status (tools/status.py fila), nunca
# editando o STATUS.md à mão (regra 1). Um item da Fila por setor: argus-porta-app / argus-porta-site, com o estado na 1ª linha.
# Só a porta rodada pelo comando (a implementadora antes de publicar) anota; as provas não.
import os, subprocess
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
QUEM = {'app': 'APP', 'site': 'SITE'}   # quem roda a porta de cada setor (CLAUDE.md 1b); LF_SESSAO troca
LIMITE_MIN = {'rapida': 10, 'completa': 30}   # o portão demorado do dono (22/11: ~30 min); passou = aviso no resultado
def linha(res):
    """O estado curto (1ª linha do item) e a descrição (as etapas com falha, cada uma com o 1º item)."""
    s = 'SELO DADO' if res.get('selo') else ('SEM SELO' if res['completa'] else 'rápida')
    est = '%s · %s · %s · %d falha(s) · %s min · commit %s' % (s, res['modo'], res.get('data', ''), res['falhas'], res['minutos'], res['commit'][:9])
    if res['minutos'] > LIMITE_MIN[res['modo']]: est += ' · passou do limite de %d min' % LIMITE_MIN[res['modo']]
    d = ['- %s %s%s' % (e['estado'], e['etapa'], (' — ' + str(e['itens'][0])[:160]) if e['itens'] else '') for e in res['etapas'] if e['estado'] in ('FALHA', 'aviso')]
    return est, '\n'.join(d) or '- tudo ok'
def anota(res):
    est, desc = linha(res)
    q = os.environ.get('LF_SESSAO') or QUEM[res['setor']]
    r = subprocess.run(['python3', os.path.join(R, 'tools', 'status.py'), 'fila', q, 'argus-porta-' + res['setor'], est, desc], cwd=R, capture_output=True, text=True)
    return r.returncode == 0, (r.stdout + r.stderr).strip()[-200:]
