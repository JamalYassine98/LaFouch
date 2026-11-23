"""IDEIAS 09p · a família dos outros botões no mesmo acabamento do Comprar P1 suave (#7f5773).
Prancha (desenho dos papéis; as telas reais vêm depois, na parte seguinte). Saída: esboco-09p-familia.jpg"""
import os
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', '/opt/pw-browsers')
from playwright.sync_api import sync_playwright
C = '#7f5773'
WA = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6z"/></svg>'
CAM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8.5 7l1.5-3h4l1.5 3"/></svg>'
G = '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.8 6C12.3 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.8c4.3-4 6.9-9.9 6.9-17.2z"/><path fill="#FBBC05" d="M10.4 28.8c-.5-1.4-.8-3-.8-4.8s.3-3.3.8-4.8l-7.8-6C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.7-4.1-13.6-9.7l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg>'
def p(t, ic=''): return '<b class="k p">%s%s</b>' % (ic, t)
def s(t): return '<b class="k s">%s</b>' % t
def c(t, f=False): return '<b class="k c%s">%s</b>' % (' f' if f else '', t)
L = [
 ('Principal', 'cor do logo suave cheia, só a palavra em caixa alta espaçada, 48 px · um por tela · nos eventos vira a cor do evento',
  p('Comprar') + p('Finalizar compra') + p('Prosseguir com o pagamento') + p('Abrir a câmera', CAM) + p('Solicitar orçamento', WA) + p('Falar com a loja', WA) + p('Iniciar sessão') + p('Salvar') + p('Começar'),
  'Ícone só onde diz para onde vai (WhatsApp, câmera), fino, 16 px, antes da palavra. Sem verde: o WhatsApp é a mesma família.'),
 ('Secundário', 'a outra saída da tela · fio de 1 px e letra na cor do logo · mesma forma e letra do principal',
  s('Ver modelo') + s('Abrir no Google Maps') + s('Voltar'), ''),
 ('Compacto', 'dentro de cartão ou linha · 32 px, letra 11 px', c('Comparar', True) + c('Ver este modelo', True) + c('Sincronizar') + c('Copiar'), ''),
 ('Link', 'ir ou voltar · texto na cor do logo, frase normal, com › · dentro de frase, sublinhado fino',
  '<a class=l>Ver catálogo ›</a><a class=l>Continuar comprando</a><a class=l>Esqueci minha senha</a><span class=fr>Ao pagar, você aceita os <u>Termos e Condições</u>.</span>', ''),
 ('Não mudam', 'como você pediu e aprovou', '<b class="k x">Cancelar pedido</b><b class="k gg">%sContinuar com Google</b><b class="k so">Sair da conta</b><a class="l ex">Excluir minha conta</a>' % G,
  'Cancelar pedido fica como aprovado (vermelho, "Voltar" embaixo). Google: o desenho é da outra empresa. Sair da conta e Excluir minha conta: como estão hoje.'),
]
css = """*{box-sizing:border-box}body{margin:0;padding:28px 32px;width:1240px;font-family:Inter,system-ui,sans-serif;color:#141414;background:#fff}
h1{font:600 26px Inter;margin:0 0 4px}.sub{color:#6b6763;font-size:15px;margin:0 0 20px}
.row{display:grid;grid-template-columns:230px 1fr;gap:24px;padding:22px 0;border-top:1px solid #ece7e9}.row h2{font:600 19px Inter;margin:0 0 6px;color:%(C)s}.row p{margin:0;color:#6b6763;font-size:13.5px;line-height:1.4}
.b{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.nota{grid-column:2;color:#6b6763;font-size:13px;margin-top:-6px}
.k{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:48px;padding:0 28px;border-radius:999px;font:500 13px Inter;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}
.p{background:%(C)s;color:#fff}.s{background:none;color:%(C)s;box-shadow:inset 0 0 0 1px %(C)s}
.c{height:32px;padding:0 16px;font-size:11px;letter-spacing:.16em;color:%(C)s;box-shadow:inset 0 0 0 1px %(C)s}.c.f{background:%(C)s;color:#fff;box-shadow:none}
.l{color:%(C)s;font:500 15px Inter;letter-spacing:.01em;margin-right:18px}.fr{font-size:13px;color:#141414}.fr u{color:%(C)s;text-underline-offset:3px;text-decoration-thickness:1px}
.x{background:#b3261e;color:#fff;letter-spacing:.02em;text-transform:none;font-size:15px;width:240px}.gg{background:#fff;color:#141414;border:1px solid #dadce0;text-transform:none;letter-spacing:0;font:700 15px Inter}
.so{background:#fff;color:#141414;border:1px solid #141414;border-radius:14px;text-transform:none;letter-spacing:0;font:700 16px Inter}.ex{color:#b3261e;font-weight:600}""" % {'C': C}
h = '<style>%s</style><h1>Família de botões · no acabamento do Comprar P1 suave</h1><p class=sub>Uma cor só (a do logo, suave #7f5773), uma letra só, sem brilho, sombra nem degradê. Mesmo jeito no site e no app.</p>' % css
for n, d, bt, nota in L: h += '<div class=row><div><h2>%s</h2><p>%s</p></div><div class=b>%s</div>%s</div>' % (n, d, bt, '<div class=nota>%s</div>' % nota if nota else '')
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1304, 'height': 600}, device_scale_factor=2)
    pg.set_content(h); pg.wait_for_timeout(300); pg.screenshot(path='esboco-09p-familia.jpg', full_page=True, type='jpeg', quality=88); b.close()
print('ok')
