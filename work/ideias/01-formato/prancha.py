"""Monta os esboços (um arquivo por tela), no estilo da prancha do kit, sem esticar as capturas.
Uso: python3 prancha.py → esboco-01-resultado.jpg, esboco-02-camera.jpg"""
import os
from PIL import Image, ImageDraw, ImageFont
AQUI = os.path.dirname(os.path.abspath(__file__)); C = os.path.join(AQUI, 'cap')
F = lambda s, bd=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bd else ''), s)

def prancha(out, tit, subs, itens):
    W, H, p, top = 772, 1716, 40, 60 + 40 * len(subs) + 40
    B = Image.new('RGB', (p + (W + p) * len(itens), top + 110 + H + p), '#e9e4e8'); d = ImageDraw.Draw(B)
    d.text((p, 24), tit, font=F(44, 1), fill='#231a22')
    for i, s in enumerate(subs): d.text((p, 84 + 40 * i), s, font=F(26), fill='#6b5d67')
    for k, (f, t, s) in enumerate(itens):
        x = p + k * (W + p)
        d.text((x, top), t, font=F(30, 1), fill='#b3261e' if t.lower().startswith('hoje') else '#8d3a69')
        d.text((x, top + 40), s, font=F(22), fill='#3b2f39')
        B.paste(Image.open(os.path.join(C, f)).convert('RGB'), (x, top + 90))
    B.resize((B.width // 2, B.height // 2), Image.LANCZOS).save(os.path.join(AQUI, out), quality=88)

prancha('esboco-01-resultado.jpg', 'IDEIAS 01 · Descubra seu formato — resultado (celular)', [
    'Proposta: no lugar da foto do cliente com o contorno roxo, a ilustração do formato (a mesma da lista), num quadro rosado; a frase fala dos modelos que combinam.',
    'Feminino/Masculino/Todos troca a ilustração. Conserto junto: com "também tem traços de", escolher Feminino trocava o texto para o 2º formato.',
    'Foto de teste: silhueta feita do rosto-padrão de 478 pontos do próprio leitor do site (sem foto de pessoa real). Peças e textos: site real 1795264209.'], [
    ('hoje-3-resultado.png', 'Hoje · resultado', 'foto do cliente + contorno roxo + anel'),
    ('prop-3-resultado.png', 'Proposta · resultado', 'ilustração do formato, Todos = os dois'),
    ('hoje-6-tracos-feminino.png', 'Hoje · traços + Feminino', 'ERRO: diz Diamante e mostra a dica do Redondo'),
    ('prop-6-tracos-feminino.png', 'Proposta · traços + Feminino', 'só a ilustração feminina; dica certa'),
    ('prop-5-masculino.png', 'Proposta · Masculino', 'só a ilustração masculina'),
    ('prop-L12-3-resultado.png', 'Proposta · letra 1,2×', 'cabe sem quebrar')])

prancha('esboco-02-camera.jpg', 'IDEIAS 01 · Parte A — câmera muito boa (celular)', [
    'Câmera do simulador com um MANEQUIM feito do rosto-padrão de 478 pontos do leitor do site (sem pessoa real). Hoje = site de verdade; Proposta = pintada por cima.',
    'Achados de hoje: virado, ela pede "chegue mais perto" e trava; com a boca aberta mede e dá DIAMANTE (o mesmo manequim de boca fechada dá REDONDO);',
    'do "Perfeito!" ao resultado são ~12 s no simulador (3-2-1 + ~8 s analisando a foto). Proposta: leitor ao vivo, um aviso certo por vez, anel de ~1,5 s e resultado na hora.'], [
    ('c2-hoje-virado.png', 'Hoje · virado 35°', 'aviso errado: "chegue mais perto"; não sai daí'),
    ('c2-prop-virado.png', 'Proposta · virado 35°', 'o leitor vê o giro: aviso certo'),
    ('c2-hoje-boca.png', 'Hoje · boca aberta', 'conta 3-2-1 e mede assim mesmo'),
    ('c2-hoje-boca-res.png', 'Hoje · resultado', 'boca aberta = Diamante (fechada = Redondo)'),
    ('c2-prop-boca.png', 'Proposta · boca aberta', 'espera boca fechada e rosto relaxado'),
    ('c2-hoje-escuro.png', 'Hoje · pouca luz', 'conta e tira a foto escura'),
    ('c2-prop-escuro.png', 'Proposta · pouca luz', 'a tela vira luz em volta do oval'),
    ('c2-hoje-medindo.png', 'Hoje · pronto', '3-2-1, foto, ~8 s analisando'),
    ('c2-prop-medindo.png', 'Proposta · pronto', 'anel de ~1,5 s lendo o vídeo; resultado na hora')])

prancha('esboco-03-formatos.jpg', 'IDEIAS 01 · Descubra seu formato — descrição dos formatos (celular)', [
    'A descrição fala dos MODELOS que combinam, tirada da mesma lista que escolhe as peças de cada rosto (hoje é escrita à mão e contradiz as peças).',
    'Uma tabela só (FACES): quais formatos de armação combinam + por quê; o site tira dela a lista, o resultado, os cartões do PC e os rostos de cada peça.',
    'Hoje nenhuma peça é Diamante nem Alongado: o aviso diz "18 modelos" e mostra o catálogo inteiro. E no celular o 1º toque na lista não faz nada.'], [
    ('lista-hoje-fim.png', 'Hoje · lista', '"Combina:" escrito à mão'),
    ('lista-prop-fim.png', 'Proposta · lista', 'os modelos que combinam, da tabela'),
    ('vit-hoje-diamante-1toque.png', 'Hoje · 1º toque em Diamante', 'nada acontece (gira um carrossel escondido)'),
    ('vit-hoje-diamante.png', 'Hoje · 2º toque', '"18 modelos" = o catálogo inteiro'),
    ('vit-prop-diamante.png', 'Proposta · 1 toque', '3 modelos gatinho, os que combinam')])

from PIL import Image as I
T = open(os.path.join(AQUI, 'simula.txt')).read().splitlines()
M = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', s)
B = I.new('RGB', (1900, 230 + 44 * len(T)), '#e9e4e8'); d = ImageDraw.Draw(B)
d.text((40, 24), 'IDEIAS 01 · Precisão — por que perto ou torto erra, e a correção', font=F(44, 1), fill='#231a22')
d.text((40, 90), 'Simulação com o rosto-padrão de 468 pontos do leitor do site (sem pessoa real); erro das proporções que decidem o formato.', font=F(26), fill='#6b5d67')
d.text((40, 130), 'Hoje o site já endireita o giro, mas NÃO a distância: a mesma pessoa a 25 cm sai ~14% mais "comprida" do que a 45 cm.', font=F(26), fill='#8d3a69')
for i, l in enumerate(T): d.text((40, 190 + 44 * i), l, font=M(26), fill='#231a22')
B.resize((B.width // 2, B.height // 2), I.LANCZOS).save(os.path.join(AQUI, 'esboco-04-precisao.jpg'), quality=90)
print('ok')

# PC (só conferência: o PC terá design próprio) — Hoje em cima, Proposta embaixo
a = I.open(os.path.join(C, 'pc-hoje.png')).convert('RGB'); b = I.open(os.path.join(C, 'pc-prop.png')).convert('RGB')
B = I.new('RGB', (a.width + 80, 200 + 2 * a.height + 100), '#e9e4e8'); d = ImageDraw.Draw(B)
d.text((40, 24), 'IDEIAS 01 · PC (só conferência) — os cartões mostram os modelos que combinam', font=F(40, 1), fill='#231a22')
d.text((40, 84), 'No PC a página do formato é o carrossel de cartões: a frase vira os modelos que combinam, em 1 linha (hoje 2); os desenhos maiores e do mesmo tamanho.', font=F(26), fill='#6b5d67')
d.text((40, 150), 'Hoje', font=F(30, 1), fill='#b3261e'); B.paste(a, (40, 200))
d.text((40, 200 + a.height + 20), 'Proposta', font=F(30, 1), fill='#8d3a69'); B.paste(b, (40, 250 + a.height + 20))
B.resize((B.width // 2, B.height // 2), I.LANCZOS).save(os.path.join(AQUI, 'esboco-05-pc.jpg'), quality=88)
print('ok pc')

# ---- Parte B: 8 formatos + as melhores peças já no resultado ----
prancha('esboco-07-tabela-filtro.jpg', 'IDEIAS 01 · Parte B — mais formatos e menos opções (celular)', [
    'Lista com 8 formatos (+ Retangular e Triangular; ilustração homem/mulher "a fazer"). Resultado: as 3 MELHORES peças reais já ali, e o botão com o total.',
    'Filtro numa função: combina com o rosto + gênero escolhido + com estoque; primeiro as de tamanho certo (frente da armação a até 6 mm da largura do rosto),',
    'depois as mais vendidas. Sem peça para a escolha: diz isso e o botão vira "Ver o catálogo". Peças e preços: site real (tema Black Friday no ar: cartões escuros).'], [
    ('l8-hoje.png', 'Hoje · lista', '6 formatos'),
    ('l8-prop.png', 'Proposta · lista', '8 formatos'),
    ('prop-3-resultado.png', 'Proposta · Diamante, Todos', 'as 3 gatinho; "Ver todos os 3"'),
    ('prop-5-masculino.png', 'Proposta · Diamante, Masculino', 'não há peça: diz isso'),
    ('rb-redondo.png', 'Proposta · Redondo, rosto 138 mm', '3 de tamanho certo primeiro'),
    ('rb-retangular.png', 'Proposta · Retangular, Feminino', 'formato novo (ilustração a fazer)')])
print('ok B')
