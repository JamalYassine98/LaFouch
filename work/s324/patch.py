# S324: implementa no app o padrão de controles aprovado em 15/11/2026 (esboços S321–S323): abas padrão em Pedidos, Compartilhar e ficha da peça;
# Clientes, Dinheiro e Dashboard; cores que não existiam (49 regras); remove "Recentes" do Início.
import re
R='/home/claude/lafouch/'
def edita(f,pares):
    s=open(R+f,encoding='utf-8').read()
    for a,b in pares:
        assert s.count(a)==1,(f,s.count(a),a[:70]); s=s.replace(a,b)
    open(R+f,'w',encoding='utf-8').write(s)
edita('src/95-pedidos.js',[("""h += '<div class="pdSeg" role="group" aria-label="Situação dos pedidos">';""","""h += '<div class="pdSeg lfAbas" id="pdTabs" role="group" aria-label="Situação dos pedidos">'; // S324: abas padrão do app (linha que desliza)""")])
edita('src/98-anim-novas.js',[("""        linhaAbas('eTabs', '.chip.on');
        expandeDepois();""","""        linhaAbas('eTabs', '.chip.on');
        linhaAbas('pdTabs', '.on'); // S324: Pedidos usa as mesmas abas
        expandeDepois();"""),
 ("""    // ---------- h. (v474, aprovado em vídeo 08/11)""","""    window.lfLinhaAbas = linhaAbas; // S324: janelas que se desenham sozinhas (Compartilhar, ficha da peça) chamam a mesma linha

    // ---------- h. (v474, aprovado em vídeo 08/11)""")])
edita('src/97v-compartilhar-s185.js',[
 ("""['link', '🔗 Link com foto',""","""['link', 'Link com foto',"""),("""['cart', '🖼️ Cartões',""","""['cart', 'Cartões',"""),("""['capa', '📣 Capa de status',""","""['capa', 'Capa de status',"""),
 ("""['pdf', '📄 Catálogo PDF',""","""['pdf', 'Catálogo PDF',"""),("""['plan', '📊 Planilha',""","""['plan', 'Planilha',"""),
 ("""<div class="s185Seg"><button""","""<div class="s185Seg lfAbas" id="s185Tabs" role="tablist"><button"""),
 ("""      var cartao = E.modo === 'cart';""","""      if (window.lfLinhaAbas) window.lfLinhaAbas('s185Tabs', '.on'); // S324: abas padrão
      var cartao = E.modo === 'cart';""")])
edita('src/97u-navegacao-s184.js',[
 ("""    [].forEach.call(det.querySelectorAll('.fnTabs button'), function (b) { b.classList.toggle('on', b.getAttribute('data-id') === cur); });""",
  """    [].forEach.call(det.querySelectorAll('.fnTabs button'), function (b) { b.classList.toggle('on', b.getAttribute('data-id') === cur); });
    if (window.lfLinhaAbas) window.lfLinhaAbas('fnAbas', '.on'); // S324: abas padrão na ficha"""),
 ("""'<div class="fnTabs fnTabs4" role="tablist">'""","""'<div class="fnTabs lfAbas n2" id="fnAbas" role="tablist">'""")])
edita('src/96-clientes.js',[("""'<div class="tabs"><button class="mini" data-act="clinovo">+ Novo cliente</button><button class="mini ghost" data-act="ataNovo">Acesso atacado</button><button class="mini ghost" data-act="ataLotes">Lotes</button><button class="mini ghost" data-act="cupAbre">Cartões</button></div></div>';""",
 """'<button type="button" class="pgAc" data-act="clinovo">+ Novo cliente</button>' + // S324: ação da página ao lado do título (como "+ Adicionar"); o resto em links com "›"
      '<div class="lkRow"><button type="button" class="lkGo" data-act="ataNovo">Acesso atacado ›</button><button type="button" class="lkGo" data-act="ataLotes">Lotes ›</button><button type="button" class="lkGo" data-act="cupAbre">Cartões ›</button></div></div>';""")])
edita('src/89-inicio.js',[("""(typeof recentesHtml === 'function' ? recentesHtml() : '')""","""/* S324 (dono, 15/11/2026): faixa "Recentes" removida do Início */ ''""")])
f=R+'www/style.css'; c=open(f,encoding='utf-8').read()
def tira(a):
    global c
    assert c.count(a)==1,(c.count(a),a[:60]); c=c.replace(a,'')
for a in [".pdSeg{display:flex;gap:7px;overflow-x:auto;margin:2px 0 12px;padding-bottom:2px;scrollbar-width:none}",".pdSeg::-webkit-scrollbar{display:none}",
          ".pdSeg button{flex:none;min-height:42px;padding:0 14px;border-radius:999px;background:var(--panel);border:1px solid var(--line);color:var(--fg);font-size:13px;display:inline-flex;align-items:center;gap:7px;white-space:nowrap}",
          ".pdSeg button b{background:var(--panel2);border-radius:999px;padding:1px 8px;font-size:12px}",".pdSeg button.on{background:linear-gradient(135deg,#c0629c,#8a3a73);border-color:transparent;color:#fff;font-weight:700}",
          ".s185Seg{display:grid;grid-template-columns:1fr 1fr;gap:4px;background:var(--card2,rgba(0,0,0,.05));border-radius:12px;padding:4px}",".s185Seg button{border:0;background:none;border-radius:9px;padding:9px;font-weight:600;color:var(--mu)}",
          ".s185Seg button.on{background:var(--card,#fff);color:var(--ac,#8d3a69);box-shadow:0 1px 4px rgba(0,0,0,.08)}",
          ".fnTabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;background:var(--card2,rgba(0,0,0,.05));border-radius:12px;padding:3px}",
          ".fnTabs button{border:0;background:none;border-radius:9px;padding:8px 2px;font-family:inherit;font-size:13px;font-weight:600;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
          ".fnTabs button.on{background:var(--card,#fff);color:var(--ac,#8d3a69);box-shadow:0 1px 4px rgba(0,0,0,.08)}",".fnTabs.fnTabs4{grid-template-columns:repeat(4,minmax(0,1fr))}"]: tira(a)
print('sobras .pdSeg/.s185Seg/.fnTabs no CSS:',[m.group(0)[:90] for m in re.finditer(r'[^{}]*(?:pdSeg|s185Seg|fnTabs)[^{}]*\{[^}]*\}',c)])
c+="""
/* ===== S324 (15/11/2026) · PADRÃO DE CONTROLES DO APP (docs/DESIGN-SITE-E-APP.md) ===== */
/* cores que as regras antigas pediam e NÃO existiam (caíam no branco): apelidos para as cores reais do app, nos dois temas */
:root{--card:var(--panel2);--card2:var(--panel);--mu:var(--mute);--mut:var(--mute);--muted:var(--mute);--tx:var(--fg);--text:var(--fg);--soft:var(--accent-soft);--ac:var(--accent);--acc:var(--accent)}
.gLink,.fiN,.fiPe .fiH,.guardT svg,.guardOk svg{color:var(--accent-fg)}
/* 1 · ABA: troca o que a tela mostra; a linha desliza (linhaAbas) */
.lfAbas{display:flex;flex-wrap:nowrap;gap:22px;position:relative;border-bottom:1px solid var(--line2);overflow-x:auto;scrollbar-width:none;margin:2px 0 14px;padding:0;background:none;border-radius:0}
.lfAbas::-webkit-scrollbar{display:none}
.lfAbas>button{flex:none;min-height:44px;padding:10px 0;border:0;border-radius:0;background:none;box-shadow:none;color:var(--sub);font:inherit;font-size:15px;font-weight:500;display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
.lfAbas>button.on{color:var(--accent-fg)}
.lfAbas:not(.lfLinhaOn)>button.on{box-shadow:inset 0 -2px 0 var(--accent)}
.lfAbas>button b{font-size:13px;font-weight:500;color:var(--mute);background:none;padding:0}
.lfAbas.n2{gap:20px;margin:6px 0 12px}
.lfAbas.n2>button{font-size:14px}
/* 2 · OPÇÃO: escolher uma coisa num formulário */
.s185G button{background:var(--panel2);border:1px solid var(--line);color:var(--fg);padding:12px}
.s185G button.on{border-color:var(--accent);background:var(--accent-soft)}
.s185G small{color:var(--mute)}
/* 4 · AÇÃO: uma cheia por janela; a de página em pílula de contorno ao lado do título; terciárias em link com "›" */
.ebJn .ebEnv{border:0;background:linear-gradient(135deg,#b4528a,#a2447c 55%,#7d3361);color:#fff;box-shadow:0 6px 16px rgba(162,68,124,.35)}
.pgAc{flex:none;min-height:44px;padding:0 16px;border:1px solid color-mix(in srgb,var(--fg) 28%,transparent);border-radius:999px;background:none;color:var(--fg);font:inherit;font-weight:600;font-size:15px}
.lkRow{flex:1 0 100%;display:flex;flex-wrap:wrap;gap:0 20px;margin:2px 0 6px}
.lkGo{flex:none;min-height:44px;padding:0;border:0;background:none;color:var(--fg);font:inherit;font-weight:500;font-size:15px}
#v-clientes .top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:12px}
#v-clientes .top>div:first-child{flex:1 1 0;min-width:0}
#v-caixa .top .ic{border-radius:14px}
.obNovo{border:1px solid color-mix(in srgb,var(--fg) 28%,transparent);border-radius:999px;min-height:44px;font-weight:600}
/* título de tela sempre serifado (o Dashboard fugia) */
.dHdT{font-family:Fraunces,Georgia,"Times New Roman",serif;font-size:28px;font-weight:500;letter-spacing:-.01em}
.dHdT i{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;font-size:18px}
"""
open(f,'w',encoding='utf-8').write(c)
print('ok')
