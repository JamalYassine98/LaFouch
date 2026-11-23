"""IDEIAS 09 v3 · família de botões: PRETO no dia a dia, VINHO só no caminho do dinheiro (Comprar · Prosseguir · Finalizar). Estrutura da v2:: papel (Principal · Secundário · Link · Perigo) × tamanho (Grande · Médio · Compacto)
+ Marca (não muda). Cada casa mostra o botão novo e os botões de hoje que vão para lá (do inventario.json)."""
import json, os, base64, html
from playwright.sync_api import sync_playwright
AQ = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(AQ, 'inventario.json')))
def crop(i, t=None):
    g = d[i]; ex = [e for e in g['ex'] if (t is None or e[1] == t)]  # sem foto daquele texto: não mostra a foto de outro
    return ('data:image/png;base64,' + base64.b64encode(open(ex[0][0], 'rb').read()).decode()) if ex else ''
V = '#8d3a69'
CSS = ('body{font:14px/1.45 Inter,system-ui,sans-serif;margin:32px;color:#141414;width:1700px}h1{font:600 30px Georgia,serif;margin:0 0 4px}.sub{color:#6b6763;margin:0 0 24px;max-width:1200px}'
       'table{border-collapse:collapse;width:100%}th{text-align:left;font:600 13px Inter;color:#6b6763;letter-spacing:.06em;padding:8px 12px;border-bottom:2px solid #141414;vertical-align:bottom}'
       'th small{display:block;font-weight:400;letter-spacing:0;color:#6b6763;margin-top:2px}td{vertical-align:top;padding:16px 12px;border-bottom:1px solid #e6e1db;width:24%}'
       'td.papel{width:10%;font:600 20px Georgia,serif}td.papel small{display:block;font:400 12px Inter;color:#6b6763;margin-top:4px}'
       '.n{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;font-family:Inter,sans-serif;font-weight:500;white-space:nowrap}'
       '.g{height:48px;font-size:16px;width:100%;max-width:340px}.m{height:48px;font-size:16px;padding:0 24px}.c{height:32px;font-size:14px;padding:0 14px}'
       '.p{background:#141414;color:#fff}.pv{background:' + V + ';color:#fff}.s{border:1px solid #141414;color:#141414}.x{background:#b3261e;color:#fff}'
       '.l{color:#141414;font-size:15px;height:44px;padding:0}.lx{color:#b3261e;font-size:15px;height:44px;padding:0}'
       '.hj{margin-top:12px;font-size:12px;color:#6b6763}.hj b{color:#141414;font-weight:500}.hj img{display:block;max-width:300px;max-height:56px;margin:6px 0 2px;border:1px solid #eee;border-radius:6px}'
       '.vazio{color:#c9c3bc;font-size:12px}.marca{background:#faf8f6;border-radius:12px;padding:16px 20px;margin-top:24px;display:grid;grid-template-columns:240px 1fr;gap:24px;align-items:center}'
       '.reg{margin-top:28px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.reg div{background:#faf8f6;border-radius:12px;padding:16px 20px}.reg b{display:block;font:600 15px Georgia,serif;margin-bottom:6px}')
def hoje(itens):
    return ''.join('<div class=hj><b>%s</b> · %s%s</div>' % (html.escape(t), html.escape(tela), '<img src="%s">' % crop(i, t) if i is not None else '') for i, t, tela in itens)
COL = [('GRANDE', 'fim de um caminho · largura toda · 48 px'), ('MÉDIO', 'no meio da tela · largura do texto · 48 px'), ('COMPACTO', 'dentro de uma linha ou cartão · 32 px')]
LIN = [
 ('Principal', 'a ação da tela · preto cheio · uma por tela · VINHO só para pagar',
  ['<b style="font-size:12px;color:' + V + '">VINHO · CAMINHO DO DINHEIRO</b><br><span class="n pv g">Comprar · R$ 95</span>' + hoje([(16, 'Comprar · R$ 95', 'Peça'), (27, 'Prosseguir com o pagamento', 'Carrinho'), (23, 'Finalizar compra', 'Aviso adicionado')]) +
   '<br><b style="font-size:12px">PRETO · TODO O RESTO</b><br><span class="n p g">Iniciar sessão</span>' + hoje([(27, 'Iniciar sessão', 'Entrar'), (48, 'Salvar', 'Minha conta'), (41, 'Solicitar orçamento', 'Atacado'), (41, 'Receber o código', 'Portal do atacado'), (41, 'Quero estas · falar com a loja', 'Separado para você')]),
   '<span class="n p m">Começar</span>' + hoje([(34, 'Começar', 'Consulta do grau'), (35, 'Abrir a câmera', 'Formato do rosto')]),
   '<span class="n p c">Comparar</span>' + hoje([(38, 'Comparar', 'barra do Comparar'), (39, 'Ver este modelo', 'cartão do Comparar')])]),
 ('Secundário', 'a outra saída · contorno preto fino',
  ['<span class="n s g">Sair da conta</span>' + hoje([(50, 'Sair da conta', 'Minha conta')]),
   '<span class="n s m">Ver modelo</span>' + hoje([(1, 'Ver modelo', 'Destaque do Início'), (33, 'Abrir no Google Maps', 'Mapa'), (53, 'Precisa de ajuda? Fale com a loja', 'Pagar pedido')]),
   '<span class="n s c">Sincronizar</span>' + hoje([(49, 'Sincronizar', 'Minha conta · Conta do Google'), (28, 'Copiar', 'Pagar pedido · código PIX')])]),
 ('Link', 'ir ou voltar · só texto preto · um tamanho',
  ['<span class=vazio>—</span>',
   '<span class="n l">Ver catálogo ›</span><br><span class="n l">‹ Início</span>' + hoje([(2, 'Ver catálogo ›', 'Início'), (4, 'Ver todos ›', 'Início'), (8, 'Filtros ›', 'Catálogo'), (11, 'Como chegar ›', 'rodapé'), (14, 'Início', 'barra de voltar'), (28, 'Esqueci minha senha', 'Entrar'), (2, 'Continuar comprando', 'Carrinho')]),
   '<span class=vazio>— (dentro de uma frase o link fica sublinhado: "aceita os <u style="color:#141414">Termos e Condições</u>")</span>' + hoje([(54, 'Termos e Condições', 'Pagar pedido')])]),
 ('Perigo', 'o que não volta · vermelho',
  ['<span class="n x g">Cancelar pedido</span><br><span class="n l">Voltar</span>' + hoje([(56, 'Cancelar pedido', 'Aviso de cancelar'), (55, 'Voltar', 'Aviso de cancelar (vira link)')]),
   '<span class=vazio>—</span>',
   '<span class="n lx">Excluir minha conta</span>' + hoje([(51, 'Excluir minha conta', 'Minha conta')])]),
]
H = ['<!doctype html><meta charset=utf-8><style>' + CSS + '</style><h1>Família de botões · v3</h1>',
     '<p class=sub><b>Preto no dia a dia, vinho só no caminho do dinheiro</b> (Comprar · Prosseguir com o pagamento · Finalizar compra) — como as marcas de luxo do estudo (Madë, Gentle Monster, Jacques Marie Mage: botão preto); a cor da marca aparece pouco e por isso pesa. Nos eventos, os botões vinho ganham a cor do evento. Papel (o que o botão faz) × tamanho (onde ele está). O tamanho Compacto existe para não quebrar as ações que moram dentro de uma linha ou de um cartão, como o "Sincronizar" da Conta do Google e o "Copiar" do código PIX. '
     'Embaixo de cada botão novo, os botões de hoje que vão para aquela casa (texto · tela · foto de hoje).</p><table><tr><th></th>' +
     ''.join('<th>%s<small>%s</small></th>' % c for c in COL) + '</tr>']
for papel, sub, cel in LIN:
    H.append('<tr><td class=papel>%s<small>%s</small></td>%s</tr>' % (papel, sub, ''.join('<td>%s</td>' % c for c in cel)))
H.append('</table><div class=marca><div><b style="font:600 18px Georgia,serif">Marca · não muda</b><br><span class=c style="color:#6b6763">o desenho é da outra empresa</span></div><div>'
         + hoje([(29, 'Continuar com Google', 'Entrar')]) + '<p class=hj>O Google exige o botão dele (fundo branco, "G" colorido). Fica como está, em pílula, 48 px, alinhado com os nossos.</p></div></div>')
H.append('<div class=reg><div><b>Uma regra num lugar só</b>4 papéis × 3 tamanhos = classes num bloco do CSS (.b-p/.b-s/.b-l/.b-x + .b-g/.b-m/.b-c). Saem os estilos soltos (verdes, degradês, cantos 12/14, ícone dentro).</div>'
         '<div><b>O que pode ir dentro</b>Texto, e um valor quando ajuda a decidir ("Comprar · R$ 95"). Ícone só na Marca. Nos eventos, só os 3 vinho viram a cor do evento; o vinho segue na marca (logo, Ofertas, destaques), não no botão comum.</div>'
         '<div><b>Estados iguais em todos</b>Carregando (o texto vira "…" no mesmo tamanho), desativado (40% de opacidade), apertado (escurece 8%). Área de toque mínima 44 px — o Compacto ganha a área por fora.</div></div>')
open(os.path.join(AQ, 'prancha3.html'), 'w').write(''.join(H))
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1764, 'height': 900}); pg.goto('file://' + os.path.join(AQ, 'prancha3.html')); pg.wait_for_timeout(500)
    pg.screenshot(path='/tmp/p9.png', full_page=True); b.close()
from PIL import Image; Image.open('/tmp/p9.png').convert('RGB').save(os.path.join(AQ, 'esboco-09c-familia-botoes.jpg'), quality=86)
print('ok')
