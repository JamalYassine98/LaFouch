# ARGUS · prova da Parte 7e (a PORTA do site e o selo por setor): a rodada rápida do site roda todas as etapas com uma planta
# aprovada de teste e trava pelos achados; o selo do site vale só para o commit do catalogo e só sem mudança fora dele; os modos
# do site cobrem cada valor de cada modo; o mapa lista toda página do site; a porta do app usa a mesma segurança (setor NUVEM).
import os, sys, json, shutil, subprocess
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for p in ('motor', 'setor_site', 'setor_nuvem'): sys.path.insert(0, os.path.join(A, p))
import planta, selo, aparelhos, lfsite
import importlib.util
def carrega(nome, f): s = importlib.util.spec_from_file_location(nome, f); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m
porta = carrega('porta_site', os.path.join(A, 'setor_site', 'porta.py'))
R = []
def ok(nome, cond, d=''): R.append((nome, bool(cond), d)); print(('ok    ' if cond else 'FALHA ') + nome + (' · ' + d if d else ''))
# (1) os modos do site: cada valor de cada modo roda na completa; a rápida só no modo da planta
M = aparelhos.MODOS['site']; q = porta.modos_quer(True); T = [x for x in q if isinstance(x, tuple)]
ok('completa: todas as temáticas, letras e línguas e todos os aparelhos rodam', {x[1] for x in T} == set(M['tematica']) and {x[2] for x in T} == set(M['letra']) and {x[3] for x in T} == set(M['lingua']) and {x[0] for x in T} == set(porta.APARELHOS) and 'reduzir movimento' in q, '%d aberturas por tela' % len(T))
ok('rápida: só o celular do dono, sem temática, letra 1×, PT', porta.modos_quer(False) == {(aparelhos.DONO, 'sem', 1.0, 'pt')})
# (2) o mapa: toda página do site entra; planta aprovada cobre a própria rota e as que o dono aprovou como iguais
pg = porta.paginas(lfsite.monta(lfsite.commit_de()))
ok('mapa: todas as páginas do site (menos a 404 e a do Google) + carrinho, conta e peça', '' in pg and 'catalogo' in pg and '404' not in pg and not any(p.startswith('google') for p in pg) and 'p/<peça>' in pg, '%d lugares' % len(pg))
c = porta.cobertas([({'rota': 'armacoes', 'vale_para': ['armazones']}, 'aprovada'), ({'rota': 'sol'}, 'pendente')])
ok('mapa: planta pendente não cobre; "vale_para" cobre as páginas iguais aprovadas', c == {'armacoes', 'armazones'})
# (3) o selo do site: vale para o commit do catalogo, e só com o catalogo limpo
rep = '/tmp/argus_cat_teste'; shutil.rmtree(rep, ignore_errors=True); os.makedirs(rep)
g = lambda *a: subprocess.run(['git', '-C', rep] + list(a), capture_output=True, text=True)
g('init', '-q'); open(rep + '/index.html', 'w').write('a'); g('add', '.'); g('-c', 'user.email=a@a', '-c', 'user.name=a', 'commit', '-qm', 'a')
velho_rep, velho_d = selo.REPO['site'], selo.D; selo.REPO['site'] = (rep, []); selo.D = '/tmp/argus_selos_teste'; shutil.rmtree(selo.D, ignore_errors=True)
try:
    bom = {'falhas': 0, 'autoprova_ok': True, 'completa': True, 'resumo': 'teste'}
    selo.grava('site', bom); c1 = selo.confere('site'); ok('selo do site dado na rodada completa sem falha', c1[0], c1[1])
    ok('selo do site guarda o commit do catalogo (não o do projeto)', json.load(open(selo.D + '/site.json'))['commit'] == g('rev-parse', 'HEAD').stdout.strip() != selo.commit('app'))
    open(rep + '/index.html', 'w').write('b'); c2 = selo.confere('site'); ok('catalogo mexido fora do commit = sem selo', not c2[0], c2[1])
    g('add', '.'); g('-c', 'user.email=a@a', '-c', 'user.name=a', 'commit', '-qm', 'b'); c3 = selo.confere('site'); ok('selo de outro commit do catalogo é recusado', not c3[0], c3[1])
    selo.grava('site', dict(bom, completa=False)); ok('rodada rápida não dá selo ao site (e apaga o velho)', not selo.confere('site')[0])
finally: selo.REPO['site'], selo.D = velho_rep, velho_d
# (4) a porta do app usa a mesma segurança (setor NUVEM), e nenhuma porta chama o Argus antigo (work/fiscal)
pa = open(os.path.join(A, 'setor_app', 'porta.py')).read(); ps = open(os.path.join(A, 'setor_site', 'porta.py')).read()
ok('as duas portas usam a segurança do setor NUVEM', 'seguranca.resumo' in pa and 'seguranca.resumo' in ps)
ok('nenhuma porta chama o Argus antigo (work/fiscal)', 'fiscal' not in pa and 'fiscal' not in ps)
# (5) a rodada rápida do site, de verdade, com uma planta APROVADA de teste (a aprovação é um trecho que está na lista viva)
planta.P_SITE = '/tmp/argus_plantas_site_porta'; shutil.rmtree(planta.P_SITE, ignore_errors=True)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    pl = planta.grava(pw, 'site-inicio', {'setor': 'site', 'rota': '', 'nome': 'Início do site', 'passos': [], 'cenario': 'normal'}, temas=['sem'])
pl['aprovacao'] = 'APROVADO'; planta.salva(pl)
res = porta.roda('rapida'); E = {e['etapa']: e for e in res['etapas']}
precisa = ['autoprova', 'conferências do site', 'plantas do site válidas', 'comparador', 'toques', 'medidor', 'todos os modos', 'tempo', 'mapa', 'segurança']
falta = [n for n in precisa if not any(k.startswith(n) for k in E)]
ok('a rodada rápida do site passou por todas as etapas', not falta, 'faltou: ' + ', '.join(falta))
ok('autoprova do site: motor e estragos vistos', res['autoprova_ok'])
ok('comparador: o site de hoje × a planta gravada agora = igual', next(e for k, e in E.items() if k.startswith('comparador'))['estado'] == 'ok')
ok('modos: o modo da rápida rodou com a planta', next(e for k, e in E.items() if k.startswith('todos os modos'))['estado'] == 'ok')
ok('os achados das conferências do site travam (sem selo)', next(e for k, e in E.items() if k.startswith('conferências'))['estado'] == 'FALHA' and res['falhas'] >= 1)
ok('rodada rápida nunca dá selo', not os.path.exists(os.path.join(selo.D, 'site.json')) or json.load(open(os.path.join(selo.D, 'site.json')))['commit'] != res['commit'])
f = [n for n, c, _ in R if not c]
print('\nParte 7e: %d/%d' % (len(R) - len(f), len(R)))
sys.exit(1 if f else 0)
