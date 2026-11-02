// La Fouch para Windows: abre o mesmo app (pasta www) numa janela própria.
// Um servidor local na porta fixa mantém os dados do app entre uma abertura e outra.
const { app, BrowserWindow, Menu, shell, Tray, nativeImage } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

let janela = null, bandeja = null, saindo = false;
const PORTA = 47831;
const RAIZ = app.isPackaged ? path.join(process.resourcesPath, 'www') : path.join(__dirname, '..', 'www');
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm', '.onnx': 'application/octet-stream', '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon', '.traineddata': 'application/octet-stream', '.gz': 'application/gzip'
};

function servidor() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      if (p === '/') p = '/index.html';
      const f = path.normalize(path.join(RAIZ, p));
      if (!f.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (e, d) => {
        if (e) { res.writeHead(404); return res.end('Não encontrado'); }
        res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f).toLowerCase()] || 'application/octet-stream' });
        res.end(d);
      });
    });
    s.on('error', () => ok(false));
    s.listen(PORTA, '127.0.0.1', () => ok(true));
  });
}

async function abrir() {
  await servidor();
  Menu.setApplicationMenu(null);
  // backgroundThrottling desligado: com a janela escondida o app continua buscando pedidos do site e avisando
  const w = new BrowserWindow({ width: 1180, height: 820, minWidth: 420, title: 'La Fouch', autoHideMenuBar: true, backgroundColor: '#0f1216', webPreferences: { backgroundThrottling: false } });
  janela = w;
  w.loadURL('http://127.0.0.1:' + PORTA + '/index.html');
  w.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  // fechar a janela só esconde o app (ele segue na bandeja avisando de pedido novo); "Sair" encerra de verdade
  w.on('close', (e) => { if (!saindo) { e.preventDefault(); w.hide(); } });
  try {
    const img = nativeImage.createFromPath(path.join(__dirname, 'icon.png')).resize({ width: 16, height: 16 });
    bandeja = new Tray(img);
    bandeja.setToolTip('La Fouch');
    const mostrar = () => { w.show(); w.focus(); };
    bandeja.on('click', mostrar);
    bandeja.setContextMenu(Menu.buildFromTemplate([
      { label: 'Abrir La Fouch', click: mostrar },
      { label: 'Sair', click: () => { saindo = true; app.quit(); } }
    ]));
  } catch (e) {}
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.whenReady().then(abrir);
  app.on('second-instance', () => { if (janela) { janela.show(); janela.focus(); } });
}
app.on('before-quit', () => { saindo = true; });
app.on('window-all-closed', () => { if (saindo) app.quit(); });
