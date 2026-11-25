# ARGUS · setor App · a PORTA do app. Roda tudo o que o app precisa passar antes de publicar e decide: selo ou trava.
#   python3 work/argus/setor_app/porta.py rapida     (a cada passo da implementadora: o que mudou + autoprova)
#   python3 work/argus/setor_app/porta.py completa   (antes de publicar: tudo, e só ela dá o selo)
# Etapas: autoprova · lógica (tests/run.py) · plantas válidas · comparador · toques · medidor nos modos do app · tempo com a loja
# cheia · mapa (lugar sem planta) e código morto (completa) · segurança (provas da NUVEM) · selo.
import os, sys, json, subprocess, time
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A))
sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_app'))
import planta, compara, toques, familia, explorador, autoprova, tempo, selo, abrir, aparelhos, modos, sim
APARELHOS = [aparelhos.DONO, 'celular 320', 'celular 430', 'tablet 768', 'PC 1440']
def _etapa(E, nome, estado, itens=()):
    E.append({'etapa': nome, 'estado': estado, 'itens': list(itens)}); print(('%-14s' % estado) + nome + ('  (%d)' % len(itens) if itens else ''), flush=True)
def plantas_validas():
    P = []
    for f in sorted(os.listdir(planta.P_APP)) if os.path.isdir(planta.P_APP) else []:
        if f.endswith('.json'): x = json.load(open(os.path.join(planta.P_APP, f))); P.append((x, planta.valida(x)))
    return P
def roda(modo='rapida', so_telas=None):
    completa = modo == 'completa'; E = []; t0 = time.time()
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        nav = sim.navegador(pw)
        # 0 autoprova: se o Argus não enxerga, nada do resto vale
        ok, ap = autoprova.roda(pw, nav, antiga=completa)
        _etapa(E, 'autoprova (o Argus ainda enxerga)', 'ok' if ok else 'FALHA', ['%s: %s' % (n, 'visto' if v else 'NÃO VISTO') for n, v in ap])
        # 1 lógica
        r = subprocess.run(['python3', 'tests/run.py'], cwd=R, capture_output=True, text=True, timeout=3600) if completa else None
        if r is None: _etapa(E, 'lógica do app (tests/run.py)', 'não rodou', ['só na rodada completa'])
        else:
            fim = (r.stdout.strip().splitlines() or ['?'])[-1]
            _etapa(E, 'lógica do app (tests/run.py)', 'ok' if r.returncode == 0 else 'FALHA', [fim])
        # 2 plantas
        P = plantas_validas(); inval = [x['id'] for x, v in P if v.startswith('INVÁLIDA')]
        apr = [x for x, v in P if v == 'aprovada' and (not so_telas or x['tela'] in so_telas)]
        _etapa(E, 'plantas válidas (aprovação na lista viva)', 'FALHA' if inval else 'ok', ['%s: %s' % (x['id'], v) for x, v in P])
        if not apr: _etapa(E, 'plantas aprovadas para conferir', 'FALHA', ['nenhuma planta aprovada ainda (Parte 6)'])
        iguais = set()
        # 3 comparador
        it = []
        for pl in apr:
            for tema, D in compara.confere(pw, pl).items():
                it += ['%s (%s): %s %s' % (pl['tela'], tema, a, b) for a, b, *_ in D]
                if not D: iguais.add((pl['id'], tema))
        _etapa(E, 'comparador (app × planta)', 'FALHA' if it else 'ok', it)
        # 4 toques
        it = []
        for pl in apr: it += ['%s: %s %s' % (pl['tela'], a, b) for a, b in toques.confere(pw, pl)]
        _etapa(E, 'toques (ligações e regras)', 'FALHA' if it else 'ok', it)
        # 5 medidor nos modos do app: aparelhos × claro/escuro × 3 letras; onde o app é igual à planta, o achado é do APROVADO
        fal, conf = [], []
        # o que aparece igual no modo da planta (celular do dono, letra 1×) e o app é igual à planta = está no APROVADO; nos outros
        # modos, o MESMO achado (mesma regra, mesma peça) também é do aprovado — só o que é novo naquele modo é falha
        base = set()
        for pl in apr:
            tela = {'nome': pl['tela'], 'passos': pl['passos'], 'cenario': pl['cenario']}
            for apar in (APARELHOS if completa else [aparelhos.DONO]):
                for tema in modos.TEMAS:
                    for f in (modos.LETRAS if completa else [1.0]):
                        b, pg = planta._abre_tela(pw, tela, tema, None, aparelho=apar, navegador=nav)
                        if f != 1.0: pg.evaluate(modos.LETRA, f); pg.wait_for_timeout(300)
                        for x in familia.mede_tela('%s · %s · %s · letra %s' % (pl['tela'], apar, tema, f), pg.evaluate(familia.COLETA)):
                            txt = '%s · %s · %s %s' % (x[1], x[0], x[2], x[3] if len(x) > 3 else ''); k = (pl['id'], tema, x[0], x[2], x[3] if len(x) > 3 else '')
                            if (pl['id'], tema) in iguais and apar == aparelhos.DONO and f == 1.0: base.add(k); conf.append(txt)
                            elif k in base: conf.append(txt)
                            else: fal.append(txt)
                        b.close()
        _etapa(E, 'medidor de família nos modos do app', 'FALHA' if fal else 'ok', fal)
        if conf: _etapa(E, 'regra × aprovado (o dono decide; não trava)', 'aviso', conf)
        # 6 tempo com a loja cheia
        it = []
        for pl in apr:
            tela = {'nome': pl['tela'], 'passos': pl['passos'], 'cenario': 'cheio'}
            t = time.time(); b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav); ab = (time.time() - t) * 1000
            n = len(pg.evaluate(planta.TOCAVEIS)); b.close()
            if ab > tempo.ABRIR_MS + 1000 * len(pl['passos']) + 2500: it.append('%s: abrir com a loja cheia levou %d ms' % (pl['tela'], ab))
            for i in range(n):
                l = (pl.get('ligacoes') or [{}] * n)[i] if i < len(pl.get('ligacoes') or []) else {}
                if l.get('faz', '').startswith('não tocado'): continue
                b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav); ms = pg.evaluate(tempo.MEDE, i); b.close()
                if ms >= 15000: it.append('%s: toque em "%s": a tela não parou de mudar em 15 s (limite %d ms)' % (pl['tela'], (l.get('nome') or str(i))[:30], tempo.TOQUE_MS))
                elif ms > tempo.TOQUE_MS: it.append('%s: toque em "%s" levou %d ms (limite %d)' % (pl['tela'], (l.get('nome') or str(i))[:30], ms, tempo.TOQUE_MS))
        _etapa(E, 'tempo com a loja cheia', 'FALHA' if it else 'ok', it)
        # 7 mapa e código morto (completa)
        if completa:
            X = explorador.explora(pw, profundidade=2, max_toques=400)
            M = explorador.mapa(X['lugares'], planta.P_APP); sem = [n for n, v in M.items() if v[1] != 'aprovada']
            _etapa(E, 'mapa: lugar sem planta aprovada', 'FALHA' if sem else 'ok', sem)
            _etapa(E, 'erros do app durante o passeio', 'FALHA' if X['erros'] else 'ok', ['%s: %s' % e for e in X['erros']])
            mor = explorador.morto(X['cobertura'])
            _etapa(E, 'código morto (para o dono ver; não trava)', 'aviso' if mor else 'ok', ['%d de %d funções nunca rodaram no passeio' % (len(mor), len(X['cobertura']))] + mor[:50])
        else: _etapa(E, 'mapa, erros do passeio e código morto', 'não rodou', ['só na rodada completa'])
        # 8 segurança: as provas da NUVEM (o Argus só roda)
        try:
            out = json.loads(subprocess.run(['python3', os.path.join(R, 'work', 'fiscal', 'regras.py')], capture_output=True, text=True, timeout=120).stdout)
            ruins = ['%s: %s' % (x['nome'], x['d']) for x in out if not x['ok']]
            _etapa(E, 'segurança (provas da NUVEM: regras da nuvem)', 'FALHA' if ruins else 'ok', ruins or ['%d provas' % len(out)])
        except Exception as e: _etapa(E, 'segurança (provas da NUVEM)', 'FALHA', ['a prova não rodou: %s' % str(e)[:80]])
        nav.close()
    falhas = [e for e in E if e['estado'] == 'FALHA']
    res = {'setor': 'app', 'modo': modo, 'completa': completa, 'commit': selo.commit(), 'falhas': len(falhas), 'autoprova_ok': ok,
           'etapas': E, 'minutos': round((time.time() - t0) / 60, 1), 'resumo': '%d etapas, %d com falha' % (len(E), len(falhas))}
    s = selo.grava('app', res)
    print('\n' + ('SELO DADO: ' + s['commit'][:9] if s else 'SEM SELO: %s' % ('rodada rápida não dá selo' if not completa else '%d etapa(s) com falha' % len(falhas))))
    return res
if __name__ == '__main__':
    res = roda(sys.argv[1] if len(sys.argv) > 1 else 'rapida')
    os.makedirs('/tmp/argus', exist_ok=True); json.dump(res, open('/tmp/argus/porta_app.json', 'w'), ensure_ascii=False, indent=1)
