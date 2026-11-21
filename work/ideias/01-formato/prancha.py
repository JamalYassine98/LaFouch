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
    'Proposta: no lugar da foto do cliente com o contorno roxo, a ilustração do formato (a mesma da lista "Escolha o seu formato"), num quadro rosado.',
    'Feminino/Masculino/Todos troca a ilustração. Conserto junto: com "também tem traços de", escolher Feminino trocava o texto para o 2º formato.',
    'Foto de teste: silhueta feita do rosto-padrão de 478 pontos do próprio leitor do site (sem foto de pessoa real). Peças e textos: site real 1795264209.'], [
    ('hoje-3-resultado.png', 'Hoje · resultado', 'foto do cliente + contorno roxo + anel'),
    ('prop-3-resultado.png', 'Proposta · resultado', 'ilustração do formato, Todos = os dois'),
    ('hoje-6-tracos-feminino.png', 'Hoje · traços + Feminino', 'ERRO: diz Diamante e mostra a dica do Redondo'),
    ('prop-6-tracos-feminino.png', 'Proposta · traços + Feminino', 'só a ilustração feminina; dica certa'),
    ('prop-5-masculino.png', 'Proposta · Masculino', 'só a ilustração masculina'),
    ('prop-L12-3-resultado.png', 'Proposta · letra 1,2×', 'cabe sem quebrar')])

prancha('esboco-02-camera.jpg', 'IDEIAS 01 · Descubra seu formato — câmera (celular)', [
    'A tela não muda: só os avisos. A câmera ao vivo passa a usar a mesma leitura de 478 pontos da medida (hoje usa outra, mais simples),',
    'então avisa a distância (pela íris) e a cabeça torta ANTES de contar 3-2-1, e mede ~1,5 s de vídeo (vários quadros) em vez de 1 foto.',
    'Câmera de teste do simulador (imagem verde, sem rosto): os 3 avisos da Proposta foram escritos por cima para mostrar como ficam.'], [
    ('cam-hoje.png', 'Hoje · câmera', 'aviso de hoje (sem rosto na câmera de teste)'),
    ('cam-prop-distancia.png', 'Proposta · muito perto', 'íris grande demais = celular perto'),
    ('cam-prop-reta.png', 'Proposta · cabeça torta', 'giro ou inclinação acima de ~10°'),
    ('cam-prop-medindo.png', 'Proposta · medindo', 'depois do 3-2-1: ~1,5 s, vários quadros')])
print('ok')
