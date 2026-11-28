#!/usr/bin/env python3
"""Lê os relatórios de erro e a lista de envios (saidas/) do projeto de TESTE lafouch-teste (28/11/2026, Fase 3).

Roda SÓ no GitHub (workflow ler-teste.yml), com a conta github-le do projeto de teste — que só LÊ (Firestore e Storage)
e é aceita só para este repositório, sem chave guardada. Nunca toca na loja real: o projeto está fixo aqui.

Uso (no GitHub):  python3 tools/le-teste.py --dias 2 --saida DIR      (token em GOOGLE_TOKEN)
Autoteste local:  python3 tools/le-teste.py --autoteste
"""
import json, os, sys, time, urllib.request, urllib.parse

PROJETO = 'lafouch-teste'  # fixo: este leitor não sabe ler outro projeto
BUCKET = 'lafouch-teste.firebasestorage.app'
FS = 'https://firestore.googleapis.com/v1/projects/%s/databases/(default)/documents' % PROJETO


def valor(v):
    """Firestore REST (valor tipado) → Python."""
    if 'stringValue' in v: return v['stringValue']
    if 'integerValue' in v: return int(v['integerValue'])
    if 'doubleValue' in v: return float(v['doubleValue'])
    if 'booleanValue' in v: return v['booleanValue']
    if 'timestampValue' in v: return v['timestampValue']
    if 'nullValue' in v: return None
    if 'mapValue' in v: return {k: valor(x) for k, x in (v['mapValue'].get('fields') or {}).items()}
    if 'arrayValue' in v: return [valor(x) for x in (v['arrayValue'].get('values') or [])]
    return None


def doc(d):
    o = {k: valor(x) for k, x in (d.get('fields') or {}).items()}
    o['_id'] = d.get('name', '').rsplit('/', 1)[-1]
    return o


def pede(url, token, corpo=None, bruto=False):
    req = urllib.request.Request(url, data=json.dumps(corpo).encode() if corpo is not None else None,
                                 headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as r:
        dados = r.read()
    return dados if bruto else json.loads(dados or b'null')


def consulta(colecao, filtro, token, limite=300):
    """Os documentos de uma coleção com ts >= filtro (valor tipado do Firestore), do mais novo ao mais velho."""
    q = {'structuredQuery': {'from': [{'collectionId': colecao}],
                             'where': {'fieldFilter': {'field': {'fieldPath': 'ts'}, 'op': 'GREATER_THAN_OR_EQUAL', 'value': filtro}},
                             'orderBy': [{'field': {'fieldPath': 'ts'}, 'direction': 'DESCENDING'}], 'limit': limite}}
    r = pede(FS + ':runQuery', token, q) or []
    return [doc(x['document']) for x in r if 'document' in x]


def filtros(desde_ms):
    """relatorios.ts é hora do servidor (request.time); saidas.ts é Date.now() em ms (functions/ambiente.js)."""
    return ({'timestampValue': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(desde_ms / 1000))},
            {'integerValue': str(int(desde_ms))})


def resumo(rel, sai, fotos):
    linhas = ['# Projeto de teste — %d relatório(s) de erro, %d envio(s) registrado(s)' % (len(rel), len(sai)), '']
    for r in rel:
        linhas.append('- %s · v%s · tela **%s** · %s%s' % (r.get('ts', ''), r.get('v', ''), r.get('tela', ''), str(r.get('erro', ''))[:160],
                                                         ' · foto: fotos/%s.jpg' % r['_id'] if r['_id'] in fotos else ''))
    if sai:
        linhas += ['', '## Envios que NÃO saíram (modo teste)']
        for s in sai:
            linhas.append('- %s · %s · %s' % (time.strftime('%d/%m %H:%M', time.gmtime(s.get('ts', 0) / 1000)), s.get('tipo', ''), json.dumps(s.get('resumo', {}), ensure_ascii=False)[:200]))
    return '\n'.join(linhas) + '\n'


def principal(dias, saida):
    token = os.environ.get('GOOGLE_TOKEN', '')
    if not token: raise SystemExit('sem GOOGLE_TOKEN (este leitor só roda no GitHub, pela conta só-leitura do teste)')
    desde = (time.time() - dias * 86400) * 1000
    f_rel, f_sai = filtros(desde)
    rel = consulta('relatorios', f_rel, token)
    sai = consulta('saidas', f_sai, token)
    os.makedirs(os.path.join(saida, 'fotos'), exist_ok=True)
    fotos = set()
    for r in rel:
        if not r.get('foto'): continue
        uid = r['_id'].split('_')[0]
        nome = urllib.parse.quote('relatorios/%s/%s.jpg' % (uid, r['_id']), safe='')
        try:
            img = pede('https://storage.googleapis.com/storage/v1/b/%s/o/%s?alt=media' % (BUCKET, nome), token, bruto=True)
            open(os.path.join(saida, 'fotos', r['_id'] + '.jpg'), 'wb').write(img); fotos.add(r['_id'])
        except Exception as e:
            r['_foto_erro'] = str(e)[:120]
    json.dump(rel, open(os.path.join(saida, 'relatorios.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump(sai, open(os.path.join(saida, 'saidas.json'), 'w'), ensure_ascii=False, indent=1)
    open(os.path.join(saida, 'RESUMO.md'), 'w').write(resumo(rel, sai, fotos))
    print(resumo(rel, sai, fotos))


def autoteste():
    d = {'name': 'projects/x/databases/(default)/documents/relatorios/u1_492000_3',
         'fields': {'v': {'stringValue': '642'}, 'tela': {'stringValue': 'Vender'}, 'erro': {'stringValue': 'x is undefined'},
                    'foto': {'booleanValue': True}, 'n': {'integerValue': '7'}, 'ts': {'timestampValue': '2026-11-28T20:00:00Z'},
                    'm': {'mapValue': {'fields': {'a': {'arrayValue': {'values': [{'stringValue': 'b'}]}}}}}}}
    o = doc(d)
    assert o == {'v': '642', 'tela': 'Vender', 'erro': 'x is undefined', 'foto': True, 'n': 7, 'ts': '2026-11-28T20:00:00Z', 'm': {'a': ['b']}, '_id': 'u1_492000_3'}, o
    txt = resumo([o], [{'tipo': 'email', 'resumo': {'para': 'a@b.com', 'assunto': 'Oi'}, 'ts': 0}], {'u1_492000_3'})
    assert 'tela **Vender**' in txt and 'fotos/u1_492000_3.jpg' in txt and 'NÃO saíram' in txt and 'a@b.com' in txt, txt
    assert filtros(1764360000000) == ({'timestampValue': '2025-11-28T20:00:00Z'}, {'integerValue': '1764360000000'}), filtros(1764360000000)
    assert PROJETO == 'lafouch-teste' and FS.endswith('/projects/lafouch-teste/databases/(default)/documents') and BUCKET.startswith('lafouch-teste.')
    print('le-teste: autoteste ok')


if __name__ == '__main__':
    a = sys.argv[1:]
    if '--autoteste' in a: autoteste()
    else:
        dias = float(a[a.index('--dias') + 1]) if '--dias' in a else 2
        saida = a[a.index('--saida') + 1] if '--saida' in a else 'teste-leitura'
        principal(dias, saida)
