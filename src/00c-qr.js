/* Gerador de QR Code (modo bytes, correção M). Usado no pagamento por PIX. window.LFqr.svg(texto) devolve um <svg>. */
(function(){
var EPB=[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28];
var NB=[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49];
function raw(v){var r=(16*v+128)*v+64;if(v>=2){var n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r}
function ndata(v){return Math.floor(raw(v)/8)-EPB[v]*NB[v]}
function utf8(s){return Array.prototype.slice.call(unescape(encodeURIComponent(s))).map(function(c){return c.charCodeAt(0)})}
function mul(x,y){var z=0;for(var i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z&255}
function rsGen(d){var r=[];for(var i=0;i<d-1;i++)r.push(0);r.push(1);var root=1;for(var i=0;i<d;i++){for(var j=0;j<r.length;j++){r[j]=mul(r[j],root);if(j+1<r.length)r[j]^=r[j+1]}root=mul(root,2)}return r}
function rsRem(data,gen){var r=gen.map(function(){return 0});data.forEach(function(b){var f=b^r.shift();r.push(0);gen.forEach(function(c,i){r[i]^=mul(c,f)})});return r}
function bit(x,i){return((x>>>i)&1)!==0}
function make(text){
  var data=utf8(text),ver,cap;
  for(ver=1;ver<=40;ver++){var cc=ver<10?8:16;if(4+cc+data.length*8<=ndata(ver)*8)break}
  if(ver>40)throw new Error('texto grande demais');
  var bits=[];function put(v,n){for(var i=n-1;i>=0;i--)bits.push((v>>>i)&1)}
  put(4,4);put(data.length,ver<10?8:16);data.forEach(function(b){put(b,8)});
  cap=ndata(ver)*8;put(0,Math.min(4,cap-bits.length));while(bits.length%8)bits.push(0);
  for(var pad=0xEC;bits.length<cap;pad^=0xEC^0x11)put(pad,8);
  var cw=[];for(var i=0;i<bits.length;i+=8){var b=0;for(var j=0;j<8;j++)b=(b<<1)|bits[i+j];cw.push(b)}
  var nb=NB[ver],eb=EPB[ver],rc=Math.floor(raw(ver)/8),ns=nb-rc%nb,sl=Math.floor(rc/nb),gen=rsGen(eb),blocks=[],k=0;
  for(var i=0;i<nb;i++){var dat=cw.slice(k,k+sl-eb+(i<ns?0:1));k+=dat.length;var ec=rsRem(dat,gen);if(i<ns)dat.push(0);blocks.push(dat.concat(ec))}
  var all=[];for(var i=0;i<blocks[0].length;i++)blocks.forEach(function(bl,j){if(i!==sl-eb||j>=ns)all.push(bl[i])});
  var size=ver*4+17,M=[],F=[];for(var y=0;y<size;y++){M.push(new Array(size).fill(false));F.push(new Array(size).fill(false))}
  function sf(x,y,d){M[y][x]=d;F[y][x]=true}
  for(var i=0;i<size;i++){sf(6,i,i%2===0);sf(i,6,i%2===0)}
  function finder(x,y){for(var dy=-4;dy<=4;dy++)for(var dx=-4;dx<=4;dx++){var d=Math.max(Math.abs(dx),Math.abs(dy)),xx=x+dx,yy=y+dy;if(xx>=0&&xx<size&&yy>=0&&yy<size)sf(xx,yy,d!==2&&d!==4)}}
  finder(3,3);finder(size-4,3);finder(3,size-4);
  var ap=[];if(ver>1){var na=Math.floor(ver/7)+2,st=ver===32?26:Math.ceil((ver*4+4)/(na*2-2))*2;ap=[6];for(var p=size-7;ap.length<na;p-=st)ap.splice(1,0,p)}
  for(var a=0;a<ap.length;a++)for(var c=0;c<ap.length;c++){if((a===0&&c===0)||(a===0&&c===ap.length-1)||(a===ap.length-1&&c===0))continue;for(var dy=-2;dy<=2;dy++)for(var dx=-2;dx<=2;dx++)sf(ap[a]+dx,ap[c]+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}
  function fmt(mask){var d=(0<<3)|mask,r=d;for(var i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);var b=((d<<10)|r)^0x5412;
    for(var i=0;i<=5;i++)sf(8,i,bit(b,i));sf(8,7,bit(b,6));sf(8,8,bit(b,7));sf(7,8,bit(b,8));for(var i=9;i<15;i++)sf(14-i,8,bit(b,i));
    for(var i=0;i<8;i++)sf(size-1-i,8,bit(b,i));for(var i=8;i<15;i++)sf(8,size-15+i,bit(b,i));sf(8,size-8,true)}
  fmt(0);
  if(ver>=7){var r=ver;for(var i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1F25);var vb=(ver<<12)|r;for(var i=0;i<18;i++){var a=size-11+i%3,b=Math.floor(i/3);sf(a,b,bit(vb,i));sf(b,a,bit(vb,i))}}
  var i=0;for(var right=size-1;right>=1;right-=2){if(right===6)right=5;for(var vert=0;vert<size;vert++)for(var j=0;j<2;j++){var x=right-j,up=((right+1)&2)===0,y=up?size-1-vert:vert;if(!F[y][x]&&i<all.length*8){M[y][x]=bit(all[i>>>3],7-(i&7));i++}}}
  function apply(m){for(var y=0;y<size;y++)for(var x=0;x<size;x++){var inv;switch(m){case 0:inv=(x+y)%2===0;break;case 1:inv=y%2===0;break;case 2:inv=x%3===0;break;case 3:inv=(x+y)%3===0;break;case 4:inv=(Math.floor(x/3)+Math.floor(y/2))%2===0;break;case 5:inv=x*y%2+x*y%3===0;break;case 6:inv=(x*y%2+x*y%3)%2===0;break;default:inv=((x+y)%2+x*y%3)%2===0}if(!F[y][x]&&inv)M[y][x]=!M[y][x]}}
  function pen(){var s=0,dark=0;
    function line(get){var run=1,prev=get(0),w=[];for(var t=1;t<size;t++){var c=get(t);if(c===prev)run++;else{if(run>=5)s+=run-2;run=1;prev=c}}if(run>=5)s+=run-2;
      var str='';for(var t=0;t<size;t++)str+=get(t)?'1':'0';var pa=['10111010000','00001011101'];pa.forEach(function(p){var at=-1;while((at=str.indexOf(p,at+1))>=0)s+=40})}
    for(var y=0;y<size;y++)line(function(t){return M[y][t]});for(var x=0;x<size;x++)line(function(t){return M[t][x]});
    for(var y=0;y<size-1;y++)for(var x=0;x<size-1;x++){var c=M[y][x];if(c===M[y][x+1]&&c===M[y+1][x]&&c===M[y+1][x+1])s+=3}
    for(var y=0;y<size;y++)for(var x=0;x<size;x++)if(M[y][x])dark++;
    var k=Math.ceil(Math.abs(dark*20-size*size*10)/(size*size))-1;s+=k*10;return s}
  var best=0,bp=1e9;for(var m=0;m<8;m++){apply(m);fmt(m);var p=pen();if(p<bp){bp=p;best=m}apply(m)}
  apply(best);fmt(best);return M}
function svg(text,px){var M=make(text),n=M.length,b=4,d='';for(var y=0;y<n;y++)for(var x=0;x<n;x++)if(M[y][x])d+='M'+(x+b)+' '+(y+b)+'h1v1h-1z';
  var t=n+b*2;return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+t+' '+t+'" width="'+(px||240)+'" height="'+(px||240)+'" shape-rendering="crispEdges" role="img" aria-label="QR Code"><rect width="'+t+'" height="'+t+'" fill="#fff"/><path d="'+d+'" fill="#000"/></svg>'}
window.LFqr={svg:svg,make:make};if(typeof module!=='undefined')module.exports={svg:svg,make:make};
})();
