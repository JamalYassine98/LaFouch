# servidor como o GitHub Pages: /x -> x.html se existir; senão 404.html (com status 404)
import http.server,os,sys
R=sys.argv[2];os.chdir(R)
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
    def send_head(self):
        p=self.path.split('?')[0].split('#')[0]
        f=os.path.join(R,p.lstrip('/'))
        if not os.path.exists(f) and os.path.exists(f+'.html'): self.path=p+'.html'
        elif not os.path.exists(f):
            self.send_response(404);self.send_header('Content-Type','text/html');b=open(os.path.join(R,'404.html'),'rb').read();self.send_header('Content-Length',str(len(b)));self.end_headers();
            import io;return io.BytesIO(b)
        return super().send_head()
http.server.ThreadingHTTPServer(('',int(sys.argv[1])),H).serve_forever()
