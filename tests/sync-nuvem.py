# Sincronização entre dois "aparelhos" (duas páginas) contra um Firestore de mentira em memória.
import asyncio, json, re, subprocess, sys, time
from playwright.async_api import async_playwright
PORTA = 8797
srv = subprocess.Popen(['python3', '-m', 'http.server', str(PORTA), '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
DB = {}          # id -> fields
POSTS = []
OFFLINE = {'A': False, 'B': False}
ok = bad = 0
def check(n, c, extra=''):
    global ok, bad
    print(('  ok  ' if c else ' FALHA ') + n + ('' if c else '  ' + str(extra)))
    if c: ok += 1
    else: bad += 1
def rota(nome):
    async def r(route):
        u, m = route.request.url, route.request.method
        if OFFLINE[nome] and 'googleapis' in u and 'securetoken' not in u:
            return await route.abort()
        if 'securetoken' in u: return await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
        if m == 'POST' and ':runQuery' in u:
            q = json.loads(route.request.post_data)['structuredQuery']
            desde = int(q['where']['fieldFilter']['value']['integerValue'])
            docs = sorted([(int(f['ts']['integerValue']), i, f) for i, f in DB.items() if int(f['ts']['integerValue']) >= desde])[:q['limit']]
            return await route.fulfill(json=[{'document': {'name': 'projects/x/databases/(default)/documents/mov/' + i, 'fields': f}} for _, i, f in docs] or [{}])
        if m == 'POST' and '/mov?documentId=' in u:
            i = u.split('documentId=')[1]
            if i in DB: return await route.fulfill(status=409, json={'error': {'message': 'exists'}})
            DB[i] = json.loads(route.request.post_data)['fields']; POSTS.append(i)
            return await route.fulfill(json={})
        return await route.fulfill(json={'documents': []})
    return r
async def nova(p, nome):
    b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width': 420, 'height': 900})
    await ctx.route(re.compile(r'googleapis\.com'), rota(nome)); pg = await ctx.new_page(); erros = []
    pg.on('pageerror', lambda e: erros.append(str(e)))
    await pg.goto('http://localhost:%d/index.html#test,projteste' % PORTA); await pg.wait_for_function('window.__LF && window.__syncApp')
    await pg.evaluate("""() => { const S = window.__LF.S; S.nuvem.rt = 'x'; S.sales = []; S.cash = {pyg: 1000, usd: 0, brl: 0};
      S.items = [{tipo:'sol',ref:'ZA',cor:'P',qty:3,custo:10},{tipo:'sol',ref:'ZB',cor:'R',qty:1,custo:10}]; }""")
    return b, pg, erros
async def main():
    async with async_playwright() as p:
        bA, A, eA = await nova(p, 'A'); bB, B, eB = await nova(p, 'B')
        base = int(time.time() * 1000) - 5000
        await A.evaluate("(b) => window.__syncApp.liga(b)", base); await B.evaluate("(b) => window.__syncApp.liga(b)", base)
        ids = await A.evaluate("() => [window.__LF.S.aparelho]"); idsB = await B.evaluate("() => [window.__LF.S.aparelho]")
        check('cada aparelho tem o seu código', ids[0] != idsB[0] and ids[0].startswith('AP'), (ids, idsB))
        # A e B vendem a mesma peça ao mesmo tempo (3 -> -1)
        venda = "(n) => { const L = window.__LF, S = L.S; S.items[0].qty -= 2; S.cash.pyg += n; S.sales.unshift({id: 'V-' + S.aparelho.slice(2) + '-0001', ts: Date.now(), price: n}); }"
        await A.evaluate(venda, 500); await B.evaluate(venda, 700)
        await A.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())"); await B.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())"); await A.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())")
        est = lambda pg: pg.evaluate("() => { const S = window.__LF.S; return [S.items[0].qty, S.cash.pyg, S.sales.length, S.syncOut.length]; }")
        eA_, eB_ = await est(A), await est(B)
        check('A: soma as duas vendas (-1, caixa 2200, 2 vendas, fila vazia)', eA_ == [-1, 2200, 2, 0], eA_)
        check('B: mesmo resultado', eB_ == [-1, 2200, 2, 0], eB_)
        check('o que chegou da nuvem não é reenviado em loop', len(POSTS) == 6, POSTS)
        n = len(POSTS); await A.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())"); await B.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())")
        check('ciclo sem mudança não envia nada', len(POSTS) == n)
        # B fica sem internet, vende; A também vende; B volta e tudo se acerta
        OFFLINE['B'] = True
        await B.evaluate(venda.replace('0001', '0002'), 300); await B.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())")
        pend = await B.evaluate("() => [window.__LF.S.syncOut.length, window.__syncApp.info.estado]")
        sv = await B.evaluate("() => window.__LF.S.sales.length")
        check('sem internet: o aparelho avisa o erro e a venda continua guardada nele', pend[1] == 'erro' and sv == 3, (pend, sv))
        await A.evaluate("() => { const S = window.__LF.S; S.items[1].qty += 5; }"); await A.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())")
        OFFLINE['B'] = False
        await B.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())"); await A.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())")
        f = lambda pg: pg.evaluate("() => { const S = window.__LF.S; return [S.items[0].qty, S.items[1].qty, S.cash.pyg, S.sales.length, S.syncOut.length]; }")
        fA, fB = await f(A), await f(B)
        check('depois da internet voltar os dois ficam iguais (qtd -3, 6; caixa 2500; 3 vendas)', fA == fB == [-3, 6, 2500, 3, 0], (fA, fB))
        ids_v = await A.evaluate("() => window.__LF.S.sales.map(s => s.id)")
        check('ids de venda são únicos entre aparelhos', len(set(ids_v)) == 3, ids_v)
        check('sem erro de script', not eA and not eB, (eA, eB))
        await bA.close(); await bB.close()
asyncio.run(main()); srv.terminate()
print(ok, 'ok', bad, 'falhas'); sys.exit(1 if bad else 0)
