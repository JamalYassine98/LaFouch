# S264e · prepara o giro do dono a 30 quadros/s (reais) e 60 quadros/s (SIMULADOS: quadros do meio criados por computador), com a mesma correção de luz do S260 (trata3).  python3 prep.py
import cv2, numpy as np, glob, os
f30 = sorted(glob.glob('/tmp/s264_f30/*.jpg')); f60 = sorted(glob.glob('/tmp/s264_f60/*.jpg'))
pilha = np.stack([cv2.imread(p) for p in f30[::5]]); k = int(len(pilha) * .92); fundo = np.partition(pilha, k, axis=0)[k].astype(np.float32); fundo = cv2.GaussianBlur(fundo, (0, 0), 1.2) + 1
nuc = np.ones((41, 41), np.uint8); fmin = cv2.erode(fundo, nuc); fmax = cv2.dilate(fundo, nuc)
for fs, pasta in ((f30, 's264_30'), (f60, 's264_60')):
    peso = 0
    for i, p in enumerate(fs):
        f = cv2.imread(p).astype(np.float32); o8 = (np.clip(f / np.clip(f, fmin, fmax) / .985, 0, 1) * 255).astype(np.uint8); o = '/tmp/kitsite/%s/p%04d.jpg' % (pasta, i)
        cv2.imwrite(o, cv2.resize(o8, (720, 480), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 80]); peso += os.path.getsize(o)
    print(pasta, len(fs), 'quadros · JPEG %.0f kB' % (peso / 1024), flush=True)
