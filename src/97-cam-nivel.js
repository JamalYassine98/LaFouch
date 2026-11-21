  // ===== Nível da câmera — um sensor, uma função (esboço 40, aprovado 21/11/2026) =====
  // camNivel() → quantos graus o horizonte aparece inclinado na tela (positivo = lado direito mais baixo → "endireite para a direita"),
  // ou null quando o aparelho não tem o sensor ou está quase deitado na mesa. Vale em pé e deitado: a inclinação é medida em relação ao eixo
  // da tela mais próximo da gravidade (sai sempre entre −45° e 45°). Usam: modo Foto ("Reto"), fotos padrão e o conferidor do Vídeo ("Câmera reta").
  // Conta: a gravidade vista pelo aparelho é (cosβ·senγ, −senβ, −cosβ·cosγ) — β e γ do evento deviceorientation.
  var CAM_NIVEL = { v: null, ts: 0, on: false };
  function camNivelDe(beta, gamma) {
    if (beta == null || gamma == null) return null;
    var R = Math.PI / 180, dx = Math.cos(beta * R) * Math.sin(gamma * R), dy = -Math.sin(beta * R), dz = -Math.cos(beta * R) * Math.cos(gamma * R);
    if (Math.abs(dz) > 0.94) return null; // quase deitado na mesa: não há horizonte para medir
    var bruto = Math.atan2(-dx, -dy) / R;
    return bruto - 90 * Math.round(bruto / 90);
  }
  function camNivel() {
    if (!CAM_NIVEL.on) {
      CAM_NIVEL.on = true;
      try {
        window.addEventListener('deviceorientation', function (e) {
          var n = camNivelDe(e.beta, e.gamma);
          // alisa o chiado do sensor (cada leitura puxa 35%); salto grande (virou o aparelho) vale na hora
          CAM_NIVEL.v = n == null ? null : CAM_NIVEL.v == null || Math.abs(n - CAM_NIVEL.v) > 8 ? n : CAM_NIVEL.v + (n - CAM_NIVEL.v) * 0.35;
          CAM_NIVEL.ts = Date.now();
        });
      } catch (e) {}
    }
    return CAM_NIVEL.ts && Date.now() - CAM_NIVEL.ts < 3000 ? CAM_NIVEL.v : null; // sensor calado há 3 s = sem leitura
  }
