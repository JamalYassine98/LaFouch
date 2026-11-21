"""Simulação (sem pessoa real): o rosto-padrão de 468 pontos do leitor do site, fotografado em várias distâncias e
cabeça torta. Compara as proporções medidas na foto como hoje (2D) com a medida corrigida (endireitar 3D + desfazer a
perspectiva pela distância). Câmera frontal típica: 75° de abertura, foto de 1080 px. Uso: python3 simula.py"""
import json, math
V = [(x, y, z) for x, y, z in json.load(open('canon.json'))]
F = 1080 / 2 / math.tan(math.radians(37.5))
def rot(p, yaw, pitch, roll):
    x, y, z = p; a, b, c = map(math.radians, (yaw, pitch, roll))
    x, z = x*math.cos(a)+z*math.sin(a), -x*math.sin(a)+z*math.cos(a)
    y, z = y*math.cos(b)-z*math.sin(b), y*math.sin(b)+z*math.cos(b)
    x, y = x*math.cos(c)-y*math.sin(c), x*math.sin(c)+y*math.cos(c)
    return x, y, z
def foto(D, yaw, pitch, roll):  # z do modelo aponta para a câmera
    return [(F*x/(D-z), F*y/(D-z), z) for x, y, z in (rot(p, yaw, pitch, roll) for p in V)]
def med(P):
    d = lambda i, j: math.dist(P[i][:2], P[j][:2]); W = d(234, 454)
    return d(10, 152)/W, d(54, 284)/W, d(172, 397)/W
def corrige(P, D, yaw, pitch, roll):  # desfaz a perspectiva (distância) e gira de volta (pose que o leitor já dá)
    Q = [(x*(D-z)/F, y*(D-z)/F, z) for x, y, z in P]
    Q = [rot(q, 0, 0, -roll) for q in Q]; Q = [rot(q, 0, -pitch, 0) for q in Q]; Q = [rot(q, -yaw, 0, 0) for q in Q]
    return Q
ref = med(V); print('rosto-padrão de frente, sem perspectiva: comp/larg %.3f · testa %.3f · mandíbula %.3f' % ref)
print('%-34s %-24s %-24s %-22s' % ('situação', 'só a foto (2D)', 'site hoje (endireita)', 'proposta (+distância)'))
for nome, D, y, p, r in [('braço esticado 45 cm, reto', 45, 0, 0, 0), ('perto 25 cm, reto', 25, 0, 0, 0), ('muito perto 18 cm', 18, 0, 0, 0),
                         ('45 cm, cabeça de lado 10°', 45, 0, 0, 10), ('45 cm, virada 15°', 45, 15, 0, 0), ('45 cm, queixo pra cima 15°', 45, 0, -15, 0),
                         ('30 cm, virada 15° + inclinada 10°', 30, 15, 10, 10), ('45 cm, virada 30°', 45, 30, 0, 0)]:
    P = foto(D, y, p, r); h = med(P); c = med(corrige(P, D, y, p, r))
    g = med([rot(rot(rot(q, 0, 0, -r), 0, -p, 0), -y, 0, 0) for q in [(x, yy, z*F/D) for x, yy, z in P]])
    e = lambda m: ' '.join('%+5.1f%%' % (100*(m[i]/ref[i]-1)) for i in range(3))
    print('%-34s %-24s %-24s %-22s' % (nome, e(h), e(g), e(c)))
print('(corrigido = com a pose e a distância exatas; no celular elas vêm do leitor e da íris, com algum erro)')
print('(erro de comp/larg · testa · mandíbula; 30° virada: um lado do rosto some atrás do nariz — o leitor inventa esse lado)')
