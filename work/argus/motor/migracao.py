# ARGUS · os dados de hoje têm de abrir na versão nova. A versão publicada guarda a loja do jeito dela; a versão nova abre esses
# MESMOS dados guardados e tem de mostrar tudo: peças, vendas, clientes, contas, lotes, PIN e câmbio. Nada some, nada duplica.
import os, sys, subprocess
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); R = os.path.dirname(os.path.dirname(A)); sys.path.insert(0, os.path.join(A, 'motor'))
import abrir, loja, esboco
RESUMO = "()=>{const S=__LF.S;return {pecas:(S.items||[]).length,unidades:(S.items||[]).reduce((a,i)=>a+(+i.qty||0),0),vendas:(S.sales||[]).length,clientes:(S.clientes||[]).length,contas:(S.exp||[]).length,lotes:(S.grp||[]).length,pin:!!S.pinHash,cambio:(S.fxHist||[]).length}}"
def publicada():
    """A última versão publicada do app: o último commit que subiu o número da versão (www/sw.js)."""
    return subprocess.run(['git', '-C', R, 'log', '-1', '--format=%H', '--', 'www/sw.js'], capture_output=True, text=True).stdout.strip()
def confere(pw, cenario='bloqueio', velha=None):
    """Devolve [(o que, na velha, na nova)] — vazio = tudo abriu igual."""
    velha = velha or publicada()
    www = esboco.prepara('_migracao_velha', base=velha); pv = esboco.serve(www, 8837)
    b, pg = abrir.abre(pw, porta=pv, cenario=cenario)
    guardado = pg.evaluate(loja.LE, loja.CHAVE); antes = pg.evaluate(RESUMO); b.close()
    b, pg = abrir.abre(pw, cenario=guardado)   # a versão nova abrindo exatamente o que a velha guardou
    depois = pg.evaluate(RESUMO); b.close()
    return [(k, antes[k], depois.get(k)) for k in antes if antes[k] != depois.get(k)], velha
