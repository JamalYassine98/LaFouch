# ARGUS · aparelhos (Parte 0). A FAIXA é por lógica: telas menores e maiores que qualquer celular de hoje, para provar que o
# app e o site encaixam sem tamanho fixo. O celular do dono entra como MAIS UM (dados/../aparelho_dono.json), nunca como referência.
import json, os
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_dono = json.load(open(os.path.join(D, 'aparelho_dono.json')))
# nome: (largura, altura, pontos por pixel, toque)
FAIXA = {
    'celular 320': (320, 640, 2, True), 'celular 360': (360, 760, 3, True), 'celular 390': (390, 844, 3, True),
    'Xiaomi 13T (dono)': (_dono['tela_css'][0], _dono['tela_css'][1], _dono['pontos_por_pixel'], True),
    'celular 430': (430, 932, 3, True), 'celular deitado': (915, 412, 3, True),
    'tablet 768': (768, 1024, 2, True), 'tablet deitado': (1180, 820, 2, True),
    'PC 1280': (1280, 800, 1, False), 'PC 1440': (1440, 900, 1, False), 'PC 1920': (1920, 1080, 1, False), 'PC 2560': (2560, 1440, 1, False),
}
DONO = 'Xiaomi 13T (dono)'
# Modos de cada setor (dono 24/11 15:34–15:40): nenhuma regra de um lado roda no outro.
MODOS = {
    'app': {'tema': ['claro', 'escuro'], 'letra': [1.0, 1.15, 1.3]},          # as 3 letras do app (aplicadas na Parte 5)
    'site': {'tema': ['claro'], 'letra': [1.0, 1.1, 1.2], 'lingua': ['pt-BR', 'es-PY']},  # letra do Android; temáticas na Parte 7
}
