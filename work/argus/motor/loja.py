# ARGUS · loja de teste fixa (Parte 0). Os dados do teste são do ARGUS (dados/loja_normal.json) — não dependem dos dados de
# exemplo que vêm no código do app: se a APP mudar o exemplo, as plantas não mudam.
# Formato = o MESMO que o app usa para guardar (o caminho de verdade de um usuário): localStorage['lafouch_demo_v1'] com o
# estado leve, e o IndexedDB 'lafouch-fotos' › 'estado' › 'big' com as listas grandes (vendas, históricos).
import json, os, copy
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dados')
CHAVE = 'lafouch_demo_v1'
DATA = '2026-11-24T15:00:00-03:00'   # relógio parado: o dia em que a loja de teste foi gravada
LE = r"""async (k)=>{if(window.__LF&&__LF.salvarAgora)__LF.salvarAgora();await new Promise(r=>setTimeout(r,800));
 const big=await new Promise((ok,no)=>{const r=indexedDB.open('lafouch-fotos',2);r.onsuccess=()=>{const d=r.result;const g=d.transaction('estado','readonly').objectStore('estado').get('big');g.onsuccess=()=>{d.close();ok(g.result||null)};g.onerror=()=>no(g.error)};r.onerror=()=>no(r.error)});
 return {ls:JSON.parse(localStorage.getItem(k)||'null'),big}}"""
POE = r"""async ([k,ls,big])=>{localStorage.clear();localStorage.setItem(k,JSON.stringify(ls));
 await new Promise((ok,no)=>{const r=indexedDB.open('lafouch-fotos',2);r.onupgradeneeded=()=>{const d=r.result;['fotos','hq','estado'].forEach(n=>{if(!d.objectStoreNames.contains(n))d.createObjectStore(n)})};
  r.onsuccess=()=>{const d=r.result;const t=d.transaction('estado','readwrite');const o=t.objectStore('estado');if(big)o.put(big,'big');else o.delete('big');t.oncomplete=()=>{d.close();ok()};t.onerror=()=>no(t.error)};r.onerror=()=>no(r.error)});return 1}"""
def arquivo(cen): return os.path.join(D, 'loja_%s.json' % cen)
def grava_normal(pg):
    """Uma vez só: guarda, no formato do app, a loja que ele monta com o relógio parado."""
    d = pg.evaluate(LE, CHAVE)
    if not d['ls'] or not d['big']: raise SystemExit('o app não guardou o estado (ls=%s, big=%s)' % (bool(d['ls']), bool(d['big'])))
    open(arquivo('normal'), 'w').write(json.dumps(d, ensure_ascii=False, sort_keys=True)); return d
def conta(d): return len(d['ls'].get('items') or []), len((d['big'] or {}).get('d', {}).get('sales') or [])
def cenario(cen):
    """Cada cenário nasce da 'normal' por uma regra escrita aqui (um lugar só)."""
    d = json.load(open(arquivo('normal'))); ls, big = d['ls'], d['big']['d']
    if cen == 'normal': return d
    if cen == 'vazio':
        ls['items'] = []; ls['grp'] = []; big['sales'] = []   # sem compras abertas: o app transforma lote aberto em peça "Lote …"
        if 'clientes' in ls: ls['clientes'] = []
    elif cen == 'cheio':   # dia de evento: 10× as peças, 3× as vendas
        # cada peça é única por código + cor + grau: as cópias ganham código novo (como peças novas de verdade)
        # o lote aberto ("Lote …", bulk) é UMA compra: não se copia
        # as cópias são peças de outras compras (sem lote): senão o app desconta do lote aberto, que é a regra dele
        ls['items'] = [x if n == 0 else dict(copy.deepcopy(x), ref=x['ref'] + '-%d' % n, lote='') for n in range(10) for x in ls['items'] if not x.get('bulk') or n == 0]
        big['sales'] = [copy.deepcopy(x) for n in range(3) for x in big['sales']]
    elif cen == 'nomes_longos':
        for c in ls.get('clientes') or []:
            if isinstance(c, dict): c['nome'] = 'Maria Fernanda de los Ángeles González Benítez'
    else: raise SystemExit('cenário desconhecido: ' + cen)
    return d
