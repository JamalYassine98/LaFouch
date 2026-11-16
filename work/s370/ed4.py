p='src/98-botoes-barra.js'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:70],s.count(a)); s=s.replace(a,b)
rep("""      clearTimeout(dg.t);
      clearTimeout(dg.ht);
      var d = dg;""","""      clearTimeout(dg.t);
      clearTimeout(dg.ht);
      clearTimeout(dg.rt);
      var d = dg;""")
rep("""      if (d.deBarra && grpGet(d.id) && Math.abs(d.cx - d.x0) + Math.abs(d.cy - d.y0) < 14 && ev && ev.type === 'pointerup') {""","""      if (grpGet(d.id) && Math.abs(d.cx - d.x0) + Math.abs(d.cy - d.y0) < 14 && ev && ev.type === 'pointerup') {""")
rep("""      } else if (!d.deBarra && o.zona === 'lixo') {
        oculta = true;""","""      } else if (!d.deBarra && o.zona === 'fora' && d.juntaT && d.troca && d.troca.getAttribute('data-id') === d.juntaT && ev && ev.type === 'pointerup') {
        // S370 (esboço 44): o anel fechou — junta os dois atalhos do Início num grupo
        var gh = d.g,
          alvoEl = d.troca;
        d.g = null;
        limpa();
        dg = null;
        dicaOff();
        if (alvoEl) alvoEl.classList.remove('troca');
        grpIniJunta(d.id, d.juntaT, gh, alvoEl, function () {});
        return;
      } else if (!d.deBarra && o.zona === 'lixo' && grpGet(d.id)) {
        volta = true;
        msg = 'Para desfazer o grupo: segure nele › Desfazer o grupo';
      } else if (!d.deBarra && o.zona === 'lixo') {
        oculta = true;""")
rep("""      S.barra = B;
      if (g && !REDUCED && o.zona === 'barra' && o.k >= 0) {""","""      S.barra = B;
      // um grupo do Início que foi para a barra sai do Início
      if (!d.deBarra && grpGet(d.id) && B.indexOf(d.id) >= 0 && Array.isArray(S.inicioT)) S.inicioT = S.inicioT.filter(function (x) { return x !== d.id; });
      if (g && !REDUCED && o.zona === 'barra' && o.k >= 0) {""")
rep("""      [].slice.call(document.querySelectorAll('#v-inicio .tl.troca')).forEach(function (el) {
        el.classList.remove('troca');
      });
    }
    function fim(ev) {""","""      [].slice.call(document.querySelectorAll('#v-inicio .tl.troca,#v-inicio .tl.qjT,#v-inicio .tl.qjOk')).forEach(function (el) {
        el.classList.remove('troca', 'qjT', 'qjOk');
      });
    }
    function fim(ev) {""")
open(p,'w').write(s)
