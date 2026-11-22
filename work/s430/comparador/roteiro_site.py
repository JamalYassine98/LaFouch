"""ROTEIRO DO SITE — a lista única das telas que o comparador (e o Argus, que roda o comparador) abre em cada conferência.
Plano das ferramentas, parte 1 (aprovado pelo dono em 22/11/2026 02:22): o comparador olha TODAS as telas, não só Início, Catálogo e Peça.
Tela nova no site = linha nova aqui, no mesmo passo (a prova "roteiro cobre as telas" do Argus reprova se faltar).

Cada tela: nome, endereço (depois do domínio), passos para chegar nela, aparelhos (None = todos; 'cp' = celular e PC) e se é com a conta logada.
Passos: ('toca', seletor) · ('menu', href) · ('js', código) · ('escreve', texto) · ('espera', ms). O comparador espera um pouco depois de cada passo."""
import json
CONTA = {'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'pais': 'py', 'nac': 'py', 'doc': '1234567',
         'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle Los Lapachos 123', 'ref': 'portão verde'}]}
AUTH = {'uid': 'kit', 'idToken': 'kit', 'refresh': 'kit', 'exp': 9e15, 'ev': True, 'email': 'maria@exemplo.com'}
PED = [{'id': 'PEDT1', 'cod': 'A1B2', 'tel': '+595983000000', 'est': 'pago', 'tok': 'LF-T', 'ts': 1795000000000, 'total': 95000, 'brl': 95, 'pag': 'pix', 'ent': 'loja', 'itens': [{'ref': 'GR3340', 'nome': 'Armação', 'q': 1, 'cor': ''}]},
       {'id': 'PEDT2', 'cod': 'C3D4', 'tel': '+595983000000', 'est': 'pagar', 'ts': 1795000000000, 'total': 95000, 'brl': 95, 'pag': 'alias', 'ent': 'delivery', 'itens': [{'ref': 'GR3340', 'nome': 'Armação', 'q': 1, 'cor': ''}]}]
LOGADA = "try{localStorage.setItem('lf_conta',%s);localStorage.setItem('lf_auth',%s);localStorage.setItem('lf_ped',%s)}catch(e){}" % tuple(json.dumps(json.dumps(x)) for x in (CONTA, AUTH, PED))
ARM = '/?cliente=1&r=armazones'   # catálogo das armações (sempre tem peças)
CARD = lambda i: ('js', "(()=>{const e=[...document.querySelectorAll('#grid .card .open')].filter(e=>e.offsetParent)[%d];e&&e.click()})()" % i)
PECA = [CARD(0)]
CONTA_ABRE = [('toca', '#contabtn')]
TELAS = [
    # as 3 de sempre, em todos os aparelhos (celular, celular com letra 1,2×, tablet, PC)
    {'nome': 'Início', 'q': '/?cliente=1', 'passos': []},
    {'nome': 'Catálogo', 'q': '/?cliente=1&r=armazones', 'passos': []},
    {'nome': 'Peça', 'q': '/?cliente=1&r=armazones', 'passos': [('toca', '#grid .card .open')]},
    # as que abrem por cima e as telas de menu (celular e PC)
    {'nome': 'Menu', 'q': '/?cliente=1', 'passos': [('toca', '#mnb')], 'ap': 'cp'},
    {'nome': 'Busca', 'q': '/?cliente=1', 'passos': [('toca', '#sbtn'), ('escreve', 'sol')], 'ap': 'cp'},
    {'nome': 'Filtros', 'q': ARM, 'passos': [('toca', '#vscr [data-lffil]')], 'ap': 'cp'},
    {'nome': 'Aviso adicionado', 'q': ARM, 'passos': PECA + [('toca', '#layer [data-addm]')], 'ap': 'cp'},
    {'nome': 'Carrinho', 'q': ARM, 'passos': PECA + [('toca', '#layer [data-addm]'), ('toca', '[data-cadfin]')], 'ap': 'cp'},
    {'nome': 'Entrar', 'q': '/?cliente=1', 'passos': CONTA_ABRE, 'ap': 'cp'},
    {'nome': 'Mapa', 'q': '/?cliente=1', 'passos': [('js', "(()=>{const b=document.createElement('a');b.className='mp';b.href='#';document.body.appendChild(b);b.click();b.remove()})()")], 'ap': 'cp'},
    {'nome': 'Consulta do grau', 'q': '/?cliente=1', 'passos': [('toca', '#mnb'), ('toca', '#drw [data-gzopen]')], 'ap': 'cp'},
    {'nome': 'Formato do rosto', 'q': '/?cliente=1', 'passos': [('menu', '#rosto')], 'ap': 'cp'},
    {'nome': 'Janela da câmera', 'q': '/?cliente=1', 'passos': [('menu', '#rosto'), ('toca', '#rosto [data-fa]')], 'ap': 'cp'},
    {'nome': 'Comparar', 'q': ARM, 'passos': [CARD(0), ('toca', '#layer [data-cmp]'), ('js', 'history.back()'), CARD(1), ('toca', '#layer [data-cmp]'), ('toca', '[data-cmpopen]')], 'ap': 'cp'},
    {'nome': 'Atacado', 'q': '/?cliente=1', 'passos': [('menu', '#atacado')], 'ap': 'cp'},
    {'nome': 'Portal do atacado', 'q': '/?cliente=1&c=TESTE123', 'passos': [('espera', 1500)], 'ap': 'cp'},
    {'nome': 'Separado para você', 'q': '/?cliente=1&s=SL2250.GR3340.AC1050&n=Maria', 'passos': [('espera', 1500)], 'ap': 'cp'},
    {'nome': 'Ajuda', 'q': '/?cliente=1', 'passos': [('menu', '#como')], 'ap': 'cp'},
    # com a conta logada
    {'nome': 'Minha conta', 'q': '/?cliente=1', 'passos': CONTA_ABRE, 'ap': 'cp', 'logada': True},
    {'nome': 'Meus pedidos', 'q': '/?cliente=1', 'passos': CONTA_ABRE + [('toca', '[data-cta=mcaba][data-a=peds]')], 'ap': 'cp', 'logada': True},
    {'nome': 'Pagar pedido', 'q': '/?cliente=1', 'passos': CONTA_ABRE + [('toca', '[data-cta=mcaba][data-a=peds]'), ('toca', '[data-cta=ped][data-id=PEDT2]')], 'ap': 'cp', 'logada': True},
    {'nome': 'Aviso de cancelar', 'q': '/?cliente=1', 'passos': CONTA_ABRE + [('toca', '[data-cta=mcaba][data-a=peds]'), ('toca', '[data-cta=pkcanc]')], 'ap': 'cp', 'logada': True},
]
# a nuvem imitada (igual nas duas versões): o que a tela mostra não depende da hora nem da internet
NUVEM = '{"ok":true,"cupons":[],"tok":"LF-T","exp":9e15,"agora":0,"aparelhos":[],"pedidos":[]}'


def vai(pg, url, tela):
    """abre a tela no navegador: endereço + passos (UM jeito só, usado pelo comparador e pela prova do medidor)"""
    pg.goto(url + tela['q'], wait_until='load')
    pg.wait_for_timeout(5500)
    for k, v in tela['passos']:
        if k == 'toca': pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.offsetParent)||document.querySelector(s);e&&e.click()}", v)
        elif k == 'menu': pg.evaluate("h=>{document.querySelector('#mnb').click();setTimeout(()=>{const e=document.querySelector('#drw a[href=\"'+h+'\"]');e&&e.click()},700)}", v); pg.wait_for_timeout(700)
        elif k == 'js': pg.evaluate(v)
        elif k == 'escreve': pg.keyboard.type(v)
        pg.wait_for_timeout(v if k == 'espera' else 1500)
