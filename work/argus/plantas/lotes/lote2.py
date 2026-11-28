# ARGUS · FASE 1 (28/11/2026, dono liberou 08:31) · LOTE 2 de plantas do app: as 17 telas do mapa que faltavam + o Início,
# COMO ESTÃO HOJE (nenhuma tela muda). O explorador acha o caminho; cada toque vira um passo por NOME (__argus.tocaNome), estável.
# Aprovação: lista viva 26/11/2026 12:28 ("plantas do app: lote 1 e mapa das 24 telas = planta é o app de hoje") + 28/11 08:31.
import os, sys, json, re, unicodedata
A = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); sys.path.insert(0, os.path.join(A, 'motor'))
import planta, explorador, abrir
APROV = '26/11/2026 12:28 APROVADO (dono, "aprovado tudo")'
def slug(n):
    n = unicodedata.normalize('NFD', n).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', n).strip('-') or 'inicio'
def passos_de(pw, caminho):
    """Refaz o caminho e anota, a cada toque, o NOME do que foi tocado (e qual das iguais)."""
    b, pg = abrir.abre(pw); P = []
    try:
        for tipo, i in caminho:
            if tipo == 'aba': js = '()=>window.__argus.aba(%d)' % i
            else:
                n, k = pg.evaluate("(i)=>{const L=window.__argus.tocaveis(),e=L[i],n=window.__argus.nome(e);return [n,L.slice(0,i).filter(x=>window.__argus.nome(x)===n).length]}", i)
                js = "()=>{if(!window.__argus.tocaNome(%s,%d))throw new Error('planta: não achei '+%s)}" % (json.dumps(n), k, json.dumps(n))
            pg.evaluate(js); pg.wait_for_timeout(950); P.append(js)
    finally: b.close()
    return P
if __name__ == '__main__':
    from playwright.sync_api import sync_playwright
    ja = {json.load(open(os.path.join(planta.P_APP, f)))['tela'] for f in os.listdir(planta.P_APP) if f.endswith('.json')}
    with sync_playwright() as pw:
        CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lote2_lugares.json')
        if os.path.exists(CACHE): X = json.load(open(CACHE))
        else: X = explorador.explora(pw, profundidade=2, max_toques=300, cobertura=False)['lugares']; json.dump(X, open(CACHE, 'w'), ensure_ascii=False, indent=1)
        print(len(X), 'lugares', flush=True); feitas = 0; LIM = int(os.environ.get('LOTE2_MAX', '99'))
        ALVO = [n for n, e, _ in json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mapa_app.json'))) if e == 'sem planta']
        for nome, v in ((n, X[n]) for n in ALVO):
            if feitas >= LIM: break
            chave = nome.split('[')[1].split(']')[0] if '[' in nome else ''
            tela = nome.split(' [')[0].strip() or ('Início' if chave == 'inicio' else chave.capitalize())
            if ' | janela: ' in nome: tela = nome.replace(' [', ' · ').split(' |')[0] + ' › ' + nome.split('janela: ')[1]
            id_ = 'app-' + slug(nome.replace(' | janela: ', '-').replace('[', '').replace(']', ''))
            if os.path.exists(os.path.join(planta.P_APP, id_ + '.json')) or tela in ja: print('já tem', id_, flush=True); continue
            ps = passos_de(pw, v['caminho'])
            pl = planta.grava(pw, id_, {'nome': tela, 'passos': ps, 'cenario': 'normal'}, aprovacao=APROV); pl['lugar_mapa'] = nome
            planta.salva(pl); feitas += 1; print('planta', id_, '·', pl.get('titulo'), '·', len(pl['ligacoes']), 'ligações', flush=True)
