"""IDEIAS 18 — início inteiro (dono 26/11 15:25: "me faz a página inteira sem ser por partes"; fotos da internet só como desenho).
Base: o site real (kit) + aprovado em espírito: capa de tela inteira (17b). Estudos: 16-padrao-luxo/ESTUDO.md §7–§10.
Fotos de desenho: recortes do vídeo da Made que o dono mandou (desenho/), café e estúdio do Semp. Masculino: sem foto ainda."""
import base64, io, os, subprocess
from PIL import Image
AQ = os.path.dirname(os.path.abspath(__file__)); I17 = os.path.join(AQ, '../17-inicio-modelos')
def b64(p, w=800):
    im = Image.open(p).convert('RGB'); im.thumbnail((w, 3000)); b = io.BytesIO(); im.save(b, 'JPEG', quality=84)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
F = {k: b64(os.path.join(I17, 'desenho', k + '.jpg')) for k in ['grupo', 'lanc', 'maisv', 'retrato', 'video', 'design', 'conforto', 'elas']}
import re as _re
_P = {m.group(1): {'nome': m.group(2), 'n': int(m.group(3)), 'mat': m.group(4).lower(), 'foto': m.group(5), 'cor': m.group(6)} for m in _re.finditer(r"ref:'(\w+)',gen:'\w',nome:'([^']*)'.*?n:(\d+).*?mat:'([^']*)'.*?foto:'([^']*)'.*?cores:\['([^']*)'", open(os.path.join(AQ, '../../kit/pecas-teste.js')).read())}
from PIL import ImageChops
def peca(path, W=900, H=600, larg=0.86):
    '''Normaliza a foto da peça: recorta o branco em volta, centraliza e põe todas na MESMA escala (a peça ocupa 86% da largura).
    Na loja isto é feito uma vez, ao subir a foto (Titan/catálogo) — um lugar só, vale para todas as telas.'''
    im = Image.open('/tmp/kitsite' + path).convert('RGB'); bg = Image.new('RGB', im.size, (255, 255, 255))
    bb = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 18 else 0).getbbox() or (0, 0, im.width, im.height)
    pc = im.crop(bb); esc = min(W * larg / pc.width, H * 0.80 / pc.height); pc = pc.resize((int(pc.width * esc), int(pc.height * esc)), Image.LANCZOS)
    m = ImageChops.difference(pc, Image.new('RGB', pc.size, (255, 255, 255))).convert('L').point(lambda v: 255 if v > 18 else 0)
    import numpy as _np; a = _np.asarray(m, dtype=float); cx = (a.sum(0) * _np.arange(a.shape[1])).sum() / max(a.sum(), 1)  # centro de massa
    x = int(W / 2 - cx); x = max(min(x, W - pc.width), 0) if pc.width <= W else (W - pc.width) // 2
    cv = Image.new('RGB', (W, H), (255, 255, 255)); cv.paste(pc, (x, (H - pc.height) // 2))
    b = io.BytesIO(); cv.save(b, 'JPEG', quality=86); return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
F['cafe'] = b64(os.path.join(I17, 'semp-cafe-campanha.jpg'), 900)
F.update({k: b64(os.path.join(I17, 'desenho/net', k + '.jpg')) for k in ['h_jaqueta', 'h_sol_branco', 'h_sueter', 's_lendo', 'loja_vitrine', 'h_barba', 's_celular', 'h_sol_couro', 't_selfie1', 't_le_livro']})  # fotos de desenho (Unsplash) — dono 17:13: homens e 45+ reais
R19 = os.path.join(AQ, '../19-personagens-formato/oculos-fino/rostos')
def png64(p): return 'data:image/png;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
F['logo'] = png64(os.path.join(AQ, 'logo-cor-oficial.png'))  # logo recolorido na cor oficial (CMYK C47 M91 Y29 K8 = #943D6F)
F['visto'] = b64(os.path.join(AQ, 'semp/visto-modelo-SL2290-rosto.jpg'), 900)  # Flow (v33): o mesmo modelo usando a peça REAL do catálogo SL2290 (foto do catálogo enviada ao Flow); ao lado, a mesma peça
F['lucien'] = b64(os.path.join(AQ, 'semp/SL2290-catalogo-justo.jpg'), 900)  # v40: a peça de estúdio no branco da folha (o branco da foto é o da folha); em três-quartos quando o Flow liberar
JS = r"""(()=>{const F=__F__, P=__P__, PF=__PF__;
const css = `
/* família de cor (dono 26/11 22:17): UMA cor de destaque, a oficial da loja (CMYK C47 M91 Y29 K8 = #943D6F), num lugar só — logo, links, itálicos, botões e detalhes.
   As temáticas de evento ([data-ev]) continuam com as cores delas. */
:root:not([data-ev]){--ac:#943d6f;--ac2:#943d6f;--logo:url(${F.logo})}
#hdst{display:none!important}
main > .wrap{min-width:0;max-width:100%}#home{min-width:0}  /* as fileiras que deslizam não podem alargar a coluna (itens flex: min-width 0) */
.lfx-capa{position:relative;overflow:hidden;cursor:pointer;color:#fff}
.lfx-capa .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:42% 20%}
.lfx-capa .vt{position:absolute;left:0;right:0;top:0;height:36%;background:linear-gradient(#1f0d1788,#1f0d1700)}
.lfx-capa .vb{position:absolute;left:0;right:0;bottom:0;height:40%;background:linear-gradient(#1f0d1700,#1f0d17a6)}
.lfx-capa .cima{position:absolute;left:16px;right:16px;top:32px;text-align:center}
.lfx-capa .rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase}
.lfx-capa h1{font:500 32px/1.15 Fraunces,Georgia,serif;margin:8px 0 0;color:#fff}
.lfx-capa h1 em{color:#f6e3ec!important}
.lfx-capa .baixo{position:absolute;left:16px;right:16px;bottom:32px;text-align:center}
.lfx-capa p{font:15px/1.5 Inter,system-ui;margin:0 0 16px;text-wrap:balance}  /* quebra em linhas equilibradas: nenhuma palavra sozinha na última linha */
.lfx-capa{cursor:pointer}  /* v54 (dono 28/11 07:50): a capa INTEIRA leva à peça */
.lfx-capa .bt{display:inline-block;padding:12px 0 4px;border:0;border-bottom:1px solid currentColor;border-radius:0;font:400 15px/1 Inter,system-ui;letter-spacing:.02em}  /* convite discreto de revista: letra fina + linha fina embaixo (sai a pílula de botão); área de toque é a capa toda */
.lfx-capa .pts{display:flex;gap:16px;justify-content:center;margin-top:16px}.lfx-capa .pts i{width:8px;height:8px;border-radius:8px;background:#fff8}.lfx-capa .pts i.on{width:24px;background:#fff}
/* foto de campanha: inteira, arredondada como os cartões, só o nome por cima (ESTUDO §10) */
.lfx-ft{position:relative;display:block;border-radius:18px;overflow:hidden;color:#fff;text-decoration:none}
.lfx-ft img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lfx-ft .vb{position:absolute;left:0;right:0;bottom:0;height:50%;background:linear-gradient(#1f0d1700,#1f0d17b3)}
.lfx-ft b{position:absolute;left:16px;right:16px;bottom:16px;font:500 20px/1.2 Fraunces,Georgia,serif}
.lfx-ft small{display:block;font:13px/1.4 Inter,system-ui;opacity:.9;margin-top:4px}
.lfx-semp{position:absolute;inset:0;display:flex;align-items:flex-start;justify-content:center;text-align:center;padding:24px 16px;background:linear-gradient(135deg,#c99ab3,#8d5a77);color:#fff;font:600 12px/1.5 Inter,system-ui}
#home .lfx-gen{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:48px}
#home .lfx-gen .lfx-ft{aspect-ratio:3/4}
/* visto na foto (ESTUDO §16, §28): o modelo usa EXATAMENTE a peça da página ao lado */
/* v40 — LaFouch como revista, UMA página só (ESTUDO §29): retrato e peça moram na MESMA folha branca — o que está na mesma região se lê como uma coisa só.
   A foto sangra até as bordas de cima e dos lados da folha; embaixo, no branco da folha, a peça (o branco da foto de estúdio É o branco da folha: a sombra natural fica),
   o nome, a frase e uma linha com a cor e o preço. Sem sombra na folha: papel sobre a mesa. Sem legenda de crédito (repetia o nome). */
#home .lfx-vf{background:#fff;border-radius:18px;overflow:hidden}
#home .lfx-vf .ftv{aspect-ratio:4/5}
#home .lfx-vf .ftv img{width:100%;height:100%;object-fit:cover;display:block}
#home .lfx-vf .pag2{display:block;padding:32px 24px 48px;text-align:center;text-decoration:none;color:inherit}
#home .lfx-vf .pag2 img{width:88%;display:block;margin:0 auto}
#home .lfx-vf .pag2 h2{margin:24px 0 0!important;font:300 40px/1.1 'Fraunces Fina',Fraunces,Georgia,serif!important;letter-spacing:-.01em;color:#2a1f27}
#home .lfx-vf .pag2 .frase{display:block;margin-top:8px;font:300 17px/1.4 Inter,system-ui;color:#6b5a66}
#home .lfx-vf .pag2 small{display:block;margin-top:16px;font:400 14px/1.2 Inter,system-ui;color:#2a1f27;font-variant-numeric:tabular-nums}
#home .lfx-visto{display:flex;flex-direction:column}
#home .lfx-rot{font:600 12px Inter,system-ui;letter-spacing:.16em;text-transform:uppercase;color:var(--ac);text-align:center;margin:0 0 16px}
/* v5: preço embaixo do código (dono 17:32: o preço competia com a peça seguinte) */
/* CARTÃO DE PEÇA v4 (dono 17:22: "a reclamação está nos cartões dos produtos em si"):
   sem caixa, sem painel e sem borda — a peça pousa no próprio fundo rosé da página, com uma sombra de apoio suave embaixo (como numa vitrine);
   linha 1: código em Fraunces 18 à esquerda e preço preto à direita, na mesma linha de base (L2); linha 2: o detalhe (formato/material), cinza;
   linha 3: as cores em anéis de 12 px. "Última unidade" vira texto pequeno vinho, sem etiqueta sobre a foto. */
/* CARTÃO DE PEÇA v51 (ESTUDO §28–30; aprovados de 27/11): cada peça numa FOLHA branca — a foto de estúdio já é branca, então ela é o próprio papel
   (saem o multiply e a sombra desenhada embaixo, que flutuava sem chão). Texto do sistema aprovado: o NOME do Semp (Fraunces) e uma linha
   "Cor · preço" — a mesma linha do bloco do Lucien (um lugar só). Sem a descrição técnica ("Redonda rosa"); bolinhas de cor só quando há 2 cores ou mais. */
#home .hc{display:grid!important;grid-template-columns:1fr;align-items:start;background:#fff!important;border:0!important;border-radius:18px!important;overflow:hidden!important;padding:16px 16px 24px!important}
#home .hc .hci{grid-column:1/-1;margin:0 0 16px!important;background:transparent!important;overflow:visible!important;position:relative}
#home .hc .hci img{position:absolute!important;inset:0;width:100%!important;height:100%!important;max-height:none!important;object-fit:contain!important;transform:none!important}
#home .hc .hn{display:contents!important}
#home .hc .lfx-cod{grid-column:1;grid-row:2;font:500 18px/1.2 Fraunces,Georgia,serif;color:#2a1f27;min-width:0}
#home .hc .hds{display:none!important}
#home .hc .hp{grid-column:1;grid-row:3;padding:8px 0 0!important;font:400 14px/1.2 Inter,system-ui!important;color:#2a1f27;font-variant-numeric:tabular-nums;white-space:nowrap}
#home .hc .hsw{grid-column:1/-1;grid-row:4;padding:8px 0 0!important;display:flex;gap:8px}
#home .hc .hsw i{width:12px!important;height:12px!important;border-radius:50%;box-shadow:0 0 0 1px #fff,0 0 0 2px #d9c6d1}
/* v55 (dono 28/11 07:55): aviso discreto — tom secundário, letra normal; texto completo "Últimas N unidades" (dono 07:58: o que pesava era o estilo, não as palavras); a linha é RESERVADA em todo cartão, então a fileira fica sempre reta */
#home .hc{grid-template-rows:auto auto auto auto 1.3em}
#home .hc .ulin{position:static!important;grid-column:1/-1;grid-row:5;margin:4px 0 0!important;padding:0!important;background:none!important;font:400 12px/1.3 Inter,system-ui!important;color:#6b5a66!important}
#home .hc .hsw{grid-row:4}
#home .hc .ulin i{display:none}
/* uma linha só entre o bloco de novidades e o rodapé: o rodapé já começa com a linha dele, então a de baixo das novidades sai */
html.v5 body section.hnews.hn2{border-bottom:0!important}
/* novidades (v19, dono 22:04): momento calmo, só texto — sem a mancha borrada atrás, sem o 4º itálico; espaços na escala (48 · 24 · 16 · 8) */
html.v5 body section.hnews.hn2{background:none!important;margin:48px 0 0!important;padding:48px 0!important}  /* já está dentro das margens da página: sem margem lateral extra (com 16 o título quebrava no celular, L4) */
html.v5 body section.hnews.hn2 p{margin:8px auto 24px!important}
html.v5 body section.hnews.hn2 .nwb{padding:0 24px!important}
html.v5 body section.hnews.hn2 .nlk{margin-top:16px!important}
/* v20: o bloco de novidades já traz os 48 dele embaixo; o rodapé não soma outra margem (42) por cima — 48 em cima e 48 embaixo, simétrico */
html.v5 body section.hnews.hn2 + .lfft{margin-top:0!important}  /* botão dentro de bloco de texto: começa na margem do texto (um eixo por bloco, L1) */
/* peças GRANDES: carrossel de 1,25 por tela (acabou de chegar) e grade 2 × 2 (mais pedidos) */
/* NOVIDADES (v52, dono 28/11 07:17): 2 peças por bloco (PC: 4) e o cliente arrasta UM BLOCO de cada vez; pontinhos dizem em que bloco está.
   Um número só (--n = peças por bloco) decide a largura, o encaixe e os pontinhos. */
#home .hg.lfx-grande{--n:2;display:grid!important;grid-auto-flow:column;grid-auto-columns:calc((100% - (var(--n) - 1) * 16px) / var(--n));grid-template-columns:none!important;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain}
#home .hg.lfx-grande::-webkit-scrollbar{display:none}
#home .hg.lfx-grande > *{scroll-snap-align:none}
#home .hg.lfx-grande > :nth-child(2n+1){scroll-snap-align:start;scroll-snap-stop:always}
#home .hg.lfx-grande .hci{aspect-ratio:1/1!important;height:auto!important;width:100%!important}
#home .lfx-pts{display:flex;justify-content:center;gap:8px;margin-top:16px}
#home .lfx-pts i{width:6px;height:6px;border-radius:50%;background:#2a1f2733;transition:background .3s ease}#home .lfx-pts i.on{background:var(--ac)}
#home .hg.lfx-grande .hci img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important}
/* visto na foto: a peça em tamanho de vitrine, abaixo da foto */
/* para cada uso: mosaico de revista */
#home .lfx-rev{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
#home .lfx-rev .lfx-ft:first-child{grid-column:1/-1;aspect-ratio:4/5}#home .lfx-rev .lfx-ft{aspect-ratio:3/4}
#home .lfx-rev .lfx-ft:first-child b{font-size:28px}
/* para lojistas: cartão de campanha largo (mesma família .lfx-ft), texto centrado no véu */
/* celular (v18, dono 22:02): o MESMO cartão do PC, compacto — composição centrada e véu por igual; o que encolhe é o conteúdo (linha curta, título 24), não o cartão */
#home .lfx-loj{aspect-ratio:4/3;margin-top:48px}
#home .lfx-loj .vl{position:absolute;inset:0;background:#1f0d1799}
#home .lfx-loj .tx{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 24px}
#home .lfx-loj .tx b{position:static;font:500 24px/1.2 Fraunces,Georgia,serif}
#home .lfx-loj .tx small{font:15px/1.5 Inter,system-ui;opacity:.92;margin:8px 0 0;max-width:280px}
#home .lfx-loj .lg{display:none}
#home .lfx-loj .bt{margin-top:16px;display:inline-block;padding:12px 24px;border:1px solid #fff;border-radius:999px;font:500 15px Inter,system-ui}
/* em movimento */
#home .lfx-mov{display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;margin-right:-16px;padding-right:16px}
#home .lfx-mov > div{flex:0 0 calc((100% - 32px) / 2.2)}
#home .lfx-mov .lfx-semp{font-size:12px}
#home .lfx-mov .lfx-ft{aspect-ratio:9/16}
#home .lfx-mov .play{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px 0 0 -24px;border-radius:50%;background:#ffffffd9;display:flex;align-items:center;justify-content:center}
#home .lfx-mov .play:after{content:'';margin-left:4px;border-left:14px solid var(--ac);border-top:9px solid transparent;border-bottom:9px solid transparent}
#home .lfx-mov p{margin:8px 0 0;font:12px/1.4 Inter,system-ui;color:#6b5a66}#home .lfx-mov p b{display:block;color:#2a1f27;font:500 16px/1.2 Fraunces,Georgia,serif}
/* ferramentas (v47, dono 27/11 09:22–09:24): FAIXA COLADA embaixo da capa — a capa termina e a faixa começa, borda com borda, mesma largura, sem vão:
   o olho lê capa + faixa como UMA peça (ESTUDO §32: o choque vem da divisão, não da cor). Tinta escura: continua o véu de baixo da capa.
   Só as ferramentas (serviços são outra coisa e ficam embaixo, em texto). Ícones aprovados (v45) em tom claro; nome com "›" (leva a outra tela). */
html body .lfx-fers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));background:#2a1f27;padding:24px 16px}
html body .lfx-fer2{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 8px;text-decoration:none}
html body .lfx-fer2 + .lfx-fer2{border-left:1px solid #ffffff1f}
html body .lfx-fer2 svg{width:56px;height:40px;flex:none;color:#f1dbe6;margin-bottom:16px}
html body .lfx-fer2 .t{display:flex;flex-direction:column;align-items:inherit}
html body .lfx-fer2 b{font:500 18px/1.2 Fraunces,Georgia,serif;color:#fff;white-space:nowrap}
html body .lfx-fer2 small{margin-top:4px;font:13px/1.4 Inter,system-ui;color:#ffffffb3;white-space:nowrap}
/* v48: os serviços entram na MESMA faixa, como segundo andar — linha fina, texto pequeno, sem ícone e sem "›" (informação, não ação); assim não sobra linha solta embaixo (§32) */
html body .lfx-fers .htr{grid-column:1/-1;margin:24px 0 0!important;padding:16px 0 0!important;border-top:1px solid #ffffff1f!important;background:none!important;color:#ffffffb3!important;font-size:12px!important}
html.v5 body .lfx-fers .htr b,html body .lfx-fers .htr span b{color:#fff!important;font-weight:500!important}
html body::after{content:"";display:block;height:88px}  /* v49: espaço no fim da página = botão (56) + 16 + 16 — quando a rolagem termina, nada fica embaixo do WhatsApp */
/* v48–v50: WhatsApp sempre no MESMO lugar, em todas as páginas (dono 09:46: "não fica feio se mover?"): redondo, 16 do canto de baixo à direita.
   Saem as regras do site que o subiam e encolhiam na página da peça (html.onprod …). Quem abre espaço é a barra de compra, não o botão (abaixo). */
html body a.wa:not(#lfx){z-index:2147483000!important;top:auto!important;bottom:16px!important;right:16px!important;left:auto!important;width:56px!important;height:56px!important;border-radius:50%!important;transform:none!important;translate:none!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 4px 16px #2a1f2733}  /* "sempre": hoje o site esconde o botão ao rolar (translate); sai — fica sempre visível */
/* PC (≥1024): a mesma página, organizada para tela larga — um eixo central de 1200, a mesma ordem e as mesmas peças.
   Cada bloco só troca a disposição: as fileiras viram grade (sem deslizar), a foto fica ao lado da peça. Um lugar só (este bloco) vale para todas as telas largas. */
@media (min-width:1024px){
#home{max-width:1200px;margin-left:auto;margin-right:auto}
#home .h2{font-size:32px}
.lfx-capa .cima{top:48px}.lfx-capa h1{font-size:48px}.lfx-capa .baixo{bottom:48px}.lfx-capa p{font-size:16px}
#home .lfx-gen{grid-template-columns:repeat(2,minmax(0,440px));justify-content:center;gap:24px}#home .lfx-gen .lfx-ft{aspect-ratio:4/5}  /* v46: retrato 4:5, o par centrado (cabeça inteira; antes o 4:3 cortava a cabeça e cada foto tinha meia página) */
#home .lfx-ft b{left:24px;right:24px;bottom:24px;font-size:24px}
#home .hg.lfx-grande{--n:4;gap:24px;grid-auto-columns:calc((100% - 3 * 24px) / 4)}  /* PC: 4 por bloco, mesmo arrastar por bloco */
#home .hg.lfx-grande > :nth-child(2n+1){scroll-snap-align:none}#home .hg.lfx-grande > :nth-child(4n+1){scroll-snap-align:start;scroll-snap-stop:always}
#home .hg.lfx-grande .hci{aspect-ratio:4/3!important}
/* PC (v40): a mesma folha deitada — o retrato sangra na metade esquerda, a peça e o nome no branco da direita, no meio da altura. */
#home .lfx-vf{display:grid;grid-template-columns:1fr 1fr;align-items:center}
#home .lfx-vf .pag2{padding:48px}
#home .lfx-vf .pag2 img{width:80%}
#home .lfx-vf .pag2 h2{margin-top:32px!important;font-size:64px!important}#home .lfx-vf .pag2 .frase{font-size:24px}
#home .lfx-rev{grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
#home .lfx-rev .lfx-ft:first-child{grid-column:auto;aspect-ratio:3/4}#home .lfx-rev .lfx-ft:first-child b{font-size:24px}
#home .lfx-mov{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;overflow:visible;margin-right:0;padding-right:0}
#home .lfx-mov > div{flex:none}
html body .lfx-fers{grid-template-columns:repeat(2,minmax(0,360px));justify-content:center;padding:32px 0 16px}
html body .lfx-fers .htr{font-size:13px!important}  /* PC: o par centrado na faixa, cada um pelo tamanho do conteúdo */
html body .lfx-fer2{flex-direction:row;justify-content:center;align-items:center;gap:24px;padding:0 32px;text-align:left}html body .lfx-fer2 svg{margin:0}
html body .lfx-fer2 b{font-size:24px}html body .lfx-fer2 small{font-size:15px}
#home .lfx-loj{aspect-ratio:auto;height:360px}#home .lfx-loj .tx b{font-size:32px}#home .lfx-loj .tx small{max-width:440px;font-size:16px}#home .lfx-loj .bt{margin-top:24px}#home .lfx-loj .lg{display:inline}#home .lfx-loj .ct{display:none}
}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
const H = document.getElementById('home'), $ = s => H.querySelector(s), $$ = s => [...H.querySelectorAll(s)];
const mk = h => { const t = document.createElement('div'); t.innerHTML = h.trim(); return t.firstChild; };
const ft = (src, nome, sub, mf) => `<a class=lfx-ft href="#vitrine"${mf ? ` data-mf="${mf}"` : ''}>${src ? `<img src="${src}" alt="">` : `<span class=lfx-semp>FOTO DO SEMP<br>modelo masculino</span>`}<span class=vb></span><b>${nome}${sub ? `<small>${sub}</small>` : ''}</b></a>`;
/* 1. capa */
const d = $('#hdst'), cod = d.querySelector('[data-open]') ? d.querySelector('[data-open]').dataset.open : '';
const topH = document.querySelector('.top').getBoundingClientRect().height;
const cap = mk(`<section id=lfxcapa class=lfx-capa data-open="${cod}"><img class=bg src="${F.cafe}"><div class=vt></div><div class=vb></div><div class=cima><div class=rot>Destaque da semana</div><h1>Margaux</h1></div><div class=baixo><p>Leve como uma tarde sem pressa.</p><span class=bt>Ver a peça</span><div class=pts><i class=on></i><i></i><i></i><i></i></div></div></section>`);
const topW = document.querySelector('.top').getBoundingClientRect().width; let host = d;
while (host.parentElement && host.parentElement.getBoundingClientRect().width < topW - 1) host = host.parentElement;
host.parentElement.insertBefore(cap, host);
const tb = document.querySelector('.top').getBoundingClientRect().bottom, r = cap.getBoundingClientRect(), pp = getComputedStyle(cap.parentElement);
/* v23: a capa ocupa exatamente a tela visível menos o topo. O site usa zoom na letra, então vh/dvh do CSS não batem com a tela:
   a altura vem da tela real (innerHeight) e é refeita quando a barra do navegador do celular aparece/some ou a tela gira. */
const altCapa = () => { cap.style.height = '1000px'; const z = cap.getBoundingClientRect().height / 1000;  /* quanto 1 px do CSS vale na tela (zoom da letra) */
  cap.style.height = ((innerHeight - document.querySelector('.top').getBoundingClientRect().bottom) / z) + 'px'; };
addEventListener('resize', altCapa);
cap.style.cssText = `margin:${tb - r.top - scrollY}px ${-parseFloat(pp.paddingRight)}px 0 ${-parseFloat(pp.paddingLeft)}px`; altCapa();
/* 2. Feminino | Masculino (uma decisão; a escolha de gênero aparece UMA vez na página). v46: é GUIA (função), não revista: sem título de seção — as duas fotos
   com o nome e o "›" (leva a outro lugar, regra 16) já dizem tudo; sai o "Escolha o seu estilo" (a escolha não era de estilo, era para quem; e o itálico numa palavra só era enfeite) */
const hc = $('.hcat'), fotoTipo = {}; hc.querySelectorAll('a').forEach(a => { const m = (a.dataset.mf || '').split(':')[1]; fotoTipo[m] = a.querySelector('img').src; });
hc.previousElementSibling.remove();
hc.replaceWith(mk(`<div class=lfx-gen>${ft(F.lanc, 'Feminino ›', '', 'gen:f')}${ft(F.h_jaqueta, 'Masculino ›', '', 'gen:m')}</div>`));
/* 3. acabou de chegar: a peça GRANDE (1,25 por tela), sem botões extras */
const [sNov, sMv] = $$('.hsh.hsh1'), [gNov, gMv] = $$('.hg');
sNov.querySelector('h2').innerHTML = 'Novidades';  /* dono 28/11 07:17 */ sMv.querySelector('h2').innerHTML = 'Os mais pedidos';
sNov.style.marginTop = '48px'; gNov.classList.add('lfx-grande');
H.querySelectorAll('.hc .ulin').forEach(u => u.closest('.hc').appendChild(u));
/* nenhuma peça repete na página (dono 17:17); BR44145 fora (o dono não gosta dela) */
const VISTO = 'SL2290', TIPO = {solar: 'SL2305', grau: 'GR3345', armacao: 'BR44140'}, MAIS = ['SL2265', 'SL2285', 'SL2300'];
const base = gNov.children[0].cloneNode(true), preco = n => 'R$ ' + Math.round(n / 1050 / 5) * 5;
const cartao = ref => { const c = base.cloneNode(true), p = P[ref]; c.dataset.open = ref; c.querySelector('.hci img').src = p.foto; const u = c.querySelector('.ulin'); if (u) u.remove();
  c.querySelector('.hn').innerHTML = `<small class=hds>LaFouch · ${p.mat}</small>${ref}`; c.querySelector('.hsw').innerHTML = `<i style="background:${p.cor}"></i>`; c.querySelector('.hp').textContent = preco(p.n); return c; };
const pv = gNov.querySelector(`[data-open="${VISTO}"]`), d1 = pv ? {pr: (pv.innerText.match(/R\$\s?[\d.,]+/) || [''])[0]} : {pr: preco(P[VISTO].n)};
H.querySelectorAll('.hc[data-open="BR44145"],.hc[data-open="' + VISTO + '"],.hc[data-open="' + TIPO.grau + '"]').forEach(e => e.remove());
/* 4. visto na foto: foto grande e, logo abaixo e FORA dela, a peça em tamanho de vitrine */
const dados = c => { const ds = (c.querySelector('.hds') || {}).textContent || '', t = c.innerText, cod = (t.match(/[A-Z]{2}\d{3,5}/) || [''])[0], pr = (t.match(/R\$\s?[\d.,]+/) || [''])[0]; return {ds, cod, pr}; };

const visto = mk(`<div class=lfx-visto style="margin:48px 0 0">
  <div class=lfx-vf>
    <div class=ftv><img src="${F.visto}" alt="Lucien, âmbar"></div>
    <a class=pag2 href="#vitrine"><img src="${F.lucien}" alt="Lucien, âmbar"><h2 class=h2>Lucien</h2><span class=frase>Sol no rosto, calma no olhar.</span><small>Âmbar · ${preco(P[VISTO].n)}</small></a>
  </div></div>`);
gNov.after(visto);
/* 5. para cada uso = capa de revista (dono 17:32): mosaico 1 grande + 2, a foto de quem usa aquele tipo; nome e linha curta por cima, no véu */
const tipos = mk(`<div style="margin-top:48px"><div class=hsh><h2 class=h2>Para cada uso</h2></div><div class=lfx-rev>${ft(F.design, 'Solar', '', 'tipo:solar')}${ft(F.s_celular, 'Leitura', '', 'tipo:grau')}${ft(F.h_sueter, 'Armações', '', 'tipo:armacao')}</div></div>`);
visto.after(tipos);
/* 6. os mais pedidos: outro formato (grade 2 × 2 de peças grandes) — não repete o carrossel */
sMv.style.marginTop = '48px'; gMv.classList.add('lfx-grande');  /* v56 (dono 28/11 07:57): Os mais pedidos = mesma vitrine das Novidades — 2 por bloco, arrasta por bloco (a regra mora num lugar só: .lfx-grande) */
{ const o = gMv.children[0], ul = o.querySelector('.ulin'), nc = cartao(o.dataset.open); nc.querySelector('.hp').textContent = o.querySelector('.hp').textContent; if (ul) nc.appendChild(ul); o.replaceWith(nc); }  /* o 1º cartão também sai do mesmo molde */
MAIS.forEach(r => { if (gMv.children.length < 4) gMv.appendChild(cartao(r)); }); /* peças de teste: completa 4, sem repetir */
/* 7. como fica no rosto: mulheres e homens, de idades diferentes (vídeos do Semp) */
const mov = mk(`<div style="margin-top:48px"><div class=hsh><h2 class=h2>Como fica no <em>rosto</em></h2></div><div class=lfx-mov></div></div>`);
[[F.maisv, ''], [F.h_sol_branco, ''], [F.elas, ''], [F.h_sol_couro, '']].forEach(([s, ph], i) => { const c = gNov.children[i % gNov.children.length], q = dados(c);
  mov.querySelector('.lfx-mov').appendChild(mk(`<div><a class=lfx-ft href="#rosto">${s ? `<img src="${s}" alt="">` : `<span class=lfx-semp>FOTO DO SEMP<br>${ph}</span>`}<span class=play></span></a><p><b>${q.cod}</b>${q.pr}</p></div>`)); });
$('#hguia').before(mov);
/* 9. para lojistas (dono 21:54): um cartão de campanha largo, da mesma família das fotos da página — vitrine organizada (parceiro de loja, não depósito);
   um título só, uma linha e o botão contornado em branco (como o da capa). Sai o título de fora, o "PARA REVENDER" e o "Compre em quantidade". */
{ const ha = $('.hata'), tit = ha.previousElementSibling && ha.previousElementSibling.classList.contains('hsh') ? ha.previousElementSibling : null;
  const loj = mk(`<a class="lfx-ft lfx-loj" href="#atacado"><img src="${F.loja_vitrine}" alt=""><span class=vl></span><span class=tx><b>Para lojistas</b><small><span class=lg>Preços especiais para lojas e revendedores, com atendimento exclusivo.</span><span class=ct>Preços especiais e atendimento exclusivo para lojas.</span></small><span class=bt>Solicitar orçamento</span></span></a>`);
  ha.replaceWith(loj); if (tit) tit.remove(); }
/* 8. as duas ferramentas logo abaixo dos selos; a foto combina com quem usa (grau de leitura = 45+) */
const gu = $('.hgu.hcom');  /* na loja: os mesmos botões do site (provador = upgrade do "qual combina", teste de leitura) */
/* ferramentas (v42): ícone de traço + nome + uma linha, cada uma numa folha; os personagens ficam dentro das ferramentas */
const fer = mk(`<div class=lfx-fers>
  <a class=lfx-fer2 href="#rosto"><svg viewBox="0 0 28 20" fill="none" stroke="currentColor" stroke-width=".6" stroke-linecap="butt" stroke-linejoin="miter"><path d="M1 5V1h4.5M23 1h4v4M27 15v4h-4.5M5.5 19H1v-4"/><circle cx="9.7" cy="10.6" r="3.5"/><circle cx="18.3" cy="10.6" r="3.5"/><path d="M13.2 10.2q.8-1.1 1.6 0M4.6 10.2h1.6M21.8 10.2h1.6"/></svg><span class=t><b>Provador virtual ›</b><small>Pela câmera do celular</small></span></a>
  <a class=lfx-fer2 href="#grau"><svg viewBox="0 0 28 20" fill="none" stroke="currentColor" stroke-width=".6" stroke-linecap="butt" stroke-linejoin="miter"><circle cx="9.7" cy="5" r="3.5"/><circle cx="18.3" cy="5" r="3.5"/><path d="M13.2 4.6q.8-1.1 1.6 0M4.6 4.6h1.6M21.8 4.6h1.6M5 12h18M8 15.5h12M11 19h6"/></svg><span class=t><b>Teste de leitura ›</b><small>Grau para ler de perto</small></span></a></div>`);
cap.after(fer); fer.style.marginLeft = cap.style.marginLeft; fer.style.marginRight = cap.style.marginRight;  /* mesma largura da capa, lida da própria capa (um lugar só) */
fer.appendChild($('.htr'));  /* serviços no 2º andar da faixa */
/* v44: serviços só em texto — o texto já diz tudo, o ícone era enfeite (ESTUDO §24/§31); rótulo em tinta, não em vinho (vinho = ação, regra 17) */
document.querySelectorAll('.htr svg').forEach(e => e.remove()); $('#hguia').remove(); gu.remove();
$('.hsh').style.marginTop = '48px';  /* 48 entre o bloco de serviços e o primeiro título */
const det = n => { const t = n.replace(/^(Armação|Solar|Óculos de leitura)\s*/i, ''); return t.charAt(0).toUpperCase() + t.slice(1); };
H.querySelectorAll('.hc').forEach(c => { const r = c.dataset.open; if (PF[r]) c.querySelector('.hci img').src = PF[r]; const d = c.querySelector('.hds'); if (d && P[r]) { d.textContent = det(P[r].nome); d.dataset.f = d.textContent; } });
/* código num elemento próprio: código e preço na mesma linha de base (L2), em todos os cartões (inclusive os montados acima) */
H.querySelectorAll('.hc .hn').forEach(hn => { [...hn.childNodes].forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) { const b = document.createElement('span'); b.className = 'lfx-cod'; b.textContent = n.textContent.trim(); n.replaceWith(b); } }); });
/* v51: nome do Semp + cor (método §28: uma palavra, material precioso, quase igual em pt/es) — PROVISÓRIOS (produtos de teste); no site virão do cadastro */
{ const SEMP = {AC1055:['Céleste','Rosé'], GR3340:['Bastien','Ônix'], GR3350:['Clémence','Cristal'], SL2250:['Sabine','Ouro'], SL2255:['Marceau','Grafite'], SL2260:['Juliette','Ônix'],
    AC1050:['Élise','Ametista'], SL2265:['Colette','Pérola'], SL2285:['Rémy','Ônix'], SL2300:['Inès','Conhaque']};
  H.querySelectorAll('.hc[data-open]').forEach(c => { const n = SEMP[c.dataset.open]; if (!n) return; const k = c.querySelector('.lfx-cod'), p = c.querySelector('.hp');
    if (k) k.textContent = n[0]; if (p && !p.dataset.cor) { p.textContent = n[1] + ' · ' + p.textContent; p.dataset.cor = 1; }
    const sw = c.querySelector('.hsw'); if (sw && sw.children.length < 2) sw.remove(); }); }
/* pontinhos dos blocos de cada vitrine (Novidades, Os mais pedidos): quantos blocos = peças ÷ --n (lido do CSS, um lugar só) */
document.querySelectorAll('#home .hg.lfx-grande').forEach(g => { const pts = document.createElement('div'); pts.className = 'lfx-pts'; g.after(pts);
  const monta = () => { const n = +getComputedStyle(g).getPropertyValue('--n') || 2, q = Math.ceil(g.children.length / n); pts.innerHTML = q > 1 ? '<i></i>'.repeat(q) : ''; marca(); };  /* um bloco só: sem pontinho */
  const marca = () => { const i = Math.round(g.scrollLeft / g.clientWidth); [...pts.children].forEach((e, j) => e.classList.toggle('on', j === i)); };
  g.addEventListener('scroll', marca, { passive: true }); addEventListener('resize', monta); monta(); });
{ const em = document.querySelector('.hnews h2 em'); if (em) em.replaceWith(em.textContent); }  /* itálico só na capa e em rosto */
return 'ok'})()"""
open(os.path.join(AQ, 'proposta.js'), 'w').write(JS.replace('__F__', __import__('json').dumps(F)).replace('__P__', __import__('json').dumps(_P)).replace('__PF__', __import__('json').dumps({r: peca(p['foto']) for r, p in _P.items()})))
