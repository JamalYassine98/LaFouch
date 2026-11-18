// S421: teste no CELULAR REAL (Firebase Test Lab). Abre cada tela de tools/teste-android/telas.py
// dentro do app de verdade, no modo #test (dados falsos, sem nuvem), e tira o print real (screencap).
package com.lafouch.app;

import android.os.ParcelFileDescriptor;
import android.util.Log;
import android.webkit.WebStorage;
import android.webkit.WebView;
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
public class PrintsTest {
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

  @Test
  public void prints() throws Exception {
    InputStream in = InstrumentationRegistry.getInstrumentation().getContext().getAssets().open("telas.json");
    ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[8192]; int n;
    while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
    JSONArray telas = new JSONArray(b.toString("UTF-8"));
    String temas = InstrumentationRegistry.getArguments().getString("temas", "claro,escuro");
    sh("mkdir -p " + DIR);
    sh("pm grant com.lafouch.app android.permission.POST_NOTIFICATIONS");
    for (String tema : temas.split("[,;]")) {
      sh("cmd uimode night " + (tema.equals("escuro") ? "yes" : "no")); Thread.sleep(1500);
      sc = ActivityScenario.launch(MainActivity.class); Thread.sleep(8000);
      String base = unq(js("location.href.split('#')[0].split('?')[0]"));
      Log.i(T, "BASE " + base);
      for (int i = 0; i < telas.length(); i++) {
        JSONArray it = telas.getJSONArray(i); String nome = it.getString(0); JSONArray ps = it.getJSONArray(1);
        try {
          sc.onActivity(a -> WebStorage.getInstance().deleteAllData());
          js("try{localStorage.clear();sessionStorage.clear();sessionStorage.setItem('lf_ni','1');indexedDB.databases&&indexedDB.databases().then(d=>d.forEach(x=>indexedDB.deleteDatabase(x.name)))}catch(e){};1");
          Thread.sleep(800);
          final String u = base + "?r=" + (i + 1) + tema.charAt(0) + "#test";
          sc.onActivity(a -> ((BridgeActivity) a).getBridge().getWebView().loadUrl(u));
          Thread.sleep(2000);
          for (int t = 0; t < 100 && !"true".equals(js("!!window.__LF")); t++) Thread.sleep(250);
          Thread.sleep(1500);
          StringBuilder ok = new StringBuilder();
          for (int j = 0; j < ps.length(); j++) {
            ok.append(js("(function(){try{var r=(" + ps.getString(j) + ")();return r===undefined?'ok':r}catch(e){return 'ERR '+e}})()")).append(' ');
            Thread.sleep(1300);
          }
          Thread.sleep(500);
          sh("screencap -p " + DIR + "/" + tema + "-" + nome + ".png");
          Log.i(T, tema + " " + nome + " " + ok);
        } catch (Exception e) { Log.i(T, tema + " " + nome + " FALHOU " + e); }
      }
      Log.i(T, "INFO " + js("JSON.stringify({ua:navigator.userAgent,data:new Date(2026,10,17).toLocaleDateString(),lang:navigator.language,w:innerWidth,h:innerHeight,dpr:devicePixelRatio,escuro:matchMedia('(prefers-color-scheme: dark)').matches})"));
      sc.close();
    }
  }
}
