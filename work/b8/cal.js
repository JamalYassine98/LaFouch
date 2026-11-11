  /* calendário automático da Temática (11/11/2026, S134): datas do comércio; o painel guarda só o estado (config/site.cal) */
  function calOc(y){
    function d(Y,M,D,f){return new Date(Y,M-1,D,f?23:0,f?59:0,f?59:0,f?999:0).getTime()}
    var n1=new Date(y,10,1),bf=1+(4-n1.getDay()+7)%7+21+1,cy=new Date(y,10,bf+3),j1=new Date(y,5,1),p2=1+(7-j1.getDay())%7+7,BC={2026:[19,22]},L=[];
    if(BC[y])L.push({id:'bfcde',nm:'Black Friday CDE',tema:'bf',ini:d(y,11,BC[y][0]),fim:d(y,11,BC[y][1],1),org:'Câmara de Comércio de CDE',fonte:'Câmara de Comércio e Serviços de CDE',nova:1,y:y});
    L.push({id:'bf',nm:'Black Friday',tema:'bf',ini:d(y,11,bf),fim:d(y,11,bf,1),org:'Data internacional'});
    L.push({id:'cyber',nm:'Cyber Monday',tema:'bf',ini:cy.getTime(),fim:d(cy.getFullYear(),cy.getMonth()+1,cy.getDate(),1),org:'Data internacional',bar:'⚡ CYBER MONDAY · ofertas em toda a loja',th:'CYBER <em>MONDAY</em>',lab:'SÓ HOJE'});
    L.push({id:'natal',nm:'Natal',tema:'natal',ini:d(y,12,1),fim:d(y,12,25,1),org:'Data fixa'});
    L.push({id:'anonovo',nm:'Ano Novo',tema:'anonovo',ini:d(y,12,26),fim:d(y+1,1,1,1),org:'Data fixa'});
    L.push({id:'maes',nm:'Dia das Mães',tema:'maes',ini:d(y,5,1),fim:d(y,5,15,1),org:'Data fixa no Paraguai',nv:1});
    L.push({id:'pais',nm:'Dia dos Pais',tema:'pais',ini:d(y,6,1),fim:d(y,6,p2,1),org:'2º domingo de junho no Paraguai',nv:1});
    L.push({id:'halloween',nm:'Halloween',tema:'halloween',ini:d(y,10,24),fim:d(y,10,31,1),org:'Data fixa',pad:'off'});
    return L}
  var CAL_IDS=['bfcde','bf','cyber','natal','anonovo','maes','pais','halloween','crazy'];
  /* a próxima vez de cada data (o que já passou sai e volta com a data do ano que vem); sem data = "Data a confirmar" */
  function calProx(ag){var out=[],sem=[],y=new Date(ag).getFullYear(),T={};
    for(var k=y-1;k<=y+2;k++)calOc(k).forEach(function(x){if(x.fim>=ag&&(!T[x.id]||x.ini<T[x.id].ini))T[x.id]=x});
    CAL_IDS.forEach(function(id){if(T[id])out.push(T[id]);else if(id==='crazy')sem.push({id:'crazy',nm:'Crazy Week CDE',org:'Câmara de Comércio de CDE',sd:1});else if(id==='bfcde')sem.push({id:'bfcde',nm:'Black Friday CDE',org:'Câmara de Comércio de CDE',sd:1})});
    out.sort(function(a,b){return a.ini-b.ini});return {L:out,sem:sem}}
  function calSt(cfg,x){if(x.sd)return 'wait';var c=((cfg&&cfg.cal)||{})[x.id];return c==='auto'||c==='off'?c:(x.pad||'auto')}
