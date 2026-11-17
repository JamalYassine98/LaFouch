# folhas do inventário: uma imagem por tipo, cada variação com recorte + onde aparece
import json,os,textwrap
from PIL import Image,ImageDraw,ImageFont
R=json.load(open('/tmp/inv/inv.json'));OUT='/home/claude/lafouch/work/s374/'
F=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',s)
FB=lambda s:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',s)
ORD=['bloco que abre','linha/link com ›','cartão','título de seção','número','aba','opção','botão','botão de ícone']
for i,t in enumerate(ORD):
    d0=R.get(t,{});d={}
    for k,v in d0.items():
        k2='|'.join(k.split('|')[:8]);x=d.setdefault(k2,{'n':0,'telas':[],'ex':[]});x['n']+=v['n'];x['telas']+= [q for q in v['telas'] if q not in x['telas']]
        if not x['ex'] and v['ex'] and v['ex'][0].get('img'): x['ex']=v['ex']
    vs=sorted(d.items(),key=lambda kv:-kv[1]['n'])
    W=1600;cells=[]
    for k,v in vs:
        ex=v['ex'][0] if v['ex'] else None
        im=Image.open(ex['img']).convert('RGB') if ex and ex.get('img') and os.path.exists(ex['img']) else Image.new('RGB',(200,60),'#ddd')
        if im.width>600: im=im.resize((600,int(im.height*600/im.width)))
        if im.height>170: im=im.crop((0,0,im.width,170))
        cells.append((k,v,im))
    y=110;rows=[]
    for k,v,im in cells:
        h=max(im.height,120)+30;rows.append((y,k,v,im,h));y+=h
    img=Image.new('RGB',(W,y+30),'#f2eff1');dr=ImageDraw.Draw(img)
    dr.text((40,30),'Inventário · %s · %d jeitos diferentes hoje'%(t,len(cells)),fill='#1d151a',font=FB(34))
    for y0,k,v,im,h in rows:
        img.paste(im,(40,y0));p=k.split('|')
        desc='%s · %s · %s · altura %s · letra %s %s %s'%(p[1],p[2],p[3],p[4].replace('h',' px'),p[5],'negrito' if int(p[6])>=600 else 'normal',p[7])
        dr.text((680,y0),'%d× · %s'%(v['n'],desc),fill='#1d151a',font=FB(20))
        tl=', '.join(v['telas']);ty=y0+32
        for ln in textwrap.wrap('Onde: '+tl,74)[:4]: dr.text((680,ty),ln,fill='#555',font=F(19));ty+=26
        dr.line((40,y0+h-14,W-40,y0+h-14),fill='#ddd',width=1)
    fn=OUT+'inv%d-%s.jpg'%(i+1,t.replace('/','-').replace(' ','-').replace('›','seta'))
    img.save(fn,quality=88);print(fn,img.size)
