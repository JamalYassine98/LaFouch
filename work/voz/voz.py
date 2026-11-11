from resemblyzer import VoiceEncoder,preprocess_wav
import numpy as np
_E=None
def emb(f):
    global _E
    if _E is None:_E=VoiceEncoder(verbose=False)
    return _E.embed_utterance(preprocess_wav(f))
def sim(a,b):return float(np.dot(a,b)/np.linalg.norm(a)/np.linalg.norm(b))
