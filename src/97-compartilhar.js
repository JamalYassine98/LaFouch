  // ===== Compartilhar inteligente (v427, aprovado 04/11/2026) =====
  // Janela com WhatsApp Business, WhatsApp, Instagram, Copiar link e Mais. O último app usado NESTE aparelho
  // vem primeiro (com contorno) para evitar fadiga. Com o app novo (plugin LfShare) abre direto o app escolhido;
  // no app antigo, cai na lista do celular. Catálogo: folha, fotos separadas ou só texto (como já era).
  // Peça (tela Vender): foto + nome + preço + link da peça no site.
  var SH_APPS = [
    { id: 'wab', nome: 'WA Business', pkg: 'com.whatsapp.w4b', cor: '#25b06a', ico: '<path d="M4 19l1.2-3.6A8 8 0 1 1 8.6 19z"/><path d="M10 9.5v5h2.2a1.3 1.3 0 0 0 0-2.6H10m0 0h1.9a1.2 1.2 0 0 0 0-2.4H10" stroke-linecap="round"/>' },
    { id: 'wa', nome: 'WhatsApp', pkg: 'com.whatsapp', cor: '#25b06a', ico: '<path d="M4 19l1.2-3.6A8 8 0 1 1 8.6 19z"/><path d="M9.5 9.2c0 2.8 2.5 5.3 5.3 5.3l.9-1.2-1.6-.9-.8.7c-1-.4-1.9-1.3-2.3-2.3l.7-.8-.9-1.6z" fill="currentColor" stroke="none"/>' },
    { id: 'ig', nome: 'Instagram', pkg: 'com.instagram.android', cor: '#d65a96', ico: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".9" fill="currentColor" stroke="none"/>' },
    { id: 'link', nome: 'Copiar link', cor: '', ico: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>' },
    { id: 'mais', nome: 'Mais', cor: '', ico: '<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>' }
  ];
  var SH_INST = null; // apps instalados (pelo plugin); null = não sabemos (mostra todos)
  function shPlug() {
    var C = window.Capacitor;
    return C && C.Plugins && C.Plugins.LfShare && C.isNativePlatform && C.isNativePlatform() ? C.Plugins.LfShare : null;
  }
  function shUlt() {
    try {
      return localStorage.getItem('lf_shUlt') || '';
    } catch (e) {
      return '';
    }
  }
  function shGuardaUlt(id) {
    try {
      localStorage.setItem('lf_shUlt', id);
    } catch (e) {}
  }
  function shB64(cv) {
    return cv.toDataURL('image/jpeg', 0.9).split(',')[1];
  }
