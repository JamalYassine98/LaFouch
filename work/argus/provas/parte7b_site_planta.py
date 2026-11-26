# ARGUS · prova da Parte 7b (planta e conferência do SITE com o mesmo motor do app): a planta do site guarda as temáticas e as
# ligações; o site de hoje × a própria planta sai igual; um estrago de propósito é visto; o site de 19/11 (base da 1ª planta) ×
# o de hoje mostra as diferenças; as regras de toque e o medidor rodam no site.
import os, sys, json, shutil
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import planta, compara, toques, familia, lfsite, aparelhos
from playwright.sync_api import sync_playwright
planta.P_SITE = '/tmp/argus_plantas_site_teste'; planta.OBS = '/tmp/argus_obsoletos_teste'; shutil.rmtree(planta.P_SITE, ignore_errors=True)
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
TELA = {'setor': 'site', 'rota': '', 'nome': 'Início do site', 'passos': [], 'cenario': 'normal'}
POUCOS = ['sem', 'natal']
with sync_playwright() as pw:
    # (1) a planta do site: todas as temáticas e as ligações tocadas com o dedo
    pl = planta.grava(pw, 'site-inicio', TELA); planta.salva(pl); pl = json.load(open(planta.caminho(pl)))
    ok('planta do site guardada em plantas/site, com as %d temáticas' % len(pl['temas']), list(pl['temas']) == aparelhos.MODOS['site']['tematica'] and os.path.exists(planta.caminho(pl)))
    txt = {tm: frozenset(p['texto'] for p in t['pecas'] if p['tipo'] == 'texto') for tm, t in pl['temas'].items()}
    ok('cada temática tem o seu desenho (os textos mudam)', len(set(txt.values())) >= 8, '%d desenhos diferentes em %d temáticas' % (len(set(txt.values())), len(txt)))
    lig = pl['ligacoes']; tipos = {l['faz'].split(':')[0] for l in lig}
    ok('ligações do site tocadas com o dedo (%d botões)' % len(lig), len(lig) >= 10 and {'sai para', 'abre a janela de baixo'} <= tipos, ', '.join(sorted(tipos)))
    # (2) o site de hoje × a própria planta = igual
    d = compara.confere(pw, pl, temas=POUCOS)
    ok('site de hoje × a própria planta: igual (%s)' % ', '.join(POUCOS), all(not v for v in d.values()), '; '.join('%s: %d' % (k, len(v)) for k, v in d.items()))
    # (3) um estrago de propósito numa cópia do site é visto
    est = '/tmp/argus_site_estrago'; shutil.rmtree(est, ignore_errors=True); shutil.copytree(lfsite.monta(lfsite.commit_de()), est)
    h = open(est + '/index.html').read(); open(est + '/index.html', 'w').write(h.replace('</head>', '<style>h1{letter-spacing:3px!important}</style></head>', 1))
    d = compara.confere(pw, pl, porta=lfsite.serve(est, 8815), temas=['sem'])
    ok('estrago de propósito (título mais espaçado) é visto', any(d.values()), (d['sem'][0][1] if d['sem'] else '')[:120])
    # (4) o site de 19/11 (a base da 1ª planta) × o de hoje
    p19 = lfsite.serve(lfsite.monta(lfsite.BASE_1A_PLANTA), 8816)
    b19 = planta.grava(pw, 'site-inicio-19-11', TELA, porta=p19, com_ligacoes=False, temas=['sem'])
    d = compara.compara(b19['temas']['sem']['pecas'], pl['temas']['sem']['pecas'])
    ok('site de 19/11 (%s) × site de hoje: as diferenças aparecem' % lfsite.BASE_1A_PLANTA, len(d) > 0, '%d diferenças · ex.: %s' % (len(d), (d[0][0] + ' ' + d[0][1])[:90] if d else ''))
    json.dump(d, open('/tmp/argus_p7b_19-11_x_hoje.json', 'w'), ensure_ascii=False, indent=1)
    # (5) as regras de toque rodam no site (sinal × destino, janela, voltar)
    P = toques.confere(pw, pl)
    ok('regras de toque rodaram no site', isinstance(P, list), '%d achado(s) do site · ex.: %s' % (len(P), ('%s %s' % P[0])[:110] if P else ''))
    json.dump(P, open('/tmp/argus_p7b_toques.json', 'w'), ensure_ascii=False, indent=1)
    # (6) o medidor de família no site: só claro, letra do site, temáticas
    F = []
    for tm in POUCOS:
        for lt in (1.0, 1.2):
            b, pg = planta._abre_tela(pw, TELA, tm, None, letra=lt); F += familia.mede_tela('site · %s · letra %s' % (tm, lt), pg.evaluate(familia.COLETA)); b.close()
    ok('medidor rodou no site (temáticas e letra 1,2×)', isinstance(F, list), '%d achado(s) do site' % len(F))
    json.dump(F, open('/tmp/argus_p7b_medidor.json', 'w'), ensure_ascii=False, indent=1)
print('\n%d de %d ok' % (sum(1 for x in R if x[1]), len(R)))
