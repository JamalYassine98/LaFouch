from playwright.sync_api import sync_playwright
import glob,subprocess,os
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,record_video_dir='v',record_video_size={'width':390,'height':844})
    pg=ctx.new_page();pg.goto('file:///home/claude/lafouch-projeto/work/s37/anim.html');pg.wait_for_timeout(24500);ctx.close()
f=glob.glob('v/*.webm')[0]
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f,'-ss','0.3','-vf','fps=30,scale=780:1688:flags=lanczos','-c:v','libx264','-preset','veryfast','-pix_fmt','yuv420p','S37_oculos_virtual.mp4'],check=True)
