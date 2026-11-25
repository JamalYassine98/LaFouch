# ARGUS · setor App · a PORTA do app. Roda tudo o que o app precisa passar antes de publicar e decide: selo ou trava.
#   python3 work/argus/setor_app/porta.py rapida     (a cada passo da implementadora: o que mudou + autoprova)
#   python3 work/argus/setor_app/porta.py completa   (antes de publicar: tudo, e só ela dá o selo)
# Etapas: autoprova · lógica (tests/run.py) · plantas válidas · comparador · toques · medidor nos modos do app · tempo com a loja
# cheia · mapa (lugar sem planta) e código morto (completa) · segurança (provas da NUVEM) · selo.
import os, sys, json, subprocess, time
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A))
sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_app'))
import planta, compara, toques, familia, explorador, autoprova, tempo, selo, abrir, aparelhos, modos, sim, migracao, origem, loja, emulador, dedo
APARELHOS = [aparelhos.DONO, 'celular 320', 'celular 430', 'tablet 768', 'PC 1440']
def _etapa(E, nome, estado, itens=()):
    E.append({'etapa': nome, 'estado': estado, 'itens': list(itens)}); print(('%-14s' % estado) + nome + ('  (%d)' % len(itens) if itens else ''), flush=True)
def plantas_validas():
    P = []
    for f in sorted(os.listdir(planta.P_APP)) if os.path.isdir(planta.P_APP) else []:
        if f.endswith('.json'): x = json.load(open(os.path.join(planta.P_APP, f))); P.append((x, planta.valida(x)))
    return P
def modos_quer(completa):
    """Os modos do app que a rodada TEM de passar (o que não rodou vira "não conferido")."""
    return {(a, t, f) for a in (APARELHOS if completa else [aparelhos.DONO]) for t in modos.TEMAS for f in (modos.LETRAS if completa else [1.0])} | {'reduzir movimento', 'sem internet', 'bloqueio', 'biometria', 'erro ao salvar'}
def modos_faltando(quer, rodou): return sorted(str(m) for m in quer - rodou)
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
        av = [x for x in it if toques.APROVADO in x]; it = [x for x in it if toques.APROVADO not in x]
        _etapa(E, 'toques (ligações e regras)', 'FALHA' if it else 'ok', it)
        if av: _etapa(E, 'toques: regra × aprovado (o dono decide; não trava)', 'aviso', av)
        # 5 medidor nos modos do app: aparelhos × claro/escuro × 3 letras; onde o app é igual à planta, o achado é do APROVADO
        fal, conf = [], []; rodou = set()
        # o que aparece igual no modo da planta (celular do dono, letra 1×) e o app é igual à planta = está no APROVADO; nos outros
        # modos, o MESMO achado (mesma regra, mesma peça) também é do aprovado — só o que é novo naquele modo é falha
        base = set()
        for pl in apr:
            tela = planta.tela_de(pl)
            for apar in (APARELHOS if completa else [aparelhos.DONO]):
                for tema in modos.TEMAS:
                    for f in (modos.LETRAS if completa else [1.0]):
                        b, pg = planta._abre_tela(pw, tela, tema, None, aparelho=apar, navegador=nav, letra=f)
                        rodou.add((apar, tema, f))
                        for x in familia.mede_tela('%s · %s · %s · letra %s' % (pl['tela'], apar, tema, f), pg.evaluate(familia.COLETA)):
                            txt = '%s · %s · %s %s' % (x[1], x[0], x[2], x[3] if len(x) > 3 else ''); k = (pl['id'], tema, x[0], x[2], x[3] if len(x) > 3 else '')
                            if (pl['id'], tema) in iguais and apar == aparelhos.DONO and f == 1.0: base.add(k); conf.append(txt)
                            elif k in base: conf.append(txt)
                            else: fal.append(txt)
                        b.close()
        # outros modos do app: reduzir movimento, sem internet, com PIN e com biometria
        for pl in apr:
            tela = planta.tela_de(pl)
            b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav, reduzir_movimento=True)
            fal += ['%s · %s · %s' % (x[1], x[0], x[2]) for x in familia.mede_tela('%s · reduzir movimento' % pl['tela'], pg.evaluate(familia.COLETA), True) if x[0].startswith('mexe')]; b.close(); rodou.add('reduzir movimento')
            b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav, sem_internet=True)
            fal += ['%s · %s · %s' % (x[1], x[0], x[2]) for x in familia.mede_tela('%s · sem internet' % pl['tela'], pg.evaluate(familia.COLETA)) if (pl['id'], x[0], x[2]) not in {(pl['id'], k[2], k[3]) for k in base}]; b.close(); rodou.add('sem internet')
        for cen, scripts in (('bloqueio', ()), ('biometria', (modos.BIO,))):
            b, pg = abrir.abre(pw, navegador=nav, cenario=cen, scripts=scripts)
            trav = pg.evaluate("()=>!document.getElementById('lockScr').hidden")
            if cen == 'bloqueio':
                for k in loja.PIN: dedo.toca_sel(pg, '#pinKb [data-k="%s"]' % k); pg.wait_for_timeout(120)
            else: dedo.toca_sel(pg, '#pinKb .pkBio')
            pg.wait_for_timeout(2500); ab = pg.evaluate("()=>document.getElementById('lockScr').hidden"); b.close(); rodou.add(cen)
            if not (trav and ab): fal.append('%s: o app %s' % ('com PIN' if cen == 'bloqueio' else 'com biometria', 'não abriu travado' if not trav else 'não destravou'))
        # estados (regra 17): o aparelho recusa guardar → o app TEM de avisar, e o aviso é igual em todas as telas
        est = {}
        for pl in apr:
            tela = planta.tela_de(pl)
            b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav, scripts=(modos.ERRO_SALVAR,))
            pg.evaluate("()=>{try{__LF.salvarAgora()}catch(e){}}"); pg.wait_for_timeout(1500); d = pg.evaluate(familia.COLETA); b.close(); rodou.add('erro ao salvar')
            if not d['estados']: fal.append('%s · erro ao salvar: o app não avisa nada' % pl['tela'])
            est[pl['tela'] + ' (erro ao salvar)'] = d
        fal += ['%s · %s · %s %s' % (x[1], x[0], x[2], x[3]) for x in familia.familia_inteira(est) if x[0].startswith('família: estado')]
        _etapa(E, 'medidor de família nos modos do app', 'FALHA' if fal else 'ok', fal)
        # modo da lista que não rodou = não conferido (trava)
        quer = modos_quer(completa)
        falta = modos_faltando(quer, rodou)
        _etapa(E, 'todos os modos da lista rodaram', 'FALHA' if (falta and apr) else 'ok', ['não conferido: ' + m for m in falta] if apr else ['sem plantas aprovadas'])
        if conf: _etapa(E, 'regra × aprovado (o dono decide; não trava)', 'aviso', conf)
        # 6 tempo com a loja cheia
        it = []
        for pl in apr:
            tela = dict(planta.tela_de(pl), cenario='cheio')
            t = time.time(); b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav); ab = (time.time() - t) * 1000
            n = len(pg.evaluate(planta.TOCAVEIS)); soz = tempo.muda_sozinha(pg); b.close()
            if ab > tempo.ABRIR_MS + 1000 * len(pl['passos']) + 2500: it.append('%s: abrir com a loja cheia levou %d ms' % (pl['tela'], ab))
            if soz > tempo.SOZINHA_MAX: it.append('%s: a tela muda sozinha sem parar (%d mudanças em 1 s, parada) — laço; tempos de toque não conferidos' % (pl['tela'], soz)); continue
            for i in range(n):
                l = (pl.get('ligacoes') or [{}] * n)[i] if i < len(pl.get('ligacoes') or []) else {}
                if l.get('faz', '').startswith('não tocado'): continue
                b, pg = planta._abre_tela(pw, tela, 'escuro', None, navegador=nav); ms = tempo.toque_ms(pg, i); b.close()
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
        if completa:
            # onde cada diferença com a planta NASCEU (a primeira versão que já tinha a diferença)
            it = []
            for pl in apr:
                if (pl['id'], 'escuro') in iguais: continue
                v, ant = origem.nasceu(pw, pl)
                it.append('%s: %s' % (pl['tela'], ('nasceu em %s (antes: %s)' % (v, ant)) if v else ant))
            _etapa(E, 'onde a diferença nasceu', 'aviso' if it else 'ok', it)
            # os dados guardados pela versão publicada abrem iguais na versão nova
            D, velha = migracao.confere(pw)
            _etapa(E, 'dados de hoje abrem na versão nova (desde %s)' % velha[:9], 'FALHA' if D else 'ok', ['%s: %s na publicada → %s na nova' % x for x in D])
        # 8 segurança: as provas da NUVEM (o Argus só roda)
        try:
            out = json.loads(subprocess.run(['python3', os.path.join(R, 'work', 'fiscal', 'regras.py')], capture_output=True, text=True, timeout=120).stdout)
            ruins = ['%s: %s' % (x['nome'], x['d']) for x in out if not x['ok']]
            _etapa(E, 'segurança (provas da NUVEM: regras da nuvem)', 'FALHA' if ruins else 'ok', ruins or ['%d provas' % len(out)])
        except Exception as e: _etapa(E, 'segurança (provas da NUVEM)', 'FALHA', ['a prova não rodou: %s' % str(e)[:80]])
        nav.close()
    pasta = os.path.relpath(planta.P_APP, R) if os.path.abspath(planta.P_APP).startswith(R + os.sep) else None
    if completa and apr and not pasta: _etapa(E, 'Android emulado', 'FALHA', ['não conferido: as plantas não estão no repositório'])
    elif completa and apr:   # 9 o Android emulado (GitHub): a MESMA versão, no tamanho do celular do dono, letras de verdade, claro e escuro
        try:
            ref, c = emulador.sobe_versao(); rid = emulador.dispara(pasta, ref); fim = emulador.espera(rid)
            r = emulador.compara_tudo(emulador.busca(), planta.P_APP)
            from playwright.sync_api import sync_playwright
            with sync_playwright() as pw: let = emulador.letra_igual(pw, emulador.busca(), planta.P_APP)   # a letra grande do simulador = a do Android
            ruim = r['comparador'] + r['medidor'] + r['tempo'] + ['letra (Android × simulador): ' + x for x in let] + ['não conferido: ' + x for x in r['faltou']]
            _etapa(E, 'Android emulado (%s)' % fim, 'FALHA' if ruim or fim != 'success' else 'ok', ruim + r['barras'][:1])
        except SystemExit as e: _etapa(E, 'Android emulado', 'FALHA', ['não rodou: %s' % e])
    falhas = [e for e in E if e['estado'] == 'FALHA']
    res = {'setor': 'app', 'modo': modo, 'completa': completa, 'commit': selo.commit(), 'falhas': len(falhas), 'autoprova_ok': ok,
           'etapas': E, 'minutos': round((time.time() - t0) / 60, 1), 'resumo': '%d etapas, %d com falha' % (len(E), len(falhas))}
    s = selo.grava('app', res)
    print('\n' + ('SELO DADO: ' + s['commit'][:9] if s else 'SEM SELO: %s' % ('rodada rápida não dá selo' if not completa else '%d etapa(s) com falha' % len(falhas))))
    return res
if __name__ == '__main__':
    res = roda(sys.argv[1] if len(sys.argv) > 1 else 'rapida')
    os.makedirs('/tmp/argus', exist_ok=True); json.dump(res, open('/tmp/argus/porta_app.json', 'w'), ensure_ascii=False, indent=1)
