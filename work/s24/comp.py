from PIL import Image, ImageDraw, ImageFont
import sys,json
def F(s,b=True):
    for f in (['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'] if b else ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']):
        try: return ImageFont.truetype(f,s)
        except: pass
    return ImageFont.load_default()
def comp(title,panels,out,note=''):
    # panels: [(file,(x0,y0,x1,y1) or None,label)]
    ims=[]
    for f,box,lab in panels:
        im=Image.open(f).convert('RGB')
        if box: im=im.crop(box)
        ims.append((im,lab))
    W=sum(i.width for i,_ in ims)+40*(len(ims)+1); H=max(i.height for i,_ in ims)+200+(70 if note else 0)
    c=Image.new('RGB',(W,H),'#efe9ee'); d=ImageDraw.Draw(c)
    d.text((40,30),title,fill='#3a1f36',font=F(40))
    x=40
    for im,lab in ims:
        d.text((x,100),lab,fill='#7b2d6b',font=F(30)); c.paste(im,(x,150)); d.rectangle([x-1,149,x+im.width,150+im.height],outline='#cbbcc8',width=2); x+=im.width+40
    if note: d.text((40,H-70),note,fill='#444',font=F(26,False))
    c.save(out)
if __name__=='__main__':
    a=json.loads(sys.argv[1]); comp(a['t'],[tuple(x) for x in a['p']],a['o'],a.get('n',''))
