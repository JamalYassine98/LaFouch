import asyncio, subprocess, sys, json, time
from playwright.async_api import async_playwright
S_ = float(sys.argv[1]); P_ = float(sys.argv[2]); DUR = float(sys.argv[3])
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8793', '-d', '/home/claude/lafouch/www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width': 900, 'height': 420}, service_workers='block')
        async def serve(route):
            await route.fulfill(path='/tmp/e2e/q/' + route.request.url.rsplit('/', 1)[1], content_type='image/jpeg')
        await ctx.route('**/__q/*', serve)
        pg = await ctx.new_page(); erros = []; pg.on('pageerror', lambda e: erros.append(str(e)))
        await pg.goto('http://localhost:8793/index.html#test'); await pg.wait_for_function('window.__LF', timeout=20000); pg.set_default_timeout(600000)
        r = await pg.evaluate("""async (CFG) => { const w = ms => new Promise(r => setTimeout(r, ms));
          const cam = document.createElement('canvas'); cam.width = 1280; cam.height = 720; const cx = cam.getContext('2d'), Qs = [];
          for (let i = 0; i < 360; i += 12) await Promise.all([...Array(12)].map(async (_, j) => { const bl = await (await fetch('/__q/' + String(i + j).padStart(3, '0') + '.jpg')).blob(); Qs[i + j] = await createImageBitmap(bl); }));
          const T0 = performance.now(); let ruido = 0, pare = false;
          const desenha = () => { const t = (performance.now() - T0) / 1000, ang = t < CFG.S ? 0 : 360 * (t - CFG.S) / CFG.P; cx.drawImage(Qs[Math.floor(((ang % 360) + 360) % 360)], 0, 0); cx.fillStyle = 'rgba(' + (ruido++ % 2 ? '255,255,255' : '0,0,0') + ',0.004)'; cx.fillRect(0, 0, 1280, 720); if (!pare) requestAnimationFrame(desenha); };
          desenha(); const s = cam.captureStream(30);
          const mt = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm'].filter(t => MediaRecorder.isTypeSupported(t))[0], rec = new MediaRecorder(s, { mimeType: mt, videoBitsPerSecond: 5000000 }), ch = [];
          rec.ondataavailable = e => { if (e.data && e.data.size) ch.push(e.data); };
          const fim = new Promise(r => rec.onstop = r); rec.start(500); await w(CFG.DUR * 1000); rec.stop(); await fim; pare = true;
          const video = new Blob(ch, { type: mt }), t1 = performance.now();
          try { const r = await window.giroTrata(video, { fotos: [0, 45] }); return { ok: true, seg: Math.round((performance.now() - t1) / 100) / 10, n: r.n, tipo: r.tipo, info: r.info, kb: Math.round(video.size / 1024) }; }
          catch (e) { return { ok: false, erro: String(e && e.message), seg: Math.round((performance.now() - t1) / 100) / 10 }; } }""", {"S": S_, "P": P_, "DUR": DUR})
        print(json.dumps(r, ensure_ascii=False)); print('ERROS', erros)
        await b.close()
    srv.kill()
asyncio.run(main())
