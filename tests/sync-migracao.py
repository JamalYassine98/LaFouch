# Migração guiada: aparelho A cria a base, aparelho B (com dados diferentes) entra, totais conferem e depois trocam movimentos.
import asyncio, json, re, subprocess, sys, time
from playwright.async_api import async_playwright
PORTA = 8794
srv = subprocess.Popen(['python3', '-m', 'http.server', str(PORTA), '-d', 'www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
MOV = {}; DOCS = {}
ok = bad = 0
def check(n, c, extra=''):
    global ok, bad
    print(('  ok  ' if c else ' FALHA ') + n + ('' if c else '  ' + str(extra)))
    if c: ok += 1
    else: bad += 1
async def rota(route):
    u, m = route.request.url, route.request.method
    if 'securetoken' in u: return await route.fulfill(json={'id_token': 't', 'refresh_token': 'r'})
    if m == 'POST' and ':runQuery' in u:
        q = json.loads(route.request.post_data)['structuredQuery']; d = int(q['where']['fieldFilter']['value']['integerValue'])
        docs = sorted([(int(f['ts']['integerValue']), i, f) for i, f in MOV.items() if int(f['ts']['integerValue']) >= d])
        return await route.fulfill(json=[{'document': {'name': 'x/mov/' + i, 'fields': f}} for _, i, f in docs] or [{}])
    if m == 'POST' and '/mov?documentId=' in u:
        i = u.split('documentId=')[1]
        if i in MOV: return await route.fulfill(status=409, json={})
        MOV[i] = json.loads(route.request.post_data)['fields']; return await route.fulfill(json={})
    if '/documents/backups' in u:
        k = u.split('/documents/')[1].split('?')[0]
        if m == 'PATCH':
            nv = json.loads(route.request.post_data); DOCS.setdefault(k, {'fields': {}})['fields'].update(nv['fields']); return await route.fulfill(json={})
        if m == 'GET':
            if k in DOCS: return await route.fulfill(json=DOCS[k])
            if k == 'backups': return await route.fulfill(json={'documents': [{'name': 'x/documents/' + n, 'fields': d['fields']} for n, d in DOCS.items()]})
            return await route.fulfill(status=404, json={'error': {'message': 'nf'}})
    return await route.fulfill(json={'documents': []})
async def nova(p):
    b = await p.chromium.launch(); ctx = await b.new_context(viewport={'width': 420, 'height': 900}); await ctx.route(re.compile(r'googleapis\.com'), rota)
    pg = await ctx.new_page(); erros = []; pg.on('pageerror', lambda e: erros.append(str(e)))
    await pg.goto('http://localhost:%d/index.html#test,projteste' % PORTA); await pg.wait_for_function('window.__LF && window.__syncApp')
    await pg.evaluate("() => { window.__LF.S.nuvem.rt = 'x'; }")
    return b, pg, erros
async def main():
    async with async_playwright() as p:
        bA, A, eA = await nova(p); bB, B, eB = await nova(p)
        # A = dados "da loja"; B = outro aparelho com dados diferentes (vai ser substituído)
        await A.evaluate("() => { const S = window.__LF.S; S.cash = {pyg: 1234000, usd: 55, brl: 80}; }")
        await B.evaluate("() => { const S = window.__LF.S; S.items = [{tipo:'sol',ref:'LIXO',cor:'X',qty:9,custo:1}]; S.sales = []; S.cash = {pyg: 1, usd: 0, brl: 0}; }")
        totA = await A.evaluate("() => window.__syncApp.totais()")
        await A.evaluate("() => window.__syncApp.base()")
        check('base gravada na nuvem (meta + partes)', 'backups/zbase-sync' in DOCS and 'backups/zbase-sync_p0' in DOCS, list(DOCS))
        check('A ficou com sincronização ligada', await A.evaluate("() => window.__LF.S.syncOn === true"))
        await B.evaluate("() => window.__syncApp.entra()")
        totB = await B.evaluate("() => window.__syncApp.totais()")
        check('B ficou com os mesmos totais de A (estoque, caixa, vendas)', totA == totB, (totA, totB))
        ids = await A.evaluate("() => window.__LF.S.aparelho"), await B.evaluate("() => window.__LF.S.aparelho")
        check('cada um com o seu código de aparelho (o de A não foi copiado)', ids[0] != ids[1] and ids[0] and ids[1], ids)
        check('B ligou a sincronização', await B.evaluate("() => window.__LF.S.syncOn === true"))
        msg = await B.evaluate("() => window.__LF.S.syncMsg")
        check('B mostra "Conferi" (totais iguais)', 'Conferi' in msg, msg)
        check('o que havia em B antes ficou guardado como rede de segurança', await B.evaluate("() => (localStorage.getItem('lafouch_antes_sync') || '').includes('LIXO')"))
        # depois da entrada, A vende e B recebe
        await A.evaluate("() => { const S = window.__LF.S; const it = S.items.filter(i => !i.bulk && i.qty > 0)[0]; window.__it = it.ref + '|' + it.cor; it.qty -= 1; S.cash.pyg += 100000; S.sales.unshift({id: 'V-' + S.aparelho.slice(2) + '-0001', ts: Date.now(), price: 100000}); }")
        for _ in range(2):
            await A.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())"); await B.evaluate("() => window.__syncApp.ciclo().then(() => window.__syncApp.ciclo())")
        tA2 = await A.evaluate("() => window.__syncApp.totais()"); tB2 = await B.evaluate("() => window.__syncApp.totais()")
        check('depois de uma venda em A, B acompanha (totais iguais e mudaram)', tA2 == tB2 and tA2['itens'] == totA['itens'] - 1 and tA2['pyg'] == totA['pyg'] + 100000, (tA2, tB2))
        # aparelhos: nomes, lista e desconexão
        await B.evaluate("() => { window.__LF.S.aparNome = 'PC da loja'; return window.__syncApp.reg(true); }"); await A.evaluate("() => { window.__LF.S.aparNome = 'Celular do dono'; return window.__syncApp.reg(true); }")
        await A.evaluate("() => window.__syncApp.lista()")
        lst = await A.evaluate("() => window.__LF.S._syncAps.map(x => [x.nome, x.rev])")
        check('A enxerga os dois aparelhos com nome', sorted(l[0] for l in lst) == ['Celular do dono', 'PC da loja'], lst)
        apB = await B.evaluate("() => window.__LF.S.aparelho")
        await A.evaluate("(ap) => { window.__LF.S._syncDesc = ap; }", apB)
        await A.evaluate("(ap) => window.__LF.S._syncDesc === ap && document.body.dispatchEvent(new Event('x'))", apB)
        await A.evaluate("(ap) => { const b = document.createElement('button'); b.setAttribute('data-act','syncdesc'); b.setAttribute('data-id', ap); document.body.appendChild(b); b.click(); }", apB); await A.wait_for_timeout(500)
        await B.evaluate("() => { window.__syncApp.zeraRev(); return window.__syncApp.ciclo(); }"); await B.wait_for_timeout(300)
        offB = await B.evaluate("() => [window.__LF.S.syncOn, window.__LF.S.syncMsg]")
        check('aparelho desconectado pelo dono para de sincronizar e avisa', offB[0] is False and 'desconectado' in offB[1], offB)
        kept = await B.evaluate("() => window.__LF.S.items.length > 0")
        check('desconectar não apaga os dados do aparelho', kept)
        check('sem erro de script', not eA and not eB, (eA, eB))
        await bA.close(); await bB.close()
asyncio.run(main()); srv.terminate()
print(ok, 'ok', bad, 'falhas'); sys.exit(1 if bad else 0)
