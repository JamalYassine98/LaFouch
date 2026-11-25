# ARGUS · setor SITE · o servidor da cópia do site, que atende como o GitHub Pages (onde o site mora): "/catalogo" serve
# catalogo.html, uma pasta serve o index.html dela, e o que não existe responde 404 com a página 404.html.
# uso: python3 servidor.py <porta>   (na pasta da cópia)
import sys, os, http.server
class Pages(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        caminho = self.translate_path(self.path)
        if not os.path.exists(caminho) and os.path.exists(caminho + '.html'): self.path = self.path.split('?')[0].split('#')[0] + '.html'
        elif not os.path.exists(caminho):
            self.send_response(404); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.end_headers()
            return open('404.html', 'rb') if os.path.exists('404.html') else None
        return super().send_head()
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(('', int(sys.argv[1])), Pages).serve_forever()
