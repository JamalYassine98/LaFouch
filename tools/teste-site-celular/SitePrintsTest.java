// S422: teste do SITE no CELULAR REAL (Firebase Test Lab). O app de verdade carrega a cópia do site que o build.js põe em www/loja/
// (feita do repositório catalogo no ramo escolhido), abre cada tela de tools/teste-site-celular/telas_site.py com as PEÇAS REAIS da nuvem
// e tira o print real (screencap). Também anota, por tela, a altura da página, quantos elementos aparecem e os erros de JavaScript.
package com.lafouch.app;

import android.os.ParcelFileDescriptor;
import android.util.Log;
import android.webkit.WebStorage;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import com.getcapacitor.BridgeActivity;
import org.json.JSONArray;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

@RunWith(AndroidJUnit4.class)
public class SitePrintsTest {
  static final String T = "LFPRINT", DIR = "/sdcard/Download/lf";
  ActivityScenario<MainActivity> sc;

  static String sh(String c) {
    try {
      ParcelFileDescriptor p = InstrumentationRegistry.getInstrumentation().getUiAutomation().executeShellCommand(c);
      InputStream in = new ParcelFileDescriptor.AutoCloseInputStream(p);
      ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[8192]; int n;
      while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
      in.close(); return b.toString();
    } catch (Exception e) { return "ERR " + e; }
  }

  String js(String code) {
    AtomicReference<String> r = new AtomicReference<>("null"); CountDownLatch l = new CountDownLatch(1);
    sc.onActivity(a -> ((BridgeActivity) a).getBridge().getWebView().evaluateJavascript(code, v -> { r.set(v); l.countDown(); }));
    try { l.await(20, TimeUnit.SECONDS); } catch (InterruptedException e) { }
    return r.get();
  }

  static String unq(String s) { return s == null ? "" : s.replaceAll("^\"|\"$", ""); }

  // o site está desligado para clientes: o teste abre a PRÉVIA (loja.html?cliente=1 dentro de um quadro, como o painel do dono) e roda os passos dentro dela
  String fr(String code) { return js("(function(){try{return document.getElementById('f').contentWindow.eval(" + org.json.JSONObject.quote(code) + ")}catch(e){return 'ERR '+e}})()"); }

  @Test
  public void prints() throws Exception {
    InputStream in = InstrumentationRegistry.getInstrumentation().getContext().getAssets().open("telas_site.json");
    ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[8192]; int n;
    while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
    JSONArray telas = new JSONArray(b.toString("UTF-8"));
    sh("mkdir -p " + DIR);
    sh("pm grant com.lafouch.app android.permission.POST_NOTIFICATIONS");
    sh("pm grant com.lafouch.app android.permission.CAMERA");
    sh("cmd uimode night no"); Thread.sleep(1000);
    sc = ActivityScenario.launch(MainActivity.class); Thread.sleep(8000);
    String base = unq(js("location.origin"));
    Log.i(T, "BASE " + base);
    for (int i = 0; i < telas.length(); i++) {
      JSONArray it = telas.getJSONArray(i); String nome = it.getString(0); String rota = it.getString(1); String prep = it.getString(2); JSONArray ps = it.getJSONArray(3);
      try {
        sc.onActivity(a -> WebStorage.getInstance().deleteAllData());
        js("try{localStorage.clear();sessionStorage.clear()}catch(e){};1");
        Thread.sleep(600);
        // abre a cópia do site (sem os dados do app), espera as peças da nuvem
        final String u0 = base + "/loja/loja.html?nosw=1";
        sc.onActivity(a -> ((BridgeActivity) a).getBridge().getWebView().loadUrl(u0));
        Thread.sleep(1500);
        js("(function(){try{" + prep + "}catch(e){};return 1})()");
        final String src = "loja.html?cliente=1" + (rota.startsWith("?") ? "&" + rota.substring(1) : rota);
        final String u = base + "/loja/teste-previa.html?u=" + java.net.URLEncoder.encode(src, "UTF-8");
        sc.onActivity(a -> ((BridgeActivity) a).getBridge().getWebView().loadUrl(u));
        Thread.sleep(1500);
        for (int t = 0; t < 120 && !"true".equals(fr("!!document.querySelector('#home .hc,#grid .card,#gw,#atacado,#como')")); t++) Thread.sleep(250);
        Thread.sleep(2500);
        StringBuilder ok = new StringBuilder();
        for (int j = 0; j < ps.length(); j++) {
          ok.append(fr("(function(){try{var r=(" + ps.getString(j) + ")();return r===undefined?'ok':r}catch(e){return 'ERR '+e}})()")).append(' ');
          Thread.sleep(1600);
        }
        Thread.sleep(600);
        sh("screencap -p " + DIR + "/" + String.format("%02d", i + 1) + "-" + nome + ".png");
        String med = fr("JSON.stringify({h:document.scrollingElement.scrollHeight,vis:[...document.querySelectorAll('body *')].filter(function(e){var r=e.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight}).length,pecas:document.querySelectorAll('#home .hc,#grid .card').length,er:(window.__er||[]).slice(0,4),manut:!!document.getElementById('manut')})");
        Log.i(T, nome + " " + ok + " " + med);
      } catch (Exception e) { Log.i(T, nome + " FALHOU " + e); }
    }
    Log.i(T, "INFO " + fr("JSON.stringify({ua:navigator.userAgent,lang:navigator.language,w:innerWidth,h:innerHeight,dpr:devicePixelRatio,versao:window.LF_BUILD})"));
    sc.close();
  }
}
