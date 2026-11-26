# ESBOÇO · SEMP no app — a base comum das telas (ESBOCO, 26/11/2026).
# O app REAL de hoje (o mesmo do Argus: work/argus/motor/abrir.py, montado do código do commit atual, loja de teste) e a proposta desenhada
# DENTRO da tela do Marketing do app (#v-mkt), com as cores, a letra e a barra do próprio app. Peças REAIS: as 17 do site (foto do Estúdio
# em catalogo/dados/f), nunca produto de exemplo. O comparador Hoje × Proposta é o do motor do Argus (planta.COLETA + compara.compara).
# Os desenhos de linha (TOP, T, LN…) são os mesmos dos esboços aprovados 70/72/73s (work/s435/selo/esboco_49.py + work/s435/semp/esboco_73s.py).
import os, sys, json, base64, io
A = '/home/claude/lafouch/work/argus'; sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, sim, planta, compara, familia
from PIL import Image, ImageDraw, ImageFont
O = os.path.dirname(os.path.abspath(__file__)) + '/'
F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', s)
CAT = '/home/claude/catalogo'
H = r"""const SEL=n=>'<i style="display:inline-block;min-width:20px;height:20px;border-radius:10px;background:#d33;color:#fff;font:normal 700 11px/20px system-ui;text-align:center;padding:0 5px;flex:none">'+n+'</i>';
const SV=p=>'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="flex:none">'+p+'</svg>';
const ROW=(ic,t,s,dir,n,ch)=>'<button type="button" style="display:flex;align-items:center;gap:16px;width:100%;min-height:64px;background:none;border:0;border-bottom:1px solid var(--line2);padding:10px 0;color:var(--fg);font:inherit;text-align:left">'+(ic?SV(ic):'')+'<span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:16px;font-weight:500">'+t+'</b>'+(s?'<small style="font-size:13px;color:var(--mute)">'+s+'</small>':'')+'</span>'+(dir||'')+(n?SEL(n):'')+'<i style="font-style:normal;font-size:20px;color:var(--mute);width:14px;text-align:center">'+(ch||'›')+'</i></button>';
const LBL=(t,d)=>'<div style="display:flex;justify-content:space-between;align-items:baseline;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin:32px 0 4px"><span>'+t+'</span>'+(d?'<span>'+d+'</span>':'')+'</div>';
const VAZIO=(ic,f,e)=>'<div style="text-align:center;padding:32px 16px"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-fg)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+ic+'</svg><b style="display:block;font-size:16px;margin:12px 0 4px">'+f+'</b><div style="color:var(--mute);font-size:14px;line-height:1.45">'+e+'</div></div>';
const TOP=(vs,t,s,mais)=>'<button type="button" class="nvVs"><i aria-hidden="true">‹</i>'+vs+'</button><div style="display:flex;align-items:center;justify-content:space-between;gap:16px"><h1 style="margin:0;font-family:var(--serif,Georgia,serif);font-weight:400;font-size:32px;line-height:44px">'+t+'</h1>'+(mais?'<button class="pl78" type="button" style="margin:0;flex:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>':'')+'</div>'+(s?'<div style="color:var(--mute);font-size:14px;margin-top:4px">'+s+'</div>':'');  // 22/11 13:09: o + redondo fica na LINHA DO TÍTULO, centro com centro (L2); o subtítulo vem embaixo
const ABAS=(L,on)=>'<div style="display:flex;gap:24px;border-bottom:1px solid var(--line2);margin:24px 0 8px">'+L.map((t,i)=>'<span style="padding:10px 0;font-size:15px;'+(i==on?'color:var(--fg);border-bottom:2px solid var(--accent);font-weight:600':'color:var(--mute)')+'">'+t+'</span>').join('')+'</div>';
const IC={msg:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',lote:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',tab:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',pes:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',av:'<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/>',env:'<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/>'};"""
IC3 = dict(post='<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="M20 15l-5-5L5 20"/>',
 story='<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 status='<circle cx="12" cy="12" r="9" stroke-dasharray="4 3"/>',
 carr='<rect x="6" y="5" width="12" height="14" rx="2"/><path d="M3 7v10M21 7v10"/>',
 video='<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
 rot='<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h5"/>',
 lista='<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
 env='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 tick='<path d="M4 9a2 2 0 0 0 0 6v3h16v-3a2 2 0 0 1 0-6V6H4z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
 ami='<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 2 6 5"/>',
 fiel='<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
 vip='<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 ev='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 res='<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>')
# As peças do app de verdade (as mesmas classes que o app usa hoje — src/97z3-precos.js tiLinha, src/97-marca.js, style.css): título com
# "‹ voltar" (.nvVs + .top.grpTop h1), rótulo de bloco (.lbl.tiLb), lista (section.nvLista > button.nvL: .nvIc, .nvTx b/small, em.tiV, i ›),
# dica (p.hint), botão principal (.go = contorno rosa, família 81), foto da peça (.vtI). Assim o esboço já é o desenho da família.
LN = r"""const I3=""" + json.dumps(IC3) + r""";
 const ICO=k=>'<span class="nvIc"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--mute)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(I3[k]||k)+'</svg></span>';
 const TOPA=(v,t)=>'<button type="button" class="nvVs" style="display:inline-flex"><i aria-hidden="true">‹</i>'+v+'</button><div class="top grpTop"><div><h1>'+t+'</h1></div></div>';
 const TOPB=(v,t,btns,crumb)=>'<button type="button" class="nvVs" style="display:inline-flex"><i aria-hidden="true">‹</i>'+v+'</button><div class="top"><div><h1>'+t+'</h1>'+(crumb?'<div class="crumb">'+crumb+'</div>':'')+'</div><div style="display:flex;gap:16px">'+btns.map(b=>'<button type="button" class="pl78" aria-label="'+b[1]+'" style="position:relative"><svg viewBox="0 0 24 24" aria-hidden="true">'+b[0]+'</svg>'+(b[2]?'<span style="position:absolute;top:-6px;right:-6px;min-width:22px;height:22px;border-radius:11px;background:#d23c3c;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 6px">'+b[2]+'</span>':'')+'</button>').join('')+'</div></div>';
 const LB=(t,first)=>'<div class="lbl tiLb" style="margin:'+(first?'24px':'32px')+' 0 8px">'+t+'</div>';   // 32 px acima do bloco (24 o primeiro), como no 73s
 const LS=h=>'<section class="nvLista">'+h+'</section>';
 const L=(ic,t,s,v,seta)=>'<button type="button" class="nvL">'+(ic?ICO(ic):'')+'<span class="nvTx"><b>'+t+'</b>'+(s?'<small>'+s+'</small>':'')+'</span>'+(v?'<em class="tiV" style="color:var(--mute);font-weight:400;font-size:15px">'+v+'</em>':'')+(seta?'<i aria-hidden="true">'+seta+'</i>':'')+'</button>';
 const LF=(src,t,s,v,seta)=>'<button type="button" class="nvL"><span class="vtI" style="flex:0 0 64px;width:64px;height:44px;border-radius:8px;background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center"><img src="'+src+'" alt="" style="width:100%;height:100%;object-fit:contain"></span><span class="nvTx"><b>'+t+'</b>'+(s?'<small>'+s+'</small>':'')+'</span>'+(v?'<em class="tiV" style="color:var(--mute);font-weight:400;font-size:15px">'+v+'</em>':'')+(seta?'<i aria-hidden="true">'+seta+'</i>':'')+'</button>';
 const FINO=t=>'<button type="button" class="nvL" style="min-height:48px;padding:8px 0"><span class="nvTx"><small style="font-size:15px">'+t+'</small></span><i aria-hidden="true">›</i></button>';
 const HINT=t=>'<p class="hint">'+t+'</p>';
 const GO=t=>'<button type="button" class="go" style="width:100%;margin-top:24px">'+t+'</button>';
 const ENT=Ls=>LB('Entendi assim')+Ls.map(x=>'<p style="margin:0 0 8px;font-size:15px;line-height:22px">'+x+'</p>').join('');"""
def foto(ref, w=240):
    """A foto REAL da peça (a do Estúdio que o site usa), pequena, como data URL."""
    f = [x for x in os.listdir(CAT + '/dados/f') if x.startswith(ref + '_')][0]
    im = Image.open(CAT + '/dados/f/' + f).convert('RGB'); im.thumbnail((w, w)); b = io.BytesIO(); im.save(b, 'JPEG', quality=82)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
def loja_site():
    """As peças reais do site (nome, preço em G$, estoque, aviso)."""
    d = json.load(open(A + '/dados/site_loja_normal.json')); out = {}
    for x in d['docs']:
        Fd = x['fields']; g = lambda n: list(Fd[n].values())[0] if Fd.get(n) else None
        out[x['name'].split('/')[-1]] = {'nome': g('nome'), 'n': int(g('n') or 0), 'est': int(g('est') or 0), 'aviso': g('aviso') or ''}
    return out
REL = []
def abre(pw, nav, esc):
    b, pg = abrir.abre(pw, navegador=nav, tema='escuro' if esc else 'claro')
    pg.evaluate('()=>{__LF.S._gAt="g:mkt";__LF.setView("mkt")}'); pg.wait_for_timeout(900)
    return b, pg
def proposta(pg, corpo, dados=None):
    """Desenha a proposta dentro da tela do Marketing do app (o app pode redesenhar: volta a pôr)."""
    html = pg.evaluate("(D)=>{" + H + LN + "return '<div class=\"e49\">'+" + corpo + "+'</div>'}", dados or {})
    pg.evaluate(r"""(h)=>{const v=document.getElementById('v-mkt');const f=()=>{if(v.dataset.e49!=='1'){v.dataset.e49='1';v.innerHTML=h}};f();new MutationObserver(()=>{if(!v.querySelector('.e49'))v.dataset.e49='0',f()}).observe(v,{childList:true})}""", html)
    pg.add_style_tag(content='#grpTabs,#nvBar{display:none!important}#v-mkt>.nvVs{display:none!important}')   # o título e o "‹" do Marketing de hoje: a proposta traz os dela
    pg.wait_for_timeout(700)
def foto_tela(pg, nome, altura=2400):
    """A tela inteira (sem a barra de baixo), na largura dos esboços aprovados (828 px)."""
    pg.add_style_tag(content='#mainnav{display:none!important}'); pg.evaluate('()=>window.__argus.parar()')
    f = '/tmp/esb_semp_%s.png' % nome; pg.screenshot(path=f, full_page=not pg.evaluate('()=>!!window.__esbPorCima'))   # tela que abre por cima: só o que se vê
    im = Image.open(f).convert('RGB'); im = im.resize((828, int(im.height * 828 / im.width)))
    return im.crop((0, 0, 828, min(im.height, altura)))
def pecas(pg): return pg.evaluate(planta.COLETA)
MEDIDOR = []
def mede(pg, nome):
    """O medidor de família do Argus na proposta (L1–L4, toque, cores, números…): o esboço não vai ao dono com achado sem motivo."""
    x = familia.mede_tela(nome, pg.evaluate(familia.COLETA)); MEDIDOR.append((nome, x)); return x
def compara_hp(nome, hoje, prop):
    """O comparador Hoje × Proposta (o do motor do Argus): toda diferença vai para a lista; cada uma tem de estar no esboço."""
    D = compara.compara(hoje, prop); REL.append((nome, D)); return D
def quadro(arq, q):
    g = 40; w = max(i.width for _, _, i in q); h = max(i.height for _, _, i in q)
    S = Image.new('RGB', (g + len(q) * (w + g), h + 150), (17, 20, 26)); d = ImageDraw.Draw(S)
    for i, (t, s, im) in enumerate(q):
        x = g + i * (w + g); d.text((x, 24), t, font=F(32), fill=(235, 235, 240)); d.text((x, 68), s, font=F(20), fill=(140, 150, 165))
        S.paste(im, (x, 112)); d.rectangle([x - 1, 111, x + im.width, 112 + im.height], outline=(90, 90, 100))
    S.save(O + arq, quality=86); print('ok', arq)
def relatorio(arq):
    """O que o comparador achou, tela por tela (vai junto do esboço)."""
    with open(O + arq, 'w') as f:
        for n, D in REL:
            f.write('## %s · %d diferenças\n' % (n, len(D)))
            for x in D: f.write('- %s · %s\n' % (x[0], x[1]))
            f.write('\n')
        f.write('# Medidor de família (Argus) nas propostas\n')
        for n, X in MEDIDOR:
            f.write('## %s · %d achados\n' % (n, len(X)))
            for x in X: f.write('- %s\n' % ' · '.join(str(v) for v in x))
