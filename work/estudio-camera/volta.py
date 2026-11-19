# Conserto: câmera do Estúdio trava ao voltar do segundo plano (dono 19/11 20:33)
exec(open('cam.py').read().split("if __name__")[0])
from PIL import Image,ImageDraw,ImageFont
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
SAI="()=>{const v=document.getElementById('ecV');v.srcObject.getVideoTracks()[0].stop();Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))}"
VOLTA="()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))}"
CONSERTO=r"""()=>{const fr=()=>document.querySelector('#estCam .ecFrase span');document.addEventListener('visibilitychange',()=>{const v=document.getElementById('ecV');if(!v)return;
 if(document.hidden){(v.srcObject&&v.srcObject.getTracks()||[]).forEach(t=>t.stop());return}
 const f=fr();if(f)f.textContent='Voltando à câmera…';window.__fkDx=0;
 setTimeout(()=>navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}}).then(s=>{v.srcObject=s;v.play()}),900)})}"""
fs=[]
with sync_playwright() as pw:
  for fase in ('hoje','prop'):
    b,pg=abre(pw,844,390);cam(pg);pg.wait_for_timeout(500)
    if fase=='prop': pg.evaluate(CONSERTO)
    pg.evaluate(SAI);pg.wait_for_timeout(200);pg.evaluate("()=>window.__fkImg=null");pg.evaluate(VOLTA);pg.wait_for_timeout(300)
    f='/tmp/vt_%s_1.png'%fase;pg.screenshot(path=f);fs.append(f)
    pg.wait_for_timeout(2500);st=pg.evaluate("()=>{const v=document.getElementById('ecV');return v.srcObject.getVideoTracks()[0].readyState}")
    f='/tmp/vt_%s_2.png'%fase;pg.screenshot(path=f);fs.append(f);print(fase,'câmera depois de voltar:',st);b.close()
ims=[Image.open(f).convert('RGB') for f in fs];w,h=ims[0].size;S=Image.new('RGB',(40+2*(w+40),2*(h+130)+20),(17,20,26));d=ImageDraw.Draw(S)
T=[('HOJE · logo ao voltar','a imagem para no último quadro'),('HOJE · 3 s depois','continua parada (a câmera foi solta e ninguém reabre)'),('PROPOSTA · logo ao voltar','tela preta por ~1 s enquanto a câmera reabre'),('PROPOSTA · 1 s depois','a câmera reabre sozinha, com os mesmos ajustes')]
for k,im in enumerate(ims):
  r,c=k//2,k%2;x=40+c*(w+40);y=20+r*(h+130);d.text((x,y),T[k][0],font=F(32),fill=(235,235,240));d.text((x,y+42),T[k][1],font=F(22),fill=(140,150,165));S.paste(im,(x,y+90))
S.save('/home/claude/lafouch/work/estudio-camera/esboco_camera_volta.jpg',quality=88);print('ok')
