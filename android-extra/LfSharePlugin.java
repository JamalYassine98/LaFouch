package com.lafouch.app;

// Compartilhar direto num app (WhatsApp Business, WhatsApp, Instagram) com imagens e texto.
// Copiado para android/app/src/main/java/com/lafouch/app/ pelo build-apk.yml (tools/patch-android-impressora.py).
// O app (src/97-compartilhar.js) manda as imagens em base64; aqui gravamos no cache e abrimos o app escolhido.

import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Base64;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;

@CapacitorPlugin(name = "LfShare")
public class LfSharePlugin extends Plugin {

    private static final String[] CONHECIDOS = { "com.whatsapp.w4b", "com.whatsapp", "com.instagram.android" };

    // Quais desses apps estão instalados.
    @PluginMethod
    public void apps(PluginCall call) {
        PackageManager pm = getContext().getPackageManager();
        JSArray a = new JSArray();
        for (String p : CONHECIDOS) {
            try {
                pm.getPackageInfo(p, 0);
                a.put(p);
            } catch (Exception e) {
                // não instalado
            }
        }
        JSObject r = new JSObject();
        r.put("apps", a);
        call.resolve(r);
    }

    // Envia texto e imagens (JPEG em base64) para um app (pkg) ou para a lista do celular (sem pkg).
    @PluginMethod
    public void send(PluginCall call) {
        String pkg = call.getString("pkg", "");
        String text = call.getString("text", "");
        JSArray files = call.getArray("files", new JSArray());
        try {
            ArrayList<Uri> uris = new ArrayList<>();
            File dir = new File(getContext().getCacheDir(), "lfshare");
            if (!dir.exists()) dir.mkdirs();
            File[] velhos = dir.listFiles();
            if (velhos != null) for (File v : velhos) if (System.currentTimeMillis() - v.lastModified() > 3600000L) v.delete();
            for (int i = 0; i < files.length(); i++) {
                byte[] b = Base64.decode(files.getString(i), Base64.DEFAULT);
                File f = new File(dir, "lafouch_" + System.currentTimeMillis() + "_" + i + ".jpg");
                FileOutputStream o = new FileOutputStream(f);
                o.write(b);
                o.close();
                uris.add(FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f));
            }
            Intent it;
            if (uris.size() > 1) {
                it = new Intent(Intent.ACTION_SEND_MULTIPLE);
                it.putParcelableArrayListExtra(Intent.EXTRA_STREAM, uris);
                it.setType("image/jpeg");
            } else if (uris.size() == 1) {
                it = new Intent(Intent.ACTION_SEND);
                it.putExtra(Intent.EXTRA_STREAM, uris.get(0));
                it.setType("image/jpeg");
            } else {
                it = new Intent(Intent.ACTION_SEND);
                it.setType("text/plain");
            }
            if (text != null && text.length() > 0) it.putExtra(Intent.EXTRA_TEXT, text);
            it.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent abrir;
            if (pkg != null && pkg.length() > 0) {
                it.setPackage(pkg);
                abrir = it;
            } else {
                abrir = Intent.createChooser(it, null);
            }
            abrir.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(abrir);
            call.resolve();
        } catch (Exception e) {
            call.reject(e.getMessage() == null ? "erro" : e.getMessage());
        }
    }
}
