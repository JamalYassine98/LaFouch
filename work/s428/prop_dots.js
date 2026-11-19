/* S428 esboço BOLINHAS DO DESTAQUE (polida, mantém a cara): hoje os centros ficam a ~14 px um do outro — o dedo acerta a vizinha
   (regra de toque: no mínimo 24 px). Proposta: mesmas bolinhas e a mesma pílula, só mais espaço entre elas (18 px) e uma área de toque
   invisível de 24 px em cada uma. */
(function(){var s=document.createElement('style');s.textContent='html body .hdots{gap:18px!important}html body .hdots button{position:relative}html body .hdots button:after{content:"";position:absolute;left:50%;top:50%;width:24px;height:24px;transform:translate(-50%,-50%)}';document.head.appendChild(s)})();
