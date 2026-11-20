# S436 (20/11/2026): monta docs/PLANO-REMENDOS-20-11.md a partir de analise.json (rodar analisa.js antes). Só leitura do código.
import json, collections
R = json.load(open('analise.json'))
C = {c['nome']: c for c in R['cadeias']}
P = [
 ('1', 'A espinha: o desenho da tela (`render`)', ['render']),
 ('2', 'A espinha: destinos, barra e grupos', ['inicioGo', 'navOn', 'grpAbre', 'setView', 'iniLista', 'grpTitulo', 'ACT.nvIr', 'ACT.stAbre', 'ACT.despAb', 'ACT.dfold', 'ACT.famNum']),
 ('3', 'Confirmações ("tem certeza?")', sorted(n for n, c in C.items() if any('98z-s418' in e['f'] for e in c['elos']))),
 ('4', 'Família Resultados / Preços', ['renderDash', 'renderDay', 'ACT.dVer', 'ACT.dVerEsc', 'ACT.dPer', 'ACT.dPerEsc', 'contadorHtml', 'atencaoItens', 'histLista', 'ACT.hfopen', 'dashCompose']),
 ('5', 'Família Peças / Inventário', ['renderDetail', 'renderEstoqueAbas']),
 ('6', 'Família Site / Pedidos / Marketing', ['renderLojaOnline', 'onlUrl', 'vitProduto', 'siteOfPct', 'ACT.cupAbre', 'mkAbre']),
 ('7', 'Famílias Dinheiro, Vender, Clientes/Atacado, Câmera', ['renderCaixa', 'renderFx', 'renderVendas', 'ACT.cartrm', 'ACT.cliab', 'ACT.clinovo', 'mcInicio', 'estTutorial']),
 ('8', 'Nuvem, cópia e sincronização (por último: mexe com os dados)', ['salvarAgora', 'saveFotos', 'nvToken', 'restaurarDados', 'syncAplica', 'limpaRefExcluido', 'backupHtml', 'avMin']),
]
def tabela(nomes):
    L = ['| Nome | Vale hoje (base) | Remendos em cima, na ordem em que rodam | O que cada um faz |', '|---|---|---|---|']
    for n in nomes:
        c = C[n]; base = [e for e in c['elos'] if e['tipo'] == 'base'][0]; rem = [e for e in c['elos'] if e['tipo'] != 'base']
        L.append('| `%s` | %s:%d (%d linhas) | %s | %s |' % (n, base['f'].replace('.js', ''), base['l'], base['linhas'],
            ' → '.join('%s:%d' % (e['f'].replace('.js', ''), e['l']) for e in rem), ' · '.join(sorted(set(e['tipo'].split(' (')[0] for e in rem)))))
    return '\n'.join(L)
def conta(nomes):
    cs = [C[n] for n in nomes]
    return len(cs), sum(len(c['elos']) - 1 for c in cs), len(set(e['f'] for c in cs for e in c['elos']))
tip = collections.Counter(e['tipo'].split(' (')[0] for c in R['cadeias'] for e in c['elos'] if e['tipo'] != 'base')
td = sum(len(v) for v in R['tabDup'].values())
pont = R['pontes']; pentre = [p for p in pont if p['usa'] and any(u != p['poe'][0]['f'] for u in p['usaEm'])]
PARTES = open('plano_partes.md', encoding='utf-8').read().split('\n=====\n')
out = [open('plano_topo.md', encoding='utf-8').read()
       .replace('{NOMES}', str(len(C))).replace('{ELOS}', str(sum(len(c['elos']) - 1 for c in R['cadeias'])))
       .replace('{TIPOS}', ' · '.join('%s: %d' % x for x in tip.most_common())).replace('{GUARDAS}', str(len(R['guarda'])))
       .replace('{TABDUP}', str(td)).replace('{PONTES}', str(len(pont))).replace('{PENTRE}', str(len(pentre))).replace('{OBS}', str(len(R['obs'])))]
for (num, tit, nomes), txt in zip(P, PARTES):
    a, b, c = conta(nomes)
    out.append('## Parte %s — %s\n\n**Tamanho:** %d nomes · %d remendos · %d arquivos tocados.\n\n%s\n\n%s\n' % (num, tit, a, b, c, txt.strip(), tabela(nomes)))
out.append(open('plano_fim.md', encoding='utf-8').read()
    .replace('{TABLISTA}', '\n'.join('- `%s.%s`: %s' % (T, k, ' → '.join('%s:%d' % (e['f'].replace('.js', ''), e['l']) for e in v)) for T, d in R['tabDup'].items() for k, v in d.items()))
    .replace('{PONTLISTA}', ', '.join('`%s` (%s → %s)' % (p['nome'], p['poe'][0]['f'].replace('.js', ''), ', '.join(u.replace('.js', '') for u in p['usaEm'] if u != p['poe'][0]['f'])) for p in pentre)))
open('/home/claude/lafouch/docs/PLANO-REMENDOS-20-11.md', 'w', encoding='utf-8').write('\n'.join(out))
print('ok', sum(len(x) for x in out), 'letras')
