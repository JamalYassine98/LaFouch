#!/usr/bin/env python3
"""Lê a cotação da La Moneda (sucursal Jebai) e grava no ramo `cotacao` (lamoneda.json).
Guarda também um histórico curto (até 200 dias, 1 ponto por hora) para a previsão do app.
Roda no GitHub Actions (cotacao.yml)."""
import html, json, os, re, subprocess, sys, time, urllib.request

URL = 'https://www.lamoneda.com.py/cotizaciones'
os.makedirs('/tmp/lamoneda', exist_ok=True)


def baixar(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (LaFouch cotacao)', 'Accept-Language': 'es-PY,es;q=0.9'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode('utf-8', 'replace')


def num(s):
    s = s.strip().replace(' ', '')
    # 6.150 / 1.105 / 5,480 / 5,48 / 3,500
    if re.fullmatch(r'\d{1,3}(\.\d{3})+', s):
        return float(s.replace('.', ''))
    if re.fullmatch(r'\d+,\d+', s):
        a, b = s.split(',')
        return float(a + '.' + b)
    if re.fullmatch(r'\d{1,3}(,\d{3})+', s):
        return float(s.replace(',', ''))
    try:
        return float(s)
    except ValueError:
        return None


def texto(h):
    h = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', ' ', h)
    h = re.sub(r'(?s)<[^>]+>', ' | ', h)
    h = html.unescape(h)
    return re.sub(r'\s+', ' ', h)


def ler(h):
    t = texto(h)
    open('/tmp/lamoneda/texto.txt', 'w').write(t)
    i = t.lower().find('sucursal jebai')
    if i < 0:
        raise SystemExit('não achei "Sucursal Jebai" na página')
    fim = len(t)
    for m in ['sucursal centro', 'caja auxiliar', 'casa matriz']:
        j = t.lower().find(m, i + 10)
        if j > 0:
            fim = min(fim, j)
    seg = t[i:fim]
    open('/tmp/lamoneda/jebai.txt', 'w').write(seg)

    def par(rotulos):
        for r in rotulos:
            m = re.search(r + r'[^0-9]{0,80}?([\d.,]+)[^0-9]{1,40}?([\d.,]+)', seg, re.I)
            if m:
                a, b = num(m.group(1)), num(m.group(2))
                if a and b:
                    return [a, b]
        return None

    usd = par([r'D[óo]lar(?! ?/)', r'\bUSD\b(?! ?/)'])
    brl = par([r'\bReal\b', r'\bBRL\b(?! ?/)'])
    arb = par([r'USD ?/ ?BRL', r'D[óo]lar ?/ ?Real'])
    if not usd or not brl:
        raise SystemExit('não consegui ler USD/BRL da Jebai: ' + seg[:400])
    return {'usd': {'compra': usd[0], 'venda': usd[1]}, 'brl': {'compra': brl[0], 'venda': brl[1]}, 'usdbrl': {'compra': arb[0], 'venda': arb[1]} if arb else None}


def main():
    h = baixar(URL)
    open('/tmp/lamoneda/pagina.html', 'w').write(h)
    c = ler(h)
    agora = int(time.time() * 1000)
    # sanidade: valores plausíveis
    assert 3000 < c['usd']['venda'] < 20000 and 500 < c['brl']['compra'] < 4000, c
    if not c['usdbrl']:
        c['usdbrl'] = {'compra': round(c['usd']['compra'] / c['brl']['venda'], 4), 'venda': round(c['usd']['venda'] / c['brl']['compra'], 4), 'calc': True}
    # ramo cotacao (só um commit, reescrito a cada vez)
    subprocess.run(['git', 'fetch', 'origin', 'cotacao'], check=False)
    ant = {}
    r = subprocess.run(['git', 'show', 'origin/cotacao:lamoneda.json'], capture_output=True, text=True)
    if r.returncode == 0:
        try:
            ant = json.loads(r.stdout)
        except Exception:
            ant = {}
    hist = ant.get('hist', [])
    if not hist or agora - hist[-1][0] >= 55 * 60 * 1000:
        hist.append([agora, c['usd']['compra'], c['usd']['venda'], c['brl']['compra'], c['brl']['venda']])
    hist = [x for x in hist if agora - x[0] <= 200 * 86400000]
    out = {'fonte': 'La Moneda · Sucursal Jebai', 'url': URL, 'ts': agora, 'usd': c['usd'], 'brl': c['brl'], 'usdbrl': c['usdbrl'], 'hist': hist}
    os.makedirs('/tmp/cot', exist_ok=True)
    os.chdir('/tmp/cot')
    subprocess.run(['git', 'init', '-q', '-b', 'cotacao'], check=True)
    json.dump(out, open('lamoneda.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    open('LEIA-ME.txt', 'w').write('Cotação da La Moneda (Jebai) gravada pelo workflow cotacao.yml a cada 30 min. O app lê lamoneda.json.\n')
    subprocess.run(['git', 'add', '.'], check=True)
    subprocess.run(['git', '-c', 'user.name=LaFouch bot', '-c', 'user.email=bot@lafouch.com', 'commit', '-q', '-m', 'cotação ' + time.strftime('%d/%m %H:%M')], check=True)
    rep = os.environ.get('GITHUB_REPOSITORY', 'JamalYassine98/LaFouch')
    tok = os.environ.get('GH_TOKEN') or ''
    remote = f'https://x-access-token:{tok}@github.com/{rep}.git' if tok else f'https://github.com/{rep}.git'
    subprocess.run(['git', 'push', '-q', '-f', remote, 'cotacao'], check=True)
    print(json.dumps({k: out[k] for k in ('usd', 'brl', 'usdbrl')}))


if __name__ == '__main__':
    main()
