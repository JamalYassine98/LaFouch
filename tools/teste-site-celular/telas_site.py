# S422: telas do SITE no celular real. Cada item: (nome, rota depois de loja.html, preparo no localStorage, [passos em JS]).
import json, sys
CONTA = json.dumps({'nome': 'Maria González', 'email': 'maria@exemplo.com', 'tel': '+595 983 000 000', 'nac': 'py', 'doc': '1234567', 'ends': [{'nome': 'Casa', 'cidade': 'Ciudad del Este', 'dep': 'Alto Paraná', 'end': 'Calle 1', 'ref': ''}]})
LOG = "localStorage.setItem('lf_conta',%s);" % json.dumps(CONTA)
CL = lambda s: "()=>{const e=[...document.querySelectorAll(%r)].filter(x=>x.getBoundingClientRect().height)[0];e&&e.click();return !!e}" % s
ROLA = lambda f: "()=>{scrollTo(0,innerHeight*%s);return 1}" % f
C = [
    ('inicio', '', '', []),
    ('inicio-meio', '', '', [ROLA('0.9')]),
    ('inicio-fim', '', '', ["()=>{scrollTo(0,document.scrollingElement.scrollHeight);return 1}"]),
    ('catalogo', '?r=armacoes', '', []),
    ('catalogo-rolado', '?r=armacoes', '', [ROLA('1.2')]),
    ('peca', '', '', [CL('#home [data-open],#grid [data-open]')]),
    ('carrinho', '', '', [CL('#bagbtn')]),
    ('menu', '', '', [CL('#mnb')]),
    ('busca', '', '', [CL('#sbtn')]),
    ('filtros', '?r=armacoes', '', [CL('#fbtn')]),
    ('conta-perfil', '', LOG, [CL('#contabtn')]),
    ('mochi', '', '', ["()=>{window.__lfGzAbre&&window.__lfGzAbre();return 1}"]),
    ('atacado', '#atacado', '', []),
    ('duvidas', '#duvidas', '', []),
    ('como-comprar', '#como', '', []),
    ('espanhol-inicio', '', "localStorage.setItem('lf_lang','es');", []),
    ('letra-maior', '', "localStorage.setItem('lf_zoom','2');", []),
]
if __name__ == '__main__':
    so = [x for x in (sys.argv[2] if len(sys.argv) > 2 else '').split(',') if x]
    json.dump([list(c) for c in C if not so or c[0] in so], open(sys.argv[1], 'w'), ensure_ascii=False)
