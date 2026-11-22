"""PROVA DO MEDIDOR (work/kit/mede.js) — plano das ferramentas, parte 2 (dono 22/11).

Cada regra do medidor só vale se pegar SOZINHA o erro de referência dela (um erro real que o dono achou, refeito numa
cópia do site pela mesma causa) — e se o site de hoje, limpo, não acusar nada nessa mesma tela.

Uso:  python3 work/kit/mede_prova.py            → 5 erros de referência + o site limpo nas 22 telas (celular e PC)
      python3 work/kit/mede_prova.py so-erros   → só os 5 erros de referência
Saída: /tmp/mede_prova/relatorio.json e uma foto por erro (marcado em vermelho)."""
import sys, os, re, json, shutil, subprocess, time
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI); sys.path.insert(0, os.path.join(AQUI, '..', 's430', 'comparador'))
import sim, mede as M, roteiro_site as RS
from playwright.sync_api import sync_playwright
OUT = '/tmp/mede_prova'; os.makedirs(OUT, exist_ok=True)
BF = "localStorage.setItem('lf_cfg',JSON.stringify({ativo:true,evento:{tema:'bf'}}))"
INIT = "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt')}catch(e){}"
T = {t['nome']: t for t in RS.TELAS}

# os 5 erros de referência: (nome, o que o dono viu, tela, aparelho, evento BF?, como refazer a causa no CSS/JS, regra que tem de pegar)
ERROS = [
    ('Faixa da Black Friday cobrindo o topo', 'a faixa do evento ficava numa camada própria, por cima dos botões do topo',
     'Início', 'celular', True, ('css', '#evbar{position:fixed!important;top:0!important;left:0;right:0;z-index:2147483000!important;padding:22px 14px!important}'), 'coberto'),
    ('"Últimas" batendo na armação', 'o "Últimas N" ficava no meio da foto, encostando nos óculos',
     'Catálogo', 'celular', False, ('css', '.ulin{bottom:auto!important;top:46%!important}'), 'encosta na foto'),
    ('Selo em cima de "Últimas"', 'o selo do evento caía em cima do "Últimas N" na faixa de baixo da foto',
     'Catálogo', 'celular', True, ('js', "document.querySelectorAll('.ph .ulin').forEach(u=>{const s=document.createElement('span');s.className='ofx';s.textContent='BLACK −10%';s.style.cssText='left:10px;right:auto;bottom:8px';u.parentElement.appendChild(s)})"), 'sobreposto'),
    ('Janela da câmera fora da tela', 'a base das janelas soltas foi cortada na limpeza de 19/11 e a câmera abria fora da tela',
     'Janela da câmera', 'celular', False, ('tira', r'\.scrim\{position:fixed;inset:0;[^}]*\}'), 'janela fora da tela'),
    ('Texto quebrando em 2 linhas', 'botão estreito demais com o texto em duas linhas (regra L4: se não couber, a letra diminui)',
     'Peça', 'celular', False, ('css', '#layer button.lx44{white-space:normal!important;max-width:40px!important}'), 'quebrou a linha'),
]
AP = {'celular': (390, 844, True), 'PC': (1440, 900, False)}


def copia(nome, porta, defeito=None):
    d = '/tmp/mp_' + nome
    subprocess.run(['bash', os.path.join(AQUI, '..', 'mkcopy.sh'), 'mp_' + nome, str(porta)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if defeito and defeito[0] != 'js':
        k, v = defeito; p = d + '/index.html'; s = open(p).read()
        if k == 'css': s = s.replace('</head>', '<style>' + v + '</style></head>', 1)
        else:
            s2 = re.sub(v, '', s, count=1)
            assert s2 != s, 'defeito não aplicado: ' + v
            s = s2
        open(p, 'w').write(s)
    subprocess.Popen(['python3', '-m', 'http.server', str(porta)], cwd=d, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    time.sleep(1)
    return 'http://localhost:%d' % porta


def mede(b, url, tela, ap, bf=False, foto=None, plantar=None, regra=None):
    W, H, toque = AP[ap]
    c = sim.contexto(b, W, H, toque=toque, movimento=False, camera=True)
    c.add_init_script(INIT)
    if bf:
        c.add_init_script(BF)
        c.route('**firestore.googleapis.com/**', lambda r, q=None: r.abort())
        c.route('**/dados/inicio.json*', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{}'))
    if tela.get('logada'): c.add_init_script(RS.LOGADA)
    c.route('**cloudfunctions.net/**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body=RS.NUVEM))
    c.route('**identitytoolkit**', lambda r, q=None: r.fulfill(status=200, content_type='application/json', body='{"users":[{"emailVerified":true,"email":"maria@exemplo.com"}]}'))
    pg = c.new_page(); RS.vai(pg, url, tela); pg.wait_for_timeout(800)
    if plantar: pg.evaluate(plantar); pg.wait_for_timeout(300)
    achados, onde = M.percorre(pg)
    A = list(achados.values())
    if foto:
        alvo = [ch for ch in achados if ch[0] == (regra or ch[0])] or list(achados)
        if alvo:
            k, y = onde[alvo[0]]
            M.vai_para(pg, k, y); pg.wait_for_timeout(300)
            por = {e['id']: e for e in M.mede(pg)['L']}
            caixas = [por[i] for ch in alvo for i in ch[1] if i in por]
            pg.evaluate("""rs=>rs.forEach(e=>{const d=document.createElement('div');d.style.cssText=`position:fixed;left:${e.rx-scrollX-3}px;top:${e.ry-scrollY-3}px;width:${e.rw+6}px;height:${e.rh+6}px;border:3px solid #ff0040;z-index:2147483647;pointer-events:none;border-radius:4px`;document.body.appendChild(d)})""", caixas[:12])
            pg.wait_for_timeout(200); pg.screenshot(path=foto)
    c.close()
    return A


def main():
    so_erros = 'so-erros' in sys.argv
    rel = {'erros': [], 'limpo': []}
    with sync_playwright() as p:
        b = sim.navegador(p)
        for i, (nome, viu, tela, ap, bf, defeito, regra) in enumerate(ERROS):
            url = copia('e%d' % i, 8810 + i, defeito)
            pl = defeito[1] if defeito[0] == 'js' else None
            A = mede(b, url, T[tela], ap, bf, foto='%s/erro%d.png' % (OUT, i + 1), plantar=pl, regra=regra)
            pegou = [a for a in A if a['regra'] == regra]
            # a mesma tela, limpa (sem o defeito), não pode acusar essa regra
            url0 = copia('l%d' % i, 8820 + i)
            A0 = [a for a in mede(b, url0, T[tela], ap, bf) if a['regra'] == regra]
            ok = bool(pegou) and not A0
            rel['erros'].append({'erro': nome, 'viu': viu, 'tela': tela, 'regra': regra, 'pegou': ok, 'achados': [a['d'] for a in pegou][:4], 'limpo_acusou': [a['d'] for a in A0][:4]})
            print(('OK   ' if ok else 'FALHA'), nome, '→', regra, len(pegou), 'achados; limpo:', len(A0), flush=True)
        if not so_erros:
            url0 = copia('limpo', 8830)
            for t in [t for t in RS.TELAS if not os.environ.get('MEDE_TELAS') or t['nome'] in os.environ['MEDE_TELAS'].split(',')]:
                for ap in ('celular', 'PC'):
                    A = mede(b, url0, t, ap, foto='%s/limpo_%s_%s.png' % (OUT, t['nome'].replace(' ', '-'), ap))
                    rel['limpo'].append({'tela': t['nome'], 'ap': ap, 'achados': [(a['regra'], a['d']) for a in A]})
                    print(t['nome'], ap, len(A), [a['regra'] + ': ' + a['d'] for a in A][:3], flush=True)
        b.close()
    json.dump(rel, open(OUT + '/relatorio.json', 'w'), ensure_ascii=False, indent=1)
    falhou = [e for e in rel['erros'] if not e['pegou']]
    print('erros de referência pegos: %d de %d' % (len(ERROS) - len(falhou), len(ERROS)))
    print('site limpo: %d achados em %d telas' % (sum(len(x['achados']) for x in rel['limpo']), len(rel['limpo'])))
    sys.exit(1 if falhou else 0)


if __name__ == '__main__':
    main()
