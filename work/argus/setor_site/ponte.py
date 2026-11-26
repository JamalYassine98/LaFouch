# ARGUS · a PONTE app × site (Parte 8): a mesma peça com o mesmo nome, preço e estoque nos dois lados.
# O app (loja de teste) monta o que mandaria ao site para cada peça do site — o mesmo código do envio (vitProduto + vitDocBody) —,
# o site abre com ESSES documentos no lugar do retrato da loja, e cada peça é conferida na própria página dela:
# o nome, o preço (o número do app passado pelo formato do site, LFI.fmt) e o aviso de estoque (Esgotado / Últimas N).
# Foto: fica fora — a loja de teste do app não tem fotos (o envio delas é conferido pelos testes do app).
import os, sys, json
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(A, 'motor')); sys.path.insert(0, os.path.join(A, 'setor_site'))
import abrir, lfsite
OK, ACH, NC = 'ok', 'ACHADO', 'não conferido'
# as peças do site; a loja de teste não tem nenhuma marcada para o site, então vale como se TODAS estivessem (o envio é o mesmo; o lote aberto não é peça do site)
DO_APP = "()=>{const L=window.__LF,S=L.S;let R=Object.keys(S.site||{});if(!R.length)R=[...new Set((S.items||[]).filter(i=>!i.bulk).map(i=>i.ref).filter(Boolean))];return R.map(r=>{const p=L.vitProduto(r);return Object.assign(L.vitDocBody(r,p),{ref:r,lib:true})}).filter(d=>d.n>0)}"
def _fs(v):
    """Um valor do app no formato do Firestore (o mesmo que a nuvem devolve ao site)."""
    if v is None: return {'nullValue': None}
    if isinstance(v, bool): return {'booleanValue': v}
    if isinstance(v, int): return {'integerValue': str(v)}
    if isinstance(v, float): return {'integerValue': str(int(v))} if v.is_integer() else {'doubleValue': v}
    if isinstance(v, str): return {'stringValue': v}
    if isinstance(v, list): return {'arrayValue': {'values': [_fs(x) for x in v]} if v else {}}
    if isinstance(v, dict): return {'mapValue': {'fields': {k: _fs(x) for k, x in v.items()}}}
    return {'stringValue': str(v)}
def do_app(pw, nav):
    b, pg = abrir.abre(pw, navegador=nav)
    try: D = pg.evaluate(DO_APP)
    finally: b.close()
    return D, [{'name': 'projects/x/databases/(default)/documents/produtos/' + d['ref'], 'fields': {k: _fs(v) for k, v in d.items()}} for d in D]
def roda(pw, nav, **kw):
    D, docs = do_app(pw, nav); out = []
    if not D: return [('ponte app × site', NC, 'a loja de teste do app não tem peça no site')]
    for d in D:
        b, pg = lfsite.abre(pw, navegador=nav, rota='p/' + d['ref'], produtos=docs, lingua='es', **kw)
        try:
            # só o cabeçalho da peça aberta (código, nome, preço, aviso): o resto da página tem outras peças com o mesmo preço
            t = pg.evaluate("()=>{const h=[...document.querySelectorAll('.det .dh')].find(e=>window.__argus.vis(e));return h?h.innerText:''}")
            preco = pg.evaluate("(n)=>window.LFI&&LFI.fmt?LFI.fmt(n):null", d['n'])
            ruim = []
            if d['ref'] not in t: ruim.append('a página da peça não abriu (o código não aparece no cabeçalho)')
            if d['nome'] and d['nome'].split()[-1] not in t: ruim.append('nome “%s” não aparece' % d['nome'])
            if not preco: ruim.append('o site não formatou o preço')
            elif preco not in t: ruim.append('preço do app %s não aparece' % preco)
            av = d.get('aviso') or ''
            if av == 'Esgotado' and not any(w in t for w in ('Esgotado', 'Agotado', 'Avisame', 'Avise-me')): ruim.append('o app diz Esgotado, o site não')
            if av != 'Esgotado' and d.get('est', 0) > 0 and any(w in t for w in ('Esgotado', 'Agotado')): ruim.append('o site diz esgotado com %d no estoque do app' % d['est'])
            out.append(('ponte app × site · %s' % d['ref'], ACH if ruim else OK, '; '.join(ruim)))
        finally: b.close()
    return out
