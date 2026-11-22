"""IDEIAS 05 · v3 (dono 22/11 12:01): as camadas acompanham a temática.
Regra: a camada é a continuação do topo — usa o MESMO fundo do topo do tema (cor + desenho de pontinhos) e as cores do tema.
Temas claros (natal, halloween, mães, pais, ano-novo dia): fundo do tema com o desenho; textos e destaque do tema.
Temas escuros (Black Friday, ano-novo noite): camada escura como o topo; as variáveis de texto/linha/cartão mudam DENTRO da camada.
Nada de cor fixa dentro da camada: o "Ofertas" do menu passa a usar a cor de ação do tema (hoje é #c0392b fixo).
Pintura em /tmp/a5d (:8726) = v2 + esta camada de tema.
Uso: python3 tema.py copia → (servidor :8726) → python3 tema.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import video as V, video2 as V2

C = "#drw .dpn,#sov .sopn,#layer>.scrim.pg"
def claro(t, cor, ponto, tam):
    return "html[data-ev=%s] :is(%s){background:radial-gradient(circle,%s 1.5px,transparent 2px) 0 0/%s %s,%s!important}" % (t, C, ponto, tam, tam, cor)
def escuro(t, fundo, pn, tx, mu, ln, ac):
    return ("html[data-ev=%s] :is(%s){--bg:%s;--pn:%s;--tx:%s;--mu:%s;--ln:%s;--ln2:%s;--ac:%s;--act:%s;color-scheme:dark;background:%s!important;color:%s}" % (t, C, fundo, pn, tx, mu, ln, ln, ac, ac, fundo, tx))
CSS = ''.join([
    claro('natal', '#f7f2ea', '#1f5c3a14', '34px'), claro('halloween', '#f7f2f9', '#4a2a5e12', '34px'),
    claro('maes', '#fcf5f7', '#b8436f12', '34px'), claro('pais', '#f3f5f8', '#1e2f4d12', '34px'),
    "html[data-ev=anonovo-d] :is(%s){background:radial-gradient(circle,#b8975a1f 1px,transparent 1.6px) 0 0/46px 46px,#fff!important}" % C,
    escuro('bf', '#0a0a0a', '#161616', '#ffffff', '#a3a3a3', '#ffffff1f', '#ff3b5c'),
    escuro('anonovo-n', '#16213a', '#1d2a47', '#ffffff', '#b9c0d0', '#ffffff1f', '#d9bd84'),
    # dentro da camada, nada de cor fixa: tudo pelas variáveis
    "#drw nav.dnv>a.dof{color:var(--act,var(--ac))!important}",
    ":is(%s) :is(input,.sofld){color:var(--tx)}#sov .sofld{background:color-mix(in srgb,var(--tx) 7%%,transparent)!important}" % C,
    ":is(%s) :is(h1,h2,h3,b,strong,a,button,small,span,label,p){border-color:var(--ln)}" % C,
])
PINTA3 = V2.PINTA2 + "\n/* PINTURA · IDEIAS 05 v3: camadas seguem a temática */\n(function(){var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s)})();\n" % CSS

if __name__ == '__main__':
    if 'copia' in sys.argv:
        V.copia('/tmp/a5d', PINTA3); raise SystemExit
