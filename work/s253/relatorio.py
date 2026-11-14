# S253 · monta docs/RELATORIO-MOVIMENTO-LUXO-14-11.md a partir do inventário (inv.py) + estudo das interações.  python3 relatorio.py
import json, os, re, collections
A = os.path.dirname(os.path.abspath(__file__)) + '/'
D = json.load(open(A + 'inventario.json'))
MANTER = {'ulinp': 'Manter sem fim (pedido do dono: pulso suave das Últimas unidades).', 'evcai': 'Manter: já encerra sozinho aos 10 s.', 'evpis': 'Manter: já encerra sozinho aos 10 s.', 'evasa': 'Manter: já encerra com os enfeites aos 10 s.', 'evbri': 'Manter: 1 passada.', 'evvoa': 'Manter.',
          'wap': 'Manter: já limitado a 2 voltas (S235).', 'ring': 'Manter: já limitado a 2 voltas (S235).', 'hdkb': 'Manter: aproximação lenta da foto do Destaque (é o tempo do slide).', 'hdpg': 'Manter: linha de tempo do slide.', 'pktm': 'Manter: é o relógio de 30 min do pagamento, não é enfeite.', 'mlAnel': 'Manter: anel de "segurar 5 s para sair" do modo cliente (funcional).', 'avBar': 'Manter: linha de tempo do aviso; só afinar.', 'lfbar': 'Manter: linha de tempo; só afinar.', 'lfpl': 'Manter: ponto "ao vivo" (é estado); trocar o brilho por respiração de transparência.', 'lfEntra': 'Manter até entrar a troca de tela com direção (S252).'}
MORTO = {'site': set('flo rfl rsp shine shd sin efd efi fup sg fl hin draw ctash arr'.split()), 'app': {'ripa'}}
def decide(app, l):
    n = l['nome']; f = [x.split(' (')[0] for x in l['falhas']]
    if n in MORTO[app]: return 'Apagar', 'Código antigo que NÃO aparece hoje (conferido em 14/11: ' + ('capa/palco antigos do Início estão escondidos' if app == 'site' else 'a onda de toque foi desligada na v465') + ').'
    if n in ('resp', 'somb'): return 'Manter', 'Respiração e sombra da Mochi (padrão próprio).'
    if n in MANTER: return 'Manter', MANTER[n]
    if n.startswith('gz'): return 'Manter', 'Padrão próprio da Mochi, já aprovado; só entra na curva de luxo.'
    if 'SEM USO' in f: return 'Apagar', 'Não é usada em lugar nenhum.'
    if l['carga']: return 'Trocar', 'Vira o carregador único: anel fino (1,5 px) na cor do texto, 1 volta por segundo; ou a linha de progresso fina quando há contagem.'
    c = []
    if 'SEM FIM fora de "carregando"' in f: c.append('deixa de ser sem fim: 1 ou 2 passadas e repousa')
    if 'QUICA' in f or 'CURVA COM MOLA' in f: c.append('sai o quique: chega ao lugar desacelerando, sem passar do ponto')
    if 'BALANÇA' in f: c.append('sai o balanço: troca por aparecer suave')
    if 'TREME' in f: c.append('sai a tremida: 1 deslocamento curto (6 px, 0,2 s) e fio vermelho no campo')
    if 'MEXE NO TAMANHO/POSIÇÃO' in f: c.append('anima deslocamento/escala em vez de largura/posição (mesmo visual, mais liso)')
    if 'EFEITO PESADO' in f: c.append('troca brilho/sombra animada por transparência')
    if 'LONGA' in f: c.append('encurta para 0,46 s')
    if 'CURVA PADRÃO' in f and not c: return 'Ajustar', 'Só a curva de luxo e um dos 3 tempos (0,2 · 0,32 · 0,46 s).'
    if not c: return 'Manter', 'Dentro do padrão; só confirma a curva.'
    if 'CURVA PADRÃO' in f: c.append('curva de luxo')
    return ('Trocar' if ('QUICA' in f or 'BALANÇA' in f or 'TREME' in f or 'CURVA COM MOLA' in f) else 'Ajustar'), (c[0][0].upper() + c[0][1:] + ('; ' + '; '.join(c[1:]) if c[1:] else '') + '.')
def tabela(app):
    out = ['| Animação | Onde (código) | Hoje | Decisão | Correção |', '|---|---|---|---|---|']; cont = collections.Counter()
    for l in D[app]['kf']:
        dec, cor = decide(app, l); cont[dec] += 1
        onde = (l['usos'][0]['onde'] if l['usos'] else '—').replace('\n', ' ').replace('|', '/'); onde = re.sub(r'/\*.*?\*/', '', onde).strip()[-44:]
        hoje = (('%s s' % '/'.join(('%g' % x) for x in l['durs'][:3])) if l['durs'] else 'tempo por variável') + (' · sem fim' if l['semfim'] else '') + ((' · ' + ', '.join(x.split(' (')[0].lower() for x in l['falhas'] if not x.startswith(('SEM FIM', 'SEM USO')))) if l['falhas'] else '')
        out.append('| `%s` | `%s` | %s | **%s** | %s |' % (l['nome'], onde, hoje[:90], dec, cor))
    return '\n'.join(out), cont
ts, cs = tabela('site'); ta, ca = tabela('app')
def trans(app):
    tr = D[app]['tr']; td = collections.Counter(t['dur'] for t in tr); lay = [t for t in tr if re.match(r'^(width|height|top|left|right|bottom|margin|padding|max-|all$)', t['prop'])]
    semc = sum(1 for t in tr if not t['curva'] or t['curva'] in ('ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'))
    return len(tr), len(td), semc, lay
ns, nts, scs, ls = trans('site'); na, nta, sca, la = trans('app')
corpo = open(A + 'relatorio_base.md').read()
corpo = corpo.replace('{{NUM}}', '| | Site | App |\n|---|---|---|\n| Animações desenhadas | %d | %d |\n| Manter | %d | %d |\n| Ajustar (curva/tempo) | %d | %d |\n| Trocar (quique, balanço, tremida, sem fim, carregador) | %d | %d |\n| Apagar (sem uso) | %d | %d |\n| Transições | %d | %d |\n| Tempos diferentes nas transições | %d | %d |\n| Transições sem a curva de luxo | %d | %d |\n| Transições que mexem em tamanho/posição | %d | %d |\n| Animações feitas por código (animate / quadro a quadro / relógio) | %d / %d / %d | %d / %d / %d |' % (
    len(D['site']['kf']), len(D['app']['kf']), cs['Manter'], ca['Manter'], cs['Ajustar'], ca['Ajustar'], cs['Trocar'], ca['Trocar'], cs['Apagar'], ca['Apagar'], ns, na, nts, nta, scs, sca, len(ls), len(la),
    D['site']['js']['animate('], D['site']['js']['requestAnimationFrame'], D['site']['js']['setInterval'], D['app']['js']['animate('], D['app']['js']['requestAnimationFrame'], D['app']['js']['setInterval']))
corpo = corpo.replace('{{TAB_SITE}}', ts).replace('{{TAB_APP}}', ta)
corpo = corpo.replace('{{LAY}}', '\n'.join('- %s: `%s` anima `%s`' % (w, t['onde'].replace('\n', ' ')[-50:], t['prop']) for w, l in (('Site', ls), ('App', la)) for t in l))
open(A + '../../docs/RELATORIO-MOVIMENTO-LUXO-14-11.md', 'w').write(corpo)
print('site', dict(cs), 'app', dict(ca), 'linhas', corpo.count('\n'))
