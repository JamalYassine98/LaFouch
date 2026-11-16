p='src/98-botoes-barra.js'; s=open(p).read()
def rep(a,b):
    global s
    assert s.count(a)==1,(a[:70],s.count(a)); s=s.replace(a,b)
rep("""        if (ts) ts.classList.add('troca');
        dg.troca = ts;
      }""","""        if (ts) ts.classList.add('troca');
        dg.troca = ts;
        // S370 (esboço 44): parado sobre outro atalho, um anel se fecha em volta dele (0,3 s); fechado = soltar junta os dois
        var tk = ts && !grpGet(dg.id) ? ts.getAttribute('data-id') : null;
        if (tk !== dg.rk) {
          clearTimeout(dg.rt);
          [].slice.call(document.querySelectorAll('#v-inicio .tl.qjT,#v-inicio .tl.qjOk')).forEach(function (el) { el.classList.remove('qjT', 'qjOk'); });
          dg.rk = tk;
          dg.juntaT = null;
          if (tk) {
            ts.classList.add('qjT');
            dg.rt = setTimeout(function () {
              if (dg && dg.rk === tk) {
                dg.juntaT = tk;
                ts.classList.add('qjOk');
                vibrar(12);
                quadro();
              }
            }, 300);
          }
        }
      }""")
rep("""      } else if (!dg.deBarra && dg.troca) {
        dica('Solte para trocar de lugar');""","""      } else if (!dg.deBarra && dg.troca && dg.juntaT) {
        dica(grpGet(dg.juntaT) ? 'Solte para pôr no grupo ' + barraNome(dg.juntaT) : 'Solte para juntar com ' + barraNome(dg.juntaT));
      } else if (!dg.deBarra && dg.troca) {
        dica(grpGet(dg.id) ? 'Solte para trocar de lugar' : 'Solte para trocar de lugar · segure para juntar');""")
open(p,'w').write(s)
