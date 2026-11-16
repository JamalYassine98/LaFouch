p='src/97-catalogo-ajustes.js'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:70],s.count(a)); s=s.replace(a,b)
rep("""          '<div class="cjG2"><div><div class="lbl">Preço</div><div class="trk" id="cjTP"><span class="trkTh"></span><button type="button" class="trkB" data-m="v">Varejo</button><button type="button" class="trkB" data-m="a">Atacado</button></div></div>' +
          '<div><div class="lbl">Moeda</div>""","""          // S370 (esboço 26, aprovado 15/11/2026): o Catálogo é só varejo — a chave Varejo | Atacado saiu (atacado é pela conta/link do lojista)
          '<div class="cjG1"><div><div class="lbl">Moeda</div>""")
rep("""          '<div class="cjFt"><button type="button" class="go cjVer" id="cjVer">Ver <span class="cjOdo" id="cjN"><span>0</span></span> peças</button><button type="button" class="mini cjSec" id="cjCanc">Cancelar</button></div>';""","""          // S370: sem "Ver N peças" e "Cancelar" (mesma regra dos Filtros do inventário): cada toque vale na hora; fecha arrastando ou tocando fora
          '<div class="hint cjCt" id="cjCt" aria-live="polite"><span class="cjOdo" id="cjN"><span>0</span></span> peças</div>';""")
rep("""          trkMarca($('cjTP'), D.atac ? 'a' : 'v');
""","")
rep("""          if (primeira) $('cjN').innerHTML = '<span>' + n + '</span>';
          else lfOdo($('cjN'), n);
        };""","""          if (primeira) $('cjN').innerHTML = '<span>' + n + '</span>';
          else {
            lfOdo($('cjN'), n);
            cjAplica(D);
          }
        };""")
rep("""            if (t === 'cjTP') D.atac = b.dataset.m === 'a';
            else if (t === 'cjTM')""","""            if (t === 'cjTM')""")
rep("""          if (b.id === 'cjCanc') J.fecha();
          if (b.id === 'cjVer') {
            cjAplica(D);
            setTimeout(J.fecha, 120);
          }
""","")
rep("""  function cjAplica(D) {
    var era = !tabDe(S.tabAtiva).pub;
    if (D.atac !== era) {
      if (D.atac) S.tabAtiva = S._ultAtac && tabDe(S._ultAtac).on !== false ? S._ultAtac : 'a1';
      else {
        S._ultAtac = S._ultAtacAtual;
        S.tabAtiva = 'pub';
      }
    }""","""  function cjAplica(D) {
    if (!tabDe(S.tabAtiva).pub) S.tabAtiva = 'pub'; // S370: o Catálogo é só varejo""")
open(p,'w').write(s)
