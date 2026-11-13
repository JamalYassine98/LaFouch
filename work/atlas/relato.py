# Lê atlas.json e escreve docs/ATLAS-SITE.md (padrão por aparelho, movimentos, falhas, o que o designer sabe).
import json, collections, os
A = os.path.dirname(os.path.abspath(__file__)) + '/'
R = json.load(open(A + 'atlas.json'))
ap = []; 
for k in R:
    n = k.split('|')[0] + ' ' + k.split('|')[1]
    if n not in ap: ap.append(n)
def g(n, t): 
    a, b = n.rsplit(' ', 1); return R.get('%s|%s|%s' % (a, b, t), {})
L = ['# Atlas do site lafouch.com (medido em 13/11/2026)', '',
 'Memória para esboços: NÃO inventar tela do zero. Medidas reais do site, em 16 aparelhos × 6 telas, parado e em movimento.',
 'Gerar de novo: `python3 work/atlas/atlas.py 0 16 && python3 work/atlas/atlas.py junta && python3 work/atlas/relato.py` · dados: `work/atlas/atlas.json` · fotos reais: `work/atlas/img/<tela>_<largura>.jpg` (320, 390, 844, 768, 1366, 2560).',
 'Limites: só tema claro padrão, idioma espanhol, letra normal, produtos de teste. Sem temáticas, sem letra maior, sem celular de verdade.', '',
 '## 1. Padrão por aparelho (como o site se arruma hoje)', '',
 '| Aparelho | Topo (alt.) | Vitrine Início | Catálogo | Margem | Título peça | Comprar na 1ª tela | ☰ |', '|---|---|---|---|---|---|---|---|']
for n in ap:
    i = g(n, 'inicio').get('medidas') or {}; c = g(n, 'catalogo').get('medidas') or {}; p = g(n, 'peca').get('medidas') or {}
    v = i.get('vitrine') or {}; gr = c.get('grade') or {}
    L.append('| %s | %s | %s col × %s px | %s col × %s px | %s | %s px | %s | %s |' % (n, (i.get('topo') or [0,0,0,'?'])[3], v.get('colunas','?'), v.get('largura','?'), gr.get('colunas','?'), gr.get('largura','?'), gr.get('margem','?'), (p.get('letras') or {}).get('peca','?'), {True:'sim', False:'NÃO', None:'?'}[p.get('comprarNaTela')], 'sim' if i.get('mnb') else 'não'))
L += ['', '## 2. Falhas com a tela parada (quantas telas × aparelhos)', '', '| Regra | Telas | Onde (exemplos) | Exemplo |', '|---|---|---|---|']
def conta(campo):
    c = collections.defaultdict(list)
    for k, d in R.items():
        xs = d.get(campo) or [] if campo != 'volta' else (d.get('movimento') or {}).get('voltaAoTopo') or []
        seen = set()
        for x in xs:
            if x['r'] in seen: continue
            seen.add(x['r']); c[x['r']].append((k, x))
    return c
for campo, tit in (('parado', None), ('rolando', '## 3. Falhas que só aparecem em MOVIMENTO (depois de rolar e parar)')):
    if tit: L += ['', tit, '', '| Regra | Telas | Onde (exemplos) | Exemplo |', '|---|---|---|---|']
    c = conta(campo); base = conta('parado') if campo == 'rolando' else {}
    for r, v in sorted(c.items(), key=lambda x: -len(x[1])):
        novo = [k for k, _ in v if k not in {k2 for k2, _ in base.get(r, [])}] if campo == 'rolando' else [k for k, _ in v]
        if campo == 'rolando' and not novo: continue
        L.append('| %s | %d | %s | %s |' % (r, len(novo), '; '.join(k.replace('|', ' ') for k in novo[:3]), ' / '.join(str(e) for e in v[0][1]['ex'][:2]).replace('|', '/').replace('\n', ' ')))
L += ['', '## 4. Movimentos do sistema', '']
an = collections.Counter(); cls = []; cab = collections.Counter(); wa = collections.Counter(); volta = []; trava = []
for k, d in R.items():
    for a in d.get('mov') or {}: an[a] += 1
    m = d.get('movimento') or {}
    if m.get('cls', 0) > 0.05: cls.append((m['cls'], k))
    if len(m.get('fundoDoCabecalho') or []) > 1: cab[k.split('|')[2]] += 1
    for w in m.get('whatsappParado') or []:
        if w:
            l, r_, o = w.split(' '); W = int(k.split('|')[1].split('x')[0])
            if int(r_) > W + 2 or float(o) < 0.95: wa[k.split('|')[0] + ' ' + k.split('|')[2]] += 1
    if 'voltarDaPeca' in m: volta.append((k.split('|')[0], m['voltarDaPeca']))
    if m.get('passosQueRolaram') == 0 and k.split('|')[2] in ('inicio', 'catalogo', 'peca'): trava.append(k)
L.append('- Animações e transições longas (> 0,45 s) vistas: ' + '; '.join('%s (%d telas)' % (a, n) for a, n in an.most_common(14)))
L.append('- Pulo de layout ao rolar (CLS > 0,05; bom é < 0,1): ' + ('; '.join('%s = %s' % (k.replace('|', ' '), c) for c, k in sorted(cls, reverse=True)[:8]) or 'nenhum'))
L.append('- Cabeçalho muda de posição ao rolar em: ' + (', '.join('%s (%d aparelhos)' % x for x in cab.items()) or 'nenhuma tela (fica sempre fixo)'))
L.append('- WhatsApp parado fora da tela ou meio transparente em: ' + (', '.join(sorted(wa)[:14]) + (' …' if len(wa) > 14 else '') + ' — %d combinações' % len(wa) if wa else 'nenhuma'))
L.append('- Voltar da peça devolve a posição da lista? ' + '; '.join('%s: %s→%s %s' % (n, v[0], v[1], 'ok' if v[0] is not None and v[1] is not None and abs(v[0] - v[1]) < 6 else 'MUDOU') for n, v in volta))
L.append('- Telas em que a roda/dedo não rolou nada: ' + (', '.join(k.replace('|', ' ') for k in trava[:8]) or 'nenhuma'))
L += ['', '## 5. O que o designer sabe (work/kit/olho.js — roda em todo esboço, parado e depois de rolar)', '',
 '| Regra | O que olha | De qual falha nasceu |', '|---|---|---|',
 '| cortado | clicável aparecendo pela metade na borda | WhatsApp pela metade (dono, 13/11) |',
 '| apagado | clicável meio transparente | WhatsApp a 92% |',
 '| largura | página mais larga que a tela | regra geral |',
 '| tampado | clicável coberto por algo fixo/flutuante | minha proposta "WhatsApp sempre inteiro" tampava "Ver todos" |',
 '| toque<24 / toque<40 | alvo pequeno para o dedo | auditoria (bolinhas 8×8) |',
 '| colados | centros de dois alvos a menos de 24 px | minha proposta de área de 44 nas bolinhas se sobrepunha |',
 '| texto cortado | texto com "…" | nomes cortados nos cartões (piorou no S215) |',
 '| letra<11 | letra menor que 11 px | auditoria |',
 '| texto sobre texto | dois textos ocupando o mesmo lugar | fiscal de 10/11 (título em cima do voltar) |',
 '| fileira torta | cartões lado a lado com alturas ou preços desalinhados | preços desalinhados (S209/S214) |',
 '| barras fixas | cabeçalho+rodapé fixos ocupando > 25% da tela | minha barra de categorias quase dobrou o cabeçalho |',
 '| imagem quebrada | foto que não carregou | regra geral |',
 '', 'Regras de conduta do designer (não são medidas, são decisões do dono): ver docs/DESIGN-SITE-E-APP.md — identidade primeiro; não poluir; filtros enxutos; não mudar Ver modelo nem Comprar; um arquivo por tela; testar o que propõe ANTES de mandar (rodar olho.js no esboço e comparar com o "hoje": a proposta não pode criar falha nova).']
open(A + '../../docs/ATLAS-SITE.md', 'w').write('\n'.join(L) + '\n'); print('\n'.join(L[9:]))
