# ARGUS · esboço montado numa CÓPIA do app (Parte 1; furo 1 do dono 24/11 15:50: "montagem igual").
# O esboço é uma mudança (patch) no código-fonte do app — src/ e www/style.css — aplicada numa cópia em /tmp, montada com o
# mesmo build.js. Assim o esboço é feito com as peças de família de verdade, do jeito que a APP vai fazer. O src/ real nunca muda.
# Guardado em esbocos/<id>/: mudanca.patch (pode faltar = a tela de hoje) e base.txt (o commit de onde a cópia nasceu).
import os, subprocess, shutil, socket, time
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A))
PARTES = ['src', 'www', 'lib', 'build.js', 'docs/novidades.json']
def pasta(id_): return os.path.join(A, 'esbocos', id_)
def prepara(id_, base=None):
    """Monta a cópia do app com a mudança do esboço e devolve a pasta www/ dela."""
    d = pasta(id_); os.makedirs(d, exist_ok=True)
    bf = os.path.join(d, 'base.txt')
    if base is None: base = open(bf).read().strip() if os.path.exists(bf) else subprocess.run(['git', '-C', R, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
    open(bf, 'w').write(base + '\n')
    return _monta('/tmp/argus_esboco_' + id_, base, os.path.join(d, 'mudanca.patch'))
def _monta(c, base, patch=None):
    """A cópia do app num commit (com a mudança, se houver), montada com o mesmo build.js do app de verdade e do APK."""
    shutil.rmtree(c, ignore_errors=True); os.makedirs(c)
    ar = subprocess.run(['git', '-C', R, 'archive', base] + PARTES, capture_output=True)
    if ar.returncode: raise SystemExit('git archive falhou: ' + ar.stderr.decode()[:200])
    subprocess.run(['tar', '-x', '-C', c], input=ar.stdout, check=True)
    if patch and os.path.exists(patch) and os.path.getsize(patch):
        r = subprocess.run(['patch', '-p1', '-s', '--no-backup-if-mismatch', '-i', patch], cwd=c, capture_output=True, text=True)
        if r.returncode: raise SystemExit('a mudança do esboço não entra na base %s: %s' % (base[:9], (r.stderr or r.stdout)[:300]))
    b = subprocess.run(['node', 'build.js'], cwd=c, capture_output=True, text=True)
    if b.returncode: raise SystemExit('o build da cópia falhou: ' + b.stderr[:300])
    return os.path.join(c, 'www')
def hoje():
    """O app de HOJE montado do código (src/) do commit atual, como o APK e a publicação montam — não o www/ guardado, que pode
    estar com o número de versão de antes. Montado uma vez por commit."""
    base = subprocess.run(['git', '-C', R, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
    c = '/tmp/argus_hoje_' + base[:12]
    return os.path.join(c, 'www') if os.path.exists(os.path.join(c, 'www', 'app.js')) else _monta(c, base)
def serve(www, porta):
    s = socket.socket()
    if s.connect_ex(('127.0.0.1', porta)) == 0:
        s.close(); subprocess.run(['fuser', '-k', '%d/tcp' % porta], capture_output=True); time.sleep(0.5)
    subprocess.Popen(['python3', '-m', 'http.server', str(porta)], cwd=www, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    for _ in range(100):   # espera o servidor atender (não um tempo fixo)
        s = socket.socket()
        if s.connect_ex(('127.0.0.1', porta)) == 0: s.close(); return porta
        s.close(); time.sleep(0.1)
    raise SystemExit('o servidor da cópia não subiu na porta %d' % porta)
