  // Número desta versão do app (vem do sw.js na hora de montar) e da parte "nativa" (APK). Usado pela atualização automática.
  var APP_BUILD = __APP_BUILD__;
  var APP_NAT = 2; // 2 (26/11): APK com a atualização ao vivo (CapacitorUpdater). Sobe só quando uma mudança precisa de APK novo (ex.: canais de som, permissões); aí a atualização automática espera o APK
  var APP_NOME = '__APP_NOME__'; // nome da versão que o dono vê (ex.: 3.4); o número acima é o interno
  // Bibliotecas de terceiros que o app usa de vez em quando VÊM DENTRO do app.js, como texto (o build.js põe aqui o conteúdo de lib/*.js),
  // e só são lidas pelo aparelho na hora do uso (item 35, 20/11/2026):
  //  · a atualização automática só leva app.js e style.css — arquivo solto novo não chega a quem já tem o aplicativo instalado
  //    (no celular do dono o tratamento do giro parava no meio: giro/mp4-muxer.js entrou no projeto depois do APK dele);
  //  · elas usam escrita que aparelho antigo não entende; como texto, não impedem o app de abrir nesses aparelhos.
  var APP_LIBS = __APP_LIBS__,
    APP_LIB_PRONTA = {};
  function appLib(nome, exporta) {
    // ex.: appLib('mp4-muxer', 'Mp4Muxer')
    if (!APP_LIB_PRONTA[nome]) APP_LIB_PRONTA[nome] = new Function(APP_LIBS[nome] + '\nreturn ' + exporta + ';')();
    return APP_LIB_PRONTA[nome];
  }
