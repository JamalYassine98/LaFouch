# 40c de ponta a ponta no simulador: grava um giro de mentira (360 quadros de /tmp/e2e/q, fora do repositório) com a cena inteira girada N graus,
# trata com o giroTrata e mede a inclinação da FRENTE que saiu. Com 0° compara, com o MESMO vídeo, o resultado desta versão com o da v616 (sem a correção).
import asyncio, subprocess, sys, json, base64
from playwright.async_api import async_playwright
GRAVA = """async (CFG) => { const w = ms => new Promise(r => setTimeout(r, ms));
  const cam = document.createElement('canvas'); cam.width = 1280; cam.height = 720; const cx = cam.getContext('2d'), Qs = [];
  for (let i = 0; i < 360; i += 12) await Promise.all([...Array(12)].map(async (_, j) => { const bl = await (await fetch('/__q/' + String(i + j).padStart(3, '0') + '.jpg')).blob(); Qs[i + j] = await createImageBitmap(bl); }));
  const T0 = performance.now(); let ruido = 0, pare = false;
  const desenha = () => { const t = (performance.now() - T0) / 1000, ang = t < CFG.S ? 0 : 360 * (t - CFG.S) / CFG.P; cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.translate(640, 360); cx.rotate(CFG.ROT * Math.PI / 180); cx.scale(1.08, 1.08); cx.translate(-640, -360);   // 1,08: a cena girada continua cobrindo o quadro
    cx.drawImage(Qs[Math.floor(((ang % 360) + 360) % 360)], 0, 0); cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.fillStyle = 'rgba(' + (ruido++ % 2 ? '255,255,255' : '0,0,0') + ',0.004)'; cx.fillRect(0, 0, 1280, 720); if (!pare) requestAnimationFrame(desenha); };
  desenha(); const s = cam.captureStream(30);
  const mt = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm'].filter(t => MediaRecorder.isTypeSupported(t))[0], rec = new MediaRecorder(s, { mimeType: mt, videoBitsPerSecond: 5000000 }), ch = [];
  rec.ondataavailable = e => { if (e.data && e.data.size) ch.push(e.data); };
  const fim = new Promise(r => rec.onstop = r); rec.start(500); await w(CFG.DUR * 1000); rec.stop(); await fim; pare = true;
  const b = new Blob(ch, { type: mt }), u8 = new Uint8Array(await b.arrayBuffer()); let s2 = ''; for (let i = 0; i < u8.length; i += 32768) s2 += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
  return [mt, btoa(s2)]; }"""
TRATA = """async (V) => { const u8 = Uint8Array.from(atob(V[1]), c => c.charCodeAt(0)), video = new Blob([u8], { type: V[0] }), t1 = performance.now();
  const avisos = []; const lt = window.__LF.lfToast;
  try { const r = await window.giroTrata(video, { fotos: [0, 45] });
    // inclinação da frente que saiu: máscara do que não é branco na foto tratada + a mesma medida (gtTopo), quando existe nesta versão
    const im = new Image(); await new Promise(ok => { im.onload = ok; im.src = r.fotos[0]; });
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height, m = new Uint8Array(W * H);
    let x0 = W, x1 = -1, y0 = H, y1 = -1; for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) { const k = (y * W + xx) * 4; if (Math.min(d[k], d[k + 1], d[k + 2]) < 225) { m[y * W + xx] = 1; if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    const tp = window.__gtTopo ? window.__gtTopo(m, W, x0, x1, y0, y1) : null, saiu = tp ? Math.round(Math.atan2(tp.d - tp.e, tp.xd - tp.xe) * 1800 / Math.PI) / 10 : null;
    let h = 0; const tudo = r.fotos[0] + r.fotos[45] + r.capa; for (let i = 0; i < tudo.length; i++) h = (h * 31 + tudo.charCodeAt(i)) | 0;
    return { ok: true, seg: Math.round((performance.now() - t1) / 100) / 10, reto: r.info.reto || null, frenteSaiu: saiu, frente: r.info.frente, marca: h, kb: Math.round(r.blob.size / 1024), foto: r.fotos[0] }; }
  catch (e) { return { ok: false, erro: String(e && e.message) }; } }"""
async def main():
    srvs = [subprocess.Popen([sys.executable, '-m', 'http.server', str(p), '-d', d], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) for p, d in ((8793, '/home/claude/lafouch/www'), (8794, '/tmp/www616/www'))]
    await asyncio.sleep(1)
    try:
        async with async_playwright() as p:
            b = await p.chromium.launch(args=['--no-sandbox'])
            async def pagina(porta):
                ctx = await b.new_context(viewport={'width': 900, 'height': 420}, service_workers='block')
                async def serve(route): await route.fulfill(path='/tmp/e2e/q/' + route.request.url.rsplit('/', 1)[1], content_type='image/jpeg')
                await ctx.route('**/__q/*', serve)
                pg = await ctx.new_page(); pg.set_default_timeout(900000)
                await pg.goto('http://localhost:%d/index.html#test' % porta); await pg.wait_for_function('window.__LF', timeout=20000); return pg
            for rot in [float(a) for a in sys.argv[1:]] or [0.0, 2.0, 5.0]:
                pg = await pagina(8793); V = await pg.evaluate(GRAVA, {"S": 3, "P": 14, "DUR": 34, "ROT": rot})
                r = await pg.evaluate(TRATA, V); foto = r.pop('foto', None)
                if foto: open('work/s436/40/endireita_%s_graus_frente.jpg' % str(rot).replace('.0', ''), 'wb').write(base64.b64decode(foto.split(',')[1]))
                print('cena girada', rot, '→ nova:', json.dumps(r, ensure_ascii=False), flush=True)
                if rot == 0:
                    pv = await pagina(8794); rv = await pv.evaluate(TRATA, V); rv.pop('foto', None)
                    print('   mesmo vídeo na v616 (sem correção):', json.dumps(rv, ensure_ascii=False), '| fotos e capa iguais:', rv.get('marca') == r.get('marca'), flush=True)
                    await pv.context.close()
                await pg.context.close()
            await b.close()
    finally:
        [s.kill() for s in srvs]
asyncio.run(main())
