exec(open('/home/claude/lafouch/work/s435/compras/hoje.py').read().split("if __name__=='__main__':")[0].replace("O='/home/claude/lafouch/work/s435/compras/'","O='/home/claude/lafouch/work/s435/selo/'"))
with sync_playwright() as pw:
  for k in ['loj','lot','tab']:
    tira(pw,'h_ata_'+k,["()=>__LF.inicioGo('ata')","()=>{const b=document.querySelector('#ataTabs [data-a=\"%s\"],#ataTabs [data-t=\"%s\"]')||[...document.querySelectorAll('#ataTabs button')][%d];b&&b.click()}"%(k,k,['msg','loj','lot','tab'].index(k))],2)
