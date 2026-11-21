import sys;sys.path.insert(0,'/home/claude/lafouch/work/s435/compras');exec(open('/home/claude/lafouch/work/s435/compras/hoje.py').read().split("if __name__=='__main__':")[0].replace("O='/home/claude/lafouch/work/s435/compras/'","O='/home/claude/lafouch/work/s435/selo/'"))
with sync_playwright() as pw:
  tira(pw,'h_atacado',"()=>__LF.inicioGo('ata')",3)
  tira(pw,'h_giro',"()=>{__LF.inicioGo('repo')}",5)
