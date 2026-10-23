#!/usr/bin/env python3
"""Testes automáticos do La Fouch.  Uso:  python3 tests/run.py   (ou: npm test)

Abre www/ num Chromium sem interface, com a URL terminando em #test (o app então expõe
window.__LF com as funções internas) e confere contas, lotes, leitor de código, gravação
e as telas. Requer: pip install playwright  (e um Chromium; PLAYWRIGHT_BROWSERS_PATH ou o do sistema).
"""
import asyncio, glob, json, os, subprocess, sys, time
from playwright.async_api import async_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTA = 8799
PRE = """
const L = window.__LF, S = L.S;
// zera as listas que cada teste usa, para não depender dos dados de exemplo
S.fx = {pyg: 7000, brl: 1400, ts: Date.now(), live: false, src: 't', status: ''};
S.cash = {pyg: 100000, usd: 100, brl: 0};
S.ini = {rep: 0, colch: 0, melh: 0};
S.sales = []; S.compras = []; S.melhUso = []; S.imprev = []; S.elog = []; S.cpay = []; S.dlog = []; S.items = []; S.grp = []; S.lotes = [];
S.exp = []; S.volume = 1; S.fxHist = []; S.janela = 30;
"""

# (nome, corpo JS que devolve um valor, esperado)
TESTES = [
 # ---- contas da venda ----
 ("calcSale: divisão básica", """return L.calcSale({price:25000, repUSD:.65}, 2, 7000, .1, 1000, 500)""",
  {"price":50000,"rep":9100,"repUSD":1.3,"contas":2000,"colch":910,"melh":1000,"livre":36990,"trava":5550}),
 ("calcSale: soma das partes = preço", """
   let ruim = 0;
   for (const qty of [1,2,5]) for (const fx of [6000,7000,8100]) for (const pct of [.05,.12,.25]) for (const p of [3000,25000,90000]) {
     const c = L.calcSale({price:p, repUSD:.65}, qty, fx, pct, 1100, 700);
     if (Math.abs(c.rep + c.contas + c.colch + c.melh + c.livre - c.price) > 1e-6) ruim++;
   } return ruim""", 0),
 ("calcSale: preço manual", """const c = L.calcSale({price:25000, repUSD:.65}, 1, 7000, .1, 1000, 500, 40000); return [c.price, c.livre]""", [40000, 40000-4550-1000-455-500]),
 ("calcSale: venda abaixo do custo não gera melhoria e fica negativa", """const c = L.calcSale({price:5000, repUSD:.65}, 1, 7000, .1, 1000, 500); return [c.melh, c.livre]""", [0, -1005]),
 ("totalMensal e contasPeca", """S.exp=[{valor:100},{valor:300}]; S.volume=40; const a=[L.totalMensal(), L.contasPeca()]; S.volume=0; return a.concat(L.contasPeca())""", [400, 10, 400]),
 # ---- moedas ----
 ("ratePyg e conv", """return [L.ratePyg('pyg'), L.ratePyg('usd'), L.ratePyg('brl'), L.conv(10,'usd','pyg'), L.conv(70000,'pyg','usd'), L.conv(1400,'brl','usd')]""", [1, 7000, 5, 70000, 10, 1]),
 ("walletGs soma as três moedas", """S.cash={pyg:1000, usd:2, brl:10}; return L.walletGs()""", 1000 + 2*7000 + 10*5),
 ("parseDec por moeda", """return [L.parseDec('1.234,56','usd'), L.parseDec('25.000','pyg'), L.parseDec('3,6','brl'), L.parseDec('abc','pyg')]""", [1234.56, 25000, 3.6, 0]),
 ("numAmt", """return ['1.234,56','1,234.56','12,5','US$ 3.60','R$ 75','0,50','',].map(L.numAmt)""", [1234.56, 1234.56, 12.5, 3.6, 75, 0.5, None]),
 # ---- colchão cambial ----
 ("colchao: mínimo 5%", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:7350}]; return L.colchao().pct""", 0.05),
 ("colchao: acompanha a alta", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:7840}]; return L.colchao().pct""", 0.12),
 ("colchao: teto de 25%", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:11000}]; return L.colchao().pct""", 0.25),
 ("colchao: queda do câmbio não conta", """const n=Date.now(); S.fxHist=[{ts:n-2*864e5,pyg:7000},{ts:n-864e5,pyg:6000}]; return L.colchao().pct""", 0.05),
 # ---- reservas do caixa ----
 ("reservas: reposição, colchão, contas e livre", """
   const n=Date.now();
   S.sales=[{ts:n, repUSD:1.3, colch:910, melh:1000, contas:2000, estorno:false}];
   S.compras=[{usd:.5}]; S.cash={pyg:100000, usd:0, brl:0};
   const r=L.reservas(); return [r.rUSD, r.repGs, r.colch, r.con, r.melh, r.guard, r.livre]""",
  [0.8, 5600, 910, 2000, 1000, 8510, 90490]),
 ("reservas: venda estornada não reserva nada", """
   S.sales=[{ts:Date.now(), repUSD:1.3, colch:910, melh:1000, contas:2000, estorno:true}]; const r=L.reservas(); return [r.rUSD, r.colch, r.con, r.melh]""", [0, 0, 0, 0]),
 ("reservas: conta paga abate as contas a pagar", """
   const n=Date.now(); S.sales=[{ts:n, repUSD:0, colch:0, melh:0, contas:2000, estorno:false}]; S.cpay=[{ts:n, valor:500}]; return L.reservas().con""", 1500),
 # ---- lotes ----
 ("gUnit: custo médio simples", """return L.gUnit({id:'G', qty:10, totalUsd:20})""", 2),
 ("gUnit: desconta peças com custo próprio", """S.items=[{lote:'G', qty:2, custo:1, bulk:false}]; return L.gUnit({id:'G', qty:10, totalUsd:20})""", 2.25),
 ("grpFalta: total − vendidas − detalhadas", """const g={id:'G', qty:10, sold:2, totalUsd:10}; S.items=[{lote:'G', qty:3, bulk:false},{lote:'G', qty:9, bulk:true}]; return [L.grpTot(g), L.grpDet(g), L.grpFalta(g)]""", [8, 3, 5]),
 ("effCusto: próprio, do lote ou nenhum", """
   S.grp=[{id:'G', qty:10, totalUsd:20}]; return [L.effCusto({custo:3}), L.effCusto({lote:'G'}), L.effCusto({})]""", [3, 2, None]),
 ("lotCharge: desconta do caixa e registra a compra", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'usd'}; L.lotCharge(g); return [S.cash.usd, S.compras.length, S.compras[0].usd, S.compras[0].lot]""", [80, 1, 20, 'G']),
 ("lotCharge: pagamento em guaranis", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'pyg', custoOrig:50000}; L.lotCharge(g); return [S.cash.pyg, S.cash.usd]""", [50000, 100]),
 ("lotRefund: devolve o valor ao caixa", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'usd'}; L.lotCharge(g); L.lotRefund(g); return [S.cash.usd, S.compras.length]""", [100, 0]),
 ("lotAdjust: custo editado ajusta o caixa", """
   const g={id:'G', forn:'F', qty:10, totalUsd:20, moeda:'usd'}; L.lotCharge(g); g.totalUsd=30; L.lotAdjust(g,'usd',20); return [S.cash.usd, S.compras[0].orig]""", [70, 30]),
 ("dedupeItems: junta iguais e mantém diferentes", """
   const a={tipo:'pre', ref:'SP1', grau:'+1.00', cor:'Preto', qty:2}, b=Object.assign({}, a, {qty:3}), c=Object.assign({}, a, {grau:'+2.00'});
   S.items=[a,b,c]; const n=L.dedupeItems(); return [n, S.items.length, S.items[0].qty]""", [1, 2, 5]),
 ("whiten: foto sintética (armação escura em fundo cinza)", """
   const c = L.mkCanvas(600, 400), g = c.getContext('2d');
   g.fillStyle = '#d8d8d8'; g.fillRect(0, 0, 600, 400);
   g.strokeStyle = '#2a2a2a'; g.lineWidth = 14;
   g.beginPath(); g.ellipse(190, 200, 90, 70, 0, 0, 7); g.stroke();
   g.beginPath(); g.ellipse(410, 200, 90, 70, 0, 0, 7); g.stroke();
   g.beginPath(); g.moveTo(280, 190); g.lineTo(320, 190); g.stroke();
   const r = L.whiten(c);
   const d = r.canvas.getContext('2d').getImageData(0, 0, r.canvas.width, r.canvas.height).data;
   let escuros = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 80) escuros++;
   return [r.canvas.width, r.canvas.height, d[0] > 245 && d[1] > 245, escuros > 2000, r.bg.map(v => Math.abs(v - 216) < 12).every(Boolean)]""", [2000, 2000, True, True, True]),
 # ---- movimentos (livro + histórico gravados juntos) ----
 ("lancarCompra: livro e histórico recebem o mesmo fato", """
   L.lancarCompra({ts: 5, desc: 'Compra X', usd: 12.5}); return [S.compras.length, S.dlog.length, S.dlog[0]]""",
  [1, 1, {"ts": 5, "kind": "lote", "desc": "Compra X", "usd": 12.5}]),
 ("lancarMelhoria e lancarImprevisto", """
   L.lancarMelhoria('Tinta', 15000); L.lancarImprevisto('Vitrine', 60000);
   return [S.melhUso.length, S.imprev.length, S.dlog.map(x => x.kind), S.dlog[0].valor, S.dlog[1].valor, S.dlog[0].ts === S.melhUso[0].ts]""",
  [1, 1, ["melh", "imp"], 15000, 60000, True]),
 ("lancarPagamento e desfazerPagamento", """
   const e = {id: 7, nome: 'Aluguel', cat: 'fixa', valor: 900000};
   L.lancarPagamento(e, '2026-10', 99); const dep = [S.cpay.length, S.dlog.length, S.dlog[0].kind, S.dlog[0].valor];
   L.desfazerPagamento(e, '2026-10', 99); return dep.concat([S.cpay.length, S.dlog.length])""",
  [1, 1, "pago", 900000, 0, 0]),
 ("logDespesa: formato e ordem dos campos", """
   L.logDespesa('alt', {nome: 'Luz', cat: 'fixa', de: 100, para: 120}); return Object.keys(S.dlog[0]).join(',')""", "ts,kind,nome,cat,de,para"),
 ("entradaEstoque: registro de entrada", """
   L.entradaEstoque('pre', 'SP1', 'Preto', '+1.00', 6); const x = S.elog[S.elog.length - 1]; return [Object.keys(x).join(','), x.qty, x.ref]""",
  ["ts,tipo,ref,cor,grau,qty", 6, "SP1"]),
 # ---- leitor de código ----
 ("parseHaste: código, medida e variação", """return L.parseHaste(['BR7722\\n51□18 140\\nC3'])""", {"ref":"BR-7722","med":"51□18-140","vr":"C3"}),
 ("parseHaste: 3 letras no prefixo", """return L.parseHaste(['HKJ7241 52-18-145 C2'])""", {"ref":"HKJ-7241","med":"52□18-145","vr":"C2"}),
 ("parseHaste: medidas separadas por espaço", """return L.parseHaste(['SP 1234 54 18 140 C5'])""", {"ref":"SP1234","med":"54□18-140","vr":"C5"}),
 ("parseHaste: texto sem sentido não inventa nada", """return L.parseHaste(['xx'])""", {"ref":"","med":"","vr":""}),
 ("flatParse: linha única", """return L.flatParse('BR7722 51-18-140 C3')""", {"ref":"BR-7722","med":"51□18-140","vr":"C3"}),
 ("parseVote: a maioria vence uma leitura errada", """const v=L.parseVote(['BR7722 51-18-140 C3','BR7722 51-18-140 C3','BR7Z22 51-18-140 C3']); return [v.ref, v.med, v.vr, v.frames]""", ["BR-7722","51□18-140","C3",3]),
 ("hKey e lev (códigos parecidos)", """return [L.hKey('br-77 22'), L.lev('abc','abd'), L.lev('br7722','hkj7241')]""", ["8R7722", 1, 5]),
 ("normRef e normGrau", """return [L.normRef(' br 7722 ', false), L.normRef(' br  7722 ', true), L.normGrau('+2,5'), L.normGrau('2.50'), L.normGrau('')]""", ["BR7722", "BR 7722", "+2.50", "+2.50", ""]),
 ("nrm: sem acento e minúsculo", """return L.nrm('Óculos Espelhado')""", "oculos espelhado"),
 ("parseLote: quantidade da nota", """return ['24 pecas US$ 36,00 total 120','Qtd 30 total USD 45.50','10 pcs'].map(t => L.parseLote(t).qty)""", [24, 30, 10]),
]

def igual(a, b):
    if isinstance(b, float) or isinstance(a, float):
        return a is not None and b is not None and abs(a - b) < 1e-6
    if isinstance(b, list):
        return isinstance(a, list) and len(a) == len(b) and all(igual(x, y) for x, y in zip(a, b))
    if isinstance(b, dict):
        return isinstance(a, dict) and all(k in a and igual(a[k], v) for k, v in b.items())
    return a == b

async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORTA), '-d', os.path.join(RAIZ, 'www')],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)
    exe = next((p for p in ['/opt/pw-browsers/chromium'] + glob.glob('/opt/pw-browsers/chromium*/chrome-linux/chrome') if os.path.exists(p)), None)
    falhas, total = [], 0
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=exe, args=['--no-sandbox']) if exe else await p.chromium.launch(args=['--no-sandbox'])

            async def pagina(scheme='dark', url='#test', ctx=None):
                ctx = ctx or await b.new_context(viewport={'width': 420, 'height': 900}, color_scheme=scheme, service_workers='block')
                await ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
                pg = await ctx.new_page()
                pg.erros = []
                pg.on('pageerror', lambda e: pg.erros.append(str(e)))
                await pg.goto(f'http://localhost:{PORTA}/index.html{url}')
                await pg.wait_for_function('window.__LF', timeout=10000)
                return pg

            # contas, lotes e leitor
            pg = await pagina()
            for nome, corpo, esperado in TESTES:
                total += 1
                try:
                    got = await pg.evaluate('() => {' + PRE + corpo + '}')
                    ok = igual(got, esperado)
                except Exception as e:
                    got, ok = f'ERRO {e}', False
                print(('  ok  ' if ok else ' FALHA ') + nome)
                if not ok:
                    falhas.append(nome); print('        esperado', json.dumps(esperado, ensure_ascii=False), '\n        veio    ', json.dumps(got, ensure_ascii=False))
            total += 1
            if pg.erros: falhas.append('erros de JavaScript'); print(' FALHA erros de JavaScript:', pg.erros)
            else: print('  ok  sem erros de JavaScript nos testes')


            # fluxos pela tela: os botões gravam livro + histórico e mexem no caixa
            pg = await pagina()
            await pg.evaluate("() => { const S = window.__LF.S; S.cash = {pyg: 5000000, usd: 500, brl: 0}; S.compras = []; S.dlog = []; S.imprev = []; S.melhUso = []; S.cpay = []; window.__LF.render(); }")
            total += 1
            await pg.evaluate("() => { const S = window.__LF.S; S.ini.melh = 400000; window.__LF.render(); }")
            await pg.locator('#mainnav >> text="Caixa"').first.click(); await pg.wait_for_timeout(300)
            await pg.fill('#muD', 'Tinta'); await pg.fill('#muV', '50000')
            await pg.locator('[data-act="melhuso"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.melhUso.length, S.dlog.filter(x => x.kind === 'melh').length, S.cash.pyg] }")
            ok = got == [1, 1, 4950000]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Caixa: registrar uso de melhorias')
            if not ok: falhas.append('tela melhorias'); print('        veio', got)
            total += 1
            await pg.locator('#mainnav >> text="Despesas"').first.click(); await pg.wait_for_timeout(300)
            await pg.fill('#impD', 'Conserto'); await pg.fill('#impV', '60000')
            await pg.locator('[data-act="impadd"]').first.click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => { const S = window.__LF.S; return [S.imprev.length, S.dlog.filter(x => x.kind === 'imp').length] }")
            ok = got == [1, 1]
            print(('  ok  ' if ok else ' FALHA ') + 'tela Despesas: registrar imprevisto')
            if not ok: falhas.append('tela imprevisto'); print('        veio', got)


            # tela do produto: lista única de cores, um só botão Vender e janela Editar
            FOTO = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            SETUP = """(foto) => { const L = window.__LF, S = L.S;
              S.items = S.items.filter(i => i.ref !== 'BR44118');
              [['C1','Preto',4,5],['C2','Bege',4,null],['C3','Tartaruga',2,null]].forEach(a => { const it = {tipo:'sem', ref:'BR44118', grau:'', med:'53x18-140', vr:a[0], fmt:'Quadrado', cor:a[1], qty:a[2]}; if (a[3] != null) it.custo = a[3]; S.items.push(it); });
              S.tiposX = [{id:'estojo', label:'Estojos', full:'Estojos', price:10000, repUSD:1, pago:1, simple:true}]; L.syncTipos();
              S.items = S.items.filter(i => i.ref !== 'Estojo A');
              [['Preto',3],['Marrom',2]].forEach(a => S.items.push({tipo:'estojo', ref:'Estojo A', grau:'', med:'', vr:'', fmt:'', cor:a[0], qty:a[1]}));
              S.pnome = S.pnome || {}; S.pnome['BR44118'] = 'Hexagonal';
              S.fotos['BR44118|Preto'] = foto; S.fotos['Estojo A|Preto'] = foto; S.desc = S.desc || {}; delete S.desc['BR44118'];
              S.det = false; S.open = ''; S.qEdit = false; L.render(); }"""

            async def abrir(tipo, nome):
                pg = await pagina()
                await pg.evaluate(SETUP, FOTO)
                await pg.evaluate("(t) => { window.__LF.S.tipo = t; window.__LF.S.todos = false; window.__LF.render(); }", tipo)
                await pg.locator('#mainnav >> text="Estoque"').first.click(); await pg.wait_for_timeout(300)
                await pg.locator('#listCard >> text=' + nome).first.click(); await pg.wait_for_timeout(400)
                return pg

            async def checa(nome, ok, got=None):
                nonlocal total
                total += 1
                print(('  ok  ' if ok else ' FALHA ') + nome)
                if not ok:
                    falhas.append(nome); print('        veio', got)

            pg = await abrir('sem', 'Hexagonal')
            got = await pg.evaluate("() => [document.querySelectorAll('#detail .pl.pick').length, document.querySelectorAll('#detail .vbar button').length, document.querySelectorAll('#detail .pl button').length, document.querySelector('#detail .vbar button').innerText]")
            await checa('produto: 3 cores em lista única e um só botão Vender', got == [3, 1, 0, 'Vender C1 · Preto'], got)
            await pg.locator('#detail .pl.pick').nth(1).click(); await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => [document.querySelector('#detail .vbar button').innerText, window.__LF.S.detCor]")
            await checa('produto: tocar numa cor muda o que o Vender vende', got == ['Vender C2 · Bege', 'Bege'], got)
            await pg.locator('#detail .vbar button').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.view, window.__LF.S.vSel && window.__LF.S.vSel.cor]")
            await checa('produto: Vender leva à venda da cor selecionada', got == ['vendas', 'Bege'], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => { const S = window.__LF.S; S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty = 0; S.detRow = null; S.detCor = ''; window.__LF.render(); }")
            await pg.wait_for_timeout(200)
            got = await pg.evaluate("() => [document.querySelector('#detail .vbar button').innerText, document.querySelector('#detail .vbar button').disabled]")
            await checa('produto: cor sem estoque não é escolhida por padrão', got == ['Vender C2 · Bege', False], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            ok = await pg.locator('#editModal').count() == 1
            await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('9'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab'); await pg.wait_for_timeout(200)
            await pg.locator('#editModal input[aria-label="Custo por peça em US$"]').nth(1).fill('2,5'); await pg.locator('#editModal input[aria-label="Custo por peça em US$"]').nth(1).press('Tab'); await pg.wait_for_timeout(200)
            antes = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'BR44118').map(i => [i.cor, i.qty, i.custo])")
            await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(300)
            depois = await pg.evaluate("() => window.__LF.S.items.filter(i => i.ref === 'BR44118').map(i => [i.cor, i.qty, i.custo])")
            fechou = await pg.locator('#editModal').count() == 0
            await checa('janela Editar: quantidade e custo só valem ao salvar', ok and antes[0][1] == 4 and depois == [['Preto', 9, 5], ['Bege', 4, 2.5], ['Tartaruga', 2, None]] and fechou, [antes, depois, fechou])

            pg = await abrir('sem', 'Hexagonal')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.fill('1'); await pg.locator('#editModal input[aria-label="Quantidade em estoque"]').first.press('Tab')
            await pg.fill('#descTa', 'rascunho'); await pg.wait_for_timeout(200)
            await pg.locator('#editModal button:text-is("Cancelar")').last.click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.cor === 'Preto' && i.ref === 'BR44118')[0].qty, window.__LF.S.desc['BR44118'], !!document.getElementById('editModal')]")
            await checa('janela Editar: Cancelar descarta tudo', got == [4, None, False], got)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.fill('#descTa', 'Polarizado, mola flexível'); await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.desc['BR44118'], document.getElementById('detail').innerText.includes('Polarizado, mola flexível')]")
            await checa('janela Editar: descrição salva e mostrada na tela', got == ['Polarizado, mola flexível', True], got)

            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal button:text-is("Excluir foto")').click(); await pg.wait_for_timeout(200)
            ainda = await pg.evaluate("() => !!window.__LF.S.fotos['BR44118|Preto']")
            await pg.locator('#editModal button:text-is("Sim, excluir")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [!!window.__LF.S.fotos['BR44118|Preto'], window.__LF.S.items.filter(i => i.ref === 'BR44118').length, !!document.getElementById('editModal')]")
            await checa('janela Editar: excluir foto pede confirmação e não mexe no estoque', ainda and got == [False, 3, True], [ainda, got])

            await pg.locator('#editModal #edCodigo').fill('br99999')
            await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(400)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR99999').length, window.__LF.S.items.filter(i => i.ref === 'BR44118').length, window.__LF.S.open, !!window.__LF.S.pnome['BR99999'], document.getElementById('detail').hidden]")
            await checa('janela Editar: trocar o código move o produto', got == [3, 0, 'BR99999', True, False], got)

            pg = await abrir('sem', 'Hexagonal')
            await pg.evaluate("() => window.__LF.S.items.push({tipo:'sem', ref:'OUTRO1', grau:'', med:'', vr:'C1', fmt:'Quadrado', cor:'Azul', qty:1})")
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal #edCodigo').fill('OUTRO1')
            await pg.locator('#editModal button:text-is("Salvar")').click(); await pg.wait_for_timeout(300)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'BR44118').length, !!document.getElementById('editModal')]")
            await checa('janela Editar: código repetido é recusado', got == [3, True], got)

            pg = await abrir('estojo', 'Estojo A')
            await pg.locator('#detail button[aria-label="Editar"]').click(); await pg.wait_for_timeout(300)
            await pg.locator('#editModal button:text-matches("Excluir a cor")').click(); await pg.wait_for_timeout(200)
            await pg.locator('#editModal button:text-is("Sim, excluir")').click(); await pg.wait_for_timeout(400)
            got = await pg.evaluate("() => [window.__LF.S.items.filter(i => i.ref === 'Estojo A').map(i => i.cor), !!window.__LF.S.fotos['Estojo A|Preto'], !!document.getElementById('editModal')]")
            await checa('janela Editar: excluir a cor remove peças e foto dela', got == [['Marrom'], False, False], got)

            # gravação: o que foi salvo volta depois de recarregar
            total += 1
            ctx = await b.new_context(viewport={'width': 420, 'height': 900}, service_workers='block')
            pg = await pagina(ctx=ctx)
            await pg.evaluate("() => { const L = window.__LF; L.S.items.push({tipo:'pre', ref:'TESTE999', grau:'+1.00', cor:'Preto', qty:7}); L.S.cash.usd = 123.45; L.saveSoon(); }")
            await pg.wait_for_timeout(1500)
            await pg.reload(); await pg.wait_for_function('window.__LF')
            got = await pg.evaluate("() => { const S = window.__LF.S; const i = S.items.filter(x => x.ref === 'TESTE999')[0]; return [!!i && i.qty, S.cash.usd] }")
            ok = got == [7, 123.45]
            print(('  ok  ' if ok else ' FALHA ') + 'gravação: dados voltam após recarregar')
            if not ok: falhas.append('gravação'); print('        veio', got)
            await ctx.close()

            # telas: 7 abas x 2 temas, sem erro e com conteúdo
            fundos = {}
            for scheme in ['dark', 'light']:
                pg = await pagina(scheme)
                for aba in ['Dashboard', 'Estoque', 'Vendas', 'Caixa', 'Câmbio', 'Despesas', 'Histórico']:
                    total += 1
                    loc = pg.locator(f'#mainnav >> text="{aba}"').first
                    try:
                        await loc.click(timeout=3000); await pg.wait_for_timeout(300)
                        n = await pg.evaluate("() => document.body.innerText.length")
                        ok = n > 150 and not pg.erros
                    except Exception as e:
                        ok, n = False, str(e)[:80]
                    print(('  ok  ' if ok else ' FALHA ') + f'tela {aba} ({scheme})')
                    if not ok: falhas.append(f'tela {aba} {scheme}'); print('        ', n, pg.erros)
                fundos[scheme] = await pg.evaluate("() => getComputedStyle(document.body).backgroundColor")
            total += 1
            ok = fundos['dark'] != fundos['light']
            print(('  ok  ' if ok else ' FALHA ') + f'tema automático: escuro {fundos["dark"]} / claro {fundos["light"]}')
            if not ok: falhas.append('tema')
            await b.close()
    finally:
        srv.kill()
    print(f'\n{total - len(falhas)}/{total} testes passaram' + ('' if not falhas else f'  |  FALHARAM: {", ".join(falhas)}'))
    sys.exit(1 if falhas else 0)

asyncio.run(main())
