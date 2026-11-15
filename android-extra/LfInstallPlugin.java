package com.lafouch.app;

// S334 (15/11/2026): instalar o APK novo de dentro do app (atualização do aplicativo sem sair procurando arquivo).
// Copiado para android/app/src/main/java/com/lafouch/app/ pelo build-apk.yml (tools/patch-android-impressora.py).
// O app (src/97-atualiza-apk.js) baixa o APK para o cache (pasta apk/) e chama instalar(): aqui só abrimos o instalador do Android,
// que sempre pede a confirmação do dono. Só funciona por cima quando o APK tem a mesma assinatura (chave fixa do build-apk.yml).

import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name = "LfInstall")
public class LfInstallPlugin extends Plugin {

    // O Android já deixa este app instalar APK? (se não, o próprio instalador leva à tela de permissão)
    @PluginMethod
    public void pode(PluginCall call) {
        boolean ok = true;
        try {
            if (Build.VERSION.SDK_INT >= 26) ok = getContext().getPackageManager().canRequestPackageInstalls();
        } catch (Exception e) {
            ok = false;
        }
        JSObject r = new JSObject();
        r.put("pode", ok);
        call.resolve(r);
    }

    // Abre o instalador do Android com o arquivo cache/apk/<nome>.
    @PluginMethod
    public void instalar(PluginCall call) {
        String nome = call.getString("nome", "");
        if (nome == null || !nome.matches("[A-Za-z0-9._-]+\\.apk")) {
            call.reject("nome inválido");
            return;
        }
        try {
            File f = new File(new File(getContext().getCacheDir(), "apk"), nome);
            if (!f.exists() || f.length() < 1000000) {
                call.reject("arquivo não encontrado");
                return;
            }
            Uri u = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", f);
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setDataAndType(u, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
            JSObject r = new JSObject();
            r.put("ok", true);
            call.resolve(r);
        } catch (Exception e) {
            call.reject("não abriu o instalador: " + e.getMessage());
        }
    }
}
