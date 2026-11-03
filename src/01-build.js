  // Número desta versão do app (vem do sw.js na hora de montar) e da parte "nativa" (APK). Usado pela atualização automática.
  var APP_BUILD = __APP_BUILD__;
  var APP_NAT = 1; // sobe só quando uma mudança precisa de APK novo (ex.: canais de som, permissões); aí a atualização automática espera o APK
  var APP_NOME = '__APP_NOME__'; // nome da versão que o dono vê (ex.: 3.4); o número acima é o interno
