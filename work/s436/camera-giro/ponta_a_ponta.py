import asyncio, subprocess, sys, json, time
from playwright.async_api import async_playwright
ARQ = sys.argv[1] if len(sys.argv) > 1 else '/tmp/e2e/cam.mjpeg'
PARAR = float(sys.argv[2]) if len(sys.argv) > 2 else 0
S_ = float(sys.argv[3]) if len(sys.argv) > 3 else 9
P_ = float(sys.argv[4]) if len(sys.argv) > 4 else 20   # >0: para a gravação à mão nesse segundo (sem esperar a volta fechar)
async def main():
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8791', '-d', '/home/claude/lafouch/www'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--use-file-for-fake-video-capture=' + ARQ])
        ctx = await b.new_context(viewport={'width': 900, 'height': 420}, service_workers='block', permissions=['camera'])
        import os
        async def serve(route):
            f = '/tmp/e2e/q/' + route.request.url.rsplit('/', 1)[1]
            await route.fulfill(path=f, content_type='image/jpeg')
        await ctx.route('**/__q/*', serve)
        pg = await ctx.new_page(); logs = []; erros = []
        pg.on('console', lambda m: logs.append(m.text) if '[LF-CAM]' in m.text else None)
        pg.on('pageerror', lambda e: erros.append(str(e)))
        await pg.goto('http://localhost:8791/index.html#test'); await pg.wait_for_function('window.__LF', timeout=20000)
        t0 = time.time()
        r = await pg.evaluate("""async (CFG) => { const PARAR = CFG.PARAR; const L = window.__LF, S = L.S, w = ms => new Promise(r => setTimeout(r, ms));
          const it = S.items.find(i => i.ref && i.cor) || S.items[0]; const k = it.ref + '|' + (it.cor || '');
          const cam = document.createElement('canvas'); cam.width = 1280; cam.height = 720; const cx = cam.getContext('2d'), Qs = [];
          for (let i = 0; i < 360; i += 12) await Promise.all([...Array(12)].map(async (_, j) => { const bl = await (await fetch('/__q/' + String(i + j).padStart(3, '0') + '.jpg')).blob(); Qs[i + j] = await createImageBitmap(bl); }));
          const T0 = performance.now(); let ruido = 0;
          const desenha = () => { const t = (performance.now() - T0) / 1000, ang = t < CFG.S ? 0 : 360 * (t - CFG.S) / CFG.P; cx.drawImage(Qs[Math.floor(((ang % 360) + 360) % 360)], 0, 0); cx.fillStyle = 'rgba(' + (ruido++ % 2 ? '255,255,255' : '0,0,0') + ',0.004)'; cx.fillRect(0, 0, 1280, 720); if (!window.__pare) requestAnimationFrame(desenha); };
          desenha(); const s = cam.captureStream(30);
          const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.srcObject = s; v.style.cssText = 'position:fixed;left:0;top:0;width:160px;z-index:1'; document.body.appendChild(v); await v.play(); await w(300);
          window.__e = { k: k, ticks: [], fim: false, t0: Date.now() };
          const g = L.giroGrava(s, v, { k: k, fim: () => { window.__e.fim = true; } }, { tick: (seg, volta) => { window.__e.ticks.push([+seg.toFixed(1), volta ? +volta.per.toFixed(2) : 0]); }, fecha: () => { s.getTracks().forEach(t => t.stop()); v.remove(); } });
          if (PARAR) setTimeout(() => g.para(), PARAR * 1000);
          return [k, v.videoWidth, v.videoHeight]; }""", {"PARAR": PARAR, "S": S_, "P": P_})
        print('peça', r)
        fim = None
        for i in range(520):
            await asyncio.sleep(1)
            st = await pg.evaluate("""() => { const e = window.__e, S = window.__LF.S, ref = e.k.split('|')[0], t = document.getElementById('lfToast'), tr = document.querySelector('.egTrat'), ch = document.getElementById('estGiro');
              return { ticks: e.ticks.length, ult: e.ticks[e.ticks.length - 1], fim: e.fim, giro: S.giros && S.giros[ref], toast: t && t.classList.contains('on') ? t.textContent : '', trat: tr ? (tr.querySelector('#egTp').textContent + ' ' + tr.querySelector('#egTf').textContent) : '', escolha: ch ? ch.querySelector('h1').textContent : '' }; }""")
            if i % 10 == 0 or st['fim'] or st['escolha']: print('%3d s' % (time.time() - t0), json.dumps(st, ensure_ascii=False)[:300])
            if st['fim'] or st['escolha']: fim = st; break
        res = await pg.evaluate("""async () => { const e = window.__e, L = window.__LF, S = L.S, ref = e.k.split('|')[0];
          const le = ref => new Promise(ok => { const r = indexedDB.open('lafouch-fotos'); r.onerror = () => ok(null); r.onsuccess = () => { try { const q = r.result.transaction('hq', 'readonly').objectStore('hq').get('giro|' + ref); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); } catch (e) { ok(null); } }; }); const b = await le(ref); const f = S.fotos && S.fotos[e.k], f34 = S.fotos && S.fotos[e.k + '|34'];
          return { giro: S.giros && S.giros[ref], blob: b ? [b.type, Math.round(b.size / 1024)] : null, frente: f ? f.length : 0, t34: f34 ? f34.length : 0, nota: S.fotoNota && S.fotoNota[e.k], fotoFrente: f || null, foto34: f34 || null }; }""")
        import base64
        for nome in ['fotoFrente', 'foto34']:
            if res.get(nome) and str(res[nome]).startswith('data:'):
                d = res[nome].split(',')[1]; open('/tmp/e2e/%s.jpg' % nome, 'wb').write(base64.b64decode(d + '=' * (-len(d) % 4)))
            res[nome] = bool(res.get(nome))
        print('RESULTADO', json.dumps(res, ensure_ascii=False))
        print('ERROS', erros)
        print('\n'.join(l[:420] for l in logs))
        # guarda o giro tratado para olhar
        g = await pg.evaluate("""async () => { const e = window.__e, L = window.__LF; const le = ref => new Promise(ok => { const r = indexedDB.open('lafouch-fotos'); r.onerror = () => ok(null); r.onsuccess = () => { try { const q = r.result.transaction('hq', 'readonly').objectStore('hq').get('giro|' + ref); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); } catch (e) { ok(null); } }; }); const b = await le(e.k.split('|')[0]); if (!b) return null; const a = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000)); return [b.type, btoa(s)]; }""")
        if g: open('/tmp/e2e/giro_saida.' + ('mp4' if 'mp4' in g[0] else 'webm'), 'wb').write(base64.b64decode(g[1]))
        await b.close()
    srv.kill()
asyncio.run(main())
