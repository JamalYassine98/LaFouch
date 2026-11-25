# ARGUS · tempo (lentidão), parte do motor: quanto o app demora para abrir e para responder a cada toque, com a loja cheia
# (dia de evento). Conta do toque até a tela parar de mudar (nenhuma mudança por 150 ms). Limites escritos só aqui.
ABRIR_MS = 3000; TOQUE_MS = 500   # simulador de PC; no celular é mais lento, então o limite aqui é apertado de propósito
from js import js
MEDE = js('tempo')   # motor/js/tempo.js (o mesmo no Android emulado)
