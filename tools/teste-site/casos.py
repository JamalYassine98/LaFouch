# S414: casos dos esboços 120 (faixa da temática) e 122 (alinhamento da peça / topo com letra maior).
import json
CFG = lambda t: json.dumps({"ativo": True, "evento": {"tema": t, "ini": 0, "fim": 0}}) if t else ''
# (nome, tema, letra do site, botão a tocar)
CASOS = [
    ('carrinho-natal', 'natal', '0', '#bagbtn'),
    ('conta-natal', 'natal', '0', '#contabtn'),
    ('peca-natal', 'natal', '0', '#home .hc'),
    ('peca', '', '0', '#home .hc'),
    ('peca-letra2', '', '2', '#home .hc'),
    ('inicio-letra2', '', '2', None),
]
import os
if os.environ.get('LF_CASOS'):  # S424: casos de outro esboço (arquivo json [[nome, tema, letra, alvo], ...])
    CASOS = [tuple(x) for x in json.load(open(os.environ['LF_CASOS'], encoding='utf-8'))]
def init_js(tema, letra):
    js = "try{sessionStorage.setItem('lf_ni','1');localStorage.setItem('lf_lang','pt');localStorage.setItem('lf_zoom','%s');" % letra
    js += ("localStorage.setItem('lf_cfg',%s);" % json.dumps(CFG(tema))) if tema else "localStorage.removeItem('lf_cfg');"
    return js + "}catch(e){}"
