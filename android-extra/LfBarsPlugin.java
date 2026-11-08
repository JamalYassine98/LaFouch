package com.lafouch.app;

// v464 (07/11): barras do Android (status em cima e navegação embaixo) na cor do tema do app.
// O app chama LfBars.set({ cor: '#0f1216', escuro: true }) sempre que o tema muda (src/97-tema.js).

import android.graphics.Color;
import android.os.Build;
import android.view.Window;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LfBars")
public class LfBarsPlugin extends Plugin {
    @PluginMethod
    public void set(final PluginCall call) {
        final String cor = call.getString("cor", "#0f1216");
        final boolean escuro = Boolean.TRUE.equals(call.getBoolean("escuro", true));
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    Window w = getActivity().getWindow();
                    int c = Color.parseColor(cor);
                    w.setStatusBarColor(c);
                    w.setNavigationBarColor(c);
                    if (Build.VERSION.SDK_INT >= 28) w.setNavigationBarDividerColor(c);
                    WindowInsetsControllerCompat ic = WindowCompat.getInsetsController(w, w.getDecorView());
                    // ícones claros no tema escuro, escuros no tema claro
                    ic.setAppearanceLightStatusBars(!escuro);
                    ic.setAppearanceLightNavigationBars(!escuro);
                    call.resolve();
                } catch (Exception e) {
                    call.reject(e.getMessage());
                }
            }
        });
    }
}
