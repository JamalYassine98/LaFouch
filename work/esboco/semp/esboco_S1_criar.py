# ESBOÇO S1 · SEMP · Marketing › Criar (ESBOCO, 26/11/2026) — parte 1 do esboço do Semp no app.
# Pedido do dono 26/11 08:21. Base: o app real + TODOS os aprovados: 70 (Marketing do Semp, setores, "‹ Marketing", sem subtítulo),
# 73s (setor Criar: Formato + "Listas de transmissão ⌄" — aprovado, AINDA NÃO implementado: é a base desta tela), 72/72b (Agenda; tocar
# num item abre a janela de criar), regras 15/16 (tarefa = janela de baixo com "Salvar"; lugar ›; ler ⌄; etapa = tela própria com
# "‹ etapa anterior"), 37b (ícones e rótulos cinza), 81/86 (família de botões e linhas) e as decisões do dono de 25/11 sobre o Semp
# (docs/FALTA-APROVAR-15-11.md, bloco SEMP): Criar em 3 passos peça → cenário → pronto, com todos os formatos; o Semp entrega cenários
# com lógica, o "Entendi assim" e o prompt do Flow; "Sua ideia ›"; "Não é isso ›" em linha fina antes de gastar crédito do Flow; o Flow
# abre numa aba integrada e o dono aperta "gerar"; da foto com modelo saem post, story, status e carrossel ("Usar em"); estoque 1 não é
# anunciado; ao dia de muitas fotos do Estúdio, uma linha de resumo. Peças REAIS: as do site (foto do Estúdio, preço e estoque reais).
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from base import *
L = loja_site()
G = lambda n: 'G$ ' + format(n, ',').replace(',', '.')
# a ordem do Semp sem cérebro (modo regras, Lógica do Semp §3): estoque 1 fica fora; estoque 2–3 entra com "últimas"; combina com o
# evento que vem (Natal em 29 dias; dezembro = verão → solar). Sem venda nem dias parada inventados: só o que os dados dizem.
ORDEM = [('AC1050', 'Quadrada AC1050', 'últimas %d · antes do Natal' % L['AC1050']['est']),
         ('SL2305', 'Aviador SL2305', 'solar · começa o verão'),
         ('SL2265', 'Gatinho SL2265', 'solar · presente de Natal'),
         ('GR3340', 'Quadrada GR3340', 'acetato · presente'),
         ('AC1055', 'Redonda AC1055', 'rosto quadrado ou longo')]
D = {'f': {r: foto(r) for r, _, _ in ORDEM}, 'p': {r: G(L[r]['n']) for r, _, _ in ORDEM}, 'o': ORDEM}
# 1 · Criar (o setor). Base = 73s; a proposta troca a lista "Formato" pelos 3 passos (todos os formatos saem do passo Pronto).
BASE_CRIAR = r"""TOPA('Marketing','Criar')+LB('Formato',1)+LS(L('post','Post','uma peça · foto e legenda')+L('carr','Carrossel','até 10 fotos · as cores ou várias peças')+L('story','Story','vertical · 15 s')+L('status','Status','WhatsApp · some em 24 h')+L('video','Vídeo','15 s com o giro da peça')+L('rot','Roteiro','o texto para você gravar'))+
 '<div style="height:32px"></div>'+LS(L('lista','Listas de transmissão','nenhum cliente com telefone ainda','','⌄'))"""
CAM = '<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>'
IDE = '<path d="M12 3a6 6 0 0 0-3.5 10.9V17h7v-3.1A6 6 0 0 0 12 3z"/><path d="M9.5 20h5"/>'
GAL = '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'
PRO = '<path d="M8 4h8v4H8z"/><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 12h8M8 16h5"/>'
PES = '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>'
D.update(cam=CAM, ide=IDE, gal=GAL, pro=PRO, pes=PES)
CRIAR = r"""TOPA('Marketing','Criar')+LB('Começar',1)+LS(L(D.cam,'Do Estúdio','17 peças com foto · em ordem','','›')+L(D.ide,'Sua ideia','escreva só a ideia · o Semp monta o resto','',''))+
 LB('Feitos')+LS(L(D.gal,'Galeria','fotos do Flow · Usar em','nenhuma','›'))+
 '<div style="height:32px"></div>'+LS(L('lista','Listas de transmissão','nenhum cliente com telefone ainda','','⌄'))"""
# 2 · Passo 1: a peça
PECA = r"""TOPA('Criar','Peça')+LB('Passo 1 de 3 · o Semp sugere',1)+LS(D.o.map(x=>LF(D.f[x[0]],x[1],x[2],D.p[x[0]],'›')).join(''))+
 HINT('Fica fora: Redonda BR44145 · última unidade (o Semp não anuncia estoque 1).')"""
# 3 · Passo 2: o cenário
CENA = r"""TOPA('Peça','Cenário')+'<div style="height:24px"></div>'+LS(LF(D.f.SL2305,'Aviador SL2305','nome sugerido: Margaux','',''))+
 ENT(['Aviador dourado para dezembro, quando começa o verão.','Mostro na rua com luz de fim de tarde, que puxa o dourado da armação, e num rosto oval de tamanho médio, porque a frente do aviador é larga.'])+
 LS(FINO('Não é isso'))+LB('Passo 2 de 3 · cenários')+
 LS(L('','Rua de CDE no fim da tarde','luz quente puxa o dourado da armação','','›')+L('','Terraço com sol de verão','solar em dezembro: começa o verão','','›')+
 L('','Presente de Natal','Natal em 29 dias · caixa e laço discretos','','›')+L('','Vitrine · estúdio bege','close para o Início e o catálogo','','›'))+
 LB('Modelo')+LS(L(D.pes,'Amara','rosto oval médio · frente larga','',''))"""
# 4 · Passo 3: pronto, antes de gerar
PRONTO1 = r"""TOPA('Cenário','Pronto')+'<div style="height:24px"></div>'+LS(LF(D.f.SL2305,'Margaux · SL2305','rua de CDE · fim da tarde · Amara','',''))+
 LB('Passo 3 de 3 · foto com modelo')+LS(L(D.pro,'Prompt do Flow','pronto · vai copiado para o Flow','','⌄'))+
 GO('Gerar no Flow')+'<p class="hint" style="text-align:center">O Flow abre aqui dentro com o prompt e as 3 fotos da peça · você aperta gerar e salva a foto</p>'+
 LB('O que sai desta foto')+LS(L('post','Post','4:5 · legenda em ES e PT','qui 20h','')+L('story','Story','9:16 · recorte vertical','sex 12h','')+
 L('status','Status','WhatsApp · some em 24 h','sex 12h','')+L('carr','Carrossel','esta foto + a vitrine do Estúdio','','')+L('rot','Roteiro do reel','15 s · gancho, cenas, peça','','⌄'))"""
# 5 · Passo 3: pronto, depois que o Flow devolveu a foto (o quadro marca onde entra a foto: aqui não se gera foto de pessoa)
PRONTO2 = r"""TOPA('Cenário','Pronto')+
 '<div style="margin:16px 0 0;aspect-ratio:3/4;border-radius:12px;background:#fff;border:1px dashed var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center"><img src="'+D.f.SL2305+'" alt="" style="width:70%"></div>'+HINT('No quadro entra a foto que você salvou no Flow (de volta ao app, ela vem da galeria; você confirma).')+
 LS(FINO('Não é isso'))+LB('Usar em')+LS(L('post','Post','4:5 · legenda pronta em ES e PT','qui 20h','')+L('story','Story','9:16 · recorte vertical','sex 12h','')+
 L('status','Status','WhatsApp · some em 24 h','sex 12h','')+L('carr','Carrossel','esta foto + a vitrine do Estúdio','',''))+
 HINT('Fica guardada na Galeria · os horários vêm da Agenda.')"""
IDEIA_JS = r"""(D)=>{__LF.lfJanela({titulo:'Sua ideia',monta:(c)=>{c.innerHTML='<p style="margin:0 0 16px;font-size:15px;line-height:22px;color:var(--mute)">Escreva do seu jeito. O Semp escolhe a peça, o cenário e a modelo, monta o prompt e diz o que ajustou.</p><div style="border-bottom:1px solid var(--line2);padding:8px 0 16px"><textarea class="in" rows="4" style="width:100%;border:0;background:transparent;padding:0;font-size:16px;line-height:24px;resize:none;color:var(--fg)">Papai Noel escolhendo óculos de sol para dar de presente</textarea></div><button type="button" class="go" style="width:100%;margin-top:24px">Salvar</button>'}})}"""
def par(pw, nav, esc, nome, hoje_fn, corpo, extra=None):
    """(foto de hoje, foto da proposta) da mesma tela, e o comparador entre as duas."""
    b, pg = abre(pw, nav, esc); hoje_fn(pg); h = pecas(pg); fh = foto_tela(pg, nome + '_h'); b.close()
    b, pg = abre(pw, nav, esc); proposta(pg, corpo, D)
    if extra: pg.evaluate(extra, D); pg.wait_for_timeout(1200)
    p = pecas(pg); mede(pg, '%s · %s' % (nome, 'escuro' if esc else 'claro')); fp = foto_tela(pg, nome + '_p'); b.close()
    compara_hp('%s · %s' % (nome, 'escuro' if esc else 'claro'), h, p)
    return fh, fp
def base_73s(pg): proposta(pg, BASE_CRIAR, D)
def janela_hoje(pg):
    """A janela de criar de HOJE (Marketing › Criar com um toque › Post): é ela que os 3 passos trocam."""
    pg.evaluate('()=>{const b=document.querySelector("[data-cria=post]");b&&b.click()}'); pg.wait_for_timeout(1500)
def criar_hoje(pg): pass   # o Marketing de hoje (Criar com um toque fica no meio da tela)
if __name__ == '__main__':
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        nav = sim.navegador(pw)
        for esc in (True, False):
            n = 'escuro' if esc else 'claro'
            a = par(pw, nav, esc, 'S1a-criar', base_73s, CRIAR)
            quadro('esboco_S1a_criar_%s.jpg' % n, [('BASE · Marketing › Criar', n + ' · aprovado 73s, ainda não implementado', a[0]), ('PROPOSTA · Marketing › Criar', n + ' · 3 passos no lugar da lista Formato', a[1])])
            q = []
            for nome, corpo, tit in (('S1b-peca', PECA, 'Passo 1 · Peça'), ('S1c-cenario', CENA, 'Passo 2 · Cenário'), ('S1d-pronto', PRONTO1, 'Passo 3 · Pronto (antes de gerar)'), ('S1e-pronto-foto', PRONTO2, 'Passo 3 · Pronto (com a foto do Flow)')):
                h, p = par(pw, nav, esc, nome, janela_hoje, corpo)
                quadro('esboco_%s_%s.jpg' % (nome.replace('-', '_', 1), n), [('HOJE · janela de criar (Post)', n + ' · Marketing › Criar com um toque › Post', h), ('PROPOSTA · ' + tit, n, p)])
            h, p = par(pw, nav, esc, 'S1f-sua-ideia', criar_hoje, CRIAR, IDEIA_JS)
            quadro('esboco_S1f_sua_ideia_%s.jpg' % n, [('HOJE · não existe', n + ' · o Marketing de hoje', h), ('PROPOSTA · Criar › Sua ideia', n + ' · janela de baixo com um "Salvar" (regra 15)', p)])
        nav.close()
    relatorio('comparador_S1.md')
