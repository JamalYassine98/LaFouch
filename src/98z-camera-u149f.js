  // ===== 149cam-F + 149cam-M2 + 149camX (aprovados 19/11/2026; item 15 da Fila, parte 2) — a câmera do Estúdio confere como a teste-giro/conferir =====
  // Esboços: work/estudio-camera/esboco_149camF_*, esboco_149camM2_*, esboco_149camX.jpg.
  // Uma câmera só (estCam) com dois modos, trocados por UM ícone redondo que mostra o OUTRO modo:
  //  · VÍDEO (abre assim): os 10 itens do conferir ao vivo (✓ certo / ! falta / ○ conferindo), UMA frase = o "fazer" do 1º item que falta,
  //    moldura branca → verde quando tudo ✓, "Gravar a volta" só aceso no verde; ao gravar trava foco/luz/branco, cronômetro m:ss / 1:00 e
  //    para quando a volta fecha (60 s de limite); as fotos (frente, 3/4) saem do giro. Em pé: "Deite o celular" e não grava.
  //  · FOTO: os 4 itens de sempre (fundo, foco, reto, distância) + o disparo branco "Fotografar".
  // As medidas (medeQuadro/confereGiro) são as MESMAS do conferir.js (work/s296), copiadas sem mudar.
  function medeQuadro(img){
    var W=img.width,H=img.height,d=img.data,L=new Float32Array(W*H),i,x,y;
    for(i=0;i<W*H;i++)L[i]=.299*d[i*4]+.587*d[i*4+1]+.114*d[i*4+2];
    function med(a){a.sort(function(p,q){return p-q});return a.length?a[a.length>>1]:0}
    /* parede do fundo: faixa de cima, no meio */
    var am=[];for(y=Math.round(H*.06);y<H*.3;y+=2)for(x=Math.round(W*.35);x<W*.65;x+=2)am.push(L[y*W+x]);
    var parede=med(am),desv=0;for(i=0;i<am.length;i++)desv+=Math.abs(am[i]-parede);desv/=am.length||1;
    /* costuras e quinas: colunas escuras de cima a baixo na faixa de cima */
    var cost=[],y0=Math.round(H*.05),y1=Math.round(H*.34);
    for(x=2;x<W-2;x++){var s=0,n=0,esc=0;for(y=y0;y<y1;y+=2){var v=L[y*W+x];s+=v;n++;if(v<parede*.74)esc++}if(esc/n>.6)cost.push(x)}
    var ehC=new Uint8Array(W);cost.forEach(function(c){for(var k=-4;k<=4;k++)if(c+k>=0&&c+k<W)ehC[c+k]=1});
    /* borda de trás do prato: onde a imagem clareia de cima para baixo (parede cinza → prato claro), fora das costuras */
    var bs=[],fs=[];for(x=Math.round(W*.08);x<W*.92;x+=6){if(ehC[x])continue;var mg=0,my=-1;for(y=Math.round(H*.22);y<H*.8;y++){var g=L[(y+3)*W+x]-L[(y-3)*W+x];if(g>mg){mg=g;my=y}}if(my>0&&mg>7){bs.push(my);fs.push(mg)}}
    var borda=bs.length>10?med(bs.slice()):-1;
    /* peça: o que é ESCURO E FINO em relação ao que está em volta (hastes, aros, armação clara). Paredes, prato e sombras são manchas largas e ficam de fora.
       Conta em meia resolução: "fechamento" (máximo e depois mínimo numa janela de 15 pontos) menos a própria imagem. */
    var w=W>>1,h=H>>1,S=new Float32Array(w*h),A=new Float32Array(w*h),B=new Float32Array(w*h),R=7,k;
    for(y=0;y<h;y++)for(x=0;x<w;x++)S[y*w+x]=(L[2*y*W+2*x]+L[2*y*W+2*x+1]+L[(2*y+1)*W+2*x]+L[(2*y+1)*W+2*x+1])/4;
    function passa(src,dst,mx,hor){for(var yy=0;yy<h;yy++)for(var xx=0;xx<w;xx++){var m=mx?-1:1e9;for(var t=-R;t<=R;t++){var a=hor?Math.min(w-1,Math.max(0,xx+t)):xx,b=hor?yy:Math.min(h-1,Math.max(0,yy+t)),vv=src[b*w+a];if(mx?vv>m:vv<m)m=vv}dst[yy*w+xx]=m}}
    passa(S,A,1,1);passa(A,B,1,0);passa(B,A,0,1);passa(A,B,0,0);
    var M=new Uint8Array(w*h);for(y=1;y<h-1;y++)for(x=1;x<w-1;x++)if(!ehC[2*x]&&B[y*w+x]-S[y*w+x]>parede*.085)M[y*w+x]=1;
    /* junta os pontos em pedaços ligados; joga fora o que é do cenário: riscos que encostam em cima ou nos lados do quadro (quinas da tenda, borda do prato, cabo) */
    var rot=new Int32Array(w*h),ped=[],pilha=new Int32Array(w*h),np_=0;
    for(i=0;i<w*h;i++){if(!M[i]||rot[i])continue;np_++;var t=0;pilha[t++]=i;rot[i]=np_;var c={a:0,x0:w,x1:0,y0:h,y1:0};
      while(t){var p=pilha[--t],xx=p%w,yy=(p-xx)/w;c.a++;if(xx<c.x0)c.x0=xx;if(xx>c.x1)c.x1=xx;if(yy<c.y0)c.y0=yy;if(yy>c.y1)c.y1=yy;
        for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){var x2=xx+dx,y2=yy+dy;if(x2<0||y2<0||x2>=w||y2>=h)continue;var p2=y2*w+x2;if(M[p2]&&!rot[p2]){rot[p2]=np_;pilha[t++]=p2}}}
      c.cen=(c.y0<=h*.1)||c.y1>=h-3||c.x0<=2||c.x1>=w-3||((c.y1-c.y0)>h*.2&&(c.x1-c.x0)<w*.05)||((c.y1-c.y0)<h*.1&&(c.x1-c.x0)>w*.3);ped.push(c)}   /* risco deitado e comprido = linha do prato ou sombra, não é a peça (14/11: inflava a largura medida) */
    var bons=ped.filter(function(c){return !c.cen&&c.a>=25}).sort(function(a,b){return b.a-a.a}),peca=null,cortada=ped.some(function(c){return c.cen&&c.a>w*h*.01&&c.y0>h*.12&&(c.x1-c.x0)>w*.2&&(c.y1-c.y0)>h*.08});
    if(bons.length&&bons[0].a>w*h*.008&&(bons[0].x1-bons[0].x0)>w*.12){var s0=bons[0],ex=(s0.x1-s0.x0)*.25+6,ey=(s0.y1-s0.y0)*.35+6,bx={x0:s0.x0,x1:s0.x1,y0:s0.y0,y1:s0.y1,n:0};
      bons.forEach(function(c){var mx=(c.x0+c.x1)/2,my=(c.y0+c.y1)/2;if(mx>s0.x0-ex&&mx<s0.x1+ex&&my>s0.y0-ey&&my<s0.y1+ey){bx.x0=Math.min(bx.x0,c.x0);bx.x1=Math.max(bx.x1,c.x1);bx.y0=Math.min(bx.y0,c.y0);bx.y1=Math.max(bx.y1,c.y1);bx.n+=c.a}});
      peca={x0:2*bx.x0,x1:2*bx.x1+1,y0:2*bx.y0,y1:2*bx.y1+1,n:bx.n};
      /* nitidez: média dos 5% contornos mais fortes dentro da caixa, relativa ao tom da parede */
      var gs=[];for(y=Math.max(2,peca.y0);y<=Math.min(H-3,peca.y1);y++)for(x=Math.max(2,peca.x0);x<=Math.min(W-3,peca.x1);x++){if(ehC[x])continue;var gg=Math.abs(L[y*W+x+1]-L[y*W+x-1])+Math.abs(L[(y+1)*W+x]-L[(y-1)*W+x]);if(gg>parede*.06)gs.push(gg)}
      gs.sort(function(a,b){return b-a});var nq=Math.max(1,Math.round(gs.length*.05)),sn=0;for(i=0;i<nq;i++)sn+=gs[i];peca.nit=gs.length?sn/nq/parede:0}
    return {W:W,H:H,parede:parede,desv:desv/Math.max(1,parede),cost:cost,borda:borda,peca:peca,cortada:cortada}
  }
  
  /* Decide, a partir das medidas (média dos últimos quadros), o que está certo e o que fazer. Cada item: {id, nome, ok (true/false/null = não deu para conferir), fazer}.
     A peça deve estar DE FRENTE para a câmera na hora de conferir. */
  function confereGiro(m,ex){
    ex=ex||{};var it=[],p=m.peca,W=m.W,H=m.H,ant=ex.ant||{},add=function(id,nome,ok,fazer){it.push({id:id,nome:nome,ok:ok,fazer:ok===false?fazer:''})};
    /* 14/11 (celular real: o aviso ficava trocando com tudo parado): cada item tem FOLGA de troca — quem estava certo só vira errado se sair da faixa
       com folga, e quem estava errado só vira certo se entrar com folga. Assim o chiado da câmera perto do limite não faz o aviso piscar. */
    function faixa(id,v,a,b,f){var era=ant[id];if(era===true)return v>=a-f&&v<=b+f;if(era===false)return v>=a+f&&v<=b-f;return v>=a&&v<=b}
    function acima(id,v,a,f){var era=ant[id];if(era===true)return v>=a-f;if(era===false)return v>=a+f;return v>=a}
    /* esboço 40: "Câmera reta" = deitado E nivelado (|inclinação| ≤ 1°, pelo sensor — camNivel); sem sensor, vale só o deitado. A frase diz o lado e os graus. */
    var nv=ex.nivel,nvOk=nv==null?true:faixa('reto',Math.abs(nv),0,1,.3);
    add('reto','Câmera reta',ex.emPe?false:nvOk,ex.emPe?'Deite o celular':'Endireite o celular: '+Math.max(1,Math.round(Math.abs(nv||0)))+'° para a '+(nv>0?'direita':'esquerda'));
    add('firme','Celular parado',ex.mexe==null?null:!acima('firme_',ex.mexe,1.6,.5),'O celular está mexendo: apoie ou prenda melhor');
    add('luz','Luz do fundo',acima('luz',m.parede,118,6)&&m.desv<.06,m.parede<124?'Falta luz: aumente a luz da caixa':'Fundo manchado: tire sombras e reflexos de trás da peça');
    if(!p){add('peca','Peça no prato',m.cortada?false:null,m.cortada?'A peça está saindo do quadro ou encostada numa costura: afaste o celular e centralize':'Coloque a peça no prato, de frente para a câmera');return fim(it)}
    var larg=(p.x1-p.x0)/W,cx=(p.x0+p.x1)/2/W,zona=[(cx-.75*larg)*W,(cx+.75*larg)*W];
    add('peca','Peça no prato',true,'');
    /* distância: faixa larga de propósito (0,36 a 0,62 da largura). O tratamento aguenta essa variação; o aviso é só para erro grande. */
    add('dist','Distância',faixa('dist',larg,.36,.62,.035),larg<.45?'Aproxime o celular (a peça está pequena)':'Afaste um pouco o celular (a peça gira e precisa de folga)');
    add('meio','Peça no meio do quadro',faixa('meio',cx,.43,.57,.025),cx<.5?'Vire o celular um pouco para a esquerda (a peça está à esquerda)':'Vire o celular um pouco para a direita (a peça está à direita)');
    var r=m.borda>0?(m.borda-p.y0)/Math.max(1,p.y1-p.y0):null;
    add('altura','Altura da câmera',r==null?null:faixa('altura',r,.4,.9,.06),r!=null&&r<.5?'Câmera alta: abaixe o celular até quase a altura da peça':'Câmera baixa demais: suba um pouco o celular');
    var dentro=m.cost.filter(function(c){return c>zona[0]&&c<zona[1]}).length;
    add('costura','Fundo sem costura atrás da peça',ant.costura===true?dentro<3:dentro===0,'Costura da tenda atrás do caminho da peça: cubra com a cartolina branca');
    add('foco','Foco na peça',acima('foco',p.nit,.55,.08),'Fora de foco: toque e segure na peça para travar o foco');
    add('folga','Folga nas bordas',zona[0]>W*(ant.folga===true?0:.02)&&zona[1]<W*(ant.folga===true?1:.98)&&p.y0>H*.05&&p.y1<H*.98,'Sem folga: a peça vai sair do quadro quando girar; afaste o celular');
    return fim(it);
    function fim(it){var ruim=it.filter(function(i){return i.ok===false}),nao=it.filter(function(i){return i.ok===null});
      var mapa={};it.forEach(function(i){mapa[i.id]=i.ok});mapa.firme_=ex.mexe==null?null:!(it.filter(function(i){return i.id==='firme'})[0]||{}).ok;return {itens:it,mapa:mapa,tudo:!ruim.length&&!nao.length,frase:ruim.length?ruim[0].fazer:(nao.length?(nao[0].id==='peca'?'Coloque a peça no prato, de frente para a câmera':'Conferindo…'):'Tudo certo · pode gravar')}}
  }
  var C149_ICO = {
    foto: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    video: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 11l6-3v8l-6-3z"/></svg>',
    gal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9.5" r="1.6"/><path d="M5 18l5-5 3 3 2-2 4 4"/></svg>',
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  // a ordem da lista é a do esboço 149cam-F; os nomes curtos também
  var C149_IT = [['reto', 'Câmera reta'], ['firme', 'Celular parado'], ['luz', 'Luz do fundo'], ['peca', 'Peça no prato'], ['dist', 'Distância'], ['meio', 'Peça no meio'], ['altura', 'Altura da câmera'], ['costura', 'Fundo sem costura'], ['foco', 'Foco na peça'], ['folga', 'Folga nas bordas']],
    C149_FT = [['fundo', 'Fundo branco'], ['foco', 'Foco'], ['reto', 'Reto'], ['dist', 'Distância']];
  function c149Lista(ov, itens) {
    var l = ov.querySelector('.ecLista');
    if (!l) return;
    var h = itens
      .map(function (i) {
        var c = i[2] === true ? 'ok' : i[2] === false ? 'ruim' : 'nao';
        return '<span class="' + c + '"><i aria-hidden="true"></i>' + i[1] + '</span>';
      })
      .join('');
    if (l.innerHTML !== h) {
      l.innerHTML = h;
      c149Cabe(ov);
    }
  }
  function c149Frase(ov, t, ok) {
    var f = ov.querySelector('.ecFrase');
    if (!f) return;
    if (f.lastChild.textContent !== t) {
      f.lastChild.textContent = t;
      c149Cabe(ov);
    }
    f.classList.toggle('ok', !!ok);
  }
  // L4 (regra 14): a coluna da esquerda nunca corta — se a frase e a lista não cabem, a letra do grupo diminui (até 3 degraus)
  function c149Cabe(ov) {
    var L = ov.querySelector('.ecPainel.ecL');
    if (!L || !ov.classList.contains('ecPD')) return ov.removeAttribute('data-cabe');
    lfCabe(ov, function () {
      var corta = [].some.call(L.querySelectorAll('.ecLista span'), function (e) {
        return e.scrollWidth > e.clientWidth + 1;
      });
      return L.scrollHeight > L.clientHeight + 1 || corta;
    });
  }
  // Ao gravar a volta, fixa o que o aparelho deixa fixar SEM mexer na imagem (item 33, 20/11/2026 — no celular do dono a imagem ficou
  // branca, depois desfocada e rosada, depois com um clarão de 1 s ao tocar em gravar). O navegador do Android só segura de verdade o
  // BRANCO: "manual" liga a trava de branco do aparelho no ponto em que ele está. "Manual" no foco e na luz NÃO congela o que a câmera
  // está usando: desliga o automático e põe valores que o navegador não mede (a lente vai para a distância padrão; a luz fica com um
  // tempo de exposição antigo e o ISO padrão) — era isso que estourava a imagem. Por isso foco e luz ficam como estão: no automático,
  // ou já fixos por quem ajustou a câmera antes (Medir fundo, controles). O texto diz só o que ficou fixo de verdade.
  function c149Trava(t) {
    if (!t || !t.getCapabilities) return Promise.resolve('');
    var c = t.getCapabilities(),
      s = t.getSettings ? t.getSettings() : {},
      q = [],
      fixo = function (modo) {
        return s[modo] === 'manual' || s[modo] === 'none';
      },
      txt = function () {
        return q.length ? 'Travado: ' + q.join(', ') : 'Este aparelho não deixa travar foco e luz';
      };
    if (fixo('focusMode')) q.push('foco');
    if (fixo('exposureMode')) q.push('luz');
    if (fixo('whiteBalanceMode')) q.push('branco');
    if (fixo('whiteBalanceMode') || !(c.whiteBalanceMode && c.whiteBalanceMode.indexOf('manual') >= 0)) return Promise.resolve(txt());
    return t.applyConstraints({ advanced: [{ whiteBalanceMode: 'manual' }] }).then(function () {
      q.push('branco');
      return txt();
    }, txt);
  }
  function c149Mediana(a) {
    a = a.slice().sort(function (p, q) {
      return p - q;
    });
    return a[a.length >> 1];
  }
  // ===== 149cam-G (aprovado 19/11/2026; item 15 parte 3) — guias finas NA imagem, sem texto (esboço work/estudio-camera/esboco_149camG_deitado.jpg)
  // As posições vêm da mesma medição do conferidor (caixa da peça no quadro 640×360) levada para a tela com o mesmo "cover" do vídeo.
  //  · nível: linha do horizonte nas duas laterais (no meio da altura) — verde com o celular deitado
  //  · meio: traço do centro em cima e embaixo + triângulos no centro da peça; fora do meio, seta ← ou → para onde virar
  //  · distância: colchetes = faixa onde as pontas da peça devem ficar (36–62% da largura do quadro) + traços nas pontas da peça; errado = setas
  //    para fora (aproxime) ou para dentro (afaste)
  //  · altura: pontos nas laterais na altura do centro da peça
  // Verde = certo, amarelo = errado. Só no Vídeo, com o celular deitado e fora da gravação.
  var C149_V = '#2fe08f',
    C149_A = '#e9b04a',
    C149_B = 'rgba(255,255,255,.85)';
  function c149Guias(ov, r, mm, vid) {
    var vf = ov.querySelector('.ecVf'),
      g = vf && vf.querySelector('.ecGuias');
    if (!vf) return;
    if (!g) {
      g = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      g.setAttribute('class', 'ecGuias');
      g.setAttribute('aria-hidden', 'true');
      vf.appendChild(g);
    }
    var W = vf.clientWidth,
      H = vf.clientHeight;
    if (!r || !W || !H) return (g.innerHTML = '');
    g.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var M = r.mapa || {},
      cor = function (k) {
        return k === true ? C149_V : C149_A;
      },
      ln = function (x1, y1, x2, y2, c, w) {
        return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + c + '" stroke-width="' + w + '"/>';
      },
      pa = function (d, c, w, f) {
        return '<path d="' + d + '" ' + (f ? 'fill="' + c + '" stroke="none"' : 'stroke="' + c + '" stroke-width="' + w + '" fill="none"') + '/>';
      },
      sv = '';
    // nível: horizonte nas laterais, girado pela inclinação real do celular (esboço 40); torto = amarelo, com os graus, e o tracejado branco mostra o reto
    var nv = M.reto === false && r.nivel != null ? r.nivel : 0,
      rad = (nv * Math.PI) / 180,
      hz = function (d1, d2) {
        return ln(W / 2 + Math.cos(rad) * d1, H / 2 + Math.sin(rad) * d1, W / 2 + Math.cos(rad) * d2, H / 2 + Math.sin(rad) * d2, cor(M.reto), 2);
      };
    sv += hz(-W * 0.44, -W * 0.3) + hz(W * 0.3, W * 0.44);
    if (nv) {
      sv += '<line x1="' + (W * 0.06).toFixed(1) + '" y1="' + (H / 2).toFixed(1) + '" x2="' + (W * 0.2).toFixed(1) + '" y2="' + (H / 2).toFixed(1) + '" stroke="' + C149_B + '" stroke-width="1" stroke-dasharray="4 4"/>' +
        '<line x1="' + (W * 0.8).toFixed(1) + '" y1="' + (H / 2).toFixed(1) + '" x2="' + (W * 0.94).toFixed(1) + '" y2="' + (H / 2).toFixed(1) + '" stroke="' + C149_B + '" stroke-width="1" stroke-dasharray="4 4"/>' +
        '<text x="' + (W * 0.94).toFixed(1) + '" y="' + (H / 2 + Math.sin(rad) * W * 0.44 - 10).toFixed(1) + '" fill="' + C149_A + '" font-size="15" font-weight="700" text-anchor="end" font-family="system-ui,Roboto">' + Math.max(1, Math.round(Math.abs(nv))) + '°</text>';
    }
    // meio: traço do centro da imagem
    sv += ln(W / 2, H * 0.06, W / 2, H * 0.16, C149_B, 2) + ln(W / 2, H * 0.84, W / 2, H * 0.94, C149_B, 2);
    var p = mm && mm.peca,
      vw = vid.videoWidth,
      vh = vid.videoHeight;
    if (p && vw && vh) {
      // quadro 640×360 → vídeo → tela (object-fit: cover)
      var s = Math.max(W / vw, H / vh),
        ox = (W - vw * s) / 2,
        oy = (H - vh * s) / 2,
        X = function (fx) {
          return ox + (fx / 640) * vw * s;
        },
        Y = function (fy) {
          return oy + (fy / 360) * vh * s;
        },
        l = X(p.x0),
        rr = X(p.x1),
        cx = (l + rr) / 2,
        cy = (Y(p.y0) + Y(p.y1)) / 2,
        larg = (p.x1 - p.x0) / 640;
      sv += pa('M' + (cx - 7) + ' ' + H * 0.06 + ' L' + cx + ' ' + (H * 0.06 + 10) + ' L' + (cx + 7) + ' ' + H * 0.06 + 'Z', cor(M.meio), 0, 1);
      sv += pa('M' + (cx - 7) + ' ' + H * 0.94 + ' L' + cx + ' ' + (H * 0.94 - 10) + ' L' + (cx + 7) + ' ' + H * 0.94 + 'Z', cor(M.meio), 0, 1);
      if (M.meio === false) {
        var dir = cx < W / 2 ? -1 : 1,
          ax = W / 2 + dir * 40,
          ay = H * 0.11;
        sv += pa('M' + (W / 2 + dir * 14) + ' ' + ay + ' H' + ax + ' M' + (ax - dir * 8) + ' ' + (ay - 7) + ' L' + ax + ' ' + ay + ' L' + (ax - dir * 8) + ' ' + (ay + 7), C149_A, 3);
      }
      // distância: faixa das pontas (36–62% da largura) de cada lado + traços nas pontas da peça
      // a faixa é medida no quadro inteiro (36–62% da largura dele), por isso passa pelo mesmo X() — no celular a imagem é cortada nos lados
      [[0.5 - 0.18, 0.5 - 0.31], [0.5 + 0.18, 0.5 + 0.31]].forEach(function (z) {
        var a1 = X(640 * Math.min(z[0], z[1])),
          a2 = X(640 * Math.max(z[0], z[1]));
        sv += pa('M' + a1 + ' ' + H * 0.74 + ' V' + H * 0.78 + ' H' + a2 + ' V' + H * 0.74, cor(M.dist), 2);
      });
      sv += ln(l, H * 0.7, l, H * 0.8, cor(M.dist), 3) + ln(rr, H * 0.7, rr, H * 0.8, cor(M.dist), 3);
      if (M.dist === false) {
        // perto demais: setas para dentro (afaste); longe: setas para fora (aproxime)
        var dentro = larg > 0.5 ? 1 : -1,
          yy = H * 0.75,
          sl = function (x0, d) {
            return 'M' + (x0 - d * 6) + ' ' + (yy - 6) + ' L' + x0 + ' ' + yy + ' L' + (x0 - d * 6) + ' ' + (yy + 6);
          };
        sv += pa(sl(l + dentro * 14, dentro), C149_A, 2.5) + pa(sl(rr - dentro * 14, -dentro), C149_A, 2.5);
      }
      // altura: pontos nas laterais na altura do centro da peça
      sv += '<circle cx="' + W * 0.13 + '" cy="' + cy.toFixed(1) + '" r="5" fill="' + cor(M.altura) + '"/><circle cx="' + W * 0.87 + '" cy="' + cy.toFixed(1) + '" r="5" fill="' + cor(M.altura) + '"/>';
    }
    if (g.innerHTML !== sv) g.innerHTML = sv;
  }
  // monta o modo Foto/Vídeo na câmera já desenhada pelo 149cam (chamado no fim do cam149Monta)
  function cam149Modos(ov) {
    if (!ov || ov._c149f) return;
    ov._c149f = 1;
    var q = function (s) {
        return ov.querySelector(s);
      },
      ctx = ov._ctx || {},
      tag = q('.ecTag'),
      vf = q('.ecVf'),
      vid = q('#ecV');
    if (tag) tag.dataset.orig = tag.textContent;
    var lista = document.createElement('div');
    lista.className = 'ecLista';
    lista.setAttribute('role', 'list');
    ov.appendChild(lista);
    var trava = document.createElement('div');
    trava.className = 'ecTrava';
    ov.appendChild(trava);
    var crono = document.createElement('div');
    crono.className = 'ecCrono';
    crono.hidden = true;
    if (vf) vf.appendChild(crono);
    var so = ov.dataset.modo === 'so-foto';
    if (!so) {
      var tr = document.createElement('button');
      tr.type = 'button';
      tr.className = 'ecPill ecModo';
      ov.appendChild(tr);
      var rec = document.createElement('div');
      rec.className = 'ecDisp ecDispRec';
      rec.innerHTML = '<button type="button" class="ecRec" id="ecRec" disabled aria-label="Gravar a volta"><i></i></button><small>Gravar a volta</small>';
      ov.appendChild(rec);
    }
    var gal = q('.ecGal');
    if (gal) {
      gal.innerHTML = C149_ICO.gal;
      gal.setAttribute('aria-label', 'Galeria');
      gal.classList.add('ecPill');
    }
    var x = q('[data-c=x]:not(.ecPronto)');
    if (x) x.innerHTML = C149_ICO.x; // 149camX: × de traço 20 px, como os outros ícones
    var sh = q('.ecSh');
    if (sh && !sh.parentNode.classList.contains('ecDisp')) {
      var w = document.createElement('div');
      w.className = 'ecDisp ecDispFoto';
      sh.parentNode.insertBefore(w, sh);
      w.appendChild(sh);
      var sm = document.createElement('small');
      sm.textContent = 'Fotografar';
      w.appendChild(sm);
    }
    // ---- estado do Vídeo
    var V = { hist: [], ant: null, antR: {}, bons: 0, ok: false, grav: null, emPe: false },
      cv = document.createElement('canvas');
    cv.width = 640;
    cv.height = 360;
    var cx = cv.getContext('2d', { willReadFrequently: true });
    var modo = function (m) {
      ov.dataset.modo = m;
      V.hist = [];
      V.ant = null;
      V.antR = {};
      V.bons = 0;
      V.ok = false;
      if (tag) tag.textContent = m === 'video' ? 'Giro · volta de 360°' : tag.dataset.orig;
      if (tr) {
        tr.innerHTML = m === 'video' ? C149_ICO.foto : C149_ICO.video;
        tr.setAttribute('aria-label', m === 'video' ? 'Mudar para foto' : 'Mudar para vídeo');
      }
      ov.classList.remove('ecVok');
      trava.textContent = '';
      if (m === 'video') {
        c149Lista(ov, C149_IT.map(function (i) { return [i[0], i[1], null]; }));
        c149Frase(ov, 'Conferindo…', false);
      }
      if (typeof cam149Arruma === 'function') cam149Arruma(ov);
      c149Cabe(ov);
    };
    if (tr)
      tr.onclick = function (e) {
        e.stopPropagation();
        if (V.grav) return;
        modo(ov.dataset.modo === 'video' ? 'foto' : 'video');
      };
    var recB = q('#ecRec');
    if (recB)
      recB.onclick = function (e) {
        e.stopPropagation();
        if (V.grav) return V.grav.para();
        if (!V.ok || V.emPe || !EST_ST || !vid) return;
        V.grav = { para: function () {} };
        ov.classList.add('ecGrav');
        recB.setAttribute('aria-label', 'Parar');
        recB.nextSibling.textContent = 'Parar';
        c149Frase(ov, 'Ligue o prato agora e não toque mais no celular', true);
        var track = EST_ST.getVideoTracks()[0];
        c149Trava(track).then(function (txt) {
          trava.textContent = txt;
          camDiario('trava', { txt: txt, aparelho: track.getSettings ? track.getSettings() : null });
          if (!ov.isConnected) return;
          try {
            V.grav = giroGrava(EST_ST, vid, { k: ctx.k || null, fim: ctx.prox || ctx.fim }, { // na sessão (fila) segue para a próxima peça
              tick: function (seg) {
                var s = Math.min(GIRO_MAX, Math.floor(seg)),
                  z = function (n) { return (n < 10 ? '0' : '') + n; };
                crono.hidden = false;
                crono.textContent = Math.floor(s / 60) + ':' + z(s % 60) + ' / 1:00';
                c149Frase(ov, seg < 6 ? 'Ligue o prato agora e não toque mais no celular' : 'Gravando a volta… não toque no celular', true);
              },
              fecha: function () {
                estFechaCam();
              }
            });
          } catch (er) {
            V.grav = null;
            ov.classList.remove('ecGrav');
            lfToast('Não consegui começar a gravar', 'erro');
          }
        });
      };
    // ---- conferência ao vivo (Vídeo) e lista dos 4 itens (Foto), a cada 0,28 s
    var roda = function () {
      if (!ov.isConnected) return;
      setTimeout(roda, 280);
      if (document.hidden) return;
      var m = ov.dataset.modo;
      if (m !== 'video') {
        c149Guias(ov, null);
        if (ov.classList.contains('ecMedir')) return c149Lista(ov, []);
        var ch = q('#ecChips');
        return c149Lista(ov, C149_FT.map(function (i) {
          var s = ch && ch.querySelector('[data-k="' + i[0] + '"]');
          return [i[0], i[1], !!(s && s.classList.contains('ok'))];
        }));
      }
      if (V.grav) return c149Guias(ov, null); // gravando: não mede nada (o celular fica só gravando), igual ao conferir
      var vw = vid && vid.videoWidth,
        vh = vid && vid.videoHeight;
      if (!vw) return;
      var emPe = vw < vh || innerHeight > innerWidth;
      V.emPe = emPe;
      cx.fillStyle = '#000';
      cx.fillRect(0, 0, 640, 360);
      if (vw < vh) {
        var ww = (360 * vw) / vh;
        cx.drawImage(vid, (640 - ww) / 2, 0, ww, 360);
      } else cx.drawImage(vid, 0, 0, 640, 360);
      var img = cx.getImageData(0, 0, 640, 360),
        me = medeQuadro(img),
        d = img.data,
        mexe = null,
        at = new Uint8Array(160 * 40),
        k = 0;
      // celular parado? compara a faixa de cima (parede, que não gira) com a do quadro anterior
      for (var yy = 18; yy < 98; yy += 2) for (var xx = 160; xx < 480; xx += 2) at[k++] = d[(yy * 640 + xx) * 4 + 1];
      if (V.ant) {
        var sm2 = 0;
        for (k = 0; k < at.length; k++) sm2 += Math.abs(at[k] - V.ant[k]);
        mexe = sm2 / at.length;
      }
      V.ant = at;
      V.hist.push({ m: me, mexe: mexe });
      if (V.hist.length > 12) V.hist.shift(); // ~3,5 s de memória: vale a medida do meio
      var H = V.hist,
        com = H.filter(function (h) { return h.m.peca; }),
        mm = {
          W: 640,
          H: 360,
          parede: c149Mediana(H.map(function (h) { return h.m.parede; })),
          desv: c149Mediana(H.map(function (h) { return h.m.desv; })),
          cost: me.cost,
          borda: c149Mediana(H.map(function (h) { return h.m.borda; })),
          cortada: me.cortada
        };
      if (com.length >= Math.ceil(H.length / 2)) {
        var f = function (n) { return c149Mediana(com.map(function (h) { return h.m.peca[n]; })); };
        mm.peca = { x0: f('x0'), x1: f('x1'), y0: f('y0'), y1: f('y1'), nit: f('nit') };
      }
      var mx = H.filter(function (h) { return h.mexe != null; }).map(function (h) { return h.mexe; }),
        r = confereGiro(mm, { emPe: emPe, nivel: camNivel(), mexe: mx.length ? c149Mediana(mx) : null, ant: V.antR });
      r.nivel = camNivel();
      V.antR = r.mapa;
      V.bons = r.tudo ? V.bons + 1 : 0;
      V.ok = V.bons >= 4 && !emPe;
      V.r = r;
      ov.__c149 = { r: r, m: mm, ok: V.ok };
      c149Lista(ov, C149_IT.map(function (i) {
        var it = r.itens.filter(function (x) { return x.id === i[0]; })[0];
        return [i[0], i[1], it ? it.ok : null];
      }));
      c149Frase(ov, r.tudo && !V.ok ? 'Quase… segure assim' : r.frase, V.ok);
      ov.classList.toggle('ecVok', V.ok);
      c149Guias(ov, emPe ? null : r, mm, vid); // 149cam-G
      if (recB) {
        recB.disabled = !V.ok;
        recB.classList.toggle('pronto', V.ok);
      }
    };
    modo(ov.dataset.modo === 'so-foto' ? 'so-foto' : ov.dataset.modo);
    setTimeout(roda, 300);
  }
