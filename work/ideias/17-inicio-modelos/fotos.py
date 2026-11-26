"""Fotos do dono em data-URL para os inject.js do kit (sem rede)."""
import base64, io, os
from PIL import Image
AQ = os.path.dirname(os.path.abspath(__file__))
def b64(p, w=900):
    im = Image.open(os.path.join(AQ, p)).convert('RGB'); im.thumbnail((w, 3000)); b = io.BytesIO(); im.save(b, 'JPEG', quality=84)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
CAFE, ESTU = b64('semp-cafe-campanha.jpg'), b64('semp-estudio-vitrine.jpg')
