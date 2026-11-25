# ARGUS · setor App · os modos do app (dono 24/11): claro E escuro · as 3 letras do app (1×, 1,15×, 1,3×) · com e sem biometria.
# A letra grande do Android, no APK, aumenta o TEXTO do WebView (textZoom). No simulador: motor/js/letra.js (abrir.abre(letra=…)),
# que aumenta os tamanhos do CSS antes de o app desenhar; a conferência de verdade da letra é no emulador Android.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'motor'))
from js import js
BIO = js('biometria', 'app'); ERRO_SALVAR = js('erro_salvar', 'app')   # setor_app/js/
LETRAS = [1.0, 1.15, 1.3]
TEMAS = ['claro', 'escuro']
